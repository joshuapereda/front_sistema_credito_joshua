// UsuarioInterface.ts
export interface UsuarioInterface {
  id?: number;
  username: string;
  passwprd?: string;
  gmail?: string | null;
  personaId: number;
  nombrePersona?: string;
  rolesId: number[];
}
//Filtros
export interface UsuarioFilterCriteria {
  username?: string | null;
  nombrePersona?: string | null;
}
