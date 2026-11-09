export interface Usuario {
  id: number;
  username: string;
  gmail: string;
  nombrePersona: string;
  rolesId: number[];
}

/**
 * Cuerpo de POST y PUT /api/usuarios.
 * Ojo: el campo se llama "passwprd" en el backend (con ese typo); no corregirlo aquí.
 */
export interface UsuarioRequest {
  username: string; // único
  passwprd: string;
  personaId: number;
  rolesId: number[];
}
