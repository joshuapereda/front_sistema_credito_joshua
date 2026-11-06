import { Component, input } from '@angular/core';

/**
 * Estado vacío: listas sin registros, pantallas pendientes, búsquedas sin resultado.
 * <app-empty-state titulo="Aún no hay categorías" mensaje="Crea la primera para empezar." />
 * Se puede poner un botón dentro: <app-empty-state ...><a class="btn btn-primary">...</a></app-empty-state>
 */
@Component({
  selector: 'app-empty-state',
  template: `
    <div
      class="flex flex-col items-center rounded-[10px] border border-dashed border-line-strong bg-surface/60 px-6 py-16 text-center"
    >
      <svg
        width="64"
        height="56"
        viewBox="0 0 64 56"
        fill="none"
        aria-hidden="true"
        class="text-line-strong"
      >
        <rect x="8.5" y="4.5" width="47" height="47" rx="3" stroke="currentColor" />
        <path d="M17 4.5v47" stroke="var(--color-accent)" stroke-opacity=".55" />
        <path
          d="M22 16.5h25M22 24.5h25M22 32.5h16"
          stroke="currentColor"
          stroke-linecap="round"
          stroke-dasharray="2 4"
        />
      </svg>
      <p class="mt-5 font-display text-[22px] font-[420] tracking-[-0.02em] text-ink">
        {{ titulo() }}
      </p>
      @if (mensaje()) {
        <p class="mt-1.5 max-w-[42ch] text-[14px] text-muted">{{ mensaje() }}</p>
      }
      <div class="mt-6 empty:hidden"><ng-content /></div>
    </div>
  `,
})
export class EmptyState {
  readonly titulo = input('No hay registros');
  readonly mensaje = input<string>();
}
