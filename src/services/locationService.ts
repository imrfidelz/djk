import axios from 'axios';
import { API_BASE_URL } from './config';
import { Country, State, City } from '@/components/admin/types/location.types';

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
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

export const locationService = {
  // Countries
  getCountries: async (): Promise<Country[]> => {
    try {
      const response = await axiosInstance.get('/countries');
      return response.data.data || [];
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to fetch countries');
    }
  },

  getCountryById: async (id: string): Promise<{ country: Country; states: State[]; cities: City[] }> => {
    try {
      const response = await axiosInstance.get(`/countries/${id}`);
      return response.data.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to fetch country');
    }
  },

  createCountry: async (countryData: { name: string; abrivation: string }): Promise<Country> => {
    try {
      const response = await axiosInstance.post('/countries', countryData);
      return response.data.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to create country');
    }
  },

  updateCountry: async (id: string, countryData: { name: string; abrivation: string }): Promise<Country> => {
    try {
      const response = await axiosInstance.put(`/countries/${id}`, countryData);
      return response.data.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to update country');
    }
  },

  deleteCountry: async (id: string): Promise<void> => {
    try {
      await axiosInstance.delete(`/countries/${id}`);
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to delete country');
    }
  },

  // States
  createState: async (stateData: { name: string; country: string }): Promise<State> => {
    try {
      const response = await axiosInstance.post('/countries/states', stateData);
      return response.data.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to create state');
    }
  },

  updateState: async (id: string, stateData: { name: string; country: string }): Promise<State> => {
    try {
      const response = await axiosInstance.put(`/countries/state/${id}`, stateData);
      return response.data.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to update state');
    }
  },

  deleteState: async (id: string): Promise<void> => {
    try {
      await axiosInstance.delete(`/countries/state/${id}`);
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to delete state');
    }
  },

  // Cities
  createCity: async (cityData: { name: string; price: string; state: string }): Promise<City> => {
    try {
      const response = await axiosInstance.post('/countries/cities', cityData);
      return response.data.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to create city');
    }
  },

  updateCity: async (id: string, cityData: { name: string; price: string; state: string }): Promise<City> => {
    try {
      const response = await axiosInstance.put(`/countries/city/${id}`, cityData);
      return response.data.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to update city');
    }
  },

  deleteCity: async (id: string): Promise<void> => {
    try {
      await axiosInstance.delete(`/countries/city/${id}`);
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to delete city');
    }
  },
};
