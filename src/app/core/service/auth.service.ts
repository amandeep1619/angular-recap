import { Injectable, PLATFORM_ID, inject, signal } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private platformId = inject(PLATFORM_ID);
  
  // A signal to track login status reactively
  isLoggedIn = signal<boolean>(false);

  constructor() {
    // Check status on initialization (Browser only)
    if (isPlatformBrowser(this.platformId)) {
      this.isLoggedIn.set(!!localStorage.getItem('userId'));
    }
  }

  setUserId(id: string) {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem('userId', id);
      this.isLoggedIn.set(true);
    }
  }

  getUserId(): string | null {
    if (isPlatformBrowser(this.platformId)) {
      return localStorage.getItem('userId');
    }
    return null;
  }

  logout() {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem('userId');
      this.isLoggedIn.set(false);
    }
  }
}