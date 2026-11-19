export interface ProductoInterface {
  id: number;
  nombre: string;
  precioVenta: number;
  precioCompra: number;
  categoriaId: number;
  foto: string | null;
}
