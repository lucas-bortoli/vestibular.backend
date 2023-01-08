import { Get, JsonController } from "routing-controllers";
import { ConfigDAO } from "../database/dao/ConfigDAO.js";
import { CursoDAO } from "../database/dao/CursoDAO.js";
import ConfigModel from "../database/model/ConfigModel.js";

@JsonController("/processoSeletivo")
export class ProcessoSeletivoController {
  @Get("/curso/list")
  async listCursos() {
    const cursoDAO = new CursoDAO();
    return await cursoDAO.getCourses();
  }

  @Get("/campus/list")
  async listCampus() {
    const cursoDAO = new CursoDAO();
    return await cursoDAO.getAllCampus();
  }

  @Get("/config")
  async getConfig(): Promise<
    Pick<ConfigModel, "processoSeletivoInicioUnix" | "processoSeletivoFimUnix" | "redacaoTempo">
  > {
    const config = await new ConfigDAO().getConfig();

    return {
      processoSeletivoInicioUnix: config.processoSeletivoInicioUnix,
      processoSeletivoFimUnix: config.processoSeletivoFimUnix,
      redacaoTempo: config.redacaoTempo,
    };
  }
}
