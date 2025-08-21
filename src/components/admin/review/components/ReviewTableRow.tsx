
import React from 'react';
import { TableRow, TableCell } from '@/components/ui/table';
import { Review } from '../../types/review.types';
import ReviewActions from './ReviewActions';
import ReviewRating from './ReviewRating';

interface ReviewTableRowProps {
  review: Review;
  onEdit: () => void;
  onDelete: () => void;
  getProductName: (product: any) => string;
  getUserName: (user: any) => string;
}

const ReviewTableRow: React.FC<ReviewTableRowProps> = ({
  review,
  onEdit,
  onDelete,
  getProductName,
  getUserName
}) => {
  return (
    <TableRow className="border-b border-[#E0E0E0] hover:bg-[#FAFAFA] transition-colors duration-150">
      <TableCell className="font-medium text-[#424242] py-4 px-6">
        <div className="line-clamp-2">{getProductName(review.product)}</div>
      </TableCell>
      <TableCell className="hidden sm:table-cell text-[#424242] py-4 px-6">{getUserName(review.user)}</TableCell>
      <TableCell className="py-4 px-6">
        <ReviewRating rating={review.rating} />
      </TableCell>
      <TableCell className="hidden md:table-cell max-w-xs text-[#424242] py-4 px-6">
        <div className="truncate">{review.comment}</div>
      </TableCell>
      <TableCell className="text-right py-4 px-6">
        <ReviewActions
          review={review}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      </TableCell>
    </TableRow>
  );
};

export default ReviewTableRow;
