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
      import('../dashboard/pages/dashboard-page/dashboard-page').then(m => m.DashboardPageComponent),
  },
  {
    path: 'services',
    loadComponent: () =>
      import('../prestations/pages/service-list-page/service-list-page').then(m => m.ServiceListPage),
  },
  {
    path: 'services/new',
    loadComponent: () =>
      import('../prestations/pages/service-form-page/service-form-page').then(m => m.ServiceFormPage),
  },
  {
    path: 'services/:id',
    loadComponent: () =>
      import('../prestations/pages/service-form-page/service-form-page').then(m => m.ServiceFormPage),
  },
  {
    path: 'profile',
    loadComponent: () =>
      import('./pages/profile-page/profile-page').then(m => m.ProfilePage),
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
