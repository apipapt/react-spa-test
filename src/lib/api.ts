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
      clearAuthToken();
    }
    return Promise.reject(error);
  }
);

interface LoginResponse {
  token: string;
  user: Record<string, unknown>;
  message?: string;
}

interface ApiError {
  response?: {
    data?: {
      message?: string;
      error?: string;
    };
    status?: number;
  };
  message?: string;
}

export const login = async (credentials: { phone: string; password: string }) => {
  try {
    // Validate credentials format
    if (!credentials.phone || !credentials.password) {
      throw new Error('Phone and password are required');
    }

    const response = await api.post<LoginResponse>('/v1/auth/login', credentials);
    
    const { token, user } = response.data;
    
    if (!token) {
      throw new Error('Authentication failed: No token received');
    }

    setAuthToken(token);
    return user;

  } catch (err: unknown) {
    const error = err as ApiError;
    
    // Handle CORS errors
    if (error.message?.includes('Network Error')) {
      throw new Error('Unable to connect to the server. Please check your connection or try again later.');
    }

    // Handle API error responses
    if (error.response) {
      const message = error.response.data?.message || error.response.data?.error || 'Login failed';
      
      if (error.response.status === 401) {
        throw new Error('Invalid phone number or password');
      }
      
      if (error.response.status === 400) {
        throw new Error(message);
      }

      throw new Error(message);
    }

    // Generic error fallback
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

export default api;
