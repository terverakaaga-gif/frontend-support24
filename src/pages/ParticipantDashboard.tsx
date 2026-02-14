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
import { Participant } from "@/types/user.types";
import { ParticipantSetupAlert } from "@/components/ParticipantSetupAlert";
import { DateRangePicker } from "@/components/analytics/DateRangePicker";
import { DateRange, DateRangeType } from "@/entities/Analytics";
import { createDateRange } from "@/api/services/analyticsService";

// Design System imports
import {
  cn,
  DASHBOARD_PAGE_WRAPPER,
  DASHBOARD_CONTENT,
  DASHBOARD_STAT_CARD,
  DASHBOARD_TABLE_CONTAINER,
  FLEX_ROW_CENTER,
  FLEX_ROW_BETWEEN,
  FLEX_CENTER,
  FLEX_COL_CENTER,
  BADGE_SUCCESS,
  BADGE_SM,
} from "@/lib/design-utils";
import {
  SPACING,
  GAP,
  RADIUS,
  BORDER_STYLES,
  HEADING_STYLES,
  TEXT_STYLES,
  FONT_FAMILY,
  TEXT_COLORS,
  BG_COLORS,
  GRID_LAYOUTS,
  CONTAINER_PADDING,
} from "@/constants/design-system";

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
    <div className={cn(DASHBOARD_STAT_CARD)}>
      <div className={cn(FLEX_ROW_BETWEEN)}>
        <div className={cn(TEXT_STYLES.label, "text-gray-600")}>
          {title}
        </div>
        <div className={cn(`p-${SPACING.sm}`, RADIUS.full, BG_COLORS.primaryLight)}>
          <Icon className="h-5 w-5" style={{ color: "#4B7BF5" }} />
        </div>
      </div>
      <div className={cn("text-2xl", FONT_FAMILY.montserratBold, "text-gray-900", `mb-${SPACING.xs}`)}>
        {value}
      </div>
      {trend && (
        <div
          className={cn(
            "text-xs",
            FONT_FAMILY.montserratSemibold,
            FLEX_ROW_CENTER,
            trendDirection === "up"
              ? TEXT_COLORS.success
              : trendDirection === "down"
              ? TEXT_COLORS.error
              : "text-gray-1000"
          )}
        >
          {trendDirection === "up" && <CourseUp className="mr-1" />}
          {trendDirection === "down" && <CourseDown className="mr-1" />}
          {trend}
        </div>
      )}
      {additionalText && (
        <div className={cn(TEXT_STYLES.small)}>{additionalText}</div>
      )}
    </div>
  );
}

// Spending & Service Activity Chart Component
function SpendingServiceChart({
  spendingData,
  serviceData,
}: {
  spendingData: any[];
  serviceData: any[];
}) {
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
    <div className={cn(DASHBOARD_STAT_CARD)}>
      <div className={cn(FLEX_ROW_BETWEEN, `mb-${SPACING.lg}`)}>
        <h2 className={cn(HEADING_STYLES.h5)}>
          Monthly Spending Trend
        </h2>
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

      <div className={cn(FLEX_ROW_CENTER, "justify-center", GAP.xl, TEXT_STYLES.small, `mt-${SPACING.base}`)}>
        <div className={cn(FLEX_ROW_CENTER)}>
          <div
            className={cn("w-4 h-3", RADIUS.sm, `mr-${SPACING.sm}`)}
            style={{ backgroundColor: "#0D2BEC" }}
          ></div>
          <span className={TEXT_COLORS.gray600}>Service Hours</span>
        </div>
        <div className={cn(FLEX_ROW_CENTER)}>
          <div className={cn("w-8 h-1", BG_COLORS.warning, RADIUS.sm, `mr-${SPACING.sm}`)}></div>
          <span className={TEXT_COLORS.gray600}>Monthly Spending</span>
        </div>
      </div>
    </div>
  );
}

