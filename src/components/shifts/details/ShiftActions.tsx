import React from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { CheckCircle, CloseCircle as RejectIcon, ClockCircle, CloseCircle } from "@solar-icons/react";
import { Spinner } from "@/components/Spinner";
import { toast } from "sonner";

interface Props {
  status: string; // "pending" | "confirmed" | "inProgress"
  viewMode: "worker" | "participant";
  showRejectReason: boolean;
  rejectReason: string;
  isPendingAction: boolean; // loading state
  shiftStartTime: string; // ISO datetime string for the shift start
  onSetRejectReason: (val: string) => void;
  onShowReject: (show: boolean) => void;
  onAccept: () => void;
  onReject: () => void; // Worker declining pending shift
  onStart: () => void;
  onCancel: () => void; // Participant cancelling shift
  onComplete: () => void;
}

export const ShiftActions = React.memo(({ 
  status, viewMode, showRejectReason, rejectReason, isPendingAction, shiftStartTime,
  onSetRejectReason, onShowReject, onAccept, onReject, onStart, onCancel, onComplete
}: Props) => {
  
  // Helper to check if current time is at or past shift start time
  const canStartShift = () => {
    const now = new Date().getTime();
    const shiftStart = new Date(shiftStartTime).getTime();
    return now >= shiftStart;
  };

  // Handler for start button with validation
  const handleStartClick = () => {
    if (!canStartShift()) {
      const shiftStart = new Date(shiftStartTime);
      const formattedTime = shiftStart.toLocaleString("en-US", {
        month: "short",
        day: "numeric",
        hour: "numeric",
        minute: "2-digit",
        hour12: true
      });
      toast.error(`Shift cannot be started before ${formattedTime}`);
      return;
    }
    onStart();
  };

  if (viewMode === "worker") {
    // WORKER ACTIONS
    if (status === "pending" && !showRejectReason) {
      return (
        <div className="flex flex-col sm:flex-row gap-3">
          <Button 
            onClick={onAccept} 
            disabled={isPendingAction} 
            className="flex items-center gap-2 bg-green-600 hover:bg-green-700"
          >
            {isPendingAction ? (
              <>
                <Spinner /> Accepting...
              </>
            ) : (
              <>
                <CheckCircle className="w-4 h-4" /> Accept Shift
              </>
            )}
          </Button>
          <Button 
            variant="outline" 
            onClick={() => onShowReject(true)} 
            disabled={isPendingAction} 
            className="flex items-center gap-2 text-red-600 border-red-600 hover:bg-red-50"
          >
            <RejectIcon className="w-4 h-4" /> Decline Shift
          </Button>
        </div>
      );
    }

    if (status === "confirmed" && !showRejectReason) {
      return (
        <div className="flex flex-col sm:flex-row gap-3">
          <Button 
            onClick={handleStartClick} 
            disabled={isPendingAction} 
            className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700"
          >
            {isPendingAction ? (
              <>
                <Spinner /> Starting...
              </>
            ) : (
              <>
                <ClockCircle className="w-4 h-4" /> Start Shift
              </>
            )}
          </Button>
        </div>
      );
    }

    if (status === "inProgress") {
      return (
        <Button 
          onClick={onComplete} 
          disabled={isPendingAction} 
          className="flex items-center gap-2 bg-green-600 hover:bg-green-700 w-full sm:w-auto"
        >
          {isPendingAction ? (
            <>
              <Spinner /> Completing...
            </>
          ) : (
            <>
              <CheckCircle className="w-4 h-4" /> Complete Shift
            </>
          )}
        </Button>
      );
    }
  } 
  
  // PARTICIPANT ACTIONS (Can cancel at any time except completed/cancelled)
  if (viewMode === "participant" && !["completed", "cancelled"].includes(status) && !showRejectReason) {
    return (
      <Button 
        variant="outline" 
        onClick={() => onShowReject(true)} 
        className="flex items-center gap-2 text-red-600 border-red-600 hover:bg-red-50"
      >
        <CloseCircle className="w-4 h-4" /> Cancel Shift
      </Button>
    );
  }

  // REJECTION / CANCELLATION FORM
  if (showRejectReason) {
    const isWorkerRejecting = viewMode === "worker" && status === "pending";
    const isParticipantCancelling = viewMode === "participant";
    
    return (
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="reason" className="text-red-600">
            {isWorkerRejecting ? "Decline Reason *" : "Cancellation Reason *"}
          </Label>
          <Textarea 
            id="reason" 
            value={rejectReason} 
            onChange={(e) => onSetRejectReason(e.target.value)} 
            placeholder="Please provide a reason..." 
            rows={3} 
            className="border-red-300 focus:border-red-500" 
          />
        </div>
        <div className="flex gap-3">
          <Button 
            onClick={isWorkerRejecting ? onReject : onCancel} 
            disabled={isPendingAction || !rejectReason.trim()} 
            variant="destructive" 
            className="flex items-center gap-2"
          >
            {isPendingAction ? (
              <Spinner />
            ) : (
              <RejectIcon className="w-4 h-4" />
            )} 
            {isWorkerRejecting ? "Decline" : "Cancel"}
          </Button>
          <Button 
            variant="outline" 
            onClick={() => { 
              onShowReject(false); 
              onSetRejectReason(""); 
            }} 
            disabled={isPendingAction}
          >
            Cancel
          </Button>
        </div>
      </div>
    );
  }

  return null;
});

ShiftActions.displayName = "ShiftActions";