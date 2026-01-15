import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { StatCard } from "@/components/StatCard";
import { ChartSection } from "@/components/ChartSection";
import { NotificationsList } from "@/components/NotificationsList";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/design-utils";
import {
  SPACING,
  GAP,
  CONTAINER_PADDING,
  HEADING_STYLES,
  TEXT_STYLES,
  FONT_FAMILY,
  RADIUS,
  SHADOW,
  BORDER_STYLES,
  GRID_LAYOUTS,
  FLEX_LAYOUTS,
  TEXT_COLORS,
  BG_COLORS,
  ICON_SIZES,
} from "@/constants/design-system";
import {
  AltArrowRight,
  Bell,
  Chart,
  ClockCircle,
  CloudDownload,
  CourseUp,
  Dollar,
  Filter,
  Magnifer,
  UsersGroupRounded,
} from "@solar-icons/react";

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

export default function AdminDashboard() {
  const [currentMonth, setCurrentMonth] = useState("Mar 2024");

  return (
    <div className={cn("min-h-screen", BG_COLORS.muted, CONTAINER_PADDING.responsive)}>
      {/* Header Section */}
      <div className={cn(FLEX_LAYOUTS.colToRow, GAP.base, `mb-${SPACING['2xl']}`)}>
        <div>
          <h1 className={HEADING_STYLES.h2}>Admin Dashboard</h1>
          <p className={TEXT_STYLES.body}>
            Welcome back! Here's your system overview.
          </p>
        </div>
        <div className={cn(FLEX_LAYOUTS.rowWrap, GAP.sm)}>
          <Button variant="outline" size="sm" className="h-9">
            <Filter className={ICON_SIZES.sm} />
            <span className={`ml-${SPACING.sm}`}>Filter</span>
          </Button>
          <Button variant="outline" size="sm" className="h-9">
            {currentMonth}
          </Button>
          <Button
            variant="default"
            size="sm"
            className="h-9 bg-gradient-to-r from-guardian to-guardian-dark hover:from-guardian-dark hover:to-guardian"
          >
            <CloudDownload className={ICON_SIZES.sm} />
            <span className={`ml-${SPACING.sm}`}>Export Report</span>
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className={cn(GRID_LAYOUTS.cols4, GAP.base, `mb-${SPACING['2xl']}`)}>
        <StatCard
          title="Total Users"
          value="1,234"
          icon={<UsersGroupRounded className={ICON_SIZES.sm} />}
          change={{ value: "+12%", positive: true }}
          trend="up"
        />
        <StatCard
          title="Total Hours"
          value="8,560"
          icon={<ClockCircle className={ICON_SIZES.sm} />}
          change={{ value: "+8%", positive: true }}
          trend="up"
        />
        <StatCard
          title="Revenue"
          value="$375,000"
          icon={<Dollar className={ICON_SIZES.sm} />}
          change={{ value: "+15%", positive: true }}
          trend="up"
        />
        <StatCard
          title="Pending Invitations"
          value="5"
          icon={<Bell className={ICON_SIZES.sm} />}
          additionalText="3 new today"
          trend="none"
        />
      </div>

      {/* Charts Section */}
      <div className={cn(GRID_LAYOUTS.cols2, GAP.base, `mb-${SPACING['2xl']}`)}>
        <Card className={CONTAINER_PADDING.card}>
          <CardHeader className="px-0 pt-0">
            <div className={FLEX_LAYOUTS.rowBetween}>
              <CardTitle className={cn(HEADING_STYLES.h5, GAP.sm)}>
                <div className={cn("flex items-center", GAP.sm)}>
                  <Chart className={cn(ICON_SIZES.md, TEXT_COLORS.brand)} />
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

        <Card className={CONTAINER_PADDING.card}>
          <CardHeader className="px-0 pt-0">
            <div className={FLEX_LAYOUTS.rowBetween}>
              <CardTitle className={cn(HEADING_STYLES.h5)}>
                <div className={cn("flex items-center", GAP.sm)}>
                  <CourseUp className={cn(ICON_SIZES.md, TEXT_COLORS.brand)} />
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
      <div className={cn(GRID_LAYOUTS.cols3, GAP.base)}>
        <Card className={cn("md:col-span-2", BORDER_STYLES.subtle, "transition-all duration-200", SHADOW.lg)}>
          <CardHeader>
            <div className={FLEX_LAYOUTS.rowBetween}>
              <CardTitle className={cn(HEADING_STYLES.h5, TEXT_COLORS.brand)}>
                Recent Bookings
              </CardTitle>
              <Button
                variant="ghost"
                size="sm"
                className={cn(TEXT_COLORS.brand, BG_COLORS.primaryLightHover)}
              >
                View All
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className={`space-y-${SPACING.lg}`}>
              <div className={cn("flex items-center", GAP.base)}>
                <div className="flex-1">
                  <Input
                    placeholder="Search bookings..."
                    className={cn(BORDER_STYLES.subtle, "max-w-sm focus:border-primary focus-visible:ring-primary/20")}
                  />
                </div>
                <Button
                  variant="outline"
                  size="icon"
                  className={cn(BORDER_STYLES.subtle, BG_COLORS.primaryLightHover)}
                >
                  <Magnifer className={cn(ICON_SIZES.sm, TEXT_COLORS.brand)} />
                </Button>
              </div>

              <div className={`space-y-${SPACING.base}`}>
                {bookingsData.map((booking) => (
                  <div
                    key={booking.id}
                    className={cn(
                      "flex items-center justify-between",
                      `p-${SPACING.base}`,
                      RADIUS.lg,
                      BORDER_STYLES.subtle,
                      "bg-card hover:bg-primary-50 transition-colors"
                    )}
                  >
                    <div className={cn("flex items-center", GAP.base)}>
                      <Avatar className={cn(BORDER_STYLES.subtle)}>
                        <AvatarImage src={booking.participant.avatar} />
                        <AvatarFallback className={cn(BG_COLORS.primaryLight, TEXT_COLORS.brand, FONT_FAMILY.montserratSemibold)}>
                          {booking.participant.name[0]}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className={cn(FONT_FAMILY.montserratSemibold, "text-gray-900")}>
                          {booking.participant.name}
                        </div>
                        <div className={TEXT_STYLES.bodySecondary}>
                          {booking.type} • {booking.timeStart}
                        </div>
                      </div>
                    </div>
                    <div className={cn("flex items-center", GAP.base)}>
                      <Badge
                        variant={
                          booking.status === "confirmed"
                            ? "default"
                            : booking.status === "in-progress"
                            ? "secondary"
                            : "outline"
                        }
                        className={cn("capitalize", {
                          "bg-primary text-white": booking.status === "confirmed",
                          "bg-primary/10 text-primary border-primary/20": booking.status === "in-progress",
                          "border-primary/20 text-primary": booking.status === "pending",
                        })}
                      >
                        {booking.status}
                      </Badge>
                      <Button
                        variant="ghost"
                        size="icon"
                        className={BG_COLORS.primaryLightHover}
                      >
                        <AltArrowRight className={cn(ICON_SIZES.sm, TEXT_COLORS.brand)} />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className={cn(BORDER_STYLES.subtle, "transition-all duration-200", SHADOW.lg)}>
          <CardHeader>
            <CardTitle className={cn(HEADING_STYLES.h5, TEXT_COLORS.brand)}>
              Notifications
            </CardTitle>
          </CardHeader>
          <CardContent>
            <NotificationsList notifications={notifications} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
