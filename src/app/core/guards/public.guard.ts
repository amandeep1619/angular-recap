import { inject, PLATFORM_ID } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';
import { AuthService } from '../service/auth.service';

export const publicGuard: CanActivateFn = () => {
  const router = inject(Router);
  const platformId = inject(PLATFORM_ID);

  if (isPlatformBrowser(platformId)) {
    const authService = inject(AuthService);
    const userId = authService.getUserId()
    if (userId) {
      return router.createUrlTree(['/home']);
    }
  }
  return true;
};