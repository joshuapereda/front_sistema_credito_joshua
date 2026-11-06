import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { PageHeader } from '@/app/shared/components/page-header/page-header';
import { EmptyState } from '@/app/shared/components/empty-state/empty-state';
import { UsuarioService } from '../../services/usuario.service';

@Component({
  selector: 'app-usuario-list',
  imports: [RouterLink, PageHeader, EmptyState],
  templateUrl: './usuario-list.html',
})
export class UsuarioList {
  private readonly usuarioService = inject(UsuarioService);

  // TODO: cargar la lista con this.usuarioService.listar() y mostrarla en una tabla (.table)
}
