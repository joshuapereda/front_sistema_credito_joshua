import { Routes } from '@angular/router';
import { AppLayout } from './layout/component/app.layout';

export const routes: Routes = [
  {
    path: 'auth',
    loadChildren: () => import('./auth/auth-module').then(m => m.AuthModule),
  },
  {
    path: '',
    component: AppLayout,
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      {
        path: 'dashboard',loadComponent: () => import('./dashboard/dashboard').then(m => m.Dashboard),

      },
      {
         path: 'clientes',loadComponent: () => import('./features/categoria/categoria').then(m => m.Categoria),
      },
    ],
  },
  { path: '**', redirectTo: '' },
];
