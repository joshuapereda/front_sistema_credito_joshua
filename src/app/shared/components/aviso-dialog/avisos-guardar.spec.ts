import { Type } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter } from '@angular/router';
import { CategoriaList } from '@/app/features/categorias/pages/categoria-list/categoria-list';
import { ClienteList } from '@/app/features/clientes/pages/cliente-list/cliente-list';
import { CompraList } from '@/app/features/compras/pages/compra-list/compra-list';
import { PagoList } from '@/app/features/pagos/pages/pago-list/pago-list';
import { PermisoList } from '@/app/features/permisos/pages/permiso-list/permiso-list';
import { ProductoList } from '@/app/features/productos/pages/producto-list/producto-list';
import { RolList } from '@/app/features/roles/pages/rol-list/rol-list';
import { TipoCompraList } from '@/app/features/tipos-compra/pages/tipo-compra-list/tipo-compra-list';
import { UsuarioList } from '@/app/features/usuarios/pages/usuario-list/usuario-list';

interface Caso {
  nombre: string;
  pagina: Type<unknown>;
  abrir: string;
  editar?: string; //sin editar: ese modal solo crea
  form: string;
  datos: Record<string, unknown>;
  creado: string;
  editado?: string;
  boton?: [string, string]; //texto al crear y al editar
}

const cliente = { nombre: 'Ana', gmail: '', telefono: '912345678', direccion: 'x', docIdentidad: '12345678' };
const producto = { nombre: 'Polo', precioVenta: 10, precioCompra: 5, categoriaId: 1 };

const casos: Caso[] = [
  { nombre: 'categorías', pagina: CategoriaList, abrir: 'abrir', editar: 'funEditarCategoria', form: 'categoriaForm', datos: { nombre: 'Ropa', descripcion: 'x' }, creado: 'La categoría "Ropa" se registró', editado: 'La categoría "Ropa" se actualizó' },
  { nombre: 'clientes', pagina: ClienteList, abrir: 'abrir', editar: 'funEditarCliente', form: 'clienteForm', datos: cliente, creado: 'El cliente "Ana" se registró', editado: 'El cliente "Ana" se actualizó' },
  { nombre: 'permisos', pagina: PermisoList, abrir: 'abrir', editar: 'funEditarPermiso', form: 'permisoForm', datos: { nombre: 'x', recurso: 'COMPRA', accion: 'CREAR' }, creado: 'El permiso "x" se registró', editado: 'El permiso "x" se actualizó' },
  { nombre: 'productos', pagina: ProductoList, abrir: 'abrir', editar: 'funEditarProducto', form: 'productoForm', datos: producto, creado: 'El producto "Polo" se registró', editado: 'El producto "Polo" se actualizó' },
  { nombre: 'roles', pagina: RolList, abrir: 'abrir', editar: 'funEditarRol', form: 'rolForm', datos: { nombre: 'Admin', descripcion: 'x', permisosId: [1] }, creado: 'El rol "Admin" se registró', editado: 'El rol "Admin" se actualizó' },
  { nombre: 'tipos de compra', pagina: TipoCompraList, abrir: 'abrir', editar: 'funEditarTipoCompra', form: 'tcompraForm', datos: { nombre: 'Contado', descripcion: 'x', esCredito: false }, creado: 'El tipo de compra "Contado" se registró', editado: 'El tipo de compra "Contado" se actualizó' },
  { nombre: 'usuarios', pagina: UsuarioList, abrir: 'abrir', editar: 'funEditarUsuario', form: 'usuarioForm', datos: { username: 'Ana12', passwprd: 'Ejemplo12#', personaId: 1, rolesId: [1] }, creado: 'El usuario "Ana12" se registró', editado: 'El usuario "Ana12" se actualizó' },
  { nombre: 'pagos', pagina: PagoList, abrir: 'abrir', editar: 'funEditarPago', form: 'pagoForm', datos: { compraId: 1, monto: 5 }, creado: 'El pago de S/ 5.00 se registró', editado: 'El pago de S/ 5.00 se actualizó', boton: ['Guardar pago', 'Actualizar pago'] },
  { nombre: 'compras', pagina: CompraList, abrir: 'abrirVenta', editar: 'funEditarCompra', form: 'ventaForm', datos: { clienteId: 1, usuarioId: 1, tipoCompraId: 1 }, creado: 'La compra se registró', editado: 'La compra #5 se actualizó', boton: ['Guardar venta', 'Actualizar venta'] },
  { nombre: 'cliente desde compras', pagina: CompraList, abrir: 'abrirCliente', form: 'clienteForm', datos: cliente, creado: 'El cliente "Ana" se registró' },
  { nombre: 'producto desde compras', pagina: CompraList, abrir: 'abrirProducto', form: 'productoForm', datos: producto, creado: 'El producto "Polo" se registró' },
];

