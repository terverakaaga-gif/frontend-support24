import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { RegistrationForm } from "@/components/auth/RegistrationForm";
import { OTPVerification } from "@/components/auth/OTPVerification";
import { UserRegistrationInput } from "@/types/user.types";
import { toast } from "sonner";
import { Heart, Users, Calendar, MessageSquare, ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";
import {
  useRegister,
  useVerifyEmail,
  useResendVerification,
} from "@/hooks/useAuthHooks";
import { Button } from "@/components/ui/button";

type RegistrationStep = "form" | "verification";

export default function Register() {
  const navigate = useNavigate();
  const register = useRegister();
  const verifyEmail = useVerifyEmail();
  const resendVerification = useResendVerification();

  const [currentStep, setCurrentStep] = useState<RegistrationStep>("form");
  const [registrationData, setRegistrationData] =
    useState<UserRegistrationInput | null>(null);
  const [userId, setUserId] = useState<string>("");

  const handleRegistration = async (data: UserRegistrationInput) => {
    setRegistrationData(data);

    try {
      const response = await register.mutateAsync(data);
      setUserId(response.userId);
      setCurrentStep("verification");
    } catch (error) {
      // Error handled by API client
      console.error("Registration failed:", error);
    }
  };

  const handleVerification = async (otpCode: string) => {
    if (!userId) {
      toast.error("User ID is missing. Please try registering again.");
      setCurrentStep("form");
      return;
    }

    try {
      await verifyEmail.mutateAsync({
        userId: userId,
        otpCode: otpCode,
      });

      // After verification, if user is a support worker, redirect to setup choice page
      if (registrationData?.role === "supportWorker") {
        navigate("/setup-choice");
      } else {
        redirectToDashboard(registrationData?.role || "participant");
      }
    } catch (error) {
      // Error handled by API client
      console.error("Verification failed:", error);
    }
  };

  const handleResendOTP = async () => {
    if (!registrationData?.email) {
      toast.error("Email is missing. Please try registering again.");
      setCurrentStep("form");
      return;
    }

    try {
      const response = await resendVerification.mutateAsync(
        registrationData.email
      );
      setUserId(response.userId);
    } catch (error) {
      // Error handled by API client
      console.error("Resend verification failed:", error);
    }
  };

  const redirectToDashboard = (role: string) => {
    switch (role) {
      case "admin":
        navigate("/admin");
        break;
      case "guardian":
        navigate("/guardian");
        break;
      case "participant":
        navigate("/participant");
        break;
      case "supportWorker":
        navigate("/support-worker");
        break;
      default:
        navigate("/");
    }
  };

  return (
    <div className="flex min-h-screen w-full overflow-hidden bg-gradient-to-br from-slate-50 to-gray-100">
      {/* Form section - Left side */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="w-full lg:w-1/2 flex items-center justify-center p-4 sm:p-8 md:p-12"
      >
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="w-full max-w-xl space-y-6 p-6 sm:p-8 md:p-10 bg-white/5 rounded-2xl "
        >
          {currentStep === "form" && (
            <>
              <motion.div
                initial={{ y: -10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4, duration: 0.5 }}
                className="text-center"
              >
                <h1 className="text-3xl font-bold tracking-tight text-gray-900">
                  Create your account
                </h1>
                <p className="mt-2 text-gray-600">
                  Join our community of care providers and participants
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5, duration: 0.5 }}
              >
                <RegistrationForm
                  onSubmit={handleRegistration}
                  isLoading={register.isPending}
                />
              </motion.div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6, duration: 0.5 }}
                className="text-center text-sm"
              >
                <span className="text-gray-600">Have an account already? </span>
                <a
                  href="/login"
                  className="text-guardian font-medium hover:text-guardian hover:underline transition-colors"
                >
                  Sign in
                </a>
              </motion.div>
            </>
          )}

          {currentStep === "verification" && registrationData && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="space-y-4"
            >
              <div className="mb-6">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setCurrentStep("form")}
                  className="flex items-center text-gray-600 hover:text-guardian"
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to registration
                </Button>
              </div>

              <OTPVerification
                email={registrationData.email}
                onVerified={handleVerification}
                onResend={handleResendOTP}
                isVerifying={verifyEmail.isPending}
                isResending={resendVerification.isPending}
              />
            </motion.div>
          )}
        </motion.div>
      </motion.div>

      {/* Brand section - Right side */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-guardian/90 via-guardian to-guardian/90 p-12 flex-col justify-between relative overflow-hidden"
      >
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.2)_0%,rgba(255,255,255,0)_60%)]"></div>

        <motion.div
          initial={{ y: -20 }}
          animate={{ y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="z-10 mb-auto"
        >
          <div className="flex items-center gap-2 mb-2">
            <Heart className="h-8 w-8 text-white drop-shadow-md" fill="white" />
            <span className="text-2xl font-bold text-white drop-shadow-sm">
              Guardian Care Pro
            </span>
          </div>
        </motion.div>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.7 }}
          className="z-10 space-y-8 max-w-md mx-auto "
        >
          <h1 className="text-4xl md:text-5xl font-bold text-white drop-shadow-sm">
            Join our caring community
          </h1>
          <p className="text-white/90 text-lg">
            Guardian Care Pro connects participants, guardians, and support
            workers in a seamless care ecosystem.
          </p>

          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.7, duration: 0.5 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-4"
          >
            <div className="bg-white/20 backdrop-blur-sm p-5 rounded-xl border border-white/30 flex flex-col items-center shadow-lg hover:bg-white/25 transition-all">
              <Users className="h-8 w-8 text-white mb-2" />
              <h3 className="text-white font-medium">Connect</h3>
              <p className="text-white/80 text-sm text-center">
                Find qualified care professionals
              </p>
            </div>
            <div className="bg-white/20 backdrop-blur-sm p-5 rounded-xl border border-white/30 flex flex-col items-center shadow-lg hover:bg-white/25 transition-all">
              <Calendar className="h-8 w-8 text-white mb-2" />
              <h3 className="text-white font-medium">Schedule</h3>
              <p className="text-white/80 text-sm text-center">
                Manage appointments easily
              </p>
            </div>
            <div className="bg-white/20 backdrop-blur-sm p-5 rounded-xl border border-white/30 flex flex-col items-center shadow-lg hover:bg-white/25 transition-all">
              <MessageSquare className="h-8 w-8 text-white mb-2" />
              <h3 className="text-white font-medium">Communicate</h3>
              <p className="text-white/80 text-sm text-center">
                Stay in touch with your team
              </p>
            </div>
            <div className="bg-white/20 backdrop-blur-sm p-5 rounded-xl border border-white/30 flex flex-col items-center shadow-lg hover:bg-white/25 transition-all">
              <Heart className="h-8 w-8 text-white mb-2" />
              <h3 className="text-white font-medium">Care</h3>
              <p className="text-white/80 text-sm text-center">
                Provide the best support possible
              </p>
            </div>
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9, duration: 0.5 }}
          className="z-10 mt-auto"
        >
          <p className="text-white/70 text-sm">
            © {new Date().getFullYear()} Guardian Care Pro. All rights reserved.
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
}
