// pages/admin/TimesheetsManagement.tsx
import React, { useState, useMemo } from "react";
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

// Import our types and hooks
import { useGetTimesheets } from "@/hooks/useTimesheetHooks";
import {
  TimesheetClientFilters,
  Timesheet,
  SERVICE_TYPE_LABELS,
  TIMESHEET_STATUS_CONFIG,
} from "@/entities/Timesheet";

const TimesheetsManagement: React.FC = () => {
  const navigate = useNavigate();

  // Filter states
  const [filters, setFilters] = useState<TimesheetClientFilters>({
    page: 1,
    limit: 20,
    sortField: "createdAt",
    sortDirection: "desc",
  });
  const [showFilters, setShowFilters] = useState(false);
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);

  // API call
  const { data: timesheetData, isLoading, error } = useGetTimesheets(filters);

  // Helper functions
  const formatTime = (dateString: string) =>
    format(new Date(dateString), "h:mm a");
  const formatDate = (dateString: string) =>
    format(new Date(dateString), "MMM d, yyyy");
  const formatDateShort = (dateString: string) =>
    format(new Date(dateString), "d MMM yyyy");
  const getFullName = (user: { firstName: string; lastName: string }) =>
    `${user.firstName} ${user.lastName}`;

  console.log("=== DEBUG INFO ===");
  console.log("Filters:", filters);
  console.log("Raw timesheetData:", timesheetData);
  console.log("Is Loading:", isLoading);
  console.log("Error:", error);
  console.log("timesheetData?.timesheets:", timesheetData?.timesheets);
  console.log("=================");

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
    key: keyof TimesheetClientFilters,
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
    navigate(`/admin/timesheets/${id}`);
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
    filters.status ||
    filters.participantId ||
    filters.search ||
    filters.startDate ||
    filters.endDate;

  // Get unique participants for filter dropdown
  const participants = useMemo(() => {
    if (!timesheetData?.timesheets) return [];
    const uniqueParticipants = new Map();
    timesheetData.timesheets.forEach((t) => {
      if (!uniqueParticipants.has(t.participantId._id)) {
        uniqueParticipants.set(t.participantId._id, {
          id: t.participantId._id,
          name: getFullName(t.participantId),
        });
      }
    });
    return Array.from(uniqueParticipants.values());
  }, [timesheetData?.timesheets]);

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
          <h1 className="text-3xl font-bold tracking-tight">
            Timesheet Management
          </h1>
          <p className="text-muted-foreground">
            View and manage worker timesheets and payments
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            onClick={() => setShowFilters(!showFilters)}
            className={showFilters ? "bg-muted" : ""}
          >
            <Filter className="h-4 w-4 mr-2" />
            Filters
            <ChevronDown
              className={`h-4 w-4 ml-2 transition-transform ${
                showFilters ? "rotate-180" : ""
              }`}
            />
          </Button>
          {hasActiveFilters && (
            <Button variant="ghost" size="sm" onClick={handleResetFilters}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Reset
            </Button>
          )}
        </div>
      </div>

      {/* Summary Cards */}
      {timesheetData?.summary && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center space-x-2">
                <FileText className="h-4 w-4 text-blue-500" />
                <div>
                  <p className="text-2xl font-bold">
                    {timesheetData.summary.totalTimesheets}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Total Timesheets
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center space-x-2">
                <Clock className="h-4 w-4 text-green-500" />
                <div>
                  <p className="text-2xl font-bold">
                    {Math.round(timesheetData.summary.totalHours)}
                  </p>
                  <p className="text-xs text-muted-foreground">Total Hours</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center space-x-2">
                <DollarSign className="h-4 w-4 text-yellow-500" />
                <div>
                  <p className="text-2xl font-bold">
                    {formatCurrency(timesheetData.summary.totalAmount)}
                  </p>
                  <p className="text-xs text-muted-foreground">Total Amount</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center space-x-2">
                <Users className="h-4 w-4 text-purple-500" />
                <div>
                  <p className="text-2xl font-bold">
                    {timesheetData.summary.pendingCount}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Pending Review
                  </p>
                </div>
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
              placeholder="Search by participant, worker, or shift ID..."
              value={filters.search || ""}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
      </div>

      {/* Filters */}
      {showFilters && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Filters</CardTitle>
            <CardDescription>
              Filter timesheets by various criteria
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {/* Status filter */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Status</label>
                <Select
                  value={filters.status || "all"}
                  onValueChange={(value) => handleFilterChange("status", value)}
                >
                  <SelectTrigger>
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

              {/* Participant filter */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Participant</label>
                <Select
                  value={filters.participantId || "all"}
                  onValueChange={(value) =>
                    handleFilterChange("participantId", value)
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="All participants" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Participants</SelectItem>
                    {participants.map((participant) => (
                      <SelectItem key={participant.id} value={participant.id}>
                        {participant.name}
                      </SelectItem>
                    ))}
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
                        "w-full justify-start text-left font-normal",
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
                        "w-full justify-start text-left font-normal",
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
            <div className="flex items-center justify-between mt-6 pt-4 border-t">
              <div className="text-sm text-muted-foreground">
                {hasActiveFilters && <span>Filters applied</span>}
              </div>
              <Button variant="outline" onClick={handleResetFilters}>
                Clear All Filters
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Table */}
      <Card>
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
                    <TableHead>Participant</TableHead>
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
                      <TableCell colSpan={8} className="h-24 text-center">
                        <div className="flex flex-col items-center space-y-2">
                          <FileText className="h-12 w-12 text-muted-foreground" />
                          <h3 className="text-lg font-medium">
                            No timesheets found
                          </h3>
                          <p className="text-muted-foreground">
                            {hasActiveFilters
                              ? "Try adjusting your filters to see more results."
                              : "No timesheets have been submitted yet."}
                          </p>
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : (
                    timesheetData?.timesheets?.map((timesheet: Timesheet) => (
                      <TableRow key={timesheet._id}>
                        <TableCell className="font-medium">
                          <div className="flex flex-col">
                            <span className="font-mono">
                              {timesheet.shiftIdRef}
                            </span>
                            <span className="text-xs text-muted-foreground capitalize">
                              {timesheet.shiftId.serviceTypeId?.name || 'N/A'}
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
                                <span className="text-blue-600 ml-1">
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
                              <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-muted-foreground text-sm">
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
                            <span className="font-medium">
                              {getFullName(timesheet.participantId)}
                            </span>
                            <span className="text-xs text-muted-foreground">
                              {timesheet.participantId.email}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-col">
                            <div className="font-medium flex items-center">
                              <Receipt className="h-3 w-3 mr-1 text-blue-500" />
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
                          {/* <div className="text-xs text-muted-foreground">
                            {formatCurrency(timesheet.subtotal)} + expenses
                          </div> */}
                        </TableCell>
                        <TableCell>
                          {getStatusBadge(timesheet.status, timesheet.isPaid)}
                        </TableCell>
                        <TableCell className="text-right">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleViewTimesheet(timesheet._id)}
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
                  <div className="border-t p-4">
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

export default TimesheetsManagement;
