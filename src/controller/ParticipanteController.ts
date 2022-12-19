import { BadRequestError, Body, JsonController, Post, UseBefore } from "routing-controllers";
import Participante, { ParticipanteSchema } from "../database/model/Participante.js";
import { ParticipanteDAO } from "../database/dao/ParticipanteDAO.js";
import { LoggerMiddleware } from "../middleware/LoggerMiddleware.js";

@JsonController("/participante")
@UseBefore(LoggerMiddleware)
export class ParticipanteController {
  /**
   * Endpoint de cadastro de participantes.
   * @param participante
   * @returns
   */
  @Post("/register")
  public async register(@Body() participante: Omit<Participante, "id">) {
    const { error } = ParticipanteSchema.validate(participante);

    if (error) {
      throw new BadRequestError(error.message);
    }

    const pDAO = new ParticipanteDAO();

    const id = await pDAO.insert(participante);

    // Retornar a interface Participantes
    return await pDAO.getById(id);
  }
}
