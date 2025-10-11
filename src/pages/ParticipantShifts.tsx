import React, { useState, useMemo } from "react";
import { useGetShifts } from "@/hooks/useShiftHooks";
import Loader from "@/components/Loader";
import ErrorDisplay from "@/components/ErrorDisplay";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import {
  AltArrowLeft,
  AltArrowRight,
  ArrowRightUp,
  Calendar,
  CalendarMark,
  CheckCircle,
  ClockCircle,
  CloseCircle,
  CourseUp,
  DangerCircle,
  DollarMinimalistic,
  Eye,
  History2,
  List,
  Magnifer,
  MapPoint,
  PlayCircle,
  Repeat,
  StationMinimalistic,
  User,
  UserHeart,
  UsersGroupRounded,
  Widget,
} from "@solar-icons/react";
import { ClipboardCheck } from "lucide-react";
import ShiftDetailsDialog from "@/components/ShiftDetailsDialog";
import GeneralHeader from "@/components/GeneralHeader";
import { useAuth } from "@/contexts/AuthContext";
import { Navigate, useNavigate } from "react-router-dom";
import { pageTitles } from "@/constants/pageTitles";

// Date formatting utilities
const formatDate = (dateString) => {
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

const formatTime = (dateString) => {
  const date = new Date(dateString);
  let hours = date.getHours();
  const minutes = date.getMinutes();
  const ampm = hours >= 12 ? "pm" : "am";
  hours = hours % 12 || 12;
  const minutesStr = minutes < 10 ? "0" + minutes : minutes;
  return `${hours}:${minutesStr} ${ampm}`;
};

const isThisWeek = (dateString) => {
  const date = new Date(dateString);
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const weekStart = new Date(today);
  weekStart.setDate(today.getDate() - today.getDay());
  const weekEnd = new Date(weekStart);
  weekEnd.setDate(weekStart.getDate() + 6);
  return date >= weekStart && date <= weekEnd;
};

const getShiftDuration = (startTime, endTime) => {
  const start = new Date(startTime);
  const end = new Date(endTime);
  const diffInMinutes = (end.getTime() - start.getTime()) / (1000 * 60);
  const hours = Math.floor(diffInMinutes / 60);
  const minutes = diffInMinutes % 60;
  if (hours === 0) return `${minutes}m`;
  if (minutes === 0) return `${hours}h`;
  return `${hours}h ${minutes}m`;
};

const ParticipantShifts = () => {
  const {user,logout} = useAuth()
  const navigate = useNavigate();
  const [statusFilter, setStatusFilter] = useState("all");
  const [viewMode, setViewMode] = useState("grid");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [selectedShift, setSelectedShift] = useState<any>(null);

  const { data: shifts = [], isLoading, error, refetch } = useGetShifts();

  // Calculate stats
  const stats = useMemo(() => {
    const now = new Date();
    return {
      total: shifts.length,
      confirmed: shifts.filter((s) => s.status === "confirmed").length,
      pending: shifts.filter((s) => s.status === "pending").length,
      completed: shifts.filter((s) => s.status === "completed").length,
      inProgress: shifts.filter((s) => s.status.toLowerCase() === "in_progress")
        .length,
      cancelled: shifts.filter((s) => s.status === "cancelled").length,
      thisWeek: shifts.filter((s) => isThisWeek(s.startTime)).length,
      upcoming: shifts.filter((s) => new Date(s.startTime) > now).length,
    };
  }, [shifts]);

  // Filter shifts
  const filteredShifts = useMemo(() => {
    return shifts.filter((shift) => {
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
  }, [shifts, statusFilter, searchQuery]);

  // Pagination
  const totalPages = Math.ceil(filteredShifts.length / itemsPerPage);
  const paginatedShifts = filteredShifts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Helper functions
  const getStatusInfo = (status) => {
    const statusMap = {
      confirmed: {
        icon: <CheckCircle className="w-3 h-3" />,
        color: "text-green-600",
        bg: "bg-green-600",
        lightBg: "bg-green-50",
      },
      pending: {
        icon: <DangerCircle className="w-3 h-3" />,
        color: "text-orange-600",
        bg: "bg-orange-600",
        lightBg: "bg-orange-50",
      },
      in_progress: {
        icon: <ClockCircle className="w-3 h-3" />,
        color: "text-yellow-600",
        bg: "bg-yellow-600",
        lightBg: "bg-yellow-50",
      },
      completed: {
        icon: <CheckCircle className="w-3 h-3" />,
        color: "text-green-600",
        bg: "bg-green-600",
        lightBg: "bg-green-50",
      },
      cancelled: {
        icon: <CloseCircle className="w-3 h-3" />,
        color: "text-red-600",
        bg: "bg-red-600",
        lightBg: "bg-red-50",
      },
    };
    return statusMap[status.toLowerCase()] || statusMap.pending;
  };

  const renderWorkerInfo = (shift) => {
    if (shift.isMultiWorkerShift && shift.workerAssignments) {
      return (
        <div className="flex items-center gap-2">
          <div className="flex -space-x-2">
            {shift.workerAssignments.slice(0, 2).map((assignment, index) => (
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
              <div className="w-8 h-8 rounded-full bg-gray-100 border-2 border-white flex items-center justify-center">
                <span className="text-xs font-medium text-gray-600">
                  +{shift.workerAssignments.length - 2}
                </span>
              </div>
            )}
          </div>
          <span className="text-sm text-gray-600 font-medium">
            {shift.workerAssignments.length} workers
          </span>
        </div>
      );
    } else if (shift.workerId) {
      if (typeof shift.workerId === "object") {
        return (
          <div className="flex items-center gap-2">
            <Avatar className="w-8 h-8">
              <AvatarImage src={shift.workerId.profileImage} />
              <AvatarFallback className="text-xs bg-primary-100 text-primary-600">
                {shift.workerId.firstName?.[0]}
                {shift.workerId.lastName?.[0]}
              </AvatarFallback>
            </Avatar>
            <span className="text-sm font-medium text-gray-900">
              {shift.workerId.firstName} {shift.workerId.lastName}
            </span>
          </div>
        );
      }
      return (
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center">
            <User className="w-4 h-4 text-primary-600" />
          </div>
          <span className="text-sm text-gray-600">Assigned Worker</span>
        </div>
      );
    } else {
      return (
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
            <User className="w-4 h-4 text-gray-400" />
          </div>
          <span className="text-sm text-gray-1000">Unassigned</span>
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
    <div className="min-h-screen bg-gray-100">
      <div className="p-8">
        {/* Header */}
        <GeneralHeader
          stickyTop={true} 
          title={pageTitles.participant["/participant/shifts"].title}
          subtitle="Manage your care schedule and track upcoming appointments"
          user={user}
          onLogout={logout}
          onViewProfile={()=>{navigate(Object.keys(pageTitles.participant).find(key => pageTitles.participant[key] === pageTitles.participant["/participant/profile"]))}} />

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          <Card className="relative overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300 group">
            {/* <div className="absolute inset-0 bg-gradient-to-br from-primary-500/5 to-primary-600/10" /> */}
            <CardContent className="p-6 relative">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-sm font-montserrat-bold">
                    Total Shifts
                  </p>
                  <p className="text-3xl font-montserrat-bold text-gray-900 group-hover:text-primary-600 transition-colors">
                    {stats.total}
                  </p>
                  <p className="text-xs text-gray-1000 font-montserrat-semibold">All time</p>
                </div>
                <div className="w-14 h-14 rounded-full bg-primary-100 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <Calendar className="w-7 h-7 text-primary" />
                </div>
              </div>
              <div className="mt-4 flex items-center gap-1 text-sm">
                <CourseUp className="w-4 h-4 text-green-500" />
                <span className="text-green-600 font-medium">
                  {stats.thisWeek} this week
                </span>
              </div>
            </CardContent>
          </Card>

          <Card className="relative overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300 group">
            {/* <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-purple-600/10" /> */}
            <CardContent className="p-6 relative">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-sm font-montserrat-bold">
                    Upcoming
                  </p>
                  <p className="text-3xl font-montserrat-bold text-gray-900 group-hover:text-purple-600 transition-colors">
                    {stats.upcoming}
                  </p>
                  <p className="text-xs text-gray-1000 font-montserrat-semibold">Future shifts</p>
                </div>
                <div className="w-14 h-14 rounded-full bg-primary-100 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <CalendarMark className="w-7 h-7 text-primary" />
                </div>
              </div>
              <div className="mt-4 flex items-center gap-1 text-sm">
                <CheckCircle className="w-4 h-4 text-green-500" />
                <span className="text-green-600 font-medium">
                  {stats.confirmed} confirmed
                </span>
              </div>
            </CardContent>
          </Card>

          <Card className="relative overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300 group">
            {/* <div className="absolute inset-0 bg-gradient-to-br from-orange-500/5 to-orange-600/10" /> */}
            <CardContent className="p-6 relative">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-sm font-montserrat-bold">
                    Active Now
                  </p>
                  <p className="text-3xl font-montserrat-bold text-gray-900 group-hover:text-orange-600 transition-colors">
                    {stats.inProgress}
                  </p>
                  <p className="text-xs text-gray-1000 font-montserrat-semibold">In progress</p>
                </div>
                <div className="w-14 h-14 rounded-full bg-primary-100 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <UserHeart className="w-7 h-7 text-primary" />
                </div>
              </div>
              <div className="mt-4 flex items-center gap-1 text-sm">
                <StationMinimalistic className="w-4 h-4 text-green-500" />
                <span className="text-green-600 font-medium">Live updates</span>
              </div>
            </CardContent>
          </Card>

          <Card className="relative overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300 group">
            {/* <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 to-green-600/10" /> */}
            <CardContent className="p-6 relative">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-sm font-montserrat-bold">
                    Completed
                  </p>
                  <p className="text-3xl font-montserrat-bold text-gray-900 group-hover:text-green-600 transition-colors">
                    {stats.completed}
                  </p>
                  <p className="text-xs text-gray-1000 font-montserrat-semibold">
                    {stats.total > 0
                      ? Math.round((stats.completed / stats.total) * 100)
                      : 0}
                    % completion rate
                  </p>
                </div>
                <div className="w-14 h-14 rounded-full bg-primary-100 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <History2 className="w-7 h-7 text-primary" />
                </div>
              </div>
              <div className="mt-4 flex items-center gap-1 text-sm">
                <CheckCircle className="w-4 h-4 text-green-500" />
                <span className="text-green-600 font-medium">
                  {stats.total - stats.cancelled} successful
                </span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          {[
            {
              key: "all",
              label: "All",
              count: shifts.length,
              color: "bg-primary",
            },
            {
              key: "pending",
              label: "Pending",
              count: stats.pending,
              color: "bg-orange-600",
            },
            {
              key: "confirmed",
              label: "Confirmed",
              count: stats.confirmed,
              color: "bg-purple-600",
            },
            {
              key: "in_progress",
              label: "In Progress",
              count: stats.inProgress,
              color: "bg-yellow-600",
            },
            {
              key: "completed",
              label: "Completed",
              count: stats.completed,
              color: "bg-green-600",
            },
            {
              key: "cancelled",
              label: "Cancelled",
              count: stats.cancelled,
              color: "bg-red-600",
            },
          ].map(({ key, label, count, color }) => (
            <button
              key={key}
              onClick={() => {
                setStatusFilter(key);
                setCurrentPage(1);
              }}
              className={`px-4 py-2 rounded-full text-sm font-montserrat-semibold whitespace-nowrap transition-all duration-200 flex items-center gap-2 ${
                statusFilter === key
                  ? `${color} text-white shadow-lg`
                  : "bg-white text-gray-600 border border-gray-300 hover:bg-gray-100"
              }`}
            >
              {label}
              <span
                className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                  statusFilter === key
                    ? "bg-white text-gray-700"
                    : "bg-gray-100"
                }`}
              >
                {count}
              </span>
            </button>
          ))}
        </div>

        {/* Search and View Toggle */}
        <div className="flex gap-4 mb-6">
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
          <div className="flex bg-white border border-gray-300 rounded-lg overflow-hidden shadow-sm">
            <button
              onClick={() => setViewMode("grid")}
              className={`px-4 py-2 flex items-center gap-2 text-sm font-medium transition-all duration-200 ${
                viewMode === "grid"
                  ? "bg-primary text-white"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              <Widget size={24} />
              Grid
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={`px-4 py-2 flex items-center gap-2 text-sm font-medium transition-all duration-200 ${
                viewMode === "list"
                  ? "bg-primary text-white"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              <List size={24} />
              List
            </button>
          </div>
        </div>

        {/* Shifts Grid/List */}
        <div
          className={cn(
            "gap-6 mb-6",
            viewMode === "grid"
              ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
              : "flex flex-col"
          )}
        >
          {paginatedShifts.map((shift) => {
            const statusInfo = getStatusInfo(shift.status);
            return (
              <Card
                onClick={() => setSelectedShift(shift)}
                key={shift._id}
                className={cn(
                  "overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer group border-0 shadow-lg",
                  viewMode === "list" && "flex-row"
                )}
              >
                <CardContent
                  className={cn("p-0", viewMode === "list" && "flex w-full")}
                >
                  {/* <div
                    className={cn(
                      statusInfo.bg,
                      viewMode === "grid" ? "h-2 w-full" : "w-2 h-full"
                    )}
                  /> */}

                  <div
                    className={cn(
                      "p-5",
                      viewMode === "list" && "flex-1 flex items-center gap-6"
                    )}
                  >
                    <div
                      className={cn(
                        "space-y-3",
                        viewMode === "list" &&
                          "flex-1 space-y-0 flex items-center gap-6"
                      )}
                    >
                      <div className={cn(viewMode === "list" && "flex-1")}>
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="font-montserrat-semibold text-gray-900 text-lg group-hover:text-primary transition-colors">
                            {shift.serviceTypeId?.name || "Unknown Service"}
                          </h3>
                          {viewMode === "grid" && (
                            <Badge
                              className={cn(
                                "gap-1",
                                statusInfo.lightBg,
                                statusInfo.color
                              )}
                            >
                              {statusInfo.icon}
                              {shift.status}
                            </Badge>
                          )}
                        </div>
                        <code className="text-xs text-gray-1000 bg-gray-100 px-2 py-1 font-montserrat-semibold rounded">
                          {shift.shiftId}
                        </code>
                      </div>

                      <div
                        className={cn(
                          "space-y-2",
                          viewMode === "list" && "min-w-[200px]"
                        )}
                      >
                        <div className="flex items-center gap-2 text-sm">
                          <Calendar className="w-4 h-4 text-gray-400" />
                          <span className="font-medium text-gray-900">
                            {formatDate(shift.startTime)}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <ClockCircle className="w-4 h-4 text-gray-400" />
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
                        className={cn(viewMode === "list" && "min-w-[250px]")}
                      >
                        {renderWorkerInfo(shift)}
                      </div>

                      {shift.address && (
                        <div className="flex items-start gap-2 text-sm text-gray-600">
                          <MapPoint className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                          <span className="line-clamp-2">{shift.address}</span>
                        </div>
                      )}

                      <div className="flex items-center gap-2 flex-wrap">
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
                        <div className="flex items-center gap-2">
                          <Badge
                            className={cn(
                              "gap-1",
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
                        "flex items-center justify-end pt-3 border-t border-gray-100",
                        viewMode === "list" && "pt-0 border-t-0"
                      )}
                    >
                      <Button
                        onClick={() => setSelectedShift(shift)}
                        variant="default"
                        size="sm"
                        className="gap-2 rounded-full font-montserrat-semibold"
                      >
                        {viewMode === "grid" ? (
                          <>
                            <Eye size={24} />
                            View Details
                          </>
                        ) : (
                          <ArrowRightUp size={24} />
                        )}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {paginatedShifts.length === 0 && (
          <Card className="border-0 shadow-lg">
            <CardContent className="p-12 text-center">
              <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-montserrat-semibold text-gray-900 mb-2">
                No shifts found
              </h3>
              <p className="text-gray-600 max-w-md mx-auto">
                {searchQuery || statusFilter !== "all"
                  ? "Try adjusting your filters to see more results."
                  : "You don't have any shifts scheduled yet."}
              </p>
            </CardContent>
          </Card>
        )}

        {filteredShifts.length > 0 && (
          <Card className="border-0 shadow-lg mt-6">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <p className="text-sm text-gray-600">
                    Showing{" "}
                    <span className="font-medium">
                      {Math.min(itemsPerPage, paginatedShifts.length)}
                    </span>{" "}
                    of{" "}
                    <span className="font-medium">{filteredShifts.length}</span>{" "}
                    shifts
                  </p>

                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-600">Show:</span>
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
                  <div className="flex items-center gap-2">
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
            </CardContent>
          </Card>
        )}

        {/* Shift Details Dialog */}
        <ShiftDetailsDialog
          shift={selectedShift}
          open={!!selectedShift}
          onOpenChange={(open) => !open && setSelectedShift(null)}
        />
      </div>
    </div>
  );
};

export default ParticipantShifts;
