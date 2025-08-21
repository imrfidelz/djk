
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { DialogFooter } from '@/components/ui/dialog';
import { Image } from 'lucide-react';
import { Product, mockBrands, mockCategories } from '../types/product.types';
import { formatCurrency } from '@/lib/currency';

interface ProductViewProps {
  product: Product;
  onClose: () => void;
  onEdit: (product: Product) => void;
}

const ProductView: React.FC<ProductViewProps> = ({ product, onClose, onEdit }) => {
  // Get category name by id
  const getCategoryName = (categoryId: string) => {
    const category = mockCategories.find(c => c.id === categoryId);
    return category ? category.name : 'Unknown';
  };

  // Get brand name by id
  const getBrandName = (brandId: string) => {
    const brand = mockBrands.find(b => b.id === brandId);
    return brand ? brand.name : 'Unknown';
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Product Image */}
        <div className="space-y-4">
          <div className="aspect-square bg-gray-100 rounded-md flex items-center justify-center">
            <Image className="w-16 h-16 text-gray-400" />
          </div>
          
          <div className="grid grid-cols-4 gap-2">
            {product.images.map((image, index) => (
              <div key={index} className="aspect-square bg-gray-100 rounded-md flex items-center justify-center">
                <Image className="w-6 h-6 text-gray-400" />
              </div>
            ))}
          </div>
        </div>

        {/* Product Information */}
        <div className="space-y-4">
          <div>
            <h2 className="text-xl font-semibold">{product.name}</h2>
            <p className="text-lg font-bold text-luxury-gold mt-1">
              {formatCurrency(product.price)}
            </p>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Brand:</span>
              <span>{getBrandName(product.brand)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Category:</span>
              <span>{getCategoryName(product.category)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Stock:</span>
              <span>{product.stock} units</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Sold:</span>
              <span>{product.sold_out} units</span>
            </div>
            
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Status:</span>
              <Badge 
                variant={product.status === 'Active' ? 'default' : 'destructive'}
                className={
                  product.status === 'Active' 
                    ? 'bg-green-100 text-green-800 hover:bg-green-100 border border-green-200' 
                    : 'bg-red-100 text-red-800 hover:bg-red-100 border border-red-200'
                }
              >
                {product.status}
              </Badge>
            </div>
          </div>

          {/* Product flags */}
          <div className="flex flex-wrap gap-2">
            {product.isLive && <Badge variant="outline">Live</Badge>}
            {product.isMain && <Badge variant="outline">Main</Badge>}
            {product.isFeatured && <Badge variant="outline">Featured</Badge>}
            {product.isHotDeal && <Badge variant="outline">Hot Deal</Badge>}
          </div>
        </div>
      </div>

      {/* Description & Specifications */}
      <div className="space-y-4">
        <Card>
          <CardContent className="pt-6">
            <h3 className="font-medium mb-2">Description</h3>
            <p className="text-sm text-muted-foreground">{product.description}</p>
          </CardContent>
        </Card>
      </div>

      {/* Sizes */}
      {product.size && product.size.length > 0 && (
        <Card>
          <CardContent className="pt-6">
            <h3 className="font-medium mb-2">Available Sizes</h3>
            <div className="flex flex-wrap gap-2">
              {product.size.map((size, index) => (
                <Badge key={index} variant="secondary">{size.label}</Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Colors */}
      {product.color && product.color.length > 0 && (
        <Card>
          <CardContent className="pt-6">
            <h3 className="font-medium mb-2">Available Colors</h3>
            <div className="flex flex-wrap gap-2">
              {product.color.map((color, index) => (
                <Badge key={index} variant="secondary">{color.label}</Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Specifications */}
      {product.specifications && product.specifications.length > 0 && (
        <Card>
          <CardContent className="pt-6">
            <h3 className="font-medium mb-2">Specifications</h3>
            <div className="space-y-2">
              {product.specifications.map((spec, index) => (
                <div key={index} className="flex justify-between border-b pb-1 last:border-0">
                  <span className="font-medium">{spec.label}</span>
                  <span>{spec.value}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      <DialogFooter>
        <Button variant="outline" onClick={onClose}>
          Close
        </Button>
        <Button onClick={() => onEdit(product)}>
          Edit Product
        </Button>
      </DialogFooter>
    </div>
  );
};

export default ProductView;
