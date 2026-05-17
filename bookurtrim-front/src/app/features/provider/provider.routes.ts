import { Routes } from '@angular/router';

export const PROVIDER_ROUTES: Routes = [
  {
    path: 'planning',
    loadComponent: () =>
      import('./pages/planning-page/planning-page').then(m => m.PlanningPage),
  },
  {
    path: 'services',
    loadComponent: () =>
      import('../services/pages/service-list-page/service-list-page').then(m => m.ServiceListPage),
  },
  {
    path: 'services/new',
    loadComponent: () =>
      import('../services/pages/service-form-page/service-form-page').then(m => m.ServiceFormPage),
  },
  {
    path: 'services/:id',
    loadComponent: () =>
      import('../services/pages/service-form-page/service-form-page').then(m => m.ServiceFormPage),
  },
];
