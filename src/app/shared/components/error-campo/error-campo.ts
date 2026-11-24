import { Component, computed, effect, input, signal } from '@angular/core';
import { AbstractControl } from '@angular/forms';
import { ErroresServidor } from '../errores-servidor/errores-servidor';

/**
 * Mensaje de error debajo de un campo.
 * <app-error-campo [control]="clienteForm.controls.nombre" />
 */
@Component({
  selector: 'app-error-campo',
  imports: [ErroresServidor],
  //sin error no ocupa espacio
  host: { class: 'block empty:hidden' },
  template: `
    @if (mensaje(); as m) {
      <app-errores-servidor [mensajes]="[m]" />
    }
  `,
})
export class ErrorCampo {
  readonly control = input.required<AbstractControl>();
  private readonly cambios = signal(0);

  constructor() {
    //avisa cada vez que el campo cambia de valor, estado o es tocado
    effect((onCleanup) => {
      const sub = this.control().events.subscribe(() => this.cambios.update((n) => n + 1));
      onCleanup(() => sub.unsubscribe());
    });
  }

  //primero el mensaje del back, luego el del formulario
  protected readonly mensaje = computed<string | null>(() => {
    this.cambios();
    const c = this.control();
    if (!c.touched || !c.errors) return null;
    return c.errors['servidor'] ?? c.errors['mensaje'] ?? 'El valor ingresado no es válido';
  });
}
