import { Injectable, inject } from '@angular/core'; // Corrected: Injectable comes from core
import { HttpClient } from '@angular/common/http'; // HttpClient stays in common/http
import { Observable } from 'rxjs';
// --- Data Interfaces ---

export interface User {
  _id: string;
  email: string;
  password?: string;
  fullName?: string;
  age?: number;
  mobileNumber?: string;
}

export interface Notebook {
  _id: string;
  name: string;
  userId: string;
  sharedWith: string[]; // Array of usernames for the overlapping circles UI
}

export interface Note {
  _id: string;
  title: string;
  body: string; // Content from the code editor
  userId: string;
  notebookId: string;
}

export interface apiResponse {
  message: string
  status: number
  data: any[]
  errorDetails: object
}

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private http = inject(HttpClient);
  private readonly baseUrl = 'http://localhost:8000/api/v1';

  constructor() { }

  // ==========================================
  // USERS ENDPOINTS (Prefix: /users)
  // ==========================================

  getUserDetails (id: string): Observable<User> {
    return this.http.get<User>(`${this.baseUrl}/users/${id}`);
  }

  updateUserDetails (id: string, data: Partial<User>): Observable<User> {
    return this.http.put<User>(`${this.baseUrl}/users/${id}`, data);
  }

  deleteAccount (id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/users/${id}`);
  }

  createAccount (data: any): Observable<User> {
    return this.http.post<User>(`${this.baseUrl}/users`, data);
  }

  loginUser (email: string, password: string): Observable<apiResponse> {
    return this.http.post<apiResponse>(`${this.baseUrl}/users/auth/login`, { email, password })
  }
  // ==========================================
  // NOTEBOOK ENDPOINTS (Prefix: /note-books)
  // ==========================================

  /** Gets details including the list of notes inside the notebook */
  getNoteBookList (userId: string): Observable<apiResponse> {
    return this.http.get<any>(`${this.baseUrl}/note-books/list`);
  }
  getNotebookDetails (id: string): Observable<apiResponse> {
    return this.http.get<apiResponse>(`${this.baseUrl}/note-books/${id}`);
  }

  updateNotebook (id: string, name: string): Observable<Notebook> {
    return this.http.put<Notebook>(`${this.baseUrl}/note-books/${id}`, { name });
  }

  deleteNotebook (id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/note-books/${id}`);
  }

  createNotebook (name: string, userId: string): Observable<apiResponse> {
    return this.http.post<apiResponse>(`${this.baseUrl}/note-books`, { name });
  }


  // ==========================================
  // NOTES ENDPOINTS (Prefix: /notes)
  // ==========================================
  getNotesListByNoteId (id: string): Observable<apiResponse> {
    return this.http.get<apiResponse>(`${this.baseUrl}/notes/${id}`)
  }
  getNoteDetails (id: string): Observable<Note> {
    return this.http.get<Note>(`${this.baseUrl}/notes/${id}`);
  }

  updateNote ({ id, title, body }: { id: string, title: string, body: string}): Observable<apiResponse> {
    return this.http.put<apiResponse>(`${this.baseUrl}/notes/${id}`, { id, title, jsonBody:body });
  }

  deleteNote (id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/notes/${id}`);
  }

  createNote ({ title, body, userId, notebookId }: { title: string, body: string, userId: string, notebookId: string }): Observable<apiResponse> {
    return this.http.post<apiResponse>(`${this.baseUrl}/notes`, { title, jsonBody:body, userId, notebookId });
  }

}