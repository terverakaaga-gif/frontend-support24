import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import {
  UsersGroupTwoRounded,
  Buildings3,
  UsersGroupRounded,
  DollarMinimalistic,
  CourseUp,
  CourseDown,
  BellBing,
  Calendar,
  Magnifer,
  AltArrowRight,
  MenuDots,
} from "@solar-icons/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip } from "recharts";

// Mock data
const mockStats = {
  totalParticipants: { value: 49, trend: "up", text: "From last Month" },
  totalProviders: { value: 100, trend: "up", text: "From last Month" },
  totalSupportWorkers: { value: 5, trend: "down", text: "From last Month" },
  totalBudgetPlan: { value: "$145,000.00", trend: "up", text: "From last Month" },
};

const engagementData = [
  { month: "Jan", value: 35 },
  { month: "Feb", value: 15 },
  { month: "Mar", value: 25 },
  { month: "Apr", value: 80 },
  { month: "May", value: 65 },
  { month: "Jun", value: 30 },
  { month: "Jul", value: 20 },
  { month: "Aug", value: 45 },
];

const tasks = [
  {
    id: 1,
    title: "Plan expiring in 30 days",
    status: "Attention needed",
    time: "2h ago",
    type: "warning",
  },
  {
    id: 2,
    title: "Budget category at 90%",
    status: "On track",
    time: "2h ago",
    type: "success",
  },
  {
    id: 3,
    title: "Outstanding invoice at 14 days",
    status: "Urgent",
    time: "2h ago",
    type: "danger",
  },
];

const participants = [
  {
    id: 1,
    name: "Sarah Reves",
    status: "On track",
    statusType: "success",
    ndisNo: "12345",
    age: "37 Years",
    supportWorkers: 3,
    budgetUtilization: 65,
    planExpiryDate: "15 Nov, 2025 (Plan expiry date)",
    nextReviewDate: "2 Dec, 2025 ( Next review date)",
    avatar: null,
  },
  {
    id: 2,
    name: "Sarah Reves",
    status: "Attention needed",
    statusType: "warning",
    ndisNo: "12345",
    age: "37 Years",
    supportWorkers: 3,
    budgetUtilization: 65,
    planExpiryDate: "15 Nov, 2025 (Plan expiry date)",
    nextReviewDate: "2 Dec, 2025 ( Next review date)",
    avatar: null,
  },
  {
    id: 3,
    name: "Sarah Reves",
    status: "Urgent",
    statusType: "danger",
    ndisNo: "12345",
    age: "37 Years",
    supportWorkers: 3,
    budgetUtilization: 65,
    planExpiryDate: "15 Nov, 2025 (Plan expiry date)",
    nextReviewDate: "2 Dec, 2025 ( Next review date)",
    avatar: null,
  },
];

// Stat Card Component
interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  trend: "up" | "down";
  trendText: string;
}

function StatCard({ title, value, icon: Icon, trend, trendText }: StatCardProps) {
  return (
    <Card className="p-6 bg-white border border-gray-200 rounded-xl">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <p className="text-sm font-montserrat text-gray-600 mb-2">{title}</p>
          <h3 className="text-3xl font-montserrat-bold text-gray-900">{value}</h3>
        </div>
        <div className="p-3 rounded-full bg-primary-50">
          <Icon className="h-6 w-6 text-primary-600" />
        </div>
      </div>
      <div className="flex items-center gap-1.5">
        {trend === "up" ? (
          <CourseUp className="h-4 w-4 text-green-600" />
        ) : (
          <CourseDown className="h-4 w-4 text-red-600" />
        )}
        <span
          className={`text-sm font-montserrat-semibold ${
            trend === "up" ? "text-green-600" : "text-red-600"
          }`}
        >
          {trendText}
        </span>
      </div>
    </Card>
  );
}

