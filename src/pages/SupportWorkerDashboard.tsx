/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Clock,
  Users,
  DollarSign,
  Star,
  MessageSquare,
  CalendarIcon,
  Download,
  FileCheck,
  FileWarning,
  Inbox,
  Calendar,
  CheckCircle,
  MapPin,
  Activity,
  XCircle,
  TrendingUp,
  Target,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { StatCard } from "@/components/StatCard";
import { ChartSection } from "@/components/ChartSection";
import { NotificationsList } from "@/components/NotificationsList";
import { ParticipantInvitations } from "@/components/supportworker/ParticipantInvitations";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { ProfileSetupAlert } from "@/components/ProfileSetupAlert";
import { useAuth } from "@/contexts/AuthContext";
import { SupportWorker } from "@/types/user.types";
import { cn } from "@/lib/utils";
import { 
  useGetSupportWorkerOverview, 
  useGetSupportWorkerFinancial, 
  useGetSupportWorkerSchedule, 
  useGetSupportWorkerPerformance 
} from "@/hooks/useAnalyticsHooks";

// Service type labels for display
const SERVICE_TYPE_LABELS: Record<string, string> = {
  personalCare: 'Personal Care',
  socialSupport: 'Social Support',
  transport: 'Transport',
  householdTasks: 'Household Tasks',
  mealPreparation: 'Meal Preparation',
  medicationSupport: 'Medication Support',
  mobilityAssistance: 'Mobility Assistance',
  therapySupport: 'Therapy Support',
  behaviorSupport: 'Behavior Support',
  communityAccess: 'Community Access'
};

// Mock notifications - these could come from a notifications API later
const notifications = [
  {
    id: "1",
    type: "booking" as const,
    title: "New Booking Request",
    description: "Emma Wilson requested support for tomorrow at 2 PM",
    time: "10 minutes ago",
  },
  {
    id: "2",
    type: "message" as const,
    title: "New Message",
    description:
      "John's guardian sent you a message about the upcoming session",
    time: "1 hour ago",
  },
  {
    id: "3",
    type: "reminder" as const,
    title: "Shift Starting Soon",
    description: "You have a shift with Emma Wilson in 30 minutes",
    time: "unread",
  },
];

