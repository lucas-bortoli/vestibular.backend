import path from "node:path";
import assert from "node:assert";

import sqlite3 from "sqlite3";
import { open, Database } from "sqlite";
import logger from "../logger.js";

/**
 * O banco de dados da aplicação.
 */
var $db: Database | null = null;

/**
 * Inicializa o banco de dados, formando as migrações apropriadas.
 */
export const init = async (): Promise<Database> => {
  logger.info("Inicializando banco de dados...");

  $db = await open({
    filename: "/data/db.sqlite",
    driver: sqlite3.Database,
  });

  logger.info("Iniciando migrações...");

  /**
   * Executar as migrações, escritas em SQL, no diretório ./database/migrations/,
   * em ordem sequencial.
   */
  await $db.migrate({
    migrationsPath: path.join(process.cwd(), "build/database/migrations/"),
  });

  logger.info("Banco de dados migrado!");

  return $db;
};

/**
 * Retorna a instância atual do banco de dados.
 * O banco deve estar inicializado antes (ver método `init()` deste mesmo módulo)
 */
const getDatabase = (): Database => {
  assert($db !== null);

  return $db;
};

export default getDatabase;
