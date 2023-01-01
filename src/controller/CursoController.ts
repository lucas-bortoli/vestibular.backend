import { Get, JsonController } from "routing-controllers";

import { CursoDAO } from "../database/dao/CursoDAO.js";

@JsonController("/curso")
export class CursoController {
  @Get("/list")
  async list() {
    const cursoDAO = new CursoDAO();
    return await cursoDAO.getCourses();
  }

  @Get("/listCampus")
  async listCampus() {
    const cursoDAO = new CursoDAO();
    return await cursoDAO.getAllCampus();
  }
}
