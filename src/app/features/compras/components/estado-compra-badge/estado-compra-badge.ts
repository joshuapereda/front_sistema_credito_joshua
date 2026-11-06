import { Component, computed, input } from '@angular/core';
import { EstadoCompra } from '../../models/compra.model';

/** Etiqueta de color para el estado de una compra: <app-estado-compra-badge [estado]="compra.estado" /> */
@Component({
  selector: 'app-estado-compra-badge',
  template: `<span class="rounded-full px-2.5 py-0.5 text-xs font-semibold" [class]="clases()">{{
    texto()
  }}</span>`,
})
export class EstadoCompraBadge {
  readonly estado = input.required<EstadoCompra>();

  protected readonly texto = computed(() => (this.estado() === 'PAGADO' ? 'Pagado' : 'Pendiente'));
  protected readonly clases = computed(() =>
    this.estado() === 'PAGADO' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700',
  );
}
