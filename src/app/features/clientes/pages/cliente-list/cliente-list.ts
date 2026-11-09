import { Component, inject, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { PageHeader } from '@/app/shared/components/page-header/page-header';
import { EmptyState } from '@/app/shared/components/empty-state/empty-state';
import { ClienteService } from '../../services/cliente.service';

@Component({
  selector: 'app-cliente-list',
  imports: [RouterLink, PageHeader, EmptyState],
  templateUrl: './cliente-list.html',
})
export class ClienteList implements OnInit {
  ngOnInit(): void {
   this.funObtenerPersona();
  }
  private readonly personas=signal<any>([]);
  private readonly clienteService = inject(ClienteService);

  funObtenerPersona(){
    this.clienteService.funListarPersona().subscribe({
      next:(res:any)=>{
        this.personas.set(res);
      },
      error:(error)=>{
        console.log(error);
      }
    })
  }
}
