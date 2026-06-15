import { Routes } from '@angular/router';
import { LandingPage } from './features/landing/pages/landing-page/landing-page';
import { ProviderLayout } from './layouts/provider-layout/pages/provider-layout/provider-layout';
import { ClientLayout } from './layouts/client-layout/pages/client-layout/client-layout';
import { authGuard } from './features/auth/guard';
import { clientGuard } from './features/auth/guard';
import { providerGuard } from './features/auth/guard';
import { singleTenantGuard } from './features/provider-search/guards/single-tenant.guard';

export const routes: Routes = [
  {
    // Si le prestataire configuré (environment.providerId) a activé le mode
    // "single-tenant", l'accueil redirige vers sa page au lieu de la landing.
    path: '',
    pathMatch: 'full',
    component: LandingPage,
    canActivate: [singleTenantGuard],
  },
  {
    path: 'auth',
    loadChildren: () =>
      import('./features/auth/auth.routes').then(m => m.AUTH_ROUTES),
  },
  {
    path: 'client',
    component: ClientLayout,
    canActivate: [authGuard, clientGuard],
    children: [
      {
        path: 'providers',
        loadChildren: () =>
          import('./features/provider-search/provider.routes').then(m => m.PROVIDER_ROUTES),
      },
      {
        path: 'profile',
        loadComponent: () =>
          import('./features/client-profile/pages/client-profile-page/client-profile-page')
            .then(m => m.ClientProfilePage),
      },
      {
        path: 'appointments',
        loadComponent: () =>
          import('./features/appointments/pages/appointment-list-page/appointment-list-page')
            .then(m => m.AppointmentListPage),
      },
      {
        path: 'payments',
        loadChildren: () =>
          import('./features/payments/payments.routes').then(m => m.PAYMENT_ROUTES),
      },
      { path: '', redirectTo: 'providers', pathMatch: 'full' },
    ],
  },
  {
    path: 'pro',
    component: ProviderLayout,
    canActivate: [authGuard, providerGuard],
    loadChildren: () =>
      import('./features/provider/provider.routes').then(m => m.PROVIDER_ROUTES),
  },
  {
    path: '**',
    redirectTo: '',
  },
];
