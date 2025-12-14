import React, { useCallback, useState, useEffect } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import {
  MapPoint,
  Calendar,
  CloseCircle,
  ClockCircle,
  CheckCircle,
  CloseCircle as RejectIcon,
  Document,
  UsersGroupRounded,
} from "@solar-icons/react";
import { Avatar } from "@radix-ui/react-avatar";
import { AvatarFallback, AvatarImage } from "./ui/avatar";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { useAcceptShift, useUpdateShiftStatus } from "@/hooks/useShiftHooks";
import { useCreateTimesheet } from "@/hooks/useTimesheetHooks";
import { toast } from "sonner";
import { Spinner } from "./Spinner";

interface UserInfo {
  _id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
  profileImage: string;
}

interface ServiceType {
  _id: string;
  name: string;
  code: string;
  status: string;
}

interface WorkerAssignment {
  _id: string;
  workerId: string | UserInfo;
  status: string;
}

interface Shift {
  _id: string;
  organizationId: string;
  participantId: string | UserInfo;
  workerId?: string | UserInfo;
  isMultiWorkerShift: boolean;
  workerAssignments?: WorkerAssignment[];
  serviceTypeId: ServiceType;
  startTime: string;
  endTime: string;
  locationType: string;
  address: string;
  shiftType: string;
  requiresSupervision: boolean;
  specialInstructions?: string;
  status: string;
  shiftId: string;
  recurrence?: {
    pattern: string;
  };
  routineRequired?: boolean;
  createdAt: string;
  updatedAt: string;
}

interface ShiftDetailsDialogProps {
  shift: Shift | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  viewMode?: "participant" | "worker";
  currentUserId?: string;
}

interface TimesheetFormData {
  actualStartTime: string;
  actualEndTime: string;
  distanceTravelKm: number;
  notes: string;
  expenses: Array<{
    title: string;
    description: string;
    amount: number;
    payer: "participant" | "supportWorker";
  }>;
}

const TIMESHEET_DURATIONS = [
  { value: 0, label: "Same as shift" },
  { value: 1, label: "+1 Hour" },
  { value: 2, label: "+2 Hours" },
  { value: 3, label: "+3 Hours" },
  { value: 4, label: "+4 Hours" },
];

