import { Component, computed, input } from '@angular/core';
import { EstadoCompra } from '../../models/compra.model';

/** Estado de una compra: <app-estado-compra-badge [estado]="compra.estado" /> */
@Component({
  selector: 'app-estado-compra-badge',
  template: `
    <span
      class="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 font-mono text-[10.5px] font-medium tracking-[0.1em] uppercase"
      [class]="estilo().fondo"
    >
      <span class="size-1.5 rounded-full" [class]="estilo().punto"></span>
      {{ estilo().texto }}
    </span>
  `,
})
export class EstadoCompraBadge {
  readonly estado = input.required<EstadoCompra>();

  protected readonly estilo = computed(() =>
    this.estado() === 'PAGADO'
      ? { texto: 'Pagado', fondo: 'bg-ok-soft text-ok', punto: 'bg-ok' }
      : { texto: 'Pendiente', fondo: 'bg-warn-soft text-warn', punto: 'bg-warn' },
  );
}
