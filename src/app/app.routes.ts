import { Routes } from '@angular/router';
import { authGuard } from './core/auth/auth.guard';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'login' },
  {
    path: 'login',
    loadComponent: () => import('./features/login/login').then((m) => m.Login),
  },
  {
    path: '',
    canActivate: [authGuard],
    loadComponent: () => import('./core/shell/shell').then((m) => m.Shell),
    children: [
      {
        path: 'dashboard',
        loadComponent: () => import('./features/dashboard/dashboard').then((m) => m.Dashboard),
      },
      {
        path: 'users',
        loadComponent: () => import('./features/users/users-list').then((m) => m.UsersList),
      },
      {
        path: 'org-structure',
        loadComponent: () => import('./features/org-structure/org-structure').then((m) => m.OrgStructure),
      },
      {
        path: 'stakeholders',
        loadComponent: () => import('./features/stakeholders/stakeholders').then((m) => m.Stakeholders),
      },
      {
        path: 'employees',
        loadComponent: () => import('./features/employees/employees').then((m) => m.Employees),
      },
      {
        path: 'login-history',
        loadComponent: () => import('./features/login-history/login-history').then((m) => m.LoginHistory),
      },
      {
        path: 'projects',
        loadComponent: () => import('./features/projects/projects').then((m) => m.Projects),
      },
      {
        path: 'tasks',
        loadComponent: () => import('./features/tasks/tasks').then((m) => m.Tasks),
      },
    ],
  },
];
