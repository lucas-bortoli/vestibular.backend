import { randomUUID, randomBytes, createHash } from "node:crypto";
import { UsuarioDAO } from "../database/dao/UsuarioDAO.js";
import { AuthenticatedUser } from "./AuthenticatedUser.js";

export class AuthorizationManager {
  /**
   * Mapeia os tokens de autenticação para os usuários autenticados.
   */
  private currentUsers: Map<string, AuthenticatedUser>;

  constructor() {
    this.currentUsers = new Map();
  }

  async authenticateUser(username: string, password: string): Promise<AuthenticatedUser | null> {
    const userDAO = new UsuarioDAO();
    const dbUser = await userDAO.getByUsername(username);

    if (dbUser === null) {
      return null;
    }

    // Verificar se já existe uma sessão para este usuário
    for (const [token, user] of this.currentUsers.entries()) {
      if (dbUser.id === user.userId) {
        // Já existe, retornar a sessão atual
        return user;
      }
    }

    if (dbUser.hash_senha !== this.hashPassword(password, dbUser.senha_salt)) {
      // Autenticação falhou, a senha não bate
      return null;
    }

    const token = this.generateToken();
    const authUser = new AuthenticatedUser(dbUser.id, token, dbUser.roles);

    // Salvar sessão
    this.currentUsers.set(token, authUser);

    return authUser;
  }

  /**
   * Retorna o usuário autenticado pelo seu token. Caso o token esteja expirado,
   * o usuário é invalidado
   * @param token Token do usuário.
   * @returns O usuário, se autenticado, ou null.
   */
  getAuthenticatedUserByToken(token: string): AuthenticatedUser | null {
    if (this.currentUsers.has(token)) {
      const user = this.currentUsers.get(token)!;

      // Verificar se o token está expirado
      if (Date.now() >= user.expiresTimestamp) {
        // Remover do balde
        this.currentUsers.delete(token);
        return null;
      }

      return user;
    }

    return null;
  }

  private generateToken(): string {
    return randomUUID();
  }

  /**
   * Gera um salt para o usuário, de 32 bytes.
   */
  private generateSalt(): string {
    return randomBytes(16).toString("hex");
  }

  /**
   * Retorna uma hash de uma senha com sua salt.
   * @returns A senha com hash.
   */
  private hashPassword(plainTextPassword: string, salt: string): string {
    return createHash("sha512")
      .update(plainTextPassword + salt)
      .digest("hex");
  }
}

const authMgr = new AuthorizationManager();
const getAuthorizationManager = () => authMgr;
export default getAuthorizationManager;
