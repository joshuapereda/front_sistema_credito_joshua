export interface Rol {
  id: number;
  nombre: string;
  descripcion: string | null;
  permisosId: number[];
}

/** Cuerpo de POST y PUT /api/roles */
export interface RolRequest {
  nombre: string;
  descripcion?: string | null; // máx. 200
  permisosId: number[]; // al menos uno
}
