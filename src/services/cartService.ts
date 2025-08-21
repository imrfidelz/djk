
import axios from 'axios';
import { API_BASE_URL } from './config';

export interface CartItem {
  product: string;
  quantity: number;
}

export interface Cart {
  id?: string;
  user?: string;
  items: CartItem[];
  totalPrice: number;
}

export interface LocalCartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
  size?: string | null;
  color?: string | null;
}

class CartService {
  private cachedUserId: string | null = localStorage.getItem('userId');

  private get token(): string | null {
    return localStorage.getItem('token');
  }

  private get headers() {
    return {
      Authorization: `Bearer ${this.token}`,
      'Content-Type': 'application/json',
    };
  }

  // Updated optimistic update events for proper cart count management
  private emitCartUpdate() {
    // Emit a general cart update event that triggers a full refresh
    try {
      window.dispatchEvent(new CustomEvent('cart:update'));
    } catch {}
  }

  private emitDelta(delta: number) {
    try {
      window.dispatchEvent(new CustomEvent('cart:delta', { detail: { delta } }));
    } catch {}
  }

  private emitSet(count: number) {
    try {
      window.dispatchEvent(new CustomEvent('cart:set', { detail: { count } }));
    } catch {}
  }

  isAuthenticated(): boolean {
    return !!this.token;
  }

  private async getUserId(): Promise<string> {
    if (this.cachedUserId) return this.cachedUserId;

    const stored = localStorage.getItem('userId');
    if (stored) {
      this.cachedUserId = stored;
      return stored;
    }

    const res = await axios.get(`${API_BASE_URL}/auth/me`, {
      headers: this.headers,
    });
    console.log('Full auth/me response:', res.data);

    const userId = res.data.data?.id || res.data.data?._id;
    console.log('Extracted user ID:', userId);

    if (!userId) {
      throw new Error('Unable to get user ID from response');
    }

    this.cachedUserId = userId;
    localStorage.setItem('userId', userId);
    return userId;
  }

  async addToBackendCart(productId: string, quantity = 1, size?: string | null, color?: string | null): Promise<Cart> {
    if (!this.token) throw new Error('Not authenticated');

    // Prevent negative quantities from being sent to backend
    if (quantity === 0) {
      console.log('Skipping zero quantity request');
      return await this.getBackendCart() as Cart;
    }

    console.log('Adding to backend cart:', { productId, quantity, size, color });
    
    const userId = await this.getUserId();
    console.log('User ID:', userId);
    
    const requestData = {
      user: userId,
      items: [{ 
        product: productId, 
        quantity,
        size: size || null,
        color: color || null
      }],
    };
    
    console.log('Request data:', requestData);

    try {
      const res = await axios.post(
        `${API_BASE_URL}/carts`,
        requestData,
        { headers: this.headers }
      );

      // After successful backend update, trigger cart count refresh
      this.emitCartUpdate();
      
      return res.data.data;
    } catch (error) {
      throw error;
    }
  }

  async getBackendCart(): Promise<Cart | null> {
    if (!this.token) return null;

    try {
      const userId = await this.getUserId();
      const res = await axios.get(`${API_BASE_URL}/carts/${userId}`, {
        headers: this.headers,
      });

      return res.data.data[0] || null;
    } catch (err: any) {
      if (err.response?.status === 404) return null;
      console.error('Error fetching backend cart:', err);
      return null;
    }
  }

  async clearBackendCart(): Promise<void> {
    const cart = await this.getBackendCart();
    if (!cart?.id) return;

    await axios.delete(`${API_BASE_URL}/carts/${cart.id}`, {
      headers: this.headers,
    });
    
    // Trigger cart count refresh after clearing
    this.emitCartUpdate();
  }

  getLocalCart(): LocalCartItem[] {
    const cart = localStorage.getItem('cart');
    return cart ? JSON.parse(cart) : [];
  }

