import axios from 'axios';
import { API_BASE_URL } from './config';


export interface Category {
  id: string;
  name: string;
  description: string;
  image?: string;
  productCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface CategoryFormData {
  name: string;
  description: string;
  image?: File | null;
}

const transformCategory = (backendCategory: any): Category => ({
  id: backendCategory._id || backendCategory.id,
  name: backendCategory.name,
  description: backendCategory.description || '',
  image: backendCategory.image || '',
  productCount: backendCategory.productCount || 0,
  createdAt: backendCategory.createdAt,
  updatedAt: backendCategory.updatedAt,
});

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true, // replaces credentials: 'include'
  headers: {
    'Content-Type': 'application/json',
  },
});


// ✅ Add Authorization header with token to all requests
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token'); // adjust if you store it elsewhere
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);


export const categoryService = {
  getAll: async (): Promise<Category[]> => {
    const res = await axiosInstance.get('/categories');
    const categories = res.data.data || [];
    return categories.map(transformCategory);
  },

  getById: async (id: string): Promise<Category> => {
    const res = await axiosInstance.get(`/categories/${id}`);
    return transformCategory(res.data.data);
  },

  create: async (categoryData: CategoryFormData): Promise<Category> => {
    try {
      const formData = new FormData();
      formData.append('name', categoryData.name);
      formData.append('description', categoryData.description);
      
      if (categoryData.image) {
        formData.append('image', categoryData.image);
      }

      const res = await axiosInstance.post('/categories', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return transformCategory(res.data.data);
    } catch (err: any) {
      throw new Error(err.response?.data?.error || 'Failed to create category');
    }
  },

  update: async (id: string, categoryData: CategoryFormData): Promise<Category> => {
    try {
      const formData = new FormData();
      formData.append('name', categoryData.name);
      formData.append('description', categoryData.description);
      
      if (categoryData.image) {
        formData.append('image', categoryData.image);
      }

      const res = await axiosInstance.put(`/categories/${id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return transformCategory(res.data.data);
    } catch (err: any) {
      throw new Error(err.response?.data?.error || 'Failed to update category');
    }
  },

  delete: async (id: string): Promise<void> => {
    try {
      await axiosInstance.delete(`/categories/${id}`);
    } catch (err: any) {
      throw new Error(err.response?.data?.error || 'Failed to delete category');
    }
  },
};
