import { Component, computed, HostListener, inject, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { PageHeader } from '@/app/shared/components/page-header/page-header';
import { EmptyState } from '@/app/shared/components/empty-state/empty-state';
import { PagoService } from '../../services/pago.service';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CurrencyPipe, DatePipe, DecimalPipe } from '@angular/common';

@Component({
  selector: 'app-pago-list',
  imports: [RouterLink, PageHeader, EmptyState,ReactiveFormsModule,CurrencyPipe,DatePipe,DecimalPipe],
  templateUrl: './pago-list.html',
})
export class PagoList implements OnInit {
  ngOnInit(): void {
   this.funObtenerPago();
   this.funObtenerCompra();
  }
  protected readonly pagos=signal<any[]>([]);
  protected readonly compras=signal<any[]>([]);
  private readonly pagoService = inject(PagoService);
  protected readonly crearPago = signal(false);

  //------------- LISTADO COMPRA --------------//
  funObtenerCompra(){
    this.pagoService.funListarCompra().subscribe({
      next:(res:any)=>{
        this.compras.set(res);
      },
      error:(error)=>{
        console.log(error);
      }
    })
  }
  //Para obtener el nombre de la compra (la compra no tiene "nombre": se arma con cliente, id y saldo)
  protected nombreCompra(id: number | null): string {
    const c = this.compras().find(x => x.id === id);
    return c ? `#${c.id} · ${c.cliente}` : '—';
  }
  //------------- LISTADO PAGO ---------------//
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

  //---------------- FORMULARIO ----------------//
  protected readonly pagoForm = new FormGroup({
    compraId: new FormControl<number | null>(null, Validators.required),
    monto: new FormControl<number | null>(null, [Validators.required, Validators.min(0.01)]),
  });
  // Mostrar Solo compras con deuda pendiente, en el select
  protected readonly comprasPendientes = computed(() =>
    this.compras().filter(c => c.saldo > 0)
  );
  // Compra elegida en el select
  protected compraSel() {
    const id = this.pagoForm.controls.compraId.value;
    return this.compras().find(c => c.id === id) ?? null;
  }
  //------------- GUARDAR PAGO ---------------//
  funGuardarPago() {
    if (this.pagoForm.invalid) {
      this.pagoForm.markAllAsTouched();
      return;
    }

    const { monto, compraId } = this.pagoForm.getRawValue();

    const pago = {
      monto,
      compraId,

    };

    this.pagoService.funGuarda(pago).subscribe({
      next: () => {
        this.cerrarModal();
        this.funObtenerPago();
        this.funObtenerCompra(); // refresca el saldo
      },
      error: (error) => console.log(error),
    });
  }

  //------------- MODAL ---------------//
  abrir(compra: any) {
    this.crearPago.set(compra);
  }
  cerrarModal() {
    this.crearPago.set(false);
    this.pagoForm.reset({ monto: null, compraId: null });
  }
  @HostListener('document:keydown.escape')
  onEscape() {
    if (this.crearPago()) this.cerrarModal();
  }
}
