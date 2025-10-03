import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { SupportWorkerSetup } from "@/components/auth/SupportWorkerSetup";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { SupportWorker } from "@/types/user.types";

export default function SupportWorkerSetupPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const supportWorker = user as SupportWorker | null;
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Short timeout to prevent flash of loading state
    const timer = setTimeout(() => setLoading(false), 300);
    
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

    // If support worker has already completed onboarding, show a message
    // if (supportWorker?.verificationStatus.profileSetupComplete) {
    //   toast.success("Your profile is already set up!");
    //   navigate('/support-worker');
    //   return;
    // }

    return () => clearTimeout(timer);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, navigate]);

  const handleSetupComplete = () => {
    // Navigate to dashboard after successful onboarding
    navigate('/support-worker');
  };

  const handleSkipSetup = () => {
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
      case 'supportWorker':
        navigate('/support-worker');
        break;
      default:
        navigate('/');
    }
  };

  // Show loading while checking auth
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading...
      </div>
    );
  }

  // Only render the setup component if user is a support worker who needs setup
  if (!user || user.role !== 'supportWorker') {
    return null; // Return null during the redirect, the useEffect will handle navigation
  }

  return (
    <div className="w-full">
      {/* <div className="bg-white shadow-sm py-2 mb-4">
        <div className="container mx-auto px-4 flex justify-between items-center">
          <Button 
            variant="ghost" 
            className="flex items-center" 
            onClick={handleSkipSetup}
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back to Dashboard
          </Button>
          <h1 className="text-lg font-semibold">Profile Setup</h1>
          <div className="w-24"></div> 
        </div>
      </div> */}
      <SupportWorkerSetup 
        onComplete={handleSetupComplete} 
      />
    </div>
  );
}