import assert from "assert";
import {
  Authorized,
  Body,
  Get,
  JsonController,
  OnNull,
  Param,
  Post,
  UnauthorizedError,
  UseBefore,
} from "routing-controllers";
import getAuthorizationManager from "../auth/AuthorizationManager.js";
import { ConfigDAO } from "../database/dao/ConfigDAO.js";
import { NotasDAO } from "../database/dao/NotasDAO.js";
import { ParticipanteDAO } from "../database/dao/ParticipanteDAO.js";
import { RedacaoDAO } from "../database/dao/RedacaoDAO.js";
import { UsuarioDAO } from "../database/dao/UsuarioDAO.js";
import ConfigModel from "../database/model/ConfigModel.js";
import NotasModel from "../database/model/NotasModel.js";
import Usuario from "../database/model/UsuarioModel.js";

import { LoggerMiddleware } from "../middleware/LoggerMiddleware.js";

interface LoginRequestBody {
  username?: unknown;
  password?: unknown;
}

@JsonController("/restrito")
@UseBefore(LoggerMiddleware)
export class RestritoController {
  /**
   * Faz o login no sistema restrito. Gera um token de autorização e dá ao cliente,
   * este token sendo necessário para todas as outras operações neste controller.
   */
  @Post("/login")
  async login(@Body() body: LoginRequestBody) {
    const username = "" + body.username;
    const password = "" + body.password;

    const userAuthInfo = await getAuthorizationManager().authenticateUser(username, password);

    if (userAuthInfo === null) {
      throw new UnauthorizedError("Usuário ou senha inválidos.");
    }

    const user = (await new UsuarioDAO().getById(userAuthInfo.userId)) as Usuario;

    return {
      user: Object.assign({}, user, {
        hash_senha: undefined,
        senha_salt: undefined,
      }),
      ...userAuthInfo,
    };
  }

  /**
   * Retorna uma lista com todos os participantes cadastrados no sistema.
   */
  @Get("/participantes")
  @Authorized()
  async listarParticipantes() {
    const pDAO = new ParticipanteDAO();
    const participantes = await pDAO.getAll();

    return participantes;
  }

  /**
   * Lista todas as notas lançadas no sistema.
   */
  @Get("/notas")
  @Authorized()
  async listarTodasNotas() {
    const nDAO = new NotasDAO();

    return await nDAO.getAll();
  }

  /**
   * Lista todas as notas lançadas no sistema.
   */
  @Get("/notas/:id")
  @Authorized()
  @OnNull(404)
  async listarNotaParticipante(@Param("id") participanteId: number) {
    const nDAO = new NotasDAO();
    return await nDAO.getById(participanteId);
  }

  /**
   * Lança várias notas no sistema.
   */
  @Post("/notas")
  @Authorized()
  async lancarNota(@Body() body: NotasModel[]) {
    const pDAO = new ParticipanteDAO();
    const nDAO = new NotasDAO();

    assert(Array.isArray(body), "O corpo não é array.");

    for (const lancamento of body) {
      const participante = await pDAO.getById(lancamento.participanteId);

      // Assegurar que o participante existe
      if (participante === null) continue;

      // Assegurar que só há números na array
      assert(Array.isArray(lancamento.notas), "Notas inválidas.");
      assert(
        lancamento.notas.find((el) => isNaN(parseInt("" + el))) === undefined,
        "Notas inválidas."
      );
      assert(
        lancamento.notas.find((el) => el < 0 || el > 100) === undefined,
        "Notas fora do intervalo [0, 100]."
      );

      await nDAO.setNotas(lancamento.participanteId, lancamento.notas);
    }
    return true;
  }

  /**
   * Retorna a redação de um participante específico.
   */
  @Get("/redacao/:participanteId")
  @Authorized()
  async retornarRedacaoParticipante(@Param("participanteId") participanteId: number) {
    participanteId = parseInt("" + participanteId);

    const redacao = await new RedacaoDAO().getByParticipanteId(participanteId);

    assert(redacao !== null, "Não há nenhuma redação enviada para este participante.");

    return redacao;
  }

  @Get("/config")
  @Authorized()
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
