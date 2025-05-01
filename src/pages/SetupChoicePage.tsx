import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { AlertCircle, CheckCircle, UserCog, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { SupportWorker } from "@/types/user.types";

export default function SetupChoicePage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const supportWorker = user as SupportWorker | null;

  useEffect(() => {
    // If no user is logged in, redirect to login
    if (!user) {
      navigate('/login');
      return;
    }

    // If user is not a support worker, redirect to their dashboard
    if (user.role !== 'supportWorker') {
      redirectToDashboard(user.role);
      return;
    }

    // If support worker has already completed profile setup, redirect to dashboard
    if (supportWorker?.verificationStatus.profileSetupComplete) {
      navigate('/support-worker');
      return;
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, navigate]);

  const handleSkipSetup = () => {
    toast.success("Account created successfully!");
    toast.warning("Remember to complete your profile setup when you're ready.");
    navigate('/support-worker');
  };

  const handleContinueToSetup = () => {
    navigate('/support-worker-setup');
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
      case 'supportWorker':
        navigate('/support-worker');
        break;
      default:
        navigate('/');
    }
  };

  if (!user || user.role !== 'supportWorker') {
    return null; // Return null during the redirect, the useEffect will handle navigation
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-2xl w-full mx-4"
      >
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          {/* Header */}
          <div className="bg-guardian p-6 text-white">
            <div className="flex items-center justify-center space-x-2 mb-2">
              <CheckCircle className="h-7 w-7" />
              <h1 className="text-2xl font-bold">Registration Complete!</h1>
            </div>
            <p className="text-center text-white/90">
              Your account has been created successfully.
            </p>
          </div>
          
          {/* Content */}
          <div className="p-6 md:p-8">
            <div className="text-center mb-8">
              <h2 className="text-xl font-bold mb-2">Welcome to Guardian Care Pro</h2>
              <p className="text-gray-600">
                Would you like to complete your profile setup now or later?
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 gap-6 mb-8">
              {/* Complete Setup Option */}
              <div className="border border-guardian rounded-lg p-5 hover:bg-guardian/5 transition-colors">
                <div className="flex justify-center mb-4">
                  <div className="bg-guardian/10 p-3 rounded-full">
                    <UserCog className="h-8 w-8 text-guardian" />
                  </div>
                </div>
                <h3 className="text-lg font-semibold text-center mb-2">Complete Setup Now</h3>
                <p className="text-gray-600 text-sm mb-4 text-center">
                  Set up your profile with skills, experience, and availability to be visible to participants.
                </p>
                <div className="bg-blue-50 border border-blue-100 rounded-md p-3 mb-4">
                  <div className="flex items-start">
                    <AlertCircle className="h-5 w-5 text-blue-500 mr-2 mt-0.5 flex-shrink-0" />
                    <p className="text-xs text-blue-700">
                      A complete profile increases your visibility and chances of being matched with participants.
                    </p>
                  </div>
                </div>
                <Button 
                  className="w-full"
                  onClick={handleContinueToSetup}
                >
                  Complete setup
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
              
              {/* Skip Setup Option */}
              <div className="border border-gray-200 rounded-lg p-5 hover:bg-gray-50 transition-colors">
                <div className="flex justify-center mb-4">
                  <div className="bg-gray-100 p-3 rounded-full">
                    <ArrowRight className="h-8 w-8 text-gray-500" />
                  </div>
                </div>
                <h3 className="text-lg font-semibold text-center mb-2">Skip for Now</h3>
                <p className="text-gray-600 text-sm mb-4 text-center">
                  Go directly to your dashboard. You can complete your profile setup later.
                </p>
                <div className="bg-amber-50 border border-amber-100 rounded-md p-3 mb-4">
                  <div className="flex items-start">
                    <AlertCircle className="h-5 w-5 text-amber-500 mr-2 mt-0.5 flex-shrink-0" />
                    <p className="text-xs text-amber-700">
                      Your profile will be incomplete and less visible to participants until you complete setup.
                    </p>
                  </div>
                </div>
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={handleSkipSetup}
                >
                  Skip to dashboard
                </Button>
              </div>
            </div>
            
            <p className="text-center text-sm text-gray-500">
              You can always access the profile setup from your dashboard later.
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}