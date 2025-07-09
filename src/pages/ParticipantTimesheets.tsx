import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { format } from "date-fns";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "@/components/ui/calendar";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Search,
  Filter,
  Calendar as CalendarIcon,
  Eye,
  Clock,
  DollarSign,
  Receipt,
  RefreshCw,
  Building,
  ChevronDown,
  Users,
  FileText,
} from "lucide-react";
import { cn } from "@/lib/utils";

// Import our types, hooks, and auth context
import { useAuth } from "@/contexts/AuthContext";
import { useGetParticipantTimesheets } from "@/hooks/useTimesheetHooks";
import {
  TimesheetClientFilters,
  Timesheet,
  SERVICE_TYPE_LABELS,
  TIMESHEET_STATUS_CONFIG,
} from "@/entities/Timesheet";

const ParticipantTimesheets: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  // Filter states (simplified for participant view)
  const [filters, setFilters] = useState<
    Omit<TimesheetClientFilters, "participantId">
  >({
    page: 1,
    limit: 20,
    sortField: "createdAt",
    sortDirection: "desc",
  });
  const [showFilters, setShowFilters] = useState(false);
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);

  // API call - using participant-specific hook
  const {
    data: timesheetData,
    isLoading,
    error,
  } = useGetParticipantTimesheets(user?._id || "", filters, !!user?._id);

  // Helper functions
  const formatTime = (dateString: string) =>
    format(new Date(dateString), "h:mm a");
  const formatDate = (dateString: string) =>
    format(new Date(dateString), "MMM d, yyyy");
  const formatDateShort = (dateString: string) =>
    format(new Date(dateString), "d MMM yyyy");
  const getFullName = (user: { firstName: string; lastName: string }) =>
    `${user.firstName} ${user.lastName}`;

  const formatDuration = (startTime: string, endTime: string) => {
    const start = new Date(startTime);
    const end = new Date(endTime);
    const diffMs = end.getTime() - start.getTime();
    const diffHrs = Math.floor(diffMs / (1000 * 60 * 60));
    const diffMins = Math.round((diffMs % (1000 * 60 * 60)) / (1000 * 60));
    return diffHrs
      ? `${diffHrs}h${diffMins ? ` ${diffMins}m` : ""}`
      : `${diffMins}m`;
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
    }).format(amount);
  };

  // Filter change handlers
  const handleFilterChange = (
    key: keyof Omit<TimesheetClientFilters, "participantId">,
    value: string | undefined
  ) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value === "all" || value === "" ? undefined : value,
      page: 1, // Reset to first page when filters change
    }));
  };

  const handleSearchChange = (value: string) => {
    setFilters((prev) => ({
      ...prev,
      search: value || undefined,
      page: 1,
    }));
  };

  const handleDateFilterChange = () => {
    setFilters((prev) => ({
      ...prev,
      startDate: startDate?.toISOString().split("T")[0],
      endDate: endDate?.toISOString().split("T")[0],
      page: 1,
    }));
  };

  const handleSortChange = (field: string) => {
    const newDirection =
      filters.sortField === field && filters.sortDirection === "asc"
        ? "desc"
        : "asc";
    setFilters((prev) => ({
      ...prev,
      sortField: field as "createdAt" | "scheduledStartTime" | "totalAmount",
      sortDirection: newDirection,
    }));
  };

  const handlePageChange = (page: number) => {
    setFilters((prev) => ({ ...prev, page }));
  };

  const handleViewTimesheet = (id: string) => {
    navigate(`/participant/timesheets/${id}`);
  };

  const handleResetFilters = () => {
    setFilters({
      page: 1,
      limit: 20,
      sortField: "createdAt",
      sortDirection: "desc",
    });
    setStartDate(null);
    setEndDate(null);
  };

  // Check if any filters are active
  const hasActiveFilters =
    filters.status || filters.search || filters.startDate || filters.endDate;

  // Status badge component
  const getStatusBadge = (status: string, isPaid: boolean) => {
    if (isPaid) {
      return (
        <Badge
          variant="default"
          className="bg-green-100 text-green-800 border-green-200"
        >
          Paid
        </Badge>
      );
    }

    const config =
      TIMESHEET_STATUS_CONFIG[status as keyof typeof TIMESHEET_STATUS_CONFIG];
    if (!config) {
      return (
        <Badge variant="outline" className="bg-gray-100 text-gray-800">
          {status}
        </Badge>
      );
    }

    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  // Pagination component
  const PaginationControls = () => {
    if (!timesheetData?.pagination) return null;

    const { page, totalPages, hasMore } = timesheetData.pagination;
    const maxVisiblePages = 5;
    const startPage = Math.max(1, page - Math.floor(maxVisiblePages / 2));
    const endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    return (
      <div className="flex items-center justify-between px-2">
        <div className="text-sm text-muted-foreground">
          Showing {(page - 1) * filters.limit! + 1} to{" "}
          {Math.min(
            page * filters.limit!,
            timesheetData.pagination.totalResults
          )}{" "}
          of {timesheetData.pagination.totalResults} timesheets
        </div>

        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePageChange(page - 1)}
            disabled={page <= 1}
          >
            Previous
          </Button>

          {Array.from(
            { length: endPage - startPage + 1 },
            (_, i) => startPage + i
          ).map((pageNum) => (
            <Button
              key={pageNum}
              variant={pageNum === page ? "default" : "outline"}
              size="sm"
              onClick={() => handlePageChange(pageNum)}
            >
              {pageNum}
            </Button>
          ))}

          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePageChange(page + 1)}
            disabled={!hasMore}
          >
            Next
          </Button>
        </div>
      </div>
    );
  };

  if (error) {
    return (
      <div className="p-6">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center text-red-500">
              Error loading timesheets. Please try again.
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-guardian">
            My Timesheets
          </h1>
          <p className="text-muted-foreground">
            View your completed shifts and payment details
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            onClick={() => setShowFilters(!showFilters)}
            className={cn(
              "border-guardian/20 hover:bg-guardian/10 hover:border-guardian/40",
              showFilters && "bg-guardian/10 border-guardian/40"
            )}
          >
            <Filter className="h-4 w-4 mr-2 text-guardian" />
            <span className="text-guardian">Filters</span>
            <ChevronDown
              className={`h-4 w-4 ml-2 transition-transform text-guardian ${
                showFilters ? "rotate-180" : ""
              }`}
            />
          </Button>
          {hasActiveFilters && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleResetFilters}
              className="text-guardian hover:bg-guardian/10"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Reset
            </Button>
          )}
        </div>
      </div>

      {/* Summary Cards */}
      {timesheetData?.summary && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Total Timesheets Card */}
          <Card className="group relative overflow-hidden border-0 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 hover:shadow-xl hover:shadow-blue-100/50 transition-all duration-300 hover:-translate-y-1">
            <div className="absolute inset-0 bg-gradient-to-br from-guardian/5 via-indigo-500/5 to-purple-500/5"></div>
            <CardContent className="relative p-6">
              <div className="flex items-start justify-between">
                <div className="space-y-3">
                  <div className="inline-flex p-3 rounded-xl bg-gradient-to-r from-guardian to-indigo-600 shadow-lg shadow-blue-500/25">
                    <FileText className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <p className="text-3xl font-bold bg-gradient-to-r from-guardian to-indigo-600 bg-clip-text text-transparent">
                      {timesheetData.summary.totalTimesheets}
                    </p>
                    <p className="text-sm font-medium text-slate-600">
                      Total Timesheets
                    </p>
                  </div>
                </div>
                  <div className="h-12 w-12 rounded-full bg-gradient-to-r from-guardian/10 to-indigo-500/10 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <span className="text-lg font-bold text-guardian">
                    {timesheetData.summary.totalTimesheets > 999
                      ? "999+"
                      : timesheetData.summary.totalTimesheets}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Total Hours Card */}
          <Card className="group relative overflow-hidden border-0 bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50 hover:shadow-xl hover:shadow-emerald-100/50 transition-all duration-300 hover:-translate-y-1">
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 via-green-500/5 to-teal-500/5"></div>
            <CardContent className="relative p-6">
              <div className="flex items-start justify-between">
                <div className="space-y-3">
                  <div className="inline-flex p-3 rounded-xl bg-gradient-to-r from-emerald-500 to-green-600 shadow-lg shadow-emerald-500/25">
                    <Clock className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <p className="text-3xl font-bold bg-gradient-to-r from-emerald-600 to-green-600 bg-clip-text text-transparent">
                      {Math.round(timesheetData.summary.totalHours)}
                    </p>
                    <p className="text-sm font-medium text-slate-600">
                      Total Hours
                    </p>
                  </div>
                </div>
                <div className="flex flex-col items-center space-y-1">
                  <div className="h-8 w-8 rounded-full bg-gradient-to-r from-emerald-500/20 to-green-500/20 flex items-center justify-center">
                    <div className="h-3 w-3 rounded-full bg-gradient-to-r from-emerald-500 to-green-600 animate-pulse"></div>
                  </div>
                  <span className="text-xs font-medium text-emerald-600">
                    Active
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Total Amount Card */}
          <Card className="group relative overflow-hidden border-0 bg-gradient-to-br from-amber-50 via-yellow-50 to-orange-50 hover:shadow-xl hover:shadow-amber-100/50 transition-all duration-300 hover:-translate-y-1">
            <div className="absolute inset-0 bg-gradient-to-br from-amber-500/5 via-yellow-500/5 to-orange-500/5"></div>
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-amber-200/20 to-transparent rounded-full -translate-y-16 translate-x-16"></div>
            <CardContent className="relative p-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="inline-flex p-3 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 shadow-lg shadow-amber-500/25">
                    <DollarSign className="h-6 w-6 text-white" />
                  </div>
                  <div className="flex items-center space-x-1 px-3 py-1 rounded-full bg-gradient-to-r from-amber-100 to-yellow-100">
                    <div className="h-2 w-2 rounded-full bg-amber-500"></div>
                    <span className="text-xs font-medium text-amber-700">
                      Earned
                    </span>
                  </div>
                </div>
                <div>
                  <p className="text-2xl font-bold bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">
                    {formatCurrency(timesheetData.summary.totalAmount)}
                  </p>
                  <p className="text-sm font-medium text-slate-600">
                    Total Amount
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Pending Review Card */}
          <Card className="group relative overflow-hidden border-0 bg-gradient-to-br from-rose-50 via-pink-50 to-orange-50 hover:shadow-xl hover:shadow-rose-100/50 transition-all duration-300 hover:-translate-y-1">
            <div className="absolute inset-0 bg-gradient-to-br from-rose-500/5 via-pink-500/5 to-orange-500/5"></div>
            <CardContent className="relative p-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="inline-flex p-3 rounded-xl bg-gradient-to-r from-rose-500 to-pink-500 shadow-lg shadow-rose-500/25">
                    <Users className="h-6 w-6 text-white" />
                  </div>
                  {timesheetData.summary.pendingCount > 0 && (
                    <div className="relative">
                      <div className="h-3 w-3 rounded-full bg-rose-500 animate-ping absolute"></div>
                      <div className="h-3 w-3 rounded-full bg-rose-500"></div>
                    </div>
                  )}
                </div>
                <div>
                  <div className="flex items-baseline space-x-2">
                    <p className="text-3xl font-bold bg-gradient-to-r from-rose-600 to-pink-600 bg-clip-text text-transparent">
                      {timesheetData.summary.pendingCount}
                    </p>
                    <span className="text-sm font-medium text-slate-500">
                      / {timesheetData.summary.totalTimesheets}
                    </span>
                  </div>
                  <p className="text-sm font-medium text-slate-600">
                    Pending Review
                  </p>
                </div>
                {timesheetData.summary.pendingCount > 0 && (
                  <div className="w-full bg-rose-100 rounded-full h-2">
                    <div
                      className="bg-gradient-to-r from-rose-500 to-pink-500 h-2 rounded-full transition-all duration-1000 ease-out"
                      style={{
                        width: `${
                          (timesheetData.summary.pendingCount /
                            timesheetData.summary.totalTimesheets) *
                          100
                        }%`,
                      }}
                    ></div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Search Bar */}
      <div className="flex items-center space-x-4">
        <div className="flex-1 max-w-md">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by worker or shift ID..."
              value={filters.search || ""}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="pl-10 border-guardian/20 focus:border-guardian/40"
            />
          </div>
        </div>
      </div>

      {/* Filters */}
      {showFilters && (
        <Card className="border-guardian/10">
          <CardHeader>
            <CardTitle className="text-lg text-guardian">Filters</CardTitle>
            <CardDescription>
              Filter your timesheets by various criteria
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* Status filter */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Status</label>
                <Select
                  value={filters.status || "all"}
                  onValueChange={(value) => handleFilterChange("status", value)}
                >
                  <SelectTrigger className="border-guardian/20 focus:border-guardian/40">
                    <SelectValue placeholder="All statuses" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Statuses</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="approved">Approved</SelectItem>
                    <SelectItem value="rejected">Rejected</SelectItem>
                    <SelectItem value="revised">Revised</SelectItem>
                    <SelectItem value="processed">Processed</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Date filters */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Start Date</label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal border-guardian/20 hover:bg-guardian/10 hover:border-guardian/40",
                        !startDate && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {startDate ? format(startDate, "PP") : "Pick start date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={startDate || undefined}
                      onSelect={(date) => {
                        setStartDate(date || null);
                        if (date) handleDateFilterChange();
                      }}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">End Date</label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal border-guardian/20 hover:bg-guardian/10 hover:border-guardian/40",
                        !endDate && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {endDate ? format(endDate, "PP") : "Pick end date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={endDate || undefined}
                      onSelect={(date) => {
                        setEndDate(date || null);
                        if (date) handleDateFilterChange();
                      }}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>

            {/* Filter Actions */}
            <div className="flex items-center justify-between mt-6 pt-4 border-t border-guardian/10">
              <div className="text-sm text-muted-foreground">
                {hasActiveFilters && <span>Filters applied</span>}
              </div>
              <Button
                variant="outline"
                onClick={handleResetFilters}
                className="border-guardian/20 hover:bg-guardian/10 hover:border-guardian/40 text-guardian"
              >
                Clear All Filters
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Table */}
      <Card className="border-guardian/10">
        <CardContent className="p-0">
          {isLoading ? (
            <div className="p-6">
              <div className="space-y-4">
                {Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="flex space-x-4">
                    <Skeleton className="h-12 w-12 rounded-full" />
                    <div className="space-y-2 flex-1">
                      <Skeleton className="h-4 w-1/4" />
                      <Skeleton className="h-4 w-1/2" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[200px]">Shift Reference</TableHead>
                    <TableHead
                      className="cursor-pointer hover:bg-muted/50"
                      onClick={() => handleSortChange("scheduledStartTime")}
                    >
                      <div className="flex items-center space-x-1">
                        <span>Date & Hours</span>
                        {filters.sortField === "scheduledStartTime" && (
                          <ChevronDown
                            className={`h-4 w-4 ${
                              filters.sortDirection === "asc"
                                ? "rotate-180"
                                : ""
                            }`}
                          />
                        )}
                      </div>
                    </TableHead>
                    <TableHead>Worker</TableHead>
                    <TableHead>Expenses</TableHead>
                    <TableHead
                      className="cursor-pointer hover:bg-muted/50"
                      onClick={() => handleSortChange("totalAmount")}
                    >
                      <div className="flex items-center space-x-1">
                        <span>Total</span>
                        {filters.sortField === "totalAmount" && (
                          <ChevronDown
                            className={`h-4 w-4 ${
                              filters.sortDirection === "asc"
                                ? "rotate-180"
                                : ""
                            }`}
                          />
                        )}
                      </div>
                    </TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {timesheetData?.timesheets?.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="h-24 text-center">
                        <div className="flex flex-col items-center space-y-2">
                          <FileText className="h-12 w-12 text-muted-foreground" />
                          <h3 className="text-lg font-medium">
                            No timesheets found
                          </h3>
                          <p className="text-muted-foreground">
                            {hasActiveFilters
                              ? "Try adjusting your filters to see more results."
                              : "No timesheets have been submitted for your shifts yet."}
                          </p>
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : (
                    timesheetData?.timesheets?.map((timesheet: Timesheet) => (
                      <TableRow
                        key={timesheet._id}
                        className="hover:bg-guardian/5"
                      >
                        <TableCell className="font-medium">
                          <div className="flex flex-col">
                            <span className="font-mono text-guardian">
                              {timesheet.shiftIdRef}
                            </span>
                            <span className="text-xs text-muted-foreground capitalize">
                              {SERVICE_TYPE_LABELS[
                                timesheet.shiftId.serviceType
                              ] || timesheet.shiftId.serviceType}
                            </span>
                            <span className="text-xs text-muted-foreground">
                              <Building className="h-3 w-3 inline mr-1" />
                              {timesheet.organizationId.name}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-col">
                            <span className="font-medium">
                              {formatDateShort(timesheet.scheduledStartTime)}
                            </span>
                            <div className="flex items-center gap-1 mt-1 text-muted-foreground text-xs">
                              <Clock className="h-3 w-3" />
                              <span>
                                {formatTime(timesheet.actualStartTime)} -{" "}
                                {formatTime(timesheet.actualEndTime)}
                              </span>
                            </div>
                            <div className="flex items-center gap-1 text-xs">
                              <span>
                                {formatDuration(
                                  timesheet.actualStartTime,
                                  timesheet.actualEndTime
                                )}
                              </span>
                              {timesheet.extraTime > 0 && (
                                <span className="text-guardian ml-1">
                                  (+{timesheet.extraTime}m extra)
                                </span>
                              )}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            {typeof timesheet.workerId === "object" &&
                            timesheet.workerId.profileImage ? (
                              <div className="w-8 h-8 rounded-full overflow-hidden">
                                <img
                                  src={timesheet.workerId.profileImage}
                                  alt={
                                    typeof timesheet.workerId === "object"
                                      ? getFullName(timesheet.workerId)
                                      : "Worker"
                                  }
                                  className="w-full h-full object-cover"
                                />
                              </div>
                            ) : (
                              <div className="w-8 h-8 rounded-full bg-guardian/10 flex items-center justify-center text-guardian text-sm font-medium">
                                {typeof timesheet.workerId === "object"
                                  ? timesheet.workerId.firstName.charAt(0) +
                                    timesheet.workerId.lastName.charAt(0)
                                  : "W"}
                              </div>
                            )}
                            <div className="flex flex-col">
                              <span className="font-medium">
                                {typeof timesheet.workerId === "object"
                                  ? getFullName(timesheet.workerId)
                                  : timesheet.workerId}
                              </span>
                              <span className="text-xs text-muted-foreground">
                                {typeof timesheet.workerId === "object"
                                  ? timesheet.workerId.email
                                  : "Email not available"}
                              </span>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-col">
                            <div className="font-medium flex items-center">
                              <Receipt className="h-3 w-3 mr-1 text-guardian" />
                              {formatCurrency(timesheet.totalExpenses)}
                            </div>
                            <span className="text-xs text-muted-foreground">
                              {timesheet.expenses.length} item
                              {timesheet.expenses.length !== 1 ? "s" : ""}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="font-medium text-green-700">
                            {formatCurrency(timesheet.totalAmount)}
                          </div>
                        </TableCell>
                        <TableCell>
                          {getStatusBadge(timesheet.status, timesheet.isPaid)}
                        </TableCell>
                        <TableCell className="text-right">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleViewTimesheet(timesheet._id)}
                            className="text-guardian hover:bg-guardian/10"
                          >
                            <Eye className="h-4 w-4 mr-2" />
                            View
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>

              {/* Pagination */}
              {timesheetData?.timesheets &&
                timesheetData.timesheets.length > 0 && (
                  <div className="border-t border-guardian/10 p-4">
                    <PaginationControls />
                  </div>
                )}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ParticipantTimesheets;
