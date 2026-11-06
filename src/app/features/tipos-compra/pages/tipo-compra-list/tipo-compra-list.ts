import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { PageHeader } from '@/app/shared/components/page-header/page-header';
import { EmptyState } from '@/app/shared/components/empty-state/empty-state';
import { TipoCompraService } from '../../services/tipo-compra.service';

@Component({
  selector: 'app-tipo-compra-list',
  imports: [RouterLink, PageHeader, EmptyState],
  templateUrl: './tipo-compra-list.html',
})
export class TipoCompraList {
  private readonly tipoCompraService = inject(TipoCompraService);

  // TODO: cargar la lista con this.tipoCompraService.listar() y mostrarla en una tabla (.table)
}
