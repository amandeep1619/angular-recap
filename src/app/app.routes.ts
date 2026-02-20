import { Routes } from '@angular/router';
import { MainLayoutComponent } from './layout/main-layout/main-layout.component';
import { authGuard } from './core/guards/auth.guard';
import { publicGuard } from './core/guards/public.guard';
import { HomeComponent } from './pages/home/home.component';
import { NoteEditorComponent } from './features/notes/note-editor/note-editor.component';

export const routes: Routes = [
  // Landing Page (Public)
  { 
    path: '', 
    loadComponent: () => import('./features/landing/landing.component').then(m => m.LandingComponent) 
  },
  
  // Auth Pages (Only for non-logged in users)
  { 
    path: 'login', 
    canActivate: [publicGuard],
    loadComponent: () => import('./features/auth/login/login.component').then(m => m.LoginComponent) 
  },
  { 
    path: 'signup', 
    canActivate: [publicGuard],
    loadComponent: () => import('./features/auth/signup/signup.component').then(m => m.SignupComponent) 
  },

  // App Pages (Protected by Sidebar and AuthGuard)
  {
    path: '',
    component: MainLayoutComponent,
    canActivate: [authGuard],
    children: [
      { path: 'home', component: HomeComponent },
      { 
        path: 'profile', 
        loadComponent: () => import('./features/profile/profile.component').then(m => m.ProfileComponent) 
      },
      { 
        path: 'notebook/:id', 
        loadComponent: () => import('./features/notebook-details/notebook-details.component').then(m => m.NotebookDetailComponent) 
      },
      { path: 'edit-note/:id', component: NoteEditorComponent },
      { path: 'add-note', component: NoteEditorComponent }

    ]
  },
  
  // Fallback
  { path: '**', redirectTo: '' }
];