  addToLocalCart(product: { id: string; name: string; price: number; image: string; size?: string | null; color?: string | null }, quantity = 1): void {
    const cart = this.getLocalCart();
    const existing = cart.find(i => 
      i.id === product.id && 
      i.size === product.size && 
      i.color === product.color
    );

    if (existing) {
      existing.quantity += quantity;
    } else {
      cart.push({ ...product, quantity });
    }

    localStorage.setItem('cart', JSON.stringify(cart));

    // Only emit delta for actual additions, not updates
    if (quantity > 0) this.emitDelta(quantity);
  }

  updateLocalCartQuantity(productId: string, quantity: number): void {
    let cart = this.getLocalCart();
    const prevItem = cart.find(i => i.id === productId);
    const prevQty = prevItem?.quantity ?? 0;

    if (quantity <= 0) {
      cart = cart.filter(i => i.id !== productId);
    } else {
      if (prevItem) {
        prevItem.quantity = quantity;
      }
    }

    localStorage.setItem('cart', JSON.stringify(cart));

    const diff = quantity <= 0 ? -prevQty : (prevItem ? quantity - prevQty : 0);
    if (diff) this.emitDelta(diff);
  }

  removeFromLocalCart(productId: string): void {
    const cart = this.getLocalCart();
    const item = cart.find(i => i.id === productId);
    const remaining = cart.filter(i => i.id !== productId);
    localStorage.setItem('cart', JSON.stringify(remaining));

    const qty = item?.quantity ?? 0;
    if (qty) this.emitDelta(-qty);
  }

  clearLocalCart(silent: boolean = false): void {
    const totalQty = this.getLocalCart().reduce((sum, i) => sum + i.quantity, 0);
    localStorage.removeItem('cart');
    if (!silent && totalQty) this.emitDelta(-totalQty);
  }

  getLocalCartTotal(): number {
    return this.getLocalCart().reduce((sum, item) => sum + item.price * item.quantity, 0);
  }

  async addToCart(product: { id: string; name: string; price: number; image: string; size?: string | null; color?: string | null }, quantity = 1): Promise<void> {
    if (this.isAuthenticated()) {
      await this.addToBackendCart(product.id, quantity, product.size, product.color);
    } else {
      this.addToLocalCart(product, quantity);
    }
  }

  async getCartItemsCount(): Promise<number> {
    if (this.isAuthenticated()) {
      const cart = await this.getBackendCart();
      // Only count positive quantities and filter out null products
      return cart?.items
        .filter(item => item.product && item.quantity > 0)
        .reduce((sum, i) => sum + Math.max(0, i.quantity), 0) || 0;
    } else {
      return this.getLocalCart()
        .filter(item => item.quantity > 0)
        .reduce((sum, i) => sum + Math.max(0, i.quantity), 0);
    }
  }

  // Total quantity of a product across all its variants currently in the cart
  async getTotalQuantityForProduct(productId: string): Promise<number> {
    if (this.isAuthenticated()) {
      const cart = await this.getBackendCart();
      if (!cart?.items?.length) return 0;
      return cart.items
        .filter((item: any) => {
          const prod = item.product as any;
          // Handle both populated objects and string IDs
          return (typeof prod === 'string' && prod === productId) || (prod && prod._id === productId);
        })
        .reduce((sum: number, i: any) => sum + Math.max(0, Number(i.quantity || 0)), 0);
    } else {
      return this.getLocalCart()
        .filter(i => i.id === productId && i.quantity > 0)
        .reduce((sum, i) => sum + Math.max(0, i.quantity), 0);
    }
  }

  async migrateLocalCartToBackend(): Promise<void> {
    const localCart = this.getLocalCart();
    if (!localCart.length) return;

    try {
      for (const item of localCart) {
        await this.addToBackendCart(item.id, item.quantity, item.size, item.color);
      }
      this.clearLocalCart(true);
    } catch (error) {
      console.error('Failed to migrate cart to backend:', error);
    }
  }
}

export const cartService = new CartService();
