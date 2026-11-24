import { Component, computed, HostListener, inject, OnInit, signal, TemplateRef, ViewChild } from '@angular/core';
import { RouterLink } from '@angular/router';
import { PageHeader } from '@/app/shared/components/page-header/page-header';
import { EmptyState } from '@/app/shared/components/empty-state/empty-state';
import { ErrorCampo } from '@/app/shared/components/error-campo/error-campo';
import { ErroresServidor } from '@/app/shared/components/errores-servidor/errores-servidor';
import { aplicarErroresServidor } from '@/app/shared/validators/errores-servidor';
import { digitos, noVacio, reglas } from '@/app/shared/validators/reglas';
import { PagoService } from '../../services/pago.service';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CurrencyPipe, DatePipe, DecimalPipe } from '@angular/common';
import { PagoFilterCriteria, PagoInterface, PagoRequest } from '../../Interfaces/PagoInterface';
import { CompraInterface } from '@/app/features/compras/interfaces/CompraInterface';
import { HttpErrorResponse } from '@angular/common/http';
import { PageableRequest } from '@/app/shared/interfaces/pageable.interface';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { TicketPago } from '../../ticket-pago/ticket-pago';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';

@Component({
  selector: 'app-pago-list',
  imports: [RouterLink, PageHeader, EmptyState,ReactiveFormsModule,CurrencyPipe,DatePipe,DecimalPipe, FormsModule, MatPaginatorModule,TicketPago,MatDialogModule, ErrorCampo, ErroresServidor],
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
  //errores del back que no son de un campo
  protected readonly errorServidor = signal<string[]>([]);
  protected readonly compraEditandoId = signal<number | null>(null);
  protected readonly montoOriginal = signal<number>(0);
  //paginacion y filtro
  protected readonly totalElementos = signal(0);
  protected readonly pageIndex = signal(0);
  protected readonly pageSize = signal(5);
  protected filterValue = '';
  //impresion
  //Te da el “abridor de ventanas” de Angular Material. Sin esto no puedes abrir el diálogo.
  private readonly dialog = inject(MatDialog);

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
    compraId: new FormControl<number | null>(null, {
      validators: reglas(
        [noVacio, 'La compra es obligatoria'],
      ),
    }),
    monto: new FormControl<number | null>(null, {
      validators: reglas(
        [noVacio, 'El monto es obligatorio'],
        [Validators.min(0.01), 'El monto debe ser mayor a 0'],
        [digitos(10, 2), 'El monto admite hasta 10 enteros y 2 decimales'],
      ),
    }),
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
    this.errorServidor.set([]); //borra los errores anteriores
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
        error: (err) => this.errorServidor.set(aplicarErroresServidor(this.pagoForm, err)),
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
      error: (err) => this.errorServidor.set(aplicarErroresServidor(this.pagoForm, err)),
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
    this.errorServidor.set([]);
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
    //==================Impresion======================//
  @ViewChild('ticketDialog') ticketDialog!: TemplateRef<any>;
  pagoTicket : any;

  abrirTicket(pago: any) {
    this.pagoTicket = pago;             // guarda el pago de esa fila
    this.dialog.open(this.ticketDialog);    // abre el diálogo con el molde
  }
}
