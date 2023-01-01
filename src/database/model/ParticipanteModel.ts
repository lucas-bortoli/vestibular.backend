import Joi from "joi";
import { cpf as cpfValidator } from "cpf-cnpj-validator";

export default interface ParticipanteModel {
  /**
   * Id do participante
   */
  id: number;

  /**
   * Nome do participante
   */
  nome: string;

  /**
   * E-mail do participante
   */
  email: string;

  /**
   * Telefone do participante, sem formatação
   */
  telefone: string;

  /**
   * Data de nascimento no formato YYYY-MM-DD
   */
  dataNascimento: string;

  /**
   * CPF do participante, sem formatação
   */
  cpf: string;

  /**
   * Id do curso no qual o participante está inscrito
   */
  cursoId: number;

  /**
   * Indica se o participante está inscrito na prova online
   */
  provaOnline: boolean;
}

/**
 * Valida um participante.
 */
export const ParticipanteSchema = Joi.object({
  id: Joi.number().min(1),
  nome: Joi.string().max(64).required(),
  email: Joi.string().email().required(),
  telefone: Joi.string().length(11).required(),
  // Data de nascimento no formato YYYY-MM-DD
  dataNascimento: Joi.string()
    .pattern(/^\d{4}-\d{2}-\d{2}$/)
    .required(),
  cpf: Joi.string()
    .length(11)
    .custom((cpf) => {
      if (!cpfValidator.isValid(cpf)) {
        throw new Error("CPF inválido.");
      }

      return cpf;
    }),
  cursoId: Joi.number().integer().min(1).required(),
  provaOnline: Joi.bool().required(),
});
