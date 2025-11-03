import { ProfileSetupAlert } from "@/components/ProfileSetupAlert";
import { useAuth } from "@/contexts/AuthContext";
import {
  useGetSupportWorkerOverview,
  useGetSupportWorkerPerformance,
} from "@/hooks/useAnalyticsHooks";
import { useGetOrganizationInvites } from "@/hooks/useInviteHooks";
import {
  Calendar,
  Chart,
  CheckCircle,
  ClockCircle,
  CloseCircle,
  CourseDown,
  CourseUp,
  DollarMinimalistic,
  Eye,
  Star,
  UsersGroupTwoRounded,
} from "@solar-icons/react";
import { SupportWorker } from "@/types/user.types";
import { useState, useMemo } from "react";
import {
  Line,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ComposedChart,
} from "recharts";
import GeneralHeader from "@/components/GeneralHeader";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Loader from "@/components/Loader";

// Stat card component

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  trend?: string;
  trendDirection?: "up" | "down" | "neutral" | "stable";
}

function StatCard({
  title,
  value,
  icon: Icon,
  trend,
  trendDirection,
}: StatCardProps) {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4 md:p-6">
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
          {trendDirection === "up" && <CourseUp className="h-3 w-3" />}
          {trendDirection === "down" && <CourseDown className="h-3 w-3" />}
          {trend}
        </div>
      )}
    </div>
  );
}

