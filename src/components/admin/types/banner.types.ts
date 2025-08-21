
export interface Banner {
  _id: string;
  image: string;
  imagePublicId: string;
  order: number;
  isHero: boolean;
  section: 'hero' | 'signature-collection' | 'commitment';
  createdAt: string;
  updatedAt: string;
}

export interface BannerFormData {
  image?: File;
  isHero: boolean;
  section: 'hero' | 'signature-collection' | 'commitment';
}

export interface BannerResponse {
  success: boolean;
  data: Banner[];
  count: number;
  pagination?: {
    next?: { page: number; limit: number };
    prev?: { page: number; limit: number };
  };
}
