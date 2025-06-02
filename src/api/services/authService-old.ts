/* eslint-disable @typescript-eslint/no-explicit-any */

import { post } from '../apiClient';
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

interface LoginResponse {
  user: User;
}

interface RegisterResponse {
  user: User;
  verificationRequired: boolean;
  userId: string;
}

interface VerifyEmailResponse {
  user: User;
}

interface ResendVerificationResponse {
  userId: string;
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
    return {
      ...response,
      user: castUser(response.user)
    };
  },
  
  // Login with email and password
  login: async (credentials: LoginInput): Promise<LoginResponse> => {
    const response = await post<LoginResponse>('/auth/login', credentials);
    return {
      user: castUser(response.user)
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
  
  // Logout the current user
  logout: async (): Promise<void> => {
    await post('/auth/logout');
  }
};

export default authService;