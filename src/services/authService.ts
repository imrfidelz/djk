import axios from 'axios';
import { API_BASE_URL } from './config';

export interface User {
  id: string;
  name: string;
  email: string;
  userName?: string;
  bio: string;
  phoneNumber?: string;
  image?: string;
  role: 'user' | 'vendor' | 'admin';
  createdAt: string;
  isTwoFactorEnabled?: boolean;
}

export interface LoginRequest {
  email: string;
  password: string;
  token?: string; // For 2FA
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
  userName?: string;
  phoneNumber?: string;
  role?: 'user' | 'vendor';
}

export interface UpdateUserDetailsRequest {
  name?: string;
  email?: string;
  userName?: string;
  bio?: string;
  phoneNumber?: string;
}

export interface UpdatePasswordRequest {
  currentPassword: string;
  newPassword: string;
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface ResetPasswordRequest {
  password: string;
}

export interface AuthResponse {
  success: boolean;
  data?: User;
  message?: string;
  token?: string;
  tempToken?: string; // For 2FA
}

export interface TwoFASetupResponse {
  success: boolean;
  qrCodeUrl: string;
  secret?: string;
}

export interface TwoFAVerifyRequest {
  token: string;
  email: string;
}

export interface TwoFADisableResponse {
  success: boolean;
  message?: string;
}

class AuthService {
  private axiosInstance = axios.create({
    baseURL: API_BASE_URL,
    headers: {
      'Content-Type': 'application/json',
    },
  });

  private getAuthHeaders() {
    const token = localStorage.getItem('token');
    return {
      Authorization: `Bearer ${token}`,
    };
  }

  private getFormDataHeaders() {
    const token = localStorage.getItem('token');
    return {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'multipart/form-data',
    };
  }

  async login(loginData: LoginRequest): Promise<AuthResponse> {
    try {
      const { data } = await this.axiosInstance.post<AuthResponse>(
        '/auth/login',
        loginData
      );

      if (data.token) {
        localStorage.setItem('token', data.token);
        try {
          const { cartService } = await import('./cartService');
          await cartService.migrateLocalCartToBackend();
        } catch (error) {
          console.error('Failed to migrate cart:', error);
        }
      }

      if (data.tempToken) {
        localStorage.setItem('tempToken', data.tempToken);
      }

      return data;
    } catch (error: any) {
      const message = error.response?.data?.message || 'Login failed';
      throw new Error(message);
    }
  }

  async register(registerData: RegisterRequest): Promise<AuthResponse> {
    try {
      const { data } = await this.axiosInstance.post<AuthResponse>(
        '/auth/register',
        registerData
      );

      if (data.token) {
        localStorage.setItem('token', data.token);
      }

      return data;
    } catch (error: any) {
      const message = error.response?.data?.message || 'Registration failed';
      throw new Error(message);
    }
  }

  async logout(): Promise<void> {
    try {
      await this.axiosInstance.get('/auth/logout', {
        headers: this.getAuthHeaders(),
      });
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      localStorage.removeItem('token');
      localStorage.removeItem('tempToken');
    }
  }

  isAuthenticated(): boolean {
    return !!localStorage.getItem('token');
  }

  async getCurrentUser(): Promise<User> {
    try {
      const { data } = await this.axiosInstance.get<AuthResponse>('/auth/me', {
        headers: this.getAuthHeaders(),
      });

      return data.data!;
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to fetch user profile';
      throw new Error(message);
    }
  }

  async updateUserDetails(updateData: UpdateUserDetailsRequest): Promise<User> {
    try {
      const { data } = await this.axiosInstance.put<AuthResponse>(
        '/auth/updatedetails',
        updateData,
        { headers: this.getAuthHeaders() }
      );

      return data.data!;
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to update profile';
      throw new Error(message);
    }
  }

  async updateUserDetailsWithPhoto(
    updateData: UpdateUserDetailsRequest,
    photoFile?: File
  ): Promise<User> {
    const formData = new FormData();

    Object.entries(updateData).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        formData.append(key, value);
      }
    });

    if (photoFile) {
      formData.append('file', photoFile);
    }

    try {
      const { data } = await this.axiosInstance.put<AuthResponse>(
        '/auth/updatedetails',
        formData,
        { headers: this.getFormDataHeaders() }
      );

      return data.data!;
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to update profile';
      throw new Error(message);
    }
  }

  async updatePassword(passwordData: UpdatePasswordRequest): Promise<AuthResponse> {
    try {
      const { data } = await this.axiosInstance.put<AuthResponse>(
        '/auth/updatepassword',
        passwordData,
        { headers: this.getAuthHeaders() }
      );

      if (data.token) {
        localStorage.setItem('token', data.token);
      }

      return data;
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to update password';
      throw new Error(message);
    }
  }

  async forgotPassword(
    forgotPasswordData: ForgotPasswordRequest
  ): Promise<AuthResponse> {
    try {
      const { data } = await this.axiosInstance.post<AuthResponse>(
        '/auth/forgotpassword',
        forgotPasswordData
      );
      return data;
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to send reset email';
      throw new Error(message);
    }
  }

async resetPassword(
  resetToken: string,
  resetPasswordData: ResetPasswordRequest
): Promise<AuthResponse> {
  try {
    const { data } = await this.axiosInstance.put<AuthResponse>(
      `/auth/resetpassword/${resetToken}`,
      resetPasswordData
    );

    if (data.token) {
      localStorage.setItem('token', data.token);
    }

    return data;
  } catch (error: any) {
    const message = error.response?.data?.message || 'Failed to reset password';
    throw new Error(message);
  }
}

// 2FA: Start setup - returns QR code URL
async setupTwoFactorAuth(): Promise<TwoFASetupResponse> {
  try {
    const { data } = await this.axiosInstance.post<TwoFASetupResponse>(
      '/auth/2fa/setup',
      {},
      { headers: this.getAuthHeaders() }
    );
    return data;
  } catch (error: any) {
    const message = error.response?.data?.message || 'Failed to start 2FA setup';
    throw new Error(message);
  }
}

// 2FA: Verify OTP to enable 2FA (supports temp token during login)
async verifyTwoFactorAuth(token: string, email: string): Promise<AuthResponse> {
  try {
    const tempToken = localStorage.getItem('tempToken');
    const headers = tempToken
      ? { Authorization: `Bearer ${tempToken}` }
      : this.getAuthHeaders();

    const { data } = await this.axiosInstance.post<AuthResponse>(
      '/auth/2fa/verify',
      { token, email },
      { headers }
    );

    if (data.token) {
      localStorage.setItem('token', data.token);
    }
    // Clear temp token after attempt
    if (tempToken) localStorage.removeItem('tempToken');

    return data;
  } catch (error: any) {
    const message = error.response?.data?.message || 'Failed to verify 2FA token';
    throw new Error(message);
  }
}

// 2FA: Disable
async disableTwoFactorAuth(token: string): Promise<TwoFADisableResponse> {
  try {
    const { data } = await this.axiosInstance.post<TwoFADisableResponse>(
      '/auth/2fa/disable',
      { token },
      { headers: this.getAuthHeaders() }
    );
    return data;
  } catch (error: any) {
    const message = error.response?.data?.message || 'Failed to disable 2FA';
    throw new Error(message);
  }
}
}

export const authService = new AuthService();
