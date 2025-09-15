import { useState } from 'react';
import { useNotes } from '@/hooks/useNotes';
import { Note } from '@/types/note';
import { NoteCard } from '@/components/NoteCard';
import { NoteEditor } from '@/components/NoteEditor';
import { SearchBar } from '@/components/SearchBar';
import { CategoryFilter } from '@/components/CategoryFilter';
import { Button } from '@/components/ui/button';
import { PlusCircle, BookOpen, Sparkles } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const Index = () => {
  const {
    notes,
    allNotes,
    categories,
    searchQuery,
    setSearchQuery,
    selectedCategory,
    setSelectedCategory,
    createNote,
    updateNote,
    deleteNote,
  } = useNotes();

  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [editingNote, setEditingNote] = useState<Note | undefined>();
  const { toast } = useToast();

  const handleCreateNote = () => {
    setEditingNote(undefined);
    setIsEditorOpen(true);
  };

  const handleEditNote = (note: Note) => {
    setEditingNote(note);
    setIsEditorOpen(true);
  };

  const handleSaveNote = (title: string, content: string, category: string, isImportant?: boolean, reminderDate?: Date) => {
    if (editingNote) {
      updateNote(editingNote.id, { title, content, category, isImportant, reminderDate });
      toast({
        title: "Note updated",
        description: "Your note has been saved successfully.",
      });
    } else {
      createNote(title, content, category, isImportant, reminderDate);
      toast({
        title: "Note created",
        description: "Your new note has been created successfully.",
      });
    }
  };

  const handleToggleImportant = (id: string) => {
    const note = allNotes.find(n => n.id === id);
    if (note) {
      updateNote(id, { isImportant: !note.isImportant });
      toast({
        title: note.isImportant ? "Removed from Important" : "Marked as Important",
        description: `Note ${note.isImportant ? 'unmarked' : 'marked'} as important.`,
      });
    }
  };

  const handleDeleteNote = (id: string) => {
    deleteNote(id);
    toast({
      title: "Note deleted",
      description: "Your note has been deleted.",
      variant: "destructive",
    });
  };

  const noteCounts = categories.reduce((acc, category) => {
    acc[category.id] = allNotes.filter(note => note.category === category.id).length;
    return acc;
  }, {} as Record<string, number>);

  return (
    <div className="min-h-screen bg-gradient-subtle">
      <div className="container max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-gradient-primary rounded-lg">
              <BookOpen className="h-6 w-6 text-white" />
            </div>
            <h1 className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent">
              My Notes
            </h1>
            <Sparkles className="h-5 w-5 text-primary/60" />
          </div>
          <p className="text-muted-foreground">
            Capture your thoughts, ideas, and inspirations in one beautiful place.
          </p>
        </div>

        {/* Search and Filter Bar */}
        <div className="flex flex-col lg:flex-row gap-4 mb-8">
          <div className="flex-1">
            <SearchBar
              value={searchQuery}
              onChange={setSearchQuery}
              placeholder="Search your notes..."
            />
          </div>
          <Button onClick={handleCreateNote} className="gap-2 bg-gradient-primary hover:opacity-90">
            <PlusCircle className="h-4 w-4" />
            New Note
          </Button>
        </div>

        {/* Category Filter */}
        <div className="mb-8">
          <CategoryFilter
            categories={categories}
            selectedCategory={selectedCategory}
            onCategoryChange={setSelectedCategory}
            noteCounts={noteCounts}
          />
        </div>

        {/* Notes Grid */}
        {notes.length === 0 ? (
          <div className="text-center py-16">
            <div className="p-4 bg-gradient-primary/10 rounded-full w-20 h-20 mx-auto mb-4 flex items-center justify-center">
              <BookOpen className="h-10 w-10 text-primary" />
            </div>
            {allNotes.length === 0 ? (
              <>
                <h3 className="text-xl font-semibold mb-2">No notes yet</h3>
                <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                  Start capturing your thoughts and ideas. Your first note is just a click away!
                </p>
                <Button onClick={handleCreateNote} size="lg" className="gap-2 bg-gradient-primary">
                  <PlusCircle className="h-5 w-5" />
                  Create Your First Note
                </Button>
              </>
            ) : (
              <>
                <h3 className="text-xl font-semibold mb-2">No notes in this category</h3>
                <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                  {selectedCategory !== 'all' 
                    ? `No notes found in the ${categories.find(cat => cat.id === selectedCategory)?.name || 'selected'} category yet.`
                    : 'No notes match your current search criteria.'
                  }
                </p>
                <Button onClick={handleCreateNote} size="lg" className="gap-2 bg-gradient-primary">
                  <PlusCircle className="h-5 w-5" />
                  Create New Note
                </Button>
              </>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {notes.map((note) => (
              <NoteCard
                key={note.id}
                note={note}
                categories={categories}
                onEdit={handleEditNote}
                onDelete={handleDeleteNote}
                onToggleImportant={handleToggleImportant}
              />
            ))}
          </div>
        )}

        {/* Note Editor */}
        <NoteEditor
          note={editingNote}
          categories={categories}
          isOpen={isEditorOpen}
          onClose={() => setIsEditorOpen(false)}
          onSave={handleSaveNote}
        />
      </div>
    </div>
  );
};

export default Index;
