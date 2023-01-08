import getDatabase from "../Database.js";
import { AttachmentModel, AttachmentOpaqueModel } from "../model/AttachmentModel.js";

export class AttachmentsDAO {
  /**
   * Lê os dados de um arquivo dentro do banco de dados. Esse método não retorna o conteúdo
   * do arquivo em si.
   */
  async readOpaque(id: string): Promise<AttachmentOpaqueModel | null> {
    const stmt = await getDatabase().prepare(
      "SELECT id, nome, tamanho, mime, modificado FROM attachments WHERE id = ?"
    );

    const row = await stmt.get([id]);

    if (!row) {
      return null;
    }

    return {
      id: row.id,
      nome: row.nome,
      mime: row.mime,
      modificado: row.modificado,
      tamanho: row.tamanho,
    };
  }

  async readFile(id: string): Promise<AttachmentModel | null> {
    const stmt = await getDatabase().prepare(
      "SELECT id, nome, dados, tamanho, mime, modificado FROM attachments WHERE id = ?"
    );

    const row = await stmt.get([id]);

    if (!row) {
      return null;
    }

    return {
      id: row.id,
      nome: row.nome,
      dados: row.dados,
      mime: row.mime,
      modificado: row.modificado,
      tamanho: row.tamanho,
    };
  }

  /**
   * Escreve um arquivo no banco de dados. Se já existir, substitui.
   */
  async write(attachment: AttachmentModel) {
    const stmt = await getDatabase().prepare(
      `INSERT OR REPLACE INTO attachments 
        (id, nome, dados, tamanho, mime, modificado)
      VALUES
        (?, ?, ?, ?, ?, ?);`
    );

    await stmt.run([
      attachment.id,
      attachment.nome,
      attachment.dados,
      attachment.tamanho,
      attachment.mime,
      attachment.modificado,
    ]);
  }
}
