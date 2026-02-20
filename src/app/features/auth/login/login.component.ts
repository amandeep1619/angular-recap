import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { LucideAngularModule } from 'lucide-angular';
import { AuthService } from '../../../core/service/auth.service';
import { ApiService } from '../../../core/service/api.service';
@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, LucideAngularModule],
  templateUrl: './login.component.html'
})
export class LoginComponent {
  email = '';
  password = '';
  constructor(private apiServie: ApiService){}
  private authService = inject(AuthService);
  private router = inject(Router);

  onLogin(event: Event) {
    event.preventDefault();
    
    // For this demo/API integration:
    // Typically you'd call an auth endpoint. Since we have a 'createAccount' POST /, 
    // we'll assume a successful check sets the ID in localStorage.
    
    if (this.email && this.password) {
      this.apiServie.loginUser(this.email, this.password).subscribe((res) => {
        const data = res.data[0]
        this.authService.saveLoginToken(data.token, data.id)
        this.router.navigate(['/home']);
      })
      // Logic: Mocking a successful login by storing a dummy ID
    }
  }
}