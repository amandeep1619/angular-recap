import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LucideAngularModule } from 'lucide-angular';
import { Router } from '@angular/router';
import { ApiService } from '../../core/service/api.service';
import { AuthService } from '../../core/service/auth.service';
import { User } from '../../models/user.model';
@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, FormsModule, LucideAngularModule],
  templateUrl: './profile.component.html'
})
export class ProfileComponent implements OnInit {
  private apiService = inject(ApiService);
  private authService = inject(AuthService);
  private router = inject(Router);

  user: User = {
    _id: '',
    email: '',
    fullName: '',
    age: 0,
    mobileNumber: ''
  };

  ngOnInit() {
    const userId = this.authService.getUserId();
    if (userId) {
      this.loadUserProfile(userId);
    }
  }

  loadUserProfile(id: string) {
    // API service uses getUserDetails
    this.apiService.getUserDetails(id).subscribe({
      next: (data) => this.user = data,
      error: (err) => console.error('Failed to load profile', err)
    });
  }

  saveProfile() {
    // Fixed: Removed the trailing dot and used updateUserDetails
    this.apiService.updateUserDetails(this.user._id, this.user).subscribe({
      next: (updatedUser) => {
        this.user = updatedUser;
        alert('Profile updated successfully!');
      },
      error: (err) => alert('Update failed. Please try again.')
    });
  }

  deleteAccount() {
    const confirmation = confirm(
      'WARNING: Are you sure you want to delete your account? This action is permanent and all your notebooks will be lost.'
    );

    if (confirmation) {
      this.apiService.deleteAccount(this.user._id).subscribe({
        next: () => {
          this.authService.logout();
          this.router.navigate(['/signup']);
        },
        error: (err) => alert('Could not delete account. Contact support.')
      });
    }
  }
}