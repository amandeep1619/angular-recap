import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { provideClientHydration } from '@angular/platform-browser';
import { provideHttpClient, withFetch } from '@angular/common/http';
// 1. Add LayoutGrid, ArrowLeft, and FileText to the imports
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
  Check 
} from 'lucide-angular';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideClientHydration(),
    provideHttpClient(withFetch()),
    importProvidersFrom(
      LucideAngularModule.pick({ 
        Plus, 
        Notebook, 
        User, 
        LogOut, 
        Settings, 
        Trash2, 
        LayoutGrid, // 2. Add here
        ArrowLeft,  // 2. Add here
        FileText,   // Good for note lists
        Check       // Good for save buttons
      })
    )
  ]
};