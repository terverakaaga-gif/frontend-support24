import { useMutation, UseMutationResult } from '@tanstack/react-query';
import { useAuth } from '../contexts/AuthContext';
import { 
  UserRegistrationInput, 
  EmailVerificationInput,
} from '../types/user.types';

// Hook for user registration
export const useRegister = (): UseMutationResult<
  { userId: string }, 
  Error, 
  UserRegistrationInput
> => {
  const { register } = useAuth();
  
  return useMutation({
    mutationFn: (data: UserRegistrationInput) => register(data),
  });
};

// Hook for email verification
export const useVerifyEmail = (): UseMutationResult<
  void, 
  Error, 
  EmailVerificationInput
> => {
  const { verifyEmail } = useAuth();
  
  return useMutation({
    mutationFn: (data: EmailVerificationInput) => verifyEmail(data),
  });
};

// Hook for resending verification code
export const useResendVerification = (): UseMutationResult<
  { userId: string }, 
  Error, 
  string
> => {
  const { resendVerification } = useAuth();
  
  return useMutation({
    mutationFn: (email: string) => resendVerification(email),
  });
};

// Hook for user login
export const useLogin = (): UseMutationResult<
  void, 
  Error, 
  { email: string; password: string }
> => {
  const { login } = useAuth();
  
  return useMutation({
    mutationFn: ({ email, password }) => login(email, password),
  });
};

// Hook for user logout
export const useLogout = (): UseMutationResult<void, Error, void> => {
  const { logout } = useAuth();
  
  return useMutation({
    mutationFn: () => logout(),
  });
};