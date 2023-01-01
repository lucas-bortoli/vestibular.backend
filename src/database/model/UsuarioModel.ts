import { AuthorizationRolesType } from "../../auth/Roles.js";
/**
 * Representa um usuário no banco de dados.
 * Importante notar: Um Usuário NÃO é um Participante.
 * Usuários são administradores do site, ou são staff.
 */
export default interface UsuarioModel {
  /**
   * Id do usuário
   */
  id: number;

  /**
   * Nome do usuário
   */
  nome: string;

  /**
   * Os roles (permissões) do usuário
   */
  roles: AuthorizationRolesType[];

  /**
   * Username do usuário
   */
  username: string;

  /**
   * Hash da senha do usuário, para autenticação
   */
  hash_senha: string;

  /**
   * Salt da senha do usuário. É adicionada como um sufixo antes da senha
   * passar pelo algoritmo de hashing.
   *
   * Basicamente:
   * hash_senha = sha256(senha + senha_salt)
   *
   * A senha, em si, do usuário não é guardada no banco de dados.
   */
  senha_salt: string;
}
