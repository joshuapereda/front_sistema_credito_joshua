import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { PageHeader } from '@/app/shared/components/page-header/page-header';
import { EmptyState } from '@/app/shared/components/empty-state/empty-state';
import { RolService } from '../../services/rol.service';

@Component({
  selector: 'app-rol-list',
  imports: [RouterLink, PageHeader, EmptyState],
  templateUrl: './rol-list.html',
})
export class RolList {
  private readonly rolService = inject(RolService);

  // TODO: cargar la lista con this.rolService.listar() y mostrarla en una tabla (.table)
}
