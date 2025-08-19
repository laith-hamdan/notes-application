import { useState, useEffect } from 'react';
import { Note, NoteCategory } from '@/types/note';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { X, Save } from 'lucide-react';

interface NoteEditorProps {
  note?: Note;
  categories: NoteCategory[];
  isOpen: boolean;
  onClose: () => void;
  onSave: (title: string, content: string, category: string) => void;
}

export const NoteEditor = ({ note, categories, isOpen, onClose, onSave }: NoteEditorProps) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('personal');

  useEffect(() => {
    if (note) {
      setTitle(note.title);
      setContent(note.content);
      setCategory(note.category);
    } else {
      setTitle('');
      setContent('');
      setCategory('personal');
    }
  }, [note, isOpen]);

  const handleSave = () => {
    if (!title.trim() && !content.trim()) return;
    
    onSave(title.trim() || 'Untitled Note', content, category);
    onClose();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      onClose();
    } else if (e.key === 's' && (e.metaKey || e.ctrlKey)) {
      e.preventDefault();
      handleSave();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] flex flex-col" onKeyDown={handleKeyDown}>
        <DialogHeader className="flex-shrink-0">
          <div className="flex items-center justify-between">
            <DialogTitle>
              {note ? 'Edit Note' : 'Create New Note'}
            </DialogTitle>
            <div className="flex items-center gap-2">
              <Button onClick={handleSave} size="sm" className="gap-2">
                <Save className="h-4 w-4" />
                Save
              </Button>
              <Button variant="ghost" size="sm" onClick={onClose}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </DialogHeader>
        
        <div className="flex-1 flex flex-col gap-4 min-h-0">
          <div className="flex gap-4">
            <Input
              placeholder="Note title..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="flex-1 text-lg font-medium"
              autoFocus
            />
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger className="w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {categories.map((cat) => (
                  <SelectItem key={cat.id} value={cat.id}>
                    <div className="flex items-center gap-2">
                      <div 
                        className="w-3 h-3 rounded-full" 
                        style={{ backgroundColor: cat.color }}
                      />
                      {cat.name}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <Textarea
            placeholder="Start writing your note..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="flex-1 min-h-[400px] resize-none text-base leading-relaxed"
          />
        </div>
        
        <div className="flex-shrink-0 text-xs text-muted-foreground">
          Press Ctrl/Cmd + S to save • Press Esc to close
        </div>
      </DialogContent>
    </Dialog>
  );
};