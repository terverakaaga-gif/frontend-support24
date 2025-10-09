import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { format } from "date-fns";
import {
  ArrowLeft,
  Clock,
  Calendar,
  MapPin,
  DollarSign,
  Receipt,
  CheckCircle,
  AlertCircle,
  UserCircle,
  Building,
  FileText,
  ExternalLink,
  ClipboardCheck,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

// Import our types and hooks
import { useGetTimesheet } from "@/hooks/useTimesheetHooks";
import {
  Timesheet,
  SERVICE_TYPE_LABELS,
  TIMESHEET_STATUS_CONFIG,
} from "@/entities/Timesheet";

const ParticipantTimesheetDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("details");

  // API call to get timesheet details
  const { data: timesheet, isLoading, error } = useGetTimesheet(id || "", !!id);

  const handleGoBack = () => {
    navigate("/participant/timesheets");
  };

  // Helper functions
  const formatTime = (dateString: string) =>
    format(new Date(dateString), "h:mm a");
  const formatDate = (dateString: string) =>
    format(new Date(dateString), "MMM d, yyyy");
  const formatDateWithDay = (dateString: string) =>
    format(new Date(dateString), "EEEE, MMMM d, yyyy");
  const formatDateTime = (dateString: string) =>
    format(new Date(dateString), "PPpp");
  const getFullName = (user: { firstName: string; lastName: string }) =>
    `${user.firstName} ${user.lastName}`;

  const formatDuration = (startTime: string, endTime: string) => {
    const start = new Date(startTime);
    const end = new Date(endTime);
    const diffMs = end.getTime() - start.getTime();
    const diffHrs = Math.floor(diffMs / (1000 * 60 * 60));
    const diffMins = Math.round((diffMs % (1000 * 60 * 60)) / (1000 * 60));

    if (diffHrs === 0) {
      return `${diffMins} minutes`;
    } else if (diffMins === 0) {
      return diffHrs === 1 ? "1 hour" : `${diffHrs} hours`;
    } else {
      return diffHrs === 1
        ? `1 hour ${diffMins} minutes`
        : `${diffHrs} hours ${diffMins} minutes`;
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
    }).format(amount);
  };

  // Get status badge component with appropriate styling
  const getStatusBadge = (status: string, isPaid: boolean) => {
    if (isPaid) {
      return (
        <Badge
          variant="outline"
          className="bg-green-100 text-green-800 border-green-200 text-sm py-1 px-3 flex items-center"
        >
          <CheckCircle className="h-4 w-4 mr-2" />
          Paid
        </Badge>
      );
    }

    const config =
      TIMESHEET_STATUS_CONFIG[status as keyof typeof TIMESHEET_STATUS_CONFIG];
    if (!config) {
      return (
        <Badge
          variant="outline"
          className="bg-gray-100 text-gray-800 border-gray-200 text-sm py-1 px-3 flex items-center"
        >
          <Clock className="h-4 w-4 mr-2" />
          {status.charAt(0).toUpperCase() + status.slice(1)}
        </Badge>
      );
    }

    return (
      <Badge
        variant={config.variant}
        className="text-sm py-1 px-3 flex items-center"
      >
        <Clock className="h-4 w-4 mr-2" />
        {config.label}
      </Badge>
    );
  };

  if (isLoading) {
    return (
      <div className="p-6 space-y-6">
        <div className="flex items-center space-x-4">
          <Skeleton className="h-10 w-10 rounded-full" />
          <div className="space-y-2">
            <Skeleton className="h-6 w-48" />
            <Skeleton className="h-4 w-32" />
          </div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Skeleton className="h-96 w-full" />
          </div>
          <div className="space-y-6">
            <Skeleton className="h-48 w-full" />
            <Skeleton className="h-48 w-full" />
          </div>
        </div>
      </div>
    );
  }

  if (error || !timesheet) {
    return (
      <div className="p-6">
        <Card className="border-[#1e3b93]/10">
          <CardContent className="pt-6">
            <div className="text-center">
              <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-red-500 mb-2">
                Error Loading Timesheet
              </h3>
              <p className="text-muted-foreground mb-4">
                We couldn't load the timesheet details. Please try again.
              </p>
              <Button
                onClick={handleGoBack}
                variant="outline"
                className="border-[#1e3b93]/20 hover:bg-[#1e3b93]/10 hover:border-[#1e3b93]/40 text-[#1e3b93]"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Timesheets
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            onClick={handleGoBack}
            className="text-[#1e3b93] hover:bg-[#1e3b93]/10"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Timesheets
          </Button>
          <div>
            <h1 className="text-3xl font-montserrat-bold tracking-tight text-[#1e3b93]">
              Timesheet Details
            </h1>
            <p className="text-muted-foreground">
              {timesheet.shiftIdRef} •{" "}
              {formatDateWithDay(timesheet.scheduledStartTime)}
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          {getStatusBadge(timesheet.status, timesheet.isPaid)}
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Main Details */}
        <div className="lg:col-span-2">
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="w-full"
          >
            <TabsList className="mb-6 bg-[#1e3b93]/5 border border-[#1e3b93]/10">
              <TabsTrigger
                value="details"
                className="data-[state=active]:bg-[#1e3b93] data-[state=active]:text-white"
              >
                Shift Details
              </TabsTrigger>
              <TabsTrigger
                value="expenses"
                className="data-[state=active]:bg-[#1e3b93] data-[state=active]:text-white"
              >
                Expenses ({timesheet.expenses.length})
              </TabsTrigger>
              <TabsTrigger
                value="payments"
                className="data-[state=active]:bg-[#1e3b93] data-[state=active]:text-white"
              >
                Payment Breakdown
              </TabsTrigger>
            </TabsList>

            {/* Shift Details Tab */}
            <TabsContent value="details">
              <Card className="border-[#1e3b93]/10">
                <CardHeader className="border-b border-[#1e3b93]/10">
                  <CardTitle className="text-[#1e3b93] flex items-center gap-2">
                    <ClipboardCheck className="w-5 h-5" />
                    Shift Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Basic Info */}
                    <div className="space-y-4">
                      <div className="bg-[#1e3b93]/5 rounded-lg p-4">
                        <h3 className="font-medium text-[#1e3b93] mb-3 flex items-center">
                          <FileText className="w-4 h-4 mr-2" />
                          Shift Details
                        </h3>
                        <div className="space-y-3 text-sm">
                          <div className="flex justify-between">
                            <span className="font-medium text-gray-600">
                              Shift ID:
                            </span>
                            <span className="font-mono text-[#1e3b93]">
                              {timesheet.shiftIdRef}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="font-medium text-gray-600">
                              Service Type:
                            </span>
                            <span className="capitalize">
                              {SERVICE_TYPE_LABELS[
                                timesheet.shiftId.serviceType
                              ] || timesheet.shiftId.serviceType}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="font-medium text-gray-600">
                              Organization:
                            </span>
                            <span>{timesheet.organizationId.name}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="font-medium text-gray-600">
                              Multi-Worker:
                            </span>
                            <span>
                              {timesheet.isMultiWorkerShift ? "Yes" : "No"}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Time Details */}
                    <div className="space-y-4">
                      <div className="bg-green-50 rounded-lg p-4">
                        <h3 className="font-medium text-green-700 mb-3 flex items-center">
                          <Clock className="w-4 h-4 mr-2" />
                          Time Tracking
                        </h3>
                        <div className="space-y-3 text-sm">
                          <div>
                            <div className="flex justify-between">
                              <span className="font-medium text-gray-600">
                                Scheduled:
                              </span>
                              <span>
                                {formatTime(timesheet.scheduledStartTime)} -{" "}
                                {formatTime(timesheet.scheduledEndTime)}
                              </span>
                            </div>
                          </div>
                          <div>
                            <div className="flex justify-between">
                              <span className="font-medium text-gray-600">
                                Actual:
                              </span>
                              <span className="font-medium text-green-700">
                                {formatTime(timesheet.actualStartTime)} -{" "}
                                {formatTime(timesheet.actualEndTime)}
                              </span>
                            </div>
                          </div>
                          <div className="flex justify-between">
                            <span className="font-medium text-gray-600">
                              Duration:
                            </span>
                            <span className="font-medium">
                              {formatDuration(
                                timesheet.actualStartTime,
                                timesheet.actualEndTime
                              )}
                            </span>
                          </div>
                          {timesheet.extraTime > 0 && (
                            <div className="flex justify-between">
                              <span className="font-medium text-gray-600">
                                Extra Time:
                              </span>
                              <span className="text-[#1e3b93] font-medium">
                                +{timesheet.extraTime} minutes
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Travel Information */}
                  {timesheet.distanceTravelKm > 0 && (
                    <div className="mt-6">
                      <div className="bg-primary-100 rounded-lg p-4">
                        <h3 className="font-medium text-primary-700 mb-3 flex items-center">
                          <MapPin className="w-4 h-4 mr-2" />
                          Travel Information
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                          <div className="flex justify-between">
                            <span className="font-medium text-gray-600">
                              Distance:
                            </span>
                            <span>{timesheet.distanceTravelKm} km</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="font-medium text-gray-600">
                              Rate:
                            </span>
                            <span>
                              {formatCurrency(timesheet.distanceTravelRate)}/km
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="font-medium text-gray-600">
                              Travel Pay:
                            </span>
                            <span className="font-medium text-primary-700">
                              {formatCurrency(timesheet.distanceTravelAmount)}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Notes */}
                  {timesheet.notes && (
                    <div className="mt-6">
                      <h3 className="font-medium text-gray-900 mb-3">Notes</h3>
                      <div className="bg-gray-100 rounded-lg p-4">
                        <p className="text-sm text-gray-700 leading-relaxed">
                          {timesheet.notes}
                        </p>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Expenses Tab */}
            <TabsContent value="expenses">
              <Card className="border-[#1e3b93]/10">
                <CardHeader className="border-b border-[#1e3b93]/10">
                  <CardTitle className="text-[#1e3b93] flex items-center gap-2">
                    <Receipt className="w-5 h-5" />
                    Expenses
                  </CardTitle>
                  <CardDescription>
                    Detailed breakdown of all expenses for this shift
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-6">
                  {timesheet.expenses.length === 0 ? (
                    <div className="text-center py-8">
                      <Receipt className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <h3 className="text-lg font-medium mb-2">No Expenses</h3>
                      <p className="text-muted-foreground">
                        No expenses were recorded for this shift.
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Item</TableHead>
                            <TableHead>Description</TableHead>
                            <TableHead>Paid By</TableHead>
                            <TableHead className="text-right">Amount</TableHead>
                            <TableHead className="text-right">
                              Receipt
                            </TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {timesheet.expenses.map((expense) => (
                            <TableRow key={expense._id}>
                              <TableCell className="font-medium">
                                {expense.title}
                              </TableCell>
                              <TableCell>{expense.description}</TableCell>
                              <TableCell>
                                <Badge
                                  variant={
                                    expense.payer === "participant"
                                      ? "default"
                                      : "secondary"
                                  }
                                >
                                  {expense.payer === "participant"
                                    ? "Participant"
                                    : "Worker"}
                                </Badge>
                              </TableCell>
                              <TableCell className="text-right">
                                {formatCurrency(expense.amount)}
                              </TableCell>
                              <TableCell className="text-right">
                                {expense.receiptUrl ? (
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    asChild
                                    className="text-[#1e3b93] hover:bg-[#1e3b93]/10"
                                  >
                                    <a
                                      href={expense.receiptUrl}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                    >
                                      <ExternalLink className="h-4 w-4 mr-2" />
                                      View Receipt
                                    </a>
                                  </Button>
                                ) : (
                                  <span className="text-sm text-muted-foreground">
                                    No receipt
                                  </span>
                                )}
                              </TableCell>
                            </TableRow>
                          ))}
                          <TableRow>
                            <TableCell
                              colSpan={3}
                              className="text-right font-medium"
                            >
                              <div className="space-y-1">
                                <div>
                                  Participant Expenses:{" "}
                                  {formatCurrency(
                                    timesheet.participantExpensesTotal
                                  )}
                                </div>
                                <div>
                                  Worker Expenses:{" "}
                                  {formatCurrency(
                                    timesheet.workerExpensesTotal
                                  )}
                                </div>
                              </div>
                            </TableCell>
                            <TableCell className="text-right font-medium">
                              {formatCurrency(timesheet.totalExpenses)}
                            </TableCell>
                            <TableCell></TableCell>
                          </TableRow>
                        </TableBody>
                      </Table>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Payment Breakdown Tab */}
            <TabsContent value="payments">
              <Card className="border-[#1e3b93]/10">
                <CardHeader className="border-b border-[#1e3b93]/10">
                  <CardTitle className="text-[#1e3b93] flex items-center gap-2">
                    <DollarSign className="w-5 h-5" />
                    Payment Breakdown
                  </CardTitle>
                  <CardDescription>
                    Detailed calculation of payment for this shift
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-6">
                  <div className="space-y-6">
                    {/* Rate Calculations */}
                    <div>
                      <h3 className="font-medium text-gray-900 mb-4">
                        Rate Calculations
                      </h3>
                      <div className="space-y-3">
                        {timesheet.rateCalculations.map((calc) => (
                          <div
                            key={calc._id}
                            className="bg-gray-100 rounded-lg p-4"
                          >
                            <div className="flex justify-between items-start">
                              <div>
                                <h4 className="font-medium text-gray-900">
                                  {calc.name}
                                </h4>
                                <p className="text-sm text-gray-600 mt-1">
                                  {calc.hours.toFixed(2)} hours ×{" "}
                                  {formatCurrency(calc.hourlyRate)}/hour
                                </p>
                              </div>
                              <div className="text-right">
                                <div className="font-medium text-lg text-[#1e3b93]">
                                  {formatCurrency(calc.amount)}
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Payment Summary */}
                    <div className="border-t pt-6">
                      <h3 className="font-medium text-gray-900 mb-4">
                        Payment Summary
                      </h3>
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span>Subtotal (Hours worked):</span>
                          <span>{formatCurrency(timesheet.subtotal)}</span>
                        </div>
                        {timesheet.distanceTravelAmount > 0 && (
                          <div className="flex justify-between">
                            <span>Travel allowance:</span>
                            <span>
                              {formatCurrency(timesheet.distanceTravelAmount)}
                            </span>
                          </div>
                        )}
                        <div className="flex justify-between">
                          <span>Total expenses:</span>
                          <span>{formatCurrency(timesheet.totalExpenses)}</span>
                        </div>
                        <Separator />
                        <div className="flex justify-between text-lg font-medium text-[#1e3b93]">
                          <span>Total Amount:</span>
                          <span>{formatCurrency(timesheet.totalAmount)}</span>
                        </div>
                        <div className="flex justify-between text-lg font-montserrat-bold">
                          <span>Grand Total:</span>
                          <span>{formatCurrency(timesheet.grandTotal)}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        {/* Right Column - Support Worker Info & Status */}
        <div className="space-y-6">
          {/* Support Worker Card */}
          <Card className="border-[#1e3b93]/10">
            <CardHeader className="pb-3">
              <CardTitle className="text-base text-[#1e3b93]">
                Support Worker
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4 mb-4">
                <Avatar className="h-12 w-12 border-2 border-[#1e3b93]/10">
                  <AvatarImage src={typeof timesheet.workerId === 'object' ? timesheet.workerId.profileImage : undefined} />
                  <AvatarFallback className="bg-[#1e3b93]/10 text-[#1e3b93] font-medium">
                    {typeof timesheet.workerId === 'object' 
                      ? timesheet.workerId.firstName.charAt(0) + timesheet.workerId.lastName.charAt(0)
                      : 'W'
                    }
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-medium">
                    {typeof timesheet.workerId === 'object' 
                      ? getFullName(timesheet.workerId)
                      : timesheet.workerId
                    }
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Support Worker
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <UserCircle className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">
                    {typeof timesheet.workerId === 'object' 
                      ? timesheet.workerId.email
                      : 'Email not available'
                    }
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">
                    {typeof timesheet.workerId === 'object' 
                      ? timesheet.workerId.phone
                      : 'Phone not available'
                    }
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Status Timeline */}
          <Card className="border-[#1e3b93]/10">
            <CardHeader className="pb-3">
              <CardTitle className="text-base text-[#1e3b93]">
                Status Timeline
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 rounded-full bg-primary-500 mt-2"></div>
                  <div>
                    <p className="text-sm font-medium">Timesheet Submitted</p>
                    <p className="text-xs text-muted-foreground">
                      {formatDateTime(timesheet.createdAt)}
                    </p>
                  </div>
                </div>

                {timesheet.approvedAt && (
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 rounded-full bg-green-500 mt-2"></div>
                    <div>
                      <p className="text-sm font-medium">Approved</p>
                      <p className="text-xs text-muted-foreground">
                        {formatDateTime(timesheet.approvedAt)}
                      </p>
                      {timesheet.approvedBy && (
                        <p className="text-xs text-muted-foreground">
                          by {timesheet.approvedBy}
                        </p>
                      )}
                    </div>
                  </div>
                )}

                {timesheet.isPaid && (
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 rounded-full bg-green-600 mt-2"></div>
                    <div>
                      <p className="text-sm font-medium">Payment Processed</p>
                      <p className="text-xs text-muted-foreground">
                        {formatCurrency(timesheet.grandTotal)} paid
                      </p>
                    </div>
                  </div>
                )}

                {timesheet.rejectionReason && (
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 rounded-full bg-red-500 mt-2"></div>
                    <div>
                      <p className="text-sm font-medium text-red-700">
                        Rejected
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {timesheet.rejectionReason}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Quick Summary Card */}
          <Card className="border-[#1e3b93]/10">
            <CardHeader className="pb-3">
              <CardTitle className="text-base text-[#1e3b93]">
                Quick Summary
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Date:</span>
                  <span className="font-medium">
                    {formatDate(timesheet.scheduledStartTime)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Duration:</span>
                  <span className="font-medium">
                    {formatDuration(
                      timesheet.actualStartTime,
                      timesheet.actualEndTime
                    )}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Service:</span>
                  <span className="font-medium capitalize">
                    {SERVICE_TYPE_LABELS[timesheet.shiftId.serviceType] ||
                      timesheet.shiftId.serviceType}
                  </span>
                </div>
                <Separator />
                <div className="flex justify-between text-[#1e3b93] font-medium">
                  <span>Total Earned:</span>
                  <span>{formatCurrency(timesheet.grandTotal)}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ParticipantTimesheetDetails;
