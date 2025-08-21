
import React, { useState } from 'react';
import { Edit, Trash2, ToggleLeft, ToggleRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Brand } from '../../types/brand.types';
import DeleteConfirmation from './DeleteConfirmation';
import BrandForm from './BrandForm';
import { Dialog, DialogTrigger } from '@/components/ui/dialog';

interface BrandActionsProps {
  brand: Brand;
  onDelete: (id: string) => void;
  onUpdate: (brand: Brand) => void;
  onToggleStatus: (id: string) => void;
}

const BrandActions: React.FC<BrandActionsProps> = ({
  brand,
  onDelete,
  onUpdate,
  onToggleStatus,
}) => {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Open menu</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-4 w-4"
            >
              <circle cx="12" cy="5" r="1" />
              <circle cx="12" cy="12" r="1" />
              <circle cx="12" cy="19" r="1" />
            </svg>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => setShowEditDialog(true)}>
            <Edit className="mr-2 h-4 w-4" />
            <span>Edit</span>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => onToggleStatus(brand.id)}>
            {brand.isActive ? (
              <>
                <ToggleLeft className="mr-2 h-4 w-4" />
                <span>Deactivate</span>
              </>
            ) : (
              <>
                <ToggleRight className="mr-2 h-4 w-4" />
                <span>Activate</span>
              </>
            )}
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => setShowDeleteDialog(true)}
            className="text-destructive focus:bg-destructive focus:text-destructive-foreground"
          >
            <Trash2 className="mr-2 h-4 w-4" />
            <span>Delete</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <DeleteConfirmation
        isOpen={showDeleteDialog}
        onClose={() => setShowDeleteDialog(false)}
        onConfirm={() => {
          onDelete(brand.id);
          setShowDeleteDialog(false);
        }}
        brandName={brand.name}
      />

      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <BrandForm
          brand={brand}
          onSubmit={(updatedBrand) => {
            onUpdate({ ...brand, ...updatedBrand, updatedAt: new Date().toISOString() });
            setShowEditDialog(false);
          }}
          onCancel={() => setShowEditDialog(false)}
        />
      </Dialog>
    </>
  );
};

export default BrandActions;
