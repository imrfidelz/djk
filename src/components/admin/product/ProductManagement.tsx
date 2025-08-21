
import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus, Search, Filter, MoreHorizontal, Grid, List, Package, TrendingUp, AlertCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import ProductsDataTable from './ProductsDataTable';
import ProductForm from './ProductForm';
import ProductView from './ProductView';
import DeleteConfirmation from './DeleteConfirmation';
import { Product } from '../types/product.types';
import { productService } from '@/services/productService';

const ProductManagement: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'draft' | 'out-of-stock'>('all');
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: products = [], isLoading, error } = useQuery({
    queryKey: ['products'],
    queryFn: productService.getAll,
  });

  const addMutation = useMutation({
    mutationFn: productService.create,
    onMutate: async (formData: FormData) => {
      await queryClient.cancelQueries({ queryKey: ['products'] });
      const previousProducts = queryClient.getQueryData<Product[]>(['products']) || [];
      const tempId = `temp-${Date.now()}`;
      const optimisticProduct: Product = {
        id: tempId,
        name: String(formData.get('name') || 'New Product'),
        description: String(formData.get('description') || ''),
        images: [],
        mainImage: '',
        brand: String(formData.get('brand') || ''),
        price: Number(formData.get('price') || 0),
        stock: Number(formData.get('stock') || 0),
        isLive: String(formData.get('isLive') || 'false') === 'true',
        isMain: false,
        isFeatured: false,
        isHotDeal: false,
        category: String(formData.get('category') || ''),
        slug: String(formData.get('slug') || ''),
        status: 'Draft',
        lastUpdated: new Date().toISOString().slice(0, 10),
      };
      queryClient.setQueryData<Product[]>(['products'], (old = []) => [optimisticProduct, ...old]);
      return { previousProducts };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      setIsAddDialogOpen(false);
      toast({
        title: "Success",
        description: "Product added successfully",
      });
    },
    onError: (error: any, _variables, context) => {
      if (context?.previousProducts) {
        queryClient.setQueryData(['products'], context.previousProducts);
      }
      toast({
        title: "Error",
        description: `Failed to add product: ${error.message}`,
        variant: "destructive",
      });
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
    }
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: FormData }) => 
      productService.update(id, data),
    onMutate: async ({ id, data }: { id: string; data: FormData }) => {
      await queryClient.cancelQueries({ queryKey: ['products'] });
      const previousProducts = queryClient.getQueryData<Product[]>(['products']) || [];
      const patch = {
        name: String(data.get('name') || ''),
        description: String(data.get('description') || ''),
        price: Number(data.get('price') || NaN),
        stock: Number(data.get('stock') || NaN),
        brand: String(data.get('brand') || ''),
        category: String(data.get('category') || ''),
        slug: String(data.get('slug') || ''),
        isLive: String(data.get('isLive') || '') === 'true',
        isFeatured: String(data.get('isFeatured') || '') === 'true',
        isHotDeal: String(data.get('isHotDeal') || '') === 'true',
      } as Partial<Product>;
      queryClient.setQueryData<Product[]>(['products'], (old = []) =>
        old.map((p) => (p.id === id ? { ...p, ...patch, lastUpdated: new Date().toISOString().slice(0, 10) } : p))
      );
      return { previousProducts };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      setIsEditDialogOpen(false);
      setSelectedProduct(null);
      toast({
        title: "Success",
        description: "Product updated successfully",
      });
    },
    onError: (error: any, _variables, context) => {
      if (context?.previousProducts) {
        queryClient.setQueryData(['products'], context.previousProducts);
      }
      toast({
        title: "Error",
        description: `Failed to update product: ${error.message}`,
        variant: "destructive",
      });
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: productService.delete,
    onMutate: async (id: string) => {
      await queryClient.cancelQueries({ queryKey: ['products'] });
      const previousProducts = queryClient.getQueryData<Product[]>(['products']) || [];
      queryClient.setQueryData<Product[]>(['products'], (old = []) => old.filter((p) => p.id !== id));
      return { previousProducts };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      setIsDeleteDialogOpen(false);
      setSelectedProduct(null);
      toast({
        title: "Success",
        description: "Product deleted successfully",
      });
    },
    onError: (error: any, _variables, context) => {
      if (context?.previousProducts) {
        queryClient.setQueryData(['products'], context.previousProducts);
      }
      toast({
        title: "Error",
        description: `Failed to delete product: ${error.message}`,
        variant: "destructive",
      });
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
  });

  const handleView = (product: Product) => {
    setSelectedProduct(product);
    setIsViewDialogOpen(true);
  };

  const handleEdit = (product: Product) => {
    setSelectedProduct(product);
    setIsEditDialogOpen(true);
  };

  const handleDelete = (product: Product) => {
    setSelectedProduct(product);
    setIsDeleteDialogOpen(true);
  };

  const handleAdd = (data: FormData) => {
    addMutation.mutate(data);
  };

  const handleUpdate = (data: FormData) => {
    if (selectedProduct) {
      updateMutation.mutate({ id: selectedProduct.id, data });
    }
  };

  const confirmDelete = () => {
    if (selectedProduct) {
      deleteMutation.mutate(selectedProduct.id);
    }
  };

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || 
      (statusFilter === 'active' && product.status === 'Active') ||
      (statusFilter === 'draft' && product.status === 'Draft') ||
      (statusFilter === 'out-of-stock' && product.status === 'Out of Stock');
    
    return matchesSearch && matchesStatus;
  });

  // Calculate stats
  const totalProducts = products.length;
  const activeProducts = products.filter(p => p.status === 'Active').length;
  const lowStockProducts = products.filter(p => p.stock <= 10).length;
  const featuredProducts = products.filter(p => p.isFeatured).length;

  if (error) {
    return (
      <div className="p-4 md:p-6">
        <Alert variant="destructive" className="border-destructive/50 bg-destructive/5">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Error loading products: {error.message}. Using offline mode with limited functionality.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-4 md:p-6">
      {/* Header Section */}
      <div className="flex flex-col space-y-4">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="space-y-1">
            <h1 className="text-2xl md:text-3xl font-bold text-foreground">Product Management</h1>
            <p className="text-sm text-muted-foreground">Manage your product catalog and inventory</p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-2 w-auto">
            <Button 
              onClick={() => setIsAddDialogOpen(true)} 
              className="bg-primary hover:bg-primary/90 text-primary-foreground gap-2 order-2 sm:order-1"
            >
              <Plus size={16} />
              <span className="hidden sm:inline">Add Product</span>
              <span className="sm:hidden">Add</span>
            </Button>
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <Card className="border-0 shadow-sm">
        <CardContent className="p-4 md:p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={16} />
              <Input
                placeholder="Search products by name or description..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-background"
              />
            </div>
            
            <div className="w-full md:w-auto">
              <Tabs value={statusFilter} onValueChange={(value) => setStatusFilter(value as any)} className="w-full md:w-auto">
                <TabsList className="grid w-full grid-cols-4 md:grid-cols-4 md:w-auto">
                  <TabsTrigger value="all" className="text-xs px-1 md:px-3">All</TabsTrigger>
                  <TabsTrigger value="active" className="text-xs px-1 md:px-3">Active</TabsTrigger>
                  <TabsTrigger value="draft" className="text-xs px-1 md:px-3">Draft</TabsTrigger>
                  <TabsTrigger value="out-of-stock" className="text-xs px-1 md:px-3">Low Stock</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Products Table/Grid */}
      <Card className="border-0 shadow-sm">
        <CardHeader className="px-4 md:px-6 pb-4">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg font-semibold">
              Products ({filteredProducts.length})
            </CardTitle>
            {filteredProducts.length > 0 && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>Bulk Actions</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>Export CSV</DropdownMenuItem>
                  <DropdownMenuItem>Export PDF</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="space-y-4 p-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="flex items-center space-x-4 p-4 border rounded-lg">
                  <Skeleton className="h-12 w-12 rounded" />
                  <div className="space-y-2 flex-1">
                    <Skeleton className="h-4 w-[60%]" />
                    <Skeleton className="h-3 w-[40%]" />
                  </div>
                  <Skeleton className="h-8 w-[100px]" />
                </div>
              ))}
            </div>
          ) : filteredProducts.length > 0 ? (
            <div className="w-full">
              <ProductsDataTable
                products={filteredProducts}
                onView={handleView}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            </div>
          ) : (
            <div className="text-center py-12 px-4">
              <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-foreground mb-2">No products found</h3>
              <p className="text-muted-foreground mb-4">
                {searchQuery || statusFilter !== 'all' 
                  ? 'Try adjusting your search or filters' 
                  : 'Get started by adding your first product'
                }
              </p>
              {(!searchQuery && statusFilter === 'all') && (
                <Button onClick={() => setIsAddDialogOpen(true)} className="bg-primary hover:bg-primary/90">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Your First Product
                </Button>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Add Product Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold">Add New Product</DialogTitle>
          </DialogHeader>
          <ProductForm
            onSubmit={handleAdd}
            onCancel={() => setIsAddDialogOpen(false)}
            isLoading={addMutation.isPending}
          />
        </DialogContent>
      </Dialog>

      {/* Edit Product Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold">Edit Product</DialogTitle>
          </DialogHeader>
          {selectedProduct && (
            <ProductForm
              product={selectedProduct}
              onSubmit={handleUpdate}
              onCancel={() => setIsEditDialogOpen(false)}
              isLoading={updateMutation.isPending}
              isEdit
            />
          )}
        </DialogContent>
      </Dialog>

      {/* View Product Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold">Product Details</DialogTitle>
          </DialogHeader>
          {selectedProduct && (
            <ProductView
              product={selectedProduct}
              onClose={() => setIsViewDialogOpen(false)}
              onEdit={() => {
                setIsViewDialogOpen(false);
                setIsEditDialogOpen(true);
              }}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <DeleteConfirmation
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        onConfirm={confirmDelete}
        productName={selectedProduct?.name || ''}
        isLoading={deleteMutation.isPending}
      />
    </div>
  );
};

export default ProductManagement;
