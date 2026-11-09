import { Component, inject, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { PageHeader } from '@/app/shared/components/page-header/page-header';
import { EmptyState } from '@/app/shared/components/empty-state/empty-state';
import { UsuarioService } from '../../services/usuario.service';

@Component({
  selector: 'app-usuario-list',
  imports: [RouterLink, PageHeader, EmptyState],
  templateUrl: './usuario-list.html',
})
export class UsuarioList implements OnInit {
  ngOnInit(): void {
    this.funObtenerUsuarios();
  }
  //Variable que  va almacenar los usuarios
  private readonly usuarios=signal<any>([]);
  //inyectar servivio que creamos
  private readonly usuarioService = inject(UsuarioService);

  //funcion para optener usuarios
  funObtenerUsuarios(){
    this.usuarioService.funListar().subscribe({
      next:(res:any)=>{
        this.usuarios.set(res);
      },
      error:(error)=>{
        console.log(error);
      }
    })
  }
}
