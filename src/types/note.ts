export interface Note {
  id: string;
  title: string;
  content: string;
  category: string;
  createdAt: Date;
  updatedAt: Date;
  isImportant?: boolean;
  reminderDate?: Date;
  isChecked?: boolean;
}

export interface NoteCategory {
  id: string;
  name: string;
  color: string;
}