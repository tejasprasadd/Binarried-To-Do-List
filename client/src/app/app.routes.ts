import { Routes } from '@angular/router';

import { authGuard, guestGuard } from './auth/auth.guard';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'login' },
  {
    path: 'login',
    canActivate: [guestGuard],
    loadComponent: () => import('./auth/login.component').then((component) => component.LoginComponent),
  },
  {
    path: 'register',
    canActivate: [guestGuard],
    loadComponent: () => import('./auth/register.component').then((component) => component.RegisterComponent),
  },
  {
    path: 'tasks',
    canActivate: [authGuard],
    loadComponent: () => import('./tasks/tasks-placeholder.component').then((component) => component.TasksPlaceholderComponent),
  },
  { path: '**', redirectTo: 'login' },
];
