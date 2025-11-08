import { useState, useMemo, memo } from "react";
import {
  Calendar as CalendarIcon,
  ChatDots,
  ClockCircle,
  CloseCircle,
  CourseDown,
  CourseUp,
  DollarMinimalistic,
  Magnifer,
  Star,
  UsersGroupTwoRounded,
} from "@solar-icons/react";
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
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { useAuth } from "@/contexts/AuthContext";
import { format } from "date-fns";
import GeneralHeader from "@/components/GeneralHeader";
import {
  useGetParticipantOverview,
  useGetParticipantServices,
} from "@/hooks/useAnalyticsHooks";
import type { ServiceTypeInfo } from "@/entities/types";
import Loader from "@/components/Loader";
import { useNavigate } from "react-router-dom";
import {
  Select,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SelectContent, SelectPortal } from "@radix-ui/react-select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { SearchSupportWorkers } from "@/components/SearchSupportWorkers";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

// Service type labels for display
const SERVICE_TYPE_LABELS: Record<string, string> = {
  PERSONALCARE: "Personal Care",
  SOCIALSUP: "Social Support",
  TRANSPORT: "Transport",
  HOUSEHOLD: "Household Tasks",
  MEALPREP: "Meal Preparation",
  MEDICATIONSUP: "Medication Support",
  MOBILITYASSIST: "Mobility Assistance",
  THERAPYSUP: "Therapy Support",
  BEHAVESUP: "Behavior Support",
  COMMUNITYACCESS: "Community Access",
};

// Helper function to get service type display name
const getServiceTypeDisplayName = (
  serviceType: ServiceTypeInfo | string
): string => {
  if (typeof serviceType === "string") {
    return SERVICE_TYPE_LABELS[serviceType] || serviceType;
  }
  if (serviceType && typeof serviceType === "object") {
    if (serviceType.name) {
      return serviceType.name;
    }
    if (serviceType.code && SERVICE_TYPE_LABELS[serviceType.code]) {
      return SERVICE_TYPE_LABELS[serviceType.code];
    }
    if (serviceType.code) {
      return serviceType.code;
    }
  }
  return "Unknown Service";
};

// Simple stat card component matching Support Worker design
function StatCard({
  title,
  value,
  icon: Icon,
  trend,
  additionalText,
  trendDirection,
}: {
  title: string;
  value: string;
  icon: any;
  trend?: string;
  additionalText?: string;
  trendDirection?: "up" | "down" | null;
}) {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <div className="flex items-center justify-between">
        <div className="text-sm font-montserrat-semibold text-gray-600">
          {title}
        </div>
        <div className="p-2 rounded-full bg-primary-300/20">
          <Icon className="h-5 w-5" style={{ color: "#4B7BF5" }} />
        </div>
      </div>
      <div className="text-2xl font-montserrat-bold text-gray-900 mb-1">
        {value}
      </div>
      {trend && (
        <div
          className={`text-xs font-montserrat-semibold flex items-center ${
            trendDirection === "up"
              ? "text-green-600"
              : trendDirection === "down"
              ? "text-red-600"
              : "text-gray-1000"
          }`}
        >
          {trendDirection === "up" && <CourseUp className="mr-1" />}
          {trendDirection === "down" && <CourseDown className="mr-1" />}
          {trend}
        </div>
      )}
      {additionalText && (
        <div className="text-sm text-gray-1000">{additionalText}</div>
      )}
    </div>
  );
}

