import { Component, ElementRef, HostListener, inject, OnInit, signal, ViewChild } from '@angular/core';
import { RouterLink } from '@angular/router';
import { PageHeader } from '@/app/shared/components/page-header/page-header';
import { EmptyState } from '@/app/shared/components/empty-state/empty-state';
import { ErrorCampo } from '@/app/shared/components/error-campo/error-campo';
import { ErroresServidor } from '@/app/shared/components/errores-servidor/errores-servidor';
import { aplicarErroresServidor } from '@/app/shared/validators/errores-servidor';
import { noVacio, reglas } from '@/app/shared/validators/reglas';
import { CategoriaService } from '../../services/categoria.service';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ConfirmDialog } from '@/app/shared/components/confirm-dialog/confirm-dialog';
import { AvisoDialog } from '@/app/shared/components/aviso-dialog/aviso-dialog';
import { CategoriaFilterCriteria, CategoriaInterface } from '../../interfaces/CategoriaInterface';
import { HttpErrorResponse } from '@angular/common/http';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { PageableRequest } from '@/app/shared/interfaces/pageable.interface';
import { environment } from '@/environments/environment';

@Component({
  selector: 'app-categoria-list',
  imports: [RouterLink, PageHeader, EmptyState, ReactiveFormsModule, ConfirmDialog, AvisoDialog, FormsModule, MatPaginatorModule, ErrorCampo, ErroresServidor],
  templateUrl: './categoria-list.html',
})
export class CategoriaList implements OnInit {
  //aca va almacenar los usuarios
  protected readonly categorias = signal<CategoriaInterface[]>([]);
  //inyectar servivio
  protected readonly categoriaService = inject(CategoriaService);
  //abrir modal con el nombre de
  protected readonly crearCategoria = signal(false);
  //si edito o no - obtener id
  protected readonly user_id = signal<number>(-1);
  //errores del back que no son de un campo
  protected readonly errorServidor = signal<string[]>([]);
  //para eliminar
  protected readonly mensajeError = signal<string | null>(null);
  protected readonly mensajeExito = signal<string | null>(null);
  //título del aviso: cambia si se creó, editó o eliminó
  protected readonly tituloExito = signal('');
  protected readonly categoriaAEliminar = signal<CategoriaInterface | null>(null);
  //paginacion y filtro
  protected readonly totalElementos = signal(0);
  protected readonly pageIndex = signal(0);
  protected readonly pageSize = signal(5);
  protected filterValue = '';

  ngOnInit(): void {
    this.funObtenerCategoria();
  }

  //------------- LISTADO CATEGORIA ---------------//
  funObtenerCategoria() {
    //Paginacion y filtrado
    const req: PageableRequest<CategoriaFilterCriteria> = {
        pageNumber: this.pageIndex(),
        pageSize: this.pageSize(),
        sortField: 'id',
        sortOrder: 'desc',
        criterials: null,
        filterValue: this.filterValue,
    };
    this.categoriaService.funPaginarPago(req).subscribe({
      next: (res) => {
        this.categorias.set(res.content);
        this.totalElementos.set(res.totalElements);
      },
      error: (err: HttpErrorResponse) => {
        console.log(err);
      },
    })
  }
  cambiarPagina(e: PageEvent) {
    this.pageIndex.set(e.pageIndex);
    this.pageSize.set(e.pageSize);
    this.funObtenerCategoria();
  }

  buscar() {
    this.pageIndex.set(0);
    this.funObtenerCategoria();
  }
  limpiar() {
    this.filterValue = '';
    this.buscar();
  }
  //------------- IMÁGENES ---------------//
    private readonly SIN_FOTO = '/img/sin-foto.svg';
    getImagen(foto: string | null | undefined): string {
      return foto
        ? `${environment.apiUrl}/api/files/${encodeURIComponent(foto)}`  // foto real, pedida al backend
        : this.SIN_FOTO;                                                  // sin foto: imagen por defecto
    }

