import { Component, computed, inject, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { PageHeader } from '@/app/shared/components/page-header/page-header';
import { ClienteService } from '../../services/cliente.service';

@Component({
  selector: 'app-cliente-form',
  imports: [RouterLink, PageHeader],
  templateUrl: './cliente-form.html',
})
export class ClienteForm {
  private readonly clienteService = inject(ClienteService);

  /** Viene de la ruta :id/editar. Si no hay id, el formulario es para crear. */
  readonly id = input<string>();
  protected readonly esEdicion = computed(() => !!this.id());

  // TODO: formulario reactivo con los campos de ClienteRequest;
  // al guardar llamar a crear() o actualizar() según esEdicion()
}
