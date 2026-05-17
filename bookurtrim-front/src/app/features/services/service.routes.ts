import { Routes } from '@angular/router';

export const SERVICE_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./pages/service-list-page/service-list-page').then(m => m.ServiceListPage),
  },
  {
    path: 'new',
    loadComponent: () =>
      import('./pages/service-form-page/service-form-page').then(m => m.ServiceFormPage),
  },
  {
    path: ':id',
    loadComponent: () =>
      import('./pages/service-form-page/service-form-page').then(m => m.ServiceFormPage),
  },
];
