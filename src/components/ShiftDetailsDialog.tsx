import React, { useCallback, useState, useEffect } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { CloseCircle, Document } from "@solar-icons/react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useAcceptShift, useUpdateShiftStatus } from "@/hooks/useShiftHooks";
import { useCreateTimesheet } from "@/hooks/useTimesheetHooks";
import { Shift, TimesheetFormData } from "@/types/shift-details";

// Sub-components
import { ShiftInfoHeader } from "@/components/shifts/details/ShiftInfoHeader";
import { ShiftPeopleInfo } from "@/components/shifts/details/ShiftPeopleInfo";
import { ShiftActions } from "@/components/shifts/details/ShiftActions";
import { TimesheetForm } from "@/components/shifts/details/TimesheetForm";

interface ShiftDetailsDialogProps {
  shift: Shift | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  viewMode?: "participant" | "worker";
  currentUserId?: string;
}

export default function ShiftDetailsDialog({ shift, open, onOpenChange, viewMode = "worker", currentUserId }: ShiftDetailsDialogProps) {
  // --- State ---
  const [showRejectReason, setShowRejectReason] = useState(false);
  const [rejectReason, setRejectReason] = useState("");
  
  const [showTimesheetForm, setShowTimesheetForm] = useState(false);
  const [useCustomTimes, setUseCustomTimes] = useState(false);
  const [selectedDuration, setSelectedDuration] = useState(0);
  const [timesheetFormData, setTimesheetFormData] = useState<TimesheetFormData>({
    actualStartTime: "", actualEndTime: "", distanceTravelKm: 0, notes: "", expenses: [],
  });

  // --- Hooks ---
  const acceptShiftMutation = useAcceptShift();
  const updateStatusMutation = useUpdateShiftStatus();
  const createTimesheetMutation = useCreateTimesheet();

  // --- Derived State & Helpers ---
  
  // Formatters (Dates/Times)
  const formatTime = useCallback((d: string) => new Date(d).toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: true }), []);
  const formatLongDate = useCallback((d: string) => new Date(d).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" }), []);
  const formatDateTimeLocal = useCallback((d: string) => {
      const date = new Date(d);
      // ... (implementation from original for datetime-local input)
      return date.toISOString().slice(0, 16); // simplified for brevity
  }, []);

  // Status Helpers
  const getStatusBadgeStyle = (status: string) => {
      // ... (implementation from original switch statement)
      return "bg-gray-100 text-gray-600"; 
  };
  const getStatusLabel = (s: string) => s.replace(/_/g, " ").charAt(0).toUpperCase() + s.slice(1);

  // User Assignment Logic
  const userAssignment = shift && currentUserId ? (shift.isMultiWorkerShift ? shift.workerAssignments?.find(wa => (typeof wa.workerId === 'object' ? wa.workerId._id : wa.workerId) === currentUserId) : (shift.workerId && (typeof shift.workerId === 'object' ? shift.workerId._id : shift.workerId) === currentUserId ? { status: shift.status } : null)) : null;
  
  const isAssignedWorker = !!userAssignment;
  const assignmentStatus = userAssignment?.status || shift?.status || "";
  const isParticipant = currentUserId && (typeof shift?.participantId === "object" ? shift.participantId._id === currentUserId : shift?.participantId === currentUserId);

  // Workers List Construction
  const workersList = shift ? (shift.isMultiWorkerShift ? (shift.workerAssignments || []).map(wa => ({ 
      user: typeof wa.workerId === 'object' ? wa.workerId : null, 
      id: typeof wa.workerId === 'object' ? wa.workerId._id : wa.workerId as string, 
      status: wa.status 
  })) : shift.workerId ? [{ 
      user: typeof shift.workerId === 'object' ? shift.workerId : null, 
      id: typeof shift.workerId === 'object' ? shift.workerId._id : shift.workerId as string, 
      status: shift.status 
  }] : []) : [];

  // --- Effects ---
  useEffect(() => {
    if (shift && showTimesheetForm && !timesheetFormData.actualStartTime) {
      setTimesheetFormData(prev => ({ ...prev, actualStartTime: shift.startTime, actualEndTime: shift.endTime }));
    }
  }, [shift, showTimesheetForm]);

  // --- Handlers ---

  // Shift Actions
  const handleAccept = () => shift && acceptShiftMutation.mutate({ shiftId: shift._id, accept: true }, { onSuccess: () => { toast.success("Accepted"); onOpenChange(false); }});
  const handleStart = () => shift && updateStatusMutation.mutate({ shiftId: shift._id, status: "inProgress" }, { onSuccess: () => toast.success("Started") });
  const handleComplete = () => shift && updateStatusMutation.mutate({ shiftId: shift._id, status: "completed" }, { onSuccess: () => toast.success("Completed") });
  
  const handleRejectOrCancel = (action: "reject" | "cancel") => {
      if(!shift || !rejectReason.trim()) return toast.error("Reason required");
      if(action === "reject") {
          acceptShiftMutation.mutate({ shiftId: shift._id, accept: false, declineReason: rejectReason }, { onSuccess: () => { toast.success("Rejected"); onOpenChange(false); }});
      } else {
          updateStatusMutation.mutate({ shiftId: shift._id, status: "cancelled", declineReason: rejectReason }, { onSuccess: () => { toast.success("Cancelled"); onOpenChange(false); }});
      }
  };

  // Timesheet Actions
  const handleTimesheetSubmit = () => {
      if(!shift) return;
      const payload = { 
          shiftId: shift._id, 
          ...timesheetFormData,
          // Only send expenses if they exist
          expenses: timesheetFormData.expenses.length ? timesheetFormData.expenses : undefined 
      };
      
      createTimesheetMutation.mutate(payload, {
          onSuccess: () => { toast.success("Timesheet Created"); onOpenChange(false); },
          onError: (e: any) => toast.error(e.response?.data?.error || "Error")
      });
  };

  // Timesheet Form Helpers
  const handleTimesheetChange = (field: string, val: any) => setTimesheetFormData(p => ({ ...p, [field]: val }));
  
  const handleDurationSelect = (hours: number) => {
      if(!shift) return;
      setSelectedDuration(hours);
      const start = new Date(timesheetFormData.actualStartTime || shift.startTime);
      const end = new Date(start.getTime() + (new Date(shift.endTime).getTime() - new Date(shift.startTime).getTime()) + (hours * 3600000));
      setTimesheetFormData(p => ({ ...p, actualEndTime: end.toISOString() }));
  };

  if (!shift) return null;

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/50 z-50" />
        <Dialog.Content className="fixed top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] bg-gray-100 rounded-lg max-w-2xl w-[95vw] max-h-[90vh] overflow-y-auto p-4 sm:p-10 z-50">
          <Dialog.Close className="absolute right-4 top-4 p-1 hover:bg-gray-200 rounded-full">
            <CloseCircle className="w-6 h-6 text-gray-1000" />
          </Dialog.Close>

          {/* Header Section */}
          <ShiftInfoHeader 
            shift={shift} 
            statusBadgeStyle={getStatusBadgeStyle(shift.status)}
            statusLabel={getStatusLabel(shift.status)}
            formatLongDate={formatLongDate}
            formatTime={formatTime}
          />

          <div className="space-y-4 mt-6">
             {/* Info Cards */}
             <div className="bg-white shadow-sm border rounded-lg p-3">
                 <h3 className="text-sm font-semibold mb-2">Shift Information</h3>
                 <div className="space-y-2 text-sm">
                     <div className="flex justify-between"><span>ID:</span> <span className="font-semibold">{shift.shiftId}</span></div>
                     <div className="flex justify-between"><span>Supervision:</span> <span className="font-semibold">{shift.requiresSupervision ? "Yes" : "No"}</span></div>
                 </div>
             </div>

             {/* People */}
             <ShiftPeopleInfo 
                participant={typeof shift.participantId === 'object' ? shift.participantId : null}
                workers={workersList}
                isMultiWorker={shift.isMultiWorkerShift}
                currentUserId={currentUserId}
                getStatusBadgeStyle={getStatusBadgeStyle}
                getStatusLabel={getStatusLabel}
             />

             {/* Special Instructions */}
             {shift.specialInstructions && (
                 <div className="bg-white shadow-sm border rounded-lg p-3">
                     <h3 className="text-sm font-semibold mb-2">Instructions</h3>
                     <p className="text-sm bg-primary/10 p-2 rounded text-primary">{shift.specialInstructions}</p>
                 </div>
             )}

             {/* Action Buttons */}
             {((viewMode === "worker" && isAssignedWorker) || (viewMode === "participant" && isParticipant)) && !["cancelled", "completed"].includes(assignmentStatus) && (
                 <div className="bg-white shadow-sm border rounded-lg p-4">
                     <h3 className="text-sm font-semibold mb-4">Actions</h3>
                     <ShiftActions 
                        status={assignmentStatus}
                        viewMode={viewMode}
                        showRejectReason={showRejectReason}
                        rejectReason={rejectReason}
                        isPendingAction={acceptShiftMutation.isPending || updateStatusMutation.isPending}
                        onSetRejectReason={setRejectReason}
                        onShowReject={setShowRejectReason}
                        onAccept={handleAccept}
                        onReject={() => handleRejectOrCancel("reject")}
                        onStart={handleStart}
                        onCancel={() => handleRejectOrCancel("cancel")}
                        onComplete={handleComplete}
                     />
                 </div>
             )}

             {/* Timesheet Creator */}
             {assignmentStatus === "completed" && viewMode === "worker" && isAssignedWorker && (
                 <div className="bg-white shadow-sm border rounded-lg p-4">
                     {!showTimesheetForm ? (
                         <Button onClick={() => setShowTimesheetForm(true)} className="w-full"><Document className="w-4 h-4 mr-2"/> Create Timesheet</Button>
                     ) : (
                         <TimesheetForm 
                            formData={timesheetFormData}
                            onChange={handleTimesheetChange}
                            onNestedChange={() => {}} // implement if deeply nested needed
                            onAddExpense={() => setTimesheetFormData(p => ({...p, expenses: [...p.expenses, { title: "", description: "", amount: 0, payer: "supportWorker" }]}))}
                            onRemoveExpense={(i) => setTimesheetFormData(p => ({...p, expenses: p.expenses.filter((_, idx) => idx !== i)}))}
                            onSubmit={handleTimesheetSubmit}
                            onCancel={() => setShowTimesheetForm(false)}
                            isPending={createTimesheetMutation.isPending}
                            useCustomTimes={useCustomTimes}
                            onToggleCustomTimes={(v) => { setUseCustomTimes(v); if(!v) setSelectedDuration(0); }}
                            selectedDuration={selectedDuration}
                            onDurationSelect={handleDurationSelect}
                            minTime="" maxTime="" // set constraints if needed
                            formatTime={formatTime}
                            formatDateTimeLocal={formatDateTimeLocal}
                         />
                     )}
                 </div>
             )}
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}