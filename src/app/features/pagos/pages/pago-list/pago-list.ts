import { Component, inject, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { PageHeader } from '@/app/shared/components/page-header/page-header';
import { EmptyState } from '@/app/shared/components/empty-state/empty-state';
import { PagoService } from '../../services/pago.service';

@Component({
  selector: 'app-pago-list',
  imports: [RouterLink, PageHeader, EmptyState],
  templateUrl: './pago-list.html',
})
export class PagoList implements OnInit {
  ngOnInit(): void {
   this.funObtenerPago();
  }
  private readonly pagos=signal<any>([]);
  private readonly pagoService = inject(PagoService);

  funObtenerPago(){
    this.pagoService.funListarPago().subscribe({
      next:(res:any)=>{
        this.pagos.set(res);
      },
      error:(error)=>{
        console.log(error);
      }
    })
  }
}
