import { Routes } from '@angular/router';

import { authGuard, guestGuard } from './auth/auth.guard';
import { unsavedTaskGuard } from './tasks/unsaved-task.guard';

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
    loadComponent: () => import('./tasks/tasks-dashboard.component').then((component) => component.TasksDashboardComponent),
  },
  {
    path: 'tasks/new',
    canActivate: [authGuard],
    canDeactivate: [unsavedTaskGuard],
    loadComponent: () => import('./tasks/task-form.component').then((component) => component.TaskFormComponent),
  },
  {
    path: 'tasks/:id/edit',
    canActivate: [authGuard],
    canDeactivate: [unsavedTaskGuard],
    loadComponent: () => import('./tasks/task-form.component').then((component) => component.TaskFormComponent),
  },
  { path: '**', redirectTo: 'login' },
];
