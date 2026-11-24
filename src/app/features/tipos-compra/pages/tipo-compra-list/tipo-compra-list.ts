import { Component, computed, HostListener, inject, input, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { PageHeader } from '@/app/shared/components/page-header/page-header';
import { EmptyState } from '@/app/shared/components/empty-state/empty-state';
import { ErrorCampo } from '@/app/shared/components/error-campo/error-campo';
import { ErroresServidor } from '@/app/shared/components/errores-servidor/errores-servidor';
import { aplicarErroresServidor } from '@/app/shared/validators/errores-servidor';
import { noVacio, reglas } from '@/app/shared/validators/reglas';
import { TipoCompraService } from '../../services/tipo-compra.service';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ConfirmDialog } from '@/app/shared/components/confirm-dialog/confirm-dialog';
import { AvisoDialog } from '@/app/shared/components/aviso-dialog/aviso-dialog';
import { TipoCompraInterface } from '../../Interfaces/TipoCompraInterface';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-tipo-compra-list',
  imports: [RouterLink, PageHeader, EmptyState, ReactiveFormsModule,ConfirmDialog,AvisoDialog, ErrorCampo, ErroresServidor],
  templateUrl: './tipo-compra-list.html',
})
export class TipoCompraList implements OnInit {
  ngOnInit(): void {
    this.funObjtenerTipoCompra();
  }

  //Variable que va almacenar los tipos de compra
  private readonly tipoCompras = signal<TipoCompraInterface[]>([]);
  //Inyectar servicios
  private readonly tipoCompraService = inject(TipoCompraService);
  //abrir modal con el nombre
  protected readonly crearTipoCompra = signal(false);
  /** Viene de la ruta :id/editar. Si no hay id, el formulario es para crear. */
  readonly id = input<string>();
  protected readonly esEdicion = computed(() => !!this.id());
  //si edito o no - obtener id
  protected readonly user_id = signal<number>(-1);
  //errores del back que no son de un campo
  protected readonly errorServidor = signal<string[]>([]);
  //para eliminar
  protected readonly mensajeError = signal<string | null>(null);
  protected readonly mensajeExito = signal<string | null>(null);
  //título del aviso: cambia si se creó, editó o eliminó
  protected readonly tituloExito = signal('');
  protected readonly tCompraAEliminar = signal<TipoCompraInterface | null>(null);

  //------------- LISTADO TIPO DE COMPRA ---------------//
  funObjtenerTipoCompra() {
    this.tipoCompraService.funListarTipoCompra().subscribe({
      next: (res: TipoCompraInterface[]) => {
        this.tipoCompras.set(res);
      },
      error: (error:HttpErrorResponse) => {
        console.log(error);
      }
    })
  }
  //---------------- FORMULARIO ----------------//
  protected readonly tcompraForm = new FormGroup({
    nombre: new FormControl('', { nonNullable: true,
      validators: reglas(
        [noVacio, 'El nombre del tipo de compra es obligatorio'],
        [Validators.maxLength(50), 'El nombre no puede superar los 50 caracteres'],
        [Validators.pattern(/^[A-Za-zÀ-ÿñÑ ]*$/), 'El nombre solo puede contener letras y espacios'],
      ),
    }),
    descripcion: new FormControl('', { nonNullable: true,
      validators: reglas(
        [noVacio, 'La descripción es obligatoria'],
        [Validators.maxLength(200), 'La descripción no puede superar los 200 caracteres'],
      ),
    }),
    esCredito: new FormControl(false, { nonNullable: true }),
  });
  //------------- GUARDAR PERSONA ---------------//
  funGuardarTipoCompra() {
    this.errorServidor.set([]); //borra los errores anteriores
    //validar si esta editando o creando
    if (this.user_id() !== -1) {
      //EDITAR
      if (this.tcompraForm.invalid) {
        this.tcompraForm.markAllAsTouched();
        return;
      }
      const { nombre, descripcion,esCredito } = this.tcompraForm.getRawValue();
      const tcompra = { nombre, descripcion,esCredito };

      this.tipoCompraService.funEditar(this.user_id(), tcompra).subscribe({
        next: () => {
          this.mostrarExito('Tipo de compra actualizado', `El tipo de compra "${this.tcompraForm.controls.nombre.value}" se actualizó correctamente.`);
          this.funObjtenerTipoCompra();
          this.cerrarModal();
        },
        error: (err) => this.errorServidor.set(aplicarErroresServidor(this.tcompraForm, err)),
      });
    } else {
      //validar si el formualrio esta vacio
      if (this.tcompraForm.invalid) {
        this.tcompraForm.markAllAsTouched();
        return;
      }

      this.tipoCompraService.funGuarda(this.tcompraForm.getRawValue()).subscribe({
        next: () => {
          this.mostrarExito('Tipo de compra registrado', `El tipo de compra "${this.tcompraForm.controls.nombre.value}" se registró correctamente.`);
          this.cerrarModal();
          this.funObjtenerTipoCompra()
        },
        error: (err) => this.errorServidor.set(aplicarErroresServidor(this.tcompraForm, err)),
      });
    }
  }
  //------------- EDITAR ---------------//
  funEditarTipoCompra(tp: TipoCompraInterface) {
    //almacenar el id al dar click
    this.user_id.set(tp.id!)
    //precargar los datos ya registrado
    this.tcompraForm.patchValue({
      nombre: tp.nombre,
      descripcion: tp.descripcion,
      esCredito: tp.esCredito,
    });
  }
  //----------- ELIMINAR TIPO DE COMPRA -------------//
  //abre el modal de confirmación (el botón de la papelera ya lo llama)
  funEliminarTipoCompra(tp: TipoCompraInterface) {
    this.tCompraAEliminar.set(tp);
  }

  cancelarEliminar() {
    this.tCompraAEliminar.set(null);
  }

  confirmarEliminar() {
    const cat = this.tCompraAEliminar();
    if (!cat) return;

    this.tipoCompraService.funEliminar(cat.id!).subscribe({
      next: () => {
        this.tCompraAEliminar.set(null);
        this.funObjtenerTipoCompra();
        this.mostrarExito('Tipo de compra eliminado', `El tipo de compra "${cat.nombre}" se eliminó exitosamente.`);
      },
      error: (err) => {
        this.tCompraAEliminar.set(null);
        this.mensajeError.set(err.error?.message ?? 'No se pudo eliminar el tipo de compra');
      },
    });
  }

  //------------- AVISO DE ÉXITO ---------------//
  //mismo modal verde para crear, editar y eliminar
  mostrarExito(titulo: string, mensaje: string) {
    this.tituloExito.set(titulo);
    this.mensajeExito.set(mensaje);
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
    this.errorServidor.set([]);
    this.user_id.set(-1); //vuelve a modo "crear"
    this.crearTipoCompra.set(false);
    this.tcompraForm.reset({ nombre: '', descripcion: '', esCredito: false });
  }
  @HostListener('document:keydown.escape')
  onEscape() {
    if (this.crearTipoCompra()) this.cerrarModal();
  }
}
