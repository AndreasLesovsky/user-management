import { Routes } from '@angular/router';
import { authGuard } from './guards/auth-guard';
import { Home } from './pages/home/home';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    component: Home
  },
  {
    path: 'login',
    loadComponent: () =>
      import('./pages/login/login').then(m => m.Login),
  },
  {
    path: 'dashboard',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./pages/dashboard/dashboard').then(m => m.Dashboard),
    children: [
      { path: '', pathMatch: 'full', redirectTo: 'users' },
      {
        path: 'users',
        loadComponent: () => import('./components/user-list/user-list').then(m => m.UserList),
      },
      {
        path: 'users/new',
        loadComponent: () => import('./components/user-form/user-form').then(m => m.UserForm),
      },
      {
        path: 'users/:id',
        loadComponent: () => import('./components/user-form/user-form').then(m => m.UserForm),
      },
      { path: '**', redirectTo: 'users' }
    ]
  },
  {
    path: '**',
    redirectTo: ''
  }
];
