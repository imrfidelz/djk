
import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Skeleton } from '@/components/ui/skeleton';
import ReviewTableRow from './ReviewTableRow';
import ReviewForm from './ReviewForm';
import DeleteConfirmation from './DeleteConfirmation';
import { Review } from '../../types/review.types';
import { reviewService } from '@/services/reviewService';
import { useToast } from '@/hooks/use-toast';
import ReviewSearchBar from './ReviewSearchBar';

const ReviewTable = () => {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [currentReview, setCurrentReview] = useState<Review | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: reviews = [], isLoading, error } = useQuery({
    queryKey: ['reviews'],
    queryFn: reviewService.getAll,
  });

  const updateReviewMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => 
      reviewService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reviews'] });
      setIsEditModalOpen(false);
      toast({
        title: 'Review Updated',
        description: 'The review has been updated successfully.',
      });
    },
    onError: (error: Error) => {
      toast({
        title: 'Update Failed',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  const deleteReviewMutation = useMutation({
    mutationFn: reviewService.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reviews'] });
      setIsDeleteModalOpen(false);
      toast({
        title: 'Review Deleted',
        description: 'The review has been deleted successfully.',
      });
    },
    onError: (error: Error) => {
      toast({
        title: 'Delete Failed',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  const getProductName = (product: any): string => {
    if (!product) return 'Unknown Product';
    if (typeof product === 'string') return 'Unknown Product';
    return product?.name || 'Unknown Product';
  };

  const getUserName = (user: any): string => {
    if (!user) return 'Unknown User';
    if (typeof user === 'string') return 'Unknown User';
    return user?.name || 'Unknown User';
  };

  const filteredReviews = reviews.filter(review => {
    const productName = getProductName(review.product);
    const userName = getUserName(review.user);
    
    return productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
           userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
           review.comment.toLowerCase().includes(searchTerm.toLowerCase());
  });

  const handleEdit = (review: Review) => {
    setCurrentReview(review);
    setIsEditModalOpen(true);
  };

  const handleDelete = (review: Review) => {
    setCurrentReview(review);
    setIsDeleteModalOpen(true);
  };

  const handleSave = (updatedReview: any) => {
    if (currentReview) {
      updateReviewMutation.mutate({
        id: currentReview._id,
        data: {
          name: updatedReview.name,
          comment: updatedReview.comment,
          rating: updatedReview.rating,
        }
      });
    }
  };

  const confirmDelete = () => {
    if (currentReview) {
      deleteReviewMutation.mutate(currentReview._id);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-12 w-full" />
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-[#FAFAFA] border-b border-[#E0E0E0]">
                <TableHead className="text-sm font-semibold text-[#616161] py-4 px-6">Product</TableHead>
                <TableHead className="hidden sm:table-cell text-sm font-semibold text-[#616161] py-4 px-6">User</TableHead>
                <TableHead className="text-sm font-semibold text-[#616161] py-4 px-6">Rating</TableHead>
                <TableHead className="hidden md:table-cell text-sm font-semibold text-[#616161] py-4 px-6">Comment</TableHead>
                <TableHead className="text-right text-sm font-semibold text-[#616161] py-4 px-6">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {[1, 2, 3, 4, 5].map((i) => (
                <TableRow key={i} className="border-b border-[#E0E0E0] hover:bg-[#FAFAFA]">
                  <TableCell className="py-4 px-6"><Skeleton className="h-4 w-full" /></TableCell>
                  <TableCell className="hidden sm:table-cell py-4 px-6"><Skeleton className="h-4 w-full" /></TableCell>
                  <TableCell className="py-4 px-6"><Skeleton className="h-4 w-full" /></TableCell>
                  <TableCell className="hidden md:table-cell py-4 px-6"><Skeleton className="h-4 w-full" /></TableCell>
                  <TableCell className="py-4 px-6"><Skeleton className="h-4 w-full" /></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-[#F44336]">Error loading reviews: {error.message}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="w-full overflow-hidden">
        <ReviewSearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
      </div>
      
      <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-[#FAFAFA] border-b border-[#E0E0E0]">
              <TableHead className="text-sm font-semibold text-[#616161] py-4 px-6">Product</TableHead>
              <TableHead className="hidden sm:table-cell text-sm font-semibold text-[#616161] py-4 px-6">User</TableHead>
              <TableHead className="text-sm font-semibold text-[#616161] py-4 px-6">Rating</TableHead>
              <TableHead className="hidden md:table-cell text-sm font-semibold text-[#616161] py-4 px-6">Comment</TableHead>
              <TableHead className="text-right text-sm font-semibold text-[#616161] py-4 px-6">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredReviews.length > 0 ? (
              filteredReviews.map(review => (
                <ReviewTableRow 
                  key={review._id} 
                  review={review} 
                  onEdit={() => handleEdit(review)}
                  onDelete={() => handleDelete(review)}
                  getProductName={getProductName}
                  getUserName={getUserName}
                />
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center text-[#9E9E9E] py-8">
                  No reviews found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {isEditModalOpen && currentReview && (
        <ReviewForm 
          review={currentReview}
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          onSave={handleSave}
          isLoading={updateReviewMutation.isPending}
        />
      )}

      {isDeleteModalOpen && currentReview && (
        <DeleteConfirmation
          isOpen={isDeleteModalOpen}
          onClose={() => setIsDeleteModalOpen(false)}
          onConfirm={confirmDelete}
          reviewName={`${getProductName(currentReview.product)} by ${getUserName(currentReview.user)}`}
          isLoading={deleteReviewMutation.isPending}
        />
      )}
    </div>
  );
};

export default ReviewTable;
