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
  abrir: string; //método que abre el modal
  form: string;
  url: string; //a dónde se guarda
  vacio: string[]; //mensajes al enviar vacío
  invalido: [Record<string, unknown>, string][]; //dato malo -> mensaje
  valido: Record<string, unknown>;
  campo: string; //campo que "rechaza" el back
  antes?: (c: any) => void;
}

const cliente = {
  form: 'clienteForm',
  url: '/api/clientes',
  vacio: [
    'El Nombre del Cliente es obligatorio',
    'El N° Teléfono es obligatorio',
    'La Direccion de la Cliente es obligatorio',
    'El D° Identidad es obligatorio',
  ],
  invalido: [
    [{ nombre: '   ' }, 'El Nombre del Cliente es obligatorio'],
    [{ nombre: 'a'.repeat(51) }, 'no puede tener más de 50 caracteres'],
    [{ gmail: 'malo' }, 'Por favor ingresa un Gmail valido'],
    [{ telefono: '812345678' }, 'celular peruano válido'],
    [{ docIdentidad: '123' }, 'debe tener 8 dígitos'],
  ] as Caso['invalido'],
  valido: { nombre: 'Ana', gmail: 'ana@gmail.com', telefono: '912345678', direccion: 'Av. 1', docIdentidad: '12345678' },
  campo: 'nombre',
};
const producto = {
  form: 'productoForm',
  url: '/api/productos',
  vacio: [
    'El nombre del producto es obligatorio',
    'El precio de venta es obligatorio',
    'El precio de compra es obligatorio',
    'Debes asignar una categoría al producto',
  ],
  invalido: [
    [{ precioVenta: 0 }, 'El precio de venta debe ser mayor a 0'],
    [{ precioCompra: 1.234 }, 'El precio de compra admite hasta 8 enteros y 2 decimales'],
  ] as Caso['invalido'],
  valido: { nombre: 'Polo', precioVenta: 10, precioCompra: 5.5, categoriaId: 1 },
  campo: 'nombre',
};

const casos: Caso[] = [
  { nombre: 'cliente', pagina: ClienteList, abrir: 'abrir', ...cliente },
  { nombre: 'cliente desde compras', pagina: CompraList, abrir: 'abrirCliente', ...cliente },
  { nombre: 'producto', pagina: ProductoList, abrir: 'abrir', ...producto },
  { nombre: 'producto desde compras', pagina: CompraList, abrir: 'abrirProducto', ...producto },
  {
    nombre: 'compra', pagina: CompraList, abrir: 'abrirVenta', form: 'ventaForm', url: '/api/compra',
    vacio: ['El cliente es obligatorio', 'El usuario es obligatorio', 'El tipo de compra es obligatorio'],
    invalido: [],
    valido: { clienteId: 1, usuarioId: 1, tipoCompraId: 1 },
    campo: 'clienteId',
    antes: (c) => c.carrito.set([{ producto: { id: 1, nombre: 'Polo', precioVenta: 10 }, cantidad: 1 }]),
  },
  {
    nombre: 'categoría', pagina: CategoriaList, abrir: 'abrir', form: 'categoriaForm', url: '/api/categorias',
    vacio: ['El nombre de la categoría es obligatorio', 'La descripción es obligatoria'],
    invalido: [[{ nombre: 'a'.repeat(51) }, 'El nombre no puede superar los 50 caracteres']],
    valido: { nombre: 'Ropa', descripcion: 'x' },
    campo: 'nombre',
  },
  {
    nombre: 'permiso', pagina: PermisoList, abrir: 'abrir', form: 'permisoForm', url: '/api/permisos',
    vacio: ['El nombre del permiso es obligatorio', 'El recurso es obligatorio', 'La acción es obligatoria'],
    invalido: [
      [{ recurso: 'a1' }, 'El recurso solo puede contener letras y guion bajo'],
      [{ accion: 'VER' }, 'La acción debe ser CREAR, LEER, ACTUALIZAR o ELIMINAR'],
    ],
    valido: { nombre: 'x', recurso: 'COMPRA', accion: 'crear' },
    campo: 'recurso',
  },
  {
    nombre: 'rol', pagina: RolList, abrir: 'abrir', form: 'rolForm', url: '/api/roles',
    vacio: ['El Nombre del rol es obligatorio', 'La descripción es obligatoria', 'Debe asignar al menos un Permiso al Rol'],
    invalido: [[{ descripcion: 'a@b' }, 'La Descripción contiene caracteres no permitidos']],
    valido: { nombre: 'Admin', descripcion: 'Todo', permisosId: [1] },
    campo: 'permisosId',
  },
  {
    nombre: 'tipo de compra', pagina: TipoCompraList, abrir: 'abrir', form: 'tcompraForm', url: '/api/tipoCompras',
    vacio: ['El nombre del tipo de compra es obligatorio', 'La descripción es obligatoria'],
    invalido: [[{ nombre: 'Credito 30' }, 'El nombre solo puede contener letras y espacios']],
    valido: { nombre: 'Contado', descripcion: 'x' },
    campo: 'nombre',
  },
  {
    nombre: 'usuario', pagina: UsuarioList, abrir: 'abrir', form: 'usuarioForm', url: '/api/usuarios',
    vacio: [
      'El Username es obligatorio', 'La contraseña es obligatoria',
      'Debe asignar al menos una Persona al Usuario', 'Debe asignar al menos un Rol al usuario',
    ],
    invalido: [
      [{ username: 'ana12' }, 'El Username debe empezar con mayúscula'],
      [{ passwprd: 'Abc1' }, 'El Password debe empezar con mayúscula'],
    ],
    valido: { username: 'Ana12', passwprd: 'Ejemplo12#', personaId: 1, rolesId: [1] },
    campo: 'username',
  },
  {
    nombre: 'pago', pagina: PagoList, abrir: 'abrir', form: 'pagoForm', url: '/api/pago',
    vacio: ['La compra es obligatoria', 'El monto es obligatorio'],
    invalido: [
      [{ monto: 0 }, 'El monto debe ser mayor a 0'],
      [{ monto: 'abc' }, 'El monto admite hasta 10 enteros y 2 decimales'],
    ],
    valido: { compraId: 1, monto: 5 },
    campo: 'monto',
  },
];

