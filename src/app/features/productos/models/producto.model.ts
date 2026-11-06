export interface Producto {
  id: number;
  nombre: string;
  foto: string | null;
  precioVenta: number;
  precioCompra: number;
  categoriaId: number;
}

/** Cuerpo de POST y PUT /api/productos */
export interface ProductoRequest {
  nombre: string; // obligatorio, máx. 100
  foto?: string | null; // ruta de la imagen, máx. 255
  precioVenta: number; // > 0, hasta 2 decimales
  precioCompra: number; // > 0, hasta 2 decimales
  categoriaId: number;
}
