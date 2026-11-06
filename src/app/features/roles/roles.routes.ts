import { Routes } from '@angular/router';

export const ROLES_ROUTES: Routes = [
  {
    path: '',
    title: 'Roles',
    loadComponent: () => import('./pages/rol-list/rol-list').then((m) => m.RolList),
  },
  {
    path: 'nuevo',
    title: 'Nuevo rol',
    loadComponent: () => import('./pages/rol-form/rol-form').then((m) => m.RolForm),
  },
  {
    path: ':id/editar',
    title: 'Editar rol',
    loadComponent: () => import('./pages/rol-form/rol-form').then((m) => m.RolForm),
  },
];
