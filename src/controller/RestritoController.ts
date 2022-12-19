import {
  Authorized,
  Body,
  JsonController,
  Post,
  UnauthorizedError,
  UseBefore,
} from "routing-controllers";
import getAuthorizationManager from "../auth/AuthorizationManager.js";

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

    const user = await getAuthorizationManager().authenticateUser(username, password);

    if (user === null) {
      throw new UnauthorizedError("Usuário ou senha inválidos.");
    }

    return user;
  }

  @Post("/test")
  @Authorized()
  async test() {
    return { ok: true };
  }
}
