
import React from 'react';
import { Button } from '@/components/ui/button';
import { Eye, Edit, Trash } from 'lucide-react';
import { Product } from '../../types/product.types';

interface ProductActionsProps {
  product: Product;
  onView: (product: Product) => void;
  onEdit: (product: Product) => void;
  onDelete: (productId: string) => void;
}

const ProductActions: React.FC<ProductActionsProps> = ({ 
  product, 
  onView,
  onEdit,
  onDelete 
}) => {
  return (
    <div className="space-x-2 text-right">
      <Button 
        variant="ghost" 
        size="sm" 
        onClick={() => onView(product)}
        className="text-blue-600 hover:text-blue-800"
      >
        <Eye className="h-4 w-4" />
      </Button>
      <Button 
        variant="ghost" 
        size="sm" 
        onClick={() => onEdit(product)}
        className="text-amber-600 hover:text-amber-800"
      >
        <Edit className="h-4 w-4" />
      </Button>
      <Button 
        variant="ghost" 
        size="sm"
        onClick={() => onDelete(product.id)}
        className="text-red-600 hover:text-red-800"
      >
        <Trash className="h-4 w-4" />
      </Button>
    </div>
  );
};

export default ProductActions;
