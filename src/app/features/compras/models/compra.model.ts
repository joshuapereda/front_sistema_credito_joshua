export type EstadoCompra = 'PENDIENTE' | 'PAGADO';

export interface DetalleCompra {
  productoId: number;
  nombreProducto: string;
  cantidad: number;
  precioUnitario: number;
  subtotal: number;
}

/**
 * Respuesta de /api/compra.
 * cliente, usuario y tipoCompra llegan como nombre (texto), no como id.
 */
export interface Compra {
  id: number;
  fechaHora: string; // ISO, usar {{ compra.fechaHora | date: 'short' }}
  total: number;
  saldo: number;
  cliente: string;
  usuario: string;
  tipoCompra: string;
  estado: EstadoCompra;
  detalles: DetalleCompra[];
}

export interface DetalleCompraRequest {
  productoId: number;
  cantidad: number; // > 0
}

/**
 * Cuerpo de POST y PUT /api/compra.
 * NO se manda precio: el backend usa el precioVenta del producto y calcula subtotal, total y saldo.
 * Crédito -> saldo = total y estado PENDIENTE. Contado -> saldo 0 y estado PAGADO.
 */
export interface CompraRequest {
  clienteId: number;
  usuarioId: number;
  tipoCompraId: number;
  detalles: DetalleCompraRequest[]; // al menos uno
}
