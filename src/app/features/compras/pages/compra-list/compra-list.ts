import { Component, computed, HostListener, inject, OnInit, signal, TemplateRef, ViewChild } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { PageHeader } from '@/app/shared/components/page-header/page-header';
import { EmptyState } from '@/app/shared/components/empty-state/empty-state';
import { ErrorCampo } from '@/app/shared/components/error-campo/error-campo';
import { ErroresServidor } from '@/app/shared/components/errores-servidor/errores-servidor';
import { aplicarErroresServidor } from '@/app/shared/validators/errores-servidor';
import { digitos, noVacio, reglas } from '@/app/shared/validators/reglas';
import { celularPeruValidator } from '@/app/shared/validators/celular-peru.validator';
import { CompraService } from '../../services/compra.service';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CompraFilterCriteria, CompraInterface, CompraRequest } from '../../interfaces/CompraInterface';
import { EstadoCompra } from '../../models/compra.model';
import { ClienteInterface } from '@/app/features/clientes/interfaces/ClienteInterface';
import { UsuarioInterface } from '@/app/features/usuarios/Interfaces/UsuarioInterface';
import { ProductoInterface } from '@/app/features/productos/interfaces/ProductoInterface';
import { CategoriaInterface } from '@/app/features/categorias/interfaces/CategoriaInterface';
import { HttpErrorResponse } from '@angular/common/http';
import { TipoCompraInterface } from '@/app/features/tipos-compra/Interfaces/TipoCompraInterface';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { PageableRequest } from '@/app/shared/interfaces/pageable.interface';
import { TicketCompra } from '../../ticket-compra/ticket-compra';
import {  MatDialog, MatDialogModule } from '@angular/material/dialog';

interface ItemCarrito {
  producto: Pick<ProductoInterface, 'id' | 'nombre' | 'precioVenta'>;
  cantidad: number;
}

@Component({
  selector: 'app-compra-list',
  imports: [RouterLink, PageHeader, EmptyState, CurrencyPipe, DatePipe, ReactiveFormsModule, FormsModule, MatPaginatorModule,TicketCompra,MatDialogModule, ErrorCampo, ErroresServidor],
  templateUrl: './compra-list.html',
})
export class CompraList implements OnInit {
  //Relaciones
  protected readonly compras = signal<CompraInterface[]>([]);
  protected readonly clientes = signal<ClienteInterface[]>([]);
  protected readonly usuarios = signal<UsuarioInterface[]>([]);
  protected readonly tcompras = signal<TipoCompraInterface[]>([]);
  protected readonly productos = signal<ProductoInterface[]>([]);
  protected readonly categorias = signal<CategoriaInterface[]>([]);

