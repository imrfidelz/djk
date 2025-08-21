
import React from 'react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { MoreHorizontal, Pencil, Trash2 } from 'lucide-react';
import { Review } from '../../types/review.types';

interface ReviewActionsProps {
  review: Review;
  onEdit: () => void;
  onDelete: () => void;
}

const ReviewActions: React.FC<ReviewActionsProps> = ({
  review,
  onEdit,
  onDelete
}) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0 hover:bg-[#F5F5F5] rounded-lg">
          <span className="sr-only">Open menu</span>
          <MoreHorizontal className="h-4 w-4 text-[#757575]" strokeWidth={1.5} />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="bg-white border border-[#E0E0E0] rounded-lg shadow-md">
        <DropdownMenuItem 
          onClick={onEdit}
          className="text-[#424242] hover:bg-[#F5F5F5] cursor-pointer px-3 py-2"
        >
          <Pencil className="mr-2 h-4 w-4" strokeWidth={1.5} />
          <span className="text-sm">Edit</span>
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={onDelete}
          className="text-[#F44336] hover:bg-[#FFEBEE] cursor-pointer px-3 py-2"
        >
          <Trash2 className="mr-2 h-4 w-4" strokeWidth={1.5} />
          <span className="text-sm">Delete</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ReviewActions;
