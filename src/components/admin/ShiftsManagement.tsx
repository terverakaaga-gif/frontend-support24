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
  MapPin, 
  RepeatIcon, 
  MoreVertical, 
  RefreshCw
} from "lucide-react";
import { cn } from "@/lib/utils";

// Shift status enum
enum ShiftStatus {
  OPEN = 'open',
  PENDING = 'pending',
  CONFIRMED = 'confirmed',
  IN_PROGRESS = 'inProgress',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
  NO_SHOW = 'noShow'
}

// Interfaces based on API response
interface Recurrence {
  pattern: string;
  parentShiftId?: string;
  occurrences?: number;
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

interface Shift {
  _id: string;
  organizationId: Organization;
  participantId: User;
  workerId: User;
  serviceType: string;
  startTime: string;
  endTime: string;
  locationType: string;
  address: string;
  shiftType: string;
  requiresSupervision: boolean;
  specialInstructions: string;
  status: string;
  shiftId: string;
  recurrence: Recurrence;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

// Mock data
const mockShifts: Shift[] = [
  {
    "recurrence": { "pattern": "weekly", "parentShiftId": "SHIFT-BO1_TXZRC7" },
    "_id": "682428c619f7a0ac113e06cf",
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
    "serviceType": "personalCare",
    "startTime": "2025-06-10T09:00:00.000Z",
    "endTime": "2025-06-10T12:00:00.000Z",
    "locationType": "inPerson",
    "address": "123 Main Street, Lagos, Nigeria",
    "shiftType": "directBooking",
    "requiresSupervision": false,
    "specialInstructions": "Please bring medical gloves and face mask. Client needs assistance with bathing and medication.",
    "status": "pending",
    "shiftId": "SHIFT-TKXWSHF3GE",
    "createdAt": "2025-05-14T05:23:18.642Z",
    "updatedAt": "2025-05-14T05:23:18.642Z",
    "__v": 0
  },
  {
    "recurrence": { "pattern": "weekly", "parentShiftId": "SHIFT-BO1_TXZRC7" },
    "_id": "682428c619f7a0ac113e06cb",
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
    "serviceType": "personalCare",
    "startTime": "2025-06-03T09:00:00.000Z",
    "endTime": "2025-06-03T12:00:00.000Z",
    "locationType": "inPerson",
    "address": "123 Main Street, Lagos, Nigeria",
    "shiftType": "directBooking",
    "requiresSupervision": false,
    "specialInstructions": "Please bring medical gloves and face mask. Client needs assistance with bathing and medication.",
    "status": "confirmed",
    "shiftId": "SHIFT-W0KDJG0JM_",
    "createdAt": "2025-05-14T05:23:18.123Z",
    "updatedAt": "2025-05-14T05:23:18.123Z",
    "__v": 0
  },
  {
    "recurrence": { "pattern": "weekly", "parentShiftId": "SHIFT-BO1_TXZRC7" },
    "_id": "682428c519f7a0ac113e06c7",
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
    "serviceType": "personalCare",
    "startTime": "2025-05-27T09:00:00.000Z",
    "endTime": "2025-05-27T12:00:00.000Z",
    "locationType": "inPerson",
    "address": "123 Main Street, Lagos, Nigeria",
    "shiftType": "directBooking",
    "requiresSupervision": false,
    "specialInstructions": "Please bring medical gloves and face mask. Client needs assistance with bathing and medication.",
    "status": "inProgress",
    "shiftId": "SHIFT-KE7JSMABEW",
    "createdAt": "2025-05-14T05:23:17.434Z",
    "updatedAt": "2025-05-14T05:23:17.434Z",
    "__v": 0
  },
  {
    "recurrence": { "pattern": "none" },
    "_id": "68242b7419f7a0ac113e0750",
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
      "_id": "6824214c428844008e125919",
      "email": "workerthree@gmail.com",
      "firstName": "Support",
      "lastName": "Worker3",
      "phone": "08081785091"
    },
    "serviceType": "socialSupport",
    "startTime": "2025-05-23T15:00:00.000Z",
    "endTime": "2025-05-23T17:00:00.000Z",
    "locationType": "inPerson",
    "address": "123 Main Street, Lagos, Nigeria",
    "shiftType": "directBooking",
    "requiresSupervision": false,
    "specialInstructions": "Come with your ride.",
    "status": "open",
    "shiftId": "SHIFT-5QYHWKDKGP",
    "createdAt": "2025-05-14T05:34:44.514Z",
    "updatedAt": "2025-05-14T05:34:44.514Z",
    "__v": 0
  },
  {
    "recurrence": { "pattern": "none" },
    "_id": "68242af519f7a0ac113e0725",
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
      "_id": "6824212b428844008e125914",
      "email": "workertwo@gmail.com",
      "firstName": "Support",
      "lastName": "Worker2",
      "phone": "08081785091"
    },
    "serviceType": "mealPreparation",
    "startTime": "2025-05-22T15:00:00.000Z",
    "endTime": "2025-05-22T17:00:00.000Z",
    "locationType": "inPerson",
    "address": "123 Main Street, Lagos, Nigeria",
    "shiftType": "directBooking",
    "requiresSupervision": false,
    "specialInstructions": "One-time shift for doctor's appointment.",
    "status": "cancelled",
    "shiftId": "SHIFT-T68_WQ2CRK",
    "createdAt": "2025-05-14T05:32:37.370Z",
    "updatedAt": "2025-05-14T05:32:37.370Z",
    "__v": 0
  },
  {
    "recurrence": { "pattern": "none" },
    "_id": "68242a0f19f7a0ac113e06fa",
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
      "_id": "682420e3428844008e12590f",
      "email": "workerone@gmail.com",
      "firstName": "Support",
      "lastName": "Worker1",
      "phone": "08081785091"
    },
    "serviceType": "personalCare",
    "startTime": "2025-05-20T14:00:00.000Z",
    "endTime": "2025-05-20T16:00:00.000Z",
    "locationType": "inPerson",
    "address": "123 Main Street, Lagos, Nigeria",
    "shiftType": "directBooking",
    "requiresSupervision": false,
    "specialInstructions": "One-time shift for doctor's appointment.",
    "status": "completed",
    "shiftId": "SHIFT-1KANJXX694",
    "createdAt": "2025-05-14T05:28:47.029Z",
    "updatedAt": "2025-05-14T05:28:47.029Z",
    "__v": 0
  },
  {
    "recurrence": { "pattern": "weekly", "occurrences": 4 },
    "_id": "682428c519f7a0ac113e06c5",
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
    "serviceType": "personalCare",
    "startTime": "2025-05-20T09:00:00.000Z",
    "endTime": "2025-05-20T12:00:00.000Z",
    "locationType": "inPerson",
    "address": "123 Main Street, Lagos, Nigeria",
    "shiftType": "directBooking",
    "requiresSupervision": false,
    "specialInstructions": "Please bring medical gloves and face mask. Client needs assistance with bathing and medication.",
    "status": "noShow",
    "shiftId": "SHIFT-BO1_TXZRC7",
    "createdAt": "2025-05-14T05:23:17.257Z",
    "updatedAt": "2025-05-14T05:23:17.257Z",
    "__v": 0
  }
];

