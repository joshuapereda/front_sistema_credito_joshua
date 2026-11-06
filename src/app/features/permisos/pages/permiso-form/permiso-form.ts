import { Component, computed, inject, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { PageHeader } from '@/app/shared/components/page-header/page-header';
import { PermisoService } from '../../services/permiso.service';

@Component({
  selector: 'app-permiso-form',
  imports: [RouterLink, PageHeader],
  templateUrl: './permiso-form.html',
})
export class PermisoForm {
  private readonly permisoService = inject(PermisoService);

  /** Viene de la ruta :id/editar. Si no hay id, el formulario es para crear. */
  readonly id = input<string>();
  protected readonly esEdicion = computed(() => !!this.id());

  // TODO: formulario reactivo con los campos de PermisoRequest;
  // al guardar llamar a crear() o actualizar() según esEdicion()
}
