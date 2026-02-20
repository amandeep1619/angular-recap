import { Component, OnDestroy, OnInit, inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Editor, NgxEditorModule, Toolbar } from 'ngx-editor';
import { LucideAngularModule } from 'lucide-angular';
import { ApiService } from '../../../core/service/api.service';
import { AuthService } from '../../../core/service/auth.service';

@Component({
  selector: 'app-note-editor',
  standalone: true,
  imports: [CommonModule, FormsModule, NgxEditorModule, LucideAngularModule],
  templateUrl: './note-editor.component.html',
  styleUrls: ['./note-editor.component.css']
})
export class NoteEditorComponent implements OnInit, OnDestroy {
  // Injections
  private platformId = inject(PLATFORM_ID);
  private apiService = inject(ApiService);
  private authService = inject(AuthService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  // Editor Properties
  editor: Editor | null = null;
  toolbar: Toolbar = [
    ['bold', 'italic'],
    ['underline', 'strike'],
    ['code', 'blockquote'],
    ['ordered_list', 'bullet_list'],
    [{ heading: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'] }],
    ['link', 'image'],
    ['align_left', 'align_center', 'align_right', 'align_justify'],
  ];

  // Note Data
  noteId: string | null = null;
  notebookId: string | null = null;
  title: string = '';
  content: string = '';

  ngOnInit(): void {
    // 1. Get Route Params
    this.noteId = this.route.snapshot.paramMap.get('id');
    this.notebookId = this.route.snapshot.queryParamMap.get('notebookId');

    // 2. Initialize Editor ONLY in browser
    if (isPlatformBrowser(this.platformId)) {
      this.editor = new Editor();
    }

    // 3. Load Data if editing
    if (this.noteId && this.noteId !== 'new') {
      this.loadNote();
    }
  }

  loadNote() {
    this.apiService.getNoteDetails(this.noteId!).subscribe({
      next: (note) => {
        this.title = note.title;
        this.content = note.body;
      },
      error: (err) => console.error('Error loading note', err)
    });
  }

  saveNote() {
    const userId = this.authService.getUserId() || '';
    
    // Safety check: ensure we have a notebookId if it's new
    if (!this.notebookId && this.noteId === 'new') {
      alert('Missing Notebook ID context');
      return;
    }

    if (this.noteId === 'new') {
      this.apiService.createNote(this.title, this.content, userId, this.notebookId!).subscribe({
        next: () => this.router.navigate(['/notebook', this.notebookId]),
        error: (err) => alert('Failed to create note. Is your API running?')
      });
    } else {
      this.apiService.updateNote(this.noteId!, { title: this.title, body: this.content }).subscribe({
        next: () => this.router.navigate(['/home']), // Or back to specific notebook
        error: (err) => alert('Update failed.')
      });
    }
  }

  ngOnDestroy(): void {
    // 4. Safe Cleanup
    if (this.editor) {
      this.editor.destroy();
    }
  }
}