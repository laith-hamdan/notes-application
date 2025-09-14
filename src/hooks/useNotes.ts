import { useState, useEffect } from 'react';
import { Note, NoteCategory } from '@/types/note';

const STORAGE_KEY = 'notes-app-data';
const CATEGORIES_KEY = 'notes-app-categories';

const defaultCategories: NoteCategory[] = [
  { id: 'personal', name: 'Personal', color: '#8B5CF6' },
  { id: 'work', name: 'Work', color: '#06B6D4' },
  { id: 'ideas', name: 'Ideas', color: '#F59E0B' },
];

export const useNotes = () => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [categories, setCategories] = useState<NoteCategory[]>(defaultCategories);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  useEffect(() => {
    const savedNotes = localStorage.getItem(STORAGE_KEY);
    const savedCategories = localStorage.getItem(CATEGORIES_KEY);
    
    if (savedNotes) {
      const parsedNotes = JSON.parse(savedNotes).map((note: any) => ({
        ...note,
        createdAt: new Date(note.createdAt),
        updatedAt: new Date(note.updatedAt),
        reminderDate: note.reminderDate ? new Date(note.reminderDate) : undefined,
      }));
      setNotes(parsedNotes);
    }
    
    if (savedCategories) {
      setCategories(JSON.parse(savedCategories));
    }
  }, []);

  // Check for due reminders
  useEffect(() => {
    const checkReminders = () => {
      const now = new Date();
      notes.forEach(note => {
        if (note.reminderDate && note.reminderDate <= now) {
          // Show notification
          if ('Notification' in window && Notification.permission === 'granted') {
            new Notification(`Reminder: ${note.title}`, {
              body: note.content.slice(0, 100) + (note.content.length > 100 ? '...' : ''),
              icon: '/favicon.ico'
            });
          }
          // Remove the reminder after showing
          updateNote(note.id, { reminderDate: undefined });
        }
      });
    };

    const interval = setInterval(checkReminders, 60000); // Check every minute
    return () => clearInterval(interval);
  }, [notes]);

  // Request notification permission on mount
  useEffect(() => {
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }
  }, []);

  const saveNotes = (newNotes: Note[]) => {
    setNotes(newNotes);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newNotes));
  };

  const saveCategories = (newCategories: NoteCategory[]) => {
    setCategories(newCategories);
    localStorage.setItem(CATEGORIES_KEY, JSON.stringify(newCategories));
  };

  const createNote = (title: string, content: string, category: string, isImportant?: boolean, reminderDate?: Date): Note => {
    const newNote: Note = {
      id: Date.now().toString(),
      title: title || 'Untitled Note',
      content,
      category,
      createdAt: new Date(),
      updatedAt: new Date(),
      isImportant,
      reminderDate,
    };

    saveNotes([newNote, ...notes]);
    return newNote;
  };

  const updateNote = (id: string, updates: Partial<Note>) => {
    const updatedNotes = notes.map(note =>
      note.id === id
        ? { ...note, ...updates, updatedAt: new Date() }
        : note
    );
    saveNotes(updatedNotes);
  };

  const deleteNote = (id: string) => {
    const filteredNotes = notes.filter(note => note.id !== id);
    saveNotes(filteredNotes);
  };

  const filteredNotes = notes.filter(note => {
    const matchesSearch = note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         note.content.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || note.category === selectedCategory;
    return matchesSearch && matchesCategory;
  }).sort((a, b) => {
    // Sort important notes first
    if (a.isImportant && !b.isImportant) return -1;
    if (!a.isImportant && b.isImportant) return 1;
    return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
  });

  return {
    notes: filteredNotes,
    allNotes: notes, // Add this to fix category counter bug
    categories,
    searchQuery,
    setSearchQuery,
    selectedCategory,
    setSelectedCategory,
    createNote,
    updateNote,
    deleteNote,
    saveCategories,
  };
};