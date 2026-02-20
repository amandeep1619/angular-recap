export interface Notebook {
  id: string;
  name: string;
  userId: string;
  sharedWith: string[]; // List of usernames
}

export interface Note {
  id: string;
  title: string;
  body: string;
  notebookId: string;
}