import { Injectable, inject } from '@angular/core'; // Corrected: Injectable comes from core
import { HttpClient } from '@angular/common/http'; // HttpClient stays in common/http
import { Observable } from 'rxjs';
// --- Data Interfaces ---

export interface User {
  id: string;
  email: string;
  password?: string;
  fullName?: string;
  age?: number;
  mobileNumber?: string;
}

export interface Notebook {
  id: string;
  name: string;
  userId: string;
  sharedWith: string[]; // Array of usernames for the overlapping circles UI
}

export interface Note {
  id: string;
  title: string;
  body: string; // Content from the code editor
  userId: string;
  notebookId: string;
}

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private http = inject(HttpClient);
  private readonly baseUrl = 'http://localhost:8000/api/v1';

  constructor() {}

  // ==========================================
  // USERS ENDPOINTS (Prefix: /users)
  // ==========================================

  getUserDetails(id: string): Observable<User> {
    return this.http.get<User>(`${this.baseUrl}/users/${id}`);
  }

  updateUserDetails(id: string, data: Partial<User>): Observable<User> {
    return this.http.put<User>(`${this.baseUrl}/users/${id}`, data);
  }

  deleteAccount(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/users/${id}`);
  }

  createAccount(data: any): Observable<User> {
    return this.http.post<User>(`${this.baseUrl}/users`, data);
  }

  // ==========================================
  // NOTEBOOK ENDPOINTS (Prefix: /note-books)
  // ==========================================

  /** Gets details including the list of notes inside the notebook */
  getNotebookDetails(id: string): Observable<Notebook & { notes: Note[] }> {
    return this.http.get<any>(`${this.baseUrl}/note-books/${id}`);
  }

  updateNotebook(id: string, name: string): Observable<Notebook> {
    return this.http.put<Notebook>(`${this.baseUrl}/note-books/${id}`, { name });
  }

  deleteNotebook(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/note-books/${id}`);
  }

  createNotebook(name: string, userId: string): Observable<Notebook> {
    return this.http.post<Notebook>(`${this.baseUrl}/note-books`, { name, userId });
  }

  // ==========================================
  // NOTES ENDPOINTS (Prefix: /notes)
  // ==========================================

  getNoteDetails(id: string): Observable<Note> {
    return this.http.get<Note>(`${this.baseUrl}/notes/${id}`);
  }

  updateNote(id: string, data: { title?: string; body?: string }): Observable<Note> {
    return this.http.put<Note>(`${this.baseUrl}/notes/${id}`, data);
  }

  deleteNote(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/notes/${id}`);
  }

  createNote(title: string, body: string, userId: string, notebookId: string): Observable<Note> {
    return this.http.post<Note>(`${this.baseUrl}/notes`, { title, body, userId, notebookId });
  }
}