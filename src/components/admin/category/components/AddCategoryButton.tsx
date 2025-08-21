
import React from 'react';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

interface AddCategoryButtonProps {
  onClick: () => void;
}

const AddCategoryButton: React.FC<AddCategoryButtonProps> = ({ onClick }) => {
  return (
    <Button 
      className="fixed right-6 bottom-6 z-10 bg-luxury-gold hover:bg-luxury-gold/90 rounded-full w-12 h-12 p-0 shadow-lg"
      onClick={onClick}
    >
      <Plus className="h-6 w-6" />
    </Button>
  );
};

export default AddCategoryButton;
