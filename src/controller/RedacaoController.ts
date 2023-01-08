import { Body, Get, JsonController, OnNull, Post, UseBefore } from "routing-controllers";
import assert from "node:assert";
import { Participante } from "./decorators/ParticipanteDecorator.js";
import ParticipanteModel from "../database/model/ParticipanteModel.js";
import { LoggerMiddleware } from "../middleware/LoggerMiddleware.js";
import { RedacaoDAO } from "../database/dao/RedacaoDAO.js";
import { ConfigDAO } from "../database/dao/ConfigDAO.js";

interface RedacaoAtualizarBody {
  corpo: string;
}

const getConfig = () => new ConfigDAO().getConfig();
const verificarProcessoSeletivoAberto = async () => {
  const { processoSeletivoInicioUnix, processoSeletivoFimUnix } = await getConfig();

  const now = Date.now();

  if (now < processoSeletivoInicioUnix) {
    throw new Error(
      "O processo seletivo ainda não começou. Não é possível enviar uma redação neste momento."
    );
  }

  if (now > processoSeletivoFimUnix) {
    throw new Error(
      "O processo seletivo está finalizado. Não é possível enviar uma redação neste momento."
    );
  }

  return true;
};

/**
 * Controlador das redações.
 */
@JsonController("/participante/redacao")
@UseBefore(LoggerMiddleware)
export class RedacaoController {
  /**
   * Inicia o processo de escrita da redação.
   * @param participante O participante atual.
   */
  @Post("/iniciar")
  public async iniciarRedacao(@Participante() participante: ParticipanteModel) {
    await verificarProcessoSeletivoAberto();

    assert(participante.provaOnline, "Você está inscrito na modalidade presencial da prova.");

    const dao = new RedacaoDAO();
    const redacaoExistente = await dao.getByParticipanteId(participante.id);
    console.log("redacaoExistente", redacaoExistente);
    assert(redacaoExistente === null, "Redação já está em progresso.");

    const config = await getConfig();

    return await dao.insertOrUpdate({
      participanteId: participante.id,
      corpo: "",
      inicioTimestamp: Date.now(),
      fimTimestamp: Date.now(),
      concluido: false,
      tempoRestante: config.redacaoTempo,
    });
  }

  /**
   * Chamado pelo cliente periodicamente conforme a redação está sendo escrita.
   * Contém o corpo atual da redação. Esse método atualiza o "fimTimestamp" da redação,
   * mesmo que ela não esteja concluída.
   */
  @Post("/atualizar")
  public async atualizarRedacao(
    @Participante() participante: ParticipanteModel,
    @Body() body: RedacaoAtualizarBody
  ) {
    assert(typeof body.corpo === "string", "Parâmetro corpo inválido ou não existe.");

    const dao = new RedacaoDAO();
    const redacao = await dao.getByParticipanteId(participante.id);

    // Verificar se há uma redação em progresso e se não está concluída ainda
    assert(redacao !== null, "Redação não existe.");
    assert(!redacao.concluido, "Redação já concluída.");

    const config = await getConfig();

    // Atualizar redação
    return await dao.insertOrUpdate({
      corpo: body.corpo,
      fimTimestamp: Date.now(),
      participanteId: redacao.participanteId,
      inicioTimestamp: redacao.inicioTimestamp,
      concluido: false,
      tempoRestante: config.redacaoTempo - (Date.now() - redacao.inicioTimestamp),
    });
  }

  /**
   * Conclui uma redação em progresso. Isso impede a redação de ser escrita.
   * @param participante
   * @returns
   */
  @Post("/concluir")
  public async concluirRedacao(@Participante() participante: ParticipanteModel) {
    const dao = new RedacaoDAO();
    const redacao = await dao.getByParticipanteId(participante.id);

    assert(redacao !== null, "Redação não existe.");
    assert(!redacao.concluido, "Redação já concluída.");

    const config = await getConfig();

    return await dao.insertOrUpdate({
      concluido: true,
      fimTimestamp: Date.now(),
      participanteId: redacao.participanteId,
      inicioTimestamp: redacao.inicioTimestamp,
      corpo: redacao.corpo,
      tempoRestante: config.redacaoTempo - (Date.now() - redacao.inicioTimestamp),
    });
  }

  /**
   * Retorna a redação do participante, ou "null" se não existir.
   */
  @Get("/atual")
  public async retornarRedacao(@Participante() participante: ParticipanteModel) {
    const dao = new RedacaoDAO();
    const redacao = await dao.getByParticipanteId(participante.id);

    return redacao;
  }
}