describe.each(casos)('Avisos en $nombre', (caso) => {
  const preparar = async () => {
    await TestBed.configureTestingModule({
      imports: [caso.pagina],
      providers: [provideRouter([]), provideHttpClient(), provideHttpClientTesting()],
    }).compileComponents();
    const fixture = TestBed.createComponent(caso.pagina);
    const c = fixture.componentInstance as any;
    const http = TestBed.inject(HttpTestingController);
    await fixture.whenStable();
    const el: HTMLElement = fixture.nativeElement;
    const boton = () => el.querySelector('form button[type=submit]')!.textContent!.trim();
    const aviso = () => el.querySelector('app-aviso-dialog [role=alertdialog]')?.textContent ?? '';
    const enviar = async (metodo: string, ok: boolean) => {
      el.querySelector('form')!.dispatchEvent(new Event('submit'));
      const req = http.expectOne((r) => r.method === metodo && !r.url.endsWith('/pagination'));
      if (ok) req.flush({});
      else req.flush({ message: 'No' }, { status: 409, statusText: 'Conflict' });
      await fixture.whenStable();
    };
    const llenar = () => {
      c[caso.form].patchValue(caso.datos);
      if (caso.form === 'ventaForm') c.carrito.set([{ producto: { id: 1, nombre: 'Polo', precioVenta: 1 }, cantidad: 1 }]);
    };
    return { fixture, c, el, boton, aviso, enviar, llenar };
  };
  const [textoCrear, textoEditar] = caso.boton ?? ['Guardar', 'Actualizar'];

  it('crear: botón Guardar, cierra el formulario y muestra el aviso', async () => {
    const { fixture, c, el, boton, aviso, enviar, llenar } = await preparar();
    c[caso.abrir](true);
    await fixture.whenStable();
    expect(boton()).toBe(textoCrear);
    llenar();
    await enviar('POST', true);
    expect(el.querySelector('form')).toBeNull();
    expect(aviso()).toContain(caso.creado);

    //Aceptar cierra el aviso
    el.querySelector<HTMLButtonElement>('app-aviso-dialog [role=alertdialog] button')!.click();
    await fixture.whenStable();
    expect(aviso()).toBe('');
  });

  it('si el back rechaza no muestra el aviso', async () => {
    const { fixture, c, aviso, enviar, llenar } = await preparar();
    c[caso.abrir](true);
    await fixture.whenStable();
    llenar();
    await enviar('POST', false);
    expect(aviso()).toBe('');
  });

  it.runIf(caso.editar)('editar: botón Actualizar y aviso de actualizado', async () => {
    const { fixture, c, el, boton, aviso, enviar, llenar } = await preparar();
    c[caso.editar!]({ id: 5, detalles: [], ...caso.datos });
    c[caso.abrir](true);
    await fixture.whenStable();
    expect(boton()).toBe(textoEditar);
    expect(el.querySelector('.modal h2')!.textContent).toContain('Editar');
    llenar();
    await enviar('PUT', true);
    expect(aviso()).toContain(caso.editado);

    //al abrir de nuevo vuelve a decir Guardar
    c[caso.abrir](true);
    await fixture.whenStable();
    expect(boton()).toBe(textoCrear);
  });
});
