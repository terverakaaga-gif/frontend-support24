
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { RegistrationForm } from "@/components/auth/RegistrationForm";
import { OTPVerification } from "@/components/auth/OTPVerification";
import { SupportWorkerSetup } from "@/components/auth/SupportWorkerSetup";
import { UserRegistrationInput } from "@/entities/UserRegistration";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

type RegistrationStep = 'form' | 'verification' | 'setup';

export default function Register() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [currentStep, setCurrentStep] = useState<RegistrationStep>('form');
  const [registrationData, setRegistrationData] = useState<UserRegistrationInput | null>(null);

  const handleRegistration = async (data: UserRegistrationInput) => {
    setRegistrationData(data);
    
    // For role-based flow
    if (data.role === 'support-worker') {
      setCurrentStep('verification');
      toast.success(`Verification code sent to ${data.email}`);
    } else {
      // For other roles, just mock the registration
      toast.success('Account created successfully!');
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // For demo purposes, we'll log in the user immediately
      try {
        await login(data.email, data.password);
        
        // Navigate to appropriate dashboard based on role
        switch (data.role) {
          case 'admin':
            navigate('/admin');
            break;
          case 'guardian':
            navigate('/guardian');
            break;
          case 'participant':
            navigate('/participant');
            break;
          default:
            navigate('/');
        }
      } catch (error) {
        toast.error('Failed to log in with new account');
      }
    }
  };

  const handleVerification = () => {
    setCurrentStep('setup');
  };

  const handleResendOTP = async () => {
    // In a real app, this would call an API endpoint to resend the code
    await new Promise(resolve => setTimeout(resolve, 1000));
    toast.success(`New verification code sent to ${registrationData?.email}`);
  };

  const handleSetupComplete = async () => {
    if (!registrationData) return;
    
    toast.success('Registration completed successfully!');
    
    try {
      // Log in the user first
      await login(registrationData.email, registrationData.password);
      
      // Directly navigate to support worker dashboard after login
      navigate('/support-worker');
    } catch (error) {
      console.error("Login error:", error);
      toast.error('Failed to log in with new account. Please go to the login page.');
      
      // Even if login fails, redirect to login page
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-muted/30 px-4 py-8">
      {currentStep === 'form' && (
        <div className="w-full max-w-md">
          <div className="bg-white shadow-lg rounded-lg p-6">
            <div className="text-center mb-6">
              <h1 className="text-2xl font-bold">Create an Account</h1>
              <p className="text-muted-foreground">Join our community of care providers and participants</p>
            </div>
            <RegistrationForm onSubmit={handleRegistration} />
            <div className="mt-6 text-center text-sm text-muted-foreground">
              Already have an account?{" "}
              <a href="/login" className="text-guardian hover:underline">
                Sign in
              </a>
            </div>
          </div>
        </div>
      )}
      
      {currentStep === 'verification' && registrationData && (
        <div className="w-full max-w-md bg-white shadow-lg rounded-lg p-6">
          <OTPVerification 
            email={registrationData.email} 
            onVerified={handleVerification}
            onResend={handleResendOTP}
          />
        </div>
      )}
      
      {currentStep === 'setup' && (
        <div className="w-full">
          <SupportWorkerSetup onComplete={handleSetupComplete} />
        </div>
      )}
    </div>
  );
}