  protected readonly compraService = inject(CompraService);
  protected readonly compraSeleccionada = signal<CompraInterface | null>(null);
  protected readonly crearVenta = signal(false);
  protected readonly crearCliente = signal(false);
  protected readonly crearProducto = signal(false);
  protected readonly errorServidor = signal<string[]>([]);
  //si edito o no: null = estoy creando, número = id de la compra que edito
  protected readonly compraEditId = signal<number | null>(null);
  //paginacion y filtro
  protected readonly totalElementos = signal(0);
  protected readonly pageIndex = signal(0);
  protected readonly pageSize = signal(5);
  protected filterValue = '';
  //filtro por estado: null = todas
  protected readonly estadoFiltro = signal<EstadoCompra | null>(null);
  //un botón por cada elemento: 'valor' va al back, 'texto' se ve en pantalla
  protected readonly opcionesEstado: { texto: string; valor: EstadoCompra | null }[] = [
    { texto: 'Todas', valor: null },
    { texto: 'Pendientes', valor: 'PENDIENTE' },
    { texto: 'Pagadas', valor: 'PAGADO' },
  ];
  //impresion
  //Te da el “abridor de ventanas” de Angular Material. Sin esto no puedes abrir el diálogo.
  private readonly dialog = inject(MatDialog);

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
      next: (res: ClienteInterface[]) => this.clientes.set(res),
      error: (e: HttpErrorResponse) => console.log(e),
    });
  }

  funObtenerUsuario() {
    this.compraService.funListarUsuario().subscribe({
      next: (res: UsuarioInterface[]) => this.usuarios.set(res),
      error: (e: HttpErrorResponse) => console.log(e),
    });
  }

  funObtenerTipoCompra() {
    this.compraService.funListarTipoCompra().subscribe({
      next: (res: TipoCompraInterface[]) => this.tcompras.set(res),
      error: (e: HttpErrorResponse) => console.log(e),
    });
  }

  funObtenerProducto() {
    this.compraService.funListarProducto().subscribe({
      next: (res: ProductoInterface[]) => this.productos.set(res),
      error: (e: HttpErrorResponse) => console.log(e),
    });
  }
  funObtenerCategoria() {
    this.compraService.funListarCategoria().subscribe({
      next: (res: CategoriaInterface[]) => {
        this.categorias.set(res);
      },
      error: (error: HttpErrorResponse) => {
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
  //----------------LISTAR  ----------------//
  funObtenerVenta() {
    //Paginacion y filtrado
    const req: PageableRequest<CompraFilterCriteria> = {
      pageNumber: this.pageIndex(),
      pageSize: this.pageSize(),
      sortField: 'id',
      sortOrder: 'desc',
      //filtros específicos del back (se suman a la búsqueda general)
      criterials: { estadoCompra: this.estadoFiltro() },
      filterValue: this.filterValue,
    };

    this.compraService.funPaginarCompra(req).subscribe({
      next: (res) => {
        this.compras.set(res.content);
        this.totalElementos.set(res.totalElements);
      },
      error: (e: HttpErrorResponse) => console.log(e),
    });
  }
  cambiarPagina(e: PageEvent) {
    this.pageIndex.set(e.pageIndex);
    this.pageSize.set(e.pageSize);
    this.funObtenerVenta();
  }

  buscar() {
    this.pageIndex.set(0);
    this.funObtenerVenta();
  }
  //se ejecuta al hacer clic en Todas / Pendientes / Pagadas
  filtrarPorEstado(estado: EstadoCompra | null) {
    this.estadoFiltro.set(estado); //guarda el estado elegido
    this.buscar(); //vuelve a la página 1 y consulta al back
  }
  limpiar() {
    this.filterValue = '';
    this.buscar();
  }
  //---------------- FORMULARIO ----------------//
  protected readonly ventaForm = new FormGroup({
    clienteId: new FormControl<number | null>(null, {
      validators: reglas(
        [noVacio, 'El cliente es obligatorio'],
      ),
    }),
    usuarioId: new FormControl<number | null>(null, {
      validators: reglas(
        [noVacio, 'El usuario es obligatorio'],
      ),
    }),
    tipoCompraId: new FormControl<number | null>(null, {
      validators: reglas(
        [noVacio, 'El tipo de compra es obligatorio'],
      ),
    }),
  });
  protected readonly clienteForm = new FormGroup({
    nombre: new FormControl('', { nonNullable: true,
      validators: reglas(
        [noVacio, 'El Nombre del Cliente es obligatorio'],
        [Validators.maxLength(50), 'El Nombre del cliente no puede tener más de 50 caracteres'],
      ),
    }),
    gmail: new FormControl('', { nonNullable: true,
      validators: reglas(
        [Validators.email, 'Por favor ingresa un Gmail valido'],
      ),
    }),
    telefono: new FormControl('', { nonNullable: true,
      validators: reglas(
        [noVacio, 'El N° Teléfono es obligatorio'],
        [celularPeruValidator, 'El N° Teléfono debe ser un celular peruano válido (9 dígitos, empieza con 9)'],
      ),
    }),
    direccion: new FormControl('', { nonNullable: true,
      validators: reglas(
        [noVacio, 'La Direccion de la Cliente es obligatorio'],
      ),
    }),
    docIdentidad: new FormControl('', { nonNullable: true,
      validators: reglas(
        [noVacio, 'El D° Identidad es obligatorio'],
        [Validators.pattern(/^\d{8}$/), 'El D° Identidad debe tener 8 dígitos'],
      ),
    }),
  });
  protected readonly productoForm = new FormGroup({
    nombre: new FormControl('', { nonNullable: true,
      validators: reglas(
        [noVacio, 'El nombre del producto es obligatorio'],
        [Validators.maxLength(100), 'El nombre no puede superar los 100 caracteres'],
      ),
    }),
    precioVenta: new FormControl('', { nonNullable: true,
      validators: reglas(
        [noVacio, 'El precio de venta es obligatorio'],
        [Validators.min(0.01), 'El precio de venta debe ser mayor a 0'],
        [digitos(8, 2), 'El precio de venta admite hasta 8 enteros y 2 decimales'],
      ),
    }),
    precioCompra: new FormControl('', { nonNullable: true,
      validators: reglas(
        [noVacio, 'El precio de compra es obligatorio'],
        [Validators.min(0.01), 'El precio de compra debe ser mayor a 0'],
        [digitos(8, 2), 'El precio de compra admite hasta 8 enteros y 2 decimales'],
      ),
    }),
    categoriaId: new FormControl('', { nonNullable: true,
      validators: reglas(
        [noVacio, 'Debes asignar una categoría al producto'],
      ),
    }),
    foto: new FormControl<File | null>(null),
  });

  //---------------- CARRITO (detalles) ----------------//
  protected readonly carrito = signal<ItemCarrito[]>([]);
  protected readonly productoSel = signal<number | null>(null);
  protected readonly cantidadSel = signal(1);

  protected readonly total = computed(() =>
    this.carrito().reduce((s, i) => s + (i.producto.precioVenta ?? 0) * i.cantidad, 0)
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

    //el ! es seguro: el formulario ya validó que no son null
    const venta: CompraRequest = {
      clienteId: clienteId!,
      usuarioId: usuarioId!,
      tipoCompraId: tipoCompraId!,
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
      error: (err: HttpErrorResponse) =>
        this.errorServidor.set(aplicarErroresServidor(this.ventaForm, err)),
    });
  }
  //------------- EDITAR ---------------//
  funEditarCompra(com: CompraInterface) {
    // 1. almacenar SOLO el id al dar click (así sabemos que es edición)
    this.compraEditId.set(com.id);

    // 2. precargar los datos ya registrados en el formulario
    this.ventaForm.patchValue({
      clienteId: com.clienteId,
      usuarioId: com.usuarioId,
      tipoCompraId: com.tipoCompraId,
    });

    // 3. precargar el CARRITO: cada detalle de la compra pasa a ser un item { producto, cantidad }
    const items: ItemCarrito[] = com.detalles.map((d) => ({
      // buscar el producto completo en la lista (tiene nombre, precio, etc.)
      producto: this.productos().find((p) => p.id === d.productoId) ?? {
        // respaldo si la lista de productos no cargó todavía
        id: d.productoId,
        nombre: d.nombreProducto,
        precioVenta: d.precioUnitario,
      },
      cantidad: d.cantidad,
    }));
    this.carrito.set(items);

    // 4. limpiar errores viejos y abrir el modal
    this.errorServidor.set([]);
    this.crearVenta.set(true);
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
        //refrescar la lista para que aparezca en el select
        this.funObtenerCliente();
        this.cerrarModalCliente();
      },
      error: (err: HttpErrorResponse) =>
        this.errorServidor.set(aplicarErroresServidor(this.clienteForm, err)),
    });
  }
  //------------- GUARDAR PRODUCTO ---------------//
  funGuardarProducto() {
    this.errorServidor.set([]); //borra los errores anteriores
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
        //refrescar la lista para que aparezca en el select
        this.funObtenerProducto();
        this.cerrarModalProducto();
      },
      error: (err: HttpErrorResponse) =>
        this.errorServidor.set(aplicarErroresServidor(this.productoForm, err)),
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
  abrir(compra: CompraInterface) {
    this.compraSeleccionada.set(compra);
  }

  abrirVenta(abierto: boolean) {
    this.crearVenta.set(abierto);
  }

  cerrarModalDetalle() {
    this.compraSeleccionada.set(null);
  }

  cerrarModal() {
    this.crearVenta.set(false);
    //volver a modo "crear"
    this.compraEditId.set(null);
    this.ventaForm.reset({ clienteId: null, usuarioId: null, tipoCompraId: null });
    this.carrito.set([]);
    this.productoSel.set(null);
    this.cantidadSel.set(1);
    this.errorServidor.set([]);
  }

  abrirCliente(abierto: boolean) {
    this.crearCliente.set(abierto);
  }
  cerrarModalCliente() {
    this.errorServidor.set([]);
    this.crearCliente.set(false);
    this.clienteForm.reset({ nombre: '', gmail: '', telefono: "", direccion: "", docIdentidad: "" });
  }

  abrirProducto(abierto: boolean) {
    this.crearProducto.set(abierto);
  }
  cerrarModalProducto() {
    this.errorServidor.set([]);
    this.crearProducto.set(false);
    this.productoForm.reset({ nombre: '', precioVenta: '', precioCompra: "", categoriaId: "", foto: null });
  }

  //un solo listener de Escape: cierra primero el modal que esté encima
  @HostListener('document:keydown.escape')
  onEscape() {
    if (this.crearCliente()) this.cerrarModalCliente();
    else if (this.crearProducto()) this.cerrarModalProducto();
    else if (this.crearVenta()) this.cerrarModal();
    else this.compraSeleccionada.set(null);
  }
  //==================Impresion======================//
  @ViewChild('ticketDialog') ticketDialog!: TemplateRef<any>;
  compraTicket : any;

  abrirTicket(compra: any) {
    this.compraTicket = compra;             // guarda la compra de esa fila
    this.dialog.open(this.ticketDialog);    // abre el diálogo con el molde
  }
}
