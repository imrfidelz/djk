
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Minus, Plus } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { cartService, LocalCartItem } from '@/services/cartService';
import { productService } from '@/services/productService';
import { formatCurrency } from '@/lib/currency';
import { CartSkeleton } from '@/components/cart/CartSkeleton';
import { CartSteps } from '@/components/cart/CartSteps';
import { EmptyCart } from '@/components/cart/EmptyCart';
import { CartSummary } from '@/components/cart/CartSummary';

interface BackendCartItem {
  _id: string;
  product: {
    _id: string;
    name: string;
    price: number;
    mainImage: string;
  };
  quantity: number;
  size?: string;
  color?: string;
}

interface BackendCart {
  _id: string;
  user: string;
  items: BackendCartItem[];
  totalPrice: number;
}

const Cart = () => {
  const [cartItems, setCartItems] = useState<LocalCartItem[]>([]);
  const [backendCart, setBackendCart] = useState<BackendCart | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    loadCartItems();
  }, []);

  const loadCartItems = async () => {
    try {
      if (cartService.isAuthenticated()) {
        console.log('Loading backend cart...');
        const cart = await cartService.getBackendCart();
        console.log('Backend cart response:', cart);
        
        if (cart?.items && cart.items.length > 0) {
          // Type assertion since we know the backend returns populated products
          const backendCartData = cart as unknown as BackendCart;
          setBackendCart(backendCartData);
          
          // Convert backend cart items to display format, filtering out items with null products
          const displayItems: LocalCartItem[] = backendCartData.items
            .filter((item: BackendCartItem) => item.product !== null)
            .map((item: BackendCartItem) => ({
              id: item.product._id,
              name: item.product.name,
              price: item.product.price,
              quantity: item.quantity,
              image: item.product.mainImage || '/placeholder.svg',
              size: item.size,
              color: item.color
            }));
          setCartItems(displayItems);
        } else {
          setCartItems([]);
          setBackendCart(null);
        }
      } else {
        const localCart = cartService.getLocalCart();
        setCartItems(localCart);
      }
    } catch (error) {
      console.error('Failed to load cart:', error);
      toast({
        title: "Error",
        description: "Failed to load cart items.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Calculate cart totals
  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const total = subtotal;

  const updateQuantity = async (id: string, desiredQuantity: number, size?: string | null, color?: string | null) => {
    // Prevent negative quantities
    if (desiredQuantity < 1) {
      await removeItem(id, size, color);
      return;
    }

    try {
      const currentItem = cartItems.find(
        (item) => item.id === id && item.size === size && item.color === color
      );
      const currentQty = currentItem?.quantity ?? 0;

      // If user is decreasing or keeping the same, allow without stock validation
      if (desiredQuantity <= currentQty) {
        if (cartService.isAuthenticated()) {
          if (currentItem && currentItem.quantity !== desiredQuantity) {
            setCartItems((items) =>
              items.map((item) =>
                item.id === id && item.size === size && item.color === color
                  ? { ...item, quantity: desiredQuantity }
                  : item
              )
            );
            await cartService.addToBackendCart(id, -currentItem.quantity, size, color);
            await cartService.addToBackendCart(id, desiredQuantity, size, color);
          }
        } else {
          setCartItems((items) =>
            items.map((item) =>
              item.id === id && item.size === size && item.color === color
                ? { ...item, quantity: desiredQuantity }
                : item
            )
          );
          cartService.updateLocalCartQuantity(id, desiredQuantity);
        }
        return;
      }

      // Otherwise, user is increasing - validate against total stock across all variants of the same product id
      const product = await productService.getById(id);
      const sumOtherVariants = cartItems
        .filter((i) => i.id === id && !(i.size === size && i.color === color))
        .reduce((sum, i) => sum + i.quantity, 0);

      const maxForThisItem = Math.max(0, product.stock - sumOtherVariants);
      let newQuantity = Math.min(desiredQuantity, maxForThisItem);

      if (newQuantity < desiredQuantity) {
        if (maxForThisItem === 0) {
          toast({
            title: 'Stock limit reached',
            description: `You already have the maximum available quantity (${product.stock}) of this product in your cart across variants.`,
          });
          return; // Do not increase beyond current
        } else {
          toast({
            title: 'Limited stock',
            description: `Only ${maxForThisItem} left across all variants. Quantity adjusted.`,
          });
        }
      }

      if (cartService.isAuthenticated()) {
        if (currentItem) {
          if (currentItem.quantity === newQuantity) return; // No change needed

          // Optimistic UI update for the specific item
          setCartItems((items) =>
            items.map((item) =>
              item.id === id && item.size === size && item.color === color
                ? { ...item, quantity: newQuantity }
                : item
            )
          );

          // For backend, set exact quantity
          await cartService.addToBackendCart(id, -currentItem.quantity, size, color); // Remove current
          await cartService.addToBackendCart(id, newQuantity, size, color); // Add new quantity
        }
      } else {
        // Local cart fallback: update only the specific variant in UI
        setCartItems((items) =>
          items.map((item) =>
            item.id === id && item.size === size && item.color === color
              ? { ...item, quantity: newQuantity }
              : item
          )
        );
        // Persist a best-effort update using existing cartService API (may affect other variants if they share the same id)
        cartService.updateLocalCartQuantity(id, newQuantity);
      }
    } catch (error) {
      console.error('Failed to update quantity:', error);
      // Revert UI on error by reloading from source of truth
      await loadCartItems();
      toast({
        title: 'Error',
        description: 'Failed to update quantity.',
        variant: 'destructive',
      });
    }
  };

  const removeItem = async (id: string, size?: string | null, color?: string | null) => {
    try {
      if (cartService.isAuthenticated()) {
        const currentItem = cartItems.find(item => 
          item.id === id && 
          item.size === size && 
          item.color === color
        );
        
        if (currentItem) {
          // Optimistic remove for the specific item
          const prevItems = cartItems;
          setCartItems(items => items.filter(item => 
            !(item.id === id && item.size === size && item.color === color)
          ));

          try {
            await cartService.addToBackendCart(id, -currentItem.quantity, size, color);
          } catch (err) {
            // Revert on failure
            setCartItems(prevItems);
            throw err;
          }
        }
      } else {
        cartService.removeFromLocalCart(id);
        setCartItems(items => items.filter(item => item.id !== id));
      }
      
      toast({
        title: "Item removed",
        description: "The item has been removed from your cart.",
      });
    } catch (error) {
      console.error('Failed to remove item:', error);
      toast({
        title: "Error",
        description: "Failed to remove item.",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <CartSkeleton />
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      
      <div className="container mx-auto px-4 py-12">
        <h1 className="font-serif text-3xl mb-8">Cart</h1>
        
        <CartSteps currentStep={1} />
        
        {cartItems.length === 0 ? (
          <EmptyCart />
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items Table */}
            <div className="lg:col-span-2">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Product</TableHead>
                      <TableHead className="text-right">Price</TableHead>
                      <TableHead className="text-center">Quantity</TableHead>
                      <TableHead className="text-right">Subtotal</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {cartItems.map((item, index) => (
                      <TableRow key={`${item.id}-${item.size}-${item.color}-${index}`}>
                        <TableCell>
                          <div className="flex items-center space-x-4">
                            <div className="relative w-16 h-16 bg-gray-50">
                              <img 
                                src={item.image} 
                                alt={item.name}
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <div>
                              <h3 className="font-medium">
                                <Link to={`/product/${item.id}`} className="hover:text-luxury-gold">
                                  {item.name}
                                </Link>
                              </h3>
                              {(item.size || item.color) && (
                                <div className="text-sm text-gray-500 mt-1">
                                  {item.size && <span>Size: {item.size}</span>}
                                  {item.size && item.color && <span> • </span>}
                                  {item.color && <span>Color: {item.color}</span>}
                                </div>
                              )}
                              <button 
                                onClick={() => removeItem(item.id, item.size, item.color)}
                                className="text-sm text-red-500 hover:underline mt-1"
                              >
                                Remove
                              </button>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          {formatCurrency(item.price)}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center justify-center border border-gray-300 mx-auto w-28">
                            <button 
                              onClick={() => updateQuantity(item.id, item.quantity - 1, item.size, item.color)}
                              className="w-8 h-8 flex items-center justify-center border-r border-gray-300 hover:bg-gray-50"
                            >
                              <Minus size={14} />
                            </button>
                            <span className="w-12 text-center">{item.quantity}</span>
                            <button 
                              onClick={() => updateQuantity(item.id, item.quantity + 1, item.size, item.color)}
                              className="w-8 h-8 flex items-center justify-center border-l border-gray-300 hover:bg-gray-50"
                            >
                              <Plus size={14} />
                            </button>
                          </div>
                        </TableCell>
                        <TableCell className="text-right font-medium">
                          {formatCurrency(item.price * item.quantity)}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
            
            <CartSummary subtotal={subtotal} total={total} />
          </div>
        )}
      </div>
      
      <Footer />
    </>
  );
};

export default Cart;
