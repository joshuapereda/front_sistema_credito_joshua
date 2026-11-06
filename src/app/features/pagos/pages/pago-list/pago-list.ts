import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { PageHeader } from '@/app/shared/components/page-header/page-header';
import { EmptyState } from '@/app/shared/components/empty-state/empty-state';
import { PagoService } from '../../services/pago.service';

@Component({
  selector: 'app-pago-list',
  imports: [RouterLink, PageHeader, EmptyState],
  templateUrl: './pago-list.html',
})
export class PagoList {
  private readonly pagoService = inject(PagoService);

  // TODO: cargar la lista con this.pagoService.listar() y mostrarla en una tabla (.table)
}
