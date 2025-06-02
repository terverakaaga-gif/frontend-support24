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
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { StatCard } from "@/components/StatCard";
import { NotificationsList } from "@/components/NotificationsList";
import { ParticipantInvitations } from "@/components/supportworker/ParticipantInvitations";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useState } from "react";
import { ProfileSetupAlert } from "@/components/ProfileSetupAlert";
import { useAuth } from "@/contexts/AuthContext";
import { SupportWorker } from "@/types/user.types";
import { cn } from "@/lib/utils";

// Mock notifications - fixed type values to match the allowed types
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

// Mock upcoming shifts
const upcomingShifts = [
  {
    id: "1",
    client: "John Smith",
    date: "03/15/2024",
    timeStart: "9:00 AM",
    timeEnd: "2:00 PM",
    location: "Brighton East",
    details: "Personal care and mobility assistance",
  },
  {
    id: "2",
    client: "John Smith",
    date: "03/17/2024",
    timeStart: "9:00 AM",
    timeEnd: "2:00 PM",
    location: "Brighton East",
    details: "Community outing to library and park",
  },
  {
    id: "3",
    client: "John Smith",
    date: "03/19/2024",
    timeStart: "9:00 AM",
    timeEnd: "2:00 PM",
    location: "Brighton East",
    details: "Swimming therapy and exercise routine",
  },
];

// Mock certifications
const certifications = [
  {
    id: "1",
    name: "First Aid Certification",
    status: "expiring",
    description:
      "Required for all support workers. Must be completed within 30 days.",
    dueDate: "2024-04-15",
    action: "Start Training",
    actionType: "training",
  },
  {
    id: "2",
    name: "Manual Handling",
    status: "valid",
    description: "Completed: 2024-02-01",
    expiry: "2025-02-01",
    action: "View Certificate",
    actionType: "view",
  },
  {
    id: "3",
    name: "Infection Control",
    status: "recommended",
    description: "Recommended for enhanced safety protocols.",
    action: "Start Training",
    actionType: "training",
  },
];

// Calendar data
const calendarData = {
  month: "March 2024",
  days: [
    { number: 1, day: "Fri", shifts: 0 },
    { number: 2, day: "Sat", shifts: 0 },
    { number: 3, day: "Sun", shifts: 0 },
    { number: 4, day: "Mon", shifts: 0 },
    { number: 5, day: "Tue", shifts: 0 },
    { number: 6, day: "Wed", shifts: 0 },
    { number: 7, day: "Thu", shifts: 0 },
    { number: 8, day: "Fri", shifts: 0 },
    { number: 9, day: "Sat", shifts: 0 },
    { number: 10, day: "Sun", shifts: 0 },
    { number: 11, day: "Mon", shifts: 0 },
    { number: 12, day: "Tue", shifts: 2 },
    { number: 13, day: "Wed", shifts: 2 },
    { number: 14, day: "Thu", shifts: 0 },
    { number: 15, day: "Fri", shifts: 0 },
    { number: 16, day: "Sat", shifts: 0 },
    { number: 17, day: "Sun", shifts: 0 },
    { number: 18, day: "Mon", shifts: 0 },
    { number: 19, day: "Tue", shifts: 0 },
    { number: 20, day: "Wed", shifts: 0 },
    { number: 21, day: "Thu", shifts: 0 },
    { number: 22, day: "Fri", shifts: 0 },
    { number: 23, day: "Sat", shifts: 0 },
    { number: 24, day: "Sun", shifts: 0 },
    { number: 25, day: "Mon", shifts: 0 },
    { number: 26, day: "Tue", shifts: 0 },
    { number: 27, day: "Wed", shifts: 0 },
    { number: 28, day: "Thu", shifts: 0 },
    { number: 29, day: "Fri", shifts: 0 },
    { number: 30, day: "Sat", shifts: 0 },
  ],
  upcomingShifts: [
    {
      date: "3/12/2024",
      time: "9:00 AM - 2:00 PM",
      location: "Brighton East",
      type: "Personal Care",
    },
  ],
};

