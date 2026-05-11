import { Routes } from '@angular/router';
import {Landing} from './features/landing/components/landing/landing';
import {ProviderLayout} from './core/layouts/provider-layout/provider-layout';
import {ClientLayout} from './core/layouts/client-layout/client-layout';

export const routes: Routes = [
  {
    path: '',
    component: Landing,
    pathMatch: 'full',
  },
  {
    path: 'auth',
    loadChildren: () => import('./features/auth/auth.routes').then(m => m.AUTH_ROUTES)
  },
  {
    path: 'client',
    component: ClientLayout,
    // canActivate: [authGuard], // À décommenter quand on fera la sécurité
    children: [
      // Ici on mettra : la recherche, la prise de RDV, l'historique...
      // Exemple : { path: 'search', component: SearchComponent }
    ]
  },
  {
    path: 'pro',
    component: ProviderLayout,
    // canActivate: [authGuard, proRoleGuard], // Sécurité spécifique aux Pros
    children: [
      // Ici on mettra : le Dashboard, les dispos, les factures...
      // Exemple : { path: 'dashboard', component: DashboardComponent }
    ]
  },
  {
    path: '**',
    redirectTo: ''
  }
  ]
