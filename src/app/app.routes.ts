import { Routes } from '@angular/router';
import { MainLayout } from './core/layout/main-layout/main-layout';

export const routes: Routes = [
  {
    path: 'auth',
    loadChildren: () => import('./features/auth/auth.routes').then((m) => m.AUTH_ROUTES),
  },
  {
    path: '',
    component: MainLayout,
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      {
        path: 'dashboard',
        loadChildren: () =>
          import('./features/dashboard/dashboard.routes').then((m) => m.DASHBOARD_ROUTES),
      },
      {
        path: 'categorias',
        loadChildren: () =>
          import('./features/categorias/categorias.routes').then((m) => m.CATEGORIAS_ROUTES),
      },
      {
        path: 'productos',
        loadChildren: () =>
          import('./features/productos/productos.routes').then((m) => m.PRODUCTOS_ROUTES),
      },
    ],
  },
  { path: '**', redirectTo: '' },
];
