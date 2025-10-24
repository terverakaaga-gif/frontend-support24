import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { format } from "date-fns";
import {
  ArrowLeft,
  CheckCircle,
  DangerCircle,
  MapPoint,
} from "@solar-icons/react";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import {
  Magnifer,
  Letter,
  ClockCircle,
  Bill2,
  FileText,
} from "@solar-icons/react";

import { useGetTimesheet } from "@/hooks/useTimesheetHooks";
import {
  SERVICE_TYPE_LABELS,
  TIMESHEET_STATUS_CONFIG,
} from "@/entities/Timesheet";
import GeneralHeader from "@/components/GeneralHeader";
import { pageTitles } from "@/constants/pageTitles";
import { useAuth } from "@/contexts/AuthContext";

const ParticipantTimesheetDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const {user, logout} = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<
    "details" | "expenses" | "payments"
  >("details");
  const [searchTerm, setSearchTerm] = useState("");

  const { data: timesheet, isLoading, error } = useGetTimesheet(id || "", !!id);

  const handleGoBack = () => {
    navigate("/participant/timesheets");
  };

  // Helper functions
  const formatTime = (dateString: string) =>
    format(new Date(dateString), "h:mm a");
  const formatDate = (dateString: string) =>
    format(new Date(dateString), "MMM d, yyyy");
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

  const getStatusBadge = (status: string, isPaid: boolean) => {
    if (isPaid) {
      return (
        <Badge className="bg-green-50 text-green-700 border-green-200 font-medium">
          <CheckCircle className="w-3 h-3 mr-1" />
          Paid
        </Badge>
      );
    }

    const config =
      TIMESHEET_STATUS_CONFIG[status as keyof typeof TIMESHEET_STATUS_CONFIG];
    if (!config) {
      return (
        <Badge className="bg-gray-100 text-gray-700 border-gray-200 font-medium">
          <ClockCircle className="w-3 h-3 mr-1" />
          {status.charAt(0).toUpperCase() + status.slice(1)}
        </Badge>
      );
    }

    const colorMap: any = {
      pending: "bg-orange-50 text-orange-700 border-orange-200",
      approved: "bg-green-50 text-green-700 border-green-200",
      rejected: "bg-red-50 text-red-700 border-red-200",
    };

    return (
      <Badge
        className={`${
          colorMap[status] || "bg-gray-100 text-gray-700 border-gray-200"
        } font-medium`}
      >
        <ClockCircle className="w-3 h-3 mr-1" />
        {config.label}
      </Badge>
    );
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-100 p-8">
        <div className="max-w-7xl mx-auto space-y-6">
          <Skeleton className="h-12 w-64" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[...Array(3)].map((_, i) => (
              <Skeleton key={i} className="h-32" />
            ))}
          </div>
          <Skeleton className="h-96" />
        </div>
      </div>
    );
  }

  if (error || !timesheet) {
    return (
      <div className="min-h-screen bg-gray-100 p-4 md:p-6">
        <div className="max-w-md mx-auto mt-20">
          <Card className="border-0 shadow-lg">
            <CardContent className="p-8 text-center">
              <DangerCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Failed to load timesheet
              </h3>
              <p className="text-gray-600 mb-6">
                There was an error loading the timesheet details.
              </p>
              <Button
                onClick={handleGoBack}
                className="bg-primary-600 hover:bg-primary-700"
              >
                Try Again
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <div className=" p-6 md:p-8">
        {/* Header */}
        <GeneralHeader
        showBackButton
          title={pageTitles.participant["/participant/timesheets"].title.concat(' Details')}
         
          user={user}
          onViewProfile={() => {
            navigate(
              Object.keys(pageTitles.participant).find(
                (key) =>
                  key !== "/participant/timesheets" &&
                  pageTitles.participant[key] ===
                    pageTitles.participant["/participant/profile"]
              )
            );
          }}
          onLogout={logout}
        />

        {/* Tab Navigation */}
        <div className="flex flex-wrap gap-2 mb-6">
          <button
            onClick={() => setActiveTab("details")}
            className={`rounded-full font-semibold px-5 py-2 text-sm transition-all ${
              activeTab === "details"
                ? "bg-primary-600 text-white hover:bg-primary-700"
                : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-200"
            }`}
          >
            Shift Details
          </button>
          <button
            onClick={() => setActiveTab("expenses")}
            className={`rounded-full font-semibold px-5 py-2 text-sm transition-all ${
              activeTab === "expenses"
                ? "bg-primary-600 text-white hover:bg-primary-700"
                : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-200"
            }`}
          >
            Expenses ({timesheet.expenses.length})
          </button>
          <button
            onClick={() => setActiveTab("payments")}
            className={`rounded-full font-semibold px-5 py-2 text-sm transition-all ${
              activeTab === "payments"
                ? "bg-primary-600 text-white hover:bg-primary-700"
                : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-200"
            }`}
          >
            Payment Breakdown
          </button>
        </div>

        {/* Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Shift Details Tab */}
            {activeTab === "details" && (
              <div className="space-y-4">
                <h2 className="text-lg font-bold text-gray-900">
                  Shift Information
                </h2>

                <Card className="border-0 shadow-sm">
                  <CardContent className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Basic Info */}
                      <div className="space-y-4">
                        <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                          <FileText className="w-4 h-4 text-primary-600" />
                          Shift Details
                        </h3>
                        <div className="space-y-3 text-sm">
                          <div className="flex justify-between">
                            <span className="text-gray-600">Shift ID:</span>
                            <span className="font-semibold text-gray-900 font-mono">
                              {timesheet.shiftIdRef}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Service Type:</span>
                            <span className="font-semibold text-gray-900">
                              {SERVICE_TYPE_LABELS[
                                timesheet.shiftId.serviceType
                              ] || timesheet.shiftId.serviceType}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Organization:</span>
                            <span className="font-semibold text-gray-900 truncate max-w-[180px]">
                              {timesheet.organizationId.name}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Multi-Worker:</span>
                            <span className="font-semibold text-gray-900">
                              {timesheet.isMultiWorkerShift ? "Yes" : "No"}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Time Details */}
                      <div className="space-y-4">
                        <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                          <ClockCircle className="w-4 h-4 text-green-600" />
                          Time Tracking
                        </h3>
                        <div className="space-y-3 text-sm">
                          <div className="flex justify-between">
                            <span className="text-gray-600">Scheduled:</span>
                            <span className="font-semibold text-gray-900">
                              {formatTime(timesheet.scheduledStartTime)} -{" "}
                              {formatTime(timesheet.scheduledEndTime)}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Actual:</span>
                            <span className="font-semibold text-green-600">
                              {formatTime(timesheet.actualStartTime)} -{" "}
                              {formatTime(timesheet.actualEndTime)}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Duration:</span>
                            <span className="font-semibold text-gray-900">
                              {formatDuration(
                                timesheet.actualStartTime,
                                timesheet.actualEndTime
                              )}
                            </span>
                          </div>
                          {timesheet.extraTime > 0 && (
                            <div className="flex justify-between">
                              <span className="text-gray-600">Extra Time:</span>
                              <span className="font-semibold text-primary-600">
                                +{timesheet.extraTime} minutes
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Travel Information */}
                    {timesheet.distanceTravelKm > 0 && (
                      <div className="mt-6 pt-6 border-t">
                        <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                          <MapPoint className="w-4 h-4 text-purple-600" />
                          Travel Information
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                          <div className="flex justify-between">
                            <span className="text-gray-600">Distance:</span>
                            <span className="font-semibold text-gray-900">
                              {timesheet.distanceTravelKm} km
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Rate:</span>
                            <span className="font-semibold text-gray-900">
                              {formatCurrency(timesheet.distanceTravelRate)}/km
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Travel Pay:</span>
                            <span className="font-semibold text-purple-600">
                              {formatCurrency(timesheet.distanceTravelAmount)}
                            </span>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Notes */}
                    {timesheet.notes && (
                      <div className="mt-6 pt-6 border-t">
                        <h3 className="font-semibold text-gray-900 mb-3">
                          Notes
                        </h3>
                        <div className="p-4 bg-primary/10 rounded-lg">
                          <p className="text-sm text-primary leading-relaxed">
                            {timesheet.notes}
                          </p>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Expenses Tab */}
            {activeTab === "expenses" && (
              <div className="space-y-4">
                <h2 className="text-lg font-bold text-gray-900">
                  Expenses ({timesheet.expenses.length})
                </h2>

                {timesheet.expenses.length === 0 ? (
                  <Card className="border-0 shadow-sm">
                    <CardContent className="p-12 text-center">
                      <Bill2 className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">
                        No expenses
                      </h3>
                      <p className="text-gray-600">
                        No expenses were recorded for this shift.
                      </p>
                    </CardContent>
                  </Card>
                ) : (
                  <div className="space-y-3">
                    {timesheet.expenses.map((expense) => (
                      <Card key={expense._id} className="border-0 shadow-sm">
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between gap-4">
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-1">
                                <h3 className="font-semibold text-gray-900">
                                  {expense.title}
                                </h3>
                                <Badge
                                  className={
                                    expense.payer === "participant"
                                      ? "bg-primary-50 text-primary-700 text-xs"
                                      : "bg-gray-100 text-gray-700 text-xs"
                                  }
                                >
                                  {expense.payer === "participant"
                                    ? "Participant"
                                    : "Worker"}
                                </Badge>
                              </div>
                              <p className="text-sm text-gray-600 mb-2">
                                {expense.description}
                              </p>
                              {expense.receiptUrl && (
                                <a
                                  href={expense.receiptUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-sm text-primary-600 hover:text-primary-700 font-medium"
                                >
                                  View Receipt →
                                </a>
                              )}
                            </div>
                            <div className="text-right">
                              <p className="text-xl font-bold text-primary-600">
                                {formatCurrency(expense.amount)}
                              </p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}

                    {/* Total Card */}
                    <Card className="border-0 shadow-sm bg-primary-50">
                      <CardContent className="p-4">
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-gray-700">
                              Participant Expenses:
                            </span>
                            <span className="font-semibold text-gray-900">
                              {formatCurrency(
                                timesheet.participantExpensesTotal
                              )}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-700">
                              Worker Expenses:
                            </span>
                            <span className="font-semibold text-gray-900">
                              {formatCurrency(timesheet.workerExpensesTotal)}
                            </span>
                          </div>
                          <div className="flex justify-between pt-2 border-t border-primary-200">
                            <span className="font-bold text-primary-900">
                              Total Expenses:
                            </span>
                            <span className="font-bold text-primary-900">
                              {formatCurrency(timesheet.totalExpenses)}
                            </span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                )}
              </div>
            )}

            {/* Payment Breakdown Tab */}
            {activeTab === "payments" && (
              <div className="space-y-4">
                <h2 className="text-lg font-bold text-gray-900">
                  Payment Breakdown
                </h2>

                <Card className="border-0 shadow-sm">
                  <CardContent className="p-6">
                    <h3 className="font-semibold text-gray-900 mb-4">
                      Rate Calculations
                    </h3>
                    <div className="space-y-3">
                      {timesheet.rateCalculations.map((calc) => (
                        <div
                          key={calc._id}
                          className="p-4 bg-gray-100 rounded-lg"
                        >
                          <div className="flex justify-between items-start mb-1">
                            <div>
                              <h4 className="font-semibold text-gray-900">
                                {calc.name}
                              </h4>
                              <p className="text-sm text-gray-600 mt-1">
                                {calc.hours.toFixed(2)} hours ×{" "}
                                {formatCurrency(calc.hourlyRate)}/hour
                              </p>
                            </div>
                            <span className="font-bold text-primary-600 text-lg">
                              {formatCurrency(calc.amount)}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="mt-6 pt-6 border-t">
                      <h3 className="font-semibold text-gray-900 mb-4">
                        Payment Summary
                      </h3>
                      <div className="space-y-3 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-600">
                            Subtotal (Hours worked):
                          </span>
                          <span className="font-semibold text-gray-900">
                            {formatCurrency(timesheet.subtotal)}
                          </span>
                        </div>
                        {timesheet.distanceTravelAmount > 0 && (
                          <div className="flex justify-between">
                            <span className="text-gray-600">
                              Travel allowance:
                            </span>
                            <span className="font-semibold text-gray-900">
                              {formatCurrency(timesheet.distanceTravelAmount)}
                            </span>
                          </div>
                        )}
                        <div className="flex justify-between">
                          <span className="text-gray-600">Total expenses:</span>
                          <span className="font-semibold text-gray-900">
                            {formatCurrency(timesheet.totalExpenses)}
                          </span>
                        </div>
                        <div className="flex justify-between pt-3 border-t">
                          <span className="font-semibold text-gray-900">
                            Total Amount:
                          </span>
                          <span className="font-semibold text-primary-600">
                            {formatCurrency(timesheet.totalAmount)}
                          </span>
                        </div>
                        <div className="flex justify-between pt-2 border-t-2 border-primary-600">
                          <span className="font-bold text-gray-900 text-lg">
                            Grand Total:
                          </span>
                          <span className="font-bold text-primary-600 text-xl">
                            {formatCurrency(timesheet.grandTotal)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>

          {/* Sidebar - Worker Details */}
          <div className="hidden lg:block">
            <Card className="border-0 shadow-sm sticky top-6">
              <CardContent className="p-0">
                <div className="p-4 border-b">
                  <h3 className="font-bold text-gray-900">Support Worker</h3>
                </div>

                <div className="p-4 space-y-4">
                  {/* Worker Info */}
                  <div className="text-center">
                    <Avatar className="w-20 h-20 mx-auto mb-3">
                      <AvatarImage
                        src={
                          typeof timesheet.workerId === "object"
                            ? timesheet.workerId.profileImage
                            : undefined
                        }
                      />
                      <AvatarFallback className="bg-primary-100 text-primary-700 text-2xl font-semibold">
                        {typeof timesheet.workerId === "object"
                          ? timesheet.workerId.firstName.charAt(0) +
                            timesheet.workerId.lastName.charAt(0)
                          : "W"}
                      </AvatarFallback>
                    </Avatar>
                    <h4 className="font-bold text-gray-900 mb-1">
                      {typeof timesheet.workerId === "object"
                        ? getFullName(timesheet.workerId)
                        : timesheet.workerId}
                    </h4>
                    <p className="text-sm text-gray-600 mb-0.5">
                      {typeof timesheet.workerId === "object"
                        ? timesheet.workerId.email
                        : "Email not available"}
                    </p>
                    <p className="text-sm text-gray-600">
                      {typeof timesheet.workerId === "object"
                        ? timesheet.workerId.phone
                        : "Phone not available"}
                    </p>
                  </div>

                  {/* Status Timeline */}
                  <div className="pt-4 border-t">
                    <h5 className="font-semibold text-gray-900 mb-3">
                      Status Timeline
                    </h5>
                    <div className="space-y-3">
                      <div className="flex items-start gap-3">
                        <div className="w-2 h-2 rounded-full bg-primary-600 mt-2 flex-shrink-0"></div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900">
                            Timesheet Submitted
                          </p>
                          <p className="text-xs text-gray-600">
                            {formatDateTime(timesheet.createdAt)}
                          </p>
                        </div>
                      </div>

                      {timesheet.approvedAt && (
                        <div className="flex items-start gap-3">
                          <div className="w-2 h-2 rounded-full bg-green-600 mt-2 flex-shrink-0"></div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900">
                              Approved
                            </p>
                            <p className="text-xs text-gray-600">
                              {formatDateTime(timesheet.approvedAt)}
                            </p>
                            {timesheet.approvedBy && (
                              <p className="text-xs text-gray-600">
                                by {timesheet.approvedBy}
                              </p>
                            )}
                          </div>
                        </div>
                      )}

                      {timesheet.isPaid && (
                        <div className="flex items-start gap-3">
                          <div className="w-2 h-2 rounded-full bg-green-700 mt-2 flex-shrink-0"></div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900">
                              Payment Processed
                            </p>
                            <p className="text-xs text-gray-600">
                              {formatCurrency(timesheet.grandTotal)} paid
                            </p>
                          </div>
                        </div>
                      )}

                      {timesheet.rejectionReason && (
                        <div className="flex items-start gap-3">
                          <div className="w-2 h-2 rounded-full bg-red-600 mt-2 flex-shrink-0"></div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-red-700">
                              Rejected
                            </p>
                            <p className="text-xs text-gray-600">
                              {timesheet.rejectionReason}
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Quick Summary */}
                  <div className="pt-4 border-t">
                    <h5 className="font-semibold text-gray-900 mb-3">
                      Quick Summary
                    </h5>
                    <div className="space-y-3 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Date:</span>
                        <span className="font-semibold text-gray-900">
                          {formatDate(timesheet.scheduledStartTime)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Duration:</span>
                        <span className="font-semibold text-gray-900">
                          {formatDuration(
                            timesheet.actualStartTime,
                            timesheet.actualEndTime
                          )}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Service:</span>
                        <span className="font-semibold text-gray-900">
                          {SERVICE_TYPE_LABELS[timesheet.shiftId.serviceType] ||
                            timesheet.shiftId.serviceType}
                        </span>
                      </div>
                      <div className="flex justify-between pt-3 border-t">
                        <span className="text-gray-600 font-semibold">
                          Total Earned:
                        </span>
                        <span className="font-bold text-primary-600">
                          {formatCurrency(timesheet.grandTotal)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Mobile Sidebar - Bottom Sheet Style */}
        <div className="lg:hidden mt-6 space-y-4">
          <Card className="border-0 shadow-sm">
            <CardContent className="p-4">
              <h3 className="font-bold text-gray-900 mb-4">Support Worker</h3>

              <div className="flex items-center gap-3 mb-4">
                <Avatar className="w-12 h-12">
                  <AvatarImage
                    src={
                      typeof timesheet.workerId === "object"
                        ? timesheet.workerId.profileImage
                        : undefined
                    }
                  />
                  <AvatarFallback className="bg-primary-100 text-primary-700 font-semibold">
                    {typeof timesheet.workerId === "object"
                      ? timesheet.workerId.firstName.charAt(0) +
                        timesheet.workerId.lastName.charAt(0)
                      : "W"}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h4 className="font-semibold text-gray-900">
                    {typeof timesheet.workerId === "object"
                      ? getFullName(timesheet.workerId)
                      : timesheet.workerId}
                  </h4>
                  <p className="text-sm text-gray-600">
                    {typeof timesheet.workerId === "object"
                      ? timesheet.workerId.email
                      : "Email not available"}
                  </p>
                </div>
              </div>

              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Date:</span>
                  <span className="font-semibold text-gray-900">
                    {formatDate(timesheet.scheduledStartTime)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Duration:</span>
                  <span className="font-semibold text-gray-900">
                    {formatDuration(
                      timesheet.actualStartTime,
                      timesheet.actualEndTime
                    )}
                  </span>
                </div>
                <div className="flex justify-between pt-3 border-t">
                  <span className="text-gray-600 font-semibold">
                    Total Earned:
                  </span>
                  <span className="font-bold text-primary-600">
                    {formatCurrency(timesheet.grandTotal)}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-sm">
            <CardContent className="p-4">
              <h3 className="font-bold text-gray-900 mb-4">Status Timeline</h3>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 rounded-full bg-primary-600 mt-2 flex-shrink-0"></div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900">
                      Timesheet Submitted
                    </p>
                    <p className="text-xs text-gray-600">
                      {formatDateTime(timesheet.createdAt)}
                    </p>
                  </div>
                </div>

                {timesheet.approvedAt && (
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 rounded-full bg-green-600 mt-2 flex-shrink-0"></div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900">
                        Approved
                      </p>
                      <p className="text-xs text-gray-600">
                        {formatDateTime(timesheet.approvedAt)}
                      </p>
                      {timesheet.approvedBy && (
                        <p className="text-xs text-gray-600">
                          by {timesheet.approvedBy}
                        </p>
                      )}
                    </div>
                  </div>
                )}

                {timesheet.isPaid && (
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 rounded-full bg-green-700 mt-2 flex-shrink-0"></div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900">
                        Payment Processed
                      </p>
                      <p className="text-xs text-gray-600">
                        {formatCurrency(timesheet.grandTotal)} paid
                      </p>
                    </div>
                  </div>
                )}

                {timesheet.rejectionReason && (
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 rounded-full bg-red-600 mt-2 flex-shrink-0"></div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-red-700">
                        Rejected
                      </p>
                      <p className="text-xs text-gray-600">
                        {timesheet.rejectionReason}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ParticipantTimesheetDetails;
