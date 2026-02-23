import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { LucideAngularModule } from 'lucide-angular';
import { ApiService } from '../../core/service/api.service';

@Component({
  selector: 'app-notebook-detail',
  standalone: true,
  imports: [CommonModule, LucideAngularModule, RouterLink],
  templateUrl: './notebook-details.component.html'
})
export class NotebookDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private apiService = inject(ApiService);

  notebookId: string | null = null;
  notebookName: string = 'Loading...';
  notes: any[] = []; 

  // Modal State
  isDeleteModalOpen = false;
  noteToDelete: any = null;
  isProcessing = false;

  ngOnInit() {
    this.notebookId = this.route.snapshot.paramMap.get('id');
    if (this.notebookId) {
      this.loadNotebookData();
    }
  }

  loadNotebookData() {
    this.apiService.getNotebookDetails(this.notebookId!).subscribe({
      next: (res: any) => {
        const { data } = res;
        if (data && data.length > 0) {
          const {name, notes} = data[0]
          console.log("data ->", data)
          this.notebookName = name
          this.notes = notes
        }
      },
      error: (err) => console.error('Error loading notebook', err)
    });
  }

  openNote(noteId: string) {
    this.router.navigate(['/notes/view', noteId]);
  }

  createNewNote() {
    this.router.navigate(['/notes/add-note'], { 
      queryParams: { notebookId: this.notebookId } 
    });
  }

  // --- Custom Delete Workflow ---
  openDeleteModal(event: Event, note: any) {
    event.stopPropagation(); // Stop card click
    this.noteToDelete = note;
    this.isDeleteModalOpen = true;
  }

  closeDeleteModal() {
    this.isDeleteModalOpen = false;
    this.noteToDelete = null;
    this.isProcessing = false;
  }

  confirmDelete() {
    if (!this.noteToDelete) return;
    
    this.isProcessing = true;
    this.apiService.deleteNote(this.noteToDelete._id).subscribe({
      next: () => {
      
        this.closeDeleteModal();
        this.loadNotebookData()
      },
      error: (err) => {
        alert('Failed to delete note.');
        this.isProcessing = false;
      }
    });
  }
}