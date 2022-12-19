export const AuthorizationRoles = ["Participante", "Admin"] as const;
export type AuthorizationRolesType = typeof AuthorizationRoles[number];