// Performance chart component
function PerformanceChart({
  selectedOption,
  onSelectedOptionChange,
  customRange,
  onCustomRangeChange,
}) {
  const dateRange =
    selectedOption === "custom"
      ? {
          start: customRange.start.toISOString(),
          end: customRange.end.toISOString(),
        }
      : selectedOption;

  // Update hook calls
  const { data: overviewData, isLoading: overviewLoading } =
    useGetSupportWorkerOverview(dateRange, true, true);
  const { data: performanceData, isLoading: performanceLoading } =
    useGetSupportWorkerPerformance(dateRange);

  const chartData = useMemo(() => {
    if (
      !performanceData?.monthlyTrends ||
      performanceData.monthlyTrends.length === 0
    ) {
      return [];
    }

    return performanceData.monthlyTrends.map((trend) => ({
      month: new Date(trend.month).toLocaleDateString("en-US", {
        month: "short",
      }),
      completionRate: trend.completionRate || 0,
      onTimeRate: trend.onTimeRate || 0,
    }));
  }, [performanceData]);

  const metrics = {
    completionRate: overviewData?.performanceMetrics?.completionRate || 0,
    percentageChange: Math.abs(
      overviewData?.workSummary?.hoursWorked?.percentageChange || 0
    ),
    hasIncrease:
      (overviewData?.workSummary?.hoursWorked?.percentageChange || 0) > 0,
  };

  const isLoading = overviewLoading || performanceLoading;

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-4 md:p-6 col-span-full md:col-span-5">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/3 mb-6"></div>
          <div className="h-64 bg-gray-100 rounded"></div>
        </div>
      </div>
    );
  }

  if (chartData.length === 0) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-4 md:p-6 col-span-full md:col-span-5">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
          <h2 className="text-lg font-semibold text-gray-900">
            Performance Overview
          </h2>
          <div className="flex items-center gap-3 w-full md:w-auto">
            <Select
              value={selectedOption}
              onValueChange={onSelectedOptionChange}
            >
              <SelectTrigger className="w-full md:w-[180px]">
                <SelectValue placeholder="Pick Date Range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="today">Today</SelectItem>
                <SelectItem value="week">This Week</SelectItem>
                <SelectItem value="month">This Month</SelectItem>
                <SelectItem value="quarter">This Quarter</SelectItem>
                <SelectItem value="year">This Year</SelectItem>
                <SelectItem value="custom">Custom Range</SelectItem>
              </SelectContent>
            </Select>
            {selectedOption === "custom" && (
              <>
                <label className="text-sm font-medium text-gray-700">
                  Start:
                </label>
                <input
                  type="date"
                  value={customRange.start.toISOString().split("T")[0]}
                  onChange={(e) =>
                    onCustomRangeChange({
                      ...customRange,
                      start: new Date(e.target.value),
                    })
                  }
                  className="border border-gray-300 rounded px-2 py-1 text-sm"
                />
                <label className="text-sm font-medium text-gray-700">
                  End:
                </label>
                <input
                  type="date"
                  value={customRange.end.toISOString().split("T")[0]}
                  onChange={(e) =>
                    onCustomRangeChange({
                      ...customRange,
                      end: new Date(e.target.value),
                    })
                  }
                  className="border border-gray-300 rounded px-2 py-1 text-sm"
                />
              </>
            )}
          </div>
        </div>

        <div className="flex items-center justify-center h-64 text-gray-500 border border-dashed border-gray-300 rounded-lg">
          <div className="text-center p-8">
            <Chart className="h-12 w-12 mx-auto mb-3 text-gray-400" />
            <p className="text-sm font-medium">
              No performance data available yet
            </p>
            <p className="text-xs text-gray-400 mt-1">
              Complete shifts to see your performance trends
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4 md:p-6 col-span-full md:col-span-5">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <h2 className="text-lg font-semibold text-gray-900">
          Performance Overview
        </h2>
        <div className="flex items-center gap-3 w-full md:w-auto">
          <Select value={selectedOption} onValueChange={onSelectedOptionChange}>
            <SelectTrigger className="w-full md:w-[180px]">
              <SelectValue placeholder="Pick Date Range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="today">Today</SelectItem>
              <SelectItem value="week">This Week</SelectItem>
              <SelectItem value="month">This Month</SelectItem>
              <SelectItem value="quarter">This Quarter</SelectItem>
              <SelectItem value="year">This Year</SelectItem>
              <SelectItem value="custom">Custom Range</SelectItem>
            </SelectContent>
          </Select>
          {selectedOption === "custom" && (
            <>
              <label className="text-sm font-medium text-gray-700">
                Start:
              </label>
              <input
                type="date"
                value={customRange.start.toISOString().split("T")[0]}
                onChange={(e) =>
                  onCustomRangeChange({
                    ...customRange,
                    start: new Date(e.target.value),
                  })
                }
                className="border border-gray-300 rounded px-2 py-1 text-sm"
              />
              <label className="text-sm font-medium text-gray-700">End:</label>
              <input
                type="date"
                value={customRange.end.toISOString().split("T")[0]}
                onChange={(e) =>
                  onCustomRangeChange({
                    ...customRange,
                    end: new Date(e.target.value),
                  })
                }
                className="border border-gray-300 rounded px-2 py-1 text-sm"
              />
            </>
          )}
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-4 md:gap-8 mb-6">
        <div className="flex gap-3 items-center">
          <div className="text-2xl md:text-3xl font-bold text-gray-900">
            {metrics.completionRate}%
          </div>
          {metrics.percentageChange > 0 && (
            <div
              className={`${
                metrics.hasIncrease
                  ? "text-green-600 bg-green-600/10"
                  : "text-red-600 bg-red-600/10"
              } rounded-lg px-2 py-1 text-sm font-medium flex items-center`}
            >
              <span className="mr-1">{metrics.hasIncrease ? "↑" : "↓"}</span>
              {metrics.percentageChange.toFixed(1)}%
            </div>
          )}
        </div>
      </div>

      <ResponsiveContainer width="100%" height={250}>
        <ComposedChart
          data={chartData}
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
            domain={[0, 100]}
            ticks={[0, 20, 40, 60, 80, 100]}
            tickFormatter={(value) => `${value}%`}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: "white",
              border: "1px solid #E5E7EB",
              borderRadius: "8px",
            }}
            formatter={(value) => `${value}%`}
          />
          <Bar
            dataKey="completionRate"
            fill="#0D2BEC"
            radius={[4, 4, 0, 0]}
            barSize={40}
          />
          <Line
            type="monotone"
            dataKey="onTimeRate"
            stroke="#FBBF24"
            strokeWidth={3}
            dot={{ fill: "#FBBF24", r: 4 }}
            activeDot={{ r: 6 }}
          />
        </ComposedChart>
      </ResponsiveContainer>

      <div className="flex flex-wrap justify-center gap-4 md:gap-8 text-sm mt-4">
        <div className="flex items-center">
          <div className="w-4 h-3 rounded mr-2 bg-[#0D2BEC]"></div>
          <span className="text-gray-600">Completion Rate</span>
        </div>
        <div className="flex items-center">
          <div className="w-8 h-1 bg-yellow-400 rounded mr-2"></div>
          <span className="text-gray-600">On-Time Trend</span>
        </div>
      </div>
    </div>
  );
}

