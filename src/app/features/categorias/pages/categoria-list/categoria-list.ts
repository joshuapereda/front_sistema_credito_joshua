import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { PageHeader } from '@/app/shared/components/page-header/page-header';
import { EmptyState } from '@/app/shared/components/empty-state/empty-state';
import { CategoriaService } from '../../services/categoria.service';

@Component({
  selector: 'app-categoria-list',
  imports: [RouterLink, PageHeader, EmptyState],
  templateUrl: './categoria-list.html',
})
export class CategoriaList {
  private readonly categoriaService = inject(CategoriaService);

  // TODO: cargar la lista con this.categoriaService.listar() y mostrarla en una tabla (.table)
}
