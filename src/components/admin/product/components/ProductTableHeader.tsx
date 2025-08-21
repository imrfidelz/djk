
import React from 'react';
import { TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Checkbox } from '@/components/ui/checkbox';

const ProductTableHeader: React.FC = () => {
  return (
    <TableHeader>
      <TableRow className="bg-card">
        <TableHead className="w-12 hidden sm:table-cell">
          <Checkbox />
        </TableHead>
        <TableHead>Product</TableHead>
        <TableHead className="hidden md:table-cell">Category</TableHead>
        <TableHead>Price</TableHead>
        <TableHead className="hidden sm:table-cell">Stock</TableHead>
        <TableHead className="hidden md:table-cell">Status</TableHead>
        <TableHead className="hidden lg:table-cell">Last Updated</TableHead>
        <TableHead className="text-right">Actions</TableHead>
      </TableRow>
    </TableHeader>
  );
};

export default ProductTableHeader;
