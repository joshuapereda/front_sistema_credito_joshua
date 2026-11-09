import { Component, computed, inject, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { PageHeader } from '@/app/shared/components/page-header/page-header';
import { EmptyState } from '@/app/shared/components/empty-state/empty-state';
import { ProductoService } from '../../services/producto.service';

@Component({
  selector: 'app-producto-form',
  imports: [RouterLink, PageHeader, EmptyState],
  templateUrl: './producto-form.html',
})
export class ProductoForm {
  private readonly productoService = inject(ProductoService);

  /** Viene de la ruta :id/editar. Si no hay id, el formulario es para crear. */
  readonly id = input<string>();
  protected readonly esEdicion = computed(() => !!this.id());

  // TODO: formulario reactivo con los campos de ProductoRequest;
  // al guardar llamar a crear() o actualizar() según esEdicion()
}
