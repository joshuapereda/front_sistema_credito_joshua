import { Routes } from '@angular/router';

export const PAGOS_ROUTES: Routes = [
  {
    path: '',
    title: 'Pagos',
    loadComponent: () => import('./pages/pago-list/pago-list').then((m) => m.PagoList),
  },
  {
    path: 'nuevo',
    title: 'Nuevo pago',
    loadComponent: () => import('./pages/pago-form/pago-form').then((m) => m.PagoForm),
  },
  {
    path: ':id/editar',
    title: 'Editar pago',
    loadComponent: () => import('./pages/pago-form/pago-form').then((m) => m.PagoForm),
  },
];
