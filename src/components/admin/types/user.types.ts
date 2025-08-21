
export interface User {
  _id: string;
  name: string;
  email: string;
  userName: string;
  phoneNumber?: string;
  role: 'user' | 'vendor' | 'admin';
  image?: string;
  bio?: string;
  isTwoFactorEnabled: boolean;
  createdAt: string;
  // Computed fields for frontend display
  registeredDate?: string;
  lastLogin?: string;
  orderCount?: number;
  totalSpent?: number;
  status?: 'active' | 'inactive';
}

export type UserFormValues = {
  name: string;
  email: string;
  userName: string;
  phoneNumber?: string;
  role: 'user' | 'vendor' | 'admin';
  bio?: string;
  password?: string; // For new users
};

export interface CreateUserRequest {
  name: string;
  email: string;
  userName: string;
  phoneNumber?: string;
  role: 'user' | 'vendor' | 'admin';
  bio?: string;
  password: string;
}

export interface UpdateUserRequest {
  name?: string;
  email?: string;
  userName?: string;
  phoneNumber?: string;
  role?: 'user' | 'vendor' | 'admin';
  bio?: string;
}
