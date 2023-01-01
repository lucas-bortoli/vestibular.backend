import assert from "node:assert";

import getDatabase from "../Database.js";
import Usuario from "../model/UsuarioModel.js";

export class UsuarioDAO {
  /**
   * Converte uma linha de uma query "SELECT *" para um model de Usuario.
   */
  private rowToModel(row: any): Usuario {
    console.log(row);
    assert(typeof row.id === "number");
    assert(typeof row.nome === "string");
    assert(typeof row.roles === "string");
    assert(typeof row.username === "string");
    assert(typeof row.hash_senha === "string");
    assert(typeof row.senha_salt === "string");

    return {
      id: row.id,
      nome: row.nome,
      roles: row.roles.split(","),
      username: row.username,
      hash_senha: row.hash_senha,
      senha_salt: row.senha_salt,
    };
  }

  /**
   * Retorna um usuário pelo seu id, ou null se não encontrado.
   * @returns O usuário, se existir, ou `null`.
   */
  async getById(id: number): Promise<Usuario | null> {
    const db = getDatabase();

    const stmt = await db.prepare(`SELECT * FROM usuario WHERE id = ?`, [id]);
    const row = await stmt.get();

    if (row) {
      return this.rowToModel(row);
    } else {
      return null;
    }
  }

  /**
   * Retorna um usuário pelo seu username, ou null se não encontrado.
   * @returns O usuário, se existir, ou `null`.
   */
  async getByUsername(username: string): Promise<Usuario | null> {
    const db = getDatabase();

    const stmt = await db.prepare(`SELECT * FROM usuario WHERE username = ?`, [username]);
    const row = await stmt.get();

    if (row) {
      return this.rowToModel(row);
    } else {
      return null;
    }
  }

  /**
   * Insere um usuário no banco
   * @param participante O usuário a ser inserido, sem seu campo id (é autopreenchido)
   * @returns O id do usuário inserido.
   */
  async insert(user: Omit<Usuario, "id">): Promise<number> {
    const db = getDatabase();

    const stmt = await db.prepare(
      `INSERT INTO usuario
         (nome, roles, username, hash_senha, senha_salt)
       VALUES
         (?, ?, ?, ?, ?);
         
        SELECT last_insert_rowid() as 'id';`,
      [user.nome, user.roles.join(","), user.username, user.hash_senha, user.senha_salt]
    );

    await stmt.run();

    return (await db.get("SELECT last_insert_rowid() as 'id';")).id;
  }
}
