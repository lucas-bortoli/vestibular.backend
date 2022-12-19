import getDatabase from "../Database.js";
import Usuario from "../model/Usuario.js";

export class UsuarioDAO {
  /**
   * Retorna um usuário pelo seu username, ou null se não encontrado.
   * @returns O usuário, se existir, ou `null`.
   */
  async getByUsername(username: string): Promise<Usuario | null> {
    const db = getDatabase();

    const stmt = await db.prepare(`SELECT * FROM usuario WHERE username = ?`, [username]);
    const row = await stmt.get();

    if (row) {
      return {
        id: row.id,
        nome: row.nome,
        roles: row.roles.split(","),
        username: row.username,
        hash_senha: row.hash_senha,
        senha_salt: row.senha_salt,
      };
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
