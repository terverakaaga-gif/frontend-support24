import React, { createContext, useContext, useState, useEffect } from "react";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";
import {
  User,
  UserRegistrationInput,
  EmailVerificationInput,
  SupportWorker,
  Participant,
  Guardian,
  Admin,
} from "../types/user.types";
import authService, { ResetPasswordData } from "../api/services/authService";
import { tokenStorage } from "../api/apiClient";

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  register: (data: UserRegistrationInput) => Promise<{ userId: string }>;
  completeOnboarding: () => void;
  verifyEmail: (data: EmailVerificationInput) => Promise<void>;
  forgotPassword: (email: string) => Promise<{ userId: string }>;
  resetPassword: (data: ResetPasswordData) => Promise<void>;
  resendVerification: (email: string) => Promise<{ userId: string }>;
  checkAuthStatus: () => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const queryClient = useQueryClient();

  // Check authentication status
  const checkAuthStatus = (): boolean => {
    const authenticated = authService.isAuthenticated();
    setIsAuthenticated(authenticated);
    return authenticated;
  };

  // Load user data and check authentication on initial render
  useEffect(() => {
    const loadUserData = () => {
      try {
        // Check if we have valid tokens
        const authenticated = checkAuthStatus();

        if (authenticated) {
          // Load user data from localStorage if tokens are valid
          const storedUser = localStorage.getItem("guardianCareUser");
          if (storedUser) {
            try {
              const parsedUser = JSON.parse(storedUser);
              setUser(parsedUser);
            } catch (error) {
              console.error("Error parsing stored user data:", error);
              localStorage.removeItem("guardianCareUser");
              tokenStorage.clearTokens();
            }
          }
        } else {
          // Clear user data if not authenticated
          setUser(null);
          localStorage.removeItem("guardianCareUser");
          tokenStorage.clearTokens();
        }
      } catch (error) {
        console.error("Error loading user data:", error);
        setUser(null);
        setIsAuthenticated(false);
      } finally {
        setIsLoading(false);
      }
    };

    loadUserData();
  }, []); // Empty dependency array ensures this only runs once

  // Check for token refresh needs periodically
  useEffect(() => {
    if (!isAuthenticated) return;

    const checkTokenRefresh = () => {
      if (authService.needsRefresh()) {
        // The apiClient will handle token refresh automatically
        // We just need to update our authentication state if it fails
        const stillAuthenticated = authService.isAuthenticated();
        if (!stillAuthenticated) {
          setUser(null);
          setIsAuthenticated(false);
          localStorage.removeItem("guardianCareUser");
        }
      }
    };

    // Check every 5 minutes
    const interval = setInterval(checkTokenRefresh, 5 * 60 * 1000);

    return () => clearInterval(interval);
  }, [isAuthenticated]);

  const login = async (email: string, password: string): Promise<void> => {
    setIsLoading(true);
    try {
      const response = await authService.login({
        email,
        password,
      });

      // Since HTTP service already extracts data, response is the direct data
      const loggedInUser = response.user;
      const tokens = response.tokens;

      if (!loggedInUser || !tokens) {
        throw new Error("Invalid login response structure");
      }

      // Store tokens
      tokenStorage.setTokens(tokens);

      setUser(loggedInUser);

      // Store user data
      localStorage.setItem("guardianCareUser", JSON.stringify(loggedInUser));

      // Store current user role for future reference
      sessionStorage.setItem("lastUserRole", loggedInUser.role);

      setIsAuthenticated(true);

      toast.success(`Welcome back, ${loggedInUser.firstName}!`);
      queryClient.invalidateQueries();
    } catch (error) {
      setIsAuthenticated(false);
      throw error; // Re-throw to let the component handle the error
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (
    data: UserRegistrationInput
  ): Promise<{ userId: string }> => {
    setIsLoading(true);

    try {
      const response = await authService.register(data);

      // Since HTTP service already extracts data, response is the direct data
      const user = response.user;
      const userId = response.userId || user?._id;
      const tokens = response.tokens;

      if (!userId) {
        throw new Error("Invalid registration response: missing userId");
      }

      // If registration includes tokens (user is automatically logged in)
      if (tokens && user) {
        tokenStorage.setTokens(tokens);
        setUser(user);
        setIsAuthenticated(true);
        localStorage.setItem("guardianCareUser", JSON.stringify(user));
      }

      toast.success("Registration successful! Please verify your email.");
      return { userId };
    } catch (error) {
      console.error("Registration error:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const verifyEmail = async (data: EmailVerificationInput): Promise<void> => {
    setIsLoading(true);

    try {
      const response = await authService.verifyEmail(data);
      
      // Since HTTP service already extracts data, response is the direct data
      const verifiedUser = response.user;

      if (!verifiedUser) {
        throw new Error("Invalid verification response: missing user data");
      }

      setUser(verifiedUser);
      setIsAuthenticated(true);
      localStorage.setItem("guardianCareUser", JSON.stringify(verifiedUser));

      toast.success("Email verification successful!");
    } catch (error) {
      console.error("Email verification error:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const forgotPassword = async (email: string): Promise<{ userId: string }> => {
    setIsLoading(true);

    try {
      const response = await authService.forgotPassword({ email });
      
      // Since HTTP service already extracts data, response is the direct data
      const userId = response.userId;

      if (!userId) {
        console.error("Forgot password response:", response);
        throw new Error("Invalid forgot password response: missing userId");
      }

      toast.success(
        "Password reset instructions have been sent to your email."
      );
      return { userId };
    } catch (error) {
      console.error("Forgot password error:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const resetPassword = async (data: ResetPasswordData): Promise<void> => {
    setIsLoading(true);

    try {
      await authService.resetPassword(data);
      toast.success("Your password has been reset successfully.");
    } catch (error) {
      console.error("Reset password error:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const resendVerification = async (
    email: string
  ): Promise<{ userId: string }> => {
    setIsLoading(true);

    try {
      const response = await authService.resendVerification({ email });
      
      // Since HTTP service already extracts data, response is the direct data
      const userId = response.userId;

      if (!userId) {
        console.error("Resend verification response:", response);
        throw new Error("Invalid resend verification response: missing userId");
      }

      toast.success("Verification code has been sent to your email.");
      return { userId };
    } catch (error) {
      console.error("Resend verification error:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const completeOnboarding = () => {
    try {
      // This would typically call an API endpoint to update the user's onboarding status
      // For now, we'll just update the local state
      if (user && user.role === "supportWorker") {
        const updatedUser = {
          ...user,
          verificationStatus: {
            ...(user as SupportWorker).verificationStatus,
            profileSetupComplete: true,
          },
        } as SupportWorker;

        setUser(updatedUser);
        localStorage.setItem("guardianCareUser", JSON.stringify(updatedUser));
      } else if (user && user.role === "participant") {
        const updatedUser = {
          ...user,
          onboardingComplete: true,
        } as Participant;

        setUser(updatedUser);
        localStorage.setItem("guardianCareUser", JSON.stringify(updatedUser));
      }
    } catch (error) {
      console.error("Complete onboarding error:", error);
    }
  };

  const logout = async (): Promise<void> => {
    try {
      await authService.logout();
    } catch (error) {
      console.warn("Logout error:", error);
      // Continue with local cleanup even if server logout fails
    } finally {
      // Always clear local state
      setUser(null);
      setIsAuthenticated(false);
      localStorage.clear();
      sessionStorage.clear();
      tokenStorage.clearTokens();

      // Clear role memory on logout
      sessionStorage.removeItem("lastUserRole");
      sessionStorage.removeItem("returnUrl");

      toast.success("You have been logged out");

      // Clear all queries from cache on logout
      queryClient.clear();
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated,
        login,
        logout,
        register,
        completeOnboarding,
        verifyEmail,
        resendVerification,
        checkAuthStatus,
        forgotPassword,
        resetPassword,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};