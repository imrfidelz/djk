
import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Search, Package } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import BrandActions from './BrandActions';
import { Brand } from '../../types/brand.types';
import { brandService } from '@/services/brandService';

interface BrandTableProps {
  brands: Brand[];
  onDelete: (id: string) => void;
}

const BrandTable: React.FC<BrandTableProps> = ({ brands, onDelete }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  // Update brand mutation
  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => brandService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['brands'] });
      toast({
        title: 'Brand updated',
        description: 'The brand has been successfully updated.',
      });
    },
    onError: (error: Error) => {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  const handleUpdate = (brand: Brand) => {
    updateMutation.mutate({
      id: brand.id,
      data: {
        name: brand.name,
        description: brand.description,
        logo: brand.logo,
        isActive: brand.isActive,
      },
    });
  };

  const handleToggleStatus = (id: string) => {
    const brand = brands.find(b => b.id === id);
    if (brand) {
      updateMutation.mutate({
        id,
        data: {
          name: brand.name,
          description: brand.description,
          logo: brand.logo,
          isActive: !brand.isActive,
        },
      });
    }
  };
  
  const filteredBrands = brands.filter(brand => 
    brand.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    brand.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-4">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
        <Input 
          placeholder="Search brands..." 
          className="pl-10" 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      
      {/* Desktop Table View */}
      <div className="hidden md:block rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Description</TableHead>
              <TableHead className="text-center">Products</TableHead>
              <TableHead className="text-center">Status</TableHead>
              <TableHead className="w-24">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredBrands.length > 0 ? (
              filteredBrands.map((brand) => (
                <TableRow key={brand.id}>
                  <TableCell className="font-medium">{brand.name}</TableCell>
                  <TableCell className="max-w-xs truncate">{brand.description}</TableCell>
                  <TableCell className="text-center">
                    <div className="flex items-center justify-center gap-1">
                      <Package className="h-4 w-4 text-muted-foreground" />
                      {brand.productCount}
                    </div>
                  </TableCell>
                  <TableCell className="text-center">
                    <Badge variant={brand.isActive ? "default" : "secondary"}>
                      {brand.isActive ? "Active" : "Inactive"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <BrandActions 
                      brand={brand}
                      onDelete={() => onDelete(brand.id)}
                      onUpdate={handleUpdate}
                      onToggleStatus={handleToggleStatus}
                    />
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                  No brands found. Create your first brand.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Mobile Card View */}
      <div className="md:hidden space-y-4">
        {filteredBrands.length > 0 ? (
          filteredBrands.map((brand) => (
            <div key={brand.id} className="bg-card rounded-lg border p-4 space-y-3">
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium text-base truncate">{brand.name}</h3>
                  {brand.description && (
                    <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                      {brand.description}
                    </p>
                  )}
                </div>
                <BrandActions 
                  brand={brand}
                  onDelete={() => onDelete(brand.id)}
                  onUpdate={handleUpdate}
                  onToggleStatus={handleToggleStatus}
                />
              </div>
              
              <div className="flex items-center justify-between pt-2">
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <Package className="h-4 w-4" />
                    <span>{brand.productCount} products</span>
                  </div>
                  <Badge variant={brand.isActive ? "default" : "secondary"} className="text-xs">
                    {brand.isActive ? "Active" : "Inactive"}
                  </Badge>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-12 text-muted-foreground">
            <Package className="h-12 w-12 mx-auto mb-4 opacity-20" />
            <p>No brands found. Create your first brand.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default BrandTable;
