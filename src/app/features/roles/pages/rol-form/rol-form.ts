import { Component, computed, inject, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { PageHeader } from '@/app/shared/components/page-header/page-header';
import { EmptyState } from '@/app/shared/components/empty-state/empty-state';
import { RolService } from '../../services/rol.service';

@Component({
  selector: 'app-rol-form',
  imports: [RouterLink, PageHeader, EmptyState],
  templateUrl: './rol-form.html',
})
export class RolForm {
  private readonly rolService = inject(RolService);

  /** Viene de la ruta :id/editar. Si no hay id, el formulario es para crear. */
  readonly id = input<string>();
  protected readonly esEdicion = computed(() => !!this.id());

  // TODO: formulario reactivo con los campos de RolRequest;
  // al guardar llamar a crear() o actualizar() según esEdicion()
}
