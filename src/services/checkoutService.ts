
import axios from 'axios';
import { API_BASE_URL } from './config';

export interface OrderRequest {
  paymentMethod: 'FlutterWave' | 'Bank Transfer' | 'Cash On Delivery';
  shippingAddress: {
    address: string;
    apartment?: string;
    state: string;
    city: string;
    country: string;
    postalCode: string;
  };
  customerInformation: {
    name: string;
    email: string;
    phoneNumber: string;
  };
  additionalInformation?: string;
  currency?: string;
  city: { price: number };
  paymentProof?: string;
}

export interface OrderResponse {
  success: boolean;
  order?: any;
  paymentMethod?: string;
  paymentLink?: string;
  tx_ref?: string;
  nextSteps?: string;
  message?: string;
}

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

class CheckoutService {
  private getAuthHeaders() {
    const token = localStorage.getItem('token');
    return {
      Authorization: `Bearer ${token}`,
    };
  }

  async createOrder(orderData: OrderRequest): Promise<OrderResponse> {
    try {
      console.log('Creating order with data:', orderData);
      const res = await axiosInstance.post('/orders', orderData, {
        headers: this.getAuthHeaders(),
      });
      console.log('Order creation response:', res.data);
      
      // Ensure we return the correct structure for FlutterWave
      if (orderData.paymentMethod === 'FlutterWave' && res.data.paymentLink) {
        return {
          success: true,
          paymentMethod: res.data.paymentMethod,
          paymentLink: res.data.paymentLink,
          tx_ref: res.data.tx_ref,
          order: res.data.order
        };
      }
      
      return res.data;
    } catch (err: any) {
      console.error('Order creation error:', err.response?.data || err.message);
      const errorMessage = err.response?.data?.message || err.response?.data?.error || 'Failed to create order';
      throw new Error(errorMessage);
    }
  }

  async getOrderById(orderId: string): Promise<any> {
    try {
      const res = await axiosInstance.get(`/orders/${orderId}`, {
        headers: this.getAuthHeaders(),
      });
      return res.data.order;
    } catch (err: any) {
      throw new Error(err.response?.data?.message || 'Failed to fetch order');
    }
  }

  async getMyOrders(): Promise<any[]> {
    try {
      const res = await axiosInstance.get('/orders/myorders', {
        headers: this.getAuthHeaders(),
      });
      return res.data.orders || [];
    } catch (err: any) {
      throw new Error(err.response?.data?.message || 'Failed to fetch orders');
    }
  }
}

export const checkoutService = new CheckoutService();
