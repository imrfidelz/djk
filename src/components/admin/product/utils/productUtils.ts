
import { Product } from '../../types/product.types';
import { useQuery } from '@tanstack/react-query';
import { categoryService } from '@/services/categoryService';
import { brandService } from '@/services/brandService';

// Get category name by id - now using real data
export const getCategoryName = (categoryId: string) => {
  // For fallback during loading or error states
  return 'Loading...';
};

// Get brand name by id - now using real data  
export const getBrandName = (brandId: string) => {
  // For fallback during loading or error states
  return 'Loading...';
};

// Hook to get category name with real data
export const useCategoryName = (categoryId: string) => {
  const { data: categories = [] } = useQuery({
    queryKey: ['categories'],
    queryFn: categoryService.getAll,
  });
  
  const category = categories.find(c => c.id === categoryId);
  return category ? category.name : 'Unknown Category';
};

// Hook to get brand name with real data
export const useBrandName = (brandId: string) => {
  const { data: brands = [] } = useQuery({
    queryKey: ['brands'],
    queryFn: brandService.getAll,
  });
  
  const brand = brands.find(b => b.id === brandId);
  return brand ? brand.name : 'Unknown Brand';
};
