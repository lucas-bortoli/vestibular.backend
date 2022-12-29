import getDatabase from "../Database.js";
import { Config } from "../model/Config.js";

export class ConfigDAO {
  /**
   * Recebe as configurações da aplicação
   */
  async getConfig(): Promise<Config> {
    const stmt = await getDatabase().prepare("SELECT * FROM config ORDER BY id DESC LIMIT 1");
    const row = await stmt.get();

    return {
      processoSeletivoInicioUnix: row.processoSeletivoInicioUnix || Date.now(),
      processoSeletivoFimUnix: row.processoSeletivoFimUnix || Date.now(),
      processoSeletivoDescricaoHtml:
        row.processoSeletivoDescricaoHtml ||
        "<h1>Configurar aplicação</h1><p>A aplicação não está configurada devidamente.</p>",
      smtpHost: row.smtpHost || "",
      smtpPort: row.smtpPort || "",
      smtpUsername: row.smtpUser || "",
      smtpPassword: row.smtpPassword || "",
      smtpSecure: row.smtpSecure !== 0,
      smtpSenderAddress: row.smtpSenderAddress || "",
    };
  }

  /**
   * Salva as configurações da aplicação
   */
  async setConfig(config: Config) {
    const stmt = await getDatabase().prepare(
      `INSERT INTO
        config (
          processoSeletivoInicioUnix,
          processoSeletivoFimUnix,
          processoSeletivoDescricaoHtml,
          smtpHost,
          smtpPort,
          smtpUser,
          smtpPassword,
          smtpSecure,
          smtpSenderAddress
        )
      VALUES
        (?, ?, ?, ?, ?, ?, ?, ?, ?);`
    );

    await stmt.run([
      config.processoSeletivoInicioUnix,
      config.processoSeletivoFimUnix,
      config.processoSeletivoDescricaoHtml,
      config.smtpHost,
      config.smtpPort,
      config.smtpUsername,
      config.smtpPassword,
      config.smtpSecure,
      config.smtpSenderAddress,
    ]);
  }
}
