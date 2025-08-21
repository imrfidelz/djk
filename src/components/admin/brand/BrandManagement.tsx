
import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus, Grid3X3, List } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { AlertTriangle } from 'lucide-react';
import BrandStats from './components/BrandStats';
import BrandGrid from './components/BrandGrid';
import BrandTable from './components/BrandTable';
import BrandForm from './components/BrandForm';
import { brandService } from '@/services/brandService';
import { BrandFormData, Brand } from '../types/brand.types';

const BrandManagement = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isUsingMockData, setIsUsingMockData] = useState(false);
  const [isAddingBrand, setIsAddingBrand] = useState(false);
  const [activeView, setActiveView] = useState('grid');

  // Fetch brands
  const { data: brands = [], isLoading, error } = useQuery({
    queryKey: ['brands'],
    queryFn: async () => {
      try {
        const result = await brandService.getAll();
        setIsUsingMockData(false);
        return result;
      } catch (error) {
        setIsUsingMockData(true);
        throw error;
      }
    },
    retry: (failureCount, error) => {
      // Only retry once, then fall back to mock data
      if (failureCount < 1) {
        return true;
      }
      
      // If we've exhausted retries, show mock data
      setIsUsingMockData(true);
      return false;
    },
    retryDelay: 1000,
  });

  // Create brand mutation with optimistic updates
  const createMutation = useMutation({
    mutationFn: brandService.create,
    onMutate: async (newBrand: BrandFormData) => {
      await queryClient.cancelQueries({ queryKey: ['brands'] });
      const previousBrands = queryClient.getQueryData<Brand[]>(['brands']);
      
      const optimisticBrand: Brand = {
        id: `temp-${Date.now()}`,
        name: newBrand.name,
        description: newBrand.description,
        logo: newBrand.logo,
        isActive: newBrand.isActive,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        productCount: 0,
      };
      
      queryClient.setQueryData<Brand[]>(['brands'], old => [...(old || []), optimisticBrand]);
      
      return { previousBrands };
    },
    onSuccess: () => {
      toast({
        title: "Brand Created",
        description: "The brand has been created successfully.",
      });
      setIsAddingBrand(false);
    },
    onError: (error: Error, _variables, context) => {
      if (context?.previousBrands) {
        queryClient.setQueryData(['brands'], context.previousBrands);
      }
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['brands'] });
    },
  });

  // Delete brand mutation with optimistic updates
  const deleteMutation = useMutation({
    mutationFn: brandService.delete,
    onMutate: async (brandId: string) => {
      await queryClient.cancelQueries({ queryKey: ['brands'] });
      const previousBrands = queryClient.getQueryData<Brand[]>(['brands']);
      
      queryClient.setQueryData<Brand[]>(['brands'], old => 
        (old || []).filter(brand => brand.id !== brandId)
      );
      
      return { previousBrands };
    },
    onSuccess: () => {
      toast({
        title: "Brand Deleted",
        description: "The brand has been deleted successfully.",
      });
    },
    onError: (error: Error, _variables, context) => {
      if (context?.previousBrands) {
        queryClient.setQueryData(['brands'], context.previousBrands);
      }
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['brands'] });
    },
  });

  const handleCreate = (data: BrandFormData) => {
    createMutation.mutate(data);
  };

  if (isLoading) {
    return (
      <div className="space-y-8">
        {/* Header Skeleton */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
          <div>
            <Skeleton className="h-8 w-48 mb-2" />
            <Skeleton className="h-4 w-64" />
          </div>
          <Skeleton className="h-10 w-32" />
        </div>
        
        {/* Stats Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-24 w-full" />
          ))}
        </div>

        {/* Content Skeleton */}
        <div className="space-y-4">
          <Skeleton className="h-10 w-full" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Skeleton key={i} className="h-48 w-full" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div>
          <h1 className="text-4xl font-bold text-foreground">Brand Management</h1>
          <p className="text-muted-foreground text-base mt-2">
            Manage and organize your product brands
          </p>
        </div>
        <Button onClick={() => setIsAddingBrand(true)} className="gap-2 shrink-0">
          <Plus className="h-4 w-4" />
          Add Brand
        </Button>
      </div>

      {/* Alerts */}
      {isUsingMockData && (
        <Alert className="border-orange-200 bg-orange-50">
          <AlertTriangle className="h-4 w-4 text-orange-600" />
          <AlertDescription className="text-orange-800">
            Backend server is currently unavailable. You're viewing sample data. 
            Changes will not be persisted until the server is restored.
          </AlertDescription>
        </Alert>
      )}

      {error && !isUsingMockData && (
        <Alert className="border-red-200 bg-red-50">
          <AlertTriangle className="h-4 w-4 text-red-600" />
          <AlertDescription className="text-red-800">
            Failed to load brands: {(error as Error).message}
          </AlertDescription>
        </Alert>
      )}

      {/* Statistics */}
      <BrandStats brands={brands} />

      {/* View Toggle and Content */}
      <Tabs value={activeView} onValueChange={setActiveView} className="space-y-6">
        <TabsList className="grid w-full max-w-md grid-cols-2">
          <TabsTrigger value="grid" className="flex items-center gap-2">
            <Grid3X3 className="h-4 w-4" />
            Grid View
          </TabsTrigger>
          <TabsTrigger value="table" className="flex items-center gap-2">
            <List className="h-4 w-4" />
            Table View
          </TabsTrigger>
        </TabsList>

        <TabsContent value="grid" className="space-y-6">
          <BrandGrid brands={brands} onDelete={deleteMutation.mutate} />
        </TabsContent>

        <TabsContent value="table" className="space-y-6">
          <BrandTable brands={brands} onDelete={deleteMutation.mutate} />
        </TabsContent>
      </Tabs>

      {/* Add Brand Dialog */}
      <Dialog open={isAddingBrand} onOpenChange={setIsAddingBrand}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Add New Brand</DialogTitle>
          </DialogHeader>
          <BrandForm
            onSubmit={handleCreate}
            onCancel={() => setIsAddingBrand(false)}
            isLoading={createMutation.isPending}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default BrandManagement;
