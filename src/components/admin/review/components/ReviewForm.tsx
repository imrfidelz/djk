
import React from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useQuery } from '@tanstack/react-query';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Review } from '../../types/review.types';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { productService } from '@/services/productService';

const formSchema = z.object({
  name: z.string().min(1, { message: 'Name is required' }),
  rating: z.coerce
    .number()
    .min(1, { message: 'Rating must be at least 1' })
    .max(5, { message: 'Rating must not be greater than 5' }),
  comment: z.string().min(3, { message: 'Comment must be at least 3 characters' }),
});

interface ReviewFormProps {
  review?: Review | null; // Make review optional for adding new reviews
  isOpen: boolean;
  onClose: () => void;
  onSave: (review: any) => void;
  isLoading?: boolean;
}

const ReviewForm: React.FC<ReviewFormProps> = ({
  review = null, // Default to null
  isOpen,
  onClose,
  onSave,
  isLoading = false,
}) => {
  const isEditMode = !!review; // Determine if we're editing or adding

  // Load products for selection when adding a new review
  const { data: products = [] } = useQuery({
    queryKey: ['products'],
    queryFn: productService.getAll,
  });
  const [productId, setProductId] = React.useState<string>('');

  // Helper function to get product name
  const getProductName = (product: any): string => {
    if (typeof product === 'string') return 'Unknown Product';
    return product?.name || 'Unknown Product';
  };

  // Helper function to get user name
  const getUserName = (user: any): string => {
    if (typeof user === 'string') return 'Unknown User';
    return user?.name || 'Unknown User';
  };

  // Initialize form
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: review?.name || '',
      rating: review?.rating || 5,
      comment: review?.comment || '',
    },
  });

// Reset form when review changes or modal opens
React.useEffect(() => {
  if (isOpen) {
    form.reset({
      name: review?.name || '',
      rating: review?.rating || 5,
      comment: review?.comment || '',
    });
    setProductId('');
  }
}, [isOpen, review, form]);

const onSubmit = (values: z.infer<typeof formSchema>) => {
  const payload = isEditMode ? values : { ...values, productId };
  onSave(payload);
};

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px] bg-white border border-[#E0E0E0] rounded-2xl shadow-lg">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-[#212121] font-['Inter',sans-serif]">
            {isEditMode ? 'Edit Review' : 'Add New Review'}
          </DialogTitle>
        </DialogHeader>
        
        {isEditMode && review && (
          <div className="py-2">
            <div className="text-sm text-[#757575]">
              <p><strong>Product:</strong> {getProductName(review.product)}</p>
              <p><strong>User:</strong> {getUserName(review.user)}</p>
            </div>
          </div>
        )}

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
            {!isEditMode && (
              <FormItem>
                <FormLabel className="text-sm font-medium text-[#424242]">Product</FormLabel>
                <Select value={productId} onValueChange={setProductId}>
                  <FormControl>
                    <SelectTrigger className="border border-[#E0E0E0] rounded-lg px-3 py-2 text-sm">
                      <SelectValue placeholder="Select a product" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {products.map((p: any) => (
                      <SelectItem key={p._id || p.id} value={(p._id || p.id) as string}>
                        {p.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {!productId && (
                  <p className="text-xs text-red-500">Please select a product</p>
                )}
              </FormItem>
            )}

            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium text-[#424242]">Reviewer Name</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="Enter reviewer name..." 
                      className="border border-[#E0E0E0] rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-[#FF4081] focus:border-transparent"
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="rating"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium text-[#424242]">Rating (1-5)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      min={1}
                      max={5}
                      className="border border-[#E0E0E0] rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-[#FF4081] focus:border-transparent"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="comment"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium text-[#424242]">Comment</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Enter review comment..."
                      className="min-h-[100px] border border-[#E0E0E0] rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-[#FF4081] focus:border-transparent resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <DialogFooter className="flex gap-3 mt-6">
              <Button 
                variant="outline" 
                type="button" 
                onClick={onClose}
                disabled={isLoading}
                className="bg-white text-[#616161] border border-[#E0E0E0] hover:bg-[#FAFAFA] rounded-lg px-6 py-3 text-sm font-medium"
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                disabled={isLoading}
                className="bg-[#FF4081] text-white hover:bg-[#E91E63] border-none rounded-lg px-6 py-3 text-sm font-semibold"
              >
                {isLoading ? (isEditMode ? 'Updating...' : 'Adding...') : (isEditMode ? 'Update Review' : 'Add Review')}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default ReviewForm;
