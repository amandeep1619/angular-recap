import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ApiService } from './core/service/api.service';
import { AuthService } from './core/service/auth.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'inotes-ssr-app';
  constructor(private apiService: ApiService, private authService: AuthService){

  }
  initUserDetails () {
    if (this.authService.userDetails() != null) {
      if (this.authService.getAuthToken() !== null) {
        
      }
    }
  }
}
