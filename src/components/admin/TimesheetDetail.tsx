import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { format } from "date-fns";
import { 
  ArrowLeft, 
  Clock, 
  Calendar, 
  MapPin, 
  DollarSign, 
  Receipt, 
  CheckCircle,
  AlertCircle,
  UserCircle,
  Building,
  FileText,
  ExternalLink,
  ClipboardCheck
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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import { toast } from "@/hooks/use-toast";

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

export function TimesheetDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [timesheet, setTimesheet] = useState<Timesheet | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("details");
  const [processingPayment, setProcessingPayment] = useState(false);
  const [processingApproval, setProcessingApproval] = useState(false);

  useEffect(() => {
    // Simulate API call to fetch timesheet details
    const fetchTimesheetDetails = () => {
      setLoading(true);
      setTimeout(() => {
        const found = mockTimesheets.find(t => t._id === id) || null;
        setTimesheet(found);
        setLoading(false);
      }, 500);
    };

    fetchTimesheetDetails();
  }, [id]);

  const handleGoBack = () => {
    navigate('/admin/timesheets');
  };

  const handleApproveTimesheet = () => {
    if (!timesheet) return;
    
    setProcessingApproval(true);
    // Simulate API call
    setTimeout(() => {
      setTimesheet({
        ...timesheet,
        status: 'approved',
        updatedAt: new Date().toISOString()
      });
      setProcessingApproval(false);
      toast({
        title: "Timesheet Approved",
        description: "The timesheet has been approved successfully.",
      });
    }, 1000);
  };

  const handleRejectTimesheet = () => {
    if (!timesheet) return;
    
    setProcessingApproval(true);
    // Simulate API call
    setTimeout(() => {
      setTimesheet({
        ...timesheet,
        status: 'rejected',
        updatedAt: new Date().toISOString()
      });
      setProcessingApproval(false);
      toast({
        title: "Timesheet Rejected",
        description: "The timesheet has been rejected.",
      });
    }, 1000);
  };

  const handleProcessPayment = () => {
    if (!timesheet) return;
    
    setProcessingPayment(true);
    // Simulate API call
    setTimeout(() => {
      setTimesheet({
        ...timesheet,
        isPaid: true,
        updatedAt: new Date().toISOString()
      });
      setProcessingPayment(false);
      toast({
        title: "Payment Processed",
        description: `Payment of ${formatCurrency(timesheet.totalAmount)} has been processed successfully.`,
      });
    }, 1500);
  };

  // Helper functions
  const formatTime = (dateString: string) => format(new Date(dateString), "h:mm a");
  const formatDate = (dateString: string) => format(new Date(dateString), "MMM d, yyyy");
  const formatDateWithDay = (dateString: string) => format(new Date(dateString), "EEEE, MMMM d, yyyy");
  const formatDateTime = (dateString: string) => format(new Date(dateString), "PPpp");
  const getFullName = (user: User) => `${user.firstName} ${user.lastName}`;
  
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
  
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    }).format(amount);
  };

  // Get status badge component with appropriate styling
  const getStatusBadge = (status: string, isPaid: boolean) => {
    // If paid, show paid badge regardless of status
    if (isPaid) {
      return (
        <Badge variant="outline" className="bg-green-100 text-green-800 border-green-200 text-sm py-1 px-3 flex items-center">
          <CheckCircle className="h-4 w-4 mr-2" />
          Paid
        </Badge>
      );
    }
    
    const statusMap: Record<string, { className: string, label: string, icon: JSX.Element }> = {
      'pending': { 
        className: "bg-yellow-100 text-yellow-800 border-yellow-200", 
        label: "Pending Approval",
        icon: <Clock className="h-4 w-4 mr-2" />
      },
      'approved': { 
        className: "bg-blue-100 text-blue-800 border-blue-200", 
        label: "Approved - Awaiting Payment",
        icon: <CheckCircle className="h-4 w-4 mr-2" />
      },
      'rejected': { 
        className: "bg-red-100 text-red-800 border-red-200", 
        label: "Rejected",
        icon: <AlertCircle className="h-4 w-4 mr-2" />
      }
    };
    
    const { className, label, icon } = statusMap[status] || { 
      className: "bg-gray-100 text-gray-800 border-gray-200", 
      label: status.charAt(0).toUpperCase() + status.slice(1),
      icon: <Clock className="h-4 w-4 mr-2" />
    };
    
    return (
      <Badge variant="outline" className={`${className} text-sm py-1 px-3 flex items-center`}>
        {icon}
        {label}
      </Badge>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!timesheet) {
    return (
      <Card className="max-w-4xl mx-auto">
        <CardHeader>
          <div className="flex items-center">
            <Button variant="ghost" size="sm" onClick={handleGoBack} className="mr-4">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            <CardTitle>Timesheet Not Found</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <p>The timesheet you're looking for could not be found.</p>
        </CardContent>
        <CardFooter>
          <Button onClick={handleGoBack}>Return to Timesheets</Button>
        </CardFooter>
      </Card>
    );
  }

  return (
    <div className="container mx-auto py-6 max-w-6xl">
      <div className="flex items-center mb-6">
        <Button variant="ghost" size="sm" onClick={handleGoBack} className="mr-4">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Timesheets
        </Button>
        <h1 className="text-2xl font-bold">Timesheet Details</h1>
        <div className="ml-auto flex items-center gap-2">
          {getStatusBadge(timesheet.status, timesheet.isPaid)}
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Main content - 2/3 width on desktop */}
        <div className="md:col-span-2 space-y-6">
          <Card>
            <CardHeader className="pb-4">
              <div className="flex flex-col gap-1">
                <div className="flex items-center justify-between">
                  <CardTitle>
                    Shift {timesheet.shiftIdRef}
                  </CardTitle>
                </div>
                <CardDescription className="flex items-center">
                  <Building className="h-4 w-4 mr-2" />
                  {timesheet.organizationId.name}
                </CardDescription>
              </div>
            </CardHeader>
            <CardContent>
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="w-full grid grid-cols-3">
                  <TabsTrigger value="details">Details</TabsTrigger>
                  <TabsTrigger value="expenses">Expenses</TabsTrigger>
                  <TabsTrigger value="calculations">Calculations</TabsTrigger>
                </TabsList>
                
                <TabsContent value="details" className="pt-4">
                  <div className="space-y-6">
                    {/* Shift and Time Info */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <h3 className="text-sm font-medium text-muted-foreground">Shift Information</h3>
                        <div className="bg-muted/30 p-4 rounded-lg space-y-4">
                          <div>
                            <p className="text-sm font-medium mb-1">Shift ID</p>
                            <p className="text-sm font-mono">{timesheet.shiftIdRef}</p>
                          </div>
                          
                          <div>
                            <p className="text-sm font-medium mb-1">Service Type</p>
                            <p className="text-sm capitalize">
                              {timesheet.shiftId.serviceType.replace(/([A-Z])/g, ' $1').toLowerCase()}
                            </p>
                          </div>
                          
                          <div>
                            <p className="text-sm font-medium mb-1">Date</p>
                            <p className="text-sm">
                              {formatDateWithDay(timesheet.actualStartTime)}
                            </p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="space-y-4">
                        <h3 className="text-sm font-medium text-muted-foreground">Time Information</h3>
                        <div className="bg-muted/30 p-4 rounded-lg space-y-4">
                          <div>
                            <p className="text-sm font-medium mb-1">Scheduled Time</p>
                            <div className="flex items-center gap-2">
                              <Clock className="h-4 w-4 text-muted-foreground" />
                              <p className="text-sm">
                                {formatTime(timesheet.scheduledStartTime)} - {formatTime(timesheet.scheduledEndTime)}
                                <span className="text-xs text-muted-foreground ml-2">
                                  ({formatDuration(timesheet.scheduledStartTime, timesheet.scheduledEndTime)})
                                </span>
                              </p>
                            </div>
                          </div>
                          
                          <div>
                            <p className="text-sm font-medium mb-1">Actual Time</p>
                            <div className="flex items-center gap-2">
                              <Clock className="h-4 w-4 text-muted-foreground" />
                              <p className="text-sm">
                                {formatTime(timesheet.actualStartTime)} - {formatTime(timesheet.actualEndTime)}
                                <span className="text-xs text-muted-foreground ml-2">
                                  ({formatDuration(timesheet.actualStartTime, timesheet.actualEndTime)})
                                </span>
                              </p>
                            </div>
                          </div>
                          
                          {timesheet.extraTime > 0 && (
                            <div>
                              <p className="text-sm font-medium mb-1">Extra Time</p>
                              <div className="flex items-center gap-2">
                                <Clock className="h-4 w-4 text-blue-500" />
                                <p className="text-sm text-blue-700">
                                  {timesheet.extraTime} minutes
                                </p>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    {/* Notes */}
                    <div className="space-y-4">
                      <h3 className="text-sm font-medium text-muted-foreground">Worker Notes</h3>
                      <div className="bg-muted/30 p-4 rounded-lg">
                        {timesheet.notes ? (
                          <p className="text-sm whitespace-pre-wrap">{timesheet.notes}</p>
                        ) : (
                          <p className="text-sm text-muted-foreground italic">No notes provided.</p>
                        )}
                      </div>
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="expenses" className="pt-4">
                  <div className="space-y-4">
                    <h3 className="text-sm font-medium text-muted-foreground">Claimed Expenses</h3>
                    
                    {timesheet.expenses.length === 0 ? (
                      <div className="bg-muted/30 p-4 rounded-lg">
                        <p className="text-sm text-muted-foreground italic">No expenses claimed for this shift.</p>
                      </div>
                    ) : (
                      <div className="rounded-md border">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead className="w-[200px]">Item</TableHead>
                              <TableHead>Description</TableHead>
                              <TableHead className="text-right">Amount</TableHead>
                              <TableHead className="text-right">Receipt</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {timesheet.expenses.map((expense) => (
                              <TableRow key={expense._id}>
                                <TableCell className="font-medium">{expense.title}</TableCell>
                                <TableCell>{expense.description}</TableCell>
                                <TableCell className="text-right">{formatCurrency(expense.amount)}</TableCell>
                                <TableCell className="text-right">
                                  {expense.receiptUrl ? (
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      asChild
                                    >
                                      <a href={expense.receiptUrl} target="_blank" rel="noopener noreferrer">
                                        <ExternalLink className="h-4 w-4 mr-2" />
                                        View Receipt
                                      </a>
                                    </Button>
                                  ) : (
                                    <span className="text-sm text-muted-foreground">No receipt</span>
                                  )}
                                </TableCell>
                              </TableRow>
                            ))}
                            <TableRow>
                              <TableCell colSpan={2} className="text-right font-medium">Total Expenses:</TableCell>
                              <TableCell className="text-right font-medium">
                                {formatCurrency(timesheet.totalExpenses)}
                              </TableCell>
                              <TableCell></TableCell>
                            </TableRow>
                          </TableBody>
                        </Table>
                      </div>
                    )}
                  </div>
                </TabsContent>
                
                <TabsContent value="calculations" className="pt-4">
                  <div className="space-y-6">
                    <h3 className="text-sm font-medium text-muted-foreground">Rate Calculations</h3>
                    
                    <div className="rounded-md border">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead className="w-[200px]">Rate Type</TableHead>
                            <TableHead>Hourly Rate</TableHead>
                            <TableHead>Hours</TableHead>
                            <TableHead className="text-right">Amount</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {timesheet.rateCalculations.map((calc) => (
                            <TableRow key={calc._id}>
                              <TableCell className="font-medium">{calc.name}</TableCell>
                              <TableCell>{formatCurrency(calc.hourlyRate)}/hr</TableCell>
                              <TableCell>{calc.hours.toFixed(2)}</TableCell>
                              <TableCell className="text-right">{formatCurrency(calc.amount)}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                    
                    <div className="bg-muted/30 p-4 rounded-lg">
                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-sm">Subtotal (Labor):</span>
                          <span className="text-sm font-medium">{formatCurrency(timesheet.subtotal)}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm">Expenses:</span>
                          <span className="text-sm font-medium">{formatCurrency(timesheet.totalExpenses)}</span>
                        </div>
                        <Separator className="my-2" />
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-medium">Total Amount:</span>
                          <span className="text-base font-bold text-green-700">{formatCurrency(timesheet.totalAmount)}</span>
                        </div>
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
                {timesheet.status === 'pending' && !timesheet.isPaid && (
                  <>
                    <Button 
                      onClick={handleApproveTimesheet}
                      disabled={processingApproval}
                    >
                      {processingApproval ? (
                        <>
                          <div className="animate-spin h-4 w-4 border-2 border-current border-t-transparent rounded-full mr-2"></div>
                          Processing...
                        </>
                      ) : (
                        <>
                          <CheckCircle className="h-4 w-4 mr-2" />
                          Approve Timesheet
                        </>
                      )}
                    </Button>
                    
                    <Button 
                      variant="outline"
                      onClick={handleRejectTimesheet}
                      disabled={processingApproval}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      <AlertCircle className="h-4 w-4 mr-2" />
                      Reject Timesheet
                    </Button>
                  </>
                )}
                
                {timesheet.status === 'approved' && !timesheet.isPaid && (
                  <Button 
                    onClick={handleProcessPayment}
                    disabled={processingPayment}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    {processingPayment ? (
                      <>
                        <div className="animate-spin h-4 w-4 border-2 border-current border-t-transparent rounded-full mr-2"></div>
                        Processing Payment...
                      </>
                    ) : (
                      <>
                        <DollarSign className="h-4 w-4 mr-2" />
                        Process Payment ({formatCurrency(timesheet.totalAmount)})
                      </>
                    )}
                  </Button>
                )}
                
                {timesheet.isPaid && (
                  <Button variant="outline">
                    <FileText className="h-4 w-4 mr-2" />
                    Generate Invoice
                  </Button>
                )}
                
                <Button variant="outline" onClick={() => navigate(`/admin/shifts/${timesheet.shiftId._id}`)}>
                  <Calendar className="h-4 w-4 mr-2" />
                  View Original Shift
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
                    {timesheet.participantId.firstName.charAt(0)}
                    {timesheet.participantId.lastName.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-medium">{getFullName(timesheet.participantId)}</h3>
                  <p className="text-sm text-muted-foreground">{timesheet.organizationId.name}</p>
                </div>
              </div>
              
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <UserCircle className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">{timesheet.participantId.email}</span>
                </div>
                
                <div className="flex items-center gap-3">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">{timesheet.participantId.phone}</span>
                </div>
              </div>
              
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
                {timesheet.workerId.profileImage ? (
                  <Avatar className="h-12 w-12">
                    <AvatarImage 
                      src={timesheet.workerId.profileImage}
                      alt={getFullName(timesheet.workerId)}
                    />
                    <AvatarFallback>
                      {timesheet.workerId.firstName.charAt(0)}
                      {timesheet.workerId.lastName.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                ) : (
                  <Avatar className="h-12 w-12">
                    <AvatarFallback>
                      {timesheet.workerId.firstName.charAt(0)}
                      {timesheet.workerId.lastName.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                )}
                <div>
                  <h3 className="font-medium">{getFullName(timesheet.workerId)}</h3>
                  <p className="text-sm text-muted-foreground">Support Worker</p>
                </div>
              </div>
              
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <UserCircle className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">{timesheet.workerId.email}</span>
                </div>
                
                <div className="flex items-center gap-3">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">{timesheet.workerId.phone}</span>
                </div>
              </div>
              
              <div className="mt-4 space-y-2">
                <Button variant="outline" className="w-full">
                  <UserCircle className="h-4 w-4 mr-2" />
                  View Worker Profile
                </Button>
                
                <Button variant="outline" className="w-full">
                  <Clock className="h-4 w-4 mr-2" />
                  View Worker Schedule
                </Button>
              </div>
            </CardContent>
          </Card>
          
          {/* Payment Summary Card */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Payment Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Labor:</span>
                  <span className="text-sm font-medium">{formatCurrency(timesheet.subtotal)}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Expenses:</span>
                  <span className="text-sm font-medium">{formatCurrency(timesheet.totalExpenses)}</span>
                </div>
                
                <Separator />
                
                <div className="flex justify-between">
                  <span className="text-sm font-medium">Total:</span>
                  <span className="text-base font-bold text-green-700">{formatCurrency(timesheet.totalAmount)}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Status:</span>
                  <span className="text-sm font-medium">
                    {timesheet.isPaid ? (
                      <span className="text-green-600">Paid</span>
                    ) : (
                      <span className="text-yellow-600">Unpaid</span>
                    )}
                  </span>
                </div>
                
                {timesheet.isPaid && (
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Payment Date:</span>
                    <span className="text-sm">{formatDate(timesheet.updatedAt)}</span>
                  </div>
                )}
              </div>
              
              {timesheet.status === 'approved' && !timesheet.isPaid && (
                <div className="mt-4">
                  <Button 
                    className="w-full bg-green-600 hover:bg-green-700"
                    onClick={handleProcessPayment}
                    disabled={processingPayment}
                  >
                    {processingPayment ? (
                      <>
                        <div className="animate-spin h-4 w-4 border-2 border-current border-t-transparent rounded-full mr-2"></div>
                        Processing...
                      </>
                    ) : (
                      <>
                        <DollarSign className="h-4 w-4 mr-2" />
                        Process Payment
                      </>
                    )}
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
          
          {/* System Info Card */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">System Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Timesheet ID:</span>
                  <span className="font-mono text-xs">{timesheet._id}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Created:</span>
                  <span>{formatDate(timesheet.createdAt)}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Last Updated:</span>
                  <span>{formatDate(timesheet.updatedAt)}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Shift Reference:</span>
                  <span className="font-mono text-xs truncate max-w-[150px]">{timesheet.shiftId._id}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}