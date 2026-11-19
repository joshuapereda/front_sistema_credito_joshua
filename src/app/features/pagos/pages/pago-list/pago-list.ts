import { Component, computed, HostListener, inject, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { PageHeader } from '@/app/shared/components/page-header/page-header';
import { EmptyState } from '@/app/shared/components/empty-state/empty-state';
import { PagoService } from '../../services/pago.service';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CurrencyPipe, DatePipe, DecimalPipe } from '@angular/common';
import { PagoInterface, PagoRequest } from '../../Interfaces/PagoInterface';
import { CompraInterface } from '@/app/features/compras/interfaces/CompraInterface';
import { HttpErrorResponse } from '@angular/common/http';

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
  protected readonly pagos=signal<PagoInterface[]>([]);
  protected readonly compras=signal<CompraInterface[]>([]);
  private readonly pagoService = inject(PagoService);
  protected readonly crearPago = signal(false);
  //si edito o no - obtener id
  protected readonly user_id = signal<number>(-1);
  protected readonly compraEditandoId = signal<number | null>(null);
  protected readonly montoOriginal = signal<number>(0);

  //------------- LISTADO COMPRA --------------//
  funObtenerCompra(){
    this.pagoService.funListarCompra().subscribe({
      next:(res:CompraInterface[])=>{
        this.compras.set(res);
      },
      error:(error:HttpErrorResponse)=>{
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
      next:(res:PagoInterface[])=>{
        this.pagos.set(res);
      },
      error:(error:HttpErrorResponse)=>{
        console.log(error);
      }
    })
  }

  //---------------- FORMULARIO ----------------//
  protected readonly pagoForm = new FormGroup({
    compraId: new FormControl<number | null>(null, Validators.required),
    monto: new FormControl<number | null>(null, [Validators.required, Validators.min(0.01)]),
  });
  protected readonly comprasPendientes = computed(() =>
  this.compras().filter(c => c.saldo > 0 || c.id === this.compraEditandoId())
  );
  // Compra elegida en el select
  protected compraSel() {
    const id = this.pagoForm.controls.compraId.value;
    return this.compras().find(c => c.id === id) ?? null;
  }
  //------------- GUARDAR PAGO ---------------//
  funGuardarPago() {
    //validar si esta editando o creando
    if (this.user_id() !== -1) {
      //EDITAR
      if (this.pagoForm.invalid) {
        this.pagoForm.markAllAsTouched();
        return;
      }
      const { compraId, monto } = this.pagoForm.getRawValue();
      if (compraId === null || monto === null) return;
      const pago: PagoRequest = { compraId, monto };

      this.pagoService.funEditar(this.user_id(), pago).subscribe({
        next: () => {
          this.funObtenerPago();
          this.cerrarModal();
        },
        error: (err) => console.error('Error al editar el pago', err),
      });
    } else {
    if (this.pagoForm.invalid) {
      this.pagoForm.markAllAsTouched();
      return;
    }

    const { monto, compraId } = this.pagoForm.getRawValue();
    if (compraId === null || monto === null) return;
    const pago: PagoRequest = { monto, compraId };

    this.pagoService.funGuarda(pago).subscribe({
      next: () => {
        this.cerrarModal();
        this.funObtenerPago();
        this.funObtenerCompra(); // refresca el saldo
      },
      error: (error) => console.log(error),
    });
  }}
  //------------- EDITAR ---------------//
  funEditarPago(pg: PagoInterface) {
     console.log('compra encontrada:', this.compras().find(c => c.id === pg.compraId));
    //almacenar el id al dar click
    this.user_id.set(pg.id)
    this.compraEditandoId.set(pg.compraId);
    this.montoOriginal.set(pg.monto);
    //precargar los datos ya registrado
    this.pagoForm.patchValue({
      compraId: pg.compraId,
      monto: pg.monto,
    });
  }

  //------------- MODAL ---------------//
  abrir(compra: any) {
    this.crearPago.set(compra);
  }
  cerrarModal() {
  this.crearPago.set(false);
  this.pagoForm.reset({ monto: null, compraId: null });
  this.user_id.set(-1);
  this.compraEditandoId.set(null);
  this.montoOriginal.set(0);
}
  @HostListener('document:keydown.escape')
  onEscape() {
    if (this.crearPago()) this.cerrarModal();
  }
}
