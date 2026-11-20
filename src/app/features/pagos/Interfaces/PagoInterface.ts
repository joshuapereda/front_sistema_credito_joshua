// PagoInterface.ts

//---------- LO QUE RECIBES (GET /api/pago) ----------//
export interface PagoInterface {
  id: number;
  monto: number;
  fechaHora: string;
  compraId: number;
  nombreClienteCompra: string;
  saldoRestante: number;
  totalCompra: number;
}

//---------- LO QUE ENVÍAS (POST / PUT /api/pago) ----------//
export interface PagoRequest {
  monto: number;
  compraId: number;
}
//filtros
export interface PagoFilterCriteria{
  nombreCliente?: string | null;
}
/*
  INTERFACES vs ANY

  - Interface: define la "forma" de un dato (qué campos tiene y de qué tipo).
    TypeScript te avisa si te equivocas (ej: monto: number no acepta un texto).
    Se usa así: const pago: PagoInterface = { monto: 100, compraId: 1 };

  - any: le dice a TypeScript "no revises este dato, acepta cualquier cosa".
    Evita errores al compilar, pero pierdes el autocompletado y la protección.
    Se usa así: const pago: any = { monto: 100, compraId: 1 };

  Conclusión: usar interfaces es lo recomendado (código más seguro y claro);
  any solo se usa cuando no se conoce la forma del dato o para salir del paso.
*/
