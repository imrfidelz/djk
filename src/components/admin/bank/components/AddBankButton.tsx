
import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogTrigger } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import BankForm from './BankForm';
import { BankFormData } from '../../types/bank.types';

interface AddBankButtonProps {
  onAdd: (bankData: BankFormData) => void;
  disabled?: boolean;
}

const AddBankButton: React.FC<AddBankButtonProps> = ({ onAdd, disabled }) => {
  const [open, setOpen] = useState(false);
  const { toast } = useToast();

  const handleSave = (data: BankFormData) => {
    console.log('New bank data:', data);
    onAdd(data);
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gap-1 w-full md:w-auto" disabled={disabled}>
          <Plus size={16} />
          Add Bank Account
        </Button>
      </DialogTrigger>
      <BankForm
        onSubmit={handleSave}
        onCancel={() => setOpen(false)}
      />
    </Dialog>
  );
};

export default AddBankButton;
