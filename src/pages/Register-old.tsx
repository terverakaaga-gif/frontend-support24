import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { RegistrationForm } from "@/components/auth/RegistrationForm";
import { OTPVerification } from "@/components/auth/OTPVerification";
import { SupportWorkerSetup } from "@/components/auth/SupportWorkerSetup";
import { UserRegistrationInput } from "@/entities/UserRegistration";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { Heart, Users, Calendar, MessageSquare } from "lucide-react";
import { motion } from "framer-motion";

type RegistrationStep = 'form' | 'verification' | 'setup';

export default function RegisterOld() {
  const navigate = useNavigate();
  const { register, verifyEmail, completeOnboarding, user } = useAuth();
  const [currentStep, setCurrentStep] = useState<RegistrationStep>('form');
  const [registrationData, setRegistrationData] = useState<UserRegistrationInput | null>(null);

  useEffect(() => {
    if (user && !user.isOnboarded && user.isEmailVerified) {
      if (user.role === 'support-worker') {
        setCurrentStep('setup');
      } else {
        redirectToDashboard(user.role);
      }
    } else if (user && user.isOnboarded && user.isEmailVerified) {
      redirectToDashboard(user.role);
    }
  }, [user]);

  const handleRegistration = async (data: UserRegistrationInput) => {
    setRegistrationData(data);
    
    try {
      await register(data);
      setCurrentStep('verification');
      toast.success(`Verification code sent to ${data.email}`);
    } catch (error) {
      toast.error('Registration failed. Please try again.');
    }
  };

  const handleVerification = async () => {
    if (!registrationData) return;
    
    try {
      await verifyEmail(registrationData.email);
      if (registrationData.role === 'support-worker') {
        setCurrentStep('setup');
      } else {
        redirectToDashboard(registrationData.role);
      }
    } catch (error) {
      toast.error('Verification failed. Please try again.');
    }
  };

  const handleResendOTP = async () => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    toast.success(`New verification code sent to ${registrationData?.email}`);
  };

  const handleSetupComplete = () => {
    if (!user) return;
    
    completeOnboarding();
    toast.success('Profile setup completed successfully!');
    navigate('/support-worker');
  };

  const redirectToDashboard = (role: string) => {
    switch (role) {
      case 'admin':
        navigate('/admin');
        break;
      case 'guardian':
        navigate('/guardian');
        break;
      case 'participant':
        navigate('/participant');
        break;
      case 'support-worker':
        navigate('/support-worker');
        break;
      default:
        navigate('/');
    }
  };

  return (
    <div className="flex h-screen w-full overflow-hidden">
      <motion.div 
        initial={{ x: -50, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full md:w-1/2 p-8 flex items-center justify-center"
      >
        {currentStep === 'form' && (
          <div className="w-full max-w-md">
            <div className="text-center mb-6">
              <h1 className="text-3xl font-bold">Create an Account</h1>
              <p className="text-muted-foreground">Join our community of care providers and participants</p>
            </div>
            <RegistrationForm onSubmit={handleRegistration} />
            <div className="mt-6 text-center text-sm text-muted-foreground">
              Have an account already?{" "}
              <a href="/login" className="text-guardian font-medium hover:underline">
                Login here...
              </a>
            </div>
          </div>
        )}
        
        {currentStep === 'verification' && registrationData && (
          <div className="w-full max-w-md">
            <OTPVerification 
              email={registrationData.email} 
              onVerified={handleVerification}
              onResend={handleResendOTP}
            />
          </div>
        )}
        
        {currentStep === 'setup' && user && (
          <div className="w-full">
            <SupportWorkerSetup onComplete={handleSetupComplete} />
          </div>
        )}
      </motion.div>

      <motion.div 
        initial={{ x: 50, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="hidden md:flex md:w-1/2 bg-gradient-to-br from-guardian-light to-guardian p-12 flex-col justify-between"
      >
        <div className="mb-auto">
          <div className="flex items-center gap-2 mb-2">
            <Heart className="h-8 w-8 text-white" />
            <span className="text-2xl font-bold text-white">Guardian Care Pro</span>
          </div>
        </div>
        
        <div className="space-y-6 max-w-md">
          <h1 className="text-4xl font-bold text-white">Join our caring community</h1>
          <p className="text-white/90 text-lg">
            Guardian Care Pro connects participants, guardians, and support workers in a seamless care ecosystem.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white/20 backdrop-blur-sm p-4 rounded-lg border border-white/30 flex flex-col items-center">
              <Users className="h-8 w-8 text-white mb-2" />
              <h3 className="text-white font-medium">Connect</h3>
              <p className="text-white/80 text-sm text-center">Find qualified care professionals</p>
            </div>
            <div className="bg-white/20 backdrop-blur-sm p-4 rounded-lg border border-white/30 flex flex-col items-center">
              <Calendar className="h-8 w-8 text-white mb-2" />
              <h3 className="text-white font-medium">Schedule</h3>
              <p className="text-white/80 text-sm text-center">Manage appointments easily</p>
            </div>
            <div className="bg-white/20 backdrop-blur-sm p-4 rounded-lg border border-white/30 flex flex-col items-center">
              <MessageSquare className="h-8 w-8 text-white mb-2" />
              <h3 className="text-white font-medium">Communicate</h3>
              <p className="text-white/80 text-sm text-center">Stay in touch with your team</p>
            </div>
            <div className="bg-white/20 backdrop-blur-sm p-4 rounded-lg border border-white/30 flex flex-col items-center">
              <Heart className="h-8 w-8 text-white mb-2" />
              <h3 className="text-white font-medium">Care</h3>
              <p className="text-white/80 text-sm text-center">Provide the best support possible</p>
            </div>
          </div>
        </div>
        
        <div className="mt-auto">
          <p className="text-white/70 text-sm">
            © 2025 Guardian Care Pro. All rights reserved.
          </p>
        </div>
      </motion.div>
    </div>
  );
}