import { Component, computed, inject, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { PageHeader } from '@/app/shared/components/page-header/page-header';
import { PagoService } from '../../services/pago.service';

@Component({
  selector: 'app-pago-form',
  imports: [RouterLink, PageHeader],
  templateUrl: './pago-form.html',
})
export class PagoForm {
  private readonly pagoService = inject(PagoService);

  /** Viene de la ruta :id/editar. Si no hay id, el formulario es para crear. */
  readonly id = input<string>();
  protected readonly esEdicion = computed(() => !!this.id());

  /** Viene de ?compraId=... cuando se registra el pago desde el detalle de una compra */
  readonly compraId = input<string>();

  // TODO: formulario reactivo con los campos de PagoRequest;
  // al guardar llamar a crear() o actualizar() según esEdicion()
}
