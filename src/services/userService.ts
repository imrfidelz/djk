
import axios from 'axios';
import { API_BASE_URL } from './config';
import { User, CreateUserRequest, UpdateUserRequest } from '@/components/admin/types/user.types';


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

export const userService = {
  // Get all users
  getUsers: async (): Promise<{ success: boolean; data: User[]; pagination?: any }> => {
    const response = await apiClient.get('/users');
    return response.data;
  },

  // Get single user
  getUser: async (id: string): Promise<{ success: boolean; data: User }> => {
    const response = await apiClient.get(`/users/${id}`);
    return response.data;
  },

  // Create user
  createUser: async (userData: CreateUserRequest): Promise<{ success: boolean; data: User }> => {
    const response = await apiClient.post('/users', userData);
    return response.data;
  },

  // Update user
  updateUser: async (id: string, userData: UpdateUserRequest): Promise<{ success: boolean; data: User }> => {
    const response = await apiClient.put(`/users/${id}`, userData);
    return response.data;
  },

  // Delete user
  deleteUser: async (id: string): Promise<{ success: boolean; data: any }> => {
    const response = await apiClient.delete(`/users/${id}`);
    return response.data;
  },
};
