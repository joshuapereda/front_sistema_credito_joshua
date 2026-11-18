import { Component, HostListener, input, output } from '@angular/core';

@Component({
  selector: 'app-confirm-dialog',
  template: `
    @if (nombre(); as n) {
      <div class="overlay" (click)="cancelar.emit()">
        <div class="dialog" role="alertdialog" aria-modal="true" (click)="$event.stopPropagation()">
          <div class="icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
              <path stroke-linecap="round" stroke-linejoin="round"
                d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
            </svg>
          </div>
          <h2>{{ titulo() }}</h2>
          <p>Estás por eliminar <strong>{{ n }}</strong>.<br />Esta acción no se puede deshacer.</p>
          <div class="actions">
            <button class="btn btn-ghost" type="button" (click)="cancelar.emit()">Cancelar</button>
            <button class="btn btn-danger" type="button" (click)="confirmar.emit()">Sí, eliminar</button>
          </div>
        </div>
      </div>
    }
  `,
  styles: `
    .overlay {
      position: fixed; inset: 0; z-index: 1000;
      display: flex; align-items: center; justify-content: center;
      padding: 1rem;
      background: rgb(15 23 42 / 0.5);
      backdrop-filter: blur(6px);
      animation: fade 0.2s ease-out;
    }
    .dialog {
      width: 100%; max-width: 380px;
      padding: 2rem 1.75rem 1.5rem;
      text-align: center;
      background: #fff;
      border-radius: 20px;
      box-shadow: 0 30px 60px -15px rgb(0 0 0 / 0.4);
      animation: pop 0.28s cubic-bezier(0.16, 1, 0.3, 1);
    }
    .icon {
      width: 4rem; height: 4rem; margin: 0 auto 1rem;
      display: flex; align-items: center; justify-content: center;
      border-radius: 50%;
      background: #fee2e2; color: #dc2626;
      box-shadow: 0 0 0 8px #fef2f2;
    }
    .icon svg { width: 1.75rem; height: 1.75rem; }
    h2 { margin: 0 0 0.5rem; font-size: 1.25rem; font-weight: 700; color: #111827; }
    p { margin: 0; font-size: 0.9rem; line-height: 1.6; color: #6b7280; }
    strong { color: #111827; font-weight: 600; }
    .actions { display: flex; gap: 0.75rem; margin-top: 1.75rem; }
    .btn {
      flex: 1; padding: 0.7rem 1rem;
      border: 1px solid transparent; border-radius: 12px;
      font: inherit; font-size: 0.9rem; font-weight: 600; cursor: pointer;
      transition: background 0.15s, transform 0.1s, box-shadow 0.15s;
    }
    .btn:active { transform: scale(0.97); }
    .btn:focus-visible { outline: 3px solid rgb(99 102 241 / 0.4); outline-offset: 2px; }
    .btn-ghost { background: #fff; border-color: #d1d5db; color: #374151; }
    .btn-ghost:hover { background: #f3f4f6; }
    .btn-danger { background: #dc2626; color: #fff; box-shadow: 0 6px 16px rgb(220 38 38 / 0.35); }
    .btn-danger:hover { background: #b91c1c; }
    @keyframes fade { from { opacity: 0; } to { opacity: 1; } }
    @keyframes pop {
      from { opacity: 0; transform: translateY(16px) scale(0.95); }
      to { opacity: 1; transform: none; }
    }
    @media (max-width: 400px) { .actions { flex-direction: column-reverse; } }
    @media (prefers-reduced-motion: reduce) { .overlay, .dialog { animation: none; } }
  `,
})
export class ConfirmDialog {
  nombre = input<string | null>(null);
  titulo = input('¿Eliminar?');
  confirmar = output<void>();
  cancelar = output<void>();

  @HostListener('document:keydown.escape')
  onEscape() {
    if (this.nombre()) this.cancelar.emit();
  }
}
