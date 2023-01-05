import { AuthorizationRolesType } from "./Roles.js";

export class AuthenticatedUser {
  readonly userId: number;
  readonly roles: AuthorizationRolesType[];
  readonly expiresTimestamp: number;
  readonly token: string;

  /**
   * Define um usuário autenticado no sistema.
   * @param userId O id do usuário, como consta no banco de dados
   * @param roles Uma lista de permissões que o usuário tem
   * @param expiresTimestamp A timestamp em que o token do usuário não é mais válido, e deve ser excluído
   */
  constructor(
    userId: number,
    token: string,
    roles: AuthorizationRolesType[],
    expiresTimestamp?: number
  ) {
    this.userId = userId;
    this.roles = roles;
    this.expiresTimestamp = expiresTimestamp ?? Infinity; // token permanente
    this.token = token;
  }
}