    onImgError(event: Event) {
      const img = event.target as HTMLImageElement;
      if (img.src.includes('no-image.png')) return;
      img.src = this.SIN_FOTO;
    }
  //---------------- FORMULARIO ----------------//
  protected readonly categoriaForm = new FormGroup({
    nombre: new FormControl('', { nonNullable: true,
      validators: reglas(
        [noVacio, 'El nombre de la categoría es obligatorio'],
        [Validators.maxLength(50), 'El nombre no puede superar los 50 caracteres'],
      ),
    }),
    descripcion: new FormControl('', { nonNullable: true,
      validators: reglas(
        [noVacio, 'La descripción es obligatoria'],
        [Validators.maxLength(200), 'La descripción no puede superar los 200 caracteres'],
      ),
    }),
    foto: new FormControl<File | null>(null),
  });
  //------------- GUARDAR CATEGORIA ---------------//
  funGuardarCategoria() {
    this.errorServidor.set([]); //borra los errores anteriores
    //validar si esta editando o creando
    if (this.user_id() !== -1) {
      //EDITAR
      if (this.categoriaForm.invalid) {
        this.categoriaForm.markAllAsTouched();
        return;
      }
      const { nombre, descripcion, foto } = this.categoriaForm.getRawValue();
      const formData = new FormData();
      formData.append('nombre', nombre);
      formData.append('descripcion', descripcion);
      if (foto) formData.append('foto', foto); //solo si eligió una nueva

      this.categoriaService.funEditar(this.user_id(), formData).subscribe({
        next: () => {
          this.mostrarExito('Categoría actualizada', `La categoría "${this.categoriaForm.controls.nombre.value}" se actualizó correctamente.`);
          this.funObtenerCategoria();
          this.cerrarModal();
        },
        error: (err) => this.errorServidor.set(aplicarErroresServidor(this.categoriaForm, err)),
      });
    } else {
      //CREAR
      if (this.categoriaForm.invalid) {
        this.categoriaForm.markAllAsTouched();
        return;
      }
      const { nombre, descripcion, foto } = this.categoriaForm.getRawValue();
      const formData = new FormData();
      formData.append('nombre', nombre ?? '');
      formData.append('descripcion', descripcion ?? '');
      if (foto) formData.append('foto', foto);

      this.categoriaService.funGuarda(formData).subscribe({
        next: () => {
          this.mostrarExito('Categoría registrada', `La categoría "${this.categoriaForm.controls.nombre.value}" se registró correctamente.`);
          this.funObtenerCategoria();
          this.cerrarModal();
        },
        error: (err) => this.errorServidor.set(aplicarErroresServidor(this.categoriaForm, err)),
      });
    }
  }
  //Para almacenar una foto
  onFotoSeleccionada(event: Event) {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0] ?? null;
    this.categoriaForm.controls.foto.setValue(file);
    this.categoriaForm.controls.foto.markAsTouched();

  }
  //------------- EDITAR ---------------//
  funEditarCategoria(cat: CategoriaInterface) {
    //almacenar el id al dar click
    this.user_id.set(cat.id)
    //precargar los datos ya registrado
    this.categoriaForm.patchValue({
      nombre: cat.nombre,
      descripcion: cat.descripcion,
      foto: null,
    });
  }
  //------------- ELIMINAR CATEGORIA ---------------//
  //abre el modal de confirmación (el botón de la papelera ya lo llama)
  funEliminarCategoria(cat: CategoriaInterface) {
    this.categoriaAEliminar.set(cat);
  }

  cancelarEliminar() {
    this.categoriaAEliminar.set(null);
  }

  confirmarEliminar() {
    const cat = this.categoriaAEliminar();
    if (!cat) return;

    this.categoriaService.funEliminar(cat.id).subscribe({
      next: () => {
        this.categoriaAEliminar.set(null);
        this.funObtenerCategoria();
        this.mostrarExito('Categoría eliminada', `La categoría "${cat.nombre}" se eliminó exitosamente.`);
      },
      error: (err: HttpErrorResponse) => {
        this.categoriaAEliminar.set(null);
        this.mensajeError.set(err.error?.message ?? 'No se pudo eliminar la categoría');
      },
    });
  }
  //------------- MODAL ---------------//
  abrir(compra: any) {
    this.crearCategoria.set(compra);
  }
  @ViewChild('fotoInput') fotoInput?: ElementRef<HTMLInputElement>;
  cerrarModal() {
    this.errorServidor.set([]);
    this.user_id.set(-1); //vuelve a modo "crear"
    this.crearCategoria.set(false);
    this.categoriaForm.reset({ nombre: '', descripcion: '', foto: null });
    if (this.fotoInput) this.fotoInput.nativeElement.value = '';
  }
  @HostListener('document:keydown.escape')
  onEscape() {
    if (this.crearCategoria()) this.cerrarModal();
  }
  //------------------------------------//
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

}
