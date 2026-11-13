import { Routes } from '@angular/router';

export const PERMISOS_ROUTES: Routes = [
  {
    path: '',
    title: 'Permisos',
    loadComponent: () => import('./pages/permiso-list/permiso-list').then((m) => m.PermisoList),
  },
];
