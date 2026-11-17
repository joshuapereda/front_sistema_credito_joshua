import { Component, computed, HostListener, inject, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { PageHeader } from '@/app/shared/components/page-header/page-header';
import { EmptyState } from '@/app/shared/components/empty-state/empty-state';
import { ProductoService } from '../../services/producto.service';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-producto-list',
  imports: [RouterLink, PageHeader, EmptyState, ReactiveFormsModule],
  templateUrl: './producto-list.html',
})
export class ProductoList implements OnInit {
  ngOnInit(): void {
    this.funObtenerProducto();
    this.funObtenerCategoria();
  }
  protected readonly productos = signal<any>([]);
  protected readonly categorias = signal<any>([]);
  protected readonly productoService = inject(ProductoService);
  protected readonly crearProducto = signal(false);
  //si edito o no
  protected readonly user_id = signal<any>(-1);
  //para eliminar
  protected readonly mensajeError = signal<string | null>(null);
  protected readonly mensajeExito = signal<string | null>(null);
  protected readonly productoAEliminar = signal<any>(null);

  //------------- LISTADO CATEGORIA ---------------//
  funObtenerCategoria() {
    this.productoService.funListarCategoria().subscribe({
      next: (res: any) => {
        this.categorias.set(res);
      },
      error: (error) => {
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
    this.productoService.funListarProducto().subscribe({
      next: (res: any) => {
        this.productos.set(res);
      },
      error: (error) => {
        console.log(error);
      }
    })
  }

  //---------------- FORMULARIO ----------------//
  protected readonly productoForm = new FormGroup({
    nombre: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    precioVenta: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    precioCompra: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    categoriaId: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
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
      formData.append('precioVenta', precioVenta);
      formData.append('precioCompra', precioCompra);
      formData.append('categoriaId', categoriaId);
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
  funEditarProducto(p: any) {
    this.user_id.set(p.id);
    this.productoForm.patchValue({
      nombre: p.nombre,
      precioVenta: p.precioVenta,
      precioCompra: p.precioCompra,
      categoriaId: p.categoriaId,
      foto: null,
    });
  }
  //------------- ELIMINAR CATEGORIA ---------------//
  //abre el modal de confirmación (el botón de la papelera ya lo llama)
  funEliminarProducto(pro: any) {
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
    this.productoForm.reset({ nombre: '', precioVenta: '', precioCompra: "", categoriaId: "", foto: null });
  }
  @HostListener('document:keydown.escape')
  onEscape() {
    if (this.crearProducto()) this.cerrarModal();
  }
}
