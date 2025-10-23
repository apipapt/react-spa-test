import axios, { type AxiosInstance } from 'axios';

const env = import.meta.env as unknown as Record<string, unknown>;
const BASE_URL = typeof env.VITE_API_BASE_URL === 'string' ? env.VITE_API_BASE_URL : 'https://sandbox.dibuiltadi.com';

const api: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
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

export const login = async (credentials: Record<string, string>) => {
  try {
    const response = await api.post('/auth/login', credentials);
    const { token, user } = response.data || {};
    if (!token) throw new Error('Token not returned from login');
    setAuthToken(token);
    return user ?? null;
  } catch (err: unknown) {
    let message = 'Login failed';
    if (err instanceof Error) message = err.message || message;
    else {
      const e = err as { response?: { data?: { message?: unknown } }; message?: unknown };
      const maybeMsg = e.response?.data?.message ?? e.message;
      if (typeof maybeMsg === 'string') message = maybeMsg;
    }
    throw new Error(message);
  }
};

export const logout = () => {
  clearAuthToken();
};

export const getDashboardData = async () => {
  const response = await api.get('/dashboard/summary');
  return response.data;
};

export default api;
