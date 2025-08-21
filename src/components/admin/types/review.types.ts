
export interface Review {
  _id: string;
  name: string;
  comment: string;
  rating: number;
  product: {
    _id: string;
    name: string;
  } | string;
  user: {
    _id: string;
    name: string;
  } | string;
  createdAt: string;
  updatedAt: string;
}

export interface ReviewFormData {
  name: string;
  comment: string;
  rating: number;
  product: string;
  user: string;
}

export interface CreateReviewRequest {
  name: string;
  comment: string;
  rating: number;
}

export interface UpdateReviewRequest {
  name?: string;
  comment?: string;
  rating?: number;
}
