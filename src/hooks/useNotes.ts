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
      }));
      setNotes(parsedNotes);
    }
    
    if (savedCategories) {
      setCategories(JSON.parse(savedCategories));
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

  const createNote = (title: string, content: string, category: string): Note => {
    const newNote: Note = {
      id: Date.now().toString(),
      title: title || 'Untitled Note',
      content,
      category,
      createdAt: new Date(),
      updatedAt: new Date(),
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
  });

  return {
    notes: filteredNotes,
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