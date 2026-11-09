import { Component, inject, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { PageHeader } from '@/app/shared/components/page-header/page-header';
import { EmptyState } from '@/app/shared/components/empty-state/empty-state';
import { TipoCompraService } from '../../services/tipo-compra.service';

@Component({
  selector: 'app-tipo-compra-list',
  imports: [RouterLink, PageHeader, EmptyState],
  templateUrl: './tipo-compra-list.html',
})
export class TipoCompraList implements OnInit {
  ngOnInit(): void {
    this.funObjtenerTipoCompra();
  }

  //Variable que va almacenar los tipos de compra
  private readonly tipoCompras= signal<any>([]);
  //Inyectar servicios
  private readonly tipoCompraService = inject(TipoCompraService);

  funObjtenerTipoCompra(){
    this.tipoCompraService.funListarTipoCompra().subscribe({
      next:(res:any)=>{
        this.tipoCompras.set(res);
      },
      error:(error)=>{
        console.log(error);
      }
    })
  }


}
