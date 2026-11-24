//Lo que llega de GET /api/dashboard/resumen
export interface ProductoVendidoInterface {
  productoId: number;
  nombre: string;
  cantidad: number;
}
export interface DashboardResumenInterface {
  saldoPorCobrar: number;
  ventasMes: number;
  comprasPendientes: number;
  totalClientes: number;
  cobradoHoy: number;
  productosMasVendidos: ProductoVendidoInterface[];
}
