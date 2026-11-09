export interface LoginRequest {
  username: string;
  password: string;
}

export interface Sesion {
  username: string;
  accesToken: string;
  refreshToken: string;
  identifier?: number;
  expiration?: number;
}
