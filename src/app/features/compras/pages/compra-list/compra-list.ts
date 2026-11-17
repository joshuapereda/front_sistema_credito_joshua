import { Component, computed, HostListener, inject, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { PageHeader } from '@/app/shared/components/page-header/page-header';
import { EmptyState } from '@/app/shared/components/empty-state/empty-state';
import { CompraService } from '../../services/compra.service';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

interface ItemCarrito {
  producto: any;
  cantidad: number;
}

@Component({
  selector: 'app-compra-list',
  imports: [RouterLink, PageHeader, EmptyState, CurrencyPipe, DatePipe, ReactiveFormsModule],
  templateUrl: './compra-list.html',
})
export class CompraList implements OnInit {
  //Relaciones
  protected readonly compras = signal<any[]>([]);
  protected readonly clientes = signal<any[]>([]);
  protected readonly usuarios = signal<any[]>([]);
  protected readonly tcompras = signal<any[]>([]);
  protected readonly productos = signal<any[]>([]);
  protected readonly categorias = signal<any>([]);
  protected readonly compraService = inject(CompraService);
  protected readonly compraSeleccionada = signal<any | null>(null);
  protected readonly crearVenta = signal(false);
  protected readonly crearCliente = signal(false);
  protected readonly crearProducto = signal(false);
  protected readonly errorServidor = signal<string[]>([]);
  //si edito o no: null = estoy creando, número = id de la compra que edito
  protected readonly compraEditId = signal<number | null>(null);

  ngOnInit(): void {
    this.funObtenerVenta();
    this.funObtenerCliente();
    this.funObtenerUsuario();
    this.funObtenerTipoCompra();
    this.funObtenerProducto();
    this.funObtenerCategoria();
  }

  //---------------- LISTADOS ----------------//
  funObtenerCliente() {
    this.compraService.funListarCliente().subscribe({
      next: (res: any) => this.clientes.set(res),
      error: (e) => console.log(e),
    });
  }

  funObtenerUsuario() {
    this.compraService.funListarUsuario().subscribe({
      next: (res: any) => this.usuarios.set(res),
      error: (e) => console.log(e),
    });
  }

  funObtenerTipoCompra() {
    this.compraService.funListarTipoCompra().subscribe({
      next: (res: any) => this.tcompras.set(res),
      error: (e) => console.log(e),
    });
  }

  funObtenerProducto() {
    this.compraService.funListarProducto().subscribe({
      next: (res: any) => this.productos.set(res),
      error: (e) => console.log(e),
    });
  }

  funObtenerVenta() {
    this.compraService.funListarCompra().subscribe({
      next: (res: any) => this.compras.set(res),
      error: (e) => console.log(e),
    });
  }
  funObtenerCategoria() {
    this.compraService.funListarCategoria().subscribe({
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
  //---------------- FORMULARIO ----------------//
  protected readonly ventaForm = new FormGroup({
    clienteId: new FormControl<number | null>(null, Validators.required),
    usuarioId: new FormControl<number | null>(null, Validators.required),
    tipoCompraId: new FormControl<number | null>(null, Validators.required),
  });
  protected readonly clienteForm = new FormGroup({
    nombre: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    gmail: new FormControl('', { nonNullable: true }),
    telefono: new FormControl('', { nonNullable: true, validators: [Validators.required, Validators.pattern(/^9\d{8}$/)] }),
    direccion: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    docIdentidad: new FormControl('', { nonNullable: true, validators: [Validators.required, Validators.pattern(/^\d{8}$/)] })
  });
  protected readonly productoForm = new FormGroup({
    nombre: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    precioVenta: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    precioCompra: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    categoriaId: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    foto: new FormControl<File | null>(null),
  });

  //---------------- CARRITO (detalles) ----------------//
  protected readonly carrito = signal<ItemCarrito[]>([]);
  protected readonly productoSel = signal<number | null>(null);
  protected readonly cantidadSel = signal(1);

  protected readonly total = computed(() =>
    this.carrito().reduce((s, i) => s + (i.producto.precio ?? 0) * i.cantidad, 0)
  );

  agregarProducto() {
    const id = this.productoSel();
    const cantidad = this.cantidadSel();
    if (id === null || cantidad < 1) return;

    const producto = this.productos().find((p) => p.id === id);
    if (!producto) return;

    const existe = this.carrito().find((i) => i.producto.id === id);
    this.carrito.set(
      existe
        ? this.carrito().map((i) =>
          i.producto.id === id ? { ...i, cantidad: i.cantidad + cantidad } : i
        )
        : [...this.carrito(), { producto, cantidad }]
    );

    this.productoSel.set(null);
    this.cantidadSel.set(1);
    this.errorServidor.set([]);
  }

  cambiarCantidad(id: number, cantidad: number) {
    if (!cantidad || cantidad < 1) return;
    this.carrito.update((c) =>
      c.map((i) => (i.producto.id === id ? { ...i, cantidad } : i))
    );
  }

  quitarProducto(id: number) {
    this.carrito.update((c) => c.filter((i) => i.producto.id !== id));
  }

  //-------------- GUARDAR COMPRA --------------//
  funGuardarVenta() {
    this.errorServidor.set([]);

    if (this.ventaForm.invalid) {
      this.ventaForm.markAllAsTouched();
      return;
    }
    if (this.carrito().length === 0) {
      this.errorServidor.set(['Agrega al menos un producto.']);
      return;
    }

    const { clienteId, usuarioId, tipoCompraId } = this.ventaForm.getRawValue();

    const venta = {
      clienteId,
      usuarioId,
      tipoCompraId,
      detalles: this.carrito().map((i) => ({
        productoId: i.producto.id,
        cantidad: i.cantidad,
      })),
    };

    // si hay id -> estoy editando (PUT); si es null -> estoy creando (POST)
    const id = this.compraEditId();
    const peticion = id === null
      ? this.compraService.funGuarda(venta)
      : this.compraService.funEditar(id, venta);

    peticion.subscribe({
      next: () => {
        this.cerrarModal();
        this.funObtenerVenta();
      },
      error: (err) => {
        const msg = err.error?.message;
        this.errorServidor.set(
          Array.isArray(msg)
            ? msg
            : [msg ?? (id === null ? 'No se pudo guardar la venta.' : 'No se pudo actualizar la venta.')]
        );
      },
    });
  }
  //------------- EDITAR ---------------//
  funEditarCompra(com: any) {
    // 1. almacenar SOLO el id al dar click (así sabemos que es edición)
    this.compraEditId.set(com.id);

    // 2. precargar los datos ya registrados en el formulario
    this.ventaForm.patchValue({
      clienteId: com.clienteId,
      usuarioId: com.usuarioId,
      tipoCompraId: com.tipoCompraId,
    });

    // 3. precargar el CARRITO: cada detalle de la compra pasa a ser un item { producto, cantidad }
    const items: ItemCarrito[] = (com.detalles ?? []).map((d: any) => ({
      // buscar el producto completo en la lista (tiene nombre, precio, etc.)
      producto: this.productos().find((p) => p.id === d.productoId) ?? {
        // respaldo si la lista de productos no cargó todavía
        id: d.productoId,
        nombre: d.nombreProducto,
        precio: d.precioUnitario,
      },
      cantidad: d.cantidad,
    }));
    this.carrito.set(items);

    // 4. limpiar errores viejos y abrir el modal
    this.errorServidor.set([]);
  }
  //------------- GUARDAR PERSONA ---------------//
  funGuardarCliente() {
    this.errorServidor.set([]);

    if (this.clienteForm.invalid) {
      this.clienteForm.markAllAsTouched();
      return;
    }

    const cliente = this.clienteForm.getRawValue();

    this.compraService.funGuardaCliente(cliente).subscribe({
      next: () => {
        this.cerrarModalCliente();
      },
      error: (err) => {
        const msg = err.error?.message;
        this.errorServidor.set(
          Array.isArray(msg) ? msg : [msg ?? 'No se pudo guardar el cliente.']
        );
      },
    });
  }
  //------------- GUARDAR PRODUCTO ---------------//
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

    this.compraService.funGuardaProducto(formData).subscribe({
      next: () => {
        this.cerrarModalProducto();
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
  //---------------- MODALES ----------------//
  abrir(compra: any) {
    this.compraSeleccionada.set(compra);
  }

  abrirVenta(compra: any) {
    this.crearVenta.set(compra);
  }

  cerrarModalDetalle() {
    this.compraSeleccionada.set(null);
  }

  cerrarModal() {
    this.crearVenta.set(false);
    this.ventaForm.reset({ clienteId: null, usuarioId: null, tipoCompraId: null });
    this.carrito.set([]);
    this.productoSel.set(null);
    this.cantidadSel.set(1);
    this.errorServidor.set([]);
  }

  @HostListener('document:keydown.escape')
  onEscape() {
    if (this.crearVenta()) this.cerrarModal();
    else this.compraSeleccionada.set(null);
  }

  abrirCliente(compra: any) {
    this.crearCliente.set(compra);
  }
  cerrarModalCliente() {
    this.crearCliente.set(false);
    this.clienteForm.reset({ nombre: '', gmail: '', telefono: "", direccion: "", docIdentidad: "" });
  }
  @HostListener('document:keydown.escape')
  onEscapeCliente() {
    if (this.crearCliente()) this.cerrarModal();
  }

  abrirProducto(compra: any) {
    this.crearProducto.set(compra);
  }
  cerrarModalProducto() {
    this.crearProducto.set(false);
    this.productoForm.reset({ nombre: '', precioVenta: '', precioCompra: "", categoriaId: "", foto: null });
  }
  @HostListener('document:keydown.escape')
  onEscapeProducto() {
    if (this.crearProducto()) this.cerrarModal();
  }
}
