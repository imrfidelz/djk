import axios from 'axios';
import { API_BASE_URL } from './config';

export interface DashboardStats {
  totalProducts: number;
  totalOrders: number;
  totalRevenue: number;
  totalUsers: number;
}

export interface SalesAnalytics {
  salesData: Array<{
    month: string;
    sales: number;
    revenue: number;
  }>;
  topProducts: Array<{
    name: string;
    sales: number;
  }>;
}

export interface RecentUpdate {
  id: string;
  user: string;
  action: string;
  item: string;
  time: string; // ISO date string
  color?: string;
}

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'Cache-Control': 'no-cache', // ensures fresh data
  },
  withCredentials: true,
});

// Attach token
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

export const dashboardService = {
  getStats: async (): Promise<DashboardStats> => {
    try {
      const response = await axiosInstance.get('/dashboard/stats');
      return response.data.data || {
        totalProducts: 0,
        totalOrders: 0,
        totalRevenue: 0,
        totalUsers: 0,
      };
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message || 'Failed to fetch dashboard stats'
      );
    }
  },

  getAnalytics: async (): Promise<SalesAnalytics> => {
    try {
      const response = await axiosInstance.get('/dashboard/analytics');
      return response.data.data || {
        salesData: [],
        topProducts: [],
      };
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message || 'Failed to fetch sales analytics'
      );
    }
  },

  getRecentUpdates: async (): Promise<RecentUpdate[]> => {
    try {
      const response = await axiosInstance.get('/dashboard/recent-updates');
      return response.data.data || [];
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message || 'Failed to fetch recent updates'
      );
    }
  },
};
