import { Type } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter } from '@angular/router';
import { CategoriaList } from '@/app/features/categorias/pages/categoria-list/categoria-list';
import { ClienteList } from '@/app/features/clientes/pages/cliente-list/cliente-list';
import { PagoList } from '@/app/features/pagos/pages/pago-list/pago-list';
import { PermisoList } from '@/app/features/permisos/pages/permiso-list/permiso-list';
import { ProductoList } from '@/app/features/productos/pages/producto-list/producto-list';
import { RolList } from '@/app/features/roles/pages/rol-list/rol-list';
import { TipoCompraList } from '@/app/features/tipos-compra/pages/tipo-compra-list/tipo-compra-list';
import { UsuarioList } from '@/app/features/usuarios/pages/usuario-list/usuario-list';

interface Caso {
  nombre: string;
  pagina: Type<unknown>;
  editar: string;
  form: string;
  url: string;
  datos: Record<string, unknown>;
}

const casos: Caso[] = [
  { nombre: 'categorías', pagina: CategoriaList, editar: 'funEditarCategoria', form: 'categoriaForm', url: '/api/categorias', datos: { nombre: 'Ropa', descripcion: 'x' } },
  { nombre: 'clientes', pagina: ClienteList, editar: 'funEditarCliente', form: 'clienteForm', url: '/api/clientes', datos: { nombre: 'Ana', gmail: '', telefono: '912345678', direccion: 'x', docIdentidad: '12345678' } },
  { nombre: 'pagos', pagina: PagoList, editar: 'funEditarPago', form: 'pagoForm', url: '/api/pago', datos: { compraId: 1, monto: 5 } },
  { nombre: 'permisos', pagina: PermisoList, editar: 'funEditarPermiso', form: 'permisoForm', url: '/api/permisos', datos: { nombre: 'x', recurso: 'COMPRA', accion: 'CREAR' } },
  { nombre: 'productos', pagina: ProductoList, editar: 'funEditarProducto', form: 'productoForm', url: '/api/productos', datos: { nombre: 'Polo', precioVenta: 10, precioCompra: 5, categoriaId: 1 } },
  { nombre: 'roles', pagina: RolList, editar: 'funEditarRol', form: 'rolForm', url: '/api/roles', datos: { nombre: 'Admin', descripcion: 'x', permisosId: [1] } },
  { nombre: 'tipos de compra', pagina: TipoCompraList, editar: 'funEditarTipoCompra', form: 'tcompraForm', url: '/api/tipoCompras', datos: { nombre: 'Contado', descripcion: 'x', esCredito: false } },
  { nombre: 'usuarios', pagina: UsuarioList, editar: 'funEditarUsuario', form: 'usuarioForm', url: '/api/usuarios', datos: { username: 'Ana12', passwprd: 'Ejemplo12#', personaId: 1, rolesId: [1] } },
];

//Editar, cerrar y crear: debe CREAR (POST), no cambiar el registro anterior (PUT)
it.each(casos)('en $nombre, crear después de editar no sobrescribe', async (caso) => {
  await TestBed.configureTestingModule({
    imports: [caso.pagina],
    providers: [provideRouter([]), provideHttpClient(), provideHttpClientTesting()],
  }).compileComponents();
  const fixture = TestBed.createComponent(caso.pagina);
  const c = fixture.componentInstance as any;
  const http = TestBed.inject(HttpTestingController);
  await fixture.whenStable();

  c[caso.editar]({ id: 5, ...caso.datos });
  c.abrir(true);
  await fixture.whenStable();
  c.cerrarModal();
  c.abrir(true);
  await fixture.whenStable();
  c[caso.form].patchValue(caso.datos);
  fixture.nativeElement.querySelector('form').dispatchEvent(new Event('submit'));

  expect(http.match((r) => r.method === 'PUT').length).toBe(0);
  expect(http.match((r) => r.method === 'POST' && r.url.endsWith(caso.url)).length).toBe(1);
});
