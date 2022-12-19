export default interface Participante {
  /**
   * Id do participante
   */
  id: number;

  /**
   * Nome do participante
   */
  nome: string;

  /**
   * E-mail do participante
   */
  email: string;

  /**
   * Telefone do participante, sem formatação
   */
  telefone: string;

  /**
   * Data de nascimento no formato YYYY-MM-DD
   */
  dataNascimento: string;

  /**
   * CPF do participante, sem formatação
   */
  cpf: string;

  /**
   * Id do curso no qual o participante está inscrito
   */
  cursoId: number;

  /**
   * Indica se o participante está inscrito na prova online
   */
  provaOnline: boolean;
}
