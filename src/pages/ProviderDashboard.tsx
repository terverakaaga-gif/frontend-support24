import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Calendar,
  Chart,
  CheckCircle,
  UsersGroupTwoRounded,
  InfoCircle,
  AltArrowLeft,
  AltArrowRight,
} from "@solar-icons/react";
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ComposedChart,
  Bar,
} from "recharts";
import GeneralHeader from "@/components/GeneralHeader";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { PostCard, Post } from "@/components/provider/PostCard";
import {
  DASHBOARD_PAGE_WRAPPER,
  DASHBOARD_CONTENT,
  DASHBOARD_STATS_GRID,
  DASHBOARD_STAT_CARD,
  cn,
} from "@/lib/design-utils";

const mockStats = {
  totalActivePosts: 15,
  totalInterests: 152,
  approvedParticipants: 45,
  engagementRate: 40,
  trends: {
    posts: { change: 12, direction: "up" as const },
    interests: { change: 8, direction: "up" as const },
    participants: { change: 15, direction: "up" as const },
    engagement: { change: 5, direction: "down" as const },
  },
};

const mockChartData = [
  { month: "Jan", events: 10, accommodation: 5, jobs: 8 },
  { month: "Feb", events: 8, accommodation: 7, jobs: 6 },
  { month: "Mar", events: 15, accommodation: 10, jobs: 12 },
  { month: "Apr", events: 20, accommodation: 12, jobs: 15 },
  { month: "May", events: 18, accommodation: 15, jobs: 10 },
  { month: "Jun", events: 12, accommodation: 8, jobs: 14 },
  { month: "Jul", events: 16, accommodation: 11, jobs: 9 },
  { month: "Aug", events: 22, accommodation: 14, jobs: 18 },
];

const mockNotifications = [
  {
    id: 1,
    message: "3 new participants showed interest in Ocean View Apartment.",
    time: "2h ago",
    icon: UsersGroupTwoRounded,
  },
  {
    id: 2,
    message: "Alex John just applied for Youth Support Worker role.",
    time: "2h ago",
    icon: InfoCircle,
  },
  {
    id: 3,
    message: "Maria Davis registered for your event Local City Tour, 2025.",
    time: "2h ago",
    icon: Calendar,
  },
];

// Updated mock data to match Post type
const mockPosts: Post[] = [
  {
    type: "event",
    id: 1,
    title: "Local City Tour 2025",
    date: "22nd Nov - 29 Nov, 2025",
    time: "8:00 AM - 12:00 PM",
    location: "Albion Park, AU",
    participants: 21,
    status: "Upcoming",
    image: null,
  },
  {
    type: "event",
    id: 2,
    title: "Community Meetup 2025",
    date: "15th Dec, 2025",
    time: "10:00 AM - 2:00 PM",
    location: "Sydney, AU",
    participants: 15,
    status: "Upcoming",
    image: null,
  },
  {
    type: "event",
    id: 3,
    title: "Beach Day Event",
    date: "1st Oct, 2025",
    time: "9:00 AM - 5:00 PM",
    location: "Wollongong, AU",
    participants: 30,
    status: "Past",
    image: null,
  },
  {
    type: "accommodation",
    id: 101,
    title: "Ocean View Apartment",
    location: "Wollongong, NSW",
    price: 350,
    priceUnit: "week",
    bedrooms: 2,
    bathrooms: 1,
    propertyType: "Apartment",
    interested: 12,
    status: "Available",
    image: null,
  },
  {
    type: "accommodation",
    id: 102,
    title: "Cozy Studio Near Beach",
    location: "Kiama, NSW",
    price: 250,
    priceUnit: "week",
    bedrooms: 1,
    bathrooms: 1,
    propertyType: "Studio",
    interested: 8,
    status: "Available",
    image: null,
  },
  {
    type: "accommodation",
    id: 103,
    title: "Family Home with Garden",
    location: "Shellharbour, NSW",
    price: 500,
    priceUnit: "week",
    bedrooms: 4,
    bathrooms: 2,
    propertyType: "House",
    interested: 5,
    status: "Occupied",
    image: null,
  },
  {
    type: "job",
    id: 201,
    title: "Support Worker Position",
    workerName: "Sarah Johnson",
    skills: ["Personal Care", "Mobility Assistance", "Meal Prep"],
    hourlyRate: 35,
    availability: "Full-time",
    location: "Sydney, NSW",
    applicants: 8,
    status: "Available",
    rating: 4.8,
    experience: "5 years",
    image: null,
  },
  {
    type: "job",
    id: 202,
    title: "Care Assistant",
    workerName: "Michael Chen",
    skills: ["Transport", "Social Support", "Household Tasks"],
    hourlyRate: 32,
    availability: "Part-time",
    location: "Melbourne, VIC",
    applicants: 5,
    status: "Available",
    rating: 4.5,
    experience: "3 years",
    image: null,
  },
];

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  trend?: string;
  trendDirection?: "up" | "down" | "neutral";
}

