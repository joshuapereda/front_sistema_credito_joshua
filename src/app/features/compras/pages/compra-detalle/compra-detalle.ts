import { Component, inject, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { PageHeader } from '@/app/shared/components/page-header/page-header';
import { EmptyState } from '@/app/shared/components/empty-state/empty-state';
import { CompraService } from '../../services/compra.service';

@Component({
  selector: 'app-compra-detalle',
  imports: [RouterLink, PageHeader, EmptyState],
  templateUrl: './compra-detalle.html',
})
export class CompraDetalle {
  private readonly compraService = inject(CompraService);

  /** Viene de la ruta :id */
  readonly id = input.required<string>();

  // TODO: cargar con this.compraService.obtener(), mostrar cabecera, detalles y
  // el estado con <app-estado-compra-badge>; botón "Registrar pago" -> /pagos/nuevo?compraId=id
}
