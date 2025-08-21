
import React from 'react';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface AddUserButtonProps {
  onClick: () => void;
}

const AddUserButton: React.FC<AddUserButtonProps> = ({ onClick }) => {
  return (
    <Button 
      className="bg-luxury-gold hover:bg-luxury-gold/90"
      onClick={onClick}
    >
      <Plus size={16} className="mr-2" />
      Add New User
    </Button>
  );
};

export default AddUserButton;
