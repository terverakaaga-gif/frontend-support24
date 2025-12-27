import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import shiftService from "@/api/services/shiftService";
import { ShiftStatus, ServiceTypeId } from "@/entities/Shift";
import { format, parseISO } from "date-fns";
import { AltArrowLeft, Calendar, CheckCircle, ClockCircle, CloseCircle, DangerTriangle, InfoCircle, Letter, MapPoint, Phone, Repeat, User, UsersGroupRounded } from "@solar-icons/react";

const ParticipantShiftDetails = () => {
  const { shiftId } = useParams<{ shiftId: string }>();
  const navigate = useNavigate();

  // Fetch shift details
  const {
    data: shift,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["shift-details", shiftId],
    queryFn: () => shiftService.getShiftById(shiftId!),
    enabled: !!shiftId,
  });

  // Get status badge variant and icon
  const getStatusInfo = (status: ShiftStatus) => {
    switch (status) {
      case ShiftStatus.CONFIRMED:
        return {
          variant: "default" as const,
          icon: <CheckCircle className="w-4 h-4" />,
          color: "text-green-600",
          bg: "bg-green-50",
        };
      case ShiftStatus.PENDING:
        return {
          variant: "secondary" as const,
          icon: <DangerTriangle className="w-4 h-4" />,
          color: "text-yellow-600",
          bg: "bg-yellow-50",
        };
      case ShiftStatus.IN_PROGRESS:
        return {
          variant: "default" as const,
          icon: <ClockCircle className="w-4 h-4" />,
          color: "text-primary",
          bg: "bg-primary-100",
        };
      case ShiftStatus.COMPLETED:
        return {
          variant: "outline" as const,
          icon: <CheckCircle className="w-4 h-4" />,
          color: "text-gray-600",
          bg: "bg-gray-100",
        };
      case ShiftStatus.CANCELLED:
        return {
          variant: "destructive" as const,
          icon: <CloseCircle className="w-4 h-4" />,
          color: "text-red-600",
          bg: "bg-red-50",
        };
      default:
        return {
          variant: "secondary" as const,
          icon: <DangerTriangle className="w-4 h-4" />,
          color: "text-gray-600",
          bg: "bg-gray-100",
        };
    }
  };

  // Format service type for display
  const formatServiceType = (serviceTypeId?: ServiceTypeId) => {
    if (!serviceTypeId) return "Unknown Service";
    
    // Use the name if available, otherwise format the code
    if (serviceTypeId.name) {
      return serviceTypeId.name;
    }
    
    if (serviceTypeId.code) {
      return serviceTypeId.code
        .replace(/([A-Z])/g, " $1")
        .replace(/^./, (str) => str.toUpperCase())
        .trim();
    }
    
    return "Unknown Service";
  };

  // Get shift duration
  const getShiftDuration = (startTime: string, endTime: string) => {
    const start = parseISO(startTime);
    const end = parseISO(endTime);
    const diffInMinutes = (end.getTime() - start.getTime()) / (1000 * 60);
    const hours = Math.floor(diffInMinutes / 60);
    const minutes = diffInMinutes % 60;

    if (hours === 0) return `${minutes} minutes`;
    if (minutes === 0) return `${hours} hour${hours > 1 ? "s" : ""}`;
    return `${hours} hour${hours > 1 ? "s" : ""} ${minutes} minutes`;
  };

  if (error) {
    return (
      <div className="p-6">
        <div className="text-center py-12">
          <CloseCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h3 className="text-lg font-montserrat-semibold text-gray-900 mb-2">
            Failed to load shift details
          </h3>
          <p className="text-gray-600 mb-4">
            There was an error loading the shift details. Please try again.
          </p>
          <Button onClick={() => navigate("/participant/shifts")}>
            Back to Shifts
          </Button>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="p-6 space-y-6">
        <div className="flex items-center gap-4">
          <Skeleton className="w-10 h-10 rounded-lg" />
          <div className="space-y-2">
            <Skeleton className="h-6 w-48" />
            <Skeleton className="h-4 w-32" />
          </div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Skeleton className="h-48 w-full rounded-lg" />
            <Skeleton className="h-32 w-full rounded-lg" />
          </div>
          <div className="space-y-6">
            <Skeleton className="h-64 w-full rounded-lg" />
          </div>
        </div>
      </div>
    );
  }

  if (!shift) {
    return (
      <div className="p-6">
        <div className="text-center py-12">
          <DangerTriangle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-montserrat-semibold text-gray-900 mb-2">
            Shift not found
          </h3>
          <p className="text-gray-600 mb-4">
            The shift you're looking for doesn't exist or has been removed.
          </p>
          <Button onClick={() => navigate("/participant/shifts")}>
            Back to Shifts
          </Button>
        </div>
      </div>
    );
  }

  const statusInfo = getStatusInfo(shift.status);

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate("/participant/shifts")}
          className="flex items-center gap-2"
        >
          <AltArrowLeft className="w-4 h-4" />
          Back to Shifts
        </Button>
      </div>

      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-3xl font-montserrat-bold tracking-tight text-gray-900">
              {formatServiceType(shift.serviceTypeId)}
            </h1>
            {shift.recurrence?.pattern !== "none" && (
              <Badge variant="outline" className="gap-1">
                <Repeat className="w-3 h-3" />
                Recurring
              </Badge>
            )}
          </div>
          <p className="text-gray-600 font-mono">{shift.shiftId}</p>
        </div>
        <Badge
          variant={statusInfo.variant}
          className={cn("gap-2 px-3 py-1", statusInfo.bg, statusInfo.color)}
        >
          {statusInfo.icon}
          {shift.status}
        </Badge>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Main Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Schedule Information */}
          <Card className="border-0 shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-primary" />
                Schedule Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-montserrat-semibold text-gray-1000 mb-1">Date</p>
                  <p className="text-lg font-montserrat-semibold text-gray-900">
                    {format(parseISO(shift.startTime), "EEEE, MMMM dd, yyyy")}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-montserrat-semibold text-gray-1000 mb-1">Time</p>
                  <p className="text-lg font-montserrat-semibold text-gray-900">
                    {format(parseISO(shift.startTime), "h:mm a")} -{" "}
                    {format(parseISO(shift.endTime), "h:mm a")}
                  </p>
                  <p className="text-sm text-gray-600">
                    Duration: {getShiftDuration(shift.startTime, shift.endTime)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Location Information */}
          <Card className="border-0 shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPoint className="w-5 h-5 text-green-600" />
                Location
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-lg bg-green-50 flex items-center justify-center">
                  <MapPoint className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <p className="font-montserrat-semibold text-gray-900 mb-1">
                    {shift.locationType === "inPerson"
                      ? "In-Person"
                      : "Virtual"}
                  </p>
                  {shift.address && (
                    <p className="text-gray-600">{shift.address}</p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Special Instructions */}
          {shift.specialInstructions && (
            <Card className="border-0 shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <InfoCircle className="w-5 h-5 text-orange-600" />
                  Special Instructions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="p-4 bg-orange-50 rounded-lg">
                  <p className="text-orange-800">{shift.specialInstructions}</p>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Additional Information */}
          <Card className="border-0 shadow-sm">
            <CardHeader>
              <CardTitle>Additional Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-montserrat-semibold text-gray-1000 mb-1">
                    Shift Type
                  </p>
                  <p className="text-gray-900">
                    {shift.shiftType === "directBooking"
                      ? "Direct Booking"
                      : "Open Request"}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-montserrat-semibold text-gray-1000 mb-1">
                    Supervision Required
                  </p>
                  <p className="text-gray-900">
                    {shift.requiresSupervision ? "Yes" : "No"}
                  </p>
                </div>
              </div>

              {shift.recurrence?.pattern !== "none" && (
                <div>
                  <p className="text-sm font-montserrat-semibold text-gray-1000 mb-1">
                    Recurrence
                  </p>
                  <p className="text-gray-900 capitalize">
                    {shift.recurrence.pattern}
                    {shift.recurrence.occurrences &&
                      ` (${shift.recurrence.occurrences} occurrences)`}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Worker Information */}
        <div className="space-y-6">
          {/* Worker(s) Information */}
          <Card className="border-0 shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                {shift.isMultiWorkerShift ? (
                  <UsersGroupRounded className="w-5 h-5 text-purple-600" />
                ) : (
                  <User className="w-5 h-5 text-purple-600" />
                )}
                {shift.isMultiWorkerShift
                  ? "Support Workers"
                  : "Support Worker"}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {shift.isMultiWorkerShift && shift.workerAssignments ? (
                shift.workerAssignments.map((assignment, index) => (
                  <div key={assignment._id}>
                    {index > 0 && <Separator className="my-4" />}
                    <div className="flex items-start gap-3">
                      <Avatar className="w-12 h-12">
                        <AvatarImage src={assignment.workerId.profileImage} />
                        <AvatarFallback>
                          {assignment.workerId.firstName[0]}
                          {assignment.workerId.lastName[0]}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <h4 className="font-montserrat-semibold text-gray-900">
                          {assignment.workerId.firstName}{" "}
                          {assignment.workerId.lastName}
                        </h4>
                        <div className="space-y-1 mt-2">
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <Letter className="w-4 h-4" />
                            {assignment.workerId.email}
                          </div>
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <Phone className="w-4 h-4" />
                            {assignment.workerId.phone}
                          </div>
                        </div>
                        <Badge variant="outline" className="mt-2">
                          {assignment.status}
                        </Badge>
                      </div>
                    </div>
                  </div>
                ))
              ) : shift.workerId ? (
                typeof shift.workerId === "string" ? (
                  <div className="text-center py-8">
                    <div className="w-16 h-16 rounded-full bg-primary-100 flex items-center justify-center mx-auto mb-3">
                      <User className="w-8 h-8 text-primary" />
                    </div>
                    <p className="font-montserrat-semibold text-gray-900">Worker Assigned</p>
                    <p className="text-sm text-gray-1000 font-mono">
                      ID: {shift.workerId}
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                      Contact support for worker details
                    </p>
                  </div>
                ) : (
                  <div className="flex items-start gap-3">
                    <Avatar className="w-12 h-12">
                      <AvatarImage src={shift.workerId.profileImage} />
                      <AvatarFallback>
                        {shift.workerId.firstName[0]}
                        {shift.workerId.lastName[0]}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <h4 className="font-montserrat-semibold text-gray-900">
                        {shift.workerId.firstName} {shift.workerId.lastName}
                      </h4>
                      <div className="space-y-1 mt-2">
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Letter className="w-4 h-4" />
                          {shift.workerId.email}
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Phone className="w-4 h-4" />
                          {shift.workerId.phone}
                        </div>
                      </div>
                    </div>
                  </div>
                )
              ) : (
                <div className="text-center py-8">
                  <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-3">
                    <User className="w-8 h-8 text-gray-400" />
                  </div>
                  <p className="font-montserrat-semibold text-gray-1000">
                    No worker assigned
                  </p>
                  <p className="text-sm text-gray-400">Pending assignment</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Shift Timeline */}
          <Card className="border-0 shadow-sm">
            <CardHeader>
              <CardTitle>Shift Timeline</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-primary"></div>
                  <div>
                    <p className="text-sm font-montserrat-semibold text-gray-900">Created</p>
                    <p className="text-xs text-gray-1000">
                      {format(
                        parseISO(shift.createdAt),
                        "MMM dd, yyyy 'at' h:mm a"
                      )}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-gray-300"></div>
                  <div>
                    <p className="text-sm font-montserrat-semibold text-gray-900">
                      Last Updated
                    </p>
                    <p className="text-xs text-gray-1000">
                      {format(
                        parseISO(shift.updatedAt),
                        "MMM dd, yyyy 'at' h:mm a"
                      )}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ParticipantShiftDetails;
