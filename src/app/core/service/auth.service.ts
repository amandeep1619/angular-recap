import { Injectable, PLATFORM_ID, inject, signal } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { User } from './api.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private platformId = inject(PLATFORM_ID);
  readonly ACCESS_TOKEN_KEY: string = 'access_token'
  readonly USER_ID_KEY: string = 'userId'
  isLoggedIn = signal<boolean>(false);
  userDetails = signal<User | null>(null)

  constructor() {
    if (isPlatformBrowser(this.platformId)) {
      this.isLoggedIn.set(!!localStorage.getItem(this.USER_ID_KEY));
    }
  }

  saveLoginToken (token: string, userId: string) {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem(this.ACCESS_TOKEN_KEY, token);
      localStorage.setItem(this.USER_ID_KEY, userId);

    }
  }

  updateUserDetails (userDetails: User) {
    this.userDetails.set(userDetails)
  }

  getAuthToken (): string | null {
    if (isPlatformBrowser(this.platformId)) {
      return localStorage.getItem(this.ACCESS_TOKEN_KEY);
    }
    return null;
  }

  getUserId (): string {
    if (isPlatformBrowser(this.platformId)) {
      return localStorage.getItem(this.USER_ID_KEY) as string
    }
    return ''
  }
  getUserDetails () {
    return this.userDetails
  }
  logout () {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem(this.ACCESS_TOKEN_KEY);
      localStorage.removeItem(this.USER_ID_KEY);
      this.isLoggedIn.set(false);
      this.userDetails.set(null)
    }
  }
}