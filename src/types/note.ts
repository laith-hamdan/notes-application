export interface Note {
  id: string;
  title: string;
  content: string;
  category: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface NoteCategory {
  id: string;
  name: string;
  color: string;
}