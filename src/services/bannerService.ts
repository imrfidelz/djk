
import axios from 'axios';
import { API_BASE_URL } from './config';
import { Banner } from '@/components/admin/types/banner.types';

// Create a pre-configured Axios instance
const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
});

// Attach Authorization token to all requests if available
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Banner Service Object
export const bannerService = {
  // Fetch all banners
  getAll: async (): Promise<Banner[]> => {
    try {
      console.log('Fetching banners...');
      const { data } = await axiosInstance.get<{ success: boolean; data: Banner[] }>('/banners');
      console.log('Banners data:', data);
      return data.data || [];
    } catch (error: any) {
      console.error('Failed to fetch banners:', error);
      throw new Error(`Failed to fetch banners: ${error.response?.data?.message || error.message}`);
    }
  },

  // Fetch single banner by ID
  getById: async (id: string): Promise<Banner> => {
    try {
      const { data } = await axiosInstance.get<{ success: boolean; data: Banner }>(`/banners/${id}`);
      return data.data;
    } catch (error: any) {
      console.error('Failed to fetch banner:', error);
      throw new Error(`Failed to fetch banner: ${error.response?.data?.message || error.message}`);
    }
  },

  // Create a new banner (FormData required for image upload)
  create: async (bannerData: FormData): Promise<Banner> => {
    try {
      const { data } = await axiosInstance.post<{ success: boolean; data: Banner }>('/banners', bannerData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return data.data;
    } catch (error: any) {
      console.error('Failed to create banner:', error);
      throw new Error(`Failed to create banner: ${error.response?.data?.message || error.message}`);
    }
  },

  // Update existing banner (FormData required for image update)
  update: async (id: string, bannerData: FormData): Promise<Banner> => {
    try {
      const { data } = await axiosInstance.put<{ success: boolean; data: Banner }>(`/banners/${id}`, bannerData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return data.data;
    } catch (error: any) {
      console.error('Failed to update banner:', error);
      throw new Error(`Failed to update banner: ${error.response?.data?.message || error.message}`);
    }
  },

  // Delete a banner
  delete: async (id: string): Promise<void> => {
    try {
      await axiosInstance.delete(`/banners/${id}`);
    } catch (error: any) {
      console.error('Failed to delete banner:', error);
      throw new Error(`Failed to delete banner: ${error.response?.data?.message || error.message}`);
    }
  },
};