// Support Workers Table Component
function SupportWorkersTable({ workers }: { workers: any[] }) {
  const navigate = useNavigate();
  return (
    <div className={cn(DASHBOARD_TABLE_CONTAINER, `mt-${SPACING['2xl']}`)}>
      <div className={cn(`p-${SPACING.lg}`, "border-b", BORDER_STYLES.subtle, FLEX_ROW_BETWEEN)}>
        <h2 className={cn(HEADING_STYLES.h5)}>
          Top Support Workers
        </h2>
        <Button
          variant="link"
          onClick={() => navigate("/participant/organizations")}
          className={cn("text-status-pending hover:text-status-pending", TEXT_STYLES.small, FONT_FAMILY.montserratSemibold)}
        >
          View all →
        </Button>
      </div>

      <Table>
        <TableHeader>
          <TableRow className={cn(BG_COLORS.muted)}>
            <TableHead className={cn("text-xs uppercase tracking-wider", FONT_FAMILY.montserratBold)}>
              Worker Name
            </TableHead>
            <TableHead className={cn("text-xs uppercase tracking-wider", FONT_FAMILY.montserratBold)}>
              Service Type
            </TableHead>
            <TableHead className={cn("text-xs uppercase tracking-wider", FONT_FAMILY.montserratBold)}>
              Hours This Month
            </TableHead>
            <TableHead className={cn("text-xs uppercase tracking-wider", FONT_FAMILY.montserratBold)}>
              Rating
            </TableHead>
            <TableHead className={cn("text-xs uppercase tracking-wider", FONT_FAMILY.montserratBold)}>
              Status
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {workers.map((worker) => (
            <TableRow key={worker.workerId}>
              <TableCell>
                <div className={cn(FLEX_ROW_CENTER)}>
                  <Avatar className={cn("h-8 w-8", `mr-${SPACING.md}`)}>
                    <AvatarFallback className="bg-primary-100 text-primary-700">
                      {worker.name[0]}
                    </AvatarFallback>
                  </Avatar>
                  <span className={cn(TEXT_STYLES.small, FONT_FAMILY.montserratSemibold, "text-gray-900")}>
                    {worker.name}
                  </span>
                </div>
              </TableCell>
              <TableCell className={cn(TEXT_STYLES.small)}>
                Multiple Services
              </TableCell>
              <TableCell className={cn(TEXT_STYLES.small)}>
                {worker.hours} hours
              </TableCell>
              <TableCell>
                <div className={cn(FLEX_ROW_CENTER, GAP.xs)}>
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  <span className={cn(TEXT_STYLES.small, FONT_FAMILY.montserratSemibold)}>
                    {worker.rating > 0 ? worker.rating.toFixed(1) : "New"}
                  </span>
                </div>
              </TableCell>
              <TableCell>
                <span className={cn(BADGE_SUCCESS, BADGE_SM)}>
                  Active
                </span>
              </TableCell>
              <TableCell className="text-right">
                <button
                  onClick={() => navigate("/participant/chats")}
                  className={cn(`px-${SPACING.md} py-${SPACING.xs}`, BORDER_STYLES.subtle, RADIUS.lg, TEXT_STYLES.small, "hover:bg-gray-100")}
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
    <div className={cn(DASHBOARD_STAT_CARD)}>
      <h2 className={cn(HEADING_STYLES.h5, `mb-${SPACING.lg}`)}>
        Service Distribution
      </h2>
      <div className={cn(`space-y-${SPACING.base}`)}>
        {services.map((service, index) => (
          <div key={index}>
            <div className={cn(FLEX_ROW_BETWEEN, `mb-${SPACING.sm}`)}>
              <span className={cn(TEXT_STYLES.label)}>
                {getServiceTypeDisplayName(service.serviceType)}
              </span>
              <span className={cn(TEXT_STYLES.small)}>
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

  const [dateRange, setDateRange] = useState<DateRange>(
    createDateRange(DateRangeType.MONTH)
  );

  // Fetch analytics data - now reactive to period and dateRange
  const {
    data: overviewData,
    isLoading: overviewLoading,
    error: overviewError,
  } = useGetParticipantOverview(dateRange, true);
  const {
    data: serviceData,
    isLoading: serviceLoading,
    error: serviceError,
  } = useGetParticipantServices(dateRange);

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
      <div className={cn(CONTAINER_PADDING.responsive, `space-y-${SPACING['2xl']}`)}>
        <div className={cn(FLEX_CENTER, "py-12")}>
          <div className={FLEX_COL_CENTER}>
            <CloseCircle className={cn("mx-auto h-12 w-12", TEXT_COLORS.error)} />
            <p className={cn(`mt-${SPACING.base}`, TEXT_STYLES.body)}>
              Failed to load dashboard data
            </p>
            <Button
              className={cn(`mt-${SPACING.base}`, BG_COLORS.primary, "hover:bg-primary-700")}
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
    <div className={cn(DASHBOARD_PAGE_WRAPPER)}>
      <div className={cn(DASHBOARD_CONTENT)}>
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
            <DateRangePicker value={dateRange} onChange={setDateRange} />
          }
        />

        {user &&
          user.role === "participant" &&
          !(user as Participant)?.onboardingComplete && (
            <div className={cn(`mb-${SPACING.lg}`)}>
              <ParticipantSetupAlert />
            </div>
          )}
        
        {/* Stats */}
        <div className={cn(GRID_LAYOUTS.cols4, GAP.lg, `mb-${SPACING['2xl']}`)}>
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
        <div className={cn("grid grid-cols-1 lg:grid-cols-3", GAP.lg)}>
          {/* Left Column - Charts & Service Distribution */}
          <div className={cn("lg:col-span-2", `space-y-${SPACING.lg}`)}>
            <SpendingServiceChart
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
