import { Link } from 'react-router-dom';
import { ShoppingBag } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const EmptyCart = () => {
  return (
    <div className="text-center py-12">
      <div className="inline-flex justify-center items-center w-20 h-20 rounded-full bg-gray-100 mb-4">
        <ShoppingBag size={32} className="text-gray-400" />
      </div>
      <h2 className="font-serif text-2xl mb-4">Your cart is empty</h2>
      <p className="text-gray-500 max-w-md mx-auto mb-6">
        Looks like you haven't added any products to your cart yet.
      </p>
      <Link to="/">
        <Button variant="outline" className="mt-2">
          Continue Shopping
        </Button>
      </Link>
    </div>
  );
};