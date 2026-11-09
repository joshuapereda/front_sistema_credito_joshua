import { Routes } from '@angular/router';

export const USUARIOS_ROUTES: Routes = [
  {
    path: '',
    title: 'Usuarios',
    loadComponent: () => import('./pages/usuario-list/usuario-list').then((m) => m.UsuarioList),
  },
  {
    path: 'nuevo',
    title: 'Nuevo usuario',
    loadComponent: () => import('./pages/usuario-form/usuario-form').then((m) => m.UsuarioForm),
  },
  {
    path: ':id/editar',
    title: 'Editar usuario',
    loadComponent: () => import('./pages/usuario-form/usuario-form').then((m) => m.UsuarioForm),
  },
];
