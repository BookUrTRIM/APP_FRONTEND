import { Routes } from '@angular/router';

export const PROVIDER_ROUTES: Routes = [
  {
    path: 'appointments',
    loadComponent: () =>
      import('../appointments/pages/provider-appointment-list-page/provider-appointment-list-page')
        .then(m => m.ProviderAppointmentListPage),
  },
  {
    path: 'planning',
    loadComponent: () =>
      import('./pages/planning-page/planning-page').then(m => m.PlanningPage),
  },
  {
    path: 'dashboard',
    loadComponent: () =>
      import('../dashboard/components/dashboard-component/dashboard-component').then(m => m.DashboardComponent),
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
  {
    path: 'stripe-connect',
    loadComponent: () =>
      import('./pages/stripe-connect-page/stripe-connect-page').then(m => m.StripeConnectPage),
  },
  {
    path: 'stripe/return',
    loadComponent: () =>
      import('./pages/stripe-return-page/stripe-return-page').then(m => m.StripeReturnPage),
    data: { mode: 'return' },
  },
  {
    path: 'stripe/refresh',
    loadComponent: () =>
      import('./pages/stripe-return-page/stripe-return-page').then(m => m.StripeReturnPage),
    data: { mode: 'refresh' },
  },
];
