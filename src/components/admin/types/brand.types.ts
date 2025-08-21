
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
