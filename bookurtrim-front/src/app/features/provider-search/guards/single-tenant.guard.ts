import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { map, catchError, of } from 'rxjs';
import { ProviderService } from '../services/provider.service';
import { environment } from '../../../../environments/environment';

// Si l'instance est configurée pour un prestataire (environment.providerId) et que
// celui-ci a activé le mode "single-tenant", l'accueil mène directement à sa page
// au lieu de la landing/marketplace générique.
export const singleTenantGuard: CanActivateFn = () => {
  const providerId = environment.providerId;
  if (!providerId) return of(true);

  const providerService = inject(ProviderService);
  const router = inject(Router);

  return providerService.getById(providerId).pipe(
    map(provider =>
      provider.isSingleTenant ? router.createUrlTree(['/providers', providerId]) : true
    ),
    catchError(() => of(true))
  );
};
