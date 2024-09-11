import { Routes } from '@angular/router';
import { LoginComponent } from './auth/login/login.component';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  },
  {
    path: 'login',
    loadComponent: () =>
      import('./auth/login/login.component').then((m) => m.LoginComponent),
  },
  {
    path: 'dashboard',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./dashboard/dashboard.component').then(
        (m) => m.DashboardComponent
      ),
  },
  {
    path: 'devices',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./devices/devices.component').then((m) => m.DevicesComponent),
  },
  {
    path: 'transactions',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./transactions/transactions.component').then(
        (m) => m.TransactionsComponent
      ),
  },
  {
    path: 'users',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./users/users.component').then((m) => m.UsersComponent),
  },
  {
    path: 'forbidden',
    loadComponent: () =>
      import('./ui/forbidden/forbidden.component').then(
        (m) => m.ForbiddenComponent
      ),
  },
  {
    path: 'server-error',
    loadComponent: () =>
      import('./ui/server-error/server-error.component').then(
        (m) => m.ServerErrorComponent
      ),
  },
];
