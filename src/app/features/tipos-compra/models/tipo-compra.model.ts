export interface TipoCompra {
  id: number;
  nombre: string;
  descripcion: string | null;
  esCredito: boolean;
}

/** Cuerpo de POST y PUT /api/tipoCompras */
export interface TipoCompraRequest {
  nombre: string; // obligatorio, máx. 50
  descripcion?: string | null; // máx. 200
  esCredito: boolean; // obligatorio: true = crédito, false = contado
}
