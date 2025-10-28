import { inject } from '@angular/core';
import { Router, CanActivateFn, UrlTree } from '@angular/router';
import { AuthApi } from '../services/auth-api';

export const authGuard: CanActivateFn = async (): Promise<boolean | UrlTree> => {
  const auth = inject(AuthApi);
  const router = inject(Router);

  try {
    const authenticated = await auth.getMe();
    if (authenticated) {
      return true;
    } else {
      return router.parseUrl('/login');
    }
  } catch {
    return router.parseUrl('/login');
  }
};