// Spending & Service Activity Chart Component
function SpendingServiceChart({
  spendingData,
  serviceData,
  period,
  setPeriod,
  dateRange,
  setDateRange,
}: any) {
  const chartData = useMemo(() => {
    // Combine spending and service data for the chart
    const months = spendingData?.map((item: any) => item.label) || [];
    return months.map((month: string, index: number) => ({
      month,
      spending: spendingData?.[index]?.value || 0,
      services: serviceData?.[index]?.value || 0,
    }));
  }, [spendingData, serviceData]);

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg font-montserrat-semibold text-gray-900">
          Monthly Spending Trend
        </h2>
        <div className="flex items-center gap-3">
          <Select value={period} onValueChange={setPeriod}>
            <SelectTrigger className="w-[120px]">
              <SelectValue placeholder="Select period" />
            </SelectTrigger>
            <SelectContent className="bg-white border border-gray-200 rounded-lg shadow-lg p-1 z-50">
              <SelectItem value="today">Today</SelectItem>
              <SelectItem value="week">Week</SelectItem>
              <SelectItem value="month">Month</SelectItem>
              <SelectItem value="year">Year</SelectItem>
              {/* <SelectItem value="custom">Custom</SelectItem> */}
            </SelectContent>
          </Select>
          {period === "custom" && (
            <div className="flex gap-2">
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-[140px] justify-start text-left font-normal"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {dateRange.from
                      ? format(dateRange.from, "PPP")
                      : "Start date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <CalendarComponent
                    mode="single"
                    selected={dateRange.from}
                    onSelect={(date) =>
                      setDateRange((prev) => ({ ...prev, from: date }))
                    }
                  />
                </PopoverContent>
              </Popover>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-[140px] justify-start text-left font-normal"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {dateRange.to ? format(dateRange.to, "PPP") : "End date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <CalendarComponent
                    mode="single"
                    selected={dateRange.to}
                    onSelect={(date) =>
                      setDateRange((prev) => ({ ...prev, to: date }))
                    }
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
          )}
        </div>
      </div>

      <ResponsiveContainer width="100%" height={250}>
        <ComposedChart
          data={chartData}
          margin={{ top: 20, right: 30, left: 0, bottom: 5 }}
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
          />
          <Tooltip
            contentStyle={{
              backgroundColor: "white",
              border: "1px solid #E5E7EB",
              borderRadius: "8px",
            }}
          />
          <Bar
            dataKey="services"
            fill="#0D2BEC"
            radius={[4, 4, 0, 0]}
            barSize={40}
          />
          <Line
            type="monotone"
            dataKey="spending"
            stroke="#FBBF24"
            strokeWidth={3}
            dot={{ fill: "#FBBF24", r: 4 }}
            activeDot={{ r: 6 }}
          />
        </ComposedChart>
      </ResponsiveContainer>

      <div className="flex justify-center gap-8 text-sm mt-4">
        <div className="flex items-center">
          <div
            className="w-4 h-3 rounded mr-2"
            style={{ backgroundColor: "#0D2BEC" }}
          ></div>
          <span className="text-gray-600">Service Hours</span>
        </div>
        <div className="flex items-center">
          <div className="w-8 h-1 bg-yellow-400 rounded mr-2"></div>
          <span className="text-gray-600">Monthly Spending</span>
        </div>
      </div>
    </div>
  );
}

