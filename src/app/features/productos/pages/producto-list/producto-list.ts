import { Component, computed, HostListener, inject, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { PageHeader } from '@/app/shared/components/page-header/page-header';
import { EmptyState } from '@/app/shared/components/empty-state/empty-state';
import { ProductoService } from '../../services/producto.service';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ConfirmDialog } from '@/app/shared/components/confirm-dialog/confirm-dialog';
import { AvisoDialog } from '@/app/shared/components/aviso-dialog/aviso-dialog';
import { ProductoFilterCriteria, ProductoInterface } from '../../interfaces/ProductoInterface';
import { CategoriaInterface } from '@/app/features/categorias/interfaces/CategoriaInterface';
import { HttpErrorResponse } from '@angular/common/http';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { PageableRequest } from '@/app/shared/interfaces/pageable.interface';

@Component({
  selector: 'app-producto-list',
  imports: [RouterLink, PageHeader, EmptyState, ReactiveFormsModule,ConfirmDialog,AvisoDialog, FormsModule, MatPaginatorModule],
  templateUrl: './producto-list.html',
})
export class ProductoList implements OnInit {
  ngOnInit(): void {
    this.funObtenerProducto();
    this.funObtenerCategoria();
  }
  protected readonly productos = signal<ProductoInterface[]>([]);
  protected readonly categorias = signal<CategoriaInterface[]>([]);
  protected readonly productoService = inject(ProductoService);
  protected readonly crearProducto = signal(false);
  //si edito o no
  protected readonly user_id = signal<number>(-1);
  //para eliminar
  protected readonly mensajeError = signal<string | null>(null);
  protected readonly mensajeExito = signal<string | null>(null);
  protected readonly productoAEliminar = signal<ProductoInterface | null>(null);
  //paginacion y filtro
  protected readonly totalElementos = signal(0);
  protected readonly pageIndex = signal(0);
  protected readonly pageSize = signal(5);
  protected filterValue = '';

  //------------- LISTADO CATEGORIA ---------------//
  funObtenerCategoria() {
    this.productoService.funListarCategoria().subscribe({
      next: (res: CategoriaInterface[]) => {
        this.categorias.set(res);
      },
      error: (error:HttpErrorResponse) => {
        console.log(error);
      }
    })
  }
  //Para obtener el nombre de la categoria
  protected readonly categoriaPorId = computed(() => {
    const mapa = new Map<number, string>();
    for (const cat of this.categorias()) {
      mapa.set(cat.id, cat.nombre);
    }
    return mapa;
  });

  //------------- LISTADO PRODUCTO ---------------//
  funObtenerProducto() {
    //Paginacion y filtrado
    const req: PageableRequest<ProductoFilterCriteria> = {
        pageNumber: this.pageIndex(),
        pageSize: this.pageSize(),
        sortField: 'id',
        sortOrder: 'desc',
        criterials: null,
        filterValue: this.filterValue,
    };
    this.productoService.funPaginarProducto(req).subscribe({
      next: (res) => {
        this.productos.set(res.content);
        this.totalElementos.set(res.totalElements);
      },
      error: (error:HttpErrorResponse) => {
        console.log(error);
      }
    })
  }
   cambiarPagina(e: PageEvent) {
    this.pageIndex.set(e.pageIndex);
    this.pageSize.set(e.pageSize);
    this.funObtenerProducto();
  }

  buscar() {
    this.pageIndex.set(0);
    this.funObtenerProducto();
  }
  limpiar() {
    this.filterValue = '';
    this.buscar();
  }

  //---------------- FORMULARIO ----------------//
  protected readonly productoForm = new FormGroup({
    nombre: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    precioVenta: new FormControl<number | null>(null, Validators.required),
    precioCompra: new FormControl<number | null>(null, Validators.required),
    categoriaId: new FormControl<number | null>(null, Validators.required),
    foto: new FormControl<File | null>(null),
  });
  //------------- GUARDAR ---------------//
  funGuardarProducto() {
    //validar si esta editando o creando
    if (this.user_id() !== -1) {
      //EDITAR
      if (this.productoForm.invalid) {
        this.productoForm.markAllAsTouched();
        return;
      }
      const { nombre, precioVenta,precioCompra,categoriaId, foto } = this.productoForm.getRawValue();
      const formData = new FormData();
      formData.append('nombre', nombre);
      formData.append('precioVenta', String(precioVenta));
      formData.append('precioCompra', String(precioCompra));
      formData.append('categoriaId', String(categoriaId));
      if (foto) formData.append('foto', foto); //solo si eligió una nueva

      this.productoService.funEditar(this.user_id(), formData).subscribe({
        next: () => {
          this.funObtenerProducto();
          this.cerrarModal();
        },
        error: (err) => console.error('Error al editar la categoría', err),
      });
    }else{
      if (this.productoForm.invalid) {
      this.productoForm.markAllAsTouched();
      return;
    }

    const { nombre, precioVenta, precioCompra, categoriaId, foto } = this.productoForm.getRawValue();

    const formData = new FormData();
    formData.append('nombre', nombre);
    formData.append('precioVenta', String(precioVenta));
    formData.append('precioCompra', String(precioCompra));
    formData.append('categoriaId', String(categoriaId));
    if (foto) formData.append('foto', foto);

    this.productoService.funGuarda(formData).subscribe({
      next: () => {
        this.cerrarModal();
        this.funObtenerProducto();
      },
      error: (error) => console.log(error),
    });
    }
  }
  //Subir foto
  onFotoSeleccionada(event: Event) {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0] ?? null;

    this.productoForm.controls.foto.setValue(file);
    this.productoForm.controls.foto.markAsTouched();

  }
  //------------- EDITAR CATEGORIA ---------------//
  funEditarProducto(p: ProductoInterface) {
    this.user_id.set(p.id);
    this.productoForm.patchValue({
      nombre: p.nombre,
      precioVenta:p.precioVenta,
      precioCompra:p.precioCompra,
      categoriaId:p.categoriaId,
      foto: null,
    });
    this.crearProducto.set(true);
  }
  //------------- ELIMINAR CATEGORIA ---------------//
  //abre el modal de confirmación (el botón de la papelera ya lo llama)
  funEliminarProducto(pro: ProductoInterface) {
    this.productoAEliminar.set(pro);
  }

  cancelarEliminar() {
    this.productoAEliminar.set(null);
  }

  confirmarEliminar() {
    const cat = this.productoAEliminar();
    if (!cat) return;

    this.productoService.funEliminar(cat.id).subscribe({
      next: () => {
        this.productoAEliminar.set(null);
        this.funObtenerProducto();
        this.mensajeExito.set(`El producto "${cat.nombre}" se eliminó exitosamente.`);
      },
      error: (err) => {
        this.productoAEliminar.set(null);
        this.mensajeError.set(err.error?.message ?? 'No se pudo eliminar el producto');
      },
    });
  }

  cerrarExito() {
    this.mensajeExito.set(null);
  }

  cerrarAviso() {
    this.mensajeError.set(null);
  }
  //------------- MODALS ---------------//
  abrir(compra: any) {
    this.crearProducto.set(compra);
  }
  cerrarModal() {
    this.crearProducto.set(false);
    this.productoForm.reset({ nombre: '', precioVenta: null, precioCompra: null, categoriaId: null, foto: null });
  }
  @HostListener('document:keydown.escape')
  onEscape() {
    if (this.crearProducto()) this.cerrarModal();
  }
}
