import { BadRequestError, Body, JsonController, Post, UseBefore } from "routing-controllers";
import Participante, { ParticipanteSchema } from "../database/model/ParticipanteModel.js";
import { ParticipanteDAO } from "../database/dao/ParticipanteDAO.js";
import { LoggerMiddleware } from "../middleware/LoggerMiddleware.js";
import assert from "node:assert";
import { Mail } from "../mail.js";
import logger from "../logger.js";

interface ParticipanteLoginRequestBody {
  cpf: string;
  birthDate: string;
}

@JsonController("/participante")
@UseBefore(LoggerMiddleware)
export class ParticipanteController {
  /**
   * Endpoint de cadastro de participantes.
   */
  @Post("/register")
  public async register(@Body() participante: Omit<Participante, "id">) {
    const { value, error } = ParticipanteSchema.validate(participante);

    if (error) {
      throw new BadRequestError(error.message);
    }

    const pDAO = new ParticipanteDAO();

    const id = await pDAO.insert(value);

    // Retornar a interface Participantes
    const dbParticipante = await pDAO.getById(id);

    // Enviar e-mail de confirmação assíncronamente
    const sentMail = new Mail().sendRegisterMail(participante.email, { name: participante.nome });

    sentMail.catch((error) => {
      logger.error("Erro ao enviar e-mail", error);
    });

    return dbParticipante;
  }

  /**
   * Endpoint de login do participante. Retorna as informações dele.
   */
  @Post("/login")
  public async login(@Body() body: ParticipanteLoginRequestBody) {
    assert(typeof body.cpf === "string");
    assert(typeof body.birthDate === "string");

    const pDAO = new ParticipanteDAO();
    const participante = await pDAO.getByCpfAndBirthDate(body.cpf, body.birthDate);

    assert(participante !== null, "Dados inválidos");

    return participante;
  }
}
