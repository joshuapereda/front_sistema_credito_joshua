import { Routes } from '@angular/router';

export const CATEGORIAS_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./pages/categoria-list/categoria-list').then((m) => m.CategoriaList),
  },
];
