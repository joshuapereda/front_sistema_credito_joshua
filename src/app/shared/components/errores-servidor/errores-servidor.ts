import { Component, input } from '@angular/core';

/**
 * Recuadro rojo de error. Es el único diseño de errores de los formularios.
 * Errores generales del back: <app-errores-servidor [mensajes]="errorServidor()" />
 * Para un campo se usa <app-error-campo>, que lleva este recuadro por dentro.
 */
@Component({
  selector: 'app-errores-servidor',
  //sin errores no ocupa espacio
  host: { class: 'block empty:hidden' },
  template: `
    @if (mensajes().length) {
      <div
        class="flex items-start gap-2 rounded-lg border border-l-[3px] border-red-200 border-l-red-500 bg-red-50 px-2.5 py-2 text-[12.5px] leading-snug font-medium text-red-700"
        role="alert"
      >
        <svg
          class="mt-px size-4 shrink-0"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          aria-hidden="true"
        >
          <circle cx="12" cy="12" r="9" />
          <path d="M12 7.5v5M12 16.2v.1" />
        </svg>
        <div class="min-w-0 wrap-anywhere">
          @for (m of mensajes(); track m) {
            <p class="m-0">{{ m }}</p>
          }
        </div>
      </div>
    }
  `,
})
export class ErroresServidor {
  readonly mensajes = input.required<string[]>();
}
