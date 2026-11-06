import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { PageHeader } from '@/app/shared/components/page-header/page-header';
import { EmptyState } from '@/app/shared/components/empty-state/empty-state';
import { PermisoService } from '../../services/permiso.service';

@Component({
  selector: 'app-permiso-list',
  imports: [RouterLink, PageHeader, EmptyState],
  templateUrl: './permiso-list.html',
})
export class PermisoList {
  private readonly permisoService = inject(PermisoService);

  // TODO: cargar la lista con this.permisoService.listar() y mostrarla en una tabla (.table)
}
