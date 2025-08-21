
import React from 'react';
import { Button } from '@/components/ui/button';
import { Edit, Trash2 } from 'lucide-react';
import { Category } from '../../types/category.types';

interface CategoryActionsProps {
  category: Category;
  onEdit: () => void;
  onDelete: () => void;
}

const CategoryActions: React.FC<CategoryActionsProps> = ({ category, onEdit, onDelete }) => {
  return (
    <div className="flex items-center gap-2">
      <Button 
        variant="ghost" 
        size="icon" 
        onClick={onEdit}
        aria-label={`Edit ${category.name}`}
      >
        <Edit className="h-4 w-4" />
      </Button>
      <Button 
        variant="ghost" 
        size="icon" 
        onClick={onDelete}
        aria-label={`Delete ${category.name}`}
      >
        <Trash2 className="h-4 w-4 text-destructive" />
      </Button>
    </div>
  );
};

export default CategoryActions;
