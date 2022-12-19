// Biblioteca necessária para os @Decorators funcionarem
import "reflect-metadata";

import { createExpressServer } from "routing-controllers";
import logger from "./logger.js";

// Controllers
import { ParticipanteController } from "./controller/ParticipanteController.js";

// Inicializar banco de dados
import { init as dbInit } from "./database/Database.js";

const app = createExpressServer({
  routePrefix: "/api",
  controllers: [ParticipanteController],
});

dbInit().then(() => {
  app.listen(8000);

  logger.info(`Servidor iniciado na porta :8000`);
});
