/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import {
  Target,
  Clock,
  Heart,
  Calendar,
  MessageSquare,
  User,
  ChevronRight,
  ChevronLeft,
  Star,
  CheckCircle,
  XCircle,
  FileText,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { StatCard } from "@/components/StatCard";
import { ChartSection } from "@/components/ChartSection";
import { NotificationsList } from "@/components/NotificationsList";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useAuth } from "@/contexts/AuthContext";
import ShiftManagement from "@/components/ShiftManagement";
import { ConnectionsList } from "@/components/participant/ConnectionsList";
import { cn } from "@/lib/utils";

// Mock data for charts
const activityData = [
  { day: "Mon", hours: 4 },
  { day: "Tue", hours: 3 },
  { day: "Wed", hours: 5 },
  { day: "Thu", hours: 2 },
  { day: "Fri", hours: 4 },
  { day: "Sat", hours: 3 },
  { day: "Sun", hours: 1 },
];

const satisfactionData = [
  { week: "Week 1", score: 4.2 },
  { week: "Week 2", score: 4.5 },
  { week: "Week 3", score: 4.3 },
  { week: "Week 4", score: 4.8 },
];

// Mock data for upcoming shifts
const upcomingShifts = [
  {
    id: 1,
    worker: {
      name: "Sarah Johnson",
      avatar: "/avatars/sarah.jpg",
    },
    date: "2024-03-15",
    time: "09:00 AM - 12:00 PM",
    status: "confirmed",
  },
  {
    id: 2,
    worker: {
      name: "Michael Chen",
      avatar: "/avatars/michael.jpg",
    },
    date: "2024-03-16",
    time: "02:00 PM - 05:00 PM",
    status: "pending",
  },
];

// Mock data for support workers
const supportWorkers = [
  {
    id: 1,
    name: "Sarah Johnson",
    avatar: "/avatars/sarah.jpg",
    rating: 4.8,
    specialties: ["Physical Therapy", "Elderly Care"],
    nextAvailable: "Tomorrow, 9 AM",
  },
  {
    id: 2,
    name: "Michael Chen",
    avatar: "/avatars/michael.jpg",
    rating: 4.9,
    specialties: ["Disability Support", "Mental Health"],
    nextAvailable: "Today, 2 PM",
  },
];

// Mock recent updates
const recentUpdates = [
  {
    id: "1",
    worker: "Sarah Johnson",
    type: "Progress Note",
    time: "2 hours ago",
    content:
      "Great progress with physical therapy exercises. Completed all sets with improved form.",
    rating: 5,
  },
  {
    id: "2",
    worker: "Michael Smith",
    type: "Activity Log",
    time: "5 hours ago",
    content:
      "Enjoyed community garden visit. Participated in planting new herbs.",
    rating: 4,
  },
];

// Mock notifications - fixed type values to match the allowed types
const notifications = [
  {
    id: "1",
    type: "booking" as const,
    title: "Care Session Confirmed",
    description: "Sarah Johnson has confirmed your booking for tomorrow",
    time: "15 minutes ago",
  },
  {
    id: "2",
    type: "message" as const,
    title: "New Message",
    description: "Michael Smith sent you an update on your progress",
    time: "3 hours ago",
  },
  {
    id: "3",
    type: "reminder" as const,
    title: "Upcoming Session",
    description: "You have a session with Sarah Johnson tomorrow at 9:00 AM",
    time: "1 day ago",
  },
];

// Render star rating (filled stars based on rating)
const renderRating = (rating: number) => {
  return (
    <div className="flex">
      {[...Array(5)].map((_, i) => (
        <Star
          key={i}
          className={cn("w-3 h-3", {
            "fill-yellow-400 text-yellow-400": i < rating,
            "text-gray-300": i >= rating,
          })}
        />
      ))}
    </div>
  );
};

