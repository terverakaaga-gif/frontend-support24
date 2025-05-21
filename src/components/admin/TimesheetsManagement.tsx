import { useState } from "react";
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
  DollarSign, 
  Receipt, 
  MoreVertical, 
  RefreshCw,
  FileText,
  UserCircle,
  Building
} from "lucide-react";
import { cn } from "@/lib/utils";

// Timesheet status enum
enum TimesheetStatus {
  PENDING = 'pending',
  APPROVED = 'approved',
  REJECTED = 'rejected',
  PAID = 'paid'
}

// Interfaces based on API response
interface RateTimeBand {
  _id: string;
  name: string;
  code: string;
  isWeekend: boolean;
  isPublicHoliday: boolean;
  baseRateMultiplier: number;
}

interface RateCalculation {
  _id: string;
  rateTimeBandId: RateTimeBand;
  name: string;
  hourlyRate: number;
  hours: number;
  amount: number;
}

interface Expense {
  _id: string;
  title: string;
  description: string;
  amount: number;
  receiptUrl?: string;
}

interface ShiftRef {
  _id: string;
  serviceType: string;
  shiftId: string;
}

interface Organization {
  _id: string;
  name: string;
}

interface User {
  _id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
  profileImage?: string;
}

interface Timesheet {
  _id: string;
  shiftId: ShiftRef;
  shiftIdRef: string;
  organizationId: Organization;
  participantId: User;
  workerId: User;
  scheduledStartTime: string;
  scheduledEndTime: string;
  actualStartTime: string;
  actualEndTime: string;
  extraTime: number;
  notes: string;
  expenses: Expense[];
  totalExpenses: number;
  rateCalculations: RateCalculation[];
  subtotal: number;
  totalAmount: number;
  status: string;
  isPaid: boolean;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

// Mock data
const mockTimesheets: Timesheet[] = [
  {
    "_id": "6824314d19f7a0ac113e07a5",
    "shiftId": {
      "_id": "682428c519f7a0ac113e06c5",
      "serviceType": "personalCare",
      "shiftId": "SHIFT-BO1_TXZRC7"
    },
    "shiftIdRef": "SHIFT-BO1_TXZRC7",
    "organizationId": {
      "_id": "681cbad118cb004b3456b169",
      "name": "Michael's Organization"
    },
    "participantId": {
      "_id": "681cbad018cb004b3456b166",
      "email": "milbert@gmail.com",
      "firstName": "Michael",
      "lastName": "Hishen",
      "phone": "08081785091"
    },
    "workerId": {
      "_id": "6813df5a4d13ec4234a33960",
      "email": "priscillafriday@gmail.com",
      "firstName": "Priscilla",
      "lastName": "Friday",
      "phone": "07081785091",
      "profileImage": "https://res.cloudinary.com/dj8g798ed/image/upload/v1746165207/user-profiles/profile-6813df5a4d13ec4234a33960.jpg"
    },
    "scheduledStartTime": "2025-05-20T09:00:00.000Z",
    "scheduledEndTime": "2025-05-20T12:00:00.000Z",
    "actualStartTime": "2025-05-20T09:00:00.000Z",
    "actualEndTime": "2025-05-20T12:30:00.000Z",
    "extraTime": 30,
    "notes": "Client needed extra assistance with meal preparation. All tasks completed successfully.",
    "expenses": [
      {
        "title": "Transportation",
        "description": "Taxi fare to client's home",
        "amount": 15.5,
        "_id": "6824314d19f7a0ac113e07a6"
      },
      {
        "title": "Supplies",
        "description": "Medical supplies purchased for client",
        "amount": 25.75,
        "receiptUrl": "https://example.com/receipts/r123456.jpg",
        "_id": "6824314d19f7a0ac113e07a7"
      }
    ],
    "totalExpenses": 41.25,
    "rateCalculations": [
      {
        "rateTimeBandId": {
          "_id": "681c6f750ab224ca6685d05c",
          "name": "Morning Shift",
          "code": "MORNING",
          "isWeekend": false,
          "isPublicHoliday": false,
          "baseRateMultiplier": 1
        },
        "name": "Morning Shift",
        "hourlyRate": 30,
        "hours": 4,
        "amount": 120,
        "_id": "6824314d19f7a0ac113e07a8"
      }
    ],
    "subtotal": 120,
    "totalAmount": 161.25,
    "status": "pending",
    "isPaid": false,
    "createdAt": "2025-05-14T05:59:41.966Z",
    "updatedAt": "2025-05-14T05:59:41.966Z",
    "__v": 0
  },
  {
    "_id": "6824328119f7a0ac113e07d6",
    "shiftId": {
      "_id": "682428c619f7a0ac113e06cf",
      "serviceType": "personalCare",
      "shiftId": "SHIFT-TKXWSHF3GE"
    },
    "shiftIdRef": "SHIFT-TKXWSHF3GE",
    "organizationId": {
      "_id": "681cbad118cb004b3456b169",
      "name": "Michael's Organization"
    },
    "participantId": {
      "_id": "681cbad018cb004b3456b166",
      "email": "milbert@gmail.com",
      "firstName": "Michael",
      "lastName": "Hishen",
      "phone": "08081785091"
    },
    "workerId": {
      "_id": "6813df5a4d13ec4234a33960",
      "email": "priscillafriday@gmail.com",
      "firstName": "Priscilla",
      "lastName": "Friday",
      "phone": "07081785091",
      "profileImage": "https://res.cloudinary.com/dj8g798ed/image/upload/v1746165207/user-profiles/profile-6813df5a4d13ec4234a33960.jpg"
    },
    "scheduledStartTime": "2025-06-10T09:00:00.000Z",
    "scheduledEndTime": "2025-06-10T12:00:00.000Z",
    "actualStartTime": "2025-05-20T08:00:00.000Z",
    "actualEndTime": "2025-05-20T12:13:00.000Z",
    "extraTime": 30,
    "notes": "Client needed extra assistance with meal preparation. All tasks completed successfully.",
    "expenses": [
      {
        "title": "Transportation",
        "description": "Taxi fare to client's home",
        "amount": 38.5,
        "_id": "6824328119f7a0ac113e07d7"
      },
      {
        "title": "Supplies",
        "description": "Medical supplies purchased for client",
        "amount": 89.75,
        "receiptUrl": "https://example.com/receipts/r123456.jpg",
        "_id": "6824328119f7a0ac113e07d8"
      }
    ],
    "totalExpenses": 128.25,
    "rateCalculations": [
      {
        "rateTimeBandId": {
          "_id": "681c6f750ab224ca6685d05c",
          "name": "Morning Shift",
          "code": "MORNING",
          "isWeekend": false,
          "isPublicHoliday": false,
          "baseRateMultiplier": 1
        },
        "name": "Morning Shift",
        "hourlyRate": 30,
        "hours": 4.716666666666667,
        "amount": 141.5,
        "_id": "6824328119f7a0ac113e07d9"
      }
    ],
    "subtotal": 141.5,
    "totalAmount": 269.75,
    "status": "approved",
    "isPaid": true,
    "createdAt": "2025-05-14T06:04:49.810Z",
    "updatedAt": "2025-05-14T06:04:49.810Z",
    "__v": 0
  }
];

export function TimesheetManagement() {
  const navigate = useNavigate();
  const [timesheets] = useState<Timesheet[]>(mockTimesheets);
  const [searchQuery, setSearchQuery] = useState("");
  
  // Filter states
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [organizationFilter, setOrganizationFilter] = useState<string | null>(null);
  const [participantFilter, setParticipantFilter] = useState<string | null>(null);
  const [workerFilter, setWorkerFilter] = useState<string | null>(null);
  const [paidFilter, setPaidFilter] = useState<boolean | null>(null);
  const [startDateFilter, setStartDateFilter] = useState<Date | null>(null);
  const [endDateFilter, setEndDateFilter] = useState<Date | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  
  // Extract unique values for filters
  const organizations = [...new Map(timesheets.map(t => [t.organizationId._id, 
    { id: t.organizationId._id, name: t.organizationId.name }])).values()];
  
  const participants = [...new Map(timesheets.map(t => [t.participantId._id, 
    { id: t.participantId._id, name: `${t.participantId.firstName} ${t.participantId.lastName}` }])).values()];
  
  const workers = [...new Map(timesheets.map(t => [t.workerId._id, 
    { id: t.workerId._id, name: `${t.workerId.firstName} ${t.workerId.lastName}` }])).values()];

  // Helper functions
  function startOfDay(date: Date): Date {
    const newDate = new Date(date);
    newDate.setHours(0, 0, 0, 0);
    return newDate;
  }

  function endOfDay(date: Date): Date {
    const newDate = new Date(date);
    newDate.setHours(23, 59, 59, 999);
    return newDate;
  }

  const formatTime = (dateString: string) => format(new Date(dateString), "h:mm a");
  const formatDate = (dateString: string) => format(new Date(dateString), "MMM d, yyyy");
  const formatDateShort = (dateString: string) => format(new Date(dateString), "d MMM yyyy");
  const getFullName = (user: User) => `${user.firstName} ${user.lastName}`;
  
  const formatDuration = (startTime: string, endTime: string) => {
    const start = new Date(startTime);
    const end = new Date(endTime);
    const diffMs = end.getTime() - start.getTime();
    const diffHrs = Math.floor(diffMs / (1000 * 60 * 60));
    const diffMins = Math.round((diffMs % (1000 * 60 * 60)) / (1000 * 60));
    return diffHrs ? `${diffHrs}h${diffMins ? ` ${diffMins}m` : ''}` : `${diffMins}m`;
  };
  
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    }).format(amount);
  };

  // Apply filters
  const filteredTimesheets = timesheets.filter(timesheet => {
    // Search query
    const searchTerms = searchQuery.toLowerCase().trim().split(" ");
    const searchMatches = searchQuery === "" || searchTerms.every(term => 
      timesheet.shiftIdRef.toLowerCase().includes(term) ||
      `${timesheet.participantId.firstName} ${timesheet.participantId.lastName}`.toLowerCase().includes(term) ||
      `${timesheet.workerId.firstName} ${timesheet.workerId.lastName}`.toLowerCase().includes(term) ||
      timesheet.organizationId.name.toLowerCase().includes(term) ||
      timesheet.shiftId.serviceType.toLowerCase().includes(term)
    );
    
    // Status filter
    const statusMatches = !statusFilter || timesheet.status === statusFilter;
    
    // Organization filter
    const orgMatches = !organizationFilter || timesheet.organizationId._id === organizationFilter;
    
    // Participant filter
    const participantMatches = !participantFilter || timesheet.participantId._id === participantFilter;
    
    // Worker filter
    const workerMatches = !workerFilter || timesheet.workerId._id === workerFilter;
    
    // Paid status filter
    const paidMatches = paidFilter === null || timesheet.isPaid === paidFilter;
    
    // Date range filter - using actual date
    const timesheetDate = new Date(timesheet.actualStartTime);
    const startDateMatches = !startDateFilter || timesheetDate >= startOfDay(startDateFilter);
    const endDateMatches = !endDateFilter || timesheetDate <= endOfDay(endDateFilter);
    
    return searchMatches && statusMatches && orgMatches && participantMatches &&
           workerMatches && paidMatches && startDateMatches && endDateMatches;
  }).sort((a, b) => new Date(b.actualStartTime).getTime() - new Date(a.actualStartTime).getTime());

  const handleViewTimesheet = (id: string) => {
    navigate(`/admin/timesheets/${id}`);
  };

  const handleResetFilters = () => {
    setStatusFilter(null);
    setOrganizationFilter(null);
    setParticipantFilter(null);
    setWorkerFilter(null);
    setPaidFilter(null);
    setStartDateFilter(null);
    setEndDateFilter(null);
    setSearchQuery("");
  };

  // Check if any filters are active
  const hasActiveFilters = statusFilter || organizationFilter || participantFilter || 
    workerFilter || paidFilter !== null || startDateFilter || endDateFilter || searchQuery;

  // Badge components
  const getStatusBadge = (status: string, isPaid: boolean) => {
    // If paid, show paid badge regardless of status
    if (isPaid) {
      return (
        <Badge variant="outline" className="bg-green-100 text-green-800 border-green-200">
          Paid
        </Badge>
      );
    }
    
    const statusClasses: Record<string, string> = {
      'pending': "bg-yellow-100 text-yellow-800 border-yellow-200",
      'approved': "bg-blue-100 text-blue-800 border-blue-200",
      'rejected': "bg-red-100 text-red-800 border-red-200"
    };
    
    const label = status.charAt(0).toUpperCase() + status.slice(1);
    
    return (
      <Badge variant="outline" className={statusClasses[status] || "bg-gray-100 text-gray-800"}>
        {label}
      </Badge>
    );
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
          <div>
            <CardTitle>Timesheet Management</CardTitle>
            <CardDescription>
              View and manage worker timesheets and payments
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
          {/* Search bar */}
          <div className="relative w-full max-w-md">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search timesheets by ID, worker, participant..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {/* Filters section */}
          {showFilters && (
            <div className="bg-muted/40 p-4 rounded-lg space-y-4">
              <h3 className="font-medium text-sm">Filters</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {/* Status filter */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">Status</label>
                  <Select
                    value={statusFilter || ""}
                    onValueChange={(value) => setStatusFilter(value || null)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="All statuses" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">All statuses</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="approved">Approved</SelectItem>
                      <SelectItem value="rejected">Rejected</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Payment status filter */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">Payment Status</label>
                  <Select
                    value={paidFilter === null ? "" : paidFilter ? "paid" : "unpaid"}
                    onValueChange={(value) => {
                      if (value === "") setPaidFilter(null);
                      else setPaidFilter(value === "paid");
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="All payment statuses" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">All payment statuses</SelectItem>
                      <SelectItem value="paid">Paid</SelectItem>
                      <SelectItem value="unpaid">Unpaid</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Organization filter */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">Organization</label>
                  <Select
                    value={organizationFilter || ""}
                    onValueChange={(value) => setOrganizationFilter(value || null)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="All organizations" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">All organizations</SelectItem>
                      {organizations.map(org => (
                        <SelectItem key={org.id} value={org.id}>{org.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Participant filter */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">Participant</label>
                  <Select
                    value={participantFilter || ""}
                    onValueChange={(value) => setParticipantFilter(value || null)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="All participants" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">All participants</SelectItem>
                      {participants.map(participant => (
                        <SelectItem key={participant.id} value={participant.id}>{participant.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Support worker filter */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">Support Worker</label>
                  <Select
                    value={workerFilter || ""}
                    onValueChange={(value) => setWorkerFilter(value || null)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="All support workers" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">All support workers</SelectItem>
                      {workers.map(worker => (
                        <SelectItem key={worker.id} value={worker.id}>{worker.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Date filters */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">Date Range</label>
                  <div className="flex space-x-2">
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          size="sm"
                          className={cn(
                            "w-full justify-start text-left font-normal",
                            !startDateFilter && "text-muted-foreground"
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {startDateFilter ? format(startDateFilter, "PP") : "Start date"}
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
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          size="sm"
                          className={cn(
                            "w-full justify-start text-left font-normal",
                            !endDateFilter && "text-muted-foreground"
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {endDateFilter ? format(endDateFilter, "PP") : "End date"}
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
            </div>
          )}

          {/* Timesheets table */}
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[200px]">Shift Reference</TableHead>
                  <TableHead>Date & Hours</TableHead>
                  <TableHead>Worker</TableHead>
                  <TableHead>Participant</TableHead>
                  <TableHead>Expenses</TableHead>
                  <TableHead>Total</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredTimesheets.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="h-24 text-center">
                      No timesheets found matching your criteria.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredTimesheets.map((timesheet) => (
                    <TableRow key={timesheet._id}>
                      <TableCell className="font-medium">
                        <div className="flex flex-col">
                          <span>{timesheet.shiftIdRef}</span>
                          <span className="text-xs text-muted-foreground capitalize">
                            {timesheet.shiftId.serviceType.replace(/([A-Z])/g, ' $1').toLowerCase()}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            <Building className="h-3 w-3 inline mr-1" />
                            {timesheet.organizationId.name}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col">
                          <span className="font-medium">{formatDateShort(timesheet.actualStartTime)}</span>
                          <div className="flex items-center gap-1 mt-1 text-muted-foreground text-xs">
                            <Clock className="h-3 w-3" />
                            <span>{formatTime(timesheet.actualStartTime)} - {formatTime(timesheet.actualEndTime)}</span>
                          </div>
                          <div className="flex items-center gap-1 text-xs">
                            <span>{formatDuration(timesheet.actualStartTime, timesheet.actualEndTime)}</span>
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
                          {timesheet.workerId.profileImage ? (
                            <div className="w-8 h-8 rounded-full overflow-hidden">
                              <img
                                src={timesheet.workerId.profileImage}
                                alt={getFullName(timesheet.workerId)}
                                className="w-full h-full object-cover"
                              />
                            </div>
                          ) : (
                            <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-muted-foreground">
                              {timesheet.workerId.firstName.charAt(0)}
                              {timesheet.workerId.lastName.charAt(0)}
                            </div>
                          )}
                          <div className="flex flex-col">
                            <span className="font-medium">{getFullName(timesheet.workerId)}</span>
                            <span className="text-xs text-muted-foreground">{timesheet.workerId.email}</span>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col">
                          <span className="font-medium">{getFullName(timesheet.participantId)}</span>
                          <span className="text-xs text-muted-foreground">{timesheet.participantId.email}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col">
                          <div className="font-medium flex items-center">
                            <Receipt className="h-3 w-3 mr-1 text-blue-500" />
                            {formatCurrency(timesheet.totalExpenses)}
                          </div>
                          <span className="text-xs text-muted-foreground">
                            {timesheet.expenses.length} item{timesheet.expenses.length !== 1 ? 's' : ''}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="font-medium text-green-700">
                          {formatCurrency(timesheet.totalAmount)}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {formatCurrency(timesheet.subtotal)} + expenses
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
          </div>
          
          {/* Results info */}
          <div className="text-sm text-muted-foreground">
            Showing {filteredTimesheets.length} of {timesheets.length} timesheets
          </div>
        </div>
      </CardContent>
    </Card>
  );
}