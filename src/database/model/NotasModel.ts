export default interface NotasModel {
  /**
   * O participante a quem essas notas partencem.
   */
  participanteId: number;

  /**
   * Um vetor de notas, de 0 a 10.
   */
  notas: number[];
}
