import { Component, inject, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { PageHeader } from '@/app/shared/components/page-header/page-header';
import { EmptyState } from '@/app/shared/components/empty-state/empty-state';
import { ProductoService } from '../../services/producto.service';

@Component({
  selector: 'app-producto-list',
  imports: [RouterLink, PageHeader, EmptyState],
  templateUrl: './producto-list.html',
})
export class ProductoList  implements OnInit{
   ngOnInit(): void {
    this.funObtenerProducto();
   }
   private readonly productos=signal<any> ([]);
   private readonly productoService = inject(ProductoService);

   funObtenerProducto(){
    this.productoService.funListarProducto().subscribe({
      next:(res:any)=>{
        this.productos.set(res);
      },
      error:(error)=>{
        console.log(error);
      }
    })
   }
}
