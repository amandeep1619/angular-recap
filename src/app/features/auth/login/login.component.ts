import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { LucideAngularModule } from 'lucide-angular';
import { AuthService } from '../../../core/service/auth.service';
@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, LucideAngularModule],
  templateUrl: './login.component.html'
})
export class LoginComponent {
  email = '';
  password = '';
  
  private authService = inject(AuthService);
  private router = inject(Router);

  onLogin(event: Event) {
    event.preventDefault();
    
    // For this demo/API integration:
    // Typically you'd call an auth endpoint. Since we have a 'createAccount' POST /, 
    // we'll assume a successful check sets the ID in localStorage.
    
    if (this.email && this.password) {
      // Logic: Mocking a successful login by storing a dummy ID
      this.authService.setUserId('user_123'); 
      this.router.navigate(['/home']);
    }
  }
}