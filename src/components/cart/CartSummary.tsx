import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { formatCurrency } from '@/lib/currency';

interface CartSummaryProps {
  subtotal: number;
  total: number;
}

export const CartSummary = ({ subtotal, total }: CartSummaryProps) => {
  const [couponCode, setCouponCode] = useState('');
  const { toast } = useToast();

  const applyCoupon = () => {
    if (!couponCode.trim()) {
      toast({
        title: "Error",
        description: "Please enter a coupon code.",
        variant: "destructive",
      });
      return;
    }
    
    toast({
      title: "Invalid coupon",
      description: "The coupon code you entered is invalid or expired.",
      variant: "destructive",
    });
  };

  return (
    <div className="lg:col-span-1">
      <div className="border border-gray-200 p-6">
        <h2 className="font-serif text-xl mb-4">Cart Totals</h2>
        
        <div className="border-b border-gray-200 pb-4 mb-4">
          <div className="flex justify-between mb-2">
            <span className="text-gray-600">Subtotal</span>
            <span className="font-medium">{formatCurrency(subtotal)}</span>
          </div>
        </div>
        
        <div className="flex justify-between mb-6">
          <span className="font-medium">Total</span>
          <span className="font-medium text-lg">{formatCurrency(total)}</span>
        </div>
        
        {/* Coupon Code */}
        <div className="mb-6">
          <h3 className="text-sm mb-2">Have a coupon?</h3>
          <div className="flex space-x-2">
            <Input
              type="text"
              placeholder="Coupon code"
              value={couponCode}
              onChange={(e) => setCouponCode(e.target.value)}
              className="flex-grow"
            />
            <Button 
              variant="outline" 
              onClick={applyCoupon}
            >
              Apply
            </Button>
          </div>
        </div>
        
        <Link to="/checkout">
          <Button className="w-full bg-luxury-gold hover:bg-luxury-gold/90 text-white">
            Proceed to Checkout
          </Button>
        </Link>
      </div>
    </div>
  );
};