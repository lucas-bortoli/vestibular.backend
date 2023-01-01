import assert from "node:assert";
import getDatabase from "../Database.js";
import { RedacaoModel } from "../model/RedacaoModel.js";

export class RedacaoDAO {
  /**
   * Converte uma linha de uma query "SELECT *" para um model de Redacao.
   */
  private rowToModel(row: any): RedacaoModel {
    assert(typeof row.participanteId === "number");
    assert(typeof row.corpo === "string");
    assert(typeof row.inicioTimestamp === "number");
    assert(typeof row.fimTimestamp === "number");
    assert(typeof row.concluido === "number");

    return {
      participanteId: row.participanteId,
      corpo: row.corpo,
      inicioTimestamp: row.inicioTimestamp,
      fimTimestamp: row.fimTimestamp,
      concluido: row.concluido !== 0,
    };
  }

  /**
   * Retorna a redação de um participante específico, ou null se não encontrado.
   * @param participanteId Id do participante
   * @returns A redação do participante, ou `null`
   */
  async getByParticipanteId(participanteId: number): Promise<RedacaoModel | null> {
    const db = getDatabase();

    const stmt = await db.prepare(`SELECT * FROM redacoes WHERE participanteId = ?`, [
      participanteId,
    ]);
    const row = await stmt.get();

    return row ? this.rowToModel(row) : null;
  }

  /**
   * Retorna todas as redações lançadas no sistema.
   */
  async getAll(): Promise<RedacaoModel[]> {
    const stmt = await getDatabase().prepare(`SELECT * FROM redacoes`);
    const rows = await stmt.all();

    return rows.map((row) => this.rowToModel(row));
  }

  /**
   * Insere uma redação no sistema
   * @param redacao A redação a ser inserida
   */
  async insertOrUpdate(redacao: RedacaoModel): Promise<RedacaoModel> {
    const stmt = await getDatabase().prepare(
      `INSERT INTO redacoes (participanteId, corpo, inicioTimestamp, fimTimestamp, concluido)
       VALUES (?, ?, ?, ?, ?)
       ON CONFLICT REPLACE`,
      [
        redacao.participanteId,
        redacao.corpo,
        redacao.inicioTimestamp,
        redacao.fimTimestamp,
        redacao.concluido,
      ]
    );

    await stmt.run();

    return (await this.getByParticipanteId(redacao.participanteId)) as RedacaoModel;
  }
}
