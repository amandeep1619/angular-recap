import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; // Required for ngModel
import { RouterLink } from '@angular/router';
import { LucideAngularModule } from 'lucide-angular';
import { ApiService } from '../../core/service/api.service';
import { AuthService } from '../../core/service/auth.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, LucideAngularModule],
  templateUrl: './home.component.html'
})
export class HomeComponent implements OnInit {
  private apiService = inject(ApiService);
  private authService = inject(AuthService);

  notebooks: any[] = [];
  isModalOpen = false;
  newNotebookName = '';

  ngOnInit() {
    this.loadNotebooks();
  }

  loadNotebooks() {
    const userId = this.authService.getUserId();
    if (userId) {
      // this.apiService.getNotebooks(userId).subscribe({
      //   next: (data) => this.notebooks = data,
      //   error: (err) => console.error('Failed to load notebooks', err)
      // });
    }
  }

  openModal() {
    this.isModalOpen = true;
  }

  closeModal() {
    this.isModalOpen = false;
    this.newNotebookName = '';
  }

  confirmCreate() {
    const userId = this.authService.getUserId();
    if (!this.newNotebookName.trim() || !userId) return;

    this.apiService.createNotebook(this.newNotebookName, userId).subscribe({
      next: (newBook) => {
        this.notebooks.unshift(newBook); // Add to list immediately
        this.closeModal();
      },
      error: (err) => alert('Failed to create notebook. Try again.')
    });
  }

  getInitial(name: string): string {
    return name ? name.charAt(0).toUpperCase() : '?';
  }
}