import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from "axios";
import { toast } from "sonner";

// API response type definition matching backend structure
export interface ApiResponse<T = unknown> {
	success: boolean;
	code: number;
	message?: string;
	data?: T;
	error?: string | null;
}

// Token interface
interface Tokens {
	access: {
		token: string;
		expires: string;
	};
	refresh: {
		token: string;
		expires: string;
	};
}

const baseURL = import.meta.env.VITE_API_BASE_URL;

// Token management utilities
const TOKEN_STORAGE_KEY = "guardianCareTokens";

export const tokenStorage = {
	getTokens: (): Tokens | null => {
		try {
			const tokens = localStorage.getItem(TOKEN_STORAGE_KEY);
			return tokens ? JSON.parse(tokens) : null;
		} catch {
			return null;
		}
	},

	setTokens: (tokens: Tokens): void => {
		localStorage.setItem(TOKEN_STORAGE_KEY, JSON.stringify(tokens));
	},

	clearTokens: (): void => {
		localStorage.removeItem(TOKEN_STORAGE_KEY);
	},

	getAccessToken: (): string | null => {
		const tokens = tokenStorage.getTokens();
		return tokens?.access?.token || null;
	},

	getRefreshToken: (): string | null => {
		const tokens = tokenStorage.getTokens();
		return tokens?.refresh?.token || null;
	},

	isTokenExpired: (token: string): boolean => {
		if (!token) return true;

		try {
			const payload = JSON.parse(atob(token.split(".")[1]));
			const currentTime = Math.floor(Date.now() / 1000);
			return payload.exp < currentTime;
		} catch {
			return true;
		}
	},
};

// Create axios instance with default config
const apiClient = axios.create({
	baseURL,
	headers: {
		"Content-Type": "application/json",
	},
	// Remove withCredentials since we're not using cookies anymore
	// withCredentials: true,
});

// Flag to prevent multiple refresh attempts
let isRefreshing = false;
let failedQueue: Array<{
	resolve: (value?: unknown) => void;
	reject: (reason?: unknown) => void;
}> = [];

const processQueue = (error: unknown, token: string | null = null) => {
	failedQueue.forEach(({ resolve, reject }) => {
		if (error) {
			reject(error);
		} else {
			resolve(token);
		}
	});

	failedQueue = [];
};

// Function to refresh the access token
const refreshAccessToken = async (): Promise<string | null> => {
	const refreshToken = tokenStorage.getRefreshToken();

	if (!refreshToken) {
		throw new Error("No refresh token available");
	}

	try {
		const response = await axios.post<ApiResponse<{ tokens: Tokens }>>(
			`${baseURL}/auth/refresh-token`,
			{ refreshToken },
			{
				headers: {
					"Content-Type": "application/json",
				},
			}
		);

		const { tokens } = response.data.data!;
		tokenStorage.setTokens(tokens);
		return tokens.access.token;
	} catch (error) {
		tokenStorage.clearTokens();
		// Clear user data from localStorage
		localStorage.removeItem("guardianCareUser");

		// Redirect to login page
		if (typeof window !== "undefined") {
			window.location.href = "/login";
		}

		throw error;
	}
};

// Request interceptor to add Authorization header
apiClient.interceptors.request.use(
	(config) => {
		const accessToken = tokenStorage.getAccessToken();

		if (accessToken && !tokenStorage.isTokenExpired(accessToken)) {
			config.headers.Authorization = `Bearer ${accessToken}`;
		}

		return config;
	},
	(error) => {
		return Promise.reject(error);
	}
);

// Response interceptor to handle token refresh
apiClient.interceptors.response.use(
	(response: AxiosResponse) => {
		return response;
	},
	async (error: AxiosError<ApiResponse>) => {
		const originalRequest = error.config as AxiosRequestConfig & {
			_retry?: boolean;
		};
		const errorResponse = error.response?.data;

		// Handle 401 errors (token expired or invalid)
		if (error.response?.status === 401 && !originalRequest._retry) {
			if (isRefreshing) {
				// If we're already refreshing, queue this request
				return new Promise((resolve, reject) => {
					failedQueue.push({ resolve, reject });
				})
					.then((token) => {
						if (originalRequest.headers) {
							originalRequest.headers.Authorization = `Bearer ${token}`;
						}
						return apiClient(originalRequest);
					})
					.catch((err) => {
						return Promise.reject(err);
					});
			}

			originalRequest._retry = true;
			isRefreshing = true;

			try {
				const newAccessToken = await refreshAccessToken();
				processQueue(null, newAccessToken);

				if (originalRequest.headers && newAccessToken) {
					originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
				}

				return apiClient(originalRequest);
			} catch (refreshError) {
				processQueue(refreshError, null);

				// Token refresh failed, redirect to login
				tokenStorage.clearTokens();
				localStorage.removeItem("guardianCareUser");

				toast.error("Session expired. Please log in again.");

				if (typeof window !== "undefined") {
					window.location.href = "/login";
				}

				return Promise.reject(refreshError);
			} finally {
				isRefreshing = false;
			}
		}

		// Handle other API errors
		if (errorResponse?.error) {
			toast.error(errorResponse.error);
		} else if (errorResponse?.message) {
			toast.error(errorResponse.message);
		} else if (error.response?.status === 403) {
			toast.error("You do not have permission to perform this action.");
		} else if (error.response?.status >= 500) {
			toast.error("Server error. Please try again later.");
		} else {
			toast.error("An unexpected error occurred. Please try again.");
		}

		return Promise.reject(error);
	}
);

// Generic GET request
export const get = async <T>(
	url: string,
	config?: AxiosRequestConfig
): Promise<T> => {
	const response = await apiClient.get<ApiResponse<T>>(url, config);
	return response.data.data as T;
};

// Generic POST request
export const post = async <T, D = unknown>(
	url: string,
	data?: D,
	config?: AxiosRequestConfig
): Promise<T> => {
	const response = await apiClient.post<ApiResponse<T>>(url, data, config);
	return response.data.data as T;
};

// Generic PUT request
export const put = async <T, D = unknown>(
	url: string,
	data?: D,
	config?: AxiosRequestConfig
): Promise<T> => {
	const response = await apiClient.put<ApiResponse<T>>(url, data, config);
	return response.data.data as T;
};

// Generic PATCH request
export const patch = async <T, D = unknown>(
	url: string,
	data?: D,
	config?: AxiosRequestConfig
): Promise<T> => {
	const response = await apiClient.patch<ApiResponse<T>>(url, data, config);
	return response.data.data as T;
};

// Generic DELETE request
export const del = async <T>(
	url: string,
	config?: AxiosRequestConfig
): Promise<T> => {
	const response = await apiClient.delete<ApiResponse<T>>(url, config);
	return response.data.data as T;
};

// Specific method for downloading blobs (PDFs, images, etc.)
export const downloadBlob = async (url: string, config?: AxiosRequestConfig): Promise<Blob> => {
  const response = await apiClient.get(url, {
    ...config,
    responseType: 'blob',
  });
  return response.data;
};

// Export the axios instance for direct usage if needed
export default apiClient;
