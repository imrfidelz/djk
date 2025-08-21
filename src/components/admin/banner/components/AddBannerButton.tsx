
import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import BannerForm from './BannerForm';
import { BannerFormData } from '../../types/banner.types';
import { useToast } from '@/hooks/use-toast';
import { bannerService } from '@/services/bannerService';
import { useMutation, useQueryClient } from '@tanstack/react-query';

const AddBannerButton = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const addBannerMutation = useMutation({
    mutationFn: bannerService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['banners'] });
      toast({
        title: "Success",
        description: "Banner added successfully",
      });
      setIsOpen(false);
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleSubmit = async (data: BannerFormData) => {
    const formData = new FormData();
    
    if (data.image) {
      formData.append('file', data.image);
    }
    formData.append('isHero', data.isHero.toString());
    formData.append('section', data.section);

    addBannerMutation.mutate(formData);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="w-full md:w-auto">
          <Plus className="h-4 w-4 mr-2" />
          Add Banner
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md mx-auto">
        <DialogHeader>
          <DialogTitle>Add New Banner</DialogTitle>
        </DialogHeader>
        <BannerForm
          onSubmit={handleSubmit}
          onCancel={() => setIsOpen(false)}
          isLoading={addBannerMutation.isPending}
        />
      </DialogContent>
    </Dialog>
  );
};

export default AddBannerButton;