export default function SupportCoordinatorDashboard() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");

  const getGreeting = () => {
    const hour = new Date().getHours();
    let greeting = "";
    if (hour >= 6 && hour < 12) {
      greeting = "Good Morning";
    } else if (hour >= 12 && hour < 18) {
      greeting = "Good Afternoon";
    } else if (hour >= 18 && hour < 22) {
      greeting = "Good Evening";
    } else {
      greeting = "Good Night";
    }
    return greeting;
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-3xl font-montserrat-bold text-gray-900 mb-2">
            {getGreeting()} {user?.firstName || "John"} {user?.lastName || "Doe"} 👋
          </h1>
          <p className="text-gray-600 font-montserrat">
            Here's a quick look at your participants and providers today!
          </p>
        </div>
        <div className="flex items-center gap-4">
          {/* Search */}
          <div className="relative w-64">
            <Input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-white border-gray-200"
            />
            <Magnifer className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
          </div>

          {/* Notification */}
          <Button variant="ghost" size="icon" className="relative">
            <BellBing className="h-6 w-6 text-gray-700" />
            <span className="absolute top-1 right-1 h-2 w-2 bg-red-500 rounded-full"></span>
          </Button>

          {/* User Avatar */}
          <Avatar className="h-10 w-10 cursor-pointer">
            <AvatarImage src={user?.profileImage || undefined} />
            <AvatarFallback className="bg-primary-100 text-primary-700 font-montserrat-semibold">
              {user?.firstName?.charAt(0)}{user?.lastName?.charAt(0)}
            </AvatarFallback>
          </Avatar>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <StatCard
          title="Total Participants"
          value={mockStats.totalParticipants.value}
          icon={UsersGroupTwoRounded}
          trend={mockStats.totalParticipants.trend as "up" | "down"}
          trendText={mockStats.totalParticipants.text}
        />
        <StatCard
          title="Total Providers"
          value={mockStats.totalProviders.value}
          icon={Buildings3}
          trend={mockStats.totalProviders.trend as "up" | "down"}
          trendText={mockStats.totalProviders.text}
        />
        <StatCard
          title="Total Support Workers"
          value={mockStats.totalSupportWorkers.value}
          icon={UsersGroupRounded}
          trend={mockStats.totalSupportWorkers.trend as "up" | "down"}
          trendText={mockStats.totalSupportWorkers.text}
        />
        <StatCard
          title="Total Budget Plan"
          value={mockStats.totalBudgetPlan.value}
          icon={DollarMinimalistic}
          trend={mockStats.totalBudgetPlan.trend as "up" | "down"}
          trendText={mockStats.totalBudgetPlan.text}
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Engagement Overview */}
        <Card className="lg:col-span-2 p-6 bg-white border border-gray-200 rounded-xl">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-montserrat-bold text-gray-900 mb-1">
                Engagement Overview
              </h3>
              <div className="flex items-center gap-2">
                <span className="text-3xl font-montserrat-bold text-gray-900">80%</span>
                <div className="flex items-center gap-1 px-2 py-1 bg-green-50 rounded">
                  <CourseUp className="h-3 w-3 text-green-600" />
                  <span className="text-sm font-montserrat-semibold text-green-600">
                    12.6%
                  </span>
                </div>
              </div>
            </div>
            <Button variant="outline" size="sm" className="gap-2">
              <Calendar className="h-4 w-4" />
              Pick Date
            </Button>
          </div>

          {/* Chart */}
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={engagementData}>
                <XAxis
                  dataKey="month"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#6B7280", fontSize: 12 }}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#6B7280", fontSize: 12 }}
                  tickFormatter={(value) => `${value}%`}
                />
                <Tooltip />
                <Bar dataKey="value" fill="#1E3B93" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Legend */}
          <div className="mt-4 p-4 bg-gray-50 rounded-lg">
            <p className="text-sm font-montserrat-semibold text-gray-900 mb-2">
              April, 2025
            </p>
            <div className="flex gap-6">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-blue-600 rounded-full"></div>
                <span className="text-sm text-gray-600">Participants</span>
                <span className="text-sm font-montserrat-semibold">50%</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-green-600 rounded-full"></div>
                <span className="text-sm text-gray-600">Providers</span>
                <span className="text-sm font-montserrat-semibold">20%</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-purple-600 rounded-full"></div>
                <span className="text-sm text-gray-600">Support Workers</span>
                <span className="text-sm font-montserrat-semibold">10%</span>
              </div>
            </div>
          </div>
        </Card>

        {/* Tasks and Alerts */}
        <Card className="p-6 bg-white border border-gray-200 rounded-xl">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-montserrat-bold text-gray-900">
              Tasks and Alerts
            </h3>
            <Button
              variant="link"
              className="text-orange-500 hover:text-orange-600 p-0 h-auto"
              onClick={() => navigate("/support-coordinator/tasks")}
            >
              View all →
            </Button>
          </div>

          <div className="space-y-4">
            {tasks.map((task) => (
              <div
                key={task.id}
                className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <BellBing className="h-5 w-5 text-primary-600 mt-0.5" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-montserrat-semibold text-gray-900 mb-1">
                    {task.title}
                  </p>
                  <div className="flex items-center gap-2">
                    <Badge
                      className={`text-xs font-montserrat-semibold ${
                        task.type === "success"
                          ? "bg-green-100 text-green-700"
                          : task.type === "warning"
                          ? "bg-yellow-100 text-yellow-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {task.status}
                    </Badge>
                    <span className="text-xs text-gray-500">{task.time}</span>
                  </div>
                </div>
                <Button variant="ghost" size="icon" className="h-6 w-6">
                  <MenuDots className="h-4 w-4 text-gray-400" />
                </Button>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* All Participants */}
      <Card className="p-6 bg-white border border-gray-200 rounded-xl">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-montserrat-bold text-gray-900">
            All Participants
          </h3>
          <Button
            variant="link"
            className="text-orange-500 hover:text-orange-600 p-0 h-auto"
            onClick={() => navigate("/support-coordinator/participants")}
          >
            View all →
          </Button>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-4 mb-6">
          <div className="relative flex-1 min-w-[200px]">
            <Input
              type="text"
              placeholder="Search by participant name..."
              className="pl-10 bg-gray-50 border-gray-200"
            />
            <Magnifer className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
          </div>

          <Select>
            <SelectTrigger className="w-[180px] bg-white">
              <SelectValue placeholder="Plan expiry date" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="30-days">Next 30 days</SelectItem>
              <SelectItem value="60-days">Next 60 days</SelectItem>
              <SelectItem value="90-days">Next 90 days</SelectItem>
            </SelectContent>
          </Select>

          <Select>
            <SelectTrigger className="w-[180px] bg-white">
              <SelectValue placeholder="Budget Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="on-track">On Track</SelectItem>
              <SelectItem value="attention">Attention Needed</SelectItem>
              <SelectItem value="urgent">Urgent</SelectItem>
            </SelectContent>
          </Select>

          <Select>
            <SelectTrigger className="w-[200px] bg-white">
              <SelectValue placeholder="Last contact date" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="today">Today</SelectItem>
              <SelectItem value="week">This Week</SelectItem>
              <SelectItem value="month">This Month</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Participant Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
          {participants.map((participant) => (
            <Card
              key={participant.id}
              className="p-5 border border-gray-200 rounded-xl hover:shadow-lg transition-shadow"
            >
              {/* Header */}
              <div className="flex items-start gap-3 mb-4">
                <Avatar className="h-12 w-12">
                  <AvatarFallback className="bg-primary-100 text-primary-700">
                    {participant.name.split(" ").map((n) => n[0]).join("")}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <h4 className="font-montserrat-bold text-gray-900 mb-1">
                    {participant.name}
                  </h4>
                  <Badge
                    className={`text-xs font-montserrat-semibold ${
                      participant.statusType === "success"
                        ? "bg-green-100 text-green-700"
                        : participant.statusType === "warning"
                        ? "bg-yellow-100 text-yellow-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {participant.status}
                  </Badge>
                </div>
              </div>

              {/* Details */}
              <div className="space-y-2 mb-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">NDIS No: {participant.ndisNo}</span>
                  <span className="text-gray-600">Age: {participant.age}</span>
                </div>
                <div className="flex items-center gap-2">
                  <UsersGroupRounded className="h-4 w-4 text-primary-600" />
                  <span className="text-sm font-montserrat-semibold text-gray-900">
                    {participant.supportWorkers}
                  </span>
                </div>
              </div>

              {/* Budget Utilization */}
              <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-montserrat text-gray-600">
                    Budget Utilization
                  </span>
                  <span className="text-sm font-montserrat-semibold text-gray-900">
                    {participant.budgetUtilization}% Complete
                  </span>
                </div>
                <Progress value={participant.budgetUtilization} className="h-2" />
              </div>

              {/* Dates */}
              <div className="space-y-2 mb-4 text-xs text-gray-600">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  <span>{participant.planExpiryDate}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  <span>{participant.nextReviewDate}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2">
                <Button
                  className="flex-1 bg-primary-600 hover:bg-primary-700 text-white font-montserrat-semibold"
                  onClick={() =>
                    navigate(`/support-coordinator/participants/${participant.id}`)
                  }
                >
                  View Details
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  className="border-primary-600 text-primary-600 hover:bg-primary-50"
                >
                  <AltArrowRight className="h-5 w-5" />
                </Button>
              </div>
            </Card>
          ))}
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between pt-4 border-t">
          <p className="text-sm text-gray-600">
            Showing <span className="font-montserrat-semibold">5</span> entries
          </p>
          <div className="flex items-center gap-1">
            <Button variant="ghost" size="icon" className="h-8 w-8">
              ‹
            </Button>
            <Button className="h-8 w-8 bg-primary-600 text-white">1</Button>
            <Button variant="ghost" className="h-8 w-8">
              2
            </Button>
            <Button variant="ghost" className="h-8 w-8">
              3
            </Button>
            <Button variant="ghost" className="h-8 w-8">
              4
            </Button>
            <Button variant="ghost" className="h-8 w-8">
              5
            </Button>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              ›
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