export default function SupportWorkerDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();

  // Fetch analytics data
  const { data: overviewData, isLoading: overviewLoading, error: overviewError } = useGetSupportWorkerOverview('month', true);
  const { data: financialData, isLoading: financialLoading, error: financialError } = useGetSupportWorkerFinancial('month');
  const { data: scheduleData, isLoading: scheduleLoading, error: scheduleError } = useGetSupportWorkerSchedule('month');
  const { data: performanceData, isLoading: performanceLoading, error: performanceError } = useGetSupportWorkerPerformance('month');

  // Format data for charts
  const earningsTrendData = financialData?.earnings?.trend || [];
  const weeklyHoursData = scheduleData?.weeklyHours || [];
  const shiftsByServiceType = scheduleData?.shiftDistribution?.byServiceType || {};

  // Function to handle view shift details
  const handleViewShiftDetails = (shiftId: string) => {
    navigate(`/support-worker/shifts/${shiftId}`);
  };

  if (overviewLoading || financialLoading || scheduleLoading || performanceLoading) {
    return (
      <div className="container py-6 space-y-8">
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <Activity className="mx-auto h-12 w-12 animate-spin text-[#1e3b93]" />
            <p className="mt-4 text-muted-foreground">Loading your dashboard...</p>
          </div>
        </div>
      </div>
    );
  }

  if (overviewError || financialError || scheduleError || performanceError) {
    return (
      <div className="container py-6 space-y-8">
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <XCircle className="mx-auto h-12 w-12 text-red-500" />
            <p className="mt-4 text-muted-foreground">Failed to load dashboard data</p>
            <Button 
              className="mt-4 bg-[#1e3b93] hover:bg-[#1e3b93]/90"
              onClick={() => window.location.reload()}
            >
              Try Again
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-6 space-y-8">
      {/* Show alert if support worker hasn't completed onboarding */}
      {user &&
        user.role === "supportWorker" &&
        !(user as SupportWorker).verificationStatus?.profileSetupComplete && (
          <ProfileSetupAlert userName={user.firstName.split(" ")[0]} />
        )}

      {/* Header Section */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-guardian">
            Support Worker Dashboard
          </h1>
          <p className="text-muted-foreground mt-2">
            Welcome back, {user.firstName}! Here's your overview.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <Button
            variant="outline"
            className="flex items-center gap-2 border-guardian/20 hover:bg-guardian/10 hover:border-guardian/40"
          >
            <MessageSquare className="h-4 w-4 text-guardian" />
            <span className="text-guardian">Contact Admin</span>
          </Button>
          <Button
            variant="outline"
            className="flex items-center gap-2 border-guardian/20 hover:bg-guardian/10 hover:border-guardian/40"
            onClick={() => navigate("/support-worker/shifts")}
          >
            <CalendarIcon className="h-4 w-4 text-guardian" />
            <span className="text-guardian">View Schedule</span>
          </Button>
          <Button className="flex items-center gap-2 bg-guardian hover:bg-guardian/90">
            <Download className="h-4 w-4" />
            Export Report
          </Button>
          <Button className="flex items-center gap-2 bg-green-600 hover:bg-green-700">
            <CheckCircle className="h-4 w-4" />
            Start Shift
          </Button>
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <StatCard
          title="Hours Worked"
          value={`${overviewData?.workSummary?.hoursWorked?.current || 0}h`}
          icon={<Clock size={24} className="text-guardian" />}
          change={{
            value: `${overviewData?.workSummary?.hoursWorked?.percentageChange || 0}% from last month`,
            positive: (overviewData?.workSummary?.hoursWorked?.trend === 'up')
          }}
          className="border-guardian/10 hover:shadow-lg transition-shadow"
        />
        <StatCard
          title="Active Clients"
          value={overviewData?.workSummary?.activeClients?.toString() || "0"}
          icon={<Users size={24} className="text-guardian" />}
          additionalText="Currently supporting"
          className="border-guardian/10 hover:shadow-lg transition-shadow"
        />
        <StatCard
          title="Earnings"
          value={`$${overviewData?.workSummary?.earnings?.current?.toFixed(2) || "0.00"}`}
          icon={<DollarSign size={24} className="text-guardian" />}
          change={{
            value: `${overviewData?.workSummary?.earnings?.percentageChange || 0}% from last month`,
            positive: (overviewData?.workSummary?.earnings?.trend === 'up')
          }}
          className="border-guardian/10 hover:shadow-lg transition-shadow"
        />
        <StatCard
          title="Performance Rating"
          value={overviewData?.performanceMetrics?.averageRating > 0 ? `${overviewData.performanceMetrics.averageRating.toFixed(1)}/5` : "Not rated"}
          icon={<Star size={24} className="text-guardian" />}
          additionalText={`${overviewData?.performanceMetrics?.onTimeRate || 0}% on-time rate`}
          className="border-guardian/10 hover:shadow-lg transition-shadow"
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Upcoming Shifts */}
        <div className="lg:col-span-2">
          <Card className="border-guardian/10 transition-all duration-200 hover:shadow-lg">
            <CardHeader className="pb-4 border-b border-guardian/10">
              <div className="flex justify-between items-center">
                <CardTitle className="text-lg font-medium text-guardian">
                  Upcoming Shifts
                </CardTitle>
                <Button
                  variant="link"
                  className="text-sm p-0 text-guardian hover:text-guardian/80"
                >
                  View All
                </Button>
              </div>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="space-y-4">
                {overviewData?.workSummary?.upcomingShifts && overviewData.workSummary.upcomingShifts.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {overviewData.workSummary.upcomingShifts.slice(0, 2).map((shift: any, index: number) => (
                      <Card key={index} className="border-guardian/10 transition-all duration-200 hover:shadow-md hover:border-guardian/20">
                        <CardContent className="p-5">
                          <div className="flex justify-between items-start mb-4">
                            <div>
                              <h4 className="font-semibold text-gray-900">
                                {shift.participantName || 'Participant'}
                              </h4>
                              <p className="text-sm text-muted-foreground">
                                {SERVICE_TYPE_LABELS[shift.serviceType] || shift.serviceType}
                              </p>
                            </div>
                            <Button
                              variant="outline"
                              size="sm"
                              className="border-guardian/20 text-guardian hover:bg-guardian/10"
                              onClick={() => handleViewShiftDetails(shift._id)}
                            >
                              View Details
                            </Button>
                          </div>
                          <div className="space-y-3">
                            <div className="flex items-center gap-2 text-sm">
                              <div className="w-6 h-6 rounded-full bg-guardian/10 flex items-center justify-center">
                                <Calendar className="h-3 w-3 text-guardian" />
                              </div>
                              <span className="text-gray-700">
                                {new Date(shift.startTime).toLocaleDateString()} • {new Date(shift.startTime).toLocaleTimeString()} - {new Date(shift.endTime).toLocaleTimeString()}
                              </span>
                            </div>
                            <div className="flex items-center gap-2 text-sm">
                              <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center">
                                <FileCheck className="h-3 w-3 text-green-600" />
                              </div>
                              <span className="text-green-600 font-medium">
                                {shift.status || 'Confirmed'}
                              </span>
                            </div>
                            {shift.address && (
                              <div className="flex items-center gap-2 text-sm">
                                <div className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center">
                                  <MapPin className="h-3 w-3 text-gray-600" />
                                </div>
                                <span className="text-gray-600">{shift.address}</span>
                              </div>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <Calendar className="mx-auto h-12 w-12 mb-4 text-[#1e3b93]/30" />
                    <p>No upcoming shifts scheduled</p>
                    <Button 
                      className="mt-4 bg-guardian hover:bg-guardian/90"
                      onClick={() => navigate("/support-worker/shifts")}
                    >
                      View Schedule
                    </Button>
                  </div>
                )}

                {/* Quick Actions */}
                <div className="mt-6 p-4 bg-[#1e3b93]/5 rounded-lg border border-[#1e3b93]/10">
                  <h4 className="font-medium text-[#1e3b93] mb-3">
                    Quick Actions
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      className="border-[#1e3b93]/20 text-[#1e3b93] hover:bg-[#1e3b93]/10"
                    >
                      Clock In
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="border-[#1e3b93]/20 text-[#1e3b93] hover:bg-[#1e3b93]/10"
                    >
                      Submit Report
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="border-[#1e3b93]/20 text-[#1e3b93] hover:bg-[#1e3b93]/10"
                    >
                      Update Availability
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Notifications */}
        <div>
          <Card className="border-guardian/10 transition-all duration-200 hover:shadow-lg">
            <CardHeader className="border-b border-guardian/10">
              <CardTitle className="text-lg font-medium text-guardian">
                Notifications
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <NotificationsList notifications={notifications} />
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Analytics Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Earnings Trend */}
        <ChartSection
          title="Monthly Earnings Trend"
          data={earningsTrendData}
          type="line"
          dataKey="value"
          xAxisKey="label"
          className="border-guardian/10"
        />
        
        {/* Weekly Hours */}
        <ChartSection
          title="Weekly Hours Worked"
          data={weeklyHoursData}
          type="bar"
          dataKey="value"
          xAxisKey="label"
          className="border-guardian/10"
        />
      </div>

      {/* Service Distribution */}
      {Object.keys(shiftsByServiceType).length > 0 && (
        <Card className="border-guardian/10 transition-all duration-200 hover:shadow-lg">
          <CardHeader>
            <CardTitle className="text-lg font-medium text-guardian">
              Service Type Distribution This Month
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {Object.entries(shiftsByServiceType).map(([serviceType, count]) => (
                <div key={serviceType} className="p-4 rounded-lg border border-guardian/10">
                  <div className="flex justify-between items-center mb-2">
                    <h4 className="font-medium text-gray-900">
                      {SERVICE_TYPE_LABELS[serviceType] || serviceType}
                    </h4>
                    <Badge variant="secondary" className="bg-guardian/10 text-guardian">
                      {count} shifts
                    </Badge>
                  </div>
                  <Progress 
                    value={(count / Math.max(...Object.values(shiftsByServiceType))) * 100} 
                    className="mt-2 h-2"
                  />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Financial Summary */}
      {financialData && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="border-guardian/10 transition-all duration-200 hover:shadow-lg">
            <CardHeader>
              <CardTitle className="text-lg font-medium text-guardian">
                Financial Summary
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                  <span className="text-sm font-medium text-gray-900">Current Period Earnings</span>
                  <span className="font-semibold text-green-600">${financialData.earnings.currentPeriod.toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-yellow-50 rounded-lg">
                  <span className="text-sm font-medium text-gray-900">Pending Payments</span>
                  <span className="font-semibold text-yellow-600">${financialData.earnings.pending.toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                  <span className="text-sm font-medium text-gray-900">Average Hourly Rate</span>
                  <span className="font-semibold text-blue-600">${financialData.projections.averageHourlyRate.toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <span className="text-sm font-medium text-gray-900">Travel Reimbursements</span>
                  <span className="font-semibold text-gray-600">${financialData.expenses.travelReimbursements.toFixed(2)}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Performance Metrics */}
          <Card className="border-guardian/10 transition-all duration-200 hover:shadow-lg">
            <CardHeader>
              <CardTitle className="text-lg font-medium text-guardian">
                Performance Overview
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-gray-900">Completion Rate</span>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-guardian">{overviewData?.performanceMetrics?.completionRate || 0}%</span>
                    <Target className="h-4 w-4 text-guardian" />
                  </div>
                </div>
                <Progress value={overviewData?.performanceMetrics?.completionRate || 0} className="h-2" />
                
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-gray-900">On-Time Rate</span>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-green-600">{overviewData?.performanceMetrics?.onTimeRate || 0}%</span>
                    <CheckCircle className="h-4 w-4 text-green-600" />
                  </div>
                </div>
                <Progress value={overviewData?.performanceMetrics?.onTimeRate || 0} className="h-2" />

                {performanceData?.availabilityComparison && (
                  <>
                    <div className="pt-2 border-t">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium text-gray-900">Availability Utilization</span>
                        <span className="font-semibold text-guardian">{performanceData.availabilityComparison.utilizationPercentage.toFixed(1)}%</span>
                      </div>
                      <div className="text-xs text-muted-foreground space-y-1">
                        <div className="flex justify-between">
                          <span>Available Hours:</span>
                          <span>{performanceData.availabilityComparison.availableHours}h</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Booked Hours:</span>
                          <span>{performanceData.availabilityComparison.bookedHours}h</span>
                        </div>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Participant Invitations */}
      <div>
        <Card className="border-guardian/10 transition-all duration-200 hover:shadow-lg">
          <CardHeader className="border-b border-guardian/10">
            <CardTitle className="text-lg font-medium text-guardian">
              Participant Invitations
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <ParticipantInvitations />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
