
import { useState, useEffect, createContext, useContext, ReactNode } from 'react';
import { cartService } from '@/services/cartService';

interface CartContextType {
  cartCount: number;
  updateCartCount: () => Promise<void>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cartCount, setCartCount] = useState(0);

  const updateCartCount = async () => {
    try {
      const count = await cartService.getCartItemsCount();
      setCartCount(count);
    } catch (error) {
      console.error('Failed to update cart count:', error);
    }
  };

  useEffect(() => {
    updateCartCount();
  }, []);

  // Listen for cart change events for instant badge updates
  useEffect(() => {
    const handleDelta = (e: Event) => {
      const detail = (e as CustomEvent<{ delta: number }>).detail;
      if (!detail) return;
      setCartCount((prev) => Math.max(0, prev + detail.delta));
    };
    
    const handleSet = (e: Event) => {
      const detail = (e as CustomEvent<{ count: number }>).detail;
      if (detail && typeof detail.count === 'number') {
        setCartCount(Math.max(0, detail.count));
      }
    };

    // Handle cart updates by refreshing the count from source
    const handleUpdate = () => {
      updateCartCount();
    };

    window.addEventListener('cart:delta', handleDelta as EventListener);
    window.addEventListener('cart:set', handleSet as EventListener);
    window.addEventListener('cart:update', handleUpdate as EventListener);

    return () => {
      window.removeEventListener('cart:delta', handleDelta as EventListener);
      window.removeEventListener('cart:set', handleSet as EventListener);
      window.removeEventListener('cart:update', handleUpdate as EventListener);
    };
  }, []);

  return (
    <CartContext.Provider value={{ cartCount, updateCartCount }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
