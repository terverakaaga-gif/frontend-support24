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
    <div className="container py-6">
      {/* Show alert if support worker hasn't completed onboarding */}
      {user &&
        user.role === "supportWorker" &&
        !(user as SupportWorker).verificationStatus?.profileSetupComplete && (
          <ProfileSetupAlert userName={user.firstName.split(" ")[0]} />
        )}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Support Worker Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome back, {user.firstName}! Here's your overview.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" className="flex items-center gap-2">
            <MessageSquare className="h-4 w-4" />
            Contact Admin
          </Button>
          <Button
            variant="outline"
            className="flex items-center gap-2"
            onClick={() => navigate("/support-worker/shifts")}
          >
            <CalendarIcon className="h-4 w-4" />
            View Schedule
          </Button>
          <Button className="flex items-center gap-2 bg-guardian hover:bg-guardian-dark">
            <Download className="h-4 w-4" />
            Export Report
          </Button>
          <Button className="flex items-center gap-2 bg-green-500 hover:bg-green-600">
            <CheckCircle className="h-4 w-4" />
            Start Shift
          </Button>
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="Total Hours"
          value="156h"
          icon={<Clock size={24} />}
          additionalText="This month"
        />
        <StatCard
          title="Active Clients"
          value="12"
          icon={<Users size={24} />}
          change={{ value: "+2 from last month", positive: true }}
        />
        <StatCard
          title="Earnings"
          value="$3,240"
          icon={<DollarSign size={24} />}
          additionalText="This month"
        />
        <StatCard
          title="Rating"
          value="4.8/5"
          icon={<Star size={24} />}
          change={{ value: "+0.2 from last month", positive: true }}
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Upcoming Shifts */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader className="pb-2">
              <div className="flex justify-between items-center">
                <CardTitle className="text-lg font-medium">
                  Upcoming Shifts
                </CardTitle>
                <Button variant="link" className="text-sm p-0">
                  View All
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Card className="border-2 border-guardian">
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h4 className="font-medium">Emma Wilson</h4>
                          <p className="text-sm text-muted-foreground">
                            Personal Care
                          </p>
                        </div>
                        <Button variant="outline" size="sm">
                          View Details
                        </Button>
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-sm">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          <span>Today, 2:00 PM - 5:00 PM</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <FileCheck className="h-4 w-4 text-green-500" />
                          <span className="text-green-600">Confirmed</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h4 className="font-medium">John Smith</h4>
                          <p className="text-sm text-muted-foreground">
                            Physiotherapy
                          </p>
                        </div>
                        <Button variant="outline" size="sm">
                          View Details
                        </Button>
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-sm">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          <span>Tomorrow, 10:00 AM - 12:00 PM</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <FileWarning className="h-4 w-4 text-yellow-500" />
                          <span className="text-yellow-600">
                            Pending Confirmation
                          </span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Notifications */}
        <div>
          <NotificationsList notifications={notifications} />
        </div>
      </div>

      {/* Participant Invitations */}
      <div className="mt-8">
        <ParticipantInvitations />
      </div>
    </div>
  );
}

function MapPin(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  );
}
