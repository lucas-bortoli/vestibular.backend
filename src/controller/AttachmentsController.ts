import { Response } from "express";
import {
  Authorized,
  Controller,
  Get,
  OnNull,
  Param,
  Put,
  QueryParam,
  Res,
  UploadedFile,
} from "routing-controllers";
import { AttachmentsDAO } from "../database/dao/AttachmentsDAO.js";

@Controller("/attachments")
export class AttachmentsController {
  @Get("/opaque/:id")
  @OnNull(404)
  async metadata(@Param("id") id: string, @Res() response: Response) {
    const dao = new AttachmentsDAO();
    const attachment = await dao.readOpaque(id);

    if (!attachment) {
      return null;
    }

    response.contentType("application/json");
    response.write(JSON.stringify(attachment));
    response.end();

    return response;
  }

  @Get("/data/:id")
  @OnNull(404)
  async list(
    @Param("id") id: string,
    @QueryParam("forceDownload") forceDownload: boolean,
    @Res() response: Response
  ) {
    const dao = new AttachmentsDAO();
    const attachment = await dao.readFile(id);

    if (!attachment) {
      return null;
    }

    if (forceDownload) {
      response.attachment(attachment.nome);
    }

    response.contentType(attachment.mime);
    response.write(attachment.dados);
    response.end();

    return response;
  }

  @Put("/:id")
  @Authorized()
  async post(
    @Param("id") id: string,
    @UploadedFile("file", { required: true }) file: Express.Multer.File,
    @Res() response: Response
  ) {
    const dao = new AttachmentsDAO();

    await dao.write({
      id,
      nome: file.originalname,
      mime: file.mimetype,
      modificado: Date.now(),
      tamanho: file.size,
      dados: file.buffer,
    });

    response.contentType("application/json");
    response.write(JSON.stringify({ success: true }));
    response.end();

    return response;
  }
}
