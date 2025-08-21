
import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogTrigger } from '@/components/ui/dialog';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';
import BrandForm from './BrandForm';
import { BrandFormData } from '../../types/brand.types';
import { brandService } from '@/services/brandService';

const AddBrandButton: React.FC = () => {
  const [open, setOpen] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Create brand mutation
  const createMutation = useMutation({
    mutationFn: brandService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['brands'] });
      toast({
        title: 'Brand created',
        description: 'The brand has been successfully created.',
      });
      setOpen(false);
    },
    onError: (error: Error) => {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  const handleSave = (data: BrandFormData) => {
    const completeData: BrandFormData = {
      name: data.name,
      description: data.description || '',
      logo: data.logo || '',
      isActive: data.isActive !== undefined ? data.isActive : true
    };
    
    createMutation.mutate(completeData);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gap-1 w-full md:w-auto">
          <Plus size={16} />
          Add Brand
        </Button>
      </DialogTrigger>
      <BrandForm
        onSubmit={handleSave}
        onCancel={() => setOpen(false)}
        isLoading={createMutation.isPending}
      />
    </Dialog>
  );
};

export default AddBrandButton;
