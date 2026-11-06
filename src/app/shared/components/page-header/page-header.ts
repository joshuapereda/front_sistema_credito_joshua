import { Component, input } from '@angular/core';

/**
 * Encabezado de cada pantalla. Los botones de acción van dentro:
 * <app-page-header titulo="Categorías">
 *   <a class="btn btn-primary" routerLink="nuevo">Nueva categoría</a>
 * </app-page-header>
 */
@Component({
  selector: 'app-page-header',
  templateUrl: './page-header.html',
})
export class PageHeader {
  readonly titulo = input.required<string>();
  readonly subtitulo = input<string>();
}
