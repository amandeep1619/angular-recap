// import { Component, OnInit, inject } from '@angular/core';
// import { CommonModule } from '@angular/common';
// import { FormsModule } from '@angular/forms';
// import { RouterLink } from '@angular/router';
// import { LucideAngularModule } from 'lucide-angular';
// import { ApiService } from '../../core/service/api.service';
// import { AuthService } from '../../core/service/auth.service';

// @Component({
//   selector: 'app-home',
//   standalone: true,
//   imports: [CommonModule, FormsModule, RouterLink, LucideAngularModule],
//   templateUrl: './home.component.html'
// })
// export class HomeComponent implements OnInit {
//   private apiService = inject(ApiService);
//   private authService = inject(AuthService);
//   isSharing: boolean = false
//   notebooks: any[] = [];
//   selectedUsers: any[] = []
//   // Create Modal State
//   isModalOpen = false;
//   newNotebookName = '';
//   notebookToShare: any = null
//   // Delete Modal State
//   isDeleteModalOpen = false;
//   notebookToDelete: any = null;
//   isDeleting = false;
//   isShareModalOpen = false
//   userSearchQuery = '';
//   searchResults: any[] = [];

//   ngOnInit () {
//     this.loadNotebooks();
//   }

//   loadNotebooks () {
//     const userId = this.authService.getUserId();
//     if (userId) {
//       this.apiService.getNoteBookList(userId).subscribe({
//         next: (data) => {
//           this.notebooks = data.data;
//         },
//         error: (err) => console.error('Failed to load notebooks', err)
//       });
//     }
//   }

//   // --- New Delete Logic ---
//   openDeleteModal (event: Event, notebook: any) {
//     event.stopPropagation(); // Prevents navigating to notebook details
//     this.notebookToDelete = notebook;
//     this.isDeleteModalOpen = true;
//   }

//   closeDeleteModal () {
//     this.isDeleteModalOpen = false;
//     this.notebookToDelete = null;
//     this.isDeleting = false;
//   }

//   confirmDelete () {
//     if (!this.notebookToDelete) return;

//     this.isDeleting = true;
//     this.apiService.deleteNotebook(this.notebookToDelete._id).subscribe({
//       next: () => {
//         this.loadNotebooks();
//         this.closeDeleteModal();
//       },
//       error: (err) => {
//         alert('Failed to delete notebook.');
//         this.isDeleting = false;
//       }
//     });
//   }

//   // --- Create Logic (Preserved) ---
//   openModal () {
//     this.isModalOpen = true;
//   }

//   closeModal () {
//     this.isModalOpen = false;
//     this.newNotebookName = '';
//   }

//   confirmCreate () {
//     const userId = this.authService.getUserId();
//     if (!this.newNotebookName.trim() || !userId) return;

//     this.apiService.createNotebook(this.newNotebookName, userId).subscribe({
//       next: () => {
//         this.closeModal();
//         this.loadNotebooks();
//       },
//       error: (err) => alert('Failed to create notebook.')
//     });
//   }

//   getInitial (name: string): string {
//     return name ? name.charAt(0).toUpperCase() : '?';
//   }

//   openShareModal (event: Event, notebook: any) {
//     event.stopPropagation()
//     this.isShareModalOpen = true
//   }
//   closeShareModal () {
//     this.isShareModalOpen = false
//     this.searchResults = []
//     this.userSearchQuery = ''
//   }

//   removeUser (userId: string) {
//     this.searchResults = this.searchResults.filter(u => u._id != userId)
//   }

//   searchUsers () {

//     console.log("this.searchQuery", this.userSearchQuery)
//     this.apiService.searchUser(this.userSearchQuery).subscribe({
//       next: (res) => {
//         const {data} = res
//         this.searchResults = data[0]
//       },
//       error: () => {

//       }
//     })
//   }
//   selectUser (user: any) {
//     this.selectedUsers.push(user)
//   }

//   confirmShare () {

//   }
// }
import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { LucideAngularModule } from 'lucide-angular';
import { ApiService } from '../../core/service/api.service';
import { AuthService } from '../../core/service/auth.service';
import { Subject, debounceTime, distinctUntilChanged, switchMap, of } from 'rxjs';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, LucideAngularModule],
  templateUrl: './home.component.html'
})
export class HomeComponent implements OnInit, OnDestroy {
  private apiService = inject(ApiService);
  private authService = inject(AuthService);

  // Create a Subject for debouncing search
  private searchSubject = new Subject<string>();

  isSharing: boolean = false;
  notebooks: any[] = [];
  selectedUsers: any[] = [];

