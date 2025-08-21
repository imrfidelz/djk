
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useCart } from '@/hooks/useCart';
import { cartService } from '@/services/cartService';
import { productService } from '@/services/productService';
import { formatCurrency } from '@/lib/currency';

interface ProductCardProps {
  id: string;
  name: string;
  price: number;
  image: string;
  category: string;
}

const ProductCard = ({ id, name, price, image, category }: ProductCardProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { updateCartCount } = useCart();

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    setIsLoading(true);
    try {
      // Validate against stock across all variants currently in cart
      const product = await productService.getById(id);
      const currentTotal = await cartService.getTotalQuantityForProduct(id);
      const remaining = Math.max(0, product.stock - currentTotal);

      if (remaining <= 0) {
        toast({
          title: 'Stock limit reached',
          description: `You already have the maximum available quantity (${product.stock}) of this product in your cart.`,
        });
        return;
      }

      await cartService.addToCart({ id, name, price, image }, 1);
      await updateCartCount();
      
      toast({
        title: 'Added to cart',
        description: `${name} has been added to your cart.`,
      });
    } catch (error) {
      console.error('Failed to add to cart:', error);
      toast({
        title: 'Error',
        description: 'Failed to add item to cart. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Link 
      to={`/product/${id}`} 
      className="group block"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative overflow-hidden bg-gray-50 aspect-square">
        <img 
          src={image} 
          alt={name}
          className={`w-full h-full object-cover transition-transform duration-700 ${
            isHovered ? 'scale-105' : 'scale-100'
          }`} 
        />
        <div className={`absolute bottom-0 left-0 right-0 p-3 bg-white bg-opacity-90 backdrop-blur-sm transform transition-transform duration-300 ${
          isHovered ? 'translate-y-0' : 'translate-y-full'
        }`}>
          <button 
            onClick={handleAddToCart}
            disabled={isLoading}
            className="w-full flex items-center justify-center gap-2 py-2 bg-luxury-gold text-white hover:bg-opacity-90 transition-colors disabled:opacity-50"
          >
            <ShoppingBag size={16} />
            <span className="text-sm font-medium">
              {isLoading ? 'Adding...' : 'Add to Cart'}
            </span>
          </button>
        </div>
      </div>
      
      <div className="mt-3 text-center">
        <h3 className="font-sans text-sm uppercase tracking-wider text-gray-500">{category}</h3>
        <h2 className="font-serif text-base mt-1">{name}</h2>
        <p className="mt-1 font-medium">{formatCurrency(price)}</p>
      </div>
    </Link>
  );
};

export default ProductCard;
