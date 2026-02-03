import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import Loader from "@/components/Loader";
import ParticipantSetup from "@/components/participant/onboarding";

export default function ParticipantSetupPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Short timeout to prevent flash of loading state
    const timer = setTimeout(() => setLoading(false), 300);
    
    // If no user is logged in, redirect to login
    if (!user) {
      navigate('/login');
      return;
    }

    // If user is not a particpant redirect to their dashboard
    if (user.role !== 'participant') {
      redirectToDashboard(user.role);
      return;
    }

    return () => clearTimeout(timer);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, navigate]);

  const handleSetupComplete = () => {
    // Navigate to dashboard after successful onboarding
    navigate('/participant');
  };

  const handleSkipSetup = () => {
    navigate('/participant');
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
      case 'coordinator':
        navigate('/support-coordinator');
        break;
      case 'provider':
        navigate('/provider');
        break;
      default:
        navigate('/');
    }
  };

  // Show loading while checking auth
  if (loading) {
    return (
      <Loader/>
    );
  }

  // Only render the setup component if user is a participant who needs setup
  if (!user || user.role !== 'participant') {
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
          <h1 className="text-lg font-montserrat-semibold">Profile Setup</h1>
          <div className="w-24"></div> 
        </div>
      </div> */}
      <ParticipantSetup />
    </div>
  );
}