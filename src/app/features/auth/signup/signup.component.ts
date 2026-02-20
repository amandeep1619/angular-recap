import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { LucideAngularModule } from 'lucide-angular';
import { ApiService } from '../../../core/service/api.service';
import { AuthService } from '../../../core/service/auth.service';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, LucideAngularModule],
  templateUrl: './signup.component.html'
})
export class SignupComponent {
  email = '';
  password = '';
  
  private apiService = inject(ApiService);
  private authService = inject(AuthService);
  private router = inject(Router);

  onSignup(event: Event) {
    event.preventDefault();
    
    if (this.email && this.password) {
      // Calling your POST /users endpoint
      this.apiService.createAccount({
        email: this.email, 
        password: this.password 
      }).subscribe({
        next: (user) => {
          this.authService.setUserId(user.id);
          this.router.navigate(['/home']);
        },
        error: (err) => {
          alert('Signup failed. Email might already be taken.');
        }
      });
    }
  }
}