import {
  Authorized,
  Body,
  Get,
  JsonController,
  Post,
  UnauthorizedError,
  UseBefore,
} from "routing-controllers";
import getAuthorizationManager from "../auth/AuthorizationManager.js";
import { ParticipanteDAO } from "../database/dao/ParticipanteDAO.js";
import { UsuarioDAO } from "../database/dao/UsuarioDAO.js";
import Usuario from "../database/model/Usuario.js";

import { LoggerMiddleware } from "../middleware/LoggerMiddleware.js";

interface LoginRequestBody {
  username?: unknown;
  password?: unknown;
}

@JsonController("/restrito")
@UseBefore(LoggerMiddleware)
export class RestritoController {
  @Post("/login")
  async login(@Body() body: LoginRequestBody) {
    const username = "" + body.username;
    const password = "" + body.password;

    const userAuthInfo = await getAuthorizationManager().authenticateUser(username, password);

    if (userAuthInfo === null) {
      throw new UnauthorizedError("Usuário ou senha inválidos.");
    }

    const user = (await new UsuarioDAO().getById(userAuthInfo.userId)) as Usuario;

    return {
      user: Object.assign({}, user, {
        hash_senha: undefined,
        senha_salt: undefined,
      }),
      ...userAuthInfo,
    };
  }

  @Get("/participantes")
  @Authorized()
  async listarParticipantes() {
    const pDAO = new ParticipanteDAO();
    const participantes = await pDAO.getAll();

    return participantes;
  }
}
