export interface Categoria {
  id: number;
  nombre: string;
  descripcion: string | null;
}

/** Cuerpo de POST y PUT /api/categorias */
export interface CategoriaRequest {
  nombre: string; // obligatorio, máx. 50
  descripcion?: string | null; // máx. 200
}
