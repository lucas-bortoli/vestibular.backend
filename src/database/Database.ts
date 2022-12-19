import path from "node:path";

import sqlite3 from "sqlite3";
import { open, Database } from "sqlite";
import logger from "../logger.js";

var $db: Database | null = null;

export const init = async () => {
  logger.info("Inicializando banco de dados...");

  $db = await open({
    filename: "/data/db.sqlite",
    driver: sqlite3.Database,
  });

  logger.info("Iniciando migrações...");

  await $db.migrate({
    migrationsPath: path.join(process.cwd(), "build/database/migrations/"),
  });

  logger.info("Banco de dados migrado!");
};

export default $db;
