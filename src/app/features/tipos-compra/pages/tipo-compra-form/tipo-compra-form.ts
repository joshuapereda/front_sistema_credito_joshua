import { Component, computed, inject, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { PageHeader } from '@/app/shared/components/page-header/page-header';
import { EmptyState } from '@/app/shared/components/empty-state/empty-state';
import { TipoCompraService } from '../../services/tipo-compra.service';

@Component({
  selector: 'app-tipo-compra-form',
  imports: [RouterLink, PageHeader, EmptyState],
  templateUrl: './tipo-compra-form.html',
})
export class TipoCompraForm {
  private readonly tipoCompraService = inject(TipoCompraService);

  /** Viene de la ruta :id/editar. Si no hay id, el formulario es para crear. */
  readonly id = input<string>();
  protected readonly esEdicion = computed(() => !!this.id());

  // TODO: formulario reactivo con los campos de TipoCompraRequest;
  // al guardar llamar a crear() o actualizar() según esEdicion()
}
