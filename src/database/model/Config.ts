export interface Config {
  /**
   * Quando o processo seletivo está iniciado.
   * Só serão aceitas entregas de provas onlines depois desse período.
   */
  processoSeletivoInicioUnix: number;

  /**
   * Quando o processo seletivo está finalizado.
   * Só serão aceitas entregas de provas onlines antes desse período.
   */
  processoSeletivoFimUnix: number;

  /**
   * Descrição do processo seletivo. Mostrado na página principal da aplicação, na sidebar.
   */
  processoSeletivoDescricaoHtml: string;

  /**
   * Configurações de e-mail smtp
   */
  smtpHost: string;
  smtpPort: number;
  smtpUsername: string;
  smtpPassword: string;
  smtpSecure: boolean;
  smtpSenderAddress: string;
}
