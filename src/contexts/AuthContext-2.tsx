import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from "sonner";
import { UserRegistrationInput } from "@/entities/UserRegistration";

export type UserRole = 'admin' | 'guardian' | 'participant' | 'support-worker';

interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  isOnboarded?: boolean;
  isEmailVerified?: boolean;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  register: (data: UserRegistrationInput) => Promise<User>;
  completeOnboarding: () => void;
  verifyEmail: (email: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock users for demonstration purposes
const mockUsers: User[] = [
  { id: '1', name: 'Admin User', email: 'admin@example.com', role: 'admin', avatar: 'AD', isOnboarded: true, isEmailVerified: true },
  { id: '2', name: 'John Smith', email: 'john@example.com', role: 'guardian', avatar: 'JS', isOnboarded: true, isEmailVerified: true },
  { id: '3', name: 'Emma Wilson', email: 'emma@example.com', role: 'participant', avatar: 'EW', isOnboarded: true, isEmailVerified: true },
  { id: '4', name: 'Sarah Johnson', email: 'sarah@example.com', role: 'support-worker', avatar: 'SJ', isOnboarded: true, isEmailVerified: true },
];

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [pendingRegistration, setPendingRegistration] = useState<User | null>(null);

  // Load user data from localStorage once on initial render
  useEffect(() => {
    const loadUserData = () => {
      const storedUser = localStorage.getItem('guardianCareUser');
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
      setIsLoading(false);
    };
    
    loadUserData();
  }, []); // Empty dependency array ensures this only runs once

  const login = async (email: string, password: string): Promise<void> => {
    setIsLoading(true);
    
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const foundUser = mockUsers.find(user => user.email === email);
      
      if (foundUser && password === 'password') { // Simple password check for demo
        setUser(foundUser);
        localStorage.setItem('guardianCareUser', JSON.stringify(foundUser));
        toast.success(`Welcome back, ${foundUser.name}!`);
      } else {
        toast.error('Invalid email or password');
        throw new Error('Invalid credentials');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (data: UserRegistrationInput): Promise<User> => {
    setIsLoading(true);
    
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Check if user already exists
      const existingUser = mockUsers.find(user => user.email === data.email);
      if (existingUser) {
        toast.error('User with this email already exists');
        throw new Error('User already exists');
      }
      
      // Create new user - all users need email verification
      const newUser: User = {
        id: `${mockUsers.length + 1}`,
        name: `${data.firstName} ${data.lastName}`,
        email: data.email,
        role: data.role,
        avatar: `${data.firstName.charAt(0)}${data.lastName.charAt(0)}`,
        isOnboarded: false,
        isEmailVerified: false
      };
      
      // Add to mock data (in a real app, this would be a database operation)
      mockUsers.push(newUser);
      
      // Store the pending registration for later verification
      setPendingRegistration(newUser);
      
      // Return the new user but don't authenticate yet
      toast.success('Registration successful! Please verify your email.');
      return newUser;
    } finally {
      setIsLoading(false);
    }
  };

  const verifyEmail = async (email: string): Promise<void> => {
    setIsLoading(true);
    
    try {
      // Find the user with the provided email
      const userToVerify = mockUsers.find(user => user.email === email);
      
      if (!userToVerify) {
        toast.error('User not found');
        throw new Error('User not found');
      }
      
      // Update user's email verification status
      userToVerify.isEmailVerified = true;
      
      // Set as current user after verification
      setUser(userToVerify);
      localStorage.setItem('guardianCareUser', JSON.stringify(userToVerify));
      
      // Clear pending registration
      setPendingRegistration(null);
      
      toast.success('Email verification successful!');
    } finally {
      setIsLoading(false);
    }
  };

  const completeOnboarding = () => {
    if (user) {
      const updatedUser = { ...user, isOnboarded: true };
      setUser(updatedUser);
      localStorage.setItem('guardianCareUser', JSON.stringify(updatedUser));
      
      // In a real app, this would be an API call to update the user's status
      const userIndex = mockUsers.findIndex(u => u.id === user.id);
      if (userIndex !== -1) {
        mockUsers[userIndex] = updatedUser;
      }
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('guardianCareUser');
    toast.success('You have been logged out');
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      isLoading, 
      login, 
      logout, 
      register, 
      completeOnboarding,
      verifyEmail
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