function StatCard({
  title,
  value,
  icon: Icon,
  trend,
  trendDirection,
}: StatCardProps) {
  return (
    <div className={DASHBOARD_STAT_CARD}>
      <div className="flex items-center justify-between mb-3">
        <div className="text-sm font-semibold text-gray-600">{title}</div>
        <div className="p-2 rounded-full bg-primary-300/20">
          <Icon className="h-5 w-5" style={{ color: "#4B7BF5" }} />
        </div>
      </div>
      <div className="text-2xl md:text-3xl font-bold text-gray-900 mb-1">
        {value}
      </div>
      {trend && (
        <div
          className={`text-xs font-semibold flex items-center gap-1 ${
            trendDirection === "up"
              ? "text-green-600"
              : trendDirection === "down"
              ? "text-red-600"
              : "text-gray-600"
          }`}
        >
          <span>
            {trendDirection === "up"
              ? "↑"
              : trendDirection === "down"
              ? "↓"
              : ""}
          </span>
          {trend}
        </div>
      )}
    </div>
  );
}

function EngagementChart() {
  const [selectedMonth, setSelectedMonth] = useState("April, 2025");

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4 md:p-6 col-span-full lg:col-span-2">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <h2 className="text-lg font-semibold text-gray-900">
          Engagement Overview
        </h2>
        <Button
          variant="outline"
          className="border-gray-200 text-sm"
          onClick={() => {}}
        >
          <Calendar className="h-4 w-4 mr-2" />
          Pick Date
        </Button>
      </div>

      <div className="flex flex-wrap items-center gap-4 md:gap-8 mb-6">
        <div className="flex gap-3 items-center">
          <div className="text-2xl md:text-3xl font-bold text-gray-900">
            80%
          </div>
          <div className="text-green-600 bg-green-600/10 rounded-lg px-2 py-1 text-sm font-semibold flex items-center">
            <span className="mr-1">↑</span>
            12.6%
          </div>
        </div>
      </div>

      <ResponsiveContainer width="100%" height={250}>
        <ComposedChart
          data={mockChartData}
          margin={{ top: 20, right: 10, left: -20, bottom: 5 }}
        >
          <CartesianGrid
            strokeDasharray="3 3"
            stroke="#E5E7EB"
            vertical={false}
          />
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
            domain={[0, 25]}
            ticks={[0, 5, 10, 15, 20, 25]}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: "white",
              border: "1px solid #E5E7EB",
              borderRadius: "8px",
            }}
          />
          <Bar
            dataKey="events"
            fill="#0D2BEC"
            radius={[4, 4, 0, 0]}
            barSize={15}
          />
          <Bar
            dataKey="accommodation"
            fill="#A4BCF6"
            radius={[4, 4, 0, 0]}
            barSize={15}
          />
          <Bar
            dataKey="jobs"
            fill="#4B7BF5"
            radius={[4, 4, 0, 0]}
            barSize={15}
          />
        </ComposedChart>
      </ResponsiveContainer>

      <div className="flex flex-wrap justify-center gap-4 md:gap-6 text-sm mt-4">
        <div className="flex items-center">
          <div className="w-4 h-3 rounded mr-2 bg-[#0D2BEC]"></div>
          <span className="text-gray-600">Events</span>
        </div>
        <div className="flex items-center">
          <div className="w-4 h-3 rounded mr-2 bg-[#A4BCF6]"></div>
          <span className="text-gray-600">Accommodation</span>
        </div>
        <div className="flex items-center">
          <div className="w-4 h-3 rounded mr-2 bg-[#4B7BF5]"></div>
          <span className="text-gray-600">Jobs</span>
        </div>
      </div>
    </div>
  );
}

