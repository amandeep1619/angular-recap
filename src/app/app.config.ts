import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { provideClientHydration } from '@angular/platform-browser';
import { provideHttpClient, withFetch, withInterceptors } from '@angular/common/http';
import {
  LucideAngularModule,
  Plus,
  Notebook,
  User,
  LogOut,
  Settings,
  Trash2,
  LayoutGrid,
  ArrowLeft,
  FileText,
  Check,
  Menu,
  X,
  Loader2,
  Calendar,
  ChevronRight,
  FilePlus2,
  Edit3,
  Share2,
  Search
} from 'lucide-angular';

import { authInterceptor } from './core/interceptor/auth.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideClientHydration(),
    provideHttpClient(withFetch(), withInterceptors([authInterceptor])),
    importProvidersFrom(
      LucideAngularModule.pick({
        Plus,
        Notebook,
        User,
        LogOut,
        Settings,
        Trash2,
        LayoutGrid,
        ArrowLeft,
        FileText,
        Check,
        Menu,
        X,
        Loader2,
        Calendar,
        ChevronRight,
        FilePlus2,
        Edit3,
        Share2,
        Search
      })
    )
  ]
};