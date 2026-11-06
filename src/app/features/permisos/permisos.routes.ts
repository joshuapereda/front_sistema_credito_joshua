import { Routes } from '@angular/router';

export const PERMISOS_ROUTES: Routes = [
  {
    path: '',
    title: 'Permisos',
    loadComponent: () => import('./pages/permiso-list/permiso-list').then((m) => m.PermisoList),
  },
  {
    path: 'nuevo',
    title: 'Nuevo permiso',
    loadComponent: () => import('./pages/permiso-form/permiso-form').then((m) => m.PermisoForm),
  },
  {
    path: ':id/editar',
    title: 'Editar permiso',
    loadComponent: () => import('./pages/permiso-form/permiso-form').then((m) => m.PermisoForm),
  },
];
