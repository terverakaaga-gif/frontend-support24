import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";

interface ProfileSetupAlertProps {
  userName: string;
}

export function ProfileSetupAlert({ userName }: ProfileSetupAlertProps) {
  const [dismissed, setDismissed] = useState(false);
  const navigate = useNavigate();

  if (dismissed) {
    return null;
  }

  return (
    <Alert variant="destructive" className="my-4 border-red-300 bg-red-50">
      <div className="flex items-start">
        <AlertTriangle className="h-5 w-5 text-red-600 mr-2 mt-0.5" />
        <div className="flex-1">
          <AlertTitle className="text-red-800 mb-1">Your profile setup is incomplete</AlertTitle>
          <AlertDescription className="text-red-700">
            <p className="mb-2">
              Hi {userName}, your profile is missing important information that participants need to see before they can book with you. Without a complete profile, you'll be less visible in search results.
            </p>
            <div className="flex flex-wrap items-center gap-3 mt-3">
              <Button 
                variant="destructive" 
                onClick={() => navigate('/support-worker-setup')}
                className="bg-red-600 hover:bg-red-700"
              >
                Complete setup now
              </Button>
              <Button 
                variant="outline" 
                onClick={() => setDismissed(true)}
                className="border-red-300 text-red-600 hover:bg-red-50 hover:text-red-700"
              >
                Remind me later
              </Button>
            </div>
          </AlertDescription>
        </div>
      </div>
    </Alert>
  );
}