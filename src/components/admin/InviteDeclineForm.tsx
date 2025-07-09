import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { XCircle, Loader2 } from "lucide-react";
import { FlattenedInvite, ProcessInviteRequest } from "@/entities/Invitation";
import { useProcessInvite } from "@/hooks/useInviteHooks";
import { toast } from "@/hooks/use-toast";

interface InviteDeclineFormProps {
  invite: FlattenedInvite;
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export function InviteDeclineForm({ invite, isOpen, onClose, onSuccess }: InviteDeclineFormProps) {
  const [adminNotes, setAdminNotes] = useState("");
  const [declineReason, setDeclineReason] = useState("");

  const processInviteMutation = useProcessInvite();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate required fields
    if (!declineReason.trim()) {
      toast({
        title: "Validation Error",
        description: "Please provide a decline reason.",
        variant: "destructive",
      });
      return;
    }

    // Prepare the request body for decline
    const requestData: ProcessInviteRequest = {
      status: 'declined',
      adminNotes: adminNotes.trim() || undefined,
      declineReason: declineReason.trim() || undefined,
      // No service agreement needed for decline
    };

    try {
      await processInviteMutation.mutateAsync({
        organizationId: invite.organizationId,
        inviteId: invite.inviteId,
        data: requestData
      });

      toast({
        title: "Invitation Declined",
        description: `Successfully declined invitation for ${invite.workerName}`,
      });

      onSuccess?.();
      onClose();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to decline invitation. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleClose = () => {
    if (!processInviteMutation.isPending) {
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <XCircle className="h-5 w-5 text-red-600" />
            Decline Invitation
          </DialogTitle>
          <DialogDescription>
            Please provide a reason for declining the invitation for {invite.workerName}.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Status (Read-only) */}
          <div className="space-y-2">
            <Label htmlFor="status">Status</Label>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
                <XCircle className="h-3 w-3 mr-1" />
                Declined
              </Badge>
            </div>
          </div>

          {/* Decline Reason */}
          <div className="space-y-2">
            <Label htmlFor="declineReason">Decline Reason *</Label>
            <Textarea
              id="declineReason"
              value={declineReason}
              onChange={(e) => setDeclineReason(e.target.value)}
              placeholder="e.g., Support worker is unable to agree with the proposed rates"
              className="min-h-[100px]"
              disabled={processInviteMutation.isPending}
              required
            />
          </div>

          {/* Admin Notes */}
          <div className="space-y-2">
            <Label htmlFor="adminNotes">Admin Notes (Optional)</Label>
            <Textarea
              id="adminNotes"
              value={adminNotes}
              onChange={(e) => setAdminNotes(e.target.value)}
              placeholder="e.g., Support worker is currently unavailable"
              className="min-h-[80px]"
              disabled={processInviteMutation.isPending}
            />
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={processInviteMutation.isPending}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={processInviteMutation.isPending || !declineReason.trim()}
              variant="destructive"
            >
              {processInviteMutation.isPending && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              Decline Invitation
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
} 