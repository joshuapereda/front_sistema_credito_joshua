// Pendiente HU-08: ajustar cuando el backend defina el contrato de /api/auth/login
export interface LoginRequest {
  username: string;
  password: string;
}

export interface Sesion {
  username: string;
  token?: string;
}
