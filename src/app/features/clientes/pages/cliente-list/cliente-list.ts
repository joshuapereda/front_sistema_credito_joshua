import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { PageHeader } from '@/app/shared/components/page-header/page-header';
import { EmptyState } from '@/app/shared/components/empty-state/empty-state';
import { ClienteService } from '../../services/cliente.service';

@Component({
  selector: 'app-cliente-list',
  imports: [RouterLink, PageHeader, EmptyState],
  templateUrl: './cliente-list.html',
})
export class ClienteList {
  private readonly clienteService = inject(ClienteService);

  // TODO: cargar la lista con this.clienteService.listar() y mostrarla en una tabla (.table)
}
