import React from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { reviewService } from '@/services/reviewService';

const schema = z.object({
  rating: z
    .number({ required_error: 'Rating is required' })
    .min(1, 'Please select a rating')
    .max(5, 'Rating must be at most 5'),
  comment: z
    .string()
    .min(3, 'Comment must be at least 3 characters')
    .max(1000, 'Comment must be at most 1000 characters'),
});

export type AddProductReviewFormValues = z.infer<typeof schema>;

interface AddProductReviewFormProps {
  productId: string;
  onSubmitted?: () => void;
}

const AddProductReviewForm: React.FC<AddProductReviewFormProps> = ({ productId, onSubmitted }) => {
  const { user, isAuthenticated } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const form = useForm<AddProductReviewFormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      rating: 0,
      comment: '',
    },
  });

  const createMutation = useMutation({
    mutationFn: (data: AddProductReviewFormValues) =>
      reviewService.create(productId, {
        name: user?.name || 'Anonymous',
        comment: data.comment,
        rating: data.rating,
      }),
    onSuccess: () => {
      toast({ title: 'Review submitted', description: 'Thank you for your feedback!' });
      form.reset({ rating: 0, comment: '' });
      queryClient.invalidateQueries({ queryKey: ['reviews', productId] });
      onSubmitted?.();
    },
    onError: (error: any) => {
      toast({
        title: 'Failed to submit review',
        description: error?.message || 'Please try again',
        variant: 'destructive',
      });
    },
  });

  const handleSubmit = (values: AddProductReviewFormValues) => {
    if (!isAuthenticated) {
      toast({ title: 'Login required', description: 'Please log in to submit a review.' });
      return;
    }
    createMutation.mutate(values);
  };

  const currentRating = form.watch('rating');

  return (
    <div className="space-y-6">
      {!isAuthenticated ? (
        <div className="border rounded-md p-4 bg-muted/30">
          <p className="mb-4">You must be logged in to submit a review.</p>
          <a href="/login" className="outline-button inline-block">Log in</a>
        </div>
      ) : (
        <>
          <div>
            <label className="block mb-2">Your rating *</label>
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  aria-label={`${star} star`}
                  onClick={() => form.setValue('rating', star, { shouldValidate: true })}
                  className={currentRating >= star ? 'text-luxury-gold' : 'text-gray-300'}
                >
                  <Star size={20} className={currentRating >= star ? 'fill-current' : ''} />
                </button>
              ))}
            </div>
            {form.formState.errors.rating && (
              <p className="text-destructive text-sm mt-1">{form.formState.errors.rating.message}</p>
            )}
          </div>

          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            <div>
              <label htmlFor="comment" className="block mb-2">Your review *</label>
              <Textarea
                id="comment"
                rows={5}
                placeholder="Share your thoughts about this product..."
                {...form.register('comment')}
              />
              {form.formState.errors.comment && (
                <p className="text-destructive text-sm mt-1">{form.formState.errors.comment.message}</p>
              )}
            </div>

            <div>
              <label className="block mb-2">Name</label>
              <div className="border rounded-md px-3 py-2 bg-muted/50">
                {user?.name || '—'}
              </div>
            </div>

            <Button type="submit" disabled={createMutation.isPending} className="gold-button">
              {createMutation.isPending ? 'Submitting...' : 'Submit'}
            </Button>
          </form>
        </>
      )}
    </div>
  );
};

export default AddProductReviewForm;
