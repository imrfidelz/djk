
import axios from 'axios';
import { API_BASE_URL } from './config';

export interface Brand {
  id: string;
  name: string;
  description: string;
  logo?: string;
  createdAt: string;
  updatedAt: string;
  isActive: boolean;
  productCount: number;
}

export interface BrandFormData {
  name: string;
  description: string;
  logo?: string;
  isActive: boolean;
}

const transformBrand = (backendBrand: any): Brand => ({
  id: backendBrand._id || backendBrand.id,
  name: backendBrand.name,
  description: backendBrand.description || '',
  logo: backendBrand.logo || '',
  createdAt: backendBrand.createdAt,
  updatedAt: backendBrand.updatedAt,
  isActive: backendBrand.isActive ?? true,
  productCount: backendBrand.productCount || 0,
});

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add Authorization header with token to all requests
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

export const brandService = {
  getAll: async (): Promise<Brand[]> => {
    const res = await axiosInstance.get('/brands');
    const brands = res.data.data || [];
    return brands.map(transformBrand);
  },

  getById: async (id: string): Promise<Brand> => {
    const res = await axiosInstance.get(`/brands/${id}`);
    return transformBrand(res.data.data);
  },

  create: async (brandData: BrandFormData): Promise<Brand> => {
    try {
      const res = await axiosInstance.post('/brands', brandData);
      return transformBrand(res.data.data);
    } catch (err: any) {
      throw new Error(err.response?.data?.error || 'Failed to create brand');
    }
  },

  update: async (id: string, brandData: Partial<BrandFormData>): Promise<Brand> => {
    try {
      const res = await axiosInstance.put(`/brands/${id}`, brandData);
      return transformBrand(res.data.data);
    } catch (err: any) {
      throw new Error(err.response?.data?.error || 'Failed to update brand');
    }
  },

  delete: async (id: string): Promise<void> => {
    try {
      await axiosInstance.delete(`/brands/${id}`);
    } catch (err: any) {
      throw new Error(err.response?.data?.error || 'Failed to delete brand');
    }
  },
};
