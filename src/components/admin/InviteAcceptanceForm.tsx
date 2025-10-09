import { useState } from "react";
import { format } from "date-fns";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, DollarSign, Clock, CheckCircle, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { FlattenedInvite, ProcessInviteRequest, ServiceAgreement } from "@/entities/Invitation";
import { useProcessInvite } from "@/hooks/useInviteHooks";
import { toast } from "@/hooks/use-toast";

interface InviteAcceptanceFormProps {
  invite: FlattenedInvite;
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

// Format currency
const formatCurrency = (amount: number) => {
  return `$${amount.toFixed(2)}`;
};

export function InviteAcceptanceForm({ invite, isOpen, onClose, onSuccess }: InviteAcceptanceFormProps) {
  const [adminNotes, setAdminNotes] = useState("");
  const [startDate, setStartDate] = useState<Date>(new Date());
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);

  const processInviteMutation = useProcessInvite();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Prepare the service agreement from the proposed rates
    const serviceAgreement: ServiceAgreement = {
      baseHourlyRate: invite.proposedRates.baseHourlyRate,
      shiftRates: invite.proposedRates.shiftRates.map(rate => ({
        rateTimeBandId: rate.rateTimeBandId._id,
        hourlyRate: rate.hourlyRate
      })),
      distanceTravelRate: invite.proposedRates.distanceTravelRate,
      startDate: format(startDate, 'yyyy-MM-dd'),
      termsAccepted: true
    };

    // Prepare the request body
    const requestData: ProcessInviteRequest = {
      status: 'accepted',
      adminNotes: adminNotes.trim() || undefined,
      serviceAgreement
    };

    try {
      await processInviteMutation.mutateAsync({
        organizationId: invite.organizationId,
        inviteId: invite.inviteId,
        data: requestData
      });

      toast({
        title: "Invitation Accepted",
        description: `Successfully accepted invitation for ${invite.workerName}`,
      });

      onSuccess?.();
      onClose();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to accept invitation. Please try again.",
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
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-green-600" />
            Accept Invitation
          </DialogTitle>
          <DialogDescription>
            Review the proposed rates and complete the acceptance for {invite.workerName}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Status (Read-only) */}
          <div className="space-y-2">
            <Label htmlFor="status">Status</Label>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                <CheckCircle className="h-3 w-3 mr-1" />
                Accepted
              </Badge>
            </div>
          </div>

          {/* Proposed Rates (Read-only) */}
          <div className="space-y-4">
            <div>
              <Label className="text-base font-medium">Proposed Service Agreement</Label>
              <p className="text-sm text-muted-foreground">
                These rates will be used for the service agreement
              </p>
            </div>

            {/* Base Hourly Rate */}
            <div className="p-4 bg-muted/50 rounded-lg space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <DollarSign className="h-4 w-4 text-green-600" />
                  <span className="font-medium">Base Hourly Rate</span>
                </div>
                <span className="text-lg font-montserrat-semibold text-green-600">
                  {formatCurrency(invite.proposedRates.baseHourlyRate)}
                </span>
              </div>

              <Separator />

              {/* Shift Rates */}
              <div className="space-y-2">
                <h4 className="font-medium text-sm">Shift Rate Breakdown</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {invite.proposedRates.shiftRates.map((rate) => (
                    <div key={rate._id} className="flex items-center justify-between p-2 bg-white rounded border">
                      <div>
                        <p className="text-sm font-medium">{rate.rateTimeBandId.name}</p>
                        {rate.rateTimeBandId.startTime && rate.rateTimeBandId.endTime && (
                          <p className="text-xs text-muted-foreground">
                            {rate.rateTimeBandId.startTime} - {rate.rateTimeBandId.endTime}
                          </p>
                        )}
                      </div>
                      <span className="text-sm font-montserrat-semibold text-green-600">
                        {formatCurrency(rate.hourlyRate)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <Separator />

              {/* Distance Travel Rate */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-primary" />
                  <span className="font-medium">Distance Travel Rate</span>
                </div>
                <span className="text-lg font-montserrat-semibold text-primary">
                  {formatCurrency(invite.proposedRates.distanceTravelRate)}
                </span>
              </div>
            </div>
          </div>

          {/* Start Date */}
          <div className="space-y-2">
            <Label htmlFor="startDate">Service Start Date *</Label>
            <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !startDate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {startDate ? format(startDate, "PPP") : "Pick a date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={startDate}
                  onSelect={(date) => {
                    setStartDate(date || new Date());
                    setIsCalendarOpen(false);
                  }}
                  initialFocus
                  disabled={(date) => date < new Date()}
                />
              </PopoverContent>
            </Popover>
          </div>

          {/* Admin Notes */}
          <div className="space-y-2">
            <Label htmlFor="adminNotes">Admin Notes (Optional)</Label>
            <Textarea
              id="adminNotes"
              value={adminNotes}
              onChange={(e) => setAdminNotes(e.target.value)}
              placeholder="Add any additional notes about this acceptance..."
              className="min-h-[100px]"
              disabled={processInviteMutation.isPending}
            />
          </div>

          {/* Terms */}
          <div className="p-4 bg-primary-100 rounded-lg">
            <div className="flex items-center gap-2 text-primary-700">
              <CheckCircle className="h-4 w-4" />
              <span className="text-sm font-medium">
                Terms and conditions will be automatically accepted upon submission
              </span>
            </div>
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
              disabled={processInviteMutation.isPending}
              className="bg-green-600 hover:bg-green-700"
            >
              {processInviteMutation.isPending && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              Accept Invitation
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
} 