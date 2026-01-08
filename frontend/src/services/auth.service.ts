import api from '../config/api';

export interface RegisterData {
  name: string;
  email: string;
  password: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface AuthResponse {
  user: {
    id: string;
    name: string;
    email: string;
    emailVerified?: boolean;
  };
  token?: string; // Optional - not returned on registration if email not verified
  message?: string;
  emailVerified?: boolean;
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  emailVerified?: boolean;
  createdAt?: string;
}

export const authService = {
  register: async (data: RegisterData): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>('/auth/register', data);
    return response.data;
  },

  login: async (data: LoginData): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>('/auth/login', data);
    return response.data;
  },

  getMe: async (): Promise<{ user: User }> => {
    const response = await api.get<{ user: User }>('/auth/me');
    return response.data;
  },

  verifyEmail: async (token: string): Promise<{ message: string; user: { id: string; name: string; email: string; emailVerified: boolean }; token?: string; emailVerified: boolean }> => {
    const response = await api.post('/auth/verify-email', { token });
    return response.data;
  },

  resendVerification: async (email: string): Promise<{ message: string }> => {
    const response = await api.post('/auth/resend-verification', { email });
    return response.data;
  },
};





