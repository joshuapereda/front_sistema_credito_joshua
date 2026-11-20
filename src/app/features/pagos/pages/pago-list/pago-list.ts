import { Component, computed, HostListener, inject, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { PageHeader } from '@/app/shared/components/page-header/page-header';
import { EmptyState } from '@/app/shared/components/empty-state/empty-state';
import { PagoService } from '../../services/pago.service';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CurrencyPipe, DatePipe, DecimalPipe } from '@angular/common';
import { PagoFilterCriteria, PagoInterface, PagoRequest } from '../../Interfaces/PagoInterface';
import { CompraInterface } from '@/app/features/compras/interfaces/CompraInterface';
import { HttpErrorResponse } from '@angular/common/http';
import { PageableRequest } from '@/app/shared/interfaces/pageable.interface';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';

@Component({
  selector: 'app-pago-list',
  imports: [RouterLink, PageHeader, EmptyState,ReactiveFormsModule,CurrencyPipe,DatePipe,DecimalPipe, FormsModule, MatPaginatorModule],
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
  //paginacion y filtro
  protected readonly totalElementos = signal(0);
  protected readonly pageIndex = signal(0);
  protected readonly pageSize = signal(5);
  protected filterValue = '';

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
  //------------- LISTADO ---------------//
  funObtenerPago(){
    //Paginacion y filtrado
    const req: PageableRequest<PagoFilterCriteria> = {
          pageNumber: this.pageIndex(),
          pageSize: this.pageSize(),
          sortField: 'id',
          sortOrder: 'desc',
          criterials: null,
          filterValue: this.filterValue,
    };
    //funPaginarPago-OBTIENE UN LISTADO EPRO CON PAGINACION
    //funListarPago-LISTA PERO SIN PAGINACION
    this.pagoService.funPaginarPago(req).subscribe({
      next:(res)=>{
        this.pagos.set(res.content);
        this.totalElementos.set(res.totalElements);
      },
      error:(error:HttpErrorResponse)=>{
        console.log(error);
      }
    })
  }
  cambiarPagina(e: PageEvent) {
    this.pageIndex.set(e.pageIndex);
    this.pageSize.set(e.pageSize);
    this.funObtenerPago();
  }
   buscar() {
    this.pageIndex.set(0);
    this.funObtenerPago();
  }
  limpiar() {
    this.filterValue = '';
    this.buscar();
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
