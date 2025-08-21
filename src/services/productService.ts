
import axios from 'axios';
import { API_BASE_URL } from './config';
import { Product } from '@/components/admin/types/product.types';

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
});

// ✅ Add Authorization header with token to all requests
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

const transformProduct = (backendProduct: any): Product => ({
  id: backendProduct._id || backendProduct.id,
  _id: backendProduct._id,
  name: backendProduct.name,
  description: backendProduct.description,
  images: backendProduct.images || [],
  mainImage: backendProduct.mainImage || '',
  brand: backendProduct.brand?._id || backendProduct.brand,
  price: backendProduct.price,
  stock: backendProduct.stock,
  sold_out: backendProduct.sold_out || 0,
  size: backendProduct.size || [],
  specifications: backendProduct.specifications || [],
  color: backendProduct.color || [],
  isLive: backendProduct.isLive || false,
  isMain: backendProduct.isMain || false,
  isFeatured: backendProduct.isFeatured || false,
  isHotDeal: backendProduct.isHotDeal || false,
  liveAt: backendProduct.liveAt ? new Date(backendProduct.liveAt) : undefined,
  category: backendProduct.category?._id || backendProduct.category,
  slug: backendProduct.slug || '',
  status: backendProduct.stock > 0 ? 'Active' : 'Out of Stock',
  lastUpdated: backendProduct.updatedAt
    ? new Date(backendProduct.updatedAt).toISOString().split('T')[0]
    : new Date().toISOString().split('T')[0],
});

export const productService = {
  getAll: async (): Promise<Product[]> => {
    try {
      const response = await axiosInstance.get('/products');
      const products = response.data.data || [];
      return products.map(transformProduct);
    } catch (error: any) {
      console.error('Error fetching all products:', error);
      throw new Error(error.response?.data?.message || 'Failed to fetch products');
    }
  },

  getLive: async (): Promise<Product[]> => {
    try {
      console.log('Attempting to fetch live products from:', `${API_BASE_URL}/products/live`);
      const response = await axiosInstance.get('/products/live');
      console.log('Response received:', response.data);
      const products = response.data.data || [];
      console.log('Products to transform:', products.length);
      return products.map(transformProduct);
    } catch (error: any) {
      console.error('Error fetching live products:', error);
      console.error('Error response:', error.response?.data);
      console.error('Error status:', error.response?.status);
      throw new Error(error.response?.data?.message || 'Failed to fetch live products');
    }
  },

  getById: async (id: string): Promise<Product> => {
    try {
      const response = await axiosInstance.get(`/products/${id}`);
      return transformProduct(response.data.data);
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to fetch product');
    }
  },

  create: async (productData: FormData): Promise<Product> => {
    try {
      const response = await axiosInstance.post('/products', productData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return transformProduct(response.data.data);
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to create product');
    }
  },

  update: async (id: string, productData: FormData): Promise<Product> => {
    try {
      const response = await axiosInstance.put(`/products/${id}`, productData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return transformProduct(response.data.data);
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to update product');
    }
  },

  delete: async (id: string): Promise<void> => {
    try {
      await axiosInstance.delete(`/products/${id}`);
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to delete product');
    }
  },
};