export function ShiftsManagement() {
  const navigate = useNavigate();
  const [shifts] = useState<Shift[]>(mockShifts);
  const [searchQuery, setSearchQuery] = useState("");
  
  // Filter states
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [organizationFilter, setOrganizationFilter] = useState<string | null>(null);
  const [participantFilter, setParticipantFilter] = useState<string | null>(null);
  const [workerFilter, setWorkerFilter] = useState<string | null>(null);
  const [serviceTypeFilter, setServiceTypeFilter] = useState<string | null>(null);
  const [startDateFilter, setStartDateFilter] = useState<Date | null>(null);
  const [endDateFilter, setEndDateFilter] = useState<Date | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  
  // Extract unique values for filters
  const organizations = [...new Map(shifts.map(s => [s.organizationId._id, 
    { id: s.organizationId._id, name: s.organizationId.name }])).values()];
  
  const participants = [...new Map(shifts.map(s => [s.participantId._id, 
    { id: s.participantId._id, name: `${s.participantId.firstName} ${s.participantId.lastName}` }])).values()];
  
  const workers = [...new Map(shifts.map(s => [s.workerId._id, 
    { id: s.workerId._id, name: `${s.workerId.firstName} ${s.workerId.lastName}` }])).values()];
  
  const serviceTypes = [...new Set(shifts.map(s => s.serviceType))];

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
  const getFullName = (user: User) => `${user.firstName} ${user.lastName}`;
  
  const formatDuration = (startTime: string, endTime: string) => {
    const diffMs = new Date(endTime).getTime() - new Date(startTime).getTime();
    const diffHrs = Math.floor(diffMs / (1000 * 60 * 60));
    const diffMins = Math.round((diffMs % (1000 * 60 * 60)) / (1000 * 60));
    return diffHrs ? `${diffHrs}h${diffMins ? ` ${diffMins}m` : ''}` : `${diffMins}m`;
  };

  // Apply filters
  const filteredShifts = shifts.filter(shift => {
    // Search query
    const searchTerms = searchQuery.toLowerCase().trim().split(" ");
    const searchMatches = searchQuery === "" || searchTerms.every(term => 
      shift.shiftId.toLowerCase().includes(term) ||
      `${shift.participantId.firstName} ${shift.participantId.lastName}`.toLowerCase().includes(term) ||
      `${shift.workerId.firstName} ${shift.workerId.lastName}`.toLowerCase().includes(term) ||
      shift.organizationId.name.toLowerCase().includes(term) ||
      shift.serviceType.toLowerCase().includes(term) ||
      shift.address.toLowerCase().includes(term)
    );
    
    // Status filter
    const statusMatches = !statusFilter || shift.status === statusFilter;
    
    // Organization filter
    const orgMatches = !organizationFilter || shift.organizationId._id === organizationFilter;
    
    // Participant filter
    const participantMatches = !participantFilter || shift.participantId._id === participantFilter;
    
    // Worker filter
    const workerMatches = !workerFilter || shift.workerId._id === workerFilter;
    
    // Service type filter
    const serviceTypeMatches = !serviceTypeFilter || shift.serviceType === serviceTypeFilter;
    
    // Date range filter
    const shiftDate = new Date(shift.startTime);
    const startDateMatches = !startDateFilter || shiftDate >= startOfDay(startDateFilter);
    const endDateMatches = !endDateFilter || shiftDate <= endOfDay(endDateFilter);
    
    return searchMatches && statusMatches && orgMatches && participantMatches &&
           workerMatches && serviceTypeMatches && startDateMatches && endDateMatches;
  }).sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime());

  const handleViewShift = (id: string) => {
    navigate(`/admin/shifts/${id}`);
  };

  const handleResetFilters = () => {
    setStatusFilter(null);
    setOrganizationFilter(null);
    setParticipantFilter(null);
    setWorkerFilter(null);
    setServiceTypeFilter(null);
    setStartDateFilter(null);
    setEndDateFilter(null);
    setSearchQuery("");
  };

  // Check if any filters are active
  const hasActiveFilters = statusFilter || organizationFilter || participantFilter || 
    workerFilter || serviceTypeFilter || startDateFilter || endDateFilter || searchQuery;

  // Badge components
  const getStatusBadge = (status: string) => {
    const statusClasses: Record<string, string> = {
      [ShiftStatus.OPEN]: "bg-blue-100 text-blue-800 border-blue-200", 
      [ShiftStatus.PENDING]: "bg-yellow-100 text-yellow-800 border-yellow-200", 
      [ShiftStatus.CONFIRMED]: "bg-green-100 text-green-800 border-green-200", 
      [ShiftStatus.IN_PROGRESS]: "bg-blue-100 text-blue-800 border-blue-200", 
      [ShiftStatus.COMPLETED]: "bg-purple-100 text-purple-800 border-purple-200", 
      [ShiftStatus.CANCELLED]: "bg-gray-100 text-gray-800 border-gray-200", 
      [ShiftStatus.NO_SHOW]: "bg-red-100 text-red-800 border-red-200" 
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
          {/* Search bar */}
          <div className="relative w-full max-w-md">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search shifts by ID, worker, participant..."
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
                      {Object.values(ShiftStatus).map(status => (
                        <SelectItem key={status} value={status}>
                          {status.charAt(0).toUpperCase() + status.slice(1).replace(/([A-Z])/g, ' $1')}
                        </SelectItem>
                      ))}
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

                {/* Service type filter */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">Service Type</label>
                  <Select
                    value={serviceTypeFilter || ""}
                    onValueChange={(value) => setServiceTypeFilter(value || null)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="All service types" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">All service types</SelectItem>
                      {serviceTypes.map(type => (
                        <SelectItem key={type} value={type}>
                          {type.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                        </SelectItem>
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
                {filteredShifts.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="h-24 text-center">
                      No shifts found matching your criteria.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredShifts.map((shift) => (
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
            Showing {filteredShifts.length} of {shifts.length} shifts
          </div>
        </div>
      </CardContent>
    </Card>
  );
}