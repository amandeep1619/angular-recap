import { Component, OnDestroy, OnInit, inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Editor, NgxEditorModule, Toolbar } from 'ngx-editor';
import { LucideAngularModule } from 'lucide-angular';
import { ApiService } from '../../../core/service/api.service';
import { AuthService } from '../../../core/service/auth.service';

type EditorMode = 'view' | 'edit' | 'add';

@Component({
  selector: 'app-note-editor',
  standalone: true,
  imports: [CommonModule, FormsModule, NgxEditorModule, LucideAngularModule, RouterLink],
  templateUrl: './note-editor.component.html',
  styleUrls: ['./note-editor.component.css']
})
export class NoteEditorComponent implements OnInit, OnDestroy {
  private platformId = inject(PLATFORM_ID);
  private apiService = inject(ApiService);
  private authService = inject(AuthService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  // State
  mode: EditorMode = 'view';
  noteId: string | null = null;
  notebookId: string | null = null;
  isOwner: boolean = false;
  isSaving: boolean = false;

  // Data
  title: string = '';
  content: string = '';

  // Editor Config
  editor: Editor | null = null;
  toolbar: Toolbar = [
    ['bold', 'italic'], ['underline', 'strike'],
    ['code', 'blockquote'], ['ordered_list', 'bullet_list'],
    [{ heading: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'] }],
    ['link', 'image'], ['align_left', 'align_center', 'align_right', 'align_justify'],
  ];

  ngOnInit (): void {
    const url = this.router.url;
    this.noteId = this.route.snapshot.paramMap.get('id');
    this.notebookId = this.route.snapshot.queryParamMap.get('notebookId');

    // 1. Determine Mode
    if (url.includes('notes/add-note')) {
      this.mode = 'add';
    } else if (url.includes('edit-note')) {
      this.mode = 'edit';
    } else {
      this.mode = 'view';
    }

    // 2. Init Editor
    if (isPlatformBrowser(this.platformId)) {
      this.editor = new Editor();

      // If we are starting in view mode, we need to lock the view once it's ready
      if (this.mode === 'view') {
        this.updateEditorLock(false);
      }
    }

    // 3. Load Data
    if (this.noteId) {
      this.loadNote();
    }
  }

  // Helper to safely toggle editor editability
  private updateEditorLock (isEditable: boolean) {
    if (this.editor) {
      this.editor.view?.setProps({
        editable: () => isEditable
      });
    }
  }

  loadNote () {
    this.apiService.getNoteDetails(this.noteId!).subscribe({
      next: (res: any) => {
        const note = res.data[0];
        this.title = note.title;
        this.content = note.jsonBody || '';
        this.notebookId = note.notebookId;

        // Ownership Check
        const currentUserId = this.authService.getUserId();
        this.isOwner = note.userId === currentUserId;

        // Security Guard
        if (this.mode === 'edit' && !this.isOwner) {
          this.router.navigate(['/notes/view', this.noteId]);
        }

        // Apply lock if in view mode
        if (this.mode === 'view') {
          this.updateEditorLock(false);
        }
      },
      error: () => this.router.navigate(['/home'])
    });
  }

  saveNote () {
    if (!this.title.trim()) return;
    this.isSaving = true;

    if (this.mode === 'edit') {
      this.apiService.updateNote({ title: this.title, body: this.content, id: this.noteId! }).subscribe({
        next: () => this.router.navigate(['/notes/view', this.noteId]),
        error: () => this.handleError()
      });
    } else if (this.mode === 'add') {
      this.apiService.createNote({
        title: this.title,
        body: this.content,
        userId: this.authService.getUserId()!,
        notebookId: this.notebookId!
      }).subscribe({
        next: (res) => {
          const noteId = res.data[0].id
          this.router.navigate(['/notes/view', noteId])
        },
        error: () => this.handleError()
      });
    }
  }

  toggleEdit () {
    this.router.navigate(['/notes/edit-note/', this.noteId]);
  }

  goBack () {
    if (this.notebookId) {
      this.router.navigate(['/notebook', this.notebookId]);
    }  else {
      this.router.navigate(['/home']);
    }
  }

  private handleError () {
    this.isSaving = false;
    alert('Operation failed. Please try again.');
  }

  ngOnDestroy (): void {
    if (this.editor) this.editor.destroy();
  }
}