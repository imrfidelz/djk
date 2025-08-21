
import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent } from '@/components/ui/card';
import CategoryTable from './components/CategoryTable';
import AddCategoryButton from './components/AddCategoryButton';
import CategoryForm from './components/CategoryForm';
import DeleteConfirmation from './components/DeleteConfirmation';
import { Category, CategoryFormValues } from '../types/category.types';
import { categoryService } from '@/services/categoryService';

const CategoryManagement: React.FC = () => {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [currentCategory, setCurrentCategory] = useState<Category | null>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch categories
  const { data: categories = [], isLoading, error } = useQuery({
    queryKey: ['categories'],
    queryFn: categoryService.getAll,
  });

  // Create category mutation
  const createMutation = useMutation({
    mutationFn: categoryService.create,
    onMutate: async (data: CategoryFormValues) => {
      await queryClient.cancelQueries({ queryKey: ['categories'] });
      const previousCategories = queryClient.getQueryData<Category[]>(['categories']) || [];
      const temp = {
        id: `temp-${Date.now()}`,
        name: data.name,
        description: data.description,
        productCount: 0,
      } as Category;
      queryClient.setQueryData<Category[]>(['categories'], (old = []) => [temp, ...old]);
      return { previousCategories };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      setIsAddDialogOpen(false);
      toast({
        title: "Category Added",
        description: "The category has been added successfully.",
      });
    },
    onError: (error: Error, _variables, context) => {
      if (context?.previousCategories) {
        queryClient.setQueryData(['categories'], context.previousCategories);
      }
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
    },
  });

  // Update category mutation
  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: CategoryFormValues }) =>
      categoryService.update(id, data),
    onMutate: async ({ id, data }: { id: string; data: CategoryFormValues }) => {
      await queryClient.cancelQueries({ queryKey: ['categories'] });
      const previousCategories = queryClient.getQueryData<Category[]>(['categories']) || [];
      queryClient.setQueryData<Category[]>(['categories'], (old = []) =>
        old.map((c) => (c.id === id ? { ...c, name: data.name, description: data.description } : c))
      );
      return { previousCategories };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      setIsEditDialogOpen(false);
      setCurrentCategory(null);
      toast({
        title: "Category Updated",
        description: "The category has been updated successfully.",
      });
    },
    onError: (error: Error, _variables, context) => {
      if (context?.previousCategories) {
        queryClient.setQueryData(['categories'], context.previousCategories);
      }
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
    },
  });

  // Delete category mutation
  const deleteMutation = useMutation({
    mutationFn: categoryService.delete,
    onMutate: async (id: string) => {
      await queryClient.cancelQueries({ queryKey: ['categories'] });
      const previousCategories = queryClient.getQueryData<Category[]>(['categories']) || [];
      queryClient.setQueryData<Category[]>(['categories'], (old = []) => old.filter((c) => c.id !== id));
      return { previousCategories };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      setIsDeleteDialogOpen(false);
      setCurrentCategory(null);
      toast({
        title: "Category Deleted",
        description: "The category has been deleted successfully.",
      });
    },
    onError: (error: Error, _variables, context) => {
      if (context?.previousCategories) {
        queryClient.setQueryData(['categories'], context.previousCategories);
      }
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
    },
  });

  const handleAddCategory = (categoryData: CategoryFormValues) => {
    createMutation.mutate(categoryData);
  };

  const handleEditCategory = (categoryData: CategoryFormValues) => {
    if (currentCategory) {
      updateMutation.mutate({ id: currentCategory.id, data: categoryData });
    }
  };

  const handleDeleteCategory = () => {
    if (currentCategory) {
      deleteMutation.mutate(currentCategory.id);
    }
  };

  const openEditDialog = (category: Category) => {
    setCurrentCategory(category);
    setIsEditDialogOpen(true);
  };

  const openDeleteDialog = (category: Category) => {
    setCurrentCategory(category);
    setIsDeleteDialogOpen(true);
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-serif">Category Management</h1>
            <p className="text-muted-foreground">Manage your product categories</p>
          </div>
        </div>
        <div className="text-center py-8">Loading categories...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-serif">Category Management</h1>
            <p className="text-muted-foreground">Manage your product categories</p>
          </div>
        </div>
        <div className="text-center py-8 text-destructive">
          Error loading categories: {(error as Error).message}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-4 md:p-6">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-foreground">Category Management</h1>
          <p className="text-sm md:text-base text-muted-foreground">Manage your product categories</p>
        </div>
        <AddCategoryButton onClick={() => setIsAddDialogOpen(true)} />
      </div>
      
      <Card className="border-0 shadow-sm">
        <CardContent className="p-0">
          <CategoryTable 
            categories={categories} 
            onEdit={openEditDialog} 
            onDelete={openDeleteDialog}
          />
        </CardContent>
      </Card>

      <CategoryForm 
        category={currentCategory}
        isOpen={isAddDialogOpen || isEditDialogOpen} 
        onClose={() => {
          setIsAddDialogOpen(false);
          setIsEditDialogOpen(false);
          setCurrentCategory(null);
        }}
        onSubmit={isEditDialogOpen ? handleEditCategory : handleAddCategory}
        isEditing={isEditDialogOpen}
      />

      <DeleteConfirmation 
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        onConfirm={handleDeleteCategory}
        itemName={currentCategory?.name || ''}
        itemType="category"
      />
    </div>
  );
};

export default CategoryManagement;
