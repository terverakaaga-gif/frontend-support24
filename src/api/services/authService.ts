/* eslint-disable @typescript-eslint/no-explicit-any */

import { post } from '../apiClient';
import { tokenStorage } from '../apiClient';
import apiClient from '../apiClient';
import { 
  User, 
  UserRegistrationInput, 
  EmailVerificationInput,
  ResendVerificationInput,
  LoginInput,
  SupportWorker,
  Participant,
  Guardian,
  Admin
} from '../../types/user.types';

// Token interface matching your backend response
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

interface LoginResponse {
  user: User;
  tokens: Tokens;
}

interface RegisterResponse {
  user: User;
  tokens: Tokens;
  verificationRequired: boolean;
  userId: string;
}

interface VerifyEmailResponse {
  user: User;
}

interface ResendVerificationResponse {
  userId: string;
}

interface ForgotPasswordResponse {
  success: boolean;
  code: number;
  message: string;
  data: {
    userId: string;
  };
  error: null;
}

interface ResetPasswordData {
  userId: string;
  otpCode: string;
  password: string;
}

interface ForgotPasswordInput {
  email: string;
}

// Helper function to determine user type and cast accordingly
const castUser = (user: any): User => {
  if (user.role === 'supportWorker') {
    return user as SupportWorker;
  } else if (user.role === 'participant') {
    return user as Participant;
  } else if (user.role === 'guardian') {
    return user as Guardian;
  } else {
    return user as Admin;
  }
};

// Auth service for authentication operations
const authService = {
  // Register a new user
  register: async (userData: UserRegistrationInput): Promise<RegisterResponse> => {
    const response = await post<RegisterResponse>('/auth/register', userData);
    
    // Store tokens if registration is successful
    if (response.tokens) {
      tokenStorage.setTokens(response.tokens);
    }
    
    return {
      ...response,
      user: castUser(response.user)
    };
  },
  
  // Login with email and password
  login: async (credentials: LoginInput): Promise<LoginResponse> => {
    const response = await post<LoginResponse>('/auth/login', credentials);
    
    // Store tokens after successful login
    tokenStorage.setTokens(response.tokens);
    
    return {
      user: castUser(response.user),
      tokens: response.tokens
    };
  },
  
  // Verify email with OTP
  verifyEmail: async (verificationData: EmailVerificationInput): Promise<VerifyEmailResponse> => {
    const response = await post<VerifyEmailResponse>('/auth/verify-email', verificationData);
    return {
      user: castUser(response.user)
    };
  },
  
  // Resend email verification OTP
  resendVerification: async (data: ResendVerificationInput): Promise<ResendVerificationResponse> => {
    return await post<ResendVerificationResponse>('/auth/resend-verification', data);
  },
  
  // Forgot password - send OTP to email
  forgotPassword: async (data: ForgotPasswordInput): Promise<ForgotPasswordResponse> => {
    // Use apiClient directly to get the full response, not just the data property
    const response = await apiClient.post('/auth/forgot-password', data);
    return response.data as ForgotPasswordResponse;
  },
  
  // Reset password with OTP
  resetPassword: async (data: ResetPasswordData): Promise<void> => {
    await post<void>('/auth/reset-password', data);
  },
  
  // Refresh authentication tokens
  refreshToken: async (): Promise<Tokens> => {
    const refreshToken = tokenStorage.getRefreshToken();
    
    if (!refreshToken) {
      throw new Error('No refresh token available');
    }
    
    const response = await post<{ tokens: Tokens }>('/auth/refresh-token', { 
      refreshToken 
    });
    
    // Update stored tokens
    tokenStorage.setTokens(response.tokens);
    
    return response.tokens;
  },
  
  // Logout the current user
  logout: async (): Promise<void> => {
    const refreshToken = tokenStorage.getRefreshToken();
    
    try {
      // Send logout request to server with refresh token
      if (refreshToken) {
        await post('/auth/logout', { refreshToken });
      }
    } catch (error) {
      // If logout fails on server, we still want to clear local tokens
      console.warn('Server logout failed, clearing local tokens:', error);
    } finally {
      // Always clear local tokens
      tokenStorage.clearTokens();
    }
  },
  
  // Check if user is authenticated
  isAuthenticated: (): boolean => {
    const accessToken = tokenStorage.getAccessToken();
    return accessToken !== null && !tokenStorage.isTokenExpired(accessToken);
  },
  
  // Get current access token
  getAccessToken: (): string | null => {
    return tokenStorage.getAccessToken();
  },
  
  // Check if token needs refresh
  needsRefresh: (): boolean => {
    const accessToken = tokenStorage.getAccessToken();
    return accessToken !== null && tokenStorage.isTokenExpired(accessToken);
  }
};

export default authService;