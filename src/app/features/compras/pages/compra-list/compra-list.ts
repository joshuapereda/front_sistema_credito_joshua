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

  protected readonly compraService = inject(CompraService);
  protected readonly compraSeleccionada = signal<any | null>(null);
  protected readonly crearVenta = signal(false);
  protected readonly errorServidor = signal<string[]>([]);

  ngOnInit(): void {
    this.funObtenerVenta();
    this.funObtenerCliente();
    this.funObtenerUsuario();
    this.funObtenerTipoCompra();
    this.funObtenerProducto();
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

  //---------------- FORMULARIO ----------------//
  protected readonly ventaForm = new FormGroup({
    clienteId: new FormControl<number | null>(null, Validators.required),
    usuarioId: new FormControl<number | null>(null, Validators.required),
    tipoCompraId: new FormControl<number | null>(null, Validators.required),
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

    this.compraService.funGuarda(venta).subscribe({
      next: () => {
        this.cerrarModal();
        this.funObtenerVenta();
      },
      error: (err) => {
        const msg = err.error?.message;
        this.errorServidor.set(
          Array.isArray(msg) ? msg : [msg ?? 'No se pudo guardar la venta.']
        );
      },
    });
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
}
