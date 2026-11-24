import { Component, input } from '@angular/core';

/**
 * Errores del back que no son de un campo en particular.
 * <app-errores-servidor [mensajes]="errorServidor()" />
 */
@Component({
  selector: 'app-errores-servidor',
  template: `
    @if (mensajes().length) {
      <div
        class="rounded-lg border border-l-[3px] border-red-200 border-l-red-500 bg-red-50 px-2.5 py-2 text-[13px] font-medium text-red-700"
        role="alert"
      >
        @for (m of mensajes(); track m) {
          <p class="m-0">{{ m }}</p>
        }
      </div>
    }
  `,
})
export class ErroresServidor {
  readonly mensajes = input.required<string[]>();
}
