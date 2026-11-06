import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { PageHeader } from '@/app/shared/components/page-header/page-header';
import { EmptyState } from '@/app/shared/components/empty-state/empty-state';
import { CompraService } from '../../services/compra.service';

@Component({
  selector: 'app-compra-list',
  imports: [RouterLink, PageHeader, EmptyState],
  templateUrl: './compra-list.html',
})
export class CompraList {
  private readonly compraService = inject(CompraService);

  // TODO: cargar la lista con this.compraService.listar() y mostrarla en una tabla (.table)
}
