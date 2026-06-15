import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const providerGuard: CanActivateFn = () => {
  const auth = inject(AuthService);
  const router = inject(Router);

  if (auth.isProvider()) return true;
  if (auth.isAuthenticated()) return router.createUrlTree(['/client']);
  return router.createUrlTree(['/auth/login']);
};
