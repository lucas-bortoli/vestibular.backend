import { Body, JsonController, Post } from "routing-controllers";
import Participante from "./database/model/Participante.js";

@JsonController("/participante")
export class ParticipanteController {
  @Post("/register")
  public register(@Body() participante: Omit<Participante, "id">) {}
}