describe.each(casos)('Formulario de $nombre', (caso) => {
  const preparar = async () => {
    await TestBed.configureTestingModule({
      imports: [caso.pagina],
      providers: [provideRouter([]), provideHttpClient(), provideHttpClientTesting()],
    }).compileComponents();
    const fixture = TestBed.createComponent(caso.pagina);
    const c = fixture.componentInstance as any;
    const http = TestBed.inject(HttpTestingController);
    await fixture.whenStable();
    c[caso.abrir](true);
    await fixture.whenStable();

    const texto = () => fixture.nativeElement.querySelector('form').textContent as string;
    const enviar = async () => {
      fixture.nativeElement.querySelector('form').dispatchEvent(new Event('submit'));
      await fixture.whenStable();
    };
    const guardados = () =>
      http.match((r) => r.method === 'POST' && r.url.endsWith(caso.url));
    const llenar = () => {
      c[caso.form].patchValue(caso.valido);
      caso.antes?.(c);
    };
    return { fixture, c, texto, enviar, guardados, llenar };
  };

  it('vacío: muestra cada mensaje y no llama al back', async () => {
    const { texto, enviar, guardados } = await preparar();
    await enviar();
    for (const m of caso.vacio) expect(texto()).toContain(m);
    expect(guardados().length).toBe(0);
  });

  it('dato inválido: muestra el mensaje de esa validación', async () => {
    const { c, texto, enviar, guardados, llenar } = await preparar();
    for (const [dato, mensaje] of caso.invalido) {
      llenar();
      c[caso.form].patchValue(dato);
      await enviar();
      expect(texto()).toContain(mensaje);
      expect(guardados().length).toBe(0);
    }
  });

  it('el back rechaza un campo: muestra su mensaje y se borra al corregir', async () => {
    const { fixture, c, texto, enviar, guardados, llenar } = await preparar();
    llenar();
    await enviar();
    const [req] = guardados();
    req.flush(
      { message: ['MENSAJE DEL BACK'], fieldErrors: { [caso.campo]: 'MENSAJE DEL BACK' } },
      { status: 400, statusText: 'Bad Request' },
    );
    await fixture.whenStable();
    expect(texto()).toContain('MENSAJE DEL BACK');

    c[caso.form].patchValue(caso.valido);
    await fixture.whenStable();
    expect(texto()).not.toContain('MENSAJE DEL BACK');
  });

  it('error general del back: se muestra dentro del modal', async () => {
    const { fixture, texto, enviar, guardados, llenar } = await preparar();
    llenar();
    await enviar();
    guardados()[0].flush({ message: 'Regla de negocio' }, { status: 409, statusText: 'Conflict' });
    await fixture.whenStable();
    expect(texto()).toContain('Regla de negocio');
  });
});

it('al editar un usuario la contraseña puede ir vacía, pero si se escribe se valida', async () => {
  await TestBed.configureTestingModule({
    imports: [UsuarioList],
    providers: [provideRouter([]), provideHttpClient(), provideHttpClientTesting()],
  }).compileComponents();
  const c = TestBed.createComponent(UsuarioList).componentInstance as any;
  c.funEditarUsuario({ id: 1, username: 'Ana12', personaId: 1, rolesId: [1] });
  expect(c.usuarioForm.valid).toBe(true);
  c.usuarioForm.patchValue({ passwprd: 'mala' });
  expect(c.usuarioForm.valid).toBe(false);
});
