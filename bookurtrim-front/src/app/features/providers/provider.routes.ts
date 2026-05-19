import { Routes } from '@angular/router';

export const PROVIDER_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./pages/provider-list-page/provider-list-page').then(m => m.ProviderListPage),
  },
  {
    path: ':id',
    loadComponent: () =>
      import('./pages/provider-detail-page/provider-detail-page').then(m => m.ProviderDetailPage),
  },
  {
    path: ':id/book',
    loadComponent: () =>
      import('./pages/booking-page/booking-page').then(m => m.BookingPage),
  },
];
