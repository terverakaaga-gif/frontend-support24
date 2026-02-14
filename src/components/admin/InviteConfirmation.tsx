import { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { 
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle 
} from "@/components/ui/card";
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { toast } from "@/hooks/use-toast";
import { AltArrowLeft, ChatRound, CheckCircle, CloseCircle, Plain2 } from "@solar-icons/react";

// Types for the action
type ActionType = "make-available" | "accept" | "decline" | null;

export function InviteConfirmation() {
  const { inviteId } = useParams<{ inviteId: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const [actionType, setActionType] = useState<ActionType>(null);
  const [confirming, setConfirming] = useState(false);
  const [actionCompleted, setActionCompleted] = useState(false);
  const [inviteDetails, setInviteDetails] = useState<any | null>(null);

  // Extract the action from URL query parameters
  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const action = queryParams.get("action") as ActionType;
    
    if (action && ["make-available", "accept", "decline"].includes(action)) {
      setActionType(action);
    } else {
      // If no valid action, redirect back to details page
      navigate(`/admin/invites/${inviteId}/details`);
    }

    // Simulate fetching invite details
    setTimeout(() => {
      setInviteDetails({
        inviteId,
        participantName: "Adams Ben",
        workerName: "Priscilla Friday",
        inviteDate: new Date().toISOString(),
        status: "pending"
      });
    }, 300);
  }, [location.search, inviteId, navigate]);

  const getActionContent = () => {
    switch (actionType) {
      case "make-available":
        return {
          title: "Make Invitation Available",
          description: "You're about to make this invitation available to the support worker.",
          confirmText: "This will notify the support worker that they have a new connection request. They will be able to view and respond to the invitation.",
          icon: <Plain2 className="h-12 w-12 text-primary-500 mb-2" />,
          color: "primary",
          buttonText: "Make Available",
          successMessage: "Invitation has been made available to the support worker."
        };
      case "accept":
        return {
          title: "Accept Invitation",
          description: "You're about to accept this invitation on behalf of the support worker.",
          confirmText: "This will create a connection between the participant and support worker. Both parties will be notified of this action.",
          icon: <CheckCircle className="h-12 w-12 text-green-500 mb-2" />,
          color: "green",
          buttonText: "Accept Invitation",
          successMessage: "Invitation has been accepted successfully."
        };
      case "decline":
        return {
          title: "Decline Invitation",
          description: "You're about to decline this invitation on behalf of the support worker.",
          confirmText: "This will reject the connection request. The participant will be notified that their request was declined.",
          icon: <CloseCircle className="h-12 w-12 text-red-500 mb-2" />,
          color: "red",
          buttonText: "Decline Invitation",
          successMessage: "Invitation has been declined."
        };
      default:
        return {
          title: "Invalid Action",
          description: "The requested action is not valid.",
          confirmText: "Please return to the invitation details page and try again.",
          icon: <CloseCircle className="h-12 w-12 text-gray-1000 mb-2" />,
          color: "gray",
          buttonText: "Go Back",
          successMessage: ""
        };
    }
  };

  const handleConfirmAction = () => {
    setConfirming(true);
    
    // Simulate API call
    setTimeout(() => {
      setConfirming(false);
      setActionCompleted(true);
      
      // Show toast notification
      toast({
        title: getActionContent().successMessage,
        description: `Action completed for invitation from ${inviteDetails?.participantName} to ${inviteDetails?.workerName}.`,
      });
    }, 1500);
  };

  const handleGoBack = () => {
    navigate(`/admin/invites/${inviteId}/details`);
  };

  const handleGoToInvites = () => {
    navigate("/admin/invites");
  };

  if (!inviteDetails || !actionType) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  const actionContent = getActionContent();
  const colorClass = {
    primary: "border-primary-200 bg-primary-100",
    green: "border-green-200 bg-green-50",
    red: "border-red-200 bg-red-50",
    gray: "border-gray-200 bg-gray-100"
  }[actionContent.color as keyof typeof colorClass];

  return (
    <div className="container mx-auto py-8 max-w-3xl">
      <Button variant="ghost" size="sm" onClick={handleGoBack} className="mb-6">
        <AltArrowLeft className="h-4 w-4 mr-2" />
        Back to Invitation Details
      </Button>
      
      <Card className="border-2 shadow-sm">
        <CardHeader className={`border-b ${colorClass}`}>
          <div className="flex flex-col items-center text-center">
            {actionContent.icon}
            <CardTitle className="text-xl">{actionContent.title}</CardTitle>
            <CardDescription className="mt-1">
              {actionContent.description}
            </CardDescription>
          </div>
        </CardHeader>
        
        <CardContent className="pt-6">
          {!actionCompleted ? (
            <div className="space-y-6">
              <div className="p-4 border rounded-lg">
                <h3 className="font-montserrat-semibold mb-2">Invitation Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">Participant:</p>
                    <p className="font-montserrat-semibold">{inviteDetails.participantName}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Support Worker:</p>
                    <p className="font-montserrat-semibold">{inviteDetails.workerName}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Invitation Date:</p>
                    <p className="font-montserrat-semibold">
                      {new Date(inviteDetails.inviteDate).toLocaleDateString('en-AU', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                      })}
                    </p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Status:</p>
                    <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-300">
                      Pending
                    </Badge>
                  </div>
                </div>
              </div>
              
              <div className="bg-muted/40 p-4 rounded-lg">
                <p className="text-sm">{actionContent.confirmText}</p>
              </div>
              
              <Separator />
              
              <div className="flex flex-col gap-4">
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button 
                      className={`w-full ${
                        actionContent.color === "green" ? "bg-green-600 hover:bg-green-700" :
                        actionContent.color === "red" ? "bg-red-600 hover:bg-red-700" :
                        actionContent.color === "primary" ? "bg-primary hover:bg-primary-700" : ""
                      }`}
                    >
                      {confirming ? (
                        <>
                          <div className="animate-spin h-4 w-4 border-2 border-current border-t-transparent rounded-full mr-2"></div>
                          Processing...
                        </>
                      ) : (
                        actionContent.buttonText
                      )}
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Confirm {actionContent.title}</AlertDialogTitle>
                      <AlertDialogDescription>
                        Are you sure you want to {actionType} this invitation? This action cannot be undone.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction onClick={handleConfirmAction}>Confirm</AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
                
                <Button variant="outline" onClick={handleGoBack}>
                  Cancel
                </Button>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center py-8 text-center space-y-6">
              <div className="rounded-full bg-green-100 p-3">
                <CheckCircle className="h-12 w-12 text-green-600" />
              </div>
              
              <div>
                <h2 className="text-xl font-montserrat-semibold mb-1">Action Completed Successfully</h2>
                <p className="text-muted-foreground">
                  {actionContent.successMessage}
                </p>
              </div>
              
              <div className="space-y-3 w-full max-w-xs">
                <Button className="w-full" onClick={handleGoToInvites}>
                  Return to Invitations
                </Button>
                
                <Button variant="outline" className="w-full" onClick={handleGoBack}>
                  Back to Invitation Details
                </Button>
                
                {actionType === "accept" && (
                  <Button variant="outline" className="w-full" onClick={() => navigate(`/admin/chat/${inviteId}`)}>
                    <ChatRound className="h-4 w-4 mr-2" />
                    Open Chat with Support Worker
                  </Button>
                )}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}