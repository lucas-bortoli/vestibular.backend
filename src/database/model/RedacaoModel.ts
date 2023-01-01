export interface RedacaoModel {
  /**
   * O participante a quem essas redação pertence
   */
  participanteId: number;

  /**
   * O corpo dessa redação
   */
  corpo: string;

  /**
   * O timestamp em que a redação começou a ser escrita
   */
  inicioTimestamp: number;

  /**
   * O timestamp em que a redação foi finalizada
   */
  fimTimestamp: number;

  /**
   * Indica se a redação está concluída, o sistema não deve aceitar atualizações se estiver
   */
  concluido: boolean;
}
