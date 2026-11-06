import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { PageHeader } from '@/app/shared/components/page-header/page-header';
import { EmptyState } from '@/app/shared/components/empty-state/empty-state';
import { ProductoService } from '../../services/producto.service';

@Component({
  selector: 'app-producto-list',
  imports: [RouterLink, PageHeader, EmptyState],
  templateUrl: './producto-list.html',
})
export class ProductoList {
  private readonly productoService = inject(ProductoService);

  // TODO: cargar la lista con this.productoService.listar() y mostrarla en una tabla (.table)
}
