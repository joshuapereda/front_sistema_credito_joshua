import { Component, computed, inject, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { PageHeader } from '@/app/shared/components/page-header/page-header';
import { CompraService } from '../../services/compra.service';

@Component({
  selector: 'app-compra-form',
  imports: [RouterLink, PageHeader],
  templateUrl: './compra-form.html',
})
export class CompraForm {
  private readonly compraService = inject(CompraService);

  /** Viene de la ruta :id/editar. Si no hay id, el formulario es para crear. */
  readonly id = input<string>();
  protected readonly esEdicion = computed(() => !!this.id());

  // TODO: formulario reactivo con los campos de CompraRequest;
  // al guardar llamar a crear() o actualizar() según esEdicion()
}
