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
    foto: new FormControl<File | null>(null, Validators.required),
  });
  //------------- GUARDAR PERSONA ---------------//
  funGuardarProducto() {
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
  //Subir foto
  onFotoSeleccionada(event: Event) {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0] ?? null;

    this.productoForm.controls.foto.setValue(file);
    this.productoForm.controls.foto.markAsTouched();

  }
  //------------- GUARDAR PERSONA ---------------//
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
