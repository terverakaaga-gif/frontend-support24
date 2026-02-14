import { useState, useMemo } from "react";
import { useGetShifts } from "@/hooks/useShiftHooks";
import Loader from "@/components/Loader";
import ErrorDisplay from "@/components/ErrorDisplay";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  cn,
  DASHBOARD_PAGE_WRAPPER,
  DASHBOARD_CONTENT,
  DASHBOARD_STAT_CARD,
  FLEX_ROW_CENTER,
  FLEX_ROW_BETWEEN,
  FLEX_COL,
  FLEX_CENTER,
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
  CARD_VARIANTS,
  GRID_LAYOUTS,
  CONTAINER_PADDING,
  SHADOW,
} from "@/constants/design-system";
import {
  AddCircle,
  AltArrowLeft,
  AltArrowRight,
  ArrowRightUp,
  Calendar,
  CalendarMark,
  CheckCircle,
  ClipboardCheck,
  ClockCircle,
  CloseCircle,
  CourseUp,
  DangerTriangle,
  DollarMinimalistic,
  Eye,
  List,
  Magnifer,
  MapPoint,
  Repeat,
  User,
  UserHeart,
  UsersGroupRounded,
  Widget,
} from "@solar-icons/react";
import ShiftDetailsDialog from "@/components/ShiftDetailsDialog";
import ShiftCreationDialog from "@/components/ShiftCreationDialog";
import GeneralHeader from "@/components/GeneralHeader";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { pageTitles } from "@/constants/pageTitles";

// Date formatting utilities
const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  const dateOnly = new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate()
  );

  if (dateOnly.getTime() === today.getTime()) return "Today";
  if (dateOnly.getTime() === tomorrow.getTime()) return "Tomorrow";

  const weekStart = new Date(today);
  weekStart.setDate(today.getDate() - today.getDay());
  const weekEnd = new Date(weekStart);
  weekEnd.setDate(weekStart.getDate() + 6);

  if (dateOnly >= weekStart && dateOnly <= weekEnd) {
    const days = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ];
    return days[date.getDay()];
  }

  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  return `${months[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`;
};

const formatTime = (dateString: string) => {
  const date = new Date(dateString);
  let hours = date.getHours();
  const minutes = date.getMinutes();
  const ampm = hours >= 12 ? "pm" : "am";
  hours = hours % 12 || 12;
  const minutesStr = minutes < 10 ? "0" + minutes : minutes;
  return `${hours}:${minutesStr} ${ampm}`;
};

const isThisWeek = (dateString: string) => {
  const date = new Date(dateString);
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const weekStart = new Date(today);
  weekStart.setDate(today.getDate() - today.getDay());
  const weekEnd = new Date(weekStart);
  weekEnd.setDate(weekStart.getDate() + 6);
  return date >= weekStart && date <= weekEnd;
};

const getShiftDuration = (startTime: string, endTime: string) => {
  const start = new Date(startTime);
  const end = new Date(endTime);
  const diffInMinutes = (end.getTime() - start.getTime()) / (1000 * 60);
  const hours = Math.floor(diffInMinutes / 60);
  const minutes = diffInMinutes % 60;
  if (hours === 0) return `${minutes}m`;
  if (minutes === 0) return `${hours}h`;
  return `${hours}h ${minutes}m`;
};

// Stats Card component
function StatsCard({
  stats,
  title,
  Icon,
  subtitle,
}: {
  stats: { total: number; thisWeek: number };
  title: string;
  Icon: any;
  subtitle: string;
}) {
  return (
    <div className={cn(DASHBOARD_STAT_CARD, "hover:shadow-xl transition-all duration-300 group relative overflow-hidden")}>
      <div className={cn(FLEX_ROW_BETWEEN)}>
        <div className={cn(`space-y-${SPACING.xs}`)}>
          <p className={cn(TEXT_STYLES.small, FONT_FAMILY.montserratBold)}>{title}</p>
          <p className={cn("text-3xl md:text-2xl", FONT_FAMILY.montserratBold, "text-gray-900", "group-hover:text-primary-600 transition-colors")}>
            {stats.total}
          </p>
          <p className={cn("text-xs", TEXT_STYLES.small, FONT_FAMILY.montserratSemibold)}>
            {subtitle}
          </p>
        </div>
        <div className={cn(`p-${SPACING.sm}`, RADIUS.full, "bg-primary-300/20")}>
          <Icon className="w-5 h-5 md:w-7 md:h-7 text-primary" />
        </div>
      </div>
      <div className={cn(`mt-${SPACING.md}`, FLEX_ROW_CENTER, GAP.xs, TEXT_STYLES.caption)}>
        <CourseUp className="w-3 h-3 md:w-4 md:h-4 text-green-500" />
        <span className={cn("text-xs", TEXT_COLORS.success, FONT_FAMILY.montserratSemibold)}>
          {stats.thisWeek} this week
        </span>
      </div>
    </div>
  );
}

