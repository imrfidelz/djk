import axios from 'axios';
import { API_BASE_URL } from './config';
import { Order } from '@/components/admin/types/order.types';


const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
    'Cache-Control': 'no-cache',
  },
});

// Attach Authorization token from localStorage for protected admin routes
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      if (!config.headers) {
        config.headers = {} as any;
      }
      (config.headers as any).Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);


export const orderService = {
  getAll: async (): Promise<Order[]> => {
    try {
      const response = await axiosInstance.get('/orders');
      return response.data.data || [];
    } catch (error: any) {
      if (error?.response?.status === 404) return [];
      throw new Error(error.response?.data?.message || 'Failed to fetch orders');
    }
  },

  getMine: async (): Promise<Order[]> => {
    try {
      const response = await axiosInstance.get('/orders/myorders');
      return response.data.orders || response.data.data || [];
    } catch (error: any) {
      if (error?.response?.status === 404) return [];
      throw new Error(error.response?.data?.message || 'Failed to fetch your orders');
    }
  },

  getById: async (id: string): Promise<Order> => {
    try {
      const response = await axiosInstance.get(`/orders/${id}`);
      return response.data.data || response.data.order;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to fetch order');
    }
  },

  updateStatus: async (id: string, status: string): Promise<Order> => {
    try {
      const response = await axiosInstance.put(`/orders/${id}/status`, { status });
      return response.data.data || response.data.order;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to update order status');
    }
  },

  markAsPaid: async (id: string): Promise<Order> => {
    try {
      const response = await axiosInstance.put(`/orders/${id}/paid`);
      return response.data.data || response.data.order;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to mark order as paid');
    }
  },
};
