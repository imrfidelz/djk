
import React, { useState } from 'react';
import { MoreHorizontal, Edit, Trash2, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import BannerForm from './BannerForm';
import DeleteConfirmation from './DeleteConfirmation';
import { Banner, BannerFormData } from '../../types/banner.types';
import { useToast } from '@/hooks/use-toast';
import { bannerService } from '@/services/bannerService';
import { useMutation, useQueryClient } from '@tanstack/react-query';

interface BannerActionsProps {
  banner: Banner;
}

const BannerActions: React.FC<BannerActionsProps> = ({ banner }) => {
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [viewOpen, setViewOpen] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const updateBannerMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: FormData }) => bannerService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['banners'] });
      toast({
        title: "Success",
        description: "Banner updated successfully",
      });
      setEditOpen(false);
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const deleteBannerMutation = useMutation({
    mutationFn: bannerService.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['banners'] });
      toast({
        title: "Success",
        description: "Banner deleted successfully",
      });
      setDeleteOpen(false);
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleEdit = async (data: BannerFormData) => {
    const formData = new FormData();
    
    if (data.image) {
      formData.append('image', data.image);
    }
    formData.append('isHero', data.isHero.toString());
    formData.append('section', data.section);

    updateBannerMutation.mutate({ id: banner._id, data: formData });
  };

  const handleDelete = async () => {
    deleteBannerMutation.mutate(banner._id);
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => setViewOpen(true)}>
            <Eye className="mr-2 h-4 w-4" />
            View
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setEditOpen(true)}>
            <Edit className="mr-2 h-4 w-4" />
            Edit
          </DropdownMenuItem>
          <DropdownMenuItem 
            onClick={() => setDeleteOpen(true)}
            className="text-red-600"
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* View Dialog */}
      <Dialog open={viewOpen} onOpenChange={setViewOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Banner Preview</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <img
              src={banner.image}
              alt="Banner"
              className="w-full h-64 object-cover rounded-lg"
            />
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="font-medium">Section:</span> {
                  banner.section === 'hero' ? 'Hero' : 
                  banner.section === 'signature-collection' ? 'Signature Collection' : 
                  'Commitment'
                }
              </div>
              <div>
                <span className="font-medium">Type:</span> {banner.isHero ? 'Hero Banner' : 'Regular Banner'}
              </div>
              <div>
                <span className="font-medium">Order:</span> {banner.order}
              </div>
              <div>
                <span className="font-medium">Created:</span> {new Date(banner.createdAt).toLocaleDateString()}
              </div>
              <div>
                <span className="font-medium">Updated:</span> {new Date(banner.updatedAt).toLocaleDateString()}
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Banner</DialogTitle>
          </DialogHeader>
          <BannerForm
            banner={banner}
            onSubmit={handleEdit}
            onCancel={() => setEditOpen(false)}
            isLoading={updateBannerMutation.isPending}
          />
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <DeleteConfirmation
        isOpen={deleteOpen}
        onClose={() => setDeleteOpen(false)}
        onConfirm={handleDelete}
        isLoading={deleteBannerMutation.isPending}
        itemName="banner"
      />
    </>
  );
};

export default BannerActions;