function NotificationsPanel() {
  const navigate = useNavigate();

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4 md:p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg font-semibold text-gray-900">Notifications</h2>
        <Button
          variant="link"
          className="text-yellow-600 hover:text-yellow-700"
        >
          View all →
        </Button>
      </div>

      <div className="space-y-4">
        {mockNotifications.map((notification) => (
          <div
            key={notification.id}
            className="flex items-start gap-3 p-3 hover:bg-gray-50 rounded-lg transition-colors"
          >
            <div className="p-2 bg-primary-50 rounded-full flex-shrink-0">
              <notification.icon className="h-5 w-5 text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm text-gray-900">{notification.message}</p>
              <p className="text-xs text-gray-500 mt-1">{notification.time}</p>
            </div>
            <button className="text-gray-400 hover:text-gray-600">
              <span className="text-lg">⋯</span>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

function RecentPosts() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<"Events" | "Accommodation" | "Jobs">("Events");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  const getBasePath = () => {
    switch (activeTab) {
      case "Events":
        return "/provider/events";
      case "Accommodation":
        return "/provider/accommodations";
      case "Jobs":
        return "/provider/jobs";
      default:
        return "/provider";
    }
  };

  const getPostType = (): "event" | "accommodation" | "job" => {
    switch (activeTab) {
      case "Events":
        return "event";
      case "Accommodation":
        return "accommodation";
      case "Jobs":
        return "job";
      default:
        return "event";
    }
  };

  const filteredPosts = mockPosts.filter((post) => post.type === getPostType());
  const totalPages = Math.ceil(filteredPosts.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentPosts = filteredPosts.slice(startIndex, endIndex);

  const handleTabChange = (tab: "Events" | "Accommodation" | "Jobs") => {
    setActiveTab(tab);
    setCurrentPage(1);
  };

  const handleDelete = (id: number | string) => {
    console.log("Delete post:", id);
    // Add delete confirmation dialog and logic here
  };

  return (
    <div className="bg-white mt-8 rounded-lg border border-gray-200">
      <div className="p-4">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">All Posts</h2>
        <div className="flex flex-wrap gap-2 bg-gray-200 p-2 rounded-lg w-fit">
          <Button
            variant="ghost"
            size="sm"
            className={
              activeTab === "Events"
                ? "bg-white text-black hover:bg-white"
                : "bg-transparent text-black hover:bg-gray-300"
            }
            onClick={() => handleTabChange("Events")}
          >
            Events
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className={
              activeTab === "Accommodation"
                ? "bg-white text-black hover:bg-white"
                : "bg-transparent text-black hover:bg-gray-300"
            }
            onClick={() => handleTabChange("Accommodation")}
          >
            Accommodation
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className={
              activeTab === "Jobs"
                ? "bg-white text-black hover:bg-white"
                : "bg-transparent text-black hover:bg-gray-300"
            }
            onClick={() => handleTabChange("Jobs")}
          >
            Jobs
          </Button>
        </div>
      </div>

      <div className="p-4">
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {currentPosts.map((post) => (
            <PostCard
              key={`${post.type}-${post.id}`}
              post={post}
              basePath={getBasePath()}
              onDelete={handleDelete}
            />
          ))}
        </div>

        {currentPosts.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            No {activeTab.toLowerCase()} found.
          </div>
        )}
      </div>

      <div className="p-4 flex flex-col sm:flex-row justify-between items-center gap-4">
        <div className="text-sm text-gray-600 text-center sm:text-left">
          Showing {startIndex + 1} - {Math.min(endIndex, filteredPosts.length)} of{" "}
          {filteredPosts.length} entries
        </div>
        <div className="flex flex-wrap justify-center sm:justify-end gap-2 sm:gap-3">
          <Button
            variant="outline"
            size="sm"
            className="border-gray-200 h-9 w-9"
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
          >
            <AltArrowLeft className="h-4 w-4" />
          </Button>
          {Array.from({ length: Math.min(5, totalPages) }, (_, i) => i + 1).map(
            (page) => (
              <Button
                key={page}
                size="sm"
                onClick={() => setCurrentPage(page)}
                className={`w-8 h-8 sm:w-9 sm:h-9 ${
                  currentPage === page
                    ? "bg-primary text-white hover:bg-primary/90"
                    : "border border-gray-200 bg-white text-gray-700 hover:bg-gray-100"
                }`}
              >
                {page}
              </Button>
            )
          )}
          <Button
            variant="outline"
            size="sm"
            className="border-gray-200 h-9 w-9"
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages || totalPages === 0}
          >
            <AltArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}

export default function ProviderDashboard() {
  const navigate = useNavigate();
  const { user } = useAuth();

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
    if (user?.firstName) {
      greeting += `, ${user.firstName}`;
    }
    return greeting;
  };

  return (
    <div className={DASHBOARD_PAGE_WRAPPER}>
      <GeneralHeader
        stickyTop={true}
        title={getGreeting()}
        subtitle="Track your interest, manage posts, and connect with participant"
        user={user}
        onLogout={() => {}}
        onViewProfile={() => navigate("/provider/profile")}
      />

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-6 md:mb-8">
        <StatCard
          title="Total Active Posts"
          value={mockStats.totalActivePosts}
          icon={Chart}
          trend="From last Month"
          trendDirection={mockStats.trends.posts.direction}
        />
        <StatCard
          title="Total Interests"
          value={mockStats.totalInterests}
          icon={InfoCircle}
          trend="From last Week"
          trendDirection={mockStats.trends.interests.direction}
        />
        <StatCard
          title="Approved Participants"
          value={mockStats.approvedParticipants}
          icon={CheckCircle}
          trend="From last Week"
          trendDirection={mockStats.trends.participants.direction}
        />
        <StatCard
          title="Engagement Rate"
          value={`${mockStats.engagementRate}%`}
          icon={UsersGroupTwoRounded}
          trend="From last Month"
          trendDirection={mockStats.trends.engagement.direction}
        />
      </div>

      {/* Two columns layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <EngagementChart />
        <NotificationsPanel />
      </div>

      {/* Recent Posts Table */}
      <RecentPosts />
    </div>
  );
}