// Shift Management Component
const ShiftManagementComponent = () => {
  return (
    <Card className="border-[#1e3b93]/10 transition-all duration-200 hover:shadow-lg">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg font-medium text-[#1e3b93]">
            Upcoming Shifts
          </CardTitle>
          <Button
            variant="link"
            className="text-sm p-0 text-[#1e3b93] hover:text-[#1e3b93]/80"
          >
            View Calendar
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {upcomingShifts.map((shift) => (
            <div
              key={shift.id}
              className="flex items-center justify-between p-4 rounded-lg border border-[#1e3b93]/10 hover:bg-[#1e3b93]/5 transition-colors"
            >
              <div className="flex items-center gap-4">
                <Avatar className="border-2 border-[#1e3b93]/10">
                  <AvatarImage src={shift.worker.avatar} />
                  <AvatarFallback className="bg-[#1e3b93]/10 text-[#1e3b93] font-medium">
                    {shift.worker.name[0]}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h4 className="font-medium text-gray-900">
                    {shift.worker.name}
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    {shift.date} • {shift.time}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Badge
                  variant={
                    shift.status === "confirmed" ? "default" : "secondary"
                  }
                  className={cn("capitalize", {
                    "bg-[#1e3b93] text-white": shift.status === "confirmed",
                    "bg-[#1e3b93]/10 text-[#1e3b93] border-[#1e3b93]/20":
                      shift.status === "pending",
                  })}
                >
                  {shift.status === "confirmed" ? (
                    <CheckCircle className="w-3 h-3 mr-1" />
                  ) : (
                    <Clock className="w-3 h-3 mr-1" />
                  )}
                  {shift.status.charAt(0).toUpperCase() + shift.status.slice(1)}
                </Badge>
                <Button
                  variant="ghost"
                  size="icon"
                  className="hover:bg-[#1e3b93]/10"
                >
                  <ChevronRight className="h-4 w-4 text-[#1e3b93]" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default function ParticipantDashboard() {
  const { user } = useAuth();

  return (
    <div className="container py-6 space-y-8">
      {/* Header Section */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-[#1e3b93]">
            Participant Dashboard
          </h1>
          <p className="text-muted-foreground mt-2">
            Welcome back, {user?.firstName}! Here's your care overview.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            className="flex items-center gap-2 border-[#1e3b93]/20 hover:bg-[#1e3b93]/10 hover:border-[#1e3b93]/40"
          >
            <MessageSquare className="h-4 w-4 text-[#1e3b93]" />
            <span className="text-[#1e3b93]">Message Support</span>
          </Button>
          <Button className="flex items-center gap-2 bg-[#1e3b93] hover:bg-[#1e3b93]/90">
            <Calendar className="h-4 w-4" />
            Schedule
          </Button>
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard
          title="Weekly Goals Met"
          value="21/25"
          icon={<Target size={24} className="text-[#1e3b93]" />}
          additionalText="84% completion rate"
          className="border-[#1e3b93]/10 hover:shadow-lg transition-shadow"
        />
        <StatCard
          title="Support Hours"
          value="28h"
          icon={<Clock size={24} className="text-[#1e3b93]" />}
          additionalText="This week"
          className="border-[#1e3b93]/10 hover:shadow-lg transition-shadow"
        />
        <StatCard
          title="Well-being Score"
          value="4.8/5"
          icon={<Heart size={24} className="text-[#1e3b93]" />}
          change={{ value: "+0.3 from last week", positive: true }}
          className="border-[#1e3b93]/10 hover:shadow-lg transition-shadow"
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartSection
          title="Weekly Activity Overview"
          data={activityData}
          type="bar"
          dataKey="hours"
          xAxisKey="day"
          className="border-[#1e3b93]/10"
        />
        <ChartSection
          title="Satisfaction Trend"
          data={satisfactionData}
          type="line"
          dataKey="score"
          xAxisKey="week"
          className="border-[#1e3b93]/10"
        />
      </div>

      {/* Shift Management */}
      <ShiftManagementComponent />

      {/* Support Workers Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {supportWorkers.map((worker) => (
          <Card
            key={worker.id}
            className="border-[#1e3b93]/10 transition-all duration-200 hover:shadow-lg"
          >
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-4">
                  <Avatar className="h-12 w-12 border-2 border-[#1e3b93]/10">
                    <AvatarImage src={worker.avatar} />
                    <AvatarFallback className="bg-[#1e3b93]/10 text-[#1e3b93] font-medium">
                      {worker.name[0]}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h4 className="font-medium text-gray-900">{worker.name}</h4>
                    <div className="flex items-center gap-1 mt-1">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span className="text-sm font-medium text-[#1e3b93]">
                        {worker.rating}
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {worker.specialties.map((specialty, index) => (
                        <Badge
                          key={index}
                          variant="secondary"
                          className="text-xs bg-[#1e3b93]/10 text-[#1e3b93] border-[#1e3b93]/20"
                        >
                          {specialty}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm text-muted-foreground">
                    Next Available
                  </p>
                  <p className="font-medium text-[#1e3b93]">
                    {worker.nextAvailable}
                  </p>
                  <Button
                    className="mt-2 bg-[#1e3b93] hover:bg-[#1e3b93]/90"
                    size="sm"
                  >
                    Book Session
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Updates & Notifications */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="border-[#1e3b93]/10 transition-all duration-200 hover:shadow-lg">
          <CardHeader className="pb-2">
            <div className="flex justify-between items-center">
              <CardTitle className="text-lg font-medium text-[#1e3b93]">
                Recent Updates
              </CardTitle>
              <Button
                variant="link"
                className="text-sm p-0 text-[#1e3b93] hover:text-[#1e3b93]/80"
              >
                View All
              </Button>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="space-y-4">
              {recentUpdates.map((update) => (
                <div
                  key={update.id}
                  className="border-b last:border-0 pb-4 last:pb-0 border-[#1e3b93]/10"
                >
                  <div className="flex justify-between mb-1">
                    <div className="font-medium text-gray-900">
                      {update.worker}
                    </div>
                    <div className="flex items-center gap-1">
                      {renderRating(update.rating)}
                    </div>
                  </div>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground mb-2">
                    <FileText className="h-3 w-3" />
                    <span>{update.type}</span>
                    <span>•</span>
                    <span>{update.time}</span>
                  </div>
                  {update.content && (
                    <p className="text-sm text-gray-700">{update.content}</p>
                  )}
                  <div className="flex gap-3 mt-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-[#1e3b93] hover:bg-[#1e3b93]/10"
                    >
                      Reply
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="border-[#1e3b93]/10 transition-all duration-200 hover:shadow-lg">
          <CardHeader>
            <CardTitle className="text-lg font-medium text-[#1e3b93]">
              Notifications
            </CardTitle>
          </CardHeader>
          <CardContent>
            <NotificationsList notifications={notifications} />
          </CardContent>
        </Card>
      </div>

      {/* Connections List */}
      <Card className="border-[#1e3b93]/10 transition-all duration-200 hover:shadow-lg">
        <CardHeader>
          <CardTitle className="text-lg font-medium text-[#1e3b93]">
            My Connections
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ConnectionsList />
        </CardContent>
      </Card>
    </div>
  );
}

function Bell(props: any) {
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
      <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
      <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
    </svg>
  );
}
