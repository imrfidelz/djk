
import axios from 'axios';
import { API_BASE_URL } from './config';
import { Review, CreateReviewRequest, UpdateReviewRequest } from '@/components/admin/types/review.types';

// Get auth token from localStorage
const getAuthToken = () => {
  return localStorage.getItem('token');
};

// Create axios instance with auth
const apiClient = axios.create({
  baseURL: API_BASE_URL,
});

apiClient.interceptors.request.use((config) => {
  const token = getAuthToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const reviewService = {
  // Get all reviews
  getAll: async (): Promise<Review[]> => {
    try {
      const response = await apiClient.get('/reviews');
      return response.data.data || [];
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to fetch reviews');
    }
  },

  // Get single review
  getById: async (id: string): Promise<Review> => {
    try {
      const response = await apiClient.get(`/reviews/${id}`);
      return response.data.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to fetch review');
    }
  },

  // Create review for a product
  create: async (productId: string, reviewData: CreateReviewRequest): Promise<Review> => {
    try {
      const response = await apiClient.post(`/products/${productId}/reviews`, reviewData);
      return response.data.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to create review');
    }
  },

  // Update review
  update: async (id: string, reviewData: UpdateReviewRequest): Promise<Review> => {
    try {
      const response = await apiClient.put(`/reviews/${id}`, reviewData);
      return response.data.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to update review');
    }
  },

  // Delete review
  delete: async (id: string): Promise<void> => {
    try {
      await apiClient.delete(`/reviews/${id}`);
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to delete review');
    }
  },

  // Get reviews by product
  getByProduct: async (productId: string): Promise<Review[]> => {
    try {
      const response = await apiClient.get(`/products/${productId}/reviews`);
      return response.data.data || [];
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to fetch product reviews');
    }
  },
};
