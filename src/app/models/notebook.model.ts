export interface Notebook {
  _id: string;
  name: string;
  userId: string;
  sharedWith: string[]; // List of usernames
}

export interface Note {
  _id: string;
  title: string;
  body: string;
  notebookId: string;
}