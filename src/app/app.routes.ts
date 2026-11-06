import { Routes } from '@angular/router';
import { MainLayout } from './core/layout/main-layout/main-layout';
import { authGuard } from './core/guards/auth.guard';

/**
 * Rutas raíz. Cada feature define sus rutas internas en features/<feature>/<feature>.routes.ts
 * y se carga lazy (solo cuando el usuario entra a esa sección).
 */
export const routes: Routes = [
  {
    path: 'auth',
    loadChildren: () => import('./features/auth/auth.routes').then((m) => m.AUTH_ROUTES),
  },
  {
    path: '',
    component: MainLayout,
    canActivate: [authGuard],
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      {
        path: 'dashboard',
        loadChildren: () =>
          import('./features/dashboard/dashboard.routes').then((m) => m.DASHBOARD_ROUTES),
      },
      // Ventas
      {
        path: 'compras',
        loadChildren: () =>
          import('./features/compras/compras.routes').then((m) => m.COMPRAS_ROUTES),
      },
      {
        path: 'pagos',
        loadChildren: () => import('./features/pagos/pagos.routes').then((m) => m.PAGOS_ROUTES),
      },
      {
        path: 'clientes',
        loadChildren: () =>
          import('./features/clientes/clientes.routes').then((m) => m.CLIENTES_ROUTES),
      },
      // Catálogo
      {
        path: 'productos',
        loadChildren: () =>
          import('./features/productos/productos.routes').then((m) => m.PRODUCTOS_ROUTES),
      },
      {
        path: 'categorias',
        loadChildren: () =>
          import('./features/categorias/categorias.routes').then((m) => m.CATEGORIAS_ROUTES),
      },
      {
        path: 'tipos-compra',
        loadChildren: () =>
          import('./features/tipos-compra/tipos-compra.routes').then((m) => m.TIPOS_COMPRA_ROUTES),
      },
      // Seguridad
      {
        path: 'usuarios',
        loadChildren: () =>
          import('./features/usuarios/usuarios.routes').then((m) => m.USUARIOS_ROUTES),
      },
      {
        path: 'roles',
        loadChildren: () => import('./features/roles/roles.routes').then((m) => m.ROLES_ROUTES),
      },
      {
        path: 'permisos',
        loadChildren: () =>
          import('./features/permisos/permisos.routes').then((m) => m.PERMISOS_ROUTES),
      },
    ],
  },
  { path: '**', redirectTo: '' },
];
