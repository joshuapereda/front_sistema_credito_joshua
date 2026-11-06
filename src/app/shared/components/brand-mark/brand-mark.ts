import { Component, input } from '@angular/core';

/**
 * Marca del sistema: un folio de libro contable (renglones + margen) y el nombre.
 * <app-brand-mark />  ·  <app-brand-mark tono="claro" />  ·  <app-brand-mark [soloIcono]="true" />
 */
@Component({
  selector: 'app-brand-mark',
  template: `
    <span class="inline-flex items-center gap-2.5">
      <svg
        width="28"
        height="28"
        viewBox="0 0 28 28"
        fill="none"
        aria-hidden="true"
        [class]="tono() === 'claro' ? 'text-paper' : 'text-ink'"
      >
        <rect x="1" y="1" width="26" height="26" rx="5" fill="currentColor" />
        <path d="M8 1v26" stroke="var(--color-accent)" stroke-width="1.6" />
        <path
          d="M11.5 9.5h10M11.5 14h10M11.5 18.5h6"
          [attr.stroke]="tono() === 'claro' ? 'var(--color-ink)' : 'var(--color-paper)'"
          stroke-width="1.6"
          stroke-linecap="round"
        />
      </svg>
      @if (!soloIcono()) {
        <span class="leading-none">
          <span
            class="block font-display text-[19px] font-medium tracking-[-0.02em]"
            [class]="tono() === 'claro' ? 'text-paper' : 'text-ink'"
            >Crédito</span
          >
          <span
            class="mt-0.5 block font-mono text-[9.5px] tracking-[0.18em] uppercase"
            [class]="tono() === 'claro' ? 'text-paper/55' : 'text-muted'"
            >Sistema de ventas</span
          >
        </span>
      }
    </span>
  `,
})
export class BrandMark {
  readonly tono = input<'oscuro' | 'claro'>('oscuro');
  readonly soloIcono = input(false);
}
