import { Routes } from '@angular/router';

export const CATEGORIAS_ROUTES: Routes = [
  {
    path: '',
    title: 'Categorías',
    loadComponent: () =>
      import('./pages/categoria-list/categoria-list').then((m) => m.CategoriaList),
  },
];
