import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../service/auth.service';
import { catchError, throwError } from 'rxjs';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const router = inject(Router); // Inject Router for redirection
  const token = authService.getAuthToken();

  const isLogin = req.url.includes('/users/auth/login');
  const isCreateAccount = req.url.endsWith('/users') && req.method === 'POST';

  // Clone request with header if conditions are met
  let clonedReq = req;
  if (token && !isLogin && !isCreateAccount) {
    clonedReq = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
  }

  // Handle the response and watch for 401 errors
  return next(clonedReq).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401) {
        // Option 1: Log out user locally to clear stale tokens
        authService.logout(); 
        
        // Option 2: Redirect to login page
        router.navigate(['/login']);
      }
      
      // Pass the error back to the component in case it needs to show a specific message
      return throwError(() => error);
    })
  );
};