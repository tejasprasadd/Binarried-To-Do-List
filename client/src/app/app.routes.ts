import { Routes } from '@angular/router';

import { authGuard, guestGuard } from './auth/guards/auth.guard';
import { unsavedTaskGuard } from './tasks/guards/unsaved-task.guard';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'login' },
  {
    path: 'login',
    canActivate: [guestGuard],
    loadComponent: () => import('./auth/components/login.component').then((component) => component.LoginComponent),
  },
  {
    path: 'register',
    canActivate: [guestGuard],
    loadComponent: () => import('./auth/components/register.component').then((component) => component.RegisterComponent),
  },
  {
    path: 'tasks',
    canActivate: [authGuard],
    loadComponent: () => import('./tasks/components/tasks-dashboard.component').then((component) => component.TasksDashboardComponent),
  },
  {
    path: 'tasks/new',
    canActivate: [authGuard],
    canDeactivate: [unsavedTaskGuard],
    loadComponent: () => import('./tasks/components/task-form.component').then((component) => component.TaskFormComponent),
  },
  {
    path: 'tasks/:id/edit',
    canActivate: [authGuard],
    canDeactivate: [unsavedTaskGuard],
    loadComponent: () => import('./tasks/components/task-form.component').then((component) => component.TaskFormComponent),
  },
  { path: '**', redirectTo: 'login' },
];
