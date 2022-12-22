export interface Curso {
  /**
   * Id do curso
   */
  id: number;

  /**
   * Nome do curso
   * @example "Engenharia de Software"
   */
  nome: string;

  /**
   * Id do campus do curso
   */
  campusId: number;
}

/**
 * Uma união de cursos com campus.
 */
export interface CursoCampusJoin {
  cursoId: number;
  cursoNome: string;
  campusId: number;
  campusNome: string;
}
