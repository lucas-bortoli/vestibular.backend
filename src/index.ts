// Biblioteca necessária para os @Decorators funcionarem
import "reflect-metadata";

import { Action, createExpressServer } from "routing-controllers";
import { static as expressStatic } from "express";

// Controllers
import { ParticipanteController } from "./controller/ParticipanteController.js";
import { RestritoController } from "./controller/RestritoController.js";

import logger from "./logger.js";
import { init as dbInit } from "./database/Database.js";
import getAuthorizationManager from "./auth/AuthorizationManager.js";

const app = createExpressServer({
  routePrefix: "/api",
  controllers: [ParticipanteController, RestritoController],
  authorizationChecker: async (action: Action, roles: string[]) => {
    const token = action.request.headers["authorization"];

    if (token) {
      logger.info("Tentou acessar endpoint protegido com token", token);

      const authManager = getAuthorizationManager();
      const user = authManager.getAuthenticatedUserByToken(token);

      logger.info("Usuário do token:", user);

      if (user === null) {
        // Usuário não está autenticado.
        return false;
      }

      // Verificar roles requisitados
      for (const role of roles) {
        // Se o usuário não tem um dos roles exigidos pelo endpoint, rejeitar.
        //@ts-expect-error
        if (!user.roles.includes(role)) {
          return false;
        }
      }

      // Se chegamos aqui, o usuário está logado e tem as permissões necessárias para
      // acessar o endpoint.
      return true;
    }

    return false;
  },
});

dbInit().then(() => {
  app.use(expressStatic("public"));
  app.listen(8000);

  logger.info(`Servidor iniciado na porta :8000`);
});
