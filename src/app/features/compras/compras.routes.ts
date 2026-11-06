import { Routes } from '@angular/router';

export const COMPRAS_ROUTES: Routes = [
  {
    path: '',
    title: 'Compras',
    loadComponent: () => import('./pages/compra-list/compra-list').then((m) => m.CompraList),
  },
  {
    path: 'nuevo',
    title: 'Nueva compra',
    loadComponent: () => import('./pages/compra-form/compra-form').then((m) => m.CompraForm),
  },
  {
    path: ':id/editar',
    title: 'Editar compra',
    loadComponent: () => import('./pages/compra-form/compra-form').then((m) => m.CompraForm),
  },
  {
    path: ':id',
    title: 'Detalle de compra',
    loadComponent: () =>
      import('./pages/compra-detalle/compra-detalle').then((m) => m.CompraDetalle),
  },
];
