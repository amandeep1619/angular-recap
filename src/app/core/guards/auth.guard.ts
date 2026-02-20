import { inject, PLATFORM_ID } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';

export const authGuard: CanActivateFn = () => {
  return true
  const router = inject(Router);
  const platformId = inject(PLATFORM_ID);

  if (isPlatformBrowser(platformId)) {
    const userId = localStorage.getItem('userId');
    return userId ? true : router.createUrlTree(['/login']);
  }
  
  return true; // During SSR, we let it through, hydration will handle the rest
};

export const publicGuard: CanActivateFn = () => {
  const router = inject(Router);
  const platformId = inject(PLATFORM_ID);

  if (isPlatformBrowser(platformId)) {
    const userId = localStorage.getItem('userId');
    return !userId ? true : router.createUrlTree(['/home']);
  }
  return true;
};