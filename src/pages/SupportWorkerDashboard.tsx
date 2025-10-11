import { ProfileSetupAlert } from "@/components/ProfileSetupAlert";
import { useAuth } from "@/contexts/AuthContext";
import {
  useGetSupportWorkerOverview,
  useGetSupportWorkerPerformance,
} from "@/hooks/useAnalyticsHooks";
import { useGetOrganizationInvites } from "@/hooks/useInviteHooks";
import { CourseDown, CourseUp } from "@solar-icons/react";
import { SupportWorker } from "@/types/user.types";
import {
  Clock,
  Users,
  DollarSign,
  Star,
  Calendar,
  ChevronRight,
  MapPin,
  CheckCircle,
  XCircle,
  Eye,
} from "lucide-react";
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
import ShiftCard from "@/components/ShiftCard";
import ShiftDetailsDialog from "@/components/ShiftDetailsDialog";
import GeneralHeader from "@/components/GeneralHeader";
import { pageTitles } from "@/constants/pageTitles";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

// Mock data for visualization when real data is unavailable
const MOCK_OVERVIEW_DATA = {
  workSummary: {
    hoursWorked: { current: 2, trend: "up", percentageChange: 12.6 },
    activeClients: 2,
    earnings: { current: 500.0, trend: "up" },
    upcomingShifts: [
      {
        _id: "1",
        serviceType: "behaviorSupport",
        participantName: "Jossy T",
        startTime: new Date(2025, 8, 25, 9, 0).toISOString(),
        endTime: new Date(2025, 8, 25, 10, 0).toISOString(),
        address: "123 Main St, Anytown, Ca 12345",
        status: "Upcoming",
      },
      {
        _id: "2",
        serviceType: "behaviorSupport",
        participantName: "Jossy T",
        startTime: new Date(2025, 8, 25, 9, 0).toISOString(),
        endTime: new Date(2025, 8, 25, 10, 0).toISOString(),
        address: "123 Main St, Anytown, Ca 12345",
        status: "Upcoming",
      },
      {
        _id: "3",
        serviceType: "behaviorSupport",
        participantName: "Jossy T",
        startTime: new Date(2025, 8, 25, 9, 0).toISOString(),
        endTime: new Date(2025, 8, 25, 10, 0).toISOString(),
        address: "123 Main St, Anytown, Ca 12345",
        status: "Upcoming",
      },
    ],
  },
  performanceMetrics: {
    completionRate: 80,
    onTimeRate: 95,
    averageRating: 1.5,
  },
};

const MOCK_PERFORMANCE_DATA = {
  monthlyTrends: [
    { month: "2025-01-01", completionRate: 35, onTimeRate: 30 },
    { month: "2025-02-01", completionRate: 18, onTimeRate: 42 },
    { month: "2025-03-01", completionRate: 48, onTimeRate: 28 },
    { month: "2025-04-01", completionRate: 85, onTimeRate: 58 },
    { month: "2025-05-01", completionRate: 62, onTimeRate: 32 },
    { month: "2025-06-01", completionRate: 45, onTimeRate: 48 },
    { month: "2025-07-01", completionRate: 38, onTimeRate: 35 },
    { month: "2025-08-01", completionRate: 52, onTimeRate: 45 },
  ],
  availabilityComparison: { utilizationPercentage: 0.0 },
};

const MOCK_INVITATIONS = [
  {
    id: "1",
    clientName: "Jane Smith",
    serviceRequested: "Elderly Care",
    date: "Sept 20, 2025",
    location: "123 Main Street, AnyTown",
    hourlyRate: "$35.000/hr",
    status: "Pending",
  },
  {
    id: "2",
    clientName: "Jane Smith",
    serviceRequested: "Elderly Care",
    date: "Sept 20, 2025",
    location: "123 Main Street, AnyTown",
    hourlyRate: "$35.000/hr",
    status: "Confirmed",
  },
  {
    id: "3",
    clientName: "Jane Smith",
    serviceRequested: "Elderly Care",
    date: "Sept 20, 2025",
    location: "123 Main Street, AnyTown",
    hourlyRate: "$35.000/hr",
    status: "Completed",
  },
];

const SERVICE_TYPE_LABELS = {
  behaviorSupport: "Behavior Support",
  personalCare: "Personal Care",
  socialSupport: "Social Support",
  transport: "Transport",
  householdTasks: "Household Tasks",
  mealPreparation: "Meal Preparation",
  medicationSupport: "Medication Support",
  mobilityAssistance: "Mobility Assistance",
  therapySupport: "Therapy Support",
  communityAccess: "Community Access",
};

