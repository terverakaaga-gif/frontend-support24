import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import {
  Calendar,
  Clock,
  MapPin,
  User,
  Filter,
  Search,
  ChevronDown,
  MoreVertical,
  CheckCircle,
  AlertCircle,
  XCircle,
  Eye,
  Users,
  Repeat,
  TrendingUp,
  Activity,
  CalendarCheck,
  PlayCircle,
  Ban,
  CalendarDays,
  ArrowUpDown,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import shiftService from "@/api/services/shiftService";
import { Shift, ShiftStatus, ServiceType } from "@/entities/Shift";
import { format, parseISO, isToday, isTomorrow, isThisWeek } from "date-fns";

const ParticipantShifts = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [serviceTypeFilter, setServiceTypeFilter] = useState<string>("all");
  const [sortField, setSortField] = useState<string>("startTime");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Fetch shifts data
  const {
    data: shifts = [],
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["participant-shifts"],
    queryFn: () => shiftService.getShifts(),
  });

  // Filter shifts based on search and filters
  const filteredShifts = shifts.filter((shift) => {
    const matchesSearch =
      searchTerm === "" ||
      shift.shiftId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (shift.workerId &&
        typeof shift.workerId === "object" &&
        `${shift.workerId.firstName} ${shift.workerId.lastName}`
          .toLowerCase()
          .includes(searchTerm.toLowerCase())) ||
      (shift.workerId &&
        typeof shift.workerId === "string" &&
        shift.workerId.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (shift.workerAssignments &&
        shift.workerAssignments.some((assignment) =>
          `${assignment.workerId.firstName} ${assignment.workerId.lastName}`
            .toLowerCase()
            .includes(searchTerm.toLowerCase())
        ));

    const matchesStatus =
      statusFilter === "all" || shift.status === statusFilter;

    const matchesServiceType =
      serviceTypeFilter === "all" || shift.serviceType === serviceTypeFilter;

    return matchesSearch && matchesStatus && matchesServiceType;
  });

  // Sort shifts
  const sortedShifts = [...filteredShifts].sort((a, b) => {
    let aValue: string | Date;
    let bValue: string | Date;

    switch (sortField) {
      case "startTime":
        aValue = new Date(a.startTime);
        bValue = new Date(b.startTime);
        break;
      case "serviceType":
        aValue = a.serviceType;
        bValue = b.serviceType;
        break;
      case "status":
        aValue = a.status;
        bValue = b.status;
        break;
      case "worker":
        aValue = a.workerId
          ? typeof a.workerId === "string"
            ? a.workerId
            : `${a.workerId.firstName} ${a.workerId.lastName}`
          : "";
        bValue = b.workerId
          ? typeof b.workerId === "string"
            ? b.workerId
            : `${b.workerId.firstName} ${b.workerId.lastName}`
          : "";
        break;
      default:
        aValue = a.startTime;
        bValue = b.startTime;
    }

    if (aValue < bValue) return sortDirection === "asc" ? -1 : 1;
    if (aValue > bValue) return sortDirection === "asc" ? 1 : -1;
    return 0;
  });

  // Pagination
  const totalPages = Math.ceil(sortedShifts.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedShifts = sortedShifts.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  // Calculate stats
  const stats = {
    total: shifts.length,
    confirmed: shifts.filter((s) => s.status === ShiftStatus.CONFIRMED).length,
    pending: shifts.filter((s) => s.status === ShiftStatus.PENDING).length,
    completed: shifts.filter((s) => s.status === ShiftStatus.COMPLETED).length,
    inProgress: shifts.filter((s) => s.status === ShiftStatus.IN_PROGRESS)
      .length,
    cancelled: shifts.filter((s) => s.status === ShiftStatus.CANCELLED).length,
    thisWeek: shifts.filter((s) => isThisWeek(parseISO(s.startTime))).length,
    upcoming: shifts.filter((s) => parseISO(s.startTime) > new Date()).length,
  };

  // Get status badge variant and icon
  const getStatusInfo = (status: ShiftStatus) => {
    switch (status) {
      case ShiftStatus.CONFIRMED:
        return {
          variant: "default" as const,
          icon: <CheckCircle className="w-3 h-3" />,
          color: "text-green-600",
          bg: "bg-green-50",
        };
      case ShiftStatus.PENDING:
        return {
          variant: "secondary" as const,
          icon: <AlertCircle className="w-3 h-3" />,
          color: "text-yellow-600",
          bg: "bg-yellow-50",
        };
      case ShiftStatus.IN_PROGRESS:
        return {
          variant: "default" as const,
          icon: <Clock className="w-3 h-3" />,
          color: "text-blue-600",
          bg: "bg-blue-50",
        };
      case ShiftStatus.COMPLETED:
        return {
          variant: "outline" as const,
          icon: <CheckCircle className="w-3 h-3" />,
          color: "text-gray-600",
          bg: "bg-gray-50",
        };
      case ShiftStatus.CANCELLED:
        return {
          variant: "destructive" as const,
          icon: <XCircle className="w-3 h-3" />,
          color: "text-red-600",
          bg: "bg-red-50",
        };
      default:
        return {
          variant: "secondary" as const,
          icon: <AlertCircle className="w-3 h-3" />,
          color: "text-gray-600",
          bg: "bg-gray-50",
        };
    }
  };

  // Format service type for display
  const formatServiceType = (serviceType: ServiceType) => {
    return serviceType
      .replace(/([A-Z])/g, " $1")
      .replace(/^./, (str) => str.toUpperCase())
      .trim();
  };

  // Format date for display
  const formatShiftDate = (dateString: string) => {
    const date = parseISO(dateString);
    if (isToday(date)) return "Today";
    if (isTomorrow(date)) return "Tomorrow";
    if (isThisWeek(date)) return format(date, "EEEE");
    return format(date, "MMM dd, yyyy");
  };

  // Get shift duration
  const getShiftDuration = (startTime: string, endTime: string) => {
    const start = parseISO(startTime);
    const end = parseISO(endTime);
    const diffInMinutes = (end.getTime() - start.getTime()) / (1000 * 60);
    const hours = Math.floor(diffInMinutes / 60);
    const minutes = diffInMinutes % 60;

    if (hours === 0) return `${minutes}m`;
    if (minutes === 0) return `${hours}h`;
    return `${hours}h ${minutes}m`;
  };

  // Handle sorting
  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  // Render worker info
  const renderWorkerInfo = (shift: Shift) => {
    if (shift.isMultiWorkerShift && shift.workerAssignments) {
      return (
        <div className="flex items-center gap-2">
          <div className="flex -space-x-1">
            {shift.workerAssignments.slice(0, 2).map((assignment, index) => (
              <Avatar
                key={assignment._id}
                className="w-6 h-6 border-2 border-white"
              >
                <AvatarImage src={assignment.workerId.profileImage} />
                <AvatarFallback className="text-xs">
                  {assignment.workerId.firstName[0]}
                  {assignment.workerId.lastName[0]}
                </AvatarFallback>
              </Avatar>
            ))}
            {shift.workerAssignments.length > 2 && (
              <div className="w-6 h-6 rounded-full bg-gray-100 border-2 border-white flex items-center justify-center">
                <span className="text-xs text-gray-600">
                  +{shift.workerAssignments.length - 2}
                </span>
              </div>
            )}
          </div>
          <span className="text-sm text-gray-600">
            {shift.workerAssignments.length} workers
          </span>
        </div>
      );
    } else if (shift.workerId) {
      if (typeof shift.workerId === "string") {
        return (
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center">
              <User className="w-3 h-3 text-blue-600" />
            </div>
            <span className="text-sm text-gray-600">Assigned Worker</span>
          </div>
        );
      } else {
        return (
          <div className="flex items-center gap-2">
            <Avatar className="w-6 h-6">
              <AvatarImage src={shift.workerId.profileImage} />
              <AvatarFallback className="text-xs">
                {shift.workerId.firstName[0]}
                {shift.workerId.lastName[0]}
              </AvatarFallback>
            </Avatar>
            <span className="text-sm font-medium">
              {shift.workerId.firstName} {shift.workerId.lastName}
            </span>
          </div>
        );
      }
    } else {
      return (
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center">
            <User className="w-3 h-3 text-gray-400" />
          </div>
          <span className="text-sm text-gray-500">Unassigned</span>
        </div>
      );
    }
  };

  if (error) {
    return (
      <div className="p-6">
        <div className="text-center py-12">
          <XCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Failed to load shifts
          </h3>
          <p className="text-gray-600 mb-4">
            There was an error loading your shifts. Please try again.
          </p>
          <Button onClick={() => refetch()}>Try Again</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-8">
      {/* Enhanced Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="space-y-1">
          <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
            My Shifts
          </h1>
          <p className="text-lg text-gray-600">
            Manage your care schedule and track upcoming appointments
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Badge variant="outline" className="px-4 py-2 text-sm font-medium">
            <Activity className="w-4 h-4 mr-2" />
            {filteredShifts.length} shifts
          </Badge>
        </div>
      </div>

      {/* Enhanced Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total Shifts */}
        <Card className="relative overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300 group">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-blue-600/10" />
          <CardContent className="p-6 relative">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-sm font-medium text-blue-600">
                  Total Shifts
                </p>
                <p className="text-3xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                  {stats.total}
                </p>
                <p className="text-xs text-gray-500">All time</p>
              </div>
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <Calendar className="w-7 h-7 text-white" />
              </div>
            </div>
            <div className="mt-4 flex items-center gap-1 text-sm">
              <TrendingUp className="w-4 h-4 text-green-500" />
              <span className="text-green-600 font-medium">
                {stats.thisWeek} this week
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Upcoming Shifts */}
        <Card className="relative overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300 group">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-purple-600/10" />
          <CardContent className="p-6 relative">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-sm font-medium text-purple-600">Upcoming</p>
                <p className="text-3xl font-bold text-gray-900 group-hover:text-purple-600 transition-colors">
                  {stats.upcoming}
                </p>
                <p className="text-xs text-gray-500">Future shifts</p>
              </div>
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <CalendarDays className="w-7 h-7 text-white" />
              </div>
            </div>
            <div className="mt-4 flex items-center gap-1 text-sm">
              <Clock className="w-4 h-4 text-blue-500" />
              <span className="text-blue-600 font-medium">
                {stats.confirmed} confirmed
              </span>
            </div>
          </CardContent>
        </Card>

        {/* In Progress */}
        <Card className="relative overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300 group">
          <div className="absolute inset-0 bg-gradient-to-br from-orange-500/5 to-orange-600/10" />
          <CardContent className="p-6 relative">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-sm font-medium text-orange-600">
                  Active Now
                </p>
                <p className="text-3xl font-bold text-gray-900 group-hover:text-orange-600 transition-colors">
                  {stats.inProgress}
                </p>
                <p className="text-xs text-gray-500">In progress</p>
              </div>
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <PlayCircle className="w-7 h-7 text-white" />
              </div>
            </div>
            <div className="mt-4 flex items-center gap-1 text-sm">
              <Activity className="w-4 h-4 text-green-500" />
              <span className="text-green-600 font-medium">Live updates</span>
            </div>
          </CardContent>
        </Card>

        {/* Completion Rate */}
        <Card className="relative overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300 group">
          <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 to-green-600/10" />
          <CardContent className="p-6 relative">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-sm font-medium text-green-600">Completed</p>
                <p className="text-3xl font-bold text-gray-900 group-hover:text-green-600 transition-colors">
                  {stats.completed}
                </p>
                <p className="text-xs text-gray-500">
                  {stats.total > 0
                    ? Math.round((stats.completed / stats.total) * 100)
                    : 0}
                  % completion rate
                </p>
              </div>
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <CalendarCheck className="w-7 h-7 text-white" />
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

      {/* Enhanced Filters and Search */}
      <Card className="border-0 shadow-lg">
        <CardContent className="p-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-center">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search by shift ID or worker name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 h-11"
              />
            </div>

            {/* Status Filter */}
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full md:w-48 h-11">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="confirmed">Confirmed</SelectItem>
                <SelectItem value="inProgress">In Progress</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>

            {/* Service Type Filter */}
            <Select
              value={serviceTypeFilter}
              onValueChange={setServiceTypeFilter}
            >
              <SelectTrigger className="w-full md:w-48 h-11">
                <SelectValue placeholder="Filter by service" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Services</SelectItem>
                <SelectItem value="personalCare">Personal Care</SelectItem>
                <SelectItem value="householdTasks">Household Tasks</SelectItem>
                <SelectItem value="socialSupport">Social Support</SelectItem>
                <SelectItem value="transport">Transport</SelectItem>
                <SelectItem value="mealPreparation">
                  Meal Preparation
                </SelectItem>
                <SelectItem value="medicationSupport">
                  Medication Support
                </SelectItem>
                <SelectItem value="mobilityAssistance">
                  Mobility Assistance
                </SelectItem>
                <SelectItem value="therapySupport">Therapy Support</SelectItem>
                <SelectItem value="behaviorSupport">
                  Behavior Support
                </SelectItem>
                <SelectItem value="communityAccess">
                  Community Access
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Modern Table */}
      <Card className="border-0 shadow-lg overflow-hidden">
        <CardContent className="p-0">
          {isLoading ? (
            <div className="p-6">
              <div className="space-y-4">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="flex items-center gap-4">
                    <Skeleton className="w-8 h-8 rounded-full" />
                    <Skeleton className="h-4 flex-1" />
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-4 w-20" />
                  </div>
                ))}
              </div>
            </div>
          ) : filteredShifts.length === 0 ? (
            <div className="p-12 text-center">
              <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                No shifts found
              </h3>
              <p className="text-gray-600 max-w-md mx-auto">
                {searchTerm ||
                statusFilter !== "all" ||
                serviceTypeFilter !== "all"
                  ? "Try adjusting your filters to see more results."
                  : "You don't have any shifts scheduled yet. Contact your support coordinator to schedule your first shift."}
              </p>
            </div>
          ) : (
            <div>
              <Table>
                <TableHeader className="bg-gray-50/50">
                  <TableRow className="border-b border-gray-200">
                    <TableHead className="font-semibold text-gray-700">
                      <Button
                        variant="ghost"
                        onClick={() => handleSort("serviceType")}
                        className="h-auto p-0 font-semibold text-gray-700 hover:text-gray-900"
                      >
                        Service
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                      </Button>
                    </TableHead>
                    <TableHead className="font-semibold text-gray-700">
                      <Button
                        variant="ghost"
                        onClick={() => handleSort("worker")}
                        className="h-auto p-0 font-semibold text-gray-700 hover:text-gray-900"
                      >
                        Worker
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                      </Button>
                    </TableHead>
                    <TableHead className="font-semibold text-gray-700">
                      <Button
                        variant="ghost"
                        onClick={() => handleSort("startTime")}
                        className="h-auto p-0 font-semibold text-gray-700 hover:text-gray-900"
                      >
                        Date & Time
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                      </Button>
                    </TableHead>
                    <TableHead className="font-semibold text-gray-700">
                      Duration
                    </TableHead>
                    <TableHead className="font-semibold text-gray-700">
                      Location
                    </TableHead>
                    <TableHead className="font-semibold text-gray-700">
                      <Button
                        variant="ghost"
                        onClick={() => handleSort("status")}
                        className="h-auto p-0 font-semibold text-gray-700 hover:text-gray-900"
                      >
                        Status
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                      </Button>
                    </TableHead>
                    <TableHead className="w-12"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedShifts.map((shift) => {
                    const statusInfo = getStatusInfo(shift.status);
                    return (
                      <TableRow
                        key={shift._id}
                        className="hover:bg-gray-50/50 transition-colors cursor-pointer border-b border-gray-100"
                        onClick={() =>
                          navigate(`/participant/shifts/${shift._id}`)
                        }
                      >
                        <TableCell className="py-4">
                          <div className="space-y-1">
                            <div className="font-medium text-gray-900">
                              {formatServiceType(shift.serviceType)}
                            </div>
                            <div className="flex items-center gap-2">
                              <code className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                                {shift.shiftId}
                              </code>
                              {shift.recurrence?.pattern !== "none" && (
                                <Badge variant="outline" className="text-xs">
                                  <Repeat className="w-3 h-3 mr-1" />
                                  Recurring
                                </Badge>
                              )}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="py-4">
                          {renderWorkerInfo(shift)}
                        </TableCell>
                        <TableCell className="py-4">
                          <div className="space-y-1">
                            <div className="font-medium text-gray-900">
                              {formatShiftDate(shift.startTime)}
                            </div>
                            <div className="text-sm text-gray-600">
                              {format(parseISO(shift.startTime), "h:mm a")} -{" "}
                              {format(parseISO(shift.endTime), "h:mm a")}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="py-4">
                          <span className="text-sm font-medium text-gray-600">
                            {getShiftDuration(shift.startTime, shift.endTime)}
                          </span>
                        </TableCell>
                        <TableCell className="py-4">
                          <div className="max-w-xs">
                            <span className="text-sm text-gray-600 line-clamp-2">
                              {shift.address || "Location not specified"}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell className="py-4">
                          <Badge
                            variant={statusInfo.variant}
                            className={cn(
                              "gap-1 font-medium",
                              statusInfo.bg,
                              statusInfo.color
                            )}
                          >
                            {statusInfo.icon}
                            {shift.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="py-4">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-8 w-8 p-0 hover:bg-gray-100"
                                onClick={(e) => e.stopPropagation()}
                              >
                                <MoreVertical className="w-4 h-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem
                                onClick={(e) => {
                                  e.stopPropagation();
                                  navigate(`/participant/shifts/${shift._id}`);
                                }}
                              >
                                <Eye className="w-4 h-4 mr-2" />
                                View Details
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-between px-6 py-4 border-t border-gray-200 bg-gray-50/30">
                  <div className="text-sm text-gray-600">
                    Showing {startIndex + 1} to{" "}
                    {Math.min(startIndex + itemsPerPage, filteredShifts.length)}{" "}
                    of {filteredShifts.length} shifts
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage(currentPage - 1)}
                      disabled={currentPage === 1}
                      className="h-8"
                    >
                      <ChevronLeft className="w-4 h-4" />
                      Previous
                    </Button>
                    <div className="flex items-center gap-1">
                      {Array.from(
                        { length: Math.min(5, totalPages) },
                        (_, i) => {
                          const page = i + 1;
                          return (
                            <Button
                              key={page}
                              variant={
                                currentPage === page ? "default" : "outline"
                              }
                              size="sm"
                              onClick={() => setCurrentPage(page)}
                              className="h-8 w-8"
                            >
                              {page}
                            </Button>
                          );
                        }
                      )}
                      {totalPages > 5 && (
                        <>
                          <span className="text-gray-400">...</span>
                          <Button
                            variant={
                              currentPage === totalPages ? "default" : "outline"
                            }
                            size="sm"
                            onClick={() => setCurrentPage(totalPages)}
                            className="h-8 w-8"
                          >
                            {totalPages}
                          </Button>
                        </>
                      )}
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage(currentPage + 1)}
                      disabled={currentPage === totalPages}
                      className="h-8"
                    >
                      Next
                      <ChevronRight className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ParticipantShifts;
