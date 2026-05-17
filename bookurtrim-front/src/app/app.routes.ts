import { Routes } from '@angular/router';
import { LandingPage } from './features/landing/pages/landing-page/landing-page';
import { ProviderLayout } from './core/layouts/provider-layout/provider-layout';
import { ClientLayout } from './core/layouts/client-layout/client-layout';
import { authGuard } from './features/auth/guard/auth.guard';
import { clientGuard } from './features/auth/guard/client.guard';
import { providerGuard } from './features/auth/guard/provider.guard';

export const routes: Routes = [
  {
    path: '',
    component: LandingPage,
    pathMatch: 'full',
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
    children: [],
  },
  {
    path: 'pro',
    component: ProviderLayout,
    canActivate: [authGuard, providerGuard],
    children: [
      {
        path: 'services',
        loadChildren: () =>
          import('./features/services/service.routes').then(m => m.SERVICE_ROUTES),
      },
      { path: '', redirectTo: 'services', pathMatch: 'full' },
    ],
    loadChildren: () =>
      import('./features/provider/provider.routes').then(m => m.PROVIDER_ROUTES),
  },
  {
    path: '**',
    redirectTo: '',
  },
];
