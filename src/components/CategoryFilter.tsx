import { NoteCategory } from '@/types/note';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface CategoryFilterProps {
  categories: NoteCategory[];
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
  noteCounts: Record<string, number>;
}

export const CategoryFilter = ({ 
  categories, 
  selectedCategory, 
  onCategoryChange, 
  noteCounts 
}: CategoryFilterProps) => {
  const allCount = Object.values(noteCounts).reduce((sum, count) => sum + count, 0);
  
  return (
    <div className="flex flex-wrap gap-2">
      <Button
        variant={selectedCategory === 'all' ? 'default' : 'outline'}
        size="sm"
        onClick={() => onCategoryChange('all')}
        className="gap-2"
      >
        All Notes
        <Badge variant="secondary" className="text-xs">
          {allCount}
        </Badge>
      </Button>
      
      {categories.map((category) => (
        <Button
          key={category.id}
          variant={selectedCategory === category.id ? 'default' : 'outline'}
          size="sm"
          onClick={() => onCategoryChange(category.id)}
          className="gap-2"
        >
          <div 
            className="w-2 h-2 rounded-full" 
            style={{ backgroundColor: category.color }}
          />
          {category.name}
          <Badge variant="secondary" className="text-xs">
            {noteCounts[category.id] || 0}
          </Badge>
        </Button>
      ))}
    </div>
  );
};