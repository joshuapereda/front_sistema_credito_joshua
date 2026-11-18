import { Component, HostListener, input, output } from '@angular/core';

@Component({
  selector: 'app-aviso-dialog',
  template: `
    @if (mensaje(); as msg) {
      <div class="overlay" (click)="cerrar.emit()">
        <div class="dialog" [class]="'dialog ' + tipo()" role="alertdialog" aria-modal="true"
             (click)="$event.stopPropagation()">
          <div class="icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"
                 stroke-linecap="round" stroke-linejoin="round">
              @switch (tipo()) {
                @case ('error') {
                  <path d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
                }
                @case ('info') {
                  <path d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" />
                }
                @default {
                  <path d="M4.5 12.75l6 6 9-13.5" />
                }
              }
            </svg>
          </div>
          <h2>{{ titulo() }}</h2>
          <p>{{ msg }}</p>
          <button class="btn" type="button" (click)="cerrar.emit()">{{ boton() }}</button>
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
      --c: #16a34a; --c-bg: #dcfce7; --c-ring: #f0fdf4; --c-btn: #BC1FC2; --c-btn-h: #a21caf;
      width: 100%; max-width: 380px;
      padding: 2rem 1.75rem 1.5rem;
      text-align: center;
      background: #fff;
      border-radius: 20px;
      box-shadow: 0 30px 60px -15px rgb(0 0 0 / 0.4);
      animation: pop 0.28s cubic-bezier(0.16, 1, 0.3, 1);
    }
    .dialog.error { --c: #dc2626; --c-bg: #fee2e2; --c-ring: #fef2f2; --c-btn: #dc2626; --c-btn-h: #b91c1c; }
    .dialog.info { --c: #4f46e5; --c-bg: #e0e7ff; --c-ring: #eef2ff; --c-btn: #4f46e5; --c-btn-h: #4338ca; }
    .icon {
      width: 4rem; height: 4rem; margin: 0 auto 1rem;
      display: flex; align-items: center; justify-content: center;
      border-radius: 50%;
      background: var(--c-bg); color: var(--c);
      box-shadow: 0 0 0 8px var(--c-ring);
    }
    .icon svg { width: 1.75rem; height: 1.75rem; }
    h2 { margin: 0 0 0.5rem; font-size: 1.25rem; font-weight: 700; color: #111827; }
    p { margin: 0; font-size: 0.9rem; line-height: 1.6; color: #6b7280; }
    .btn {
      width: 100%; margin-top: 1.75rem; padding: 0.7rem 1rem;
      border: none; border-radius: 12px;
      background: var(--c-btn); color: #fff;
      font: inherit; font-size: 0.9rem; font-weight: 600; cursor: pointer;
      box-shadow: 0 6px 16px rgb(0 0 0 / 0.18);
      transition: background 0.15s, transform 0.1s;
    }
    .btn:hover { background: var(--c-btn-h); }
    .btn:active { transform: scale(0.97); }
    .btn:focus-visible { outline: 3px solid rgb(99 102 241 / 0.4); outline-offset: 2px; }
    @keyframes fade { from { opacity: 0; } to { opacity: 1; } }
    @keyframes pop {
      from { opacity: 0; transform: translateY(16px) scale(0.95); }
      to { opacity: 1; transform: none; }
    }
    @media (prefers-reduced-motion: reduce) { .overlay, .dialog { animation: none; } }
  `,
})
export class AvisoDialog {
  mensaje = input<string | null>(null);
  titulo = input('Listo');
  tipo = input<'exito' | 'error' | 'info'>('exito');
  boton = input('Aceptar');
  cerrar = output<void>();

  @HostListener('document:keydown.escape')
  onEscape() {
    if (this.mensaje()) this.cerrar.emit();
  }
}
