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
import { X, Save, Star, Bell } from 'lucide-react';

interface NoteEditorProps {
  note?: Note;
  categories: NoteCategory[];
  isOpen: boolean;
  onClose: () => void;
  onSave: (title: string, content: string, category: string, isImportant?: boolean, reminderDate?: Date) => void;
}

export const NoteEditor = ({ note, categories, isOpen, onClose, onSave }: NoteEditorProps) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('personal');
  const [isImportant, setIsImportant] = useState(false);
  const [reminderDate, setReminderDate] = useState('');
  const [reminderTime, setReminderTime] = useState('');

  useEffect(() => {
    if (note) {
      setTitle(note.title);
      setContent(note.content);
      setCategory(note.category);
      setIsImportant(note.isImportant || false);
      if (note.reminderDate) {
        const date = new Date(note.reminderDate);
        setReminderDate(date.toISOString().split('T')[0]);
        setReminderTime(date.toTimeString().slice(0, 5));
      } else {
        setReminderDate('');
        setReminderTime('');
      }
    } else {
      setTitle('');
      setContent('');
      setCategory('personal');
      setIsImportant(false);
      setReminderDate('');
      setReminderTime('');
    }
  }, [note, isOpen]);

  const handleSave = () => {
    if (!title.trim() && !content.trim()) return;
    
    let reminder: Date | undefined;
    if (reminderDate && reminderTime) {
      reminder = new Date(`${reminderDate}T${reminderTime}`);
    }
    
    onSave(title.trim() || 'Untitled Note', content, category, isImportant, reminder);
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
          
          <div className="flex gap-4 items-center">
            <Button
              type="button"
              variant={isImportant ? "default" : "outline"}
              size="sm"
              onClick={() => setIsImportant(!isImportant)}
              className="gap-2"
            >
              <Star className={`h-4 w-4 ${isImportant ? 'fill-current' : ''}`} />
              {isImportant ? 'Important' : 'Mark Important'}
            </Button>
            
            <div className="flex items-center gap-2">
              <Bell className="h-4 w-4 text-muted-foreground" />
              <Input
                type="date"
                value={reminderDate}
                onChange={(e) => setReminderDate(e.target.value)}
                className="w-auto"
                placeholder="Reminder date"
              />
              <Input
                type="time"
                value={reminderTime}
                onChange={(e) => setReminderTime(e.target.value)}
                className="w-auto"
                placeholder="Time"
                disabled={!reminderDate}
              />
            </div>
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