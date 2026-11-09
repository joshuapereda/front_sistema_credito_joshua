import { Routes } from '@angular/router';

export const TIPOS_COMPRA_ROUTES: Routes = [
  {
    path: '',
    title: 'Tipos de compra',
    loadComponent: () =>
      import('./pages/tipo-compra-list/tipo-compra-list').then((m) => m.TipoCompraList),
  },
  {
    path: 'nuevo',
    title: 'Nuevo tipo de compra',
    loadComponent: () =>
      import('./pages/tipo-compra-form/tipo-compra-form').then((m) => m.TipoCompraForm),
  },
  {
    path: ':id/editar',
    title: 'Editar tipo de compra',
    loadComponent: () =>
      import('./pages/tipo-compra-form/tipo-compra-form').then((m) => m.TipoCompraForm),
  },
];
