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
  DialogHeader,
  DialogTitle,
  DialogOverlay,
  DialogPortal,
} from '@/components/ui/dialog';
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { cn } from "@/lib/utils";
import { X, Save, Star, Bell, Check, Trash2 } from 'lucide-react';

interface NoteEditorProps {
  note?: Note;
  categories: NoteCategory[];
  isOpen: boolean;
  onClose: () => void;
  onSave: (title: string, content: string, category: string, isImportant?: boolean, reminderDate?: Date, isChecked?: boolean) => void;
  onDelete?: (id: string) => void;
}

export const NoteEditor = ({ note, categories, isOpen, onClose, onSave, onDelete }: NoteEditorProps) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('personal');
  const [isImportant, setIsImportant] = useState(false);
  const [isChecked, setIsChecked] = useState(false);
  const [reminderDate, setReminderDate] = useState('');
  const [reminderTime, setReminderTime] = useState('');

  useEffect(() => {
    if (note) {
      setTitle(note.title);
      setContent(note.content);
      setCategory(note.category);
      setIsImportant(note.isImportant || false);
      setIsChecked(note.isChecked || false);
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
      setIsChecked(false);
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
    
    onSave(title.trim() || 'Untitled Note', content, category, isImportant, reminder, isChecked);
    onClose();
  };

  const handleDelete = () => {
    if (note && onDelete) {
      onDelete(note.id);
      onClose();
    }
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
      <DialogPortal>
        <DialogOverlay />
        <DialogPrimitive.Content
          className={cn(
            "fixed left-[50%] top-[50%] z-50 grid w-full max-w-4xl translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] sm:rounded-lg max-h-[90vh] flex flex-col"
          )}
          onKeyDown={handleKeyDown}
        >
        <DialogHeader className="flex-shrink-0">
          <div className="flex items-center justify-between">
            <DialogTitle>
              {note ? 'Edit Note' : 'Create New Note'}
            </DialogTitle>
            <div className="flex items-center gap-2">
              {note && onDelete && (
                <Button variant="destructive" size="sm" onClick={handleDelete} className="gap-2">
                  <Trash2 className="h-4 w-4" />
                  Delete
                </Button>
              )}
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
            
            <Button
              type="button"
              variant={isChecked ? "default" : "outline"}
              size="sm"
              onClick={() => setIsChecked(!isChecked)}
              className="gap-2"
            >
              <Check className={`h-4 w-4 ${isChecked ? 'fill-current' : ''}`} />
              {isChecked ? 'Completed' : 'Mark Complete'}
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
          
          <div className="flex-1 min-h-0">
            <Textarea
              placeholder="Start writing your note..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full h-full min-h-[300px] resize-none text-base leading-relaxed"
            />
          </div>
        </div>
        
        <div className="flex-shrink-0 text-xs text-muted-foreground">
          Press Ctrl/Cmd + S to save • Press Esc to close
        </div>
        </DialogPrimitive.Content>
      </DialogPortal>
    </Dialog>
  );
};