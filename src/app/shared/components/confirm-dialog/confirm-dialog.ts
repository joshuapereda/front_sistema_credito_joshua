import { Component, input, output } from '@angular/core';

/**
 * Diálogo de confirmación (por ejemplo, antes de eliminar).
 *
 * <app-confirm-dialog
 *   [abierto]="idAEliminar() !== null"
 *   mensaje="¿Eliminar esta categoría?"
 *   (confirmar)="eliminar()"
 *   (cancelar)="idAEliminar.set(null)"
 * />
 */
@Component({
  selector: 'app-confirm-dialog',
  templateUrl: './confirm-dialog.html',
})
export class ConfirmDialog {
  readonly abierto = input(false);
  readonly titulo = input('Confirmar');
  readonly mensaje = input('¿Estás seguro?');
  readonly textoConfirmar = input('Eliminar');

  readonly confirmar = output<void>();
  readonly cancelar = output<void>();
}
