import { createParamDecorator } from "routing-controllers";
import { ParticipanteDAO } from "../../database/dao/ParticipanteDAO";

export function Participante() {
  return createParamDecorator({
    required: true,
    value: (action) => {
      const pDAO = new ParticipanteDAO();
      const encodedField = action.request.headers["x-authorization"];

      if (typeof encodedField !== "string") {
        return null;
      }

      /**
       * Dois campos em base64, juntos por ":"
       * ```
       * btoa("78249442474") + ":" + btoa("2023-01-01")
       * -> "NzgyNDk0NDI0NzQ=:MjAyMy0wMS0wMQ=="
       * ```
       */
      const decoded = encodedField
        .split(":")
        .map((field) => Buffer.from(field, "base64").toString("utf-8"));

      return pDAO.getByCpfAndBirthDate(decoded[0], decoded[1]);
    },
  });
}
