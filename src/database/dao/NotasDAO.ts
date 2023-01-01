import assert from "node:assert";
import getDatabase from "../Database.js";
import NotasModel from "../model/NotasModel.js";

export class NotasDAO {
  /**
   * Converte uma linha de uma query "SELECT *" para um model de NotasModel.
   */
  private rowToModel(row: any): NotasModel {
    assert(typeof row.participanteId === "number");
    assert(typeof row.notas === "string");

    // Divide a lista de notas separada por pontos e vírgula, removendo NaNs.
    const notas = (row.notas as string)
      .split(";")
      .map((v: string) => parseInt(v))
      .map((v: number) => (isNaN(v) ? 0 : v));

    return {
      participanteId: row.participanteId,
      notas,
    };
  }

  /**
   * Retorna a nota de um participante específico, ou null se não encontrado.
   * @param participanteId Id do participante
   * @returns As notas do participante, ou `null`
   */
  async getById(participanteId: number): Promise<NotasModel | null> {
    const db = getDatabase();

    const stmt = await db.prepare(`SELECT * FROM notas WHERE participanteId = ?`, [participanteId]);
    const row = await stmt.get();

    return row ? this.rowToModel(row) : null;
  }

  /**
   * Retorna todas as notas lançadas no sistema.
   */
  async getAll(): Promise<NotasModel[]> {
    const stmt = await getDatabase().prepare(`SELECT * FROM notas`);
    const rows = await stmt.all();

    return rows.map((row) => this.rowToModel(row));
  }

  /**
   * Atualiza ou insere as notas de um participante.
   * @param participanteId O id do participante
   * @param notas Notas do participante
   */
  async setNotas(participanteId: number, notas: number[]): Promise<void> {
    const notasText = notas.map((v) => (isNaN(v) ? 0 : v)).join(";");

    const db = getDatabase();
    const stmt = await db.prepare(
      `INSERT INTO notas (participanteId, notas)
       VALUES (?, ?)
       ON CONFLICT (participanteId) DO
         UPDATE SET notas = ?;`,
      [participanteId, notasText, notasText]
    );

    await stmt.run();
  }
}
