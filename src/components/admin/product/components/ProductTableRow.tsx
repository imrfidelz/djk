
import React from 'react';
import { TableCell, TableRow } from '@/components/ui/table';
import { Checkbox } from '@/components/ui/checkbox';
import { Product } from '../../types/product.types';
import ProductStatusBadge from './ProductStatusBadge';
import ProductActions from './ProductActions';
import { useBrandName, useCategoryName } from '../utils/productUtils';
import { formatCurrency } from '@/lib/currency';

interface ProductTableRowProps {
  product: Product;
  onView: (product: Product) => void;
  onEdit: (product: Product) => void;
  onDelete: (productId: string) => void;
}

const ProductTableRow: React.FC<ProductTableRowProps> = ({
  product,
  onView,
  onEdit,
  onDelete
}) => {
  const categoryName = useCategoryName(product.category);
  const brandName = useBrandName(product.brand);

  return (
    <TableRow key={product.id} className="hover:bg-muted/50">
      <TableCell>
        <Checkbox />
      </TableCell>
      <TableCell className="font-medium">
        <div className="flex items-center gap-3">
          {product.mainImage && (
            <img 
              src={product.mainImage} 
              alt={product.name}
              className="w-10 h-10 rounded object-cover"
            />
          )}
          <div>
            <div className="font-medium">{product.name}</div>
            <div className="text-sm text-muted-foreground">{brandName}</div>
          </div>
        </div>
      </TableCell>
      <TableCell className="hidden md:table-cell">{categoryName}</TableCell>
      <TableCell>{formatCurrency(product.price)}</TableCell>
      <TableCell className="hidden sm:table-cell">{product.stock}</TableCell>
      <TableCell className="hidden md:table-cell">
        <ProductStatusBadge status={product.status} />
      </TableCell>
      <TableCell className="hidden lg:table-cell">{product.lastUpdated}</TableCell>
      <TableCell className="text-right">
        <ProductActions
          product={product}
          onView={onView}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      </TableCell>
    </TableRow>
  );
};

export default ProductTableRow;
