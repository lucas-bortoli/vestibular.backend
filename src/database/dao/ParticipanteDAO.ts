import getDatabase from "../Database.js";
import Participante from "../model/Participante.js";

export class ParticipanteDAO {
  /**
   * Retorna um participante pelo seu id, ou null se não encontrado.
   * @param id Id do participante
   * @returns O participante, ou `null`.
   */
  async getById(id: number): Promise<Participante | null> {
    const db = getDatabase();

    const stmt = await db.prepare(`SELECT * FROM participante WHERE id = ?`, [id]);
    const row = await stmt.get();

    if (row) {
      return {
        id: row.id,
        nome: row.nome,
        cpf: row.cpf,
        dataNascimento: row.dataNascimento,
        email: row.email,
        provaOnline: row.provaOnline,
        telefone: row.telefone,
        cursoId: row.cursoId,
      };
    } else {
      return null;
    }
  }

  /**
   * Insere um participante no banco
   * @param participante O participante a ser inserido, sem seu campo id (é autopreenchido)
   * @returns O id do participante inserido.
   */
  async insert(participante: Omit<Participante, "id">): Promise<number> {
    const db = getDatabase();
    const stmt = await db.prepare(
      `INSERT INTO participante
         (nome, email, telefone, cpf, dataNascimento, provaOnline, cursoId)
       VALUES
         (?, ?, ?, ?, ?, ?, ?);
         
        SELECT last_insert_rowid() as 'id';`,
      [
        participante.nome,
        participante.email,
        participante.telefone,
        participante.cpf,
        participante.dataNascimento,
        participante.provaOnline,
        participante.cursoId,
      ]
    );

    await stmt.run();

    return (await db.get("SELECT last_insert_rowid() as 'id';")).id;
  }
}
