
export interface Category {
  id: string;
  name: string;
  description: string;
  image?: string;
  productCount: number;
}

export type CategoryFormValues = {
  name: string;
  description: string;
  image?: File | null;
};
