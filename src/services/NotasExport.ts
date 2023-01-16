import Excel from "exceljs";
import { ParticipanteDAO } from "../database/dao/ParticipanteDAO.js";
import { NotasDAO } from "../database/dao/NotasDAO.js";
import { CursoDAO } from "../database/dao/CursoDAO.js";
import sumArray from "../utils/sumArray.js";
import format from "../utils/format.js";

// CommonJS...
const { Workbook } = Excel;

/**
 * Exporta as notas do banco para uma planilha Excel.
 */
const doExport = async () => {
  const participanteDAO = new ParticipanteDAO();
  const cursoDAO = new CursoDAO();
  const notaDAO = new NotasDAO();

  let participantes = await participanteDAO.getAll();
  let cursos = await cursoDAO.getCourses();
  let notas = await notaDAO.getAll();

  // Ordenar os participantes nessa ordem:
  //   1. Soma das notas
  //   2. Nota redação
  //   3. Nota português
  //   4. Nota matemática
  //   5. Maior idade
  participantes = participantes.sort((a, b) => {
    const { notas: nA } = notas.find((n) => n.participanteId === a.id) ?? { notas: [0, 0, 0] };
    const { notas: nB } = notas.find((n) => n.participanteId === b.id) ?? { notas: [0, 0, 0] };

    const somaA = sumArray(nA).toString().padStart(3, "0");
    const somaB = sumArray(nB).toString().padStart(3, "0");

    const idadeA: number = new Date().valueOf() - new Date(a.dataNascimento).valueOf();
    const idadeB: number = new Date().valueOf() - new Date(b.dataNascimento).valueOf();

    const fatorA = `${somaA}_${nA[0]}_${nA[2]}_${nA[1]}_${idadeA.toString().padStart(16, "0")}`;
    const fatorB = `${somaB}_${nB[0]}_${nB[2]}_${nB[1]}_${idadeB.toString().padStart(16, "0")}`;

    return fatorB.localeCompare(fatorA, "pt-BR", { sensitivity: "base" });
  });

  const workbook = new Workbook();

  // Inserir cada participante na subplanilha de seu campus
  for (const participante of participantes) {
    let curso = cursos.find((c) => c.cursoId === participante.cursoId);

    // ??? participante está em um curso inválido
    if (!curso) {
      continue;
    }

    // Usar notas do participante, ou notas zero se não houver
    let notas = (await notaDAO.getById(participante.id))?.notas ?? [0, 0, 0];

    // Subplanilha do campus do participante
    let sheet = workbook.getWorksheet(curso.campusNome);

    // Se esse campus não houver uma subplanilha ainda, criar
    if (!sheet) {
      const bWidth = 4;

      sheet = workbook.addWorksheet(curso.campusNome);

      sheet.columns = [
        { key: "id", header: "Inscrição", width: bWidth * 1 },
        { key: "nome", header: "Nome", width: bWidth * 8 },
        {
          key: "dataNascimento",
          header: "Nascimento",
          width: bWidth * 3,
        },
        { key: "feletone", header: "Telefone", width: bWidth * 4 },
        { key: "email", header: "E-mail", width: bWidth * 4 },
        { key: "curso", header: "Curso", width: bWidth * 8 },
        {
          key: "notaRed",
          header: "Redação",
          width: bWidth * 2,
        },
        {
          key: "notaMat",
          header: "Matemática",
          width: bWidth * 2,
        },
        {
          key: "notaPort",
          header: "Português",
          width: bWidth * 2,
        },
        {
          key: "total",
          header: "Somatória",
          width: bWidth * 2,
        },
      ];

      sheet.getRow(1).eachCell((cell) => {
        cell.style.font = { bold: true };
      });

      sheet.getColumn("dataNascimento").alignment = { vertical: "top", horizontal: "right" };
      sheet.getColumn("notaRed").alignment = { vertical: "top", horizontal: "right" };
      sheet.getColumn("notaMat").alignment = { vertical: "top", horizontal: "right" };
      sheet.getColumn("notaPort").alignment = { vertical: "top", horizontal: "right" };
    }

    // Inserir participante nesta subplanilha
    const row = sheet.addRow({
      id: participante.id,
      nome: participante.nome,
      dataNascimento: new Date(participante.dataNascimento),
      feletone: format("(dd) ddddd-dddd", participante.telefone),
      email: participante.email,
      curso: curso.cursoNome,
      notaRed: notas[0],
      notaMat: notas[1],
      notaPort: notas[2],
      total: sumArray(notas),
    });

    row.getCell("total").font = {
      color: { argb: "320120" },
      bold: true,
    };
  }

  return await workbook.xlsx.writeBuffer();
};

const NotasExportService = {
  doExport,
};

export default NotasExportService;
