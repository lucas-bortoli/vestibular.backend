import { BadRequestError, Body, JsonController, Post, UseBefore } from "routing-controllers";
import Participante, { ParticipanteSchema } from "../database/model/Participante.js";
import { ParticipanteDAO } from "../database/dao/ParticipanteDAO.js";
import { LoggerMiddleware } from "../middleware/LoggerMiddleware.js";
import assert from "node:assert";

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
    return await pDAO.getById(id);
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
