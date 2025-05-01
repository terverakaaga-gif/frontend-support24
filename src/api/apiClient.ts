import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios';
import { toast } from "sonner";

// API response type definition matching backend structure
export interface ApiResponse<T = unknown> {
  success: boolean;
  code: number;
  message?: string;
  data?: T;
  error?: string | null;
}

// Create axios instance with default config
const apiClient = axios.create({
  baseURL: 'https://guardian-care-pro-api.onrender.com/api/v1',
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Important for cookie handling
});

// Request interceptor
apiClient.interceptors.request.use(
  (config) => {
    // You can add logic here to attach tokens if using token-based auth
    // instead of cookie-based
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  (error: AxiosError<ApiResponse>) => {
    // Handle API errors consistently
    const errorResponse = error.response?.data;
    
    // Show error toast for all API errors
    if (errorResponse?.error) {
      toast.error(errorResponse.error);
    } else if (errorResponse?.message) {
      toast.error(errorResponse.message);
    } else {
      toast.error('An unexpected error occurred. Please try again.');
    }
    
    // Handle authentication errors (401, 403)
    if (error.response?.status === 401 || error.response?.status === 403) {
      // We could redirect to login here or handle token refresh
      // window.location.href = '/login';
    }
    
    return Promise.reject(error);
  }
);

// Generic GET request
export const get = async <T>(url: string, config?: AxiosRequestConfig): Promise<T> => {
  const response = await apiClient.get<ApiResponse<T>>(url, config);
  return response.data.data as T;
};

// Generic POST request
export const post = async <T, D = unknown>(url: string, data?: D, config?: AxiosRequestConfig): Promise<T> => {
  const response = await apiClient.post<ApiResponse<T>>(url, data, config);
  return response.data.data as T;
};

// Generic PUT request
export const put = async <T, D = unknown>(url: string, data?: D, config?: AxiosRequestConfig): Promise<T> => {
  const response = await apiClient.put<ApiResponse<T>>(url, data, config);
  return response.data.data as T;
};

// Generic DELETE request
export const del = async <T>(url: string, config?: AxiosRequestConfig): Promise<T> => {
  const response = await apiClient.delete<ApiResponse<T>>(url, config);
  return response.data.data as T;
};

// Export the axios instance for direct usage if needed
export default apiClient;