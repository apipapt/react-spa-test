import axios, { type AxiosInstance } from 'axios';

// Use relative URL for API calls (will be handled by Vite proxy)
const api: AxiosInstance = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  // No need for withCredentials when using proxy
  withCredentials: false,
});

export const setAuthToken = (token: string | null) => {
  if (token) {
    localStorage.setItem('authToken', token);
    api.defaults.headers.common.Authorization = `Bearer ${token}`;
  }
};

export const clearAuthToken = () => {
  localStorage.removeItem('authToken');
  delete api.defaults.headers.common.Authorization;
};

export const isLoggedIn = () => !!localStorage.getItem('authToken');

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error?.response?.status === 401) {
      // clearAuthToken();
    }
    return Promise.reject(error);
  }
);

interface LoginResponse {
  accessToken: string;
  code: string;
  email: string;
  name: string;
  phone: string;
  profileImage: string;
  responseCode: string;
  responseMessage: string;
  roleCode: string;
  roleName: string;
}

interface ApiError {
  response?: {
    data?: {
      message?: string;
      error?: string;
      responseMessage?: string;
      responseCode?: string | number;
    };
    status?: number;
  };
  message?: string;
}

export const login = async (credentials: { phone: string; password: string }) => {
  try {
    if (!credentials.phone || !credentials.password) {
      throw new Error('Phone and password are required');
    }

    const response = await api.post<LoginResponse>('/v1/auth/login', credentials);
    
    const { accessToken } = response.data;
    const user = response.data
    
    if (!accessToken) {
      throw new Error('Authentication failed: No token received');
    }

    setAuthToken(accessToken);
    return user;

  } catch (err: unknown) {
    const error = err as ApiError;
    
    if (error.message?.includes('Network Error')) {
      throw new Error('Unable to connect to the server. Please check your connection or try again later.');
    }

    if (error.response) {
      const data = error.response.data ?? {};
      const message = (data.responseMessage as string) || data.message || data.error || 'Login failed';

      if (error.response.status === 401) {
        throw new Error('Invalid phone number or password');
      }

      throw new Error(message);
    }

    throw new Error('An unexpected error occurred. Please try again.');
  }
};

export const logout = () => {
  clearAuthToken();
};

export const getDashboardData = async () => {
  const response = await api.get('/api/v1/dashboard/summary');
  return response.data;
};

interface RegisterPayload {
  name: string;
  phone: string;
  email: string;
  address?: string;
  password: string;
}

export const registerUser = async (payload: RegisterPayload) => {
  try {
    if (!payload.name || !payload.phone || !payload.email || !payload.password) {
      throw new Error('Please fill all required fields');
    }

    const response = await api.post('/v1/auth/register', payload);
    return response.data;
  } catch (err: unknown) {
    const error = err as ApiError;
    if (error.message?.includes('Network Error')) {
      throw new Error('Unable to connect to the server. Please check your connection or try again later.');
    }
    if (error.response) {
      const data = error.response.data ?? {};
      const message = (data.responseMessage as string) || data.message || data.error || 'Registration failed';
      throw new Error(message);
    }
    throw new Error('An unexpected error occurred. Please try again.');
  }
};

export default api;
