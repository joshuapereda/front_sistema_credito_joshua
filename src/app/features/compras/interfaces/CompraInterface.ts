// CompraInterface.ts

//---------- LO QUE RECIBES (GET /api/compra) ----------//
export interface DetalleCompraInterface {
  productoId: number;
  nombreProducto: string;
  cantidad: number;
  precioUnitario: number;
  subtotal: number;
}
export interface CompraInterface {
  id: number;
  fechaHora: string;
  total: number;
  saldo: number;
  clienteId: number;
  cliente: string;
  usuarioId: number;
  usuario: string;
  tipoCompraId: number;
  tipoCompra: string;
  detalles: DetalleCompraInterface[];
  estado: string;
}

//---------- LO QUE ENVÍAS (POST / PUT /api/compra) ----------//
export interface DetalleCompraRequest {
  productoId: number;
  cantidad: number;
}
export interface CompraRequest {
  clienteId: number;
  usuarioId: number;
  tipoCompraId: number;
  detalles: DetalleCompraRequest[];
}
