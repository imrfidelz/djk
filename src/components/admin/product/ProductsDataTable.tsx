
import React from 'react';
import { 
  Table,
  TableBody,
  TableCell,
  TableRow 
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Eye, Edit, Trash, MoreHorizontal } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { useQuery } from '@tanstack/react-query';
import { Product } from '../types/product.types';
import ProductTableHeader from './components/ProductTableHeader';
import ProductTableRow from './components/ProductTableRow';
import { categoryService } from '@/services/categoryService';
import { brandService } from '@/services/brandService';

interface ProductsDataTableProps {
  products: Product[];
  onView: (product: Product) => void;
  onEdit: (product: Product) => void;
  onDelete: (product: Product) => void;
}

const ProductsDataTable: React.FC<ProductsDataTableProps> = ({
  products,
  onView,
  onEdit,
  onDelete
}) => {
  // Fetch categories and brands for mobile card display
  const { data: categories = [] } = useQuery({
    queryKey: ['categories'],
    queryFn: categoryService.getAll,
  });

  const { data: brands = [] } = useQuery({
    queryKey: ['brands'],
    queryFn: brandService.getAll,
  });

  // Helper functions to get names
  const getBrandName = (brandId: string) => {
    const brand = brands.find(b => b.id === brandId);
    return brand ? brand.name : 'Unknown Brand';
  };

  const getCategoryName = (categoryId: string) => {
    const category = categories.find(c => c.id === categoryId);
    return category ? category.name : 'Unknown Category';
  };

  // Mobile card view for small screens
  const MobileProductCard = ({ product }: { product: Product }) => {
    return (
      <div className="border border-border rounded-lg p-4 space-y-3 bg-card">
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-sm text-card-foreground truncate">
              {product.name}
            </h3>
            <p className="text-xs text-muted-foreground mt-1">
              {getBrandName(product.brand)} • {getCategoryName(product.category)}
            </p>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => onView(product)}>
                <Eye className="h-4 w-4 mr-2" />
                View
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onEdit(product)}>
                <Edit className="h-4 w-4 mr-2" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={() => onDelete(product)}
                className="text-destructive focus:text-destructive"
              >
                <Trash className="h-4 w-4 mr-2" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Badge 
              variant={
                product.status === 'Active' ? 'default' : 
                product.status === 'Draft' ? 'secondary' : 
                'destructive'
              }
              className="text-xs"
            >
              {product.status}
            </Badge>
            {product.isFeatured && (
              <Badge variant="outline" className="text-xs">
                Featured
              </Badge>
            )}
            {product.isHotDeal && (
              <Badge variant="outline" className="text-xs text-orange-600">
                Hot Deal
              </Badge>
            )}
          </div>
          <div className="text-right">
            <p className="font-semibold text-sm">${product.price}</p>
            <p className="text-xs text-muted-foreground">
              Stock: {product.stock}
            </p>
          </div>
        </div>
        
        <p className="text-xs text-muted-foreground line-clamp-2">
          {product.description}
        </p>
      </div>
    );
  };

  return (
    <>
      {/* Mobile view */}
      <div className="md:hidden space-y-3 p-4">
        {products.length > 0 ? (
          products.map((product) => (
            <MobileProductCard key={product.id} product={product} />
          ))
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            No products found
          </div>
        )}
      </div>

      {/* Desktop/Tablet view */}
      <div className="hidden md:block">
        <div className="border rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <Table>
              <ProductTableHeader />
              <TableBody>
                {products.length > 0 ? (
                  products.map((product) => (
                    <ProductTableRow
                      key={product.id}
                      product={product}
                      onView={onView}
                      onEdit={onEdit}
                      onDelete={(productId) => {
                        const productToDelete = products.find(p => p.id === productId);
                        if (productToDelete) {
                          onDelete(productToDelete);
                        }
                      }}
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
        </div>
      </div>
    </>
  );
};

export default ProductsDataTable;
