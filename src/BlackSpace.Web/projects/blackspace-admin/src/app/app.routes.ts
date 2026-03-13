import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'admin',
    loadComponent: () => import('domain').then((m) => m.AdminShellComponent),
    children: [
      { path: 'dashboard', loadComponent: () => import('domain').then((m) => m.AdminDashboardPageComponent) },
      { path: 'members', loadComponent: () => import('domain').then((m) => m.MemberListPageComponent) },
      { path: 'content', loadComponent: () => import('domain').then((m) => m.ContentManagementPageComponent) },
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
    ],
  },
  { path: '', redirectTo: 'admin', pathMatch: 'full' },
  { path: '**', redirectTo: 'admin' },
];
