export type AccionPermiso = 'CREAR' | 'LEER' | 'ACTUALIZAR' | 'ELIMINAR';

export interface Permiso {
  id: number;
  nombre: string;
  recurso: string;
  accion: AccionPermiso;
}

/** Cuerpo de POST y PUT /api/permisos */
export interface PermisoRequest {
  nombre: string; // obligatorio, máx. 100
  recurso: string; // obligatorio, máx. 50 (ej. "productos")
  accion: AccionPermiso;
}