// Invitations Table Component
function InvitationsTable({ invitations, isLoading }) {
  const navigate = useNavigate();
  const [entriesPerPage, setEntriesPerPage] = useState("5");
  const [currentPage, setCurrentPage] = useState(1);

  if (isLoading) {
    return (
      <div className="bg-white mt-8 rounded-lg border border-gray-200">
        <div className="p-4 md:p-6 border-b border-gray-200">
          <div className="h-6 bg-gray-200 rounded w-1/4 animate-pulse"></div>
        </div>
        <div className="p-8">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-16 bg-gray-100 rounded mb-3 animate-pulse"
            ></div>
          ))}
        </div>
      </div>
    );
  }

  if (!invitations || invitations.length === 0) {
    return (
      <div className="bg-white mt-8 rounded-lg border border-gray-200">
        <div className="p-4 md:p-6 border-b border-gray-200 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <h2 className="text-lg font-semibold text-gray-900">
            All Invitations
          </h2>
        </div>
        <div className="p-12 text-center text-gray-500">
          <UsersGroupTwoRounded className="h-16 w-16 mx-auto mb-4 text-gray-300" />
          <p className="text-sm font-medium text-gray-600">
            No invitations available
          </p>
          <p className="text-xs text-gray-400 mt-1">
            You'll see organization invitations here when they're sent to you
          </p>
        </div>
      </div>
    );
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const displayInvitations = invitations.map((org) => {
    const workerData = org.workers?.find((w) => w.workerId);
    const isConfirmed = workerData && workerData.joinedDate;

    return {
      id: org._id,
      clientName: org.name,
      serviceRequested: org.description || "Support Services",
      date: formatDate(org.createdAt),
      location: "Organization Network",
      hourlyRate: workerData?.serviceAgreement?.baseHourlyRate
        ? `$${workerData.serviceAgreement.baseHourlyRate.toFixed(2)}/hr`
        : "N/A",
      status: isConfirmed ? "Confirmed" : "Pending",
    };
  });

  const totalPages = Math.ceil(
    displayInvitations.length / parseInt(entriesPerPage)
  );
  const startIndex = (currentPage - 1) * parseInt(entriesPerPage);
  const endIndex = startIndex + parseInt(entriesPerPage);
  const currentInvitations = displayInvitations.slice(startIndex, endIndex);

  return (
    <div className="bg-white mt-8 rounded-lg border border-gray-200">
      <div className="p-4 md:p-6 border-b border-gray-200 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h2 className="text-lg font-semibold text-gray-900">All Invitations</h2>
        <Button
          onClick={() => {
            navigate("/support-worker/organizations");
          }}
          variant="link"
        >
          View all →
        </Button>
      </div>

      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="border-b border-gray-200 bg-white font-montserrat-semibold">
              <TableHead className="px-4 md:px-6 py-3 text-left text-xs text-black uppercase tracking-wider">
                Client Name
              </TableHead>
              <TableHead className="px-4 md:px-6 py-3 text-left text-xs text-black uppercase tracking-wider hidden md:table-cell">
                Service Requested
              </TableHead>
              <TableHead className="px-4 md:px-6 py-3 text-left text-xs text-black uppercase tracking-wider hidden lg:table-cell">
                Date
              </TableHead>
              <TableHead className="px-4 md:px-6 py-3 text-left text-xs text-black uppercase tracking-wider hidden xl:table-cell">
                Location
              </TableHead>
              <TableHead className="px-4 md:px-6 py-3 text-left text-xs text-black uppercase tracking-wider">
                Hourly Rate
              </TableHead>
              <TableHead className="px-4 md:px-6 py-3 text-left text-xs text-black uppercase tracking-wider">
                Status
              </TableHead>
              <TableHead className="px-4 md:px-6 py-3"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody className="divide-y divide-gray-200 bg-white">
            {currentInvitations.map((invitation) => (
              <TableRow
                key={invitation.id}
                className="hover:bg-white transition-colors"
              >
                <TableCell className="px-4 md:px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center text-primary font-semibold text-sm flex-shrink-0">
                      {invitation.clientName.charAt(0).toUpperCase()}
                    </div>
                    <span className="text-sm font-medium text-gray-900">
                      {invitation.clientName}
                    </span>
                  </div>
                </TableCell>
                <TableCell className="px-4 md:px-6 py-4 text-sm text-gray-600 hidden md:table-cell">
                  {invitation.serviceRequested}
                </TableCell>
                <TableCell className="px-4 md:px-6 py-4 whitespace-nowrap text-sm text-gray-600 hidden lg:table-cell">
                  {invitation.date}
                </TableCell>
                <TableCell className="px-4 md:px-6 py-4 text-sm text-gray-600 hidden xl:table-cell">
                  {invitation.location}
                </TableCell>
                <TableCell className="px-4 md:px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {invitation.hourlyRate}
                </TableCell>
                <TableCell className="px-4 md:px-6 py-4 whitespace-nowrap">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${
                      invitation.status === "Pending"
                        ? "bg-yellow-100 text-yellow-800"
                        : invitation.status === "Confirmed"
                        ? "bg-blue-100 text-blue-800"
                        : "bg-green-100 text-green-800"
                    }`}
                  >
                    {invitation.status}
                  </span>
                </TableCell>
                <TableCell className="px-4 md:px-6 py-4 whitespace-nowrap text-right">
                  {invitation.status === "Pending" ? (
                    <div className="flex gap-2 justify-end">
                      <Button
                        size="sm"
                        className="w-8 h-8 p-0 bg-primary hover:bg-primary/90"
                        title="Accept"
                      >
                        <CheckCircle className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        className="w-8 h-8 p-0 bg-red-600 hover:bg-red-700"
                        title="Decline"
                      >
                        <CloseCircle className="h-4 w-4" />
                      </Button>
                    </div>
                  ) : (
                    <Button
                      onClick={() => {
                        navigate(
                          `/support-worker/organizations/${invitation.id}`
                        );
                      }}
                      variant="outline"
                      size="sm"
                      className="border-primary text-primary hover:bg-primary hover:text-white"
                    >
                      <Eye className="h-4 w-4 mr-1" /> View
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <div className="p-4 border-t border-gray-200 flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <span>Showing</span>
          <Select value={entriesPerPage} onValueChange={setEntriesPerPage}>
            <SelectTrigger className="w-20 h-9">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="5">5</SelectItem>
              <SelectItem value="10">10</SelectItem>
              <SelectItem value="20">20</SelectItem>
            </SelectContent>
          </Select>
          <span>entries</span>
        </div>
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            className="border-gray-200"
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
          >
            Previous
          </Button>
          {Array.from({ length: Math.min(5, totalPages) }, (_, i) => i + 1).map(
            (page) => (
              <Button
                key={page}
                size="sm"
                onClick={() => setCurrentPage(page)}
                className={` ${
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
            className="border-gray-200"
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}

export default function SupportWorkerDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [selectedOption, setSelectedOption] = useState("month"); // Default to "This Month"
  const [customRange, setCustomRange] = useState({
    start: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // Last 30 days
    end: new Date(),
  });

  // Determine dateRange for hooks
  const dateRange =
    selectedOption === "custom"
      ? {
          start: customRange.start.toISOString(),
          end: customRange.end.toISOString(),
        }
      : selectedOption;

  const { data: overviewData, isLoading: overviewLoading } =
    useGetSupportWorkerOverview(dateRange, true, true);
  const { data: invitations, isLoading: invitationsLoading } =
    useGetOrganizationInvites();

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

  const getTrendDirection = (trend) => {
    if (!trend || trend === "stable") return "up";
    return trend === "up" ? "up" : "down";
  };

  console.log("overviewData:", overviewData);

  if (overviewLoading || invitationsLoading) {
    return <Loader />;
  }

  console.log("user data: ", user);

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="">
        <GeneralHeader
          stickyTop={true}
          title={getGreeting()}
          subtitle="Here's a summary of your recent activities and performance"
          user={user}
          onLogout={logout}
          onViewProfile={() => navigate("/support-worker/profile")}
        />

        {user &&
          user.role === "supportWorker" &&
          !(user as SupportWorker).verificationStatus?.onboardingComplete &&
          !(user as SupportWorker).verificationStatus?.profileSetupComplete && (
            <div className="mb-6">
              <ProfileSetupAlert />
            </div>
          )}

        {/* Stats */}
        {overviewLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-6 md:mb-8">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="bg-white rounded-lg border border-gray-200 p-4 md:p-6 animate-pulse"
              >
                <div className="h-4 bg-gray-200 rounded w-1/2 mb-3"></div>
                <div className="h-8 bg-gray-200 rounded w-2/3 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-1/3"></div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-6 md:mb-8">
            <StatCard
              title="Hours Worked"
              value={`${
                overviewData?.workSummary?.hoursWorked?.current.toFixed(2) || 0
              }h`}
              icon={ClockCircle}
              trend="From last Month"
              trendDirection={getTrendDirection(
                overviewData?.workSummary?.hoursWorked?.trend
              )}
            />
            <StatCard
              title="Active Clients"
              value={overviewData?.workSummary?.activeClients.toFixed(0) || 0}
              icon={UsersGroupTwoRounded}
              trend="Currently Supporting"
              trendDirection="stable"
            />
            <StatCard
              title="Earnings"
              value={`$${
                overviewData?.workSummary?.earnings?.current.toFixed(2) || 0
              }`}
              icon={DollarMinimalistic}
              trend="From last Month"
              trendDirection={getTrendDirection(
                overviewData?.workSummary?.earnings?.trend
              )}
            />
            <StatCard
              title="Performance Ratings"
              value={
                overviewData?.performanceMetrics?.averageRating.toFixed(2) || 0
              }
              icon={Star}
              trend={`${
                overviewData?.performanceMetrics?.onTimeRate || 0
              }% on time rate`}
              trendDirection="stable"
            />
          </div>
        )}

        {/* Two columns layout for charts */}
        <div className="grid grid-cols-1 md:grid-cols-8 gap-4 mb-6">
          {/* Performance Chart */}
          <PerformanceChart
            selectedOption={selectedOption}
            onSelectedOptionChange={setSelectedOption}
            customRange={customRange}
            onCustomRangeChange={setCustomRange}
          />
          {/* Upcoming Schedules */}
          <div className="bg-white rounded-lg border col-span-full md:col-span-3 border-gray-200 p-4 md:p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-semibold text-gray-900">
                Upcoming Schedules
              </h2>
              <Button
                onClick={() => {
                  navigate("/support-worker/shifts");
                }}
                variant="link"
                className="ml-auto"
              >
                View All
              </Button>
            </div>
            {overviewData.workSummary?.upcomingShifts.length > 0 ? (
              <Table className="mt-4">
                <TableBody className="divide-y divide-gray-200 bg-white">
                  {overviewData.workSummary.upcomingShifts.map((shift) => (
                    <TableRow
                      key={shift.id}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <TableCell className="px-4 md:px-6 py-3 whitespace-nowrap">
                        {new Date(shift.date).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                        })}
                      </TableCell>
                      <TableCell className="px-4 md:px-6 py-3 text-sm text-gray-600">
                        {shift.clientName}
                      </TableCell>
                      <TableCell className="px-4 md:px-6 py-3 text-sm text-gray-600">
                        {shift.location || "N/A"}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <div className="flex items-center justify-center h-64 text-gray-500 border border-dashed border-gray-300 rounded-lg">
                <div className="text-center p-8">
                  <Calendar className="h-12 w-12 mx-auto mb-3 text-gray-400" />
                  <p className="text-sm font-medium">No upcoming schedules</p>
                  <p className="text-xs text-gray-400 mt-1">
                    Your upcoming shifts will appear here once scheduled
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Invitations Table */}
        <InvitationsTable
          invitations={invitations}
          isLoading={invitationsLoading}
        />
      </div>
    </div>
  );
}
