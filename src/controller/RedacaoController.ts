import { Body, Get, JsonController, OnNull, Post } from "routing-controllers";
import assert from "node:assert";
import { Participante } from "./decorators/ParticipanteDecorator";
import ParticipanteModel from "../database/model/ParticipanteModel";
import { RedacaoDAO } from "../database/dao/RedacaoDAO";
import { ConfigDAO } from "../database/dao/ConfigDAO";
import dateInRange from "../utils/dateInRange";

interface RedacaoAtualizarBody {
  corpo: string;
}

const getConfig = () => new ConfigDAO().getConfig();
const verificarProcessoSeletivoAberto = async () => {
  const { processoSeletivoInicioUnix, processoSeletivoFimUnix } = await getConfig();

  if (!dateInRange(Date.now(), processoSeletivoInicioUnix, processoSeletivoFimUnix)) {
    throw new Error("O processo seletivo está finalizado.");
  }

  return true;
};

/**
 * Controlador das redações.
 */
@JsonController("/participante/redacao")
export class RedacaoController {
  /**
   * Inicia o processo de escrita da redação.
   * @param participante O participante atual.
   */
  @Post("iniciar")
  public async iniciarRedacao(@Participante() participante: ParticipanteModel) {
    await verificarProcessoSeletivoAberto();

    const dao = new RedacaoDAO();
    const redacaoExistente = dao.getByParticipanteId(participante.id);

    if (redacaoExistente !== null) {
      throw new Error("Redação em progresso.");
    }

    return await dao.insertOrUpdate({
      participanteId: participante.id,
      corpo: "",
      inicioTimestamp: Date.now(),
      fimTimestamp: Date.now(),
      concluido: false,
    });
  }

  /**
   * Chamado pelo cliente periodicamente conforme a redação está sendo escrita.
   * Contém o corpo atual da redação. Esse método atualiza o "fimTimestamp" da redação,
   * mesmo que ela não esteja concluída.
   */
  @Post("atualizar")
  public async atualizarRedacao(
    @Participante() participante: ParticipanteModel,
    @Body() body: RedacaoAtualizarBody
  ) {
    await verificarProcessoSeletivoAberto();

    assert(typeof body.corpo === "string");

    const dao = new RedacaoDAO();
    const redacao = await dao.getByParticipanteId(participante.id);

    // Verificar se há uma redação em progresso
    assert(redacao !== null);

    // Verificar se não está concluída ainda
    assert(!redacao.concluido);

    // Atualizar redação
    return await dao.insertOrUpdate({
      corpo: body.corpo,
      fimTimestamp: Date.now(),
      participanteId: redacao.participanteId,
      inicioTimestamp: redacao.inicioTimestamp,
      concluido: false,
    });
  }

  /**
   * Conclui uma redação em progresso. Isso impede a redação de ser escrita.
   * @param participante
   * @returns
   */
  @Post("concluir")
  public async concluirRedacao(@Participante() participante: ParticipanteModel) {
    await verificarProcessoSeletivoAberto();

    const dao = new RedacaoDAO();
    const redacao = await dao.getByParticipanteId(participante.id);

    assert(redacao !== null);

    return await dao.insertOrUpdate({
      concluido: true,
      fimTimestamp: Date.now(),
      participanteId: redacao.participanteId,
      inicioTimestamp: redacao.inicioTimestamp,
      corpo: redacao.corpo,
    });
  }

  @Get()
  @OnNull(404)
  public async retornarRedacao(@Participante() participante: ParticipanteModel) {
    const dao = new RedacaoDAO();
    const redacao = await dao.getByParticipanteId(participante.id);

    assert(redacao !== null);

    return redacao;
  }
}
