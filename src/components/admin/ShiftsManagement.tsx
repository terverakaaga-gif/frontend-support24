import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { format } from "date-fns";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle 
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "@/components/ui/calendar";
import { 
  Search, 
  Filter, 
  Calendar as CalendarIcon, 
  Eye, 
  Clock, 
  MapPin, 
  RepeatIcon, 
  MoreVertical, 
  RefreshCw,
  Users
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Recurrence, ShiftStatus } from "@/entities/Shift";
import { useGetShifts } from "@/hooks/useShiftHooks";
import { UserSummary } from "@/entities/types";

export function ShiftsManagement() {
  const navigate = useNavigate();
  
  // Filter states - all handled by backend
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [startDateFilter, setStartDateFilter] = useState<Date | null>(null);
  const [endDateFilter, setEndDateFilter] = useState<Date | null>(null);
  const [isMultiWorkerFilter, setIsMultiWorkerFilter] = useState<string>("all");
  const [showFilters, setShowFilters] = useState(false);

  // Create filters object for API call - send all filters to backend
  const apiFilters = useMemo(() => {
    const filterObj: any = {};
    
    if (statusFilter && statusFilter !== "all") {
      filterObj.status = statusFilter;
    }
    if (startDateFilter) {
      filterObj.startDate = startDateFilter.toISOString();
    }
    if (endDateFilter) {
      filterObj.endDate = endDateFilter.toISOString();
    }
    if (isMultiWorkerFilter && isMultiWorkerFilter !== "all") {
      filterObj.isMultiWorkerShift = isMultiWorkerFilter === 'true';
    }
    
    return Object.keys(filterObj).length > 0 ? filterObj : undefined;
  }, [statusFilter, startDateFilter, endDateFilter, isMultiWorkerFilter]);

  // Fetch shifts data - backend handles all filtering
  const { data: shifts = [], isLoading, error } = useGetShifts(apiFilters);
  
  // Helper functions
  const formatTime = (dateString: string) => format(new Date(dateString), "h:mm a");
  const formatDate = (dateString: string) => format(new Date(dateString), "MMM d, yyyy");
  const getFullName = (user: UserSummary) => `${user.firstName} ${user.lastName}`;
  
  const formatDuration = (startTime: string, endTime: string) => {
    const diffMs = new Date(endTime).getTime() - new Date(startTime).getTime();
    const diffHrs = Math.floor(diffMs / (1000 * 60 * 60));
    const diffMins = Math.round((diffMs % (1000 * 60 * 60)) / (1000 * 60));
    return diffHrs ? `${diffHrs}h${diffMins ? ` ${diffMins}m` : ''}` : `${diffMins}m`;
  };

  const handleViewShift = (id: string) => {
    
    navigate(`/admin/shifts/${id}`);
  };

  const handleResetFilters = () => {
    setStatusFilter("all");
    setStartDateFilter(null);
    setEndDateFilter(null);
    setIsMultiWorkerFilter("all");
  };

  // Check if any filters are active
  const hasActiveFilters = (statusFilter && statusFilter !== "all") || 
  startDateFilter || endDateFilter || (isMultiWorkerFilter && isMultiWorkerFilter !== "all");

  // Badge components
  const getStatusBadge = (status: string) => {
    const statusClasses: Record<string, string> = {
      [ShiftStatus.OPEN]: "bg-blue-100 text-blue-800 border-blue-200", 
      [ShiftStatus.PENDING]: "bg-yellow-100 text-yellow-800 border-yellow-200", 
      [ShiftStatus.CONFIRMED]: "bg-green-100 text-green-800 border-green-200", 
      [ShiftStatus.IN_PROGRESS]: "bg-blue-100 text-blue-800 border-blue-200", 
      [ShiftStatus.COMPLETED]: "bg-purple-100 text-purple-800 border-purple-200", 
      [ShiftStatus.CANCELLED]: "bg-gray-100 text-gray-800 border-gray-200", 
      [ShiftStatus.NO_SHOW]: "bg-red-100 text-red-800 border-red-200",
      [ShiftStatus.DECLINED]: "bg-red-100 text-red-800 border-red-200"
    };
    
    const label = status.replace(/([A-Z])/g, ' $1')
      .replace(/^./, str => str.toUpperCase());
    
    return (
      <Badge variant="outline" className={statusClasses[status] || "bg-gray-100 text-gray-800"}>
        {label}
      </Badge>
    );
  };

  const getRecurrenceBadge = (recurrence: Recurrence) => {
    if (recurrence.pattern === "none") return null;
    
    return (
      <Badge variant="outline" className="bg-indigo-50 text-indigo-700 border-indigo-200 flex items-center text-xs">
        <RepeatIcon className="h-3 w-3 mr-1" />
        {recurrence.pattern.charAt(0).toUpperCase() + recurrence.pattern.slice(1)}
        {recurrence.occurrences ? ` (${recurrence.occurrences}x)` : ""}
      </Badge>
    );
  };

  // Loading state
  if (isLoading) {
    return (
      <Card className="w-full">
        <CardContent>
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4" />
              <p>Loading shifts...</p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Error state
  if (error) {
    return (
      <Card className="w-full">
        <CardContent>
          <div className="flex items-center justify-center h-64">
            <div className="text-center text-red-600">
              <p>Error loading shifts. Please try again.</p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
          <div>
            <CardTitle>Shifts Management</CardTitle>
            <CardDescription>
              View and manage shifts across all organizations
            </CardDescription>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowFilters(!showFilters)}
              className={showFilters ? "bg-muted" : ""}
            >
              <Filter className="h-4 w-4 mr-2" />
              {showFilters ? "Hide Filters" : "Show Filters"}
            </Button>
            {hasActiveFilters && (
              <Button 
                variant="ghost" 
                size="sm"
                onClick={handleResetFilters}
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Reset
              </Button>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Filters section */}
          {showFilters && (
            <div className="bg-muted/40 p-4 rounded-lg space-y-4">
              <h3 className="font-medium text-sm">Filters</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Status filter */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">Status</label>
                  <Select
                    value={statusFilter}
                    onValueChange={(value) => setStatusFilter(value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="All statuses" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All statuses</SelectItem>
                      {Object.values(ShiftStatus).map(status => (
                        <SelectItem key={status} value={status}>
                          {status.charAt(0).toUpperCase() + status.slice(1).replace(/([A-Z])/g, ' $1')}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Multi-worker filter */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">Shift Type</label>
                  <Select
                    value={isMultiWorkerFilter}
                    onValueChange={(value) => setIsMultiWorkerFilter(value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="All shift types" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All shift types</SelectItem>
                      <SelectItem value="false">Single Worker</SelectItem>
                      <SelectItem value="true">Multi Worker</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Start Date filter */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">Start Date</label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !startDateFilter && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {startDateFilter ? format(startDateFilter, "PP") : "Select start date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={startDateFilter || undefined}
                        onSelect={setStartDateFilter}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                {/* End Date filter */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">End Date</label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !endDateFilter && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {endDateFilter ? format(endDateFilter, "PP") : "Select end date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={endDateFilter || undefined}
                        onSelect={setEndDateFilter}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>
            </div>
          )}

          {/* Shifts table */}
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Shift</TableHead>
                  <TableHead>Date & Time</TableHead>
                  <TableHead>Participant</TableHead>
                  <TableHead>Support Worker</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {shifts.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="h-24 text-center">
                      No shifts found.
                    </TableCell>
                  </TableRow>
                ) : (
                  shifts.map((shift) => (
                    <TableRow key={shift._id}>
                      <TableCell className="font-medium">
                        <div className="flex flex-col">
                          <span>{shift.shiftId}</span>
                          <div className="flex items-center gap-1 mt-1">
                            <span className="text-xs text-muted-foreground">
                              {shift.serviceType.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                            </span>
                            <div className="ml-auto">
                              {getRecurrenceBadge(shift.recurrence)}
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col">
                          <span className="font-medium">{formatDate(shift.startTime)}</span>
                          <div className="flex items-center gap-1 mt-1 text-muted-foreground text-xs">
                            <Clock className="h-3 w-3" />
                            <span>{formatTime(shift.startTime)} - {formatTime(shift.endTime)}</span>
                          </div>
                          <span className="text-xs">{formatDuration(shift.startTime, shift.endTime)}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col">
                          <span className="font-medium">{getFullName(shift.participantId)}</span>
                          <span className="text-xs text-muted-foreground">{shift.organizationId.name}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        {shift.isMultiWorkerShift ? (
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                              <Users className="h-4 w-4 text-blue-600" />
                            </div>
                            <div className="flex flex-col">
                              <span className="font-medium text-sm">Multi-worker shift</span>
                              <span className="text-xs text-muted-foreground">
                                {shift.workerAssignments?.length || 0} workers assigned
                              </span>
                            </div>
                          </div>
                        ) : shift.workerId ? (
                          <div className="flex items-center gap-3">
                            {shift.workerId.profileImage ? (
                              <div className="w-8 h-8 rounded-full overflow-hidden">
                                <img
                                  src={shift.workerId.profileImage}
                                  alt={getFullName(shift.workerId)}
                                  className="w-full h-full object-cover"
                                />
                              </div>
                            ) : (
                              <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-muted-foreground">
                                {shift.workerId.firstName.charAt(0)}
                                {shift.workerId.lastName.charAt(0)}
                              </div>
                            )}
                            <div className="flex flex-col">
                              <span className="font-medium">{getFullName(shift.workerId)}</span>
                              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                <MapPin className="h-3 w-3" />
                                <span className="truncate max-w-[150px]">{shift.locationType}</span>
                              </div>
                            </div>
                          </div>
                        ) : (
                          <span className="text-muted-foreground">No worker assigned</span>
                        )}
                      </TableCell>
                      <TableCell>
                        {getStatusBadge(shift.status)}
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                              <span className="sr-only">Open menu</span>
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => handleViewShift(shift._id)}>
                              <Eye className="h-4 w-4 mr-2" />
                              View details
                            </DropdownMenuItem>
                            {shift.recurrence.pattern !== "none" && (
                              <DropdownMenuItem>
                                <RepeatIcon className="h-4 w-4 mr-2" />
                                View series
                              </DropdownMenuItem>
                            )}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
          
          {/* Results info */}
          <div className="text-sm text-muted-foreground">
            Showing {shifts.length} shifts
          </div>
        </div>
      </CardContent>
    </Card>
  );
}