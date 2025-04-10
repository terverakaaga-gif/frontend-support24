
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

const Index = () => {
  const { user, isLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isLoading) return;

    if (!user) {
      navigate('/login');
      return;
    }

    // Redirect based on user role
    switch (user.role) {
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
        navigate('/login');
    }
  }, [user, isLoading, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-pulse">Loading...</div>
    </div>
  );
};

export default Index;
