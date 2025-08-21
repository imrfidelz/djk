
import React from 'react';
import { Badge } from '@/components/ui/badge';

interface ProductStatusBadgeProps {
  status: 'Active' | 'Out of Stock' | 'Draft';
}

const ProductStatusBadge: React.FC<ProductStatusBadgeProps> = ({ status }) => {
  return (
    <Badge 
      variant={status === 'Active' ? 'default' : 'destructive'}
      className={
        status === 'Active' 
          ? 'bg-green-100 text-green-800 hover:bg-green-100 border border-green-200' 
          : 'bg-red-100 text-red-800 hover:bg-red-100 border border-red-200'
      }
    >
      {status}
    </Badge>
  );
};

export default ProductStatusBadge;
