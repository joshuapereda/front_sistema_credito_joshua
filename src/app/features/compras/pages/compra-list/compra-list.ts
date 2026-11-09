import { Component, HostListener, inject, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { PageHeader } from '@/app/shared/components/page-header/page-header';
import { EmptyState } from '@/app/shared/components/empty-state/empty-state';
import { CompraService } from '../../services/compra.service';

@Component({
  selector: 'app-compra-list',
  imports: [RouterLink, PageHeader, EmptyState, CurrencyPipe, DatePipe],
  templateUrl: './compra-list.html',
})
export class CompraList implements OnInit {
  private readonly compraService = inject(CompraService);

  protected readonly compras = signal<any[]>([]);
  protected readonly compraSeleccionada = signal<any | null>(null);

  ngOnInit(): void {
    this.funObtenerVenta();
  }

  funObtenerVenta() {
    this.compraService.funListarCompra().subscribe({
      next: (res: any) => {
        this.compras.set(res);
      },
      error: (error) => {
        console.log(error);
      },
    });
  }

  abrir(compra: any) {
    this.compraSeleccionada.set(compra);
  }

  @HostListener('document:keydown.escape')
  cerrar() {
    this.compraSeleccionada.set(null);
  }
}
