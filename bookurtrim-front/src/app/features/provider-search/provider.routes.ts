import { Routes } from '@angular/router';
import { authGuard, clientGuard } from '../auth/guard';

export const PROVIDER_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./pages/provider-list-page/provider-list-page').then(m => m.ProviderListPage),
  },
  {
    path: ':id',
    loadComponent: () =>
      import('./pages/provider-detail-layout/provider-detail-layout').then(m => m.ProviderDetailLayout),
    children: [
      { path: '', pathMatch: 'full', redirectTo: 'rendez-vous' },
      {
        path: 'rendez-vous',
        loadComponent: () =>
          import('./pages/provider-book-page/provider-book-page').then(m => m.ProviderBookPage),
      },
      {
        path: 'avis',
        loadComponent: () =>
          import('./pages/provider-reviews-page/provider-reviews-page').then(m => m.ProviderReviewsPage),
      },
      {
        path: 'a-propos',
        loadComponent: () =>
          import('./pages/provider-about-page/provider-about-page').then(m => m.ProviderAboutPage),
      },
    ],
  },
  {
    path: ':id/book',
    canActivate: [authGuard, clientGuard],
    loadComponent: () =>
      import('./pages/booking-page/booking-page').then(m => m.BookingPage),
  },
];
