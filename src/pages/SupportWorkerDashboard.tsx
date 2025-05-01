
import { 
  Clock, Users, DollarSign, Star, MessageSquare, CalendarIcon, Download,
  FileCheck, FileWarning, Inbox, Calendar, CheckCircle
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
    time: "10 minutes ago"
  },
  {
    id: "2",
    type: "message" as const,
    title: "New Message",
    description: "John's guardian sent you a message about the upcoming session",
    time: "1 hour ago"
  },
  {
    id: "3",
    type: "reminder" as const,
    title: "Shift Starting Soon",
    description: "You have a shift with Emma Wilson in 30 minutes",
    time: "unread"
  }
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
    details: "Personal care and mobility assistance"
  },
  {
    id: "2",
    client: "John Smith",
    date: "03/17/2024",
    timeStart: "9:00 AM",
    timeEnd: "2:00 PM",
    location: "Brighton East",
    details: "Community outing to library and park"
  },
  {
    id: "3",
    client: "John Smith",
    date: "03/19/2024",
    timeStart: "9:00 AM",
    timeEnd: "2:00 PM",
    location: "Brighton East",
    details: "Swimming therapy and exercise routine"
  }
];

// Mock certifications
const certifications = [
  {
    id: "1",
    name: "First Aid Certification",
    status: "expiring",
    description: "Required for all support workers. Must be completed within 30 days.",
    dueDate: "2024-04-15",
    action: "Start Training",
    actionType: "training"
  },
  {
    id: "2",
    name: "Manual Handling",
    status: "valid",
    description: "Completed: 2024-02-01",
    expiry: "2025-02-01",
    action: "View Certificate",
    actionType: "view"
  },
  {
    id: "3",
    name: "Infection Control",
    status: "recommended",
    description: "Recommended for enhanced safety protocols.",
    action: "Start Training",
    actionType: "training"
  }
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
      type: "Personal Care"
    }
  ]
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
      {user && user.role === 'supportWorker' && !(user as SupportWorker).verificationStatus?.profileSetupComplete && (
        <ProfileSetupAlert userName={user.firstName.split(' ')[0]} />
      )}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Support Worker Dashboard</h1>
          <p className="text-muted-foreground">Welcome back, {user.firstName}! Here's your overview.</p>
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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="Monthly Hours"
          value="86"
          icon={<Clock size={24} />}
          change={{ value: "+12% from last month", positive: true }}
        />
        <StatCard
          title="Active Guardians"
          value="5"
          icon={<Users size={24} />}
          additionalText="All shifts covered"
        />
        <StatCard
          title="Monthly Earnings"
          value="$2,450"
          icon={<DollarSign size={24} />}
          // Fix: Changed from React element to string
          additionalText="Export"
        />
        <StatCard
          title="Average Rating"
          value="4.9"
          icon={<Star size={24} />}
          additionalText="★★★★★"
        />
      </div>

      {/* Shifts & Notifications */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-sm border p-6">
          <h2 className="text-xl font-bold mb-6">Upcoming Shifts</h2>
          <div className="space-y-4">
            {upcomingShifts.map((shift, index) => (
              <div key={shift.id} className="flex items-center justify-between border-b pb-4 last:border-0">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-guardian/10 flex items-center justify-center">
                    <Calendar className="h-5 w-5 text-guardian" />
                  </div>
                  <div>
                    <h3 className="font-medium">{shift.client}</h3>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Clock className="h-3 w-3" />
                      <span>{shift.timeStart} - {shift.timeEnd}</span>
                      <MapPin className="h-3 w-3 ml-1" />
                      <span>{shift.location}</span>
                    </div>
                  </div>
                </div>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => handleViewShiftDetails(shift.id)}
                >
                  View Details
                </Button>
              </div>
            ))}
          </div>
        </div>
        
        <NotificationsList notifications={notifications} />

        {/* Participant invitations section */}
        <ParticipantInvitations />
      </div>

      {/* Trainings & Calendar */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-sm border p-6">
          <h2 className="text-xl font-bold mb-6">Training & Certifications</h2>
          <div className="space-y-6">
            {certifications.map((cert) => (
              <div key={cert.id} className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className={`p-2 rounded-full ${
                    cert.status === 'valid' ? 'bg-green-100' :
                    cert.status === 'expiring' ? 'bg-red-100' :
                    'bg-yellow-100'
                  }`}>
                    {cert.status === 'valid' ? 
                      <FileCheck className={`h-5 w-5 ${cert.status === 'valid' ? 'text-green-600' : 'text-red-600'}`} /> : 
                      <FileWarning className={`h-5 w-5 ${cert.status === 'expiring' ? 'text-red-600' : 'text-yellow-600'}`} />
                    }
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium">{cert.name}</h3>
                    <p className="text-xs text-muted-foreground">{cert.description}</p>
                    {cert.dueDate && (
                      <p className="text-xs text-red-600 font-medium">Due by: {cert.dueDate}</p>
                    )}
                    {cert.expiry && (
                      <p className="text-xs text-green-600">Expires: {cert.expiry}</p>
                    )}
                  </div>
                  <Button variant="outline" size="sm" className={`${
                    cert.actionType === 'training' ? 'text-guardian' : 'text-blue-600'
                  }`}>
                    {cert.action}
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div>
          <Card>
            <CardHeader className="pb-2">
              <div className="flex justify-between items-center">
                <CardTitle className="text-lg font-medium">Monthly Schedule</CardTitle>
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="sm">Previous</Button>
                  <span className="text-sm font-medium">{calendarData.month}</span>
                  <Button variant="ghost" size="sm">Next</Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="grid grid-cols-7 gap-1 mb-4">
                <div className="text-center text-xs font-medium">Sun</div>
                <div className="text-center text-xs font-medium">Mon</div>
                <div className="text-center text-xs font-medium">Tue</div>
                <div className="text-center text-xs font-medium">Wed</div>
                <div className="text-center text-xs font-medium">Thu</div>
                <div className="text-center text-xs font-medium">Fri</div>
                <div className="text-center text-xs font-medium">Sat</div>
              </div>
              <div className="grid grid-cols-7 gap-1">
                {calendarData.days.map((day, i) => (
                  <div 
                    key={i} 
                    className={`aspect-square flex flex-col items-center justify-center border rounded-md p-1
                      ${day.shifts > 0 ? 'bg-guardian/10 border-guardian' : ''}
                    `}
                  >
                    <div className="text-xs font-medium">{day.number}</div>
                    {day.shifts > 0 && <div className="text-[10px] text-guardian-dark">{day.shifts} shifts</div>}
                  </div>
                ))}
              </div>

              <div className="mt-6">
                <h3 className="text-sm font-medium mb-2">Upcoming Shifts</h3>
                {calendarData.upcomingShifts.map((shift, i) => (
                  <div key={i} className="flex items-start gap-2 text-sm border-l-2 border-guardian pl-2">
                    <Calendar className="h-4 w-4 text-guardian shrink-0 mt-0.5" />
                    <div>
                      <div className="font-medium">{shift.date}</div>
                      <div className="text-xs text-muted-foreground">{shift.time}</div>
                      <div className="text-xs text-muted-foreground">{shift.location}</div>
                      <div className="text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded-full inline-block mt-1">
                        {shift.type}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
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