// Simple stat card component matching design
function StatCard({
  title,
  value,
  icon: Icon,
  trend,
  additionalText,
  trendDirection,
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

// Performance chart component using Recharts
function PerformanceChart({ overviewData, performanceData }) {
  const chartData = useMemo(() => {
    const data =
      performanceData?.monthlyTrends && performanceData.monthlyTrends.length > 0
        ? performanceData.monthlyTrends
        : MOCK_PERFORMANCE_DATA.monthlyTrends;
    return data.map((trend) => ({
      month: new Date(trend.month).toLocaleDateString("en-US", {
        month: "short",
      }),
      completionRate: trend.completionRate || 0,
      onTimeRate: trend.onTimeRate || 0,
    }));
  }, [performanceData]);

  const metrics = {
    completionRate:
      overviewData?.performanceMetrics?.completionRate ||
      MOCK_OVERVIEW_DATA.performanceMetrics.completionRate,
    onTimeRate:
      overviewData?.performanceMetrics?.onTimeRate ||
      MOCK_OVERVIEW_DATA.performanceMetrics.onTimeRate,
    utilizationRate:
      performanceData?.availabilityComparison?.utilizationPercentage ||
      MOCK_PERFORMANCE_DATA.availabilityComparison.utilizationPercentage,
    percentageChange:
      overviewData?.workSummary?.hoursWorked?.percentageChange ||
      MOCK_OVERVIEW_DATA.workSummary.hoursWorked.percentageChange,
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg font-montserrat-semibold text-gray-900">
          Performance Overview
        </h2>
        <div className="flex items-center gap-3">
          <Button className="px-4 py-2 border border-gray-200 rounded-lg text-sm flex items-center gap-2 hover:bg-gray-100 bg-white">
            Pick Date
            <Calendar className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="flex items-center gap-8 mb-6">
        <div className="flex gap-3 items-center">
          <div className="text-2xl font-montserrat-bold">
            {metrics.completionRate}%
          </div>
          <div className="text-green-600 bg-green-600/10 rounded-lg px-2 py-1 text-sm font-medium flex items-center mt-1">
            <span className="mr-1">↑</span> {metrics.percentageChange}%
          </div>
        </div>
      </div>

      {/* Recharts Implementation */}
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

      {/* Legend */}
      <div className="flex justify-center gap-8 text-sm mt-4">
        <div className="flex items-center">
          <div
            className="w-4 h-3 rounded mr-2"
            style={{ backgroundColor: "#0D2BEC" }}
          ></div>
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

// Upcoming Shifts Component
// function UpcomingShifts({ shifts = [] }) {
//   const [selectedShift, setSelectedShift] = useState<any>(null);
//   const displayShifts =
//     shifts && shifts.length > 0
//       ? shifts
//       : MOCK_OVERVIEW_DATA.workSummary.upcomingShifts;

//   return (
//     <div className="bg-white rounded-lg border border-gray-200">
//       {/* Shift Details Dialog */}
//       <ShiftDetailsDialog
//         shift={selectedShift}
//         open={!!selectedShift}
//         onOpenChange={(open) => !open && setSelectedShift(null)}
//       />
//       <div className="p-6 border-b border-gray-200 flex justify-between items-center font-montserrat-semibold">
//         <h2 className="text-lg font-montserrat-semibold text-gray-900">Upcoming Shifts</h2>
//         <Button className="text-status-pending hover:text-status-pending text-sm font-medium">
//           View all →
//         </Button>
//       </div>

//       <div className="p-6 space-y-4">
//         {displayShifts.length > 0 ? (
//           displayShifts.map((shift) => (
//             <ShiftCard
//               key={shift._id}
//               shift={shift}
//               onClick={() => setSelectedShift(shift)}
//             />
//           ))
//         ) : (
//           <p className="text-gray-1000">No upcoming shifts</p>
//         )}
//       </div>
//     </div>
//   );
// }

// Invitations Table Component
function InvitationsTable({ invitations }) {
  const [currentPage, setCurrentPage] = useState(1);
  const displayInvitations =
    invitations && invitations.length > 0 ? invitations : MOCK_INVITATIONS;

  return (
    <div className="bg-white mt-8 rounded-lg border border-gray-200">
      <div className="p-6 border-b border-gray-200 flex justify-between items-center font-montserrat-semibold">
        <h2 className="text-lg font-montserrat-semibold text-gray-900">
          All Invitations
        </h2>
        <Button
          variant="link"
          className="text-status-pending hover:text-status-pending text-sm font-medium"
        >
          View all →
        </Button>
      </div>

      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="border-b border-gray-200 bg-gray-100">
              <TableHead className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                Client Name
              </TableHead>
              <TableHead className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                Service Requested
              </TableHead>
              <TableHead className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                Date
              </TableHead>
              <TableHead className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                Location
              </TableHead>
              <TableHead className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                Hourly Rate
              </TableHead>
              <TableHead className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                Status
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody className="divide-y divide-gray-200">
            {displayInvitations.map((invitation) => (
              <TableRow key={invitation.id} className="hover:bg-gray-100">
                <TableCell className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="w-8 h-8 bg-gray-300 rounded-full mr-3"></div>
                    <span className="text-sm font-medium text-gray-900">
                      {invitation.clientName}
                    </span>
                  </div>
                </TableCell>
                <TableCell className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                  {invitation.serviceRequested}
                </TableCell>
                <TableCell className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                  {invitation.date}
                </TableCell>
                <TableCell className="px-6 py-4 text-sm text-gray-600">
                  {invitation.location}
                </TableCell>
                <TableCell className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                  {invitation.hourlyRate}
                </TableCell>
                <TableCell className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${
                      invitation.status === "Pending"
                        ? "bg-yellow-100 text-yellow-800"
                        : invitation.status === "Confirmed"
                        ? "bg-primary-100 text-primary-800"
                        : "bg-green-100 text-green-800"
                    }`}
                  >
                    {invitation.status}
                  </span>
                </TableCell>
                <TableCell className="px-6 py-4 whitespace-nowrap text-right">
                  {invitation.status === "Pending" ? (
                    <div className="flex gap-2 justify-end">
                      <Button className="w-8 h-8 bg-primary rounded flex items-center justify-center text-white hover:bg-primary-700">
                        <CheckCircle className="h-4 w-4" />
                      </Button>
                      <Button className="w-8 h-8 bg-red-600 rounded flex items-center justify-center text-white hover:bg-red-700">
                        <XCircle className="h-4 w-4" />
                      </Button>
                    </div>
                  ) : (
                    <Button variant="outline" className="border-primary text-primary hover:text-white hover:bg-primary flex items-center gap-1">
                      <Eye className="h-4 w-4" /> View
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      <div className="p-4 border-t border-gray-200 flex justify-between items-center">
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <span>Showing</span>
          <select className="border border-gray-200 rounded px-2 py-1">
            <option>5 entries</option>
            <option>10 entries</option>
            <option>20 entries</option>
          </select>
        </div>
        <div className="flex items-center gap-1">
          <Button className="border-primary text-primary hover:text-white hover:bg-primary">
            ‹
          </Button>
          {[1, 2, 3, 4, 5].map((page) => (
            <Button
              key={page}
              onClick={() => setCurrentPage(page)}
              className={`px-3 py-1 rounded ${
                currentPage === page
                  ? "bg-primary text-white"
                  : "border border-gray-200 hover:bg-gray-100"
              }`}
            >
              {page}
            </Button>
          ))}
          <Button className="border-primary text-primary hover:text-white hover:bg-primary">
            ›
          </Button>
        </div>
      </div>
    </div>
  );
}

export default function SupportWorkerDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { data: propOverviewData } = useGetSupportWorkerOverview();
  const { data: propPerformanceData } = useGetSupportWorkerPerformance();
  const { data: propInvitations } = useGetOrganizationInvites();

  console.log("SupportWorkerDashboard render", {
    user,
    propOverviewData,
    propPerformanceData,
    propInvitations,
  });
  // Use prop data if available and not empty, otherwise use mock data
  const overviewData =
    propOverviewData && Object.keys(propOverviewData).length > 0
      ? propOverviewData
      : MOCK_OVERVIEW_DATA;

  const performanceData =
    propPerformanceData && Object.keys(propPerformanceData).length > 0
      ? propPerformanceData
      : MOCK_PERFORMANCE_DATA;

  const invitations =
    propInvitations && propInvitations.length > 0
      ? propInvitations
      : MOCK_INVITATIONS;

  const upcomingShifts = overviewData?.workSummary?.upcomingShifts || [];
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
    <div className="min-h-screen font-sans">
      <div className="p-8">
        {/* Header */}

        <GeneralHeader
          stickyTop={true}
          title={getGreeting()}
          subtitle="Here's a summary of your recent activities and performance"
          user={user}
          onLogout={logout}
          onViewProfile={() => {
            navigate(
              Object.keys(pageTitles.supportWorker).find(
                (key) =>
                  pageTitles.supportWorker[key] ===
                  pageTitles.supportWorker["/support-worker/profile"]
              )
            );
          }}
        />

        {/* Show alert if support worker hasn't completed onboarding */}
        {user &&
          user.role === "supportWorker" &&
          (user as SupportWorker).verificationStatus?.onboardingComplete && (
            <ProfileSetupAlert userName={user.firstName.split(" ")[0]} />
          )}

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Hours Worked"
            value={`${overviewData.workSummary.hoursWorked.current}h`}
            icon={Clock}
            trend="From last Month"
            trendDirection="up"
            additionalText={undefined}
          />
          <StatCard
            title="Active Clients"
            value={overviewData.workSummary.activeClients}
            icon={Users}
            additionalText={undefined}
            trend={"Currently Supporting"}
            trendDirection={"down"}
          />
          <StatCard
            title="Earnings"
            value={`$${overviewData.workSummary.earnings.current.toFixed(2)}`}
            icon={DollarSign}
            trend="From last Month"
            trendDirection="up"
            additionalText={undefined}
          />
          <StatCard
            title="Performance Ratings"
            value={overviewData.performanceMetrics.averageRating.toFixed(1)}
            icon={Star}
            additionalText={undefined}
            trend={`${overviewData.performanceMetrics.onTimeRate}% on time rate`}
            trendDirection={"down"}
          />
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Performance & Invitations */}
          <div className="lg:col-span-2 space-y-6">
            <PerformanceChart
              overviewData={overviewData}
              performanceData={performanceData}
            />
          </div>

          {/* Right Column - Upcoming Shifts */}
          <div>{/* <UpcomingShifts shifts={upcomingShifts} /> */}</div>
        </div>

        <InvitationsTable invitations={invitations} />
      </div>
    </div>
  );
}