export default function SupportWorkerDashboard() {
  const { user } = useAuth();
  const [availabilityStatus, setAvailabilityStatus] = useState("available");
  const navigate = useNavigate();

  // Function to handle view shift details
  const handleViewShiftDetails = (shiftId: string) => {
    navigate(`/support-worker/shifts/${shiftId}`);
  };

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
          <h1 className="text-3xl font-bold tracking-tight text-[#1e3b93]">
            Support Worker Dashboard
          </h1>
          <p className="text-muted-foreground mt-2">
            Welcome back, {user.firstName}! Here's your overview.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <Button
            variant="outline"
            className="flex items-center gap-2 border-[#1e3b93]/20 hover:bg-[#1e3b93]/10 hover:border-[#1e3b93]/40"
          >
            <MessageSquare className="h-4 w-4 text-[#1e3b93]" />
            <span className="text-[#1e3b93]">Contact Admin</span>
          </Button>
          <Button
            variant="outline"
            className="flex items-center gap-2 border-[#1e3b93]/20 hover:bg-[#1e3b93]/10 hover:border-[#1e3b93]/40"
            onClick={() => navigate("/support-worker/shifts")}
          >
            <CalendarIcon className="h-4 w-4 text-[#1e3b93]" />
            <span className="text-[#1e3b93]">View Schedule</span>
          </Button>
          <Button className="flex items-center gap-2 bg-[#1e3b93] hover:bg-[#1e3b93]/90">
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
          title="Total Hours"
          value="156h"
          icon={<Clock size={24} className="text-[#1e3b93]" />}
          additionalText="This month"
          className="border-[#1e3b93]/10 hover:shadow-lg transition-shadow"
        />
        <StatCard
          title="Active Clients"
          value="12"
          icon={<Users size={24} className="text-[#1e3b93]" />}
          change={{ value: "+2 from last month", positive: true }}
          className="border-[#1e3b93]/10 hover:shadow-lg transition-shadow"
        />
        <StatCard
          title="Earnings"
          value="$3,240"
          icon={<DollarSign size={24} className="text-[#1e3b93]" />}
          additionalText="This month"
          className="border-[#1e3b93]/10 hover:shadow-lg transition-shadow"
        />
        <StatCard
          title="Rating"
          value="4.8/5"
          icon={<Star size={24} className="text-[#1e3b93]" />}
          change={{ value: "+0.2 from last month", positive: true }}
          className="border-[#1e3b93]/10 hover:shadow-lg transition-shadow"
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Upcoming Shifts */}
        <div className="lg:col-span-2">
          <Card className="border-[#1e3b93]/10 transition-all duration-200 hover:shadow-lg">
            <CardHeader className="pb-4 border-b border-[#1e3b93]/10">
              <div className="flex justify-between items-center">
                <CardTitle className="text-lg font-medium text-[#1e3b93]">
                  Upcoming Shifts
                </CardTitle>
                <Button
                  variant="link"
                  className="text-sm p-0 text-[#1e3b93] hover:text-[#1e3b93]/80"
                >
                  View All
                </Button>
              </div>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Card className="border-2 border-[#1e3b93]/20 bg-[#1e3b93]/5 transition-all duration-200 hover:shadow-md">
                    <CardContent className="p-5">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h4 className="font-semibold text-gray-900">
                            Emma Wilson
                          </h4>
                          <p className="text-sm text-muted-foreground">
                            Personal Care
                          </p>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          className="border-[#1e3b93]/20 text-[#1e3b93] hover:bg-[#1e3b93]/10"
                        >
                          View Details
                        </Button>
                      </div>
                      <div className="space-y-3">
                        <div className="flex items-center gap-2 text-sm">
                          <div className="w-6 h-6 rounded-full bg-[#1e3b93]/10 flex items-center justify-center">
                            <Calendar className="h-3 w-3 text-[#1e3b93]" />
                          </div>
                          <span className="text-gray-700">
                            Today, 2:00 PM - 5:00 PM
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center">
                            <FileCheck className="h-3 w-3 text-green-600" />
                          </div>
                          <span className="text-green-600 font-medium">
                            Confirmed
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <div className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center">
                            <MapPin className="h-3 w-3 text-gray-600" />
                          </div>
                          <span className="text-gray-600">Brighton East</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="border-[#1e3b93]/10 transition-all duration-200 hover:shadow-md hover:border-[#1e3b93]/20">
                    <CardContent className="p-5">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h4 className="font-semibold text-gray-900">
                            John Smith
                          </h4>
                          <p className="text-sm text-muted-foreground">
                            Physiotherapy
                          </p>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          className="border-[#1e3b93]/20 text-[#1e3b93] hover:bg-[#1e3b93]/10"
                        >
                          View Details
                        </Button>
                      </div>
                      <div className="space-y-3">
                        <div className="flex items-center gap-2 text-sm">
                          <div className="w-6 h-6 rounded-full bg-[#1e3b93]/10 flex items-center justify-center">
                            <Calendar className="h-3 w-3 text-[#1e3b93]" />
                          </div>
                          <span className="text-gray-700">
                            Tomorrow, 10:00 AM - 12:00 PM
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <div className="w-6 h-6 rounded-full bg-yellow-100 flex items-center justify-center">
                            <FileWarning className="h-3 w-3 text-yellow-600" />
                          </div>
                          <span className="text-yellow-600 font-medium">
                            Pending Confirmation
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <div className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center">
                            <MapPin className="h-3 w-3 text-gray-600" />
                          </div>
                          <span className="text-gray-600">Melbourne CBD</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

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
          <Card className="border-[#1e3b93]/10 transition-all duration-200 hover:shadow-lg">
            <CardHeader className="border-b border-[#1e3b93]/10">
              <CardTitle className="text-lg font-medium text-[#1e3b93]">
                Notifications
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <NotificationsList notifications={notifications} />
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Participant Invitations */}
      <div>
        <Card className="border-[#1e3b93]/10 transition-all duration-200 hover:shadow-lg">
          <CardHeader className="border-b border-[#1e3b93]/10">
            <CardTitle className="text-lg font-medium text-[#1e3b93]">
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
