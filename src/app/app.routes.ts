import { Routes } from '@angular/router';
import { Layout } from './layout/layout';

export const routes: Routes = [
  {
    path: 'auth',
    loadChildren: () => import('./auth/auth-module').then(m => m.AuthModule),
  },
  {
    path: '',
    component: Layout,
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      {
        path: 'dashboard',loadComponent: () => import('./dashboard/dashboard').then(m => m.Dashboard),

      },
      {
         path: 'categorias',loadComponent: () => import('./features/categoria/categoria').then(m => m.Categoria),
      },
    ],
  },
  { path: '**', redirectTo: '' },
];