// Support Workers Table Component
function SupportWorkersTable({ workers }: { workers: any[] }) {
  const navigate = useNavigate();
  return (
    <div className="bg-white mt-8 rounded-lg border border-gray-200">
      <div className="p-6 border-b border-gray-200 flex justify-between items-center">
        <h2 className="text-lg font-montserrat-semibold text-gray-900">
          Top Support Workers
        </h2>
        <Button
          variant="link"
          onClick={() => navigate("/participant/organizations")}
          className="text-status-pending hover:text-status-pending text-sm font-montserrat-semibold"
        >
          View all →
        </Button>
      </div>

      <Table>
        <TableHeader>
          <TableRow className="bg-gray-100">
            <TableHead className="text-xs font-montserrat-bold uppercase tracking-wider">
              Worker Name
            </TableHead>
            <TableHead className="text-xs font-montserrat-bold uppercase tracking-wider">
              Service Type
            </TableHead>
            <TableHead className="text-xs font-montserrat-bold uppercase tracking-wider">
              Hours This Month
            </TableHead>
            <TableHead className="text-xs font-montserrat-bold uppercase tracking-wider">
              Rating
            </TableHead>
            <TableHead className="text-xs font-montserrat-bold uppercase tracking-wider">
              Status
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {workers.map((worker) => (
            <TableRow key={worker.workerId}>
              <TableCell>
                <div className="flex items-center">
                  <Avatar className="h-8 w-8 mr-3">
                    <AvatarFallback className="bg-primary-100 text-primary-700">
                      {worker.name[0]}
                    </AvatarFallback>
                  </Avatar>
                  <span className="text-sm font-montserrat-semibold text-gray-900">
                    {worker.name}
                  </span>
                </div>
              </TableCell>
              <TableCell className="text-sm text-gray-600">
                Multiple Services
              </TableCell>
              <TableCell className="text-sm text-gray-600">
                {worker.hours} hours
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-1">
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  <span className="text-sm font-montserrat-semibold">
                    {worker.rating > 0 ? worker.rating.toFixed(1) : "New"}
                  </span>
                </div>
              </TableCell>
              <TableCell>
                <span className="px-3 py-1 rounded-full text-xs font-montserrat-semibold bg-green-100 text-green-800">
                  Active
                </span>
              </TableCell>
              <TableCell className="text-right">
                <button
                  onClick={() => navigate("/participant/chats")}
                  className="px-3 py-1 border border-gray-300 rounded-lg text-sm text-gray-600 hover:bg-gray-100"
                >
                  Message
                </button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

// Service Distribution Component
function ServiceDistribution({ services }: { services: any[] }) {
  if (!services || services.length === 0) return null;

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <h2 className="text-lg font-montserrat-semibold text-gray-900 mb-6">
        Service Distribution
      </h2>
      <div className="space-y-4">
        {services.map((service, index) => (
          <div key={index}>
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-montserrat-semibold text-gray-700">
                {getServiceTypeDisplayName(service.serviceType)}
              </span>
              <span className="text-sm text-gray-600">
                {service.hours} hours ({service.percentage}%)
              </span>
            </div>
            <Progress value={service.percentage} className="h-2" />
          </div>
        ))}
      </div>
    </div>
  );
}
function ParticipantDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [searchOpen, setSearchOpen] = useState<boolean>(false);
  const [period, setPeriod] = useState<string>("month");
  const [dateRange, setDateRange] = useState<{
    from: Date | null;
    to: Date | null;
  }>({
    from: null,
    to: null,
  });

  // Fetch analytics data - now reactive to period and dateRange
  const {
    data: overviewData,
    isLoading: overviewLoading,
    error: overviewError,
  } = useGetParticipantOverview(
    period === "custom" ? { period: "custom", dateRange } : period,
    true
  );
  const {
    data: serviceData,
    isLoading: serviceLoading,
    error: serviceError,
  } = useGetParticipantServices(
    period === "custom" ? { period: "custom", dateRange } : period
  );

  // Format data
  const spendingTrendData = overviewData?.financialSummary?.spendingTrend || [];
  const serviceTrendData = serviceData?.servicetrends || [];
  const upcomingShifts = overviewData?.careOverview?.upcomingShifts || [];
  const topWorkers = overviewData?.workerMetrics?.topWorkers || [];
  const serviceDistribution = serviceData?.serviceDistribution || [];

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

  if (overviewLoading || serviceLoading) {
    return <Loader />;
  }

  if (overviewError || serviceError) {
    return (
      <div className="p-8 space-y-8">
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <CloseCircle className="mx-auto h-12 w-12 text-red-500" />
            <p className="mt-4 text-muted-foreground">
              Failed to load dashboard data
            </p>
            <Button
              className="mt-4 bg-primary hover:bg-primary-700"
              onClick={() => window.location.reload()}
            >
              Try Again
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Calculate trend directions
  const careHoursTrend =
    overviewData?.careOverview?.totalCareHours?.trend === "up"
      ? "up"
      : overviewData?.careOverview?.totalCareHours?.trend === "down"
      ? "down"
      : null;
  const budgetUsed = overviewData?.financialSummary?.budgetUtilization || 0;
  const budgetTrend = budgetUsed > 80 ? "up" : budgetUsed > 50 ? null : "down";

  return (
    <div className="min-h-screen font-montserrat bg-gray-100">
      <div className="p-8">
        {/* Header */}
        <GeneralHeader
          stickyTop={true}
          title={getGreeting()}
          subtitle="Here's your care overview and recent activity"
          user={user}
          onLogout={logout}
          onViewProfile={() => {
            navigate("/participant/profile");
          }}
          rightComponent={
            <>
              <Button
                variant="outline"
                className="mr-4 rounded-lg hover:bg-transparent hover:text-gray-600 text-xs truncate"
                onClick={() => navigate("/participant/find-support-workers")}
              >
                <Magnifer size={24} />
                Find Support Workers
              </Button>
            </>
          }
        />

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Active Workers"
            value={
              overviewData?.careOverview?.activeWorkers?.toPrecision(1) || "0"
            }
            icon={UsersGroupTwoRounded}
            additionalText="Supporting your care"
            trend={undefined}
            trendDirection={undefined}
          />
          <StatCard
            title="Care Hours"
            value={`${
              overviewData?.careOverview?.totalCareHours?.current.toFixed(2) ||
              0
            }h`}
            icon={ClockCircle}
            trend={`${Math.abs(
              overviewData?.careOverview?.totalCareHours?.percentageChange || 0
            )}% from last month`}
            trendDirection={careHoursTrend}
            additionalText={undefined}
          />
          <StatCard
            title="Monthly Expenses"
            value={`$${
              overviewData?.financialSummary?.currentMonthExpenses?.toFixed(
                2
              ) || "0.00"
            }`}
            icon={DollarMinimalistic}
            trend={`${budgetUsed}% of budget used`}
            trendDirection={budgetTrend}
            additionalText={undefined}
          />
          <StatCard
            title="Service Quality"
            value={`${
              overviewData?.performanceMetrics?.averageRating?.toFixed(1) ||
              "5.0"
            }`}
            icon={Star}
            additionalText="Average rating"
            trend={undefined}
            trendDirection={undefined}
          />
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Charts & Service Distribution */}
          <div className="lg:col-span-2 space-y-6">
            <SpendingServiceChart
              period={period}
              setPeriod={setPeriod}
              dateRange={dateRange}
              setDateRange={setDateRange}
              spendingData={spendingTrendData}
              serviceData={serviceTrendData}
            />
          </div>

          {/* Right Column - Distribution */}
          <div>
            {serviceDistribution.length > 0 && (
              <ServiceDistribution services={serviceDistribution} />
            )}
          </div>
        </div>

        {/* Support Workers Table */}
        {topWorkers.length > 0 && <SupportWorkersTable workers={topWorkers} />}
      </div>
    </div>
  );
}

export default memo(ParticipantDashboard);
