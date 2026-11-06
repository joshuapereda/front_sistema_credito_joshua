import { Component, computed, inject, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { PageHeader } from '@/app/shared/components/page-header/page-header';
import { CategoriaService } from '../../services/categoria.service';

@Component({
  selector: 'app-categoria-form',
  imports: [RouterLink, PageHeader],
  templateUrl: './categoria-form.html',
})
export class CategoriaForm {
  private readonly categoriaService = inject(CategoriaService);

  /** Viene de la ruta :id/editar. Si no hay id, el formulario es para crear. */
  readonly id = input<string>();
  protected readonly esEdicion = computed(() => !!this.id());

  // TODO: formulario reactivo con los campos de CategoriaRequest;
  // al guardar llamar a crear() o actualizar() según esEdicion()
}
