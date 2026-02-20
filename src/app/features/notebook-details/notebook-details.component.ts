import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { LucideAngularModule } from 'lucide-angular';
import { ApiService } from '../../core/service/api.service';
import { Note } from '../../models/notebook.model';

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
  notes: Note[] = [];

  ngOnInit() {
    this.notebookId = this.route.snapshot.paramMap.get('id');
    if (this.notebookId) {
      this.loadNotebookData();
    }
  }

  loadNotebookData() {
    this.apiService.getNotebookDetails(this.notebookId!).subscribe({
      next: (data) => {
        this.notebookName = data.name;
        this.notes = data.notes;
      },
      error: (err) => console.error('Error loading notebook', err)
    });
  }

  openNote(noteId: string) {
    this.router.navigate(['/notes/view', noteId]);
  }

  createNewNote() {
    // Logic to open a creation modal or redirect to /notes/new
  }

  deleteNote(id: string) {
    if(confirm('Are you sure you want to delete this note?')) {
      this.apiService.deleteNote(id).subscribe(() => this.loadNotebookData());
    }
  }
}