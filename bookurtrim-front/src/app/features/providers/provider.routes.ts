import { Routes } from '@angular/router';

export const PROVIDER_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./pages/provider-list-page/provider-list-page').then(m => m.ProviderListPage),
  },
];
