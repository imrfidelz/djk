import React, { useState, useMemo } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';
import { Package } from 'lucide-react';
import BrandCard from './BrandCard';
import BrandFilters from './BrandFilters';
import BrandForm from './BrandForm';
import DeleteConfirmation from './DeleteConfirmation';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Brand, BrandFormData } from '../../types/brand.types';
import { brandService } from '@/services/brandService';

interface BrandGridProps {
  brands: Brand[];
  onDelete: (id: string) => void;
}

const BrandGrid: React.FC<BrandGridProps> = ({ brands, onDelete }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortBy, setSortBy] = useState('name');
  const [editingBrand, setEditingBrand] = useState<Brand | null>(null);
  const [deletingBrand, setDeletingBrand] = useState<Brand | null>(null);
  
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Update brand mutation
  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: BrandFormData }) => 
      brandService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['brands'] });
      toast({
        title: 'Brand updated',
        description: 'The brand has been successfully updated.',
      });
      setEditingBrand(null);
    },
    onError: (error: Error) => {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  const handleUpdate = (data: BrandFormData) => {
    if (editingBrand) {
      updateMutation.mutate({
        id: editingBrand.id,
        data
      });
    }
  };

  const handleToggleStatus = (brand: Brand) => {
    updateMutation.mutate({
      id: brand.id,
      data: {
        name: brand.name,
        description: brand.description,
        logo: brand.logo,
        isActive: !brand.isActive,
      },
    });
  };

  const handleDelete = () => {
    if (deletingBrand) {
      onDelete(deletingBrand.id);
      setDeletingBrand(null);
    }
  };

  const handleClearFilters = () => {
    setSearchTerm('');
    setStatusFilter('all');
    setSortBy('name');
  };

  const hasActiveFilters = searchTerm !== '' || statusFilter !== 'all';

  // Filter and sort brands
  const filteredAndSortedBrands = useMemo(() => {
    let filtered = brands.filter(brand => {
      const matchesSearch = brand.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                           brand.description.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = statusFilter === 'all' || 
                           (statusFilter === 'active' && brand.isActive) || 
                           (statusFilter === 'inactive' && !brand.isActive);
      
      return matchesSearch && matchesStatus;
    });

    // Sort brands
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'name-desc':
          return b.name.localeCompare(a.name);
        case 'products':
          return b.productCount - a.productCount;
        case 'products-desc':
          return a.productCount - b.productCount;
        case 'created':
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        case 'created-desc':
          return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        default:
          return 0;
      }
    });

    return filtered;
  }, [brands, searchTerm, statusFilter, sortBy]);

  return (
    <div className="space-y-6">
      {/* Filters */}
      <BrandFilters
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        statusFilter={statusFilter}
        onStatusFilterChange={setStatusFilter}
        sortBy={sortBy}
        onSortChange={setSortBy}
        onClearFilters={handleClearFilters}
        hasActiveFilters={hasActiveFilters}
      />

      {/* Brand Grid */}
      {filteredAndSortedBrands.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredAndSortedBrands.map((brand) => (
            <BrandCard
              key={brand.id}
              brand={brand}
              onEdit={() => setEditingBrand(brand)}
              onDelete={() => setDeletingBrand(brand)}
              onToggleStatus={() => handleToggleStatus(brand)}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <Package className="h-16 w-16 mx-auto mb-4 text-muted-foreground/30" />
          <h3 className="text-lg font-medium text-muted-foreground mb-2">
            {hasActiveFilters ? 'No brands match your filters' : 'No brands found'}
          </h3>
          <p className="text-sm text-muted-foreground max-w-sm mx-auto">
            {hasActiveFilters 
              ? 'Try adjusting your search terms or filters to see more results.'
              : 'Create your first brand to get started with organizing your products.'
            }
          </p>
        </div>
      )}

      {/* Edit Brand Dialog */}
      <Dialog open={!!editingBrand} onOpenChange={() => setEditingBrand(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Brand</DialogTitle>
          </DialogHeader>
          {editingBrand && (
            <BrandForm
              brand={editingBrand}
              onSubmit={handleUpdate}
              onCancel={() => setEditingBrand(null)}
              isLoading={updateMutation.isPending}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <DeleteConfirmation
        isOpen={!!deletingBrand}
        onClose={() => setDeletingBrand(null)}
        onConfirm={handleDelete}
        brandName={deletingBrand?.name || ''}
      />
    </div>
  );
};

export default BrandGrid;