const ParticipantShifts = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [statusFilter, setStatusFilter] = useState("all");
  const [viewMode, setViewMode] = useState("grid");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [selectedShift, setSelectedShift] = useState<any>(null);
  const [showCreateShiftDialog, setShowCreateShiftDialog] = useState(false);

  const { data: shifts = [], isLoading, error, refetch } = useGetShifts();

  // Get count of shifts by status
  const getStatusCount = (status: string) => {
    if (status === "all") return shifts.length;
    return shifts.filter((s: any) => s.status.toLowerCase() === status).length;
  };

  // Calculate stats
  const stats = useMemo(() => {
    const now = new Date();
    return {
      total: shifts.length,
      confirmed: shifts.filter((s: any) => s.status === "confirmed").length,
      pending: shifts.filter((s: any) => s.status === "pending").length,
      completed: shifts.filter((s: any) => s.status === "completed").length,
      inProgress: shifts.filter((s: any) => s.status.toLowerCase() === "inprogress")
        .length,
      cancelled: shifts.filter((s: any) => s.status === "cancelled").length,
      thisWeek: shifts.filter((s: any) => isThisWeek(s.startTime)).length,
      upcoming: shifts.filter((s: any) => new Date(s.startTime) > now).length,
    };
  }, [shifts]);

  // Filter shifts
  const filteredShifts = useMemo(() => {
    const filtered = shifts.filter((shift: any) => {
      const matchesStatus =
        statusFilter === "all" || shift.status.toLowerCase() === statusFilter;

      const matchesSearch =
        searchQuery === "" ||
        shift.shiftId?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        shift.serviceTypeId?.name
          ?.toLowerCase()
          .includes(searchQuery.toLowerCase()) ||
        shift.address?.toLowerCase().includes(searchQuery.toLowerCase());

      return matchesStatus && matchesSearch;
    });

    // Sort shifts: recent first for pending, confirmed, and in-progress
    return filtered.sort((a: any, b: any) => {
      const aStatus = a.status.toLowerCase();
      const bStatus = b.status.toLowerCase();
      const recentStatuses = ["pending", "confirmed", "inprogress"];

      // If both shifts have status that should show recent first
      if (
        recentStatuses.includes(aStatus) &&
        recentStatuses.includes(bStatus)
      ) {
        return (
          new Date(b.startTime).getTime() - new Date(a.startTime).getTime()
        );
      }

      // If only one has the recent status, prioritize it
      if (recentStatuses.includes(aStatus)) return -1;
      if (recentStatuses.includes(bStatus)) return 1;

      // For other statuses, sort by start time (most recent first)
      return new Date(b.startTime).getTime() - new Date(a.startTime).getTime();
    });
  }, [shifts, statusFilter, searchQuery]);

  // Pagination
  const totalPages = Math.ceil(filteredShifts.length / itemsPerPage);
  const paginatedShifts = filteredShifts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Helper functions
  const getStatusInfo = (status: string) => {
    const statusMap: Record<string, any> = {
      confirmed: {
        icon: <CheckCircle className="w-3 h-3" />,
        color: TEXT_COLORS.success,
        bg: BG_COLORS.success,
        lightBg: BG_COLORS.successLight,
      },
      pending: {
        icon: <DangerTriangle className="w-3 h-3" />,
        color: TEXT_COLORS.warning,
        bg: BG_COLORS.warning,
        lightBg: BG_COLORS.warningLight,
      },
      inprogress: {
        icon: <ClockCircle className="w-3 h-3" />,
        color: "text-yellow-600",
        bg: "bg-yellow-600",
        lightBg: "bg-yellow-50",
      },
      completed: {
        icon: <CheckCircle className="w-3 h-3" />,
        color: TEXT_COLORS.success,
        bg: BG_COLORS.success,
        lightBg: BG_COLORS.successLight,
      },
      cancelled: {
        icon: <CloseCircle className="w-3 h-3" />,
        color: TEXT_COLORS.error,
        bg: BG_COLORS.error,
        lightBg: BG_COLORS.errorLight,
      },
    };
    return statusMap[status.toLowerCase()] || statusMap.pending;
  };

  const renderWorkerInfo = (shift: any) => {
    if (shift.isMultiWorkerShift && shift.workerAssignments) {
      return (
        <div className={cn(FLEX_ROW_CENTER, GAP.sm)}>
          <div className="flex -space-x-2">
            {shift.workerAssignments.slice(0, 2).map((assignment: any, index: number) => (
              <Avatar
                key={assignment._id || index}
                className="w-8 h-8 border-2 border-white"
              >
                <AvatarImage src={assignment.workerId?.profileImage} />
                <AvatarFallback className="text-xs bg-purple-100 text-purple-600">
                  {assignment.workerId?.firstName?.[0]}
                  {assignment.workerId?.lastName?.[0]}
                </AvatarFallback>
              </Avatar>
            ))}
            {shift.workerAssignments.length > 2 && (
              <div className={cn("w-8 h-8", RADIUS.full, "bg-gray-100 border-2 border-white", FLEX_CENTER)}>
                <span className={cn(TEXT_STYLES.caption, FONT_FAMILY.montserratSemibold, "text-gray-600")}>
                  +{shift.workerAssignments.length - 2}
                </span>
              </div>
            )}
          </div>
          <span className={cn(TEXT_STYLES.small, FONT_FAMILY.montserratSemibold)}>
            {shift.workerAssignments.length} workers
          </span>
        </div>
      );
    } else if (shift.workerId) {
      if (typeof shift.workerId === "object") {
        return (
          <div className={cn(FLEX_ROW_CENTER, GAP.sm)}>
            <Avatar className="w-8 h-8">
              <AvatarImage src={shift.workerId.profileImage} />
              <AvatarFallback className={cn(TEXT_STYLES.caption, BG_COLORS.primaryLight, TEXT_COLORS.primary)}>
                {shift.workerId.firstName?.[0]}
                {shift.workerId.lastName?.[0]}
              </AvatarFallback>
            </Avatar>
            <span className={cn(TEXT_STYLES.label, "text-gray-900")}>
              {shift.workerId.firstName} {shift.workerId.lastName}
            </span>
          </div>
        );
      }
      return (
        <div className={cn(FLEX_ROW_CENTER, GAP.sm)}>
          <div className={cn("w-8 h-8", RADIUS.full, BG_COLORS.primaryLight, FLEX_CENTER)}>
            <User className="w-4 h-4 text-primary-600" />
          </div>
          <span className={cn(TEXT_STYLES.small)}>Assigned Worker</span>
        </div>
      );
    } else {
      return (
        <div className={cn(FLEX_ROW_CENTER, GAP.sm)}>
          <div className={cn("w-8 h-8", RADIUS.full, "bg-gray-100", FLEX_CENTER)}>
            <User className="w-4 h-4 text-gray-400" />
          </div>
          <span className={cn(TEXT_STYLES.small, "text-gray-1000")}>Unassigned</span>
        </div>
      );
    }
  };

  if (isLoading) {
    return <Loader type="pulse" />;
  }

  if (error) {
    return (
      <ErrorDisplay
        title="Failed to load shifts"
        message={error.message}
        onRetry={refetch}
        showRetry={true}
      />
    );
  }

  return (
    <div className={DASHBOARD_PAGE_WRAPPER}>
      <div className={DASHBOARD_CONTENT}>
        {/* Header */}
        <GeneralHeader
          stickyTop={true}
          title={pageTitles.participant["/participant/shifts"].title}
          subtitle="Manage your care schedule and track upcoming appointments"
          user={user}
          onLogout={logout}
          onViewProfile={() => {
            navigate(
              Object.keys(pageTitles.participant).find(
                (key) =>
                  pageTitles.participant[key] ===
                  pageTitles.participant["/participant/profile"]
              ) || "/participant/profile"
            );
          }}
          rightComponent={
            <Button
              onClick={() => setShowCreateShiftDialog(true)}
              className={cn(GAP.sm, SHADOW.lg, "hover:shadow-xl transition-all duration-300")}
            >
              <AddCircle className="w-5 h-5" />
              Create Shift
            </Button>
          }
        />

        {/* Stats Cards */}
        <div className={cn(GRID_LAYOUTS.cols4, GAP.lg, `mb-${SPACING.lg}`)}>
          <StatsCard
            stats={{ total: stats.total, thisWeek: stats.thisWeek }}
            title="Total Shifts"
            subtitle="All time"
            Icon={DollarMinimalistic}
          />

          <StatsCard
            stats={{ total: stats.upcoming, thisWeek: stats.thisWeek }}
            title="Upcoming Shifts"
            subtitle="Scheduled"
            Icon={CalendarMark}
          />

          <StatsCard
            stats={{ total: stats.inProgress, thisWeek: stats.thisWeek }}
            title="Active Shifts"
            subtitle="In Progress"
            Icon={UserHeart}
          />

          <StatsCard
            stats={{ total: stats.completed, thisWeek: stats.thisWeek }}
            title="Completed Shifts"
            subtitle="Completed"
            Icon={ClipboardCheck}
          />
        </div>

        {/* Filters */}
        <div className={cn(FLEX_ROW_CENTER, GAP.sm, `mb-${SPACING.lg}`, "overflow-x-auto")}>
          {[
            { key: "all", label: "All", bg: "bg-primary" },
            { key: "pending", label: "Pending", bg: "bg-orange-600" },
            { key: "confirmed", label: "Confirmed", bg: "bg-purple-600" },
            { key: "inprogress", label: "In Progress", bg: "bg-yellow-600" },
            { key: "completed", label: "Completed", bg: "bg-green-600" },
            { key: "cancelled", label: "Cancelled", bg: "bg-red-600" },
          ].map(({ key, label, bg }) => (
            <button
              key={key}
              onClick={() => {
                setStatusFilter(key);
                setCurrentPage(1);
              }}
              className={cn(
                "px-3 py-1",
                RADIUS.full,
                "text-xs md:text-sm font-montserrat-semibold whitespace-nowrap transition-colors",
                FLEX_ROW_CENTER,
                GAP.sm,
                statusFilter === key
                  ? `${bg} text-white`
                  : "bg-white text-gray-600 border border-gray-300 hover:bg-gray-100"
              )}
            >
              {label}
              <span
                className={cn(
                  "px-1.5 py-0.5",
                  RADIUS.full,
                  "text-xs",
                  statusFilter === key
                    ? `${bg}/10 text-white`
                    : `${bg} text-white`
                )}
              >
                {getStatusCount(key)}
              </span>
            </button>
          ))}
        </div>

        {/* Search and View Toggle */}
        <div className={cn(FLEX_ROW_CENTER, GAP.base, `mb-${SPACING.lg}`)}>
          <div className="flex-1 relative">
            <Magnifer className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <Input
              type="text"
              placeholder="Search by shift ID, service type, or location..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              className="pl-10 h-11"
            />
          </div>
          <div className={cn("flex bg-white overflow-hidden shadow-sm", BORDER_STYLES.subtle, RADIUS.lg)}>
            <button
              onClick={() => setViewMode("grid")}
              className={cn(
                "px-4 py-2",
                FLEX_ROW_CENTER,
                GAP.sm,
                "text-sm font-montserrat-semibold transition-all duration-200",
                viewMode === "grid"
                  ? "bg-primary text-white"
                  : "text-gray-600 hover:bg-gray-100"
              )}
            >
              <Widget size={24} />
              Grid
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={cn(
                "px-4 py-2",
                FLEX_ROW_CENTER,
                GAP.sm,
                "text-sm font-montserrat-semibold transition-all duration-200",
                viewMode === "list"
                  ? "bg-primary text-white"
                  : "text-gray-600 hover:bg-gray-100"
              )}
            >
              <List size={24} />
              List
            </button>
          </div>
        </div>

        {/* Shifts Grid/List */}
        <div
          className={cn(
            GAP.responsive,
            `mb-${SPACING.lg}`,
            viewMode === "grid"
              ? GRID_LAYOUTS.cols3
              : FLEX_COL
          )}
        >
          {paginatedShifts.map((shift: any) => {
            const statusInfo = getStatusInfo(shift.status);
            return (
              <div
                onClick={() => setSelectedShift(shift)}
                key={shift._id}
                className={cn(
                  CARD_VARIANTS.interactive,
                  "border-0 shadow-lg overflow-hidden group",
                  viewMode === "list" && "flex flex-row"
                )}
              >
                <div
                  className={cn("w-full", viewMode === "list" && "flex w-full")}
                >
                  <div
                    className={cn(
                      CONTAINER_PADDING.cardSm,
                      viewMode === "list" &&
                        "flex-1 flex items-center gap-4 sm:gap-6"
                    )}
                  >
                    <div
                      className={cn(
                        "space-y-2 sm:space-y-3",
                        viewMode === "list" &&
                          "flex-1 space-y-0 flex items-center gap-4 sm:gap-6"
                      )}
                    >
                      <div className={cn(viewMode === "list" && "flex-1")}>
                        <div className={cn(FLEX_ROW_BETWEEN, "mb-1 sm:mb-2")}>
                          <h3 className={cn(HEADING_STYLES.h6, "group-hover:text-primary transition-colors")}>
                            {shift.serviceTypeId?.name || "Unknown Service"}
                          </h3>
                          {viewMode === "grid" && (
                            <Badge
                              className={cn(
                                "gap-1 text-xs",
                                statusInfo.lightBg,
                                statusInfo.color
                              )}
                            >
                              {statusInfo.icon}
                              {shift.status}
                            </Badge>
                          )}
                        </div>
                        <code className={cn("text-xs text-gray-1000 bg-gray-100 px-2 py-1 font-montserrat-semibold rounded")}>
                          {shift.shiftId}
                        </code>
                      </div>

                      <div
                        className={cn(
                          "space-y-1 sm:space-y-2",
                          viewMode === "list" &&
                            "min-w-[180px] sm:min-w-[200px]"
                        )}
                      >
                        <div className={cn("text-xs sm:text-sm", FLEX_ROW_CENTER, GAP.sm)}>
                          <Calendar className="w-3 h-3 sm:w-4 sm:h-4 text-gray-400" />
                          <span className={cn(FONT_FAMILY.montserratSemibold, "text-gray-900")}>
                            {formatDate(shift.startTime)}
                          </span>
                        </div>
                        <div className={cn("text-xs sm:text-sm text-gray-600", FLEX_ROW_CENTER, GAP.sm)}>
                          <ClockCircle className="w-3 h-3 sm:w-4 sm:h-4 text-gray-400" />
                          <span>
                            {formatTime(shift.startTime)} -{" "}
                            {formatTime(shift.endTime)}
                          </span>
                          <Badge variant="outline" className="text-xs">
                            {getShiftDuration(shift.startTime, shift.endTime)}
                          </Badge>
                        </div>
                      </div>

                      <div
                        className={cn(
                          viewMode === "list" &&
                            "min-w-[200px] sm:min-w-[250px]"
                        )}
                      >
                        {renderWorkerInfo(shift)}
                      </div>

                      {shift.address && (
                        <div className={cn("text-xs sm:text-sm text-gray-600", "flex items-start gap-2")}>
                          <MapPoint className="w-3 h-3 sm:w-4 sm:h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                          <span className="line-clamp-2">{shift.address}</span>
                        </div>
                      )}

                      <div className={cn(FLEX_ROW_CENTER, GAP.sm, "flex-wrap")}>
                        {shift.recurrence?.pattern !== "none" && (
                          <Badge variant="outline" className="text-xs">
                            <Repeat className="w-3 h-3 mr-1" />
                            Recurring
                          </Badge>
                        )}
                        {shift.isMultiWorkerShift && (
                          <Badge variant="outline" className="text-xs">
                            <UsersGroupRounded className="w-3 h-3 mr-1" />
                            Multi-worker
                          </Badge>
                        )}
                      </div>

                      {viewMode === "list" && (
                        <div className={cn(FLEX_ROW_CENTER, GAP.sm)}>
                          <Badge
                            className={cn(
                              "gap-1 text-xs",
                              statusInfo.lightBg,
                              statusInfo.color
                            )}
                          >
                            {statusInfo.icon}
                            {shift.status}
                          </Badge>
                        </div>
                      )}
                    </div>

                    <div
                      className={cn(
                        "flex items-center justify-end pt-2 sm:pt-3 border-t border-gray-100",
                        viewMode === "list" && "pt-0 border-t-0"
                      )}
                    >
                      <Button
                        onClick={() => setSelectedShift(shift)}
                        variant="default"
                        size="sm"
                        className={cn("gap-2 rounded-full h-9 sm:h-10", FONT_FAMILY.montserratSemibold)}
                      >
                        {viewMode === "grid" ? (
                          <>
                            <Eye size={20} className="sm:w-6 sm:h-6" />
                            View Details
                          </>
                        ) : (
                          <ArrowRightUp size={20} className="sm:w-6 sm:h-6" />
                        )}
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {paginatedShifts.length === 0 && (
          <div className={cn(CARD_VARIANTS.default, "border-0 shadow-lg")}>
            <div className="p-12 text-center">
              <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className={cn(HEADING_STYLES.h5, "mb-2")}>
                No shifts found
              </h3>
              <p className={cn(TEXT_STYLES.body, "max-w-md mx-auto")}>
                {searchQuery || statusFilter !== "all"
                  ? "Try adjusting your filters to see more results."
                  : "You don't have any shifts scheduled yet."}
              </p>
            </div>
          </div>
        )}

        {filteredShifts.length > 0 && (
          <div className={cn(CARD_VARIANTS.default, "border-0 shadow-lg mt-6")}>
            <div className="p-4">
              <div className={cn(FLEX_ROW_BETWEEN)}>
                <div className={cn(FLEX_ROW_CENTER, GAP.base)}>
                  <p className={cn(TEXT_STYLES.small)}>
                    Showing{" "}
                    <span className={cn(FONT_FAMILY.montserratSemibold)}>
                      {Math.min(itemsPerPage, paginatedShifts.length)}
                    </span>{" "}
                    of{" "}
                    <span className={cn(FONT_FAMILY.montserratSemibold)}>{filteredShifts.length}</span>{" "}
                    shifts
                  </p>

                  <div className={cn(FLEX_ROW_CENTER, GAP.sm)}>
                    <span className={cn(TEXT_STYLES.small)}>Show:</span>
                    <Select
                      value={itemsPerPage.toString()}
                      onValueChange={(value) => {
                        setItemsPerPage(Number(value));
                        setCurrentPage(1);
                      }}
                    >
                      <SelectTrigger className="w-20 h-9">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="5">5</SelectItem>
                        <SelectItem value="10">10</SelectItem>
                        <SelectItem value="15">15</SelectItem>
                        <SelectItem value="25">25</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {totalPages > 1 && (
                  <div className={cn(FLEX_ROW_CENTER, GAP.sm)}>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        setCurrentPage((prev) => Math.max(1, prev - 1))
                      }
                      disabled={currentPage === 1}
                    >
                      <AltArrowLeft size={24} />
                    </Button>
                    {[...Array(Math.min(5, totalPages))].map((_, idx) => (
                      <Button
                        key={idx}
                        variant={
                          currentPage === idx + 1 ? "default" : "outline"
                        }
                        size="sm"
                        onClick={() => setCurrentPage(idx + 1)}
                        className="w-9"
                      >
                        {idx + 1}
                      </Button>
                    ))}
                    {totalPages > 5 && (
                      <>
                        <span className="text-gray-400">...</span>
                        <Button
                          variant={
                            currentPage === totalPages ? "default" : "outline"
                          }
                          size="sm"
                          onClick={() => setCurrentPage(totalPages)}
                          className="w-9"
                        >
                          {totalPages}
                        </Button>
                      </>
                    )}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        setCurrentPage((prev) => Math.min(totalPages, prev + 1))
                      }
                      disabled={currentPage === totalPages}
                    >
                      <AltArrowRight size={24} />
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        <ShiftCreationDialog
          open={showCreateShiftDialog}
          onOpenChange={setShowCreateShiftDialog}
        />

        {/* Shift Details Dialog */}
        <ShiftDetailsDialog
          viewMode="participant"
          currentUserId={user?._id}
          shift={selectedShift}
          open={!!selectedShift}
          onOpenChange={(open) => !open && setSelectedShift(null)}
        />
      </div>
    </div>
  );
};

export default ParticipantShifts;
