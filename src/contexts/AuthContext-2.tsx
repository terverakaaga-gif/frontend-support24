import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from "sonner";
import { useQueryClient } from '@tanstack/react-query';
import {
  User,
  UserRegistrationInput,
  EmailVerificationInput,
  SupportWorker,
  Participant,
  Guardian,
  Admin
} from '../types/user.types';
import authService from '../api/services/authService';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  register: (data: UserRegistrationInput) => Promise<{ userId: string }>;
  completeOnboarding: () => void;
  verifyEmail: (data: EmailVerificationInput) => Promise<void>;
  resendVerification: (email: string) => Promise<{ userId: string }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const queryClient = useQueryClient();

  // Load user data from localStorage once on initial render
  useEffect(() => {
    const loadUserData = () => {
      const storedUser = localStorage.getItem('guardianCareUser');
      if (storedUser) {
        try {
          setUser(JSON.parse(storedUser));
        } catch (error) {
          // Handle potential JSON parse error
          localStorage.removeItem('guardianCareUser');
        }
      }
      setIsLoading(false);
    };
    
    loadUserData();
  }, []); // Empty dependency array ensures this only runs once

  const login = async (email: string, password: string): Promise<void> => {
    setIsLoading(true);
    try {
      const { user } = await authService.login({ email, password });
      setUser(user);
      localStorage.setItem('guardianCareUser', JSON.stringify(user));
      toast.success(`Welcome back, ${user.firstName}!`);
      queryClient.invalidateQueries();
    } finally {
      setIsLoading(false);
    }
  };
  

  const register = async (data: UserRegistrationInput): Promise<{ userId: string }> => {
    setIsLoading(true);
  
    try {
      const response = await authService.register(data);
      toast.success('Registration successful! Please verify your email.');
      return { userId: response.userId };
    } finally {
      setIsLoading(false);
    }
  };
  

  const verifyEmail = async (data: EmailVerificationInput): Promise<void> => {
    setIsLoading(true);
  
    try {
      const { user } = await authService.verifyEmail(data);
      setUser(user);
      localStorage.setItem('guardianCareUser', JSON.stringify(user));
      toast.success('Email verification successful!');
    } finally {
      setIsLoading(false);
    }
  };
  

  const resendVerification = async (email: string): Promise<{ userId: string }> => {
    setIsLoading(true);
  
    try {
      const response = await authService.resendVerification({ email });
      toast.success('Verification code has been sent to your email.');
      return { userId: response.userId };
    } finally {
      setIsLoading(false);
    }
  };
  

  const completeOnboarding = () => {
    // if (user && user.role === 'supportWorker') {
      // Create a new user object with updated verification status
      // const updatedUser = {
      //   ...user,
      //   verificationStatus: {
      //     ...user.verificationStatus,
      //     profileSetupComplete: true
      //   }
      // };
      
      // setUser(updatedUser);
      // localStorage.setItem('guardianCareUser', JSON.stringify(updatedUser));
      
      // In reality, this should call an API endpoint to update the user's status
      // We'll implement this in the next iteration
    // }
  };

  const logout = async (): Promise<void> => {
    try {
      await authService.logout();
      setUser(null);
      localStorage.removeItem('guardianCareUser');
      toast.success('You have been logged out');
      
      // Clear all queries from cache on logout
      queryClient.clear();
    } catch (error) {
      // If logout fails on the server but we want to ensure the user is logged out locally
      setUser(null);
      localStorage.removeItem('guardianCareUser');
      toast.success('You have been logged out');
      queryClient.clear();
    }
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      isLoading, 
      login, 
      logout, 
      register, 
      completeOnboarding,
      verifyEmail,
      resendVerification
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};