import { Component, computed, inject, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { PageHeader } from '@/app/shared/components/page-header/page-header';
import { EmptyState } from '@/app/shared/components/empty-state/empty-state';
import { UsuarioService } from '../../services/usuario.service';

@Component({
  selector: 'app-usuario-form',
  imports: [RouterLink, PageHeader, EmptyState],
  templateUrl: './usuario-form.html',
})
export class UsuarioForm {
  private readonly usuarioService = inject(UsuarioService);

  /** Viene de la ruta :id/editar. Si no hay id, el formulario es para crear. */
  readonly id = input<string>();
  protected readonly esEdicion = computed(() => !!this.id());

  // TODO: formulario reactivo con los campos de UsuarioRequest;
  // al guardar llamar a crear() o actualizar() según esEdicion()
}
