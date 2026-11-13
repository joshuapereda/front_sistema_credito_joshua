import { Routes } from '@angular/router';

export const TIPOS_COMPRA_ROUTES: Routes = [
  {
    path: '',
    title: 'Tipos de compra',
    loadComponent: () =>
      import('./pages/tipo-compra-list/tipo-compra-list').then((m) => m.TipoCompraList),
  },

];
