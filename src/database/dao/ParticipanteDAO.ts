import assert from "node:assert";
import getDatabase from "../Database.js";
import Participante from "../model/Participante.js";

export class ParticipanteDAO {
  /**
   * Converte uma linha de uma query "SELECT *" para um model de Participante.
   */
  private rowToModel(row: any): Participante {
    assert(typeof row.id === "number");
    assert(typeof row.nome === "string");
    assert(typeof row.cpf === "string");
    assert(typeof row.dataNascimento === "string");
    assert(typeof row.email === "string");
    assert(typeof row.provaOnline === "number");
    assert(typeof row.telefone === "string");
    assert(typeof row.cursoId === "number");

    return {
      id: row.id,
      nome: row.nome,
      cpf: row.cpf,
      dataNascimento: row.dataNascimento,
      email: row.email,
      provaOnline: row.provaOnline !== 0,
      telefone: row.telefone,
      cursoId: row.cursoId,
    };
  }

  /**
   * Retorna um participante pelo seu id, ou null se não encontrado.
   * @param id Id do participante
   * @returns O participante, ou `null`.
   */
  async getById(id: number): Promise<Participante | null> {
    const db = getDatabase();

    const stmt = await db.prepare(`SELECT * FROM participante WHERE id = ?`, [id]);
    const row = await stmt.get();

    return row ? this.rowToModel(row) : null;
  }

  /**
   * Retorna um participante pelo seu cpf e data de nascimento.
   * @param birth deve estar em formato YYYY-MM-DD
   */
  async getByCpfAndBirthDate(cpf: string, birth: string): Promise<Participante | null> {
    // Remover caracteres não numéricos
    cpf = cpf.replace(/[^\d]/g, "");

    const stmt = await getDatabase().prepare(
      `SELECT * FROM participante WHERE cpf = ? and dataNascimento = ?`,
      [cpf, birth]
    );

    const row = await stmt.get();

    return row ? this.rowToModel(row) : null;
  }

  /**
   * Retorna todos os objetos cadastrados na tabela.
   */
  async getAll(): Promise<Participante[]> {
    const stmt = await getDatabase().prepare(`SELECT * FROM participante`);
    const rows = await stmt.all();

    return rows.map((row) => this.rowToModel(row));
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
