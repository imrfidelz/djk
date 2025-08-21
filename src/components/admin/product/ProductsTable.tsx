import React, { useState } from 'react';
import { 
  Table,
  TableBody,
  TableCell,
  TableRow 
} from '@/components/ui/table';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Product, mockProducts } from '../types/product.types';
import { getCategoryName, getBrandName } from './utils/productUtils';
import ProductForm from './ProductForm';
import ProductView from './ProductView';
import DeleteConfirmation from './DeleteConfirmation';
import ProductSearchBar from './components/ProductSearchBar';
import ProductTableHeader from './components/ProductTableHeader';
import ProductTableRow from './components/ProductTableRow';
import AddProductButton from './components/AddProductButton';
import { toast } from '@/components/ui/sonner';

const ProductsTable = () => {
  const [products, setProducts] = useState<Product[]>(mockProducts);
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
  
  // Filter products based on search query
  const filteredProducts = products.filter(product => 
    product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    getCategoryName(product.category).toLowerCase().includes(searchQuery.toLowerCase()) ||
    getBrandName(product.brand).toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  // Handler for adding a new product
  const handleAddProduct = (formData: FormData) => {
    const newProduct: Product = {
      id: (products.length + 1).toString(),
      name: formData.get('name') as string || '',
      description: formData.get('description') as string || '',
      price: Number(formData.get('price')) || 0,
      stock: Number(formData.get('stock')) || 0,
      brand: formData.get('brand') as string || '',
      category: formData.get('category') as string || '',
      mainImage: formData.get('mainImage') as string || '',
      images: [], // This would be handled by the backend
      status: Number(formData.get('stock')) > 0 ? 'Active' : 'Out of Stock',
      sold_out: 0,
      slug: formData.get('slug') as string || '',
      size: [],
      specifications: [],
      color: [],
      isLive: formData.get('isLive') === 'true',
      isMain: formData.get('isMain') === 'true',
      isFeatured: formData.get('isFeatured') === 'true',
      isHotDeal: formData.get('isHotDeal') === 'true',
      liveAt: formData.get('isLive') === 'true' ? new Date() : undefined,
      lastUpdated: new Date().toISOString().split('T')[0],
    };
    
    setProducts([newProduct, ...products]);
    setIsAddDialogOpen(false);
    toast.success("Product added successfully!");
  };
  
  // Handler for updating a product
  const handleUpdateProduct = (formData: FormData) => {
    if (!selectedProductId) return;
    
    const updatedProducts = products.map(product => 
      product.id === selectedProductId 
        ? {
            ...product,
            name: formData.get('name') as string || product.name,
            description: formData.get('description') as string || product.description,
            price: Number(formData.get('price')) || product.price,
            stock: Number(formData.get('stock')) || product.stock,
            brand: formData.get('brand') as string || product.brand,
            category: formData.get('category') as string || product.category,
            mainImage: formData.get('mainImage') as string || product.mainImage,
            slug: formData.get('slug') as string || product.slug,
            isLive: formData.get('isLive') === 'true',
            isMain: formData.get('isMain') === 'true',
            isFeatured: formData.get('isFeatured') === 'true',
            isHotDeal: formData.get('isHotDeal') === 'true',
            status: Number(formData.get('stock')) > 0 ? 'Active' as const : 'Out of Stock' as const,
            lastUpdated: new Date().toISOString().split('T')[0]
          } 
        : product
    );
    
    setProducts(updatedProducts);
    setIsEditDialogOpen(false);
    setSelectedProductId(null);
    toast.success("Product updated successfully!");
  };
  
  // Handler for deleting a product
  const handleDeleteProduct = () => {
    if (!selectedProductId) return;
    
    const updatedProducts = products.filter(product => product.id !== selectedProductId);
    setProducts(updatedProducts);
    setIsDeleteDialogOpen(false);
    setSelectedProductId(null);
    toast.success("Product deleted successfully!");
  };
  
  // Handler for editing a product (open the dialog and populate form)
  const handleEditClick = (product: Product) => {
    setSelectedProductId(product.id);
    setSelectedProduct(product);
    setIsEditDialogOpen(true);
  };
  
  // Handler for viewing a product details
  const handleViewClick = (product: Product) => {
    setSelectedProduct(product);
    setIsViewDialogOpen(true);
  };
  
  // Handler for opening delete confirmation dialog
  const handleDeleteClick = (productId: string) => {
    const product = products.find(p => p.id === productId);
    setSelectedProduct(product || null);
    setSelectedProductId(productId);
    setIsDeleteDialogOpen(true);
  };

  return (
    <div className="space-y-4">
      {/* Search bar */}
      <div className="w-full overflow-hidden">
        <ProductSearchBar 
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
        />
      </div>

      {/* Products Table */}
      <div className="border rounded-lg overflow-x-auto">
        <Table>
          <ProductTableHeader />
          <TableBody>
            {filteredProducts.length > 0 ? (
              filteredProducts.map((product) => (
                <ProductTableRow
                  key={product.id}
                  product={product}
                  onView={handleViewClick}
                  onEdit={handleEditClick}
                  onDelete={handleDeleteClick}
                />
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-10 text-muted-foreground">
                  No products found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Add New Product Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
          <ProductForm 
            onSubmit={handleAddProduct}
            onCancel={() => setIsAddDialogOpen(false)}
          />
        </DialogContent>
      </Dialog>

      {/* Edit Product Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
          {selectedProduct && (
            <ProductForm 
              product={selectedProduct}
              onSubmit={handleUpdateProduct}
              onCancel={() => setIsEditDialogOpen(false)}
              isEdit
            />
          )}
        </DialogContent>
      </Dialog>

      {/* View Product Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
          {selectedProduct && (
            <ProductView 
              product={selectedProduct} 
              onClose={() => setIsViewDialogOpen(false)}
              onEdit={(product) => {
                setIsViewDialogOpen(false);
                handleEditClick(product);
              }}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <DeleteConfirmation
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        onConfirm={handleDeleteProduct}
        productName={selectedProduct?.name || ''}
        isLoading={false}
      />

      {/* Add Product Button */}
      <div className="fixed bottom-6 right-6 md:static md:float-right mt-4">
        <AddProductButton onClick={() => setIsAddDialogOpen(true)} />
      </div>
    </div>
  );
};

export default ProductsTable;
