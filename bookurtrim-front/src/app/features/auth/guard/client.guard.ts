import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const clientGuard: CanActivateFn = (_route, state) => {
  const auth = inject(AuthService);
  const router = inject(Router);

  if (auth.isClient()) return true;
  if (auth.isAuthenticated()) return router.createUrlTree(['/pro']);
  return router.createUrlTree(['/auth/login'], { queryParams: { returnUrl: state.url } });
};
