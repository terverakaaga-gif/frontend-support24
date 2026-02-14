import {
  User,
  UserRegistrationInput,
  EmailVerificationInput,
  ResendVerificationInput,
  LoginInput,
  SupportWorker,
  Participant,
  Guardian,
  Admin,
  ParticipantOnboardingInput,
  SupportWorkerOnboardingInput,
} from "../../types/user.types";
import { post, tokenStorage } from "../apiClient";

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
  userId: string;
}

export interface ResetPasswordData {
  userId: string;
  otpCode: string;
  password: string;
}

interface ForgotPasswordInput {
  email: string;
}

interface OnboardingResponse {
  success: boolean;
  message: string;
}

// Helper function to determine user type and cast accordingly
const castUser = (user: any): User => {
  if (user.role === "supportWorker") {
    return user as SupportWorker;
  } else if (user.role === "participant") {
    return user as Participant;
  } else if (user.role === "guardian") {
    return user as Guardian;
  } else {
    return user as Admin;
  }
};

// Auth service for authentication operations
const authService = {
  // Register a new user
  register: async (
    userData: UserRegistrationInput
  ): Promise<RegisterResponse> => {
    const response = await post<RegisterResponse>("/auth/register", userData);

    // DON'T store tokens here - user needs to verify email first
    // if (response.tokens) {
    //   tokenStorage.setTokens(response.tokens);
    // }

    return {
      ...response,
      user: castUser(response.user),
    };
  },

  // Login with email and password
  login: async (credentials: LoginInput): Promise<LoginResponse> => {
    const response = await post<LoginResponse>("/auth/login", credentials);

    tokenStorage.setTokens(response.tokens);

    return {
      user: castUser(response.user),
      tokens: response.tokens,
    };
  },

  // Verify email with OTP
  verifyEmail: async (
    verificationData: EmailVerificationInput
  ): Promise<VerifyEmailResponse> => {
    const response = await post<VerifyEmailResponse>(
      "/auth/verify-email",
      verificationData
    );
    return {
      user: castUser(response.user),
    };
  },

  // Resend email verification OTP
  resendVerification: async (
    data: ResendVerificationInput
  ): Promise<ResendVerificationResponse> => {
    return await post<ResendVerificationResponse>(
      "/auth/resend-verification",
      data
    );
  },

  // Forgot password - send OTP to email
  forgotPassword: async (
    data: ForgotPasswordInput
  ): Promise<ForgotPasswordResponse> => {
    const response = await post<ForgotPasswordResponse>(
      "/auth/forgot-password",
      data
    );
    return response;
  },

  // Reset password with OTP
  resetPassword: async (data: ResetPasswordData): Promise<void> => {
    await post<void>("/auth/reset-password", data);
  },

  // Refresh authentication tokens
  refreshToken: async (): Promise<Tokens> => {
    const refreshToken = tokenStorage.getRefreshToken();

    if (!refreshToken) {
      throw new Error("No refresh token available");
    }

    const response = await post<{ tokens: Tokens }>("/auth/refresh-token", {
      refreshToken,
    });

    tokenStorage.setTokens(response.tokens);

    return response.tokens;
  },

  // Logout the current user
  logout: async (): Promise<void> => {
    const refreshToken = tokenStorage.getRefreshToken();

    try {
      if (refreshToken) {
        await post("/auth/logout", { refreshToken });
      }
    } catch (error) {
    } finally {
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
  },

  // Upload Resume
  uploadResume: async (file: File): Promise<{ user: string }> => {
    const formData = new FormData();
    formData.append('file', file);
    
    return await post<{ user: string }>("/users/upload-resume", formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },

  // Complete Support Worker Onboarding
  completeSupportWorkerOnboarding: async (
    data: SupportWorkerOnboardingInput
  ): Promise<OnboardingResponse> => {
    return await post<OnboardingResponse>("/users/workers/onboarding", data);
  },

  // Complete Participant Onboarding
  completeParticipantOnboarding: async (
    data: ParticipantOnboardingInput
  ): Promise<OnboardingResponse> => {
    return await post<OnboardingResponse>(
      "/users/participants/onboarding",
      data
    );
  },
};

export default authService;
