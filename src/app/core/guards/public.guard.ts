import { inject, PLATFORM_ID } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';
import { AuthService } from '../service/auth.service';

export const publicGuard: CanActivateFn = () => {
  const router = inject(Router);
  const platformId = inject(PLATFORM_ID);

  // We only perform the check in the browser to avoid SSR hydration mismatches
  if (isPlatformBrowser(platformId)) {
    const authService = inject(AuthService);
    const userId = authService.getUserId()
    // If a userId exists, the user is logged in.
    // Redirect them to home if they try to access login/signup.
    if (userId) {
      return router.createUrlTree(['/home']);
    }
  }
  
  // Otherwise, allow access to the public route
  return true;
};