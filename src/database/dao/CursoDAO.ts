import getDatabase from "../Database.js";
import { CampusModel } from "../model/CampusModel.js";
import { CursoCampusJoin } from "../model/CursoModel.js";

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

  /**
   * Retorna todos os campus cadastrados na aplicação.
   */
  async getAllCampus(): Promise<CampusModel[]> {
    const stmt = await getDatabase().all("SELECT * FROM campus");

    return stmt.map((row) => {
      return {
        id: row.id,
        nome: row.nome,
      };
    });
  }
}
