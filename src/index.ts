// Biblioteca necessária para os @Decorators funcionarem
import "reflect-metadata";

import { Action, createExpressServer } from "routing-controllers";
import logger from "./logger.js";

// Controllers
import { ParticipanteController } from "./controller/ParticipanteController.js";
import { RestritoController } from "./controller/RestritoController.js";

// Inicializar banco de dados
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

      logger.info(user);

      if (user === null) {
        // Usuário não está autenticado.
        return false;
      }

      logger.info(roles);

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
  app.listen(8000);

  logger.info(`Servidor iniciado na porta :8000`);
});