  // Create Modal State
  isModalOpen = false;
  newNotebookName = '';
  notebookToShare: any = null;

  // Delete Modal State
  isDeleteModalOpen = false;
  notebookToDelete: any = null;
  isDeleting = false;

  // Share Modal State
  isShareModalOpen = false;
  userSearchQuery = '';
  searchResults: any[] = [];

  ngOnInit () {
    this.loadNotebooks();
    this.initSearchDebounce();
  }

  // Cleanup to avoid memory leaks
  ngOnDestroy () {
    this.searchSubject.complete();
  }

  loadNotebooks () {
    const userId = this.authService.getUserId();
    if (userId) {
      this.apiService.getNoteBookList(userId).subscribe({
        next: (data) => {
          this.notebooks = data.data;
        },
        error: (err) => console.error('Failed to load notebooks', err)
      });
    }
  }

  // --- Debounce Setup ---
  private initSearchDebounce () {
    this.searchSubject.pipe(
      debounceTime(400),
      distinctUntilChanged(),
      switchMap((query) => {
        if (!query.trim() || query.length < 2) {
          this.searchResults = [];
          return of(null);
        }
        return this.apiService.searchUser(query);
      })
    ).subscribe({
      next: (res: any) => {
        if (res && res.data) {
          // CHANGE THIS LINE: 
          // If 'res.data' is the array of users, use it directly.
          // If 'res.data' is an array where the first element is the user list, keep data[0].
          this.searchResults = Array.isArray(res.data) ? res.data : [];
          console.log('Processed search results:', this.searchResults);
        }
      },
      error: (err) => console.error('Search error', err)
    });
  }

  // This is called by (input) in the HTML
  onSearchQueryChange () {
    this.searchSubject.next(this.userSearchQuery);
  }

  // --- New Delete Logic ---
  openDeleteModal (event: Event, notebook: any) {
    event.stopPropagation();
    this.notebookToDelete = notebook;
    this.isDeleteModalOpen = true;
  }

  closeDeleteModal () {
    this.isDeleteModalOpen = false;
    this.notebookToDelete = null;
    this.isDeleting = false;
  }

  confirmDelete () {
    if (!this.notebookToDelete) return;
    this.isDeleting = true;
    this.apiService.deleteNotebook(this.notebookToDelete._id).subscribe({
      next: () => {
        this.loadNotebooks();
        this.closeDeleteModal();
      },
      error: (err) => {
        alert('Failed to delete notebook.');
        this.isDeleting = false;
      }
    });
  }

  // --- Create Logic ---
  openModal () {
    this.isModalOpen = true;
  }

  closeModal () {
    this.isModalOpen = false;
    this.newNotebookName = '';
  }

  confirmCreate () {
    const userId = this.authService.getUserId();
    if (!this.newNotebookName.trim() || !userId) return;
    this.apiService.createNotebook(this.newNotebookName, userId).subscribe({
      next: () => {
        this.closeModal();
        this.loadNotebooks();
      },
      error: (err) => alert('Failed to create notebook.')
    });
  }

  getInitial (name: string): string {
    return name ? name.charAt(0).toUpperCase() : '?';
  }

  // --- Share Logic ---
  openShareModal (event: Event, notebook: any) {
    event.stopPropagation();
    this.notebookToShare = notebook; // Added this so we know WHICH notebook to share
    this.isShareModalOpen = true;
    this.selectedUsers = []; // Clear previous selections
  }

  closeShareModal () {
    this.isShareModalOpen = false;
    this.searchResults = [];
    this.userSearchQuery = '';
    this.selectedUsers = [];
  }

  removeUser (userId: string) {
    this.selectedUsers = this.selectedUsers.filter(u => u._id != userId);
  }

  selectUser (user: any) {
    // Check if user is already added to prevent duplicates
    const exists = this.selectedUsers.find(u => u._id === user._id);
    if (!exists) {
      this.selectedUsers.push(user);
    }
    // Optional: Clear search after selection
    this.userSearchQuery = '';
    this.searchResults = [];
  }

  confirmShare () {
    if (this.selectedUsers.length === 0 || !this.notebookToShare) return;

    this.isSharing = true;
    const userIds = this.selectedUsers.map(u => u._id);

    // this.apiService.shareNotebook(this.notebookToShare._id, userIds).subscribe({
    //   next: () => {
    //     alert('Notebook shared successfully!');
    //     this.closeShareModal();
    //     this.isSharing = false;
    //   },
    //   error: (err) => {
    //     alert('Failed to share notebook.');
    //     this.isSharing = false;
    //   }
    // });
  }
}