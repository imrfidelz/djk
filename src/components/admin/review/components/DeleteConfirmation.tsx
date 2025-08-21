
import React from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

interface DeleteConfirmationProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  reviewName: string;
  isLoading?: boolean;
}

const DeleteConfirmation: React.FC<DeleteConfirmationProps> = ({
  isOpen,
  onClose,
  onConfirm,
  reviewName,
  isLoading = false,
}) => {
  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent className="bg-white border border-[#E0E0E0] rounded-2xl p-6 max-w-md">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-xl font-semibold text-[#212121] font-['Inter',sans-serif]">
            Are you sure?
          </AlertDialogTitle>
          <AlertDialogDescription className="text-[#757575] text-base mt-2">
            This will permanently delete the review for "{reviewName}".
            This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="flex gap-3 mt-6">
          <AlertDialogCancel 
            disabled={isLoading}
            className="bg-white text-[#616161] border border-[#E0E0E0] hover:bg-[#FAFAFA] rounded-lg px-6 py-3 text-sm font-medium"
          >
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction 
            onClick={onConfirm} 
            className="bg-[#F44336] text-white hover:bg-[#D32F2F] border-none rounded-lg px-6 py-3 text-sm font-semibold"
            disabled={isLoading}
          >
            {isLoading ? 'Deleting...' : 'Delete'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DeleteConfirmation;
