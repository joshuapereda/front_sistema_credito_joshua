import { Component, computed, HostListener, inject, input, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { PageHeader } from '@/app/shared/components/page-header/page-header';
import { EmptyState } from '@/app/shared/components/empty-state/empty-state';
import { TipoCompraService } from '../../services/tipo-compra.service';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-tipo-compra-list',
  imports: [RouterLink, PageHeader, EmptyState, ReactiveFormsModule],
  templateUrl: './tipo-compra-list.html',
})
export class TipoCompraList implements OnInit {
  ngOnInit(): void {
    this.funObjtenerTipoCompra();
  }

  //Variable que va almacenar los tipos de compra
  private readonly tipoCompras = signal<any>([]);
  //Inyectar servicios
  private readonly tipoCompraService = inject(TipoCompraService);
  //abrir modal con el nombre
  protected readonly crearTipoCompra = signal(false);
  /** Viene de la ruta :id/editar. Si no hay id, el formulario es para crear. */
  readonly id = input<string>();
  protected readonly esEdicion = computed(() => !!this.id());

  //------------- LISTADO TIPO DE COMPRA ---------------//
  funObjtenerTipoCompra() {
    this.tipoCompraService.funListarTipoCompra().subscribe({
      next: (res: any) => {
        this.tipoCompras.set(res);
      },
      error: (error) => {
        console.log(error);
      }
    })
  }
  //---------------- FORMULARIO ----------------//
  protected readonly tcompraForm = new FormGroup({
    nombre: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    descripcion: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    esCredito: new FormControl(false, { nonNullable: true }),
  });
  //------------- GUARDAR PERSONA ---------------//
  funGuardarTipoCompra() {
    //validar si el formualrio esta vacio
    if (this.tcompraForm.invalid) {
      this.tcompraForm.markAllAsTouched();
      return;
    }

    this.tipoCompraService.funGuarda(this.tcompraForm.getRawValue()).subscribe({
      next: () => {
        this.cerrarModal();
        this.funObjtenerTipoCompra()
      },
      error: (error) => { console.log(error) }
    });
  }
  //------------- MODAL ---------------//
  abrir(compra: any) {
    this.crearTipoCompra.set(compra);
  }
  cerrarModal() {
    this.crearTipoCompra.set(false);
    this.tcompraForm.reset({ nombre: '', descripcion: '', esCredito: false });
  }
  @HostListener('document:keydown.escape')
  onEscape() {
    if (this.crearTipoCompra()) this.cerrarModal();
  }
}