const ShiftDetailsDialog: React.FC<ShiftDetailsDialogProps> = ({
  shift,
  open,
  onOpenChange,
  viewMode = "worker",
  currentUserId,
}) => {
  const [showRejectReason, setShowRejectReason] = useState(false);
  const [rejectReason, setRejectReason] = useState("");
  const [showTimesheetForm, setShowTimesheetForm] = useState(false);
  const [timesheetFormData, setTimesheetFormData] = useState<TimesheetFormData>(
    {
      actualStartTime: "",
      actualEndTime: "",
      distanceTravelKm: 0,
      notes: "",
      expenses: [],
    }
  );
  const [useCustomTimes, setUseCustomTimes] = useState(false);
  const [selectedDuration, setSelectedDuration] = useState(0);

  const acceptShiftMutation = useAcceptShift();
  const useUpdateShiftStatusMutation = useUpdateShiftStatus();
  const createTimesheetMutation = useCreateTimesheet();

  // Initialize timesheet times when shift changes or form is opened
  useEffect(() => {
    if (shift && showTimesheetForm && !timesheetFormData.actualStartTime) {
      setTimesheetFormData((prev) => ({
        ...prev,
        actualStartTime: shift.startTime,
        actualEndTime: shift.endTime,
      }));
      setSelectedDuration(0);
    }
  }, [shift, showTimesheetForm, timesheetFormData.actualStartTime]);

  const getStatusBadgeStyle = useCallback((status: string) => {
    switch (status.toLowerCase()) {
      case "confirmed":
      case "accepted":
        return "bg-green-50 text-green-700 border-green-200";
      case "pending":
        return "bg-orange-50 text-orange-600 border-orange-200";
      case "inprogress":
        return "bg-purple-50 text-purple-600 border-purple-200";
      case "completed":
        return "bg-green-50 text-green-600 border-green-200";
      case "cancelled":
      case "declined":
        return "bg-red-50 text-red-600 border-red-200";
      default:
        return "bg-gray-100 text-gray-600 border-gray-200";
    }
  }, []);

  const getStatusLabel = useCallback((status: string) => {
    return (
      status.replace(/_/g, " ").charAt(0).toUpperCase() +
      status.replace(/_/g, " ").slice(1)
    );
  }, []);

  const formatTime = useCallback((dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  }, []);

  const formatLongDate = useCallback((dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  }, []);

  const formatDateTimeLocal = useCallback((dateString: string) => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    return `${year}-${month}-${day}T${hours}:${minutes}`;
  }, []);

  const getMinDateTime = useCallback(() => {
    if (!shift) return "";
    // Allow 5 minutes before shift start time
    const shiftStart = new Date(shift.startTime);
    const minTime = new Date(shiftStart.getTime() - 5 * 60 * 1000);
    return formatDateTimeLocal(minTime.toISOString());
  }, [shift, formatDateTimeLocal]);

  const getMaxDateTime = useCallback(() => {
    // Allow up to current time
    return formatDateTimeLocal(new Date().toISOString());
  }, [formatDateTimeLocal]);

  const getCurrentUserAssignment = useCallback(() => {
    if (!shift || !currentUserId) return null;

    if (!shift.isMultiWorkerShift && shift.workerId) {
      const workerId =
        typeof shift.workerId === "object"
          ? shift.workerId._id
          : shift.workerId;
      if (workerId === currentUserId) {
        return { workerId: currentUserId, status: shift.status };
      }
    }

    if (shift.isMultiWorkerShift && shift.workerAssignments) {
      const assignment = shift.workerAssignments.find((wa) => {
        const workerId =
          typeof wa.workerId === "object" ? wa.workerId._id : wa.workerId;
        return workerId === currentUserId;
      });
      return assignment || null;
    }

    return null;
  }, [shift, currentUserId]);

  const userAssignment = getCurrentUserAssignment();
  const isAssignedWorker = !!userAssignment;
  const assignmentStatus = userAssignment?.status || shift?.status;

  const isParticipant =
    currentUserId && typeof shift?.participantId === "object"
      ? shift.participantId._id === currentUserId
      : shift?.participantId === currentUserId;

  const calculateTimesheetEndTime = (
    startTime: string,
    additionalHours: number
  ) => {
    if (!shift) return "";

    if (additionalHours === 0) {
      return shift.endTime;
    }

    const shiftStart = new Date(shift.startTime);
    const shiftEnd = new Date(shift.endTime);
    const shiftDurationMs = shiftEnd.getTime() - shiftStart.getTime();
    const additionalMs = additionalHours * 60 * 60 * 1000;

    const actualStart = new Date(startTime || shift.startTime);
    const newEndTime = new Date(
      actualStart.getTime() + shiftDurationMs + additionalMs
    );

    return newEndTime.toISOString();
  };

  const handleDurationSelect = (hours: number) => {
    setSelectedDuration(hours);
    if (!shift) return;

    const startTime = timesheetFormData.actualStartTime || shift.startTime;
    const endTime = calculateTimesheetEndTime(startTime, hours);

    setTimesheetFormData((prev) => ({
      ...prev,
      actualStartTime: startTime,
      actualEndTime: endTime,
    }));
  };

  const toggleCustomTimes = useCallback(
    (checked: boolean) => {
      setUseCustomTimes(checked);
      if (!checked && shift) {
        // Reset to default shift times when unchecking
        setTimesheetFormData((prev) => ({
          ...prev,
          actualStartTime: shift.startTime,
          actualEndTime: shift.endTime,
        }));
        setSelectedDuration(0);
      }
    },
    [shift]
  );

  const handleAcceptShift = useCallback(() => {
    if (!shift) return;

    acceptShiftMutation.mutate(
      { shiftId: shift._id, accept: true },
      {
        onSuccess: () => {
          toast.success("Shift accepted successfully!");
          onOpenChange(false);
        },
        onError: (error: any) => {
          toast.error(error.response?.data?.error || "Failed to accept shift");
        },
      }
    );
  }, [shift, acceptShiftMutation, onOpenChange]);

  const handleCompleteShift = useCallback(() => {
    if (!shift) return;
    useUpdateShiftStatusMutation.mutate(
      {
        shiftId: shift._id,
        status: "completed",
      },
      {
        onSuccess: () => {
          toast.success("Shift completed successfully!");
          onOpenChange(false);
        },
        onError: (error: any) => {
          toast.error(
            error.response?.data?.error || "Failed to complete shift"
          );
        },
      }
    );
  }, [shift, useUpdateShiftStatusMutation, onOpenChange]);

  const handleStartShift = useCallback(() => {
    if (!shift) return;
    // start shift if current date matches shift date
    if (new Date().toDateString() < new Date(shift.startTime).toDateString()) {
      toast.error("You can only start the shift on its scheduled date");
      return;
    }
    useUpdateShiftStatusMutation.mutate(
      {
        shiftId: shift._id,
        status: "inProgress",
      },
      {
        onSuccess: () => {
          toast.success("Shift started successfully!");
          onOpenChange(false);
        },
        onError: (error: any) => {
          toast.error(error.response?.data?.error || "Failed to start shift");
        },
      }
    );
  }, [shift, useUpdateShiftStatusMutation, onOpenChange]);

  const handleRejectShift = useCallback(() => {
    if (!shift) return;

    if (!rejectReason.trim()) {
      toast.error("Please provide a reason for rejecting the shift");
      return;
    }

    acceptShiftMutation.mutate(
      {
        shiftId: shift._id,
        accept: false,
        declineReason: rejectReason,
      },
      {
        onSuccess: () => {
          toast.success("Shift rejected successfully!");
          setShowRejectReason(false);
          setRejectReason("");
          onOpenChange(false);
        },
        onError: (error: any) => {
          toast.error(error.response?.data?.error || "Failed to reject shift");
        },
      }
    );
  }, [shift, rejectReason, acceptShiftMutation, onOpenChange]);

  const handleCancelShift = useCallback(() => {
    if (!shift) return;

    if (!rejectReason.trim()) {
      toast.error("Please provide a reason for cancelling the shift");
      return;
    }
    useUpdateShiftStatusMutation.mutate(
      {
        shiftId: shift._id,
        status: "cancelled",
        declineReason: rejectReason,
      },
      {
        onSuccess: () => {
          toast.success("Shift cancelled successfully!");
          setShowRejectReason(false);
          setRejectReason("");
          onOpenChange(false);
        },
        onError: (error: any) => {
          toast.error(error.response?.data?.error || "Failed to cancel shift");
        },
      }
    );
  }, [shift, rejectReason, useUpdateShiftStatusMutation, onOpenChange]);

  const handleCreateTimesheet = useCallback(() => {
    if (!shift) return;

    const payload: any = {
      shiftId: shift._id,
      actualStartTime: timesheetFormData.actualStartTime || shift.startTime,
      actualEndTime: timesheetFormData.actualEndTime || shift.endTime,
      distanceTravelKm: timesheetFormData.distanceTravelKm,
      notes: timesheetFormData.notes,
    };

    if (timesheetFormData.expenses.length > 0) {
      payload.expenses = timesheetFormData.expenses;
    }

    createTimesheetMutation.mutate(payload, {
      onSuccess: () => {
        toast.success("Timesheet created successfully!");
        setShowTimesheetForm(false);
        setTimesheetFormData({
          actualStartTime: "",
          actualEndTime: "",
          distanceTravelKm: 0,
          notes: "",
          expenses: [],
        });
        setUseCustomTimes(false);
        setSelectedDuration(0);
        onOpenChange(false);
      },
      onError: (error: any) => {
        toast.error(
          error.response?.data?.error || "Failed to create timesheet"
        );
      },
    });
  }, [shift, timesheetFormData, createTimesheetMutation, onOpenChange]);

  const addExpense = useCallback(() => {
    setTimesheetFormData((prev) => ({
      ...prev,
      expenses: [
        ...prev.expenses,
        {
          title: "",
          description: "",
          amount: 0,
          payer: "supportWorker" as const,
        },
      ],
    }));
  }, []);

  const updateExpense = useCallback(
    (index: number, field: string, value: any) => {
      setTimesheetFormData((prev) => ({
        ...prev,
        expenses: prev.expenses.map((expense, i) =>
          i === index ? { ...expense, [field]: value } : expense
        ),
      }));
    },
    []
  );

  const removeExpense = (index: number) => {
    setTimesheetFormData((prev) => ({
      ...prev,
      expenses: prev.expenses.filter((_, i) => i !== index),
    }));
  };

  if (!shift) return null;

  const participantInfo =
    typeof shift.participantId === "object" ? shift.participantId : null;

  const getWorkersInfo = () => {
    const workers: Array<{
      user: UserInfo | null;
      status: string;
      id: string;
    }> = [];

    if (!shift.isMultiWorkerShift && shift.workerId) {
      const workerData =
        typeof shift.workerId === "object" ? shift.workerId : null;
      workers.push({
        user: workerData,
        status: shift.status,
        id:
          typeof shift.workerId === "object"
            ? shift.workerId._id
            : shift.workerId,
      });
    } else if (shift.isMultiWorkerShift && shift.workerAssignments) {
      shift.workerAssignments.forEach((wa) => {
        const workerData = typeof wa.workerId === "object" ? wa.workerId : null;
        workers.push({
          user: workerData,
          status: wa.status,
          id: typeof wa.workerId === "object" ? wa.workerId._id : wa.workerId,
        });
      });
    }

    return workers;
  };

  const workers = getWorkersInfo();
  const showActions =
    (viewMode === "worker" && isAssignedWorker) ||
    (viewMode === "participant" && isParticipant);
  const isPending = assignmentStatus === "pending";
  const isCompleted = assignmentStatus === "completed";
  const isInProgress = assignmentStatus === "inProgress";
  const isConfirmed = assignmentStatus === "confirmed";
  const isCancelled = assignmentStatus === "cancelled";

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black bg-opacity-50 z-50" />
        <Dialog.Content className="fixed top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] bg-gray-100 rounded-lg max-w-2xl w-[95vw] max-h-[90vh] overflow-y-auto p-4 sm:p-10 z-50">
          <Dialog.Close className="absolute right-3 top-3 sm:right-4 sm:top-4 p-1 hover:bg-gray-100 rounded-full">
            <CloseCircle className="w-5 h-5 sm:w-6 sm:h-6 text-gray-1000" />
          </Dialog.Close>

          <div className="flex gap-2 mb-3 sm:mb-4 items-center flex-wrap">
            <Dialog.Title className="text-lg sm:text-xl font-montserrat-semibold text-gray-900">
              {shift.serviceTypeId.name}
            </Dialog.Title>
            <Badge className={getStatusBadgeStyle(shift.status)}>
              {getStatusLabel(shift.status)}
            </Badge>
            {shift.isMultiWorkerShift && (
              <Badge className="bg-primary-50 text-primary-700 border-primary-200">
                <UsersGroupRounded className="w-3 h-3 mr-1" />
                Multi-Worker
              </Badge>
            )}
          </div>

          <div className="space-y-4 sm:space-y-6">
            {/* Schedule */}
            <div className="py-3 sm:py-4">
              <h3 className="text-sm font-montserrat-semibold text-gray-900 mb-2 sm:mb-3">
                Schedule
              </h3>
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                <div className="flex items-start gap-2 sm:gap-3">
                  <Calendar className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400 mt-0.5" />
                  <div>
                    <p className="text-xs text-gray-1000">Date</p>
                    <p className="text-sm font-montserrat-semibold text-gray-900">
                      {formatLongDate(shift.startTime)}
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-2 sm:gap-3">
                  <ClockCircle className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400 mt-0.5" />
                  <div>
                    <p className="text-xs text-gray-1000">Time</p>
                    <p className="text-sm font-montserrat-semibold text-gray-900">
                      {formatTime(shift.startTime)} -{" "}
                      {formatTime(shift.endTime)} (
                      {Math.round(
                        (new Date(shift.endTime).getTime() -
                          new Date(shift.startTime).getTime()) /
                          60000
                      )}{" "}
                      mins)
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Location */}
            <div>
              <h3 className="text-sm font-montserrat-semibold text-gray-900 mb-2 sm:mb-3">
                Location
              </h3>
              <div className="flex items-start gap-2 sm:gap-3">
                <MapPoint className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400 mt-0.5" />
                <div>
                  <p className="text-xs text-gray-1000 mb-1">
                    {shift.locationType === "inPerson"
                      ? "In-person Service"
                      : "Remote Service"}
                  </p>
                  <p className="text-sm font-montserrat-semibold text-gray-900">
                    {shift.address}
                  </p>
                </div>
              </div>
            </div>

            {/* Shift Information */}
            <div className="bg-white shadow-sm border border-gray-200 rounded-lg p-3 sm:p-4">
              <h3 className="text-sm font-montserrat-semibold text-gray-900 mb-2 sm:mb-3">
                Shift Information
              </h3>
              <div className="space-y-3 text-xs md:text-sm">
                <div className="flex justify-between items-center">
                  <p className="text-gray-1000">Shift ID:</p>
                  <p className="font-montserrat-semibold text-gray-900">
                    {shift.shiftId}
                  </p>
                </div>
                <div className="flex justify-between items-center">
                  <p className="text-gray-1000">Service Type:</p>
                  <p className="font-montserrat-semibold text-gray-900">
                    {shift.serviceTypeId.name}
                  </p>
                </div>
                <div className="flex justify-between items-center">
                  <p className="text-gray-1000">Requires Supervision:</p>
                  <p className="font-montserrat-semibold text-gray-900">
                    {shift.requiresSupervision ? "Yes" : "No"}
                  </p>
                </div>
              </div>
            </div>

            {/* Participant Information */}
            {participantInfo && (
              <div className="bg-white shadow-sm border border-gray-200 rounded-lg p-3 sm:p-4">
                <h3 className="text-sm font-montserrat-semibold text-gray-900 mb-3">
                  Participant
                </h3>
                <div className="flex items-center gap-3">
                  <Avatar>
                    <AvatarImage
                      src={participantInfo.profileImage}
                      alt={`${participantInfo.firstName} ${participantInfo.lastName}`}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                    <AvatarFallback className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center text-primary-700 font-montserrat-semibold">
                      {participantInfo.firstName.charAt(0)}
                      {participantInfo.lastName.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <p className="font-montserrat-semibold text-gray-900">
                      {participantInfo.firstName} {participantInfo.lastName}
                    </p>
                    <p className="text-xs text-gray-600">
                      {participantInfo.email}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Workers Information */}
            {workers.length > 0 && (
              <div className="bg-white shadow-sm border border-gray-200 rounded-lg p-3 sm:p-4">
                <h3 className="text-sm font-montserrat-semibold text-gray-900 mb-3">
                  {shift.isMultiWorkerShift
                    ? "Assigned Workers"
                    : "Support Worker"}
                </h3>
                <div className="space-y-3">
                  {workers.map((worker, index) => (
                    <div
                      key={worker.id}
                      className="flex items-center gap-3 p-2 rounded-lg bg-gray-50"
                    >
                      {worker.user ? (
                        <>
                          <Avatar>
                            <AvatarImage
                              src={worker.user.profileImage}
                              alt={`${worker.user.firstName} ${worker.user.lastName}`}
                              className="w-10 h-10 rounded-full object-cover"
                            />
                            <AvatarFallback className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center text-primary-700 font-montserrat-semibold">
                              {worker.user.firstName.charAt(0)}
                              {worker.user.lastName.charAt(0)}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <p className="font-montserrat-semibold text-gray-900 text-sm">
                              {worker.user.firstName} {worker.user.lastName}
                              {worker.id === currentUserId && (
                                <span className="ml-2 text-xs text-primary-600">
                                  (You)
                                </span>
                              )}
                            </p>
                            <p className="text-xs text-gray-600">
                              {worker.user.email}
                            </p>
                          </div>
                          <Badge className={getStatusBadgeStyle(worker.status)}>
                            {getStatusLabel(worker.status)}
                          </Badge>
                        </>
                      ) : (
                        <div className="flex-1">
                          <p className="text-sm text-gray-600">
                            Worker ID: {worker.id}
                          </p>
                          <Badge className={getStatusBadgeStyle(worker.status)}>
                            {getStatusLabel(worker.status)}
                          </Badge>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Special Instructions */}
            {shift.specialInstructions && (
              <div className="bg-white shadow-sm border border-gray-200 rounded-lg p-3 sm:p-4">
                <h3 className="text-sm font-montserrat-semibold text-gray-900 mb-2 sm:mb-3">
                  Special Instructions
                </h3>
                <div className="bg-primary/10 rounded-md p-2 sm:p-3">
                  <p className="text-xs md:text-sm text-primary">
                    {shift.specialInstructions}
                  </p>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            {showActions && !isCancelled && !isCompleted && (
              <div className="bg-white shadow-sm border border-gray-200 rounded-lg p-4 sm:p-6">
                <h3 className="text-sm font-montserrat-semibold text-gray-900 mb-4">
                  Shift Actions
                </h3>

                {/* Worker Actions */}
                {viewMode === "worker" && isAssignedWorker && (
                  <>
                    {/* Pending Status - Accept or Decline */}
                    {isPending && !showRejectReason && (
                      <div className="flex flex-col sm:flex-row gap-3">
                        <Button
                          onClick={handleAcceptShift}
                          disabled={acceptShiftMutation.isPending}
                          className="flex items-center gap-2 bg-green-600 hover:bg-green-700"
                        >
                          {acceptShiftMutation.isPending ? (
                            <>
                              <Spinner />
                              Accepting...
                            </>
                          ) : (
                            <>
                              <CheckCircle className="w-4 h-4" />
                              Accept Shift
                            </>
                          )}
                        </Button>
                        <Button
                          variant="outline"
                          onClick={() => setShowRejectReason(true)}
                          disabled={acceptShiftMutation.isPending}
                          className="flex items-center gap-2 text-red-600 border-red-600 hover:bg-red-50"
                        >
                          <RejectIcon className="w-4 h-4" />
                          Decline Shift
                        </Button>
                      </div>
                    )}

                    {/* Confirmed Status - Start or Cancel */}
                    {isConfirmed && !showRejectReason && (
                      <div className="flex flex-col sm:flex-row gap-3">
                        <Button
                          onClick={handleStartShift}
                          disabled={useUpdateShiftStatusMutation.isPending}
                          className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700"
                        >
                          {useUpdateShiftStatusMutation.isPending ? (
                            <>
                              <Spinner />
                              Starting...
                            </>
                          ) : (
                            <>
                              <ClockCircle className="w-4 h-4" />
                              Start Shift
                            </>
                          )}
                        </Button>
                        <Button
                          variant="outline"
                          onClick={() => setShowRejectReason(true)}
                          disabled={useUpdateShiftStatusMutation.isPending}
                          className="flex items-center gap-2 text-red-600 border-red-600 hover:bg-red-50"
                        >
                          <RejectIcon className="w-4 h-4" />
                          Cancel Shift
                        </Button>
                      </div>
                    )}

                    {/* InProgress Status - Complete Shift */}
                    {isInProgress && !showRejectReason && (
                      <div className="flex flex-col sm:flex-row gap-3">
                        <Button
                          onClick={handleCompleteShift}
                          disabled={useUpdateShiftStatusMutation.isPending}
                          className="flex items-center gap-2 bg-green-600 hover:bg-green-700"
                        >
                          {useUpdateShiftStatusMutation.isPending ? (
                            <>
                              <Spinner />
                              Completing...
                            </>
                          ) : (
                            <>
                              <CheckCircle className="w-4 h-4" />
                              Complete Shift
                            </>
                          )}
                        </Button>
                      </div>
                    )}

                    {/* Rejection/Cancellation Form for Pending */}
                    {isPending && showRejectReason && (
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label
                            htmlFor="rejectReason"
                            className="text-red-600"
                          >
                            Reason for Declining *
                          </Label>
                          <Textarea
                            id="rejectReason"
                            value={rejectReason}
                            onChange={(e) => setRejectReason(e.target.value)}
                            placeholder="Please provide a reason for declining this shift..."
                            rows={3}
                            className="border-red-300 focus:border-red-500"
                          />
                        </div>
                        <div className="flex gap-3">
                          <Button
                            onClick={handleRejectShift}
                            disabled={
                              acceptShiftMutation.isPending ||
                              !rejectReason.trim()
                            }
                            variant="destructive"
                            className="flex items-center gap-2"
                          >
                            {acceptShiftMutation.isPending ? (
                              <>
                                <Spinner />
                                Declining...
                              </>
                            ) : (
                              <>
                                <RejectIcon className="w-4 h-4" />
                                Confirm Decline
                              </>
                            )}
                          </Button>
                          <Button
                            variant="outline"
                            onClick={() => {
                              setShowRejectReason(false);
                              setRejectReason("");
                            }}
                            disabled={acceptShiftMutation.isPending}
                          >
                            Cancel
                          </Button>
                        </div>
                      </div>
                    )}

                    {/* Rejection/Cancellation Form for Confirmed */}
                    {isConfirmed && showRejectReason && (
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label
                            htmlFor="cancelReason"
                            className="text-red-600"
                          >
                            Reason for Cancellation *
                          </Label>
                          <Textarea
                            id="cancelReason"
                            value={rejectReason}
                            onChange={(e) => setRejectReason(e.target.value)}
                            placeholder="Please provide a reason for cancelling this shift..."
                            rows={3}
                            className="border-red-300 focus:border-red-500"
                          />
                        </div>
                        <div className="flex gap-3">
                          <Button
                            onClick={handleCancelShift}
                            disabled={
                              useUpdateShiftStatusMutation.isPending ||
                              !rejectReason.trim()
                            }
                            variant="destructive"
                            className="flex items-center gap-2"
                          >
                            {useUpdateShiftStatusMutation.isPending ? (
                              <>
                                <Spinner />
                                Cancelling...
                              </>
                            ) : (
                              <>
                                <RejectIcon className="w-4 h-4" />
                                Confirm Cancellation
                              </>
                            )}
                          </Button>
                          <Button
                            variant="outline"
                            onClick={() => {
                              setShowRejectReason(false);
                              setRejectReason("");
                            }}
                            disabled={useUpdateShiftStatusMutation.isPending}
                          >
                            Cancel
                          </Button>
                        </div>
                      </div>
                    )}
                  </>
                )}

                {/* Participant Actions - Can only cancel */}
                {viewMode === "participant" && isParticipant && (
                  <>
                    {!showRejectReason && (
                      <Button
                        variant="outline"
                        onClick={() => setShowRejectReason(true)}
                        className="flex items-center gap-2 text-red-600 border-red-600 hover:bg-red-50"
                      >
                        <RejectIcon className="w-4 h-4" />
                        Cancel Shift
                      </Button>
                    )}

                    {showRejectReason && (
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label
                            htmlFor="rejectReason"
                            className="text-red-600"
                          >
                            Reason for Cancellation *
                          </Label>
                          <Textarea
                            id="rejectReason"
                            value={rejectReason}
                            onChange={(e) => setRejectReason(e.target.value)}
                            placeholder="Please provide a reason for cancelling this shift..."
                            rows={3}
                            className="border-red-300 focus:border-red-500"
                          />
                        </div>
                        <div className="flex gap-3">
                          <Button
                            onClick={handleCancelShift}
                            disabled={
                              useUpdateShiftStatusMutation.isPending ||
                              !rejectReason.trim()
                            }
                            variant="destructive"
                            className="flex items-center gap-2"
                          >
                            {useUpdateShiftStatusMutation.isPending ? (
                              <>
                                <Spinner />
                                Cancelling...
                              </>
                            ) : (
                              <>
                                <RejectIcon className="w-4 h-4" />
                                Confirm Cancellation
                              </>
                            )}
                          </Button>
                          <Button
                            variant="outline"
                            onClick={() => {
                              setShowRejectReason(false);
                              setRejectReason("");
                            }}
                            disabled={useUpdateShiftStatusMutation.isPending}
                          >
                            Cancel
                          </Button>
                        </div>
                      </div>
                    )}
                  </>
                )}
              </div>
            )}

            {/* Timesheet Creation - Only for completed shifts and workers */}
            {isCompleted && viewMode === "worker" && isAssignedWorker && (
              <div className="bg-white shadow-sm border border-gray-200 rounded-lg p-4 sm:p-6">
                {!showTimesheetForm ? (
                  <Button
                    onClick={() => setShowTimesheetForm(true)}
                    className="flex items-center gap-2 bg-primary-600 hover:bg-primary-700"
                  >
                    <Document className="w-4 h-4" />
                    Create Timesheet
                  </Button>
                ) : (
                  <div className="space-y-4">
                    <h4 className="font-montserrat-semibold text-gray-900">
                      Create Timesheet
                    </h4>

                    <div className="flex items-center gap-2">
                      <Checkbox
                        id="customTimes"
                        checked={useCustomTimes}
                        onCheckedChange={toggleCustomTimes}
                      />
                      <Label htmlFor="customTimes" className="cursor-pointer">
                        Use different times from shift schedule
                      </Label>
                    </div>

                    {!useCustomTimes ? (
                      <div className="space-y-3">
                        <Label className="font-montserrat-semibold">
                          Timesheet Duration
                        </Label>
                        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                          {TIMESHEET_DURATIONS.map((duration) => (
                            <Button
                              key={duration.value}
                              type="button"
                              size="sm"
                              variant={
                                selectedDuration === duration.value
                                  ? "default"
                                  : "outline"
                              }
                              onClick={() =>
                                handleDurationSelect(duration.value)
                              }
                              className="w-full"
                            >
                              {duration.label}
                            </Button>
                          ))}
                        </div>
                        {timesheetFormData.actualStartTime &&
                          timesheetFormData.actualEndTime && (
                            <div className="p-3 bg-primary-50 border border-primary-200 rounded-lg">
                              <p className="text-sm text-primary-900">
                                <span className="font-montserrat-semibold">
                                  Start:
                                </span>{" "}
                                {formatTime(timesheetFormData.actualStartTime)}
                              </p>
                              <p className="text-sm text-primary-900 mt-1">
                                <span className="font-montserrat-semibold">
                                  End:
                                </span>{" "}
                                {formatTime(timesheetFormData.actualEndTime)}
                              </p>
                              <p className="text-sm text-primary-900 mt-1">
                                <span className="font-montserrat-semibold">
                                  Duration:
                                </span>{" "}
                                {Math.round(
                                  (new Date(
                                    timesheetFormData.actualEndTime
                                  ).getTime() -
                                    new Date(
                                      timesheetFormData.actualStartTime
                                    ).getTime()) /
                                    60000
                                )}{" "}
                                mins
                              </p>
                            </div>
                          )}
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="actualStartTime">
                            Actual Start Time *
                          </Label>
                          <Input
                            id="actualStartTime"
                            type="datetime-local"
                            min={getMinDateTime()}
                            max={getMaxDateTime()}
                            value={formatDateTimeLocal(
                              timesheetFormData.actualStartTime
                            )}
                            onChange={(e) => {
                              const newStartTime = new Date(
                                e.target.value
                              ).toISOString();
                              setTimesheetFormData((prev) => ({
                                ...prev,
                                actualStartTime: newStartTime,
                              }));
                              const endTime = calculateTimesheetEndTime(
                                newStartTime,
                                selectedDuration
                              );
                              setTimesheetFormData((prev) => ({
                                ...prev,
                                actualEndTime: endTime,
                              }));
                            }}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="actualEndTime">
                            Actual End Time *
                          </Label>
                          <Input
                            id="actualEndTime"
                            type="datetime-local"
                            min={
                              timesheetFormData.actualStartTime
                                ? formatDateTimeLocal(
                                    timesheetFormData.actualStartTime
                                  )
                                : getMinDateTime()
                            }
                            max={getMaxDateTime()}
                            value={formatDateTimeLocal(
                              timesheetFormData.actualEndTime
                            )}
                            onChange={(e) =>
                              setTimesheetFormData((prev) => ({
                                ...prev,
                                actualEndTime: new Date(
                                  e.target.value
                                ).toISOString(),
                              }))
                            }
                          />
                        </div>
                      </div>
                    )}

                    <div className="space-y-2">
                      <Label htmlFor="distanceTravelKm">
                        Distance Traveled (km)
                      </Label>
                      <Input
                        id="distanceTravelKm"
                        type="number"
                        step="0.1"
                        value={timesheetFormData.distanceTravelKm}
                        onChange={(e) =>
                          setTimesheetFormData((prev) => ({
                            ...prev,
                            distanceTravelKm: parseFloat(e.target.value) || 0,
                          }))
                        }
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="notes">Notes</Label>
                      <Textarea
                        id="notes"
                        value={timesheetFormData.notes}
                        onChange={(e) =>
                          setTimesheetFormData((prev) => ({
                            ...prev,
                            notes: e.target.value,
                          }))
                        }
                        placeholder="Add any notes about the shift..."
                        rows={3}
                      />
                    </div>

                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <Label className="font-montserrat-semibold">
                          Expenses
                        </Label>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={addExpense}
                        >
                          Add Expense
                        </Button>
                      </div>

                      {timesheetFormData.expenses.map((expense, index) => (
                        <div
                          key={index}
                          className="border rounded-lg p-3 space-y-3"
                        >
                          <div className="flex justify-between">
                            <Label>Expense #{index + 1}</Label>
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => removeExpense(index)}
                              className="text-red-600 hover:text-red-700"
                            >
                              Remove
                            </Button>
                          </div>

                          <div className="space-y-2">
                            <Label>Title *</Label>
                            <Input
                              value={expense.title}
                              onChange={(e) =>
                                updateExpense(index, "title", e.target.value)
                              }
                              placeholder="Expense title"
                            />
                          </div>

                          <div className="space-y-2">
                            <Label>Description</Label>
                            <Input
                              value={expense.description}
                              onChange={(e) =>
                                updateExpense(
                                  index,
                                  "description",
                                  e.target.value
                                )
                              }
                              placeholder="Expense description"
                            />
                          </div>

                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label>Amount *</Label>
                              <Input
                                type="number"
                                step="0.01"
                                value={expense.amount}
                                onChange={(e) =>
                                  updateExpense(
                                    index,
                                    "amount",
                                    parseFloat(e.target.value) || 0
                                  )
                                }
                                placeholder="0.00"
                              />
                            </div>
                            <div className="space-y-2">
                              <Label>Paid By *</Label>
                              <Select
                                value={expense.payer}
                                onValueChange={(value) =>
                                  updateExpense(index, "payer", value)
                                }
                              >
                                <SelectTrigger className="w-full">
                                  <SelectValue placeholder="Select payer" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="supportWorker">
                                    Support Worker
                                  </SelectItem>
                                  <SelectItem value="participant">
                                    Participant
                                  </SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="flex gap-3 pt-4">
                      <Button
                        onClick={handleCreateTimesheet}
                        disabled={
                          createTimesheetMutation.isPending ||
                          !timesheetFormData.actualStartTime ||
                          !timesheetFormData.actualEndTime
                        }
                        className="flex items-center gap-2"
                      >
                        {createTimesheetMutation.isPending ? (
                          <>
                            <Spinner />
                            Creating...
                          </>
                        ) : (
                          <>
                            <Document className="w-4 h-4" />
                            Submit Timesheet
                          </>
                        )}
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => {
                          setShowTimesheetForm(false);
                          setTimesheetFormData({
                            actualStartTime: "",
                            actualEndTime: "",
                            distanceTravelKm: 0,
                            notes: "",
                            expenses: [],
                          });
                          setUseCustomTimes(false);
                          setSelectedDuration(0);
                        }}
                        disabled={createTimesheetMutation.isPending}
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};

export default ShiftDetailsDialog;
