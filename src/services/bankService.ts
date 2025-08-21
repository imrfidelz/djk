import axios from 'axios';
import { API_BASE_URL } from './config';
import { Bank, BankFormData } from '@/components/admin/types/bank.types';


const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // For cookie-based auth
});

// Attach Authorization token to all requests if available
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token'); // or sessionStorage
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);


export const bankService = {
  getAll: async (): Promise<Bank[]> => {
    console.log('Fetching banks...');
    try {
      const { data } = await axiosInstance.get<{ data: Bank[] }>('/banks');
      console.log('Banks data:', data);
      return data.data || [];
    } catch (error: any) {
      console.error('Failed to fetch banks:', error.response?.data || error.message);
      throw new Error(`Failed to fetch banks: ${error.response?.statusText || error.message}`);
    }
  },

  getActiveBanks: async (): Promise<Bank[]> => {
    try {
      const { data } = await axiosInstance.get<{ data: Bank[] }>('/banks/active');
      return data.data || [];
    } catch (error: any) {
      throw new Error(`Failed to fetch active banks: ${error.response?.statusText || error.message}`);
    }
  },

  getById: async (id: string): Promise<Bank> => {
    try {
      const { data } = await axiosInstance.get<{ data: Bank }>(`/banks/${id}`);
      return data.data;
    } catch (error: any) {
      throw new Error(`Failed to fetch bank: ${error.response?.statusText || error.message}`);
    }
  },

  create: async (bankData: BankFormData): Promise<Bank> => {
    try {
      const { data } = await axiosInstance.post<{ data: Bank }>('/banks', bankData);
      return data.data;
    } catch (error: any) {
      throw new Error(`Failed to create bank: ${error.response?.statusText || error.message}`);
    }
  },

  update: async (id: string, bankData: Partial<BankFormData>): Promise<Bank> => {
    try {
      const { data } = await axiosInstance.put<{ data: Bank }>(`/banks/${id}`, bankData);
      return data.data;
    } catch (error: any) {
      throw new Error(`Failed to update bank: ${error.response?.statusText || error.message}`);
    }
  },

  delete: async (id: string): Promise<void> => {
    try {
      await axiosInstance.delete(`/banks/${id}`);
    } catch (error: any) {
      throw new Error(`Failed to delete bank: ${error.response?.statusText || error.message}`);
    }
  },
};
