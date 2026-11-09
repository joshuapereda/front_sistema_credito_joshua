export interface Cliente {
  id: number;
  nombre: string;
  gmail: string;
  telefono: string;
  direccion: string;
  docIdentidad: string;
}

/**
 * Cuerpo de POST y PUT /api/clientes
 * nombre y gmail deben ser únicos; telefono usa celularPeruValidator (shared/validators).
 */
export interface ClienteRequest {
  nombre: string; // máx. 50
  gmail: string;
  telefono: string; // 9 dígitos, empieza en 9
  direccion: string;
  docIdentidad: string;
}
