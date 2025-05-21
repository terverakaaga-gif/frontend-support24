import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { 
  ArrowLeft,
  Calendar,
  Clock,
  MapPin,
  UserCircle,
  Users,
  Building,
  MessageCircle,
  Mail,
  Phone,
  CalendarClock,
  RepeatIcon,
  AlertCircle,
  Briefcase,
  Info,
  Send
} from "lucide-react";
import { 
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle 
} from "@/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger
} from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { format, isToday, isPast, isFuture } from "date-fns";

// Define the enum for shift status
enum ShiftStatus {
  OPEN = 'open',
  PENDING = 'pending',
  CONFIRMED = 'confirmed',
  IN_PROGRESS = 'inProgress',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
  NO_SHOW = 'noShow'
}

// Define interfaces based on API response
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

// Mock data based on the provided API response
const mockShifts: Shift[] = [
  {
    "recurrence": {
      "pattern": "weekly",
      "parentShiftId": "SHIFT-BO1_TXZRC7"
    },
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
    "recurrence": {
      "pattern": "weekly",
      "parentShiftId": "SHIFT-BO1_TXZRC7"
    },
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
    "recurrence": {
      "pattern": "weekly",
      "parentShiftId": "SHIFT-BO1_TXZRC7"
    },
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
    "recurrence": {
      "pattern": "none"
    },
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
    "recurrence": {
      "pattern": "none"
    },
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
    "recurrence": {
      "pattern": "none"
    },
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
    "recurrence": {
      "pattern": "weekly",
      "occurrences": 4
    },
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

// Format time for display
const formatTime = (dateString: string) => {
  return format(new Date(dateString), "h:mm a");
};

// Format date for display
const formatDate = (dateString: string) => {
  return format(new Date(dateString), "MMM d, yyyy");
};

// Format date with day for display
const formatDateWithDay = (dateString: string) => {
  return format(new Date(dateString), "EEEE, MMMM d, yyyy");
};

// Format full datetime for display
const formatDateTime = (dateString: string) => {
  return format(new Date(dateString), "PPpp");
};

// Get full name
const getFullName = (user: User) => {
  return `${user.firstName} ${user.lastName}`;
};

// Format duration
const formatDuration = (startTime: string, endTime: string) => {
  const start = new Date(startTime);
  const end = new Date(endTime);
  const diffMs = end.getTime() - start.getTime();
  const diffHrs = Math.floor(diffMs / (1000 * 60 * 60));
  const diffMins = Math.round((diffMs % (1000 * 60 * 60)) / (1000 * 60));
  
  if (diffHrs === 0) {
    return `${diffMins} minutes`;
  } else if (diffMins === 0) {
    return diffHrs === 1 ? "1 hour" : `${diffHrs} hours`;
  } else {
    return diffHrs === 1 
      ? `1 hour ${diffMins} minutes` 
      : `${diffHrs} hours ${diffMins} minutes`;
  }
};

// Get status badge component with appropriate styling
const getStatusBadge = (status: string) => {
  const statusMap: Record<string, { className: string, label: string }> = {
    [ShiftStatus.OPEN]: { 
      className: "bg-blue-100 text-blue-800 border-blue-200", 
      label: "Open" 
    },
    [ShiftStatus.PENDING]: { 
      className: "bg-yellow-100 text-yellow-800 border-yellow-200", 
      label: "Pending" 
    },
    [ShiftStatus.CONFIRMED]: { 
      className: "bg-green-100 text-green-800 border-green-200", 
      label: "Confirmed" 
    },
    [ShiftStatus.IN_PROGRESS]: { 
      className: "bg-blue-100 text-blue-800 border-blue-200", 
      label: "In Progress" 
    },
    [ShiftStatus.COMPLETED]: { 
      className: "bg-purple-100 text-purple-800 border-purple-200", 
      label: "Completed" 
    },
    [ShiftStatus.CANCELLED]: { 
      className: "bg-gray-100 text-gray-800 border-gray-200", 
      label: "Cancelled" 
    },
    [ShiftStatus.NO_SHOW]: { 
      className: "bg-red-100 text-red-800 border-red-200", 
      label: "No Show" 
    }
  };

  const { className, label } = statusMap[status] || { 
    className: "bg-gray-100 text-gray-800 border-gray-200", 
    label: status 
  };

  return (
    <Badge variant="outline" className={className}>
      {label}
    </Badge>
  );
};

// Get large status badge
const getLargeStatusBadge = (status: string) => {
  const statusMap: Record<string, { className: string, label: string, icon: JSX.Element }> = {
    [ShiftStatus.OPEN]: { 
      className: "bg-blue-100 text-blue-800 border-blue-200", 
      label: "Open",
      icon: <Calendar className="h-4 w-4 mr-2" />
    },
    [ShiftStatus.PENDING]: { 
      className: "bg-yellow-100 text-yellow-800 border-yellow-200", 
      label: "Pending",
      icon: <Clock className="h-4 w-4 mr-2" />
    },
    [ShiftStatus.CONFIRMED]: { 
      className: "bg-green-100 text-green-800 border-green-200", 
      label: "Confirmed",
      icon: <Calendar className="h-4 w-4 mr-2" />
    },
    [ShiftStatus.IN_PROGRESS]: { 
      className: "bg-blue-100 text-blue-800 border-blue-200", 
      label: "In Progress",
      icon: <Clock className="h-4 w-4 mr-2" />
    },
    [ShiftStatus.COMPLETED]: { 
      className: "bg-purple-100 text-purple-800 border-purple-200", 
      label: "Completed",
      icon: <Calendar className="h-4 w-4 mr-2" />
    },
    [ShiftStatus.CANCELLED]: { 
      className: "bg-gray-100 text-gray-800 border-gray-200", 
      label: "Cancelled",
      icon: <AlertCircle className="h-4 w-4 mr-2" />
    },
    [ShiftStatus.NO_SHOW]: { 
      className: "bg-red-100 text-red-800 border-red-200", 
      label: "No Show",
      icon: <AlertCircle className="h-4 w-4 mr-2" />
    }
  };

  const { className, label, icon } = statusMap[status] || { 
    className: "bg-gray-100 text-gray-800 border-gray-200", 
    label: status,
    icon: <Calendar className="h-4 w-4 mr-2" />
  };

  return (
    <Badge variant="outline" className={`${className} text-sm py-1 px-3 flex items-center`}>
      {icon}
      {label}
    </Badge>
  );
};

// Get service type badge
const getServiceTypeBadge = (serviceType: string) => {
  // Capitalize and format service type
  const formattedType = serviceType
    .replace(/([A-Z])/g, ' $1') // Add space before capital letters
    .replace(/^./, str => str.toUpperCase()); // Capitalize first letter
  
  const serviceTypeMap: Record<string, { icon: JSX.Element, className: string }> = {
    "personalCare": { 
      icon: <UserCircle className="h-4 w-4 mr-2" />, 
      className: "bg-blue-50 text-blue-700 border-blue-200" 
    },
    "mealPreparation": { 
      icon: <Briefcase className="h-4 w-4 mr-2" />, 
      className: "bg-green-50 text-green-700 border-green-200" 
    },
    "socialSupport": { 
      icon: <Users className="h-4 w-4 mr-2" />, 
      className: "bg-purple-50 text-purple-700 border-purple-200" 
    }
  };

  const typeInfo = serviceTypeMap[serviceType] || { 
    icon: <Briefcase className="h-4 w-4 mr-2" />, 
    className: "bg-gray-50 text-gray-700 border-gray-200" 
  };

  return (
    <Badge variant="outline" className={`${typeInfo.className} text-sm py-1 px-3 flex items-center`}>
      {typeInfo.icon}
      {formattedType}
    </Badge>
  );
};

// Get recurrence badge
const getRecurrenceBadge = (recurrence: Recurrence) => {
  if (recurrence.pattern === "none") return null;
  
  return (
    <Badge variant="outline" className="bg-indigo-50 text-indigo-700 border-indigo-200 flex items-center text-xs">
      <RepeatIcon className="h-4 w-4 mr-2" />
      {recurrence.pattern.charAt(0).toUpperCase() + recurrence.pattern.slice(1)}
      {recurrence.occurrences ? ` (${recurrence.occurrences}x)` : ""}
    </Badge>
  );
};

// Get time status badge (upcoming, today, past)
const getTimeStatusBadge = (dateTimeString: string) => {
  const dateTime = new Date(dateTimeString);
  
  if (isToday(dateTime)) {
    return (
      <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
        Today
      </Badge>
    );
  } else if (isPast(dateTime)) {
    return (
      <Badge variant="outline" className="bg-gray-100 text-gray-700 border-gray-200">
        Past
      </Badge>
    );
  } else {
    return (
      <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
        Upcoming
      </Badge>
    );
  }
};

export function ShiftDetailView() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [shift, setShift] = useState<Shift | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("details");

  useEffect(() => {
    // Simulate API call to fetch shift details
    const fetchShiftDetails = () => {
      setLoading(true);
      setTimeout(() => {
        const foundShift = mockShifts.find(s => s._id === id) || null;
        setShift(foundShift);
        setLoading(false);
      }, 500);
    };

    fetchShiftDetails();
  }, [id]);

  const handleGoBack = () => {
    navigate('/admin/shifts');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!shift) {
    return (
      <Card className="max-w-4xl mx-auto mt-8">
        <CardHeader>
          <div className="flex items-center">
            <Button variant="ghost" size="sm" onClick={handleGoBack} className="mr-4">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            <CardTitle>Shift Not Found</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <p>The shift you're looking for could not be found.</p>
        </CardContent>
        <CardFooter>
          <Button onClick={handleGoBack}>Return to Shifts</Button>
        </CardFooter>
      </Card>
    );
  }

  return (
    <div className="container mx-auto py-6 max-w-6xl">
      <div className="flex items-center mb-6">
        <Button variant="ghost" size="sm" onClick={handleGoBack} className="mr-4">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Shifts
        </Button>
        <h1 className="text-2xl font-bold">Shift Details</h1>
        <div className="ml-auto flex items-center gap-2">
          {getTimeStatusBadge(shift.startTime)}
          {getLargeStatusBadge(shift.status)}
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Main content - 2/3 width on desktop */}
        <div className="md:col-span-2 space-y-6">
          <Card>
            <CardHeader className="pb-4">
              <div className="flex flex-col gap-1">
                <div className="flex items-center justify-between">
                  <CardTitle>Shift {shift.shiftId}</CardTitle>
                  {getRecurrenceBadge(shift.recurrence) && (
                    <div>
                      {getRecurrenceBadge(shift.recurrence)}
                    </div>
                  )}
                </div>
                <CardDescription className="flex items-center">
                  <Building className="h-4 w-4 mr-2" />
                  {shift.organizationId.name}
                </CardDescription>
              </div>
            </CardHeader>
            <CardContent>
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="w-full grid grid-cols-3">
                  <TabsTrigger value="details">Details</TabsTrigger>
                  <TabsTrigger value="instructions">Instructions</TabsTrigger>
                  <TabsTrigger value="history">History</TabsTrigger>
                </TabsList>
                
                <TabsContent value="details" className="pt-4">
                  <div className="space-y-6">
                    {/* Service and Location Info */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <h3 className="text-sm font-medium text-muted-foreground">Service Information</h3>
                        <div className="bg-muted/30 p-4 rounded-lg space-y-4">
                          <div>
                            <p className="text-sm font-medium mb-1">Service Type</p>
                            {getServiceTypeBadge(shift.serviceType)}
                          </div>
                          
                          <div>
                            <p className="text-sm font-medium mb-1">Shift Type</p>
                            <p className="text-sm">
                              {shift.shiftType.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                            </p>
                          </div>
                          
                          <div>
                            <p className="text-sm font-medium mb-1">Requires Supervision</p>
                            <p className="text-sm">{shift.requiresSupervision ? "Yes" : "No"}</p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="space-y-4">
                        <h3 className="text-sm font-medium text-muted-foreground">Location Information</h3>
                        <div className="bg-muted/30 p-4 rounded-lg space-y-4">
                          <div>
                            <p className="text-sm font-medium mb-1">Location Type</p>
                            <p className="text-sm">
                              {shift.locationType.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                            </p>
                          </div>
                          
                          <div>
                            <p className="text-sm font-medium mb-1">Address</p>
                            <div className="flex items-start gap-2">
                              <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
                              <p className="text-sm">{shift.address}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    {/* Date and Time */}
                    <div className="space-y-4">
                      <h3 className="text-sm font-medium text-muted-foreground">Date and Time</h3>
                      <div className="bg-muted/30 p-4 rounded-lg">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <p className="text-sm font-medium mb-1">Date</p>
                            <div className="flex items-center gap-2">
                              <Calendar className="h-4 w-4 text-muted-foreground" />
                              <p className="text-sm">
                                {formatDateWithDay(shift.startTime)}
                              </p>
                            </div>
                          </div>
                          
                          <div>
                            <p className="text-sm font-medium mb-1">Time</p>
                            <div className="flex items-center gap-2">
                              <Clock className="h-4 w-4 text-muted-foreground" />
                              <p className="text-sm">
                                {formatTime(shift.startTime)} - {formatTime(shift.endTime)}
                              </p>
                            </div>
                          </div>
                          
                          <div>
                            <p className="text-sm font-medium mb-1">Duration</p>
                            <div className="flex items-center gap-2">
                              <CalendarClock className="h-4 w-4 text-muted-foreground" />
                              <p className="text-sm">
                                {formatDuration(shift.startTime, shift.endTime)}
                              </p>
                            </div>
                          </div>
                          
                          {shift.recurrence.pattern !== "none" && (
                            <div>
                              <p className="text-sm font-medium mb-1">Recurrence</p>
                              <div className="flex items-center gap-2">
                                <RepeatIcon className="h-4 w-4 text-muted-foreground" />
                                <p className="text-sm capitalize">
                                  {shift.recurrence.pattern}
                                  {shift.recurrence.occurrences ? ` (${shift.recurrence.occurrences} occurrences)` : ""}
                                </p>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="instructions" className="pt-4">
                  <div className="space-y-6">
                    <div className="bg-muted/30 p-4 rounded-lg">
                      <h3 className="text-sm font-medium mb-2">Special Instructions</h3>
                      {shift.specialInstructions ? (
                        <p className="text-sm whitespace-pre-wrap">{shift.specialInstructions}</p>
                      ) : (
                        <p className="text-sm text-muted-foreground italic">No special instructions provided.</p>
                      )}
                    </div>
                    
                    <div className="bg-yellow-50 border border-yellow-100 rounded-md p-4">
                      <h3 className="text-sm font-medium text-yellow-800 mb-2">Notes for Support Worker</h3>
                      <p className="text-sm text-yellow-700">
                        Please ensure you arrive on time and bring all necessary items mentioned in the special instructions.
                        If you need to reschedule or cancel, please do so at least 24 hours in advance.
                      </p>
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="history" className="pt-4">
                  <div className="space-y-4">
                    <div className="bg-muted/30 p-4 rounded-lg">
                      <h3 className="text-sm font-medium mb-4">Shift History</h3>
                      <div className="space-y-4">
                        <div className="flex items-start gap-3">
                          <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                            <Calendar className="h-4 w-4 text-blue-700" />
                          </div>
                          <div>
                            <p className="text-sm font-medium">Shift Created</p>
                            <p className="text-xs text-muted-foreground">
                              {formatDateTime(shift.createdAt)}
                            </p>
                          </div>
                        </div>
                        
                        {shift.status !== "open" && (
                          <div className="flex items-start gap-3">
                            <div className="h-8 w-8 rounded-full bg-yellow-100 flex items-center justify-center flex-shrink-0">
                              <Clock className="h-4 w-4 text-yellow-700" />
                            </div>
                            <div>
                              <p className="text-sm font-medium">Status Updated to "{shift.status.charAt(0).toUpperCase() + shift.status.slice(1)}"</p>
                              <p className="text-xs text-muted-foreground">
                                {formatDateTime(shift.updatedAt)}
                              </p>
                            </div>
                          </div>
                        )}
                        
                        {(shift.status === "completed" || shift.status === "noShow") && (
                          <div className="flex items-start gap-3">
                            <div className={`h-8 w-8 rounded-full ${shift.status === "completed" ? "bg-green-100" : "bg-red-100"} flex items-center justify-center flex-shrink-0`}>
                              {shift.status === "completed" ? (
                                <Calendar className="h-4 w-4 text-green-700" />
                              ) : (
                                <AlertCircle className="h-4 w-4 text-red-700" />
                              )}
                            </div>
                            <div>
                              <p className="text-sm font-medium">Shift {shift.status === "completed" ? "Completed" : "Marked as No-Show"}</p>
                              <p className="text-xs text-muted-foreground">
                                {formatDateTime(shift.updatedAt)}
                              </p>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-4">
              <CardTitle>Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-3">
                <Button variant="outline">
                  <MessageCircle className="h-4 w-4 mr-2" />
                  Message Participant
                </Button>
                
                <Button variant="outline">
                  <MessageCircle className="h-4 w-4 mr-2" />
                  Message Support Worker
                </Button>
                
                <Button variant="outline">
                  <Calendar className="h-4 w-4 mr-2" />
                  View Series
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Sidebar - 1/3 width on desktop */}
        <div className="space-y-6">
          {/* Participant Card */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Participant</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4 mb-4">
                <Avatar className="h-12 w-12">
                  <AvatarFallback>
                    {shift.participantId.firstName.charAt(0)}
                    {shift.participantId.lastName.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-medium">{getFullName(shift.participantId)}</h3>
                  <p className="text-sm text-muted-foreground">{shift.organizationId.name}</p>
                </div>
              </div>
              
              <ul className="space-y-3">
                <li className="flex items-center gap-3">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">{shift.participantId.email}</span>
                </li>
                
                <li className="flex items-center gap-3">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">{shift.participantId.phone}</span>
                </li>
              </ul>
              
              <div className="mt-4">
                <Button variant="outline" className="w-full">
                  <UserCircle className="h-4 w-4 mr-2" />
                  View Participant Profile
                </Button>
              </div>
            </CardContent>
          </Card>
          
          {/* Support Worker Card */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Support Worker</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4 mb-4">
                {shift.workerId.profileImage ? (
                  <Avatar className="h-12 w-12">
                    <AvatarImage 
                      src={shift.workerId.profileImage}
                      alt={getFullName(shift.workerId)}
                    />
                    <AvatarFallback>
                      {shift.workerId.firstName.charAt(0)}
                      {shift.workerId.lastName.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                ) : (
                  <Avatar className="h-12 w-12">
                    <AvatarFallback>
                      {shift.workerId.firstName.charAt(0)}
                      {shift.workerId.lastName.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                )}
                <div>
                  <h3 className="font-medium">{getFullName(shift.workerId)}</h3>
                  <p className="text-sm text-muted-foreground">Support Worker</p>
                </div>
              </div>
              
              <ul className="space-y-3">
                <li className="flex items-center gap-3">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">{shift.workerId.email}</span>
                </li>
                
                <li className="flex items-center gap-3">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">{shift.workerId.phone}</span>
                </li>
              </ul>
              
              <div className="mt-4 space-y-2">
                <Button variant="outline" className="w-full">
                  <UserCircle className="h-4 w-4 mr-2" />
                  View Worker Profile
                </Button>
                
                <Button variant="outline" className="w-full">
                  <Calendar className="h-4 w-4 mr-2" />
                  View Worker Schedule
                </Button>
              </div>
            </CardContent>
          </Card>
          
          {/* System Info Card */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">System Information</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3 text-sm">
                <li className="flex justify-between">
                  <span className="text-muted-foreground">Shift ID:</span>
                  <span className="font-mono">{shift.shiftId}</span>
                </li>
                
                <li className="flex justify-between">
                  <span className="text-muted-foreground">Created:</span>
                  <span>{formatDate(shift.createdAt)}</span>
                </li>
                
                <li className="flex justify-between">
                  <span className="text-muted-foreground">Last Updated:</span>
                  <span>{formatDate(shift.updatedAt)}</span>
                </li>
                
                <li className="flex justify-between">
                  <span className="text-muted-foreground">Database ID:</span>
                  <span className="font-mono truncate max-w-[180px]">{shift._id}</span>
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}