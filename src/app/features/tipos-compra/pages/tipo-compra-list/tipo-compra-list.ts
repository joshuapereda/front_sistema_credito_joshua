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
  //si edito o no - obtener id
  protected readonly user_id = signal<any>(-1);
  //para eliminar
  protected readonly mensajeError = signal<string | null>(null);
  protected readonly mensajeExito = signal<string | null>(null);
  protected readonly tCompraAEliminar = signal<any>(null);

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
    //validar si esta editando o creando
    if (this.user_id() !== -1) {
      //EDITAR
      if (this.tcompraForm.invalid) {
        this.tcompraForm.markAllAsTouched();
        return;
      }
      const { nombre, descripcion } = this.tcompraForm.getRawValue();
      const tcompra = { nombre, descripcion };

      this.tipoCompraService.funEditar(this.user_id(), tcompra).subscribe({
        next: () => {
          this.funObjtenerTipoCompra();
          this.cerrarModal();
        },
        error: (err) => console.error('Error al editar el tipo de compra', err),
      });
    } else {
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
  }
  //------------- EDITAR ---------------//
  funEditarTipoCompra(tp: any) {
    //almacenar el id al dar click
    this.user_id.set(tp.id)
    //precargar los datos ya registrado
    this.tcompraForm.patchValue({
      nombre: tp.nombre,
      descripcion: tp.descripcion,
      esCredito: tp.esCredito,
    });
  }
  //----------- ELIMINAR TIPO DE COMPRA -------------//
  //abre el modal de confirmación (el botón de la papelera ya lo llama)
  funEliminarCategoria(tp: any) {
    this.tCompraAEliminar.set(tp);
  }

  cancelarEliminar() {
    this.tCompraAEliminar.set(null);
  }

  confirmarEliminar() {
    const cat = this.tCompraAEliminar();
    if (!cat) return;

    this.tipoCompraService.funEliminar(cat.id).subscribe({
      next: () => {
        this.tCompraAEliminar.set(null);
        this.funGuardarTipoCompra();
        this.mensajeExito.set(`El tipo de compra "${cat.nombre}" se eliminó exitosamente.`);
      },
      error: (err) => {
        this.tCompraAEliminar.set(null);
        this.mensajeError.set(err.error?.message ?? 'No se pudo eliminar el tipo de compra');
      },
    });
  }

  cerrarExito() {
    this.mensajeExito.set(null);
  }

  cerrarAviso() {
    this.mensajeError.set(null);
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
