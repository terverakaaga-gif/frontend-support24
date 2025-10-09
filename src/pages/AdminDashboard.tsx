import { useState } from "react";
import {
  Users,
  Clock,
  DollarSign,
  Calendar,
  Search,
  Filter,
  Download,
  ArrowRight,
  ArrowLeft,
  BellRing,
  ChevronRight,
  BarChart3,
  TrendingUp,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { StatCard } from "@/components/StatCard";
import { ChartSection } from "@/components/ChartSection";
import { NotificationsList } from "@/components/NotificationsList";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

// Mock data for charts
const bookingTrendsData = [
  { month: "Jan", bookings: 120 },
  { month: "Feb", bookings: 140 },
  { month: "Mar", bookings: 160 },
  { month: "Apr", bookings: 175 },
  { month: "May", bookings: 195 },
  { month: "Jun", bookings: 220 },
];

const revenueData = [
  { month: "Jan", revenue: 50000 },
  { month: "Feb", revenue: 55000 },
  { month: "Mar", revenue: 60000 },
  { month: "Apr", revenue: 65000 },
  { month: "May", revenue: 70000 },
  { month: "Jun", revenue: 75000 },
];

// Mock notifications
const notifications = [
  {
    id: "1",
    type: "booking" as const,
    title: "New Booking Request",
    description: "John Smith requested a booking for tomorrow",
    time: "5 minutes ago",
  },
  {
    id: "2",
    type: "message" as const,
    title: "New Message",
    description: "Sarah Johnson sent you a message",
    time: "1 hour ago",
  },
  {
    id: "3",
    type: "update" as const,
    title: "System Update",
    description: "New features available in the admin panel",
    time: "2 hours ago",
  },
];

// Mock bookings data
const bookingsData = [
  {
    id: "1",
    participant: {
      name: "John Smith",
      avatar: "/avatars/john.jpg",
    },
    worker: {
      name: "Sarah Johnson",
      avatar: "/avatars/sarah.jpg",
    },
    date: "2024-03-15",
    timeStart: "09:00 AM",
    timeEnd: "01:00 PM",
    status: "confirmed",
    type: "Personal Care",
  },
  {
    id: "2",
    participant: {
      name: "Emma Wilson",
      avatar: "/avatars/emma.jpg",
    },
    worker: {
      name: "Michael Brown",
      avatar: "/avatars/michael.jpg",
    },
    date: "2024-03-15",
    timeStart: "02:00 PM",
    timeEnd: "06:00 PM",
    status: "in-progress",
    type: "Community Access",
  },
  {
    id: "3",
    participant: {
      name: "David Lee",
      avatar: "/avatars/david.jpg",
    },
    worker: {
      name: "Jessica White",
      avatar: "/avatars/jessica.jpg",
    },
    date: "2024-03-16",
    timeStart: "10:00 AM",
    timeEnd: "03:00 PM",
    status: "pending",
    type: "Therapy Support",
  },
];

// Mock stakeholders data
const stakeholders = [
  {
    type: "Guardians",
    count: 450,
    active: 380,
    pending: 15,
    growth: "+12%",
    progress: 75,
  },
  {
    type: "Support Workers",
    count: 320,
    active: 280,
    pending: 25,
    growth: "+8%",
    progress: 65,
  },
  {
    type: "Coordinators",
    count: 45,
    active: 42,
    pending: 3,
    growth: "+5%",
    progress: 85,
  },
];

export default function AdminDashboard() {
  const [currentMonth, setCurrentMonth] = useState("Mar 2024");

  return (
    <div className="p-6 space-y-8">
      {/* Header Section */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-montserrat-bold tracking-tight">Admin Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome back! Here's your system overview.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <Button variant="outline" size="sm" className="h-9">
            <Filter className="h-4 w-4 mr-2" />
            Filter
          </Button>
          <Button variant="outline" size="sm" className="h-9">
            {currentMonth}
          </Button>
          <Button
            variant="default"
            size="sm"
            className="h-9 bg-gradient-to-r from-guardian to-guardian-dark hover:from-guardian-dark hover:to-guardian"
          >
            <Download className="h-4 w-4 mr-2" />
            Export Report
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Users"
          value="1,234"
          icon={<Users className="h-4 w-4 text-guardian" />}
          change={{ value: "+12%", positive: true }}
          trend="up"
        />
        <StatCard
          title="Total Hours"
          value="8,560"
          icon={<Clock className="h-4 w-4 text-guardian" />}
          change={{ value: "+8%", positive: true }}
          trend="up"
        />
        <StatCard
          title="Revenue"
          value="$375,000"
          icon={<DollarSign className="h-4 w-4 text-guardian" />}
          change={{ value: "+15%", positive: true }}
          trend="up"
        />
        <StatCard
          title="Pending Invitations"
          value="5"
          icon={<BellRing className="h-4 w-4 text-guardian" />}
          additionalText="3 new today"
          trend="none"
        />
      </div>

      {/* Charts Section */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card className="p-6">
          <CardHeader className="px-0 pt-0">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg font-medium">
                <div className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5 text-guardian" />
                  <span>Booking Trends</span>
                </div>
              </CardTitle>
              <Button variant="ghost" size="sm">
                View Details
              </Button>
            </div>
          </CardHeader>
          <CardContent className="px-0 pb-0">
            <ChartSection
              data={bookingTrendsData}
              type="bar"
              dataKey="bookings"
              xAxisKey="month"
              height={300}
            />
          </CardContent>
        </Card>

        <Card className="p-6">
          <CardHeader className="px-0 pt-0">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg font-medium">
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-guardian" />
                  <span>Revenue Overview</span>
                </div>
              </CardTitle>
              <Button variant="ghost" size="sm">
                View Details
              </Button>
            </div>
          </CardHeader>
          <CardContent className="px-0 pb-0">
            <ChartSection
              data={revenueData}
              type="line"
              dataKey="revenue"
              xAxisKey="month"
              height={300}
            />
          </CardContent>
        </Card>
      </div>

      {/* Recent Bookings & Notifications */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="md:col-span-2 border-[#1e3b93]/10 transition-all duration-200 hover:shadow-lg">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg font-medium text-[#1e3b93]">
                Recent Bookings
              </CardTitle>
              <Button
                variant="ghost"
                size="sm"
                className="text-[#1e3b93] hover:bg-[#1e3b93]/10 hover:text-[#1e3b93]"
              >
                View All
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <div className="flex-1">
                  <Input
                    placeholder="Search bookings..."
                    className="max-w-sm border-[#1e3b93]/20 focus:border-[#1e3b93] focus-visible:ring-[#1e3b93]/20"
                  />
                </div>
                <Button
                  variant="outline"
                  size="icon"
                  className="border-[#1e3b93]/20 hover:bg-[#1e3b93]/10 hover:border-[#1e3b93]/40"
                >
                  <Search className="h-4 w-4 text-[#1e3b93]" />
                </Button>
              </div>

              <div className="space-y-4">
                {bookingsData.map((booking) => (
                  <div
                    key={booking.id}
                    className="flex items-center justify-between p-4 rounded-lg border border-[#1e3b93]/10 bg-card hover:bg-[#1e3b93]/5 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <Avatar className="border-2 border-[#1e3b93]/10">
                        <AvatarImage src={booking.participant.avatar} />
                        <AvatarFallback className="bg-[#1e3b93]/10 text-[#1e3b93] font-medium">
                          {booking.participant.name[0]}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium text-gray-900">
                          {booking.participant.name}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {booking.type} • {booking.timeStart}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <Badge
                        variant={
                          booking.status === "confirmed"
                            ? "default"
                            : booking.status === "in-progress"
                            ? "secondary"
                            : "outline"
                        }
                        className={cn("capitalize", {
                          "bg-[#1e3b93] text-white":
                            booking.status === "confirmed",
                          "bg-[#1e3b93]/10 text-[#1e3b93] border-[#1e3b93]/20":
                            booking.status === "in-progress",
                          "border-[#1e3b93]/20 text-[#1e3b93]":
                            booking.status === "pending",
                        })}
                      >
                        {booking.status}
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

      {/* Stakeholder Overview */}
      {/* <Card>
        <CardHeader>
          <CardTitle className="text-lg font-medium">
            Stakeholder Overview
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 md:grid-cols-3">
            {stakeholders.map((item) => (
              <div key={item.type} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="font-medium">{item.type}</div>
                  <Badge variant="outline" className="font-normal">
                    {item.growth}
                  </Badge>
                </div>
                <div className="text-2xl font-montserrat-bold">{item.count}</div>
                <div className="flex items-center text-sm text-muted-foreground">
                  <span>{item.active} Active</span>
                  <span className="mx-2">•</span>
                  <span>{item.pending} Pending</span>
                </div>
                <Progress value={item.progress} className="h-2" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card> */}
    </div>
  );
}
