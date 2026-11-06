export interface Pago {
  id: number;
  monto: number;
  fechaHora: string; // ISO
  nombreClienteCompra: string;
  saldoRestante: number;
  totalCompra: number;
}

/**
 * Cuerpo de POST /api/pago.
 * El backend rechaza el pago si la compra ya está PAGADO o si monto > saldo.
 * Cuando el saldo llega a 0, la compra pasa a PAGADO.
 */
export interface PagoRequest {
  compraId: number;
  monto: number; // > 0, hasta 2 decimales
}
