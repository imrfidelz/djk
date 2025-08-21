
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import ReviewForm from './ReviewForm';
import { useToast } from '@/hooks/use-toast';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { reviewService } from '@/services/reviewService';

const AddReviewButton = () => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const createMutation = useMutation({
    mutationFn: ({ productId, data }: { productId: string; data: { name: string; comment: string; rating: number } }) =>
      reviewService.create(productId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reviews'] });
      setIsFormOpen(false);
      toast({
        title: 'Review Added',
        description: `New review has been added successfully.`,
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Failed to add review',
        description: error?.message || 'Please try again',
        variant: 'destructive',
      });
    },
  });

  const handleSave = (newReview: any) => {
    const { productId, name, comment, rating } = newReview || {};
    if (!productId) {
      toast({ title: 'Select a product', description: 'Please choose a product for this review.' });
      return;
    }
    createMutation.mutate({ productId, data: { name, comment, rating: Number(rating) } });
  };

  return (
    <>
      <Button 
        onClick={() => setIsFormOpen(true)}
        className="bg-[#FF4081] hover:bg-[#E91E63] text-white border-none rounded-lg px-6 py-3 text-sm font-semibold transition-colors duration-150"
      >
        <Plus className="mr-2 h-5 w-5" />
        Add Review
      </Button>

      <ReviewForm
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSave={handleSave}
      />
    </>
  );
};

export default AddReviewButton;
