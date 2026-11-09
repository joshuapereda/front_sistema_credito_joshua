import { Component, inject, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { PageHeader } from '@/app/shared/components/page-header/page-header';
import { EmptyState } from '@/app/shared/components/empty-state/empty-state';
import { CategoriaService } from '../../services/categoria.service';

@Component({
  selector: 'app-categoria-list',
  imports: [RouterLink, PageHeader, EmptyState],
  templateUrl: './categoria-list.html',
})
export class CategoriaList implements OnInit {
  ngOnInit(): void {
   this.funObtenerCategoria();
  }
  //aca va almacenar los usuarios
  categorias=signal<any>([]);
  //inyectar servivio que creamos
  private readonly categoriaService = inject(CategoriaService);

  funObtenerCategoria(){
    this.categoriaService.funListarCategoria().subscribe({
      next:(res:any)=>{
        this.categorias.set(res);
      },
      error(err) {
        console.log(err);
      },
    })
  }

}
