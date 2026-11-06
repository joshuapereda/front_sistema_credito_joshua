import { Component, input } from '@angular/core';

/** Mensaje para listas vacías: <app-empty-state mensaje="No hay categorías registradas" /> */
@Component({
  selector: 'app-empty-state',
  template: `
    <div class="card text-center text-sm text-gray-500">
      {{ mensaje() }}
    </div>
  `,
})
export class EmptyState {
  readonly mensaje = input('No hay registros');
}
