import { Routes } from '@angular/router';

export const CLIENTES_ROUTES: Routes = [
  {
    path: '',
    title: 'Clientes',
    loadComponent: () => import('./pages/cliente-list/cliente-list').then((m) => m.ClienteList),
  },
  {
    path: 'nuevo',
    title: 'Nuevo cliente',
    loadComponent: () => import('./pages/cliente-form/cliente-form').then((m) => m.ClienteForm),
  },
  {
    path: ':id/editar',
    title: 'Editar cliente',
    loadComponent: () => import('./pages/cliente-form/cliente-form').then((m) => m.ClienteForm),
  },
];
