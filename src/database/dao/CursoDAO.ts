import getDatabase from "../Database.js";
import { CursoCampusJoin } from "../model/Curso.js";

export class CursoDAO {
  /**
   * @returns uma lista de cursos cadastrados, junto com seus campus.
   */
  async getCourses(): Promise<CursoCampusJoin[]> {
    const db = getDatabase();

    const stmt = await db.prepare(
      `SELECT
         curso.id as "cursoId",
         curso.nome as "cursoNome",
         campus.id as "campusId",
         campus.nome as "campusNome"
       FROM
         curso
         JOIN campus ON curso.campusId = campus.id;`
    );

    const rows = await stmt.all();

    return rows.map((row) => {
      return {
        cursoId: row.cursoId,
        cursoNome: row.cursoNome,
        campusId: row.campusId,
        campusNome: row.campusNome,
      };
    });
  }
}
