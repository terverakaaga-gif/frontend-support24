// pages/admin/TimesheetDetail.tsx
import React, { useState } from "react";
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
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import { toast } from "sonner";

// Import our types and hooks
import { useGetTimesheet } from "@/hooks/useTimesheetHooks";
import { 
  Timesheet,
  SERVICE_TYPE_LABELS,
  TIMESHEET_STATUS_CONFIG
} from "@/entities/Timesheet";

const TimesheetDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("details");
  const [processingPayment, setProcessingPayment] = useState(false);
  const [processingApproval, setProcessingApproval] = useState(false);

  // API call to get timesheet details
  const { data: timesheet, isLoading, error } = useGetTimesheet(id || '', !!id);

  const handleGoBack = () => {
    navigate('/admin/timesheets');
  };

  const handleApproveTimesheet = () => {
    if (!timesheet) return;
    
    setProcessingApproval(true);
    // TODO: Implement actual API call
    setTimeout(() => {
      setProcessingApproval(false);
      toast.success("Timesheet approved successfully");
    }, 1000);
  };

  const handleRejectTimesheet = () => {
    if (!timesheet) return;
    
    setProcessingApproval(true);
    // TODO: Implement actual API call
    setTimeout(() => {
      setProcessingApproval(false);
      toast.success("Timesheet rejected");
    }, 1000);
  };

  const handleProcessPayment = () => {
    if (!timesheet) return;
    
    setProcessingPayment(true);
    // TODO: Implement actual API call
    setTimeout(() => {
      setProcessingPayment(false);
      toast.success(`Payment of ${formatCurrency(timesheet.totalAmount)} processed successfully`);
    }, 1500);
  };

  // Helper functions
  const formatTime = (dateString: string) => format(new Date(dateString), "h:mm a");
  const formatDate = (dateString: string) => format(new Date(dateString), "MMM d, yyyy");
  const formatDateWithDay = (dateString: string) => format(new Date(dateString), "EEEE, MMMM d, yyyy");
  const formatDateTime = (dateString: string) => format(new Date(dateString), "PPpp");
  const getFullName = (user: { firstName: string; lastName: string }) => `${user.firstName} ${user.lastName}`;
  
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
    if (isPaid) {
      return (
        <Badge variant="outline" className="bg-green-100 text-green-800 border-green-200 text-sm py-1 px-3 flex items-center">
          <CheckCircle className="h-4 w-4 mr-2" />
          Paid
        </Badge>
      );
    }
    
    const config = TIMESHEET_STATUS_CONFIG[status as keyof typeof TIMESHEET_STATUS_CONFIG];
    if (!config) {
      return (
        <Badge variant="outline" className="bg-gray-100 text-gray-800 border-gray-200 text-sm py-1 px-3 flex items-center">
          <Clock className="h-4 w-4 mr-2" />
          {status.charAt(0).toUpperCase() + status.slice(1)}
        </Badge>
      );
    }
    
    return (
      <Badge variant={config.variant} className="text-sm py-1 px-3 flex items-center">
        <Clock className="h-4 w-4 mr-2" />
        {config.label}
      </Badge>
    );
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="container mx-auto py-6 max-w-6xl">
        <div className="flex items-center mb-6">
          <Button variant="ghost" size="sm" onClick={handleGoBack} className="mr-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Timesheets
          </Button>
          <h1 className="text-2xl font-bold">Loading Timesheet...</h1>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <Skeleton className="h-6 w-1/3" />
                <Skeleton className="h-4 w-1/2" />
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <Skeleton className="h-32 w-full" />
                  <Skeleton className="h-32 w-full" />
                </div>
              </CardContent>
            </Card>
          </div>
          <div className="space-y-6">
            {Array.from({ length: 3 }).map((_, i) => (
              <Card key={i}>
                <CardHeader>
                  <Skeleton className="h-5 w-1/2" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-24 w-full" />
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="container mx-auto py-6 max-w-6xl">
        <Card className="max-w-4xl mx-auto">
          <CardHeader>
            <div className="flex items-center">
              <Button variant="ghost" size="sm" onClick={handleGoBack} className="mr-4">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
              <CardTitle>Error Loading Timesheet</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-red-600">There was an error loading the timesheet details. Please try again.</p>
          </CardContent>
          <CardFooter>
            <Button onClick={handleGoBack}>Return to Timesheets</Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  // Not found state
  if (!timesheet) {
    return (
      <div className="container mx-auto py-6 max-w-6xl">
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
      </div>
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
                            <p className="text-sm">
                              {SERVICE_TYPE_LABELS[timesheet.shiftId.serviceType] || timesheet.shiftId.serviceType}
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
                          
                          {timesheet.distanceTravelKm > 0 && (
                            <div>
                              <p className="text-sm font-medium mb-1">Travel Distance</p>
                              <div className="flex items-center gap-2">
                                <MapPin className="h-4 w-4 text-muted-foreground" />
                                <p className="text-sm">
                                  {timesheet.distanceTravelKm} km @ {formatCurrency(timesheet.distanceTravelRate)}/km
                                  <span className="text-xs text-muted-foreground ml-2">
                                    = {formatCurrency(timesheet.distanceTravelAmount)}
                                  </span>
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

                    {/* Rejection Reason (if applicable) */}
                    {timesheet.status === 'rejected' && timesheet.rejectionReason && (
                      <div className="space-y-4">
                        <h3 className="text-sm font-medium text-muted-foreground">Rejection Reason</h3>
                        <div className="bg-red-50 border border-red-200 p-4 rounded-lg">
                          <p className="text-sm text-red-800">{timesheet.rejectionReason}</p>
                        </div>
                      </div>
                    )}
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
                              <TableHead>Payer</TableHead>
                              <TableHead className="text-right">Amount</TableHead>
                              <TableHead className="text-right">Receipt</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {timesheet.expenses.map((expense) => (
                              <TableRow key={expense._id}>
                                <TableCell className="font-medium">{expense.title}</TableCell>
                                <TableCell>{expense.description}</TableCell>
                                <TableCell>
                                  <Badge variant={expense.payer === 'participant' ? 'default' : 'secondary'}>
                                    {expense.payer === 'participant' ? 'Participant' : 'Worker'}
                                  </Badge>
                                </TableCell>
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
                              <TableCell colSpan={3} className="text-right font-medium">
                                <div className="space-y-1">
                                  <div>Participant Expenses: {formatCurrency(timesheet.participantExpensesTotal)}</div>
                                  <div>Worker Expenses: {formatCurrency(timesheet.workerExpensesTotal)}</div>
                                </div>
                              </TableCell>
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
                              <TableCell className="font-medium">
                                <div>
                                  <div>{calc.name}</div>
                                  <div className="text-xs text-muted-foreground">
                                    {calc.rateTimeBandId.code}
                                    {calc.rateTimeBandId.isWeekend && " (Weekend)"}
                                    {calc.rateTimeBandId.isPublicHoliday && " (Holiday)"}
                                  </div>
                                </div>
                              </TableCell>
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
                        {timesheet.distanceTravelAmount > 0 && (
                          <div className="flex justify-between items-center">
                            <span className="text-sm">Travel ({timesheet.distanceTravelKm} km):</span>
                            <span className="text-sm font-medium">{formatCurrency(timesheet.distanceTravelAmount)}</span>
                          </div>
                        )}
                        {/* <div className="flex justify-between items-center">
                          <span className="text-sm">Expenses:</span>
                          <span className="text-sm font-medium">{formatCurrency(timesheet.totalExpenses)}</span>
                        </div> */}
                        <Separator className="my-2" />
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-medium">Total Amount:</span>
                          <span className="text-base font-bold text-green-700">{formatCurrency(timesheet.totalAmount)}</span>
                        </div>
                        {/* <div className="flex justify-between items-center">
                          <span className="text-sm font-medium">Grand Total:</span>
                          <span className="text-base font-bold text-green-700">{formatCurrency(timesheet.grandTotal)}</span>
                        </div> */}
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
                {/* {timesheet.status === 'pending' && !timesheet.isPaid && (
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
                )} */}
                
                {/* {timesheet.status === 'approved' && !timesheet.isPaid && (
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
                )} */}
                
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
                <Button variant="outline" className="w-full" onClick={() => navigate(`/admin/participants/${timesheet.participantId._id}`)}>
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
                <Button variant="outline" className="w-full" onClick={() => navigate(`/admin/support-workers/${timesheet.workerId._id}`)}>
                  <UserCircle className="h-4 w-4 mr-2" />
                  View Worker Profile
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
                
                {timesheet.distanceTravelAmount > 0 && (
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Travel:</span>
                    <span className="text-sm font-medium">{formatCurrency(timesheet.distanceTravelAmount)}</span>
                  </div>
                )}
                
                {/* <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Expenses:</span>
                  <span className="text-sm font-medium">{formatCurrency(timesheet.totalExpenses)}</span>
                </div> */}
                
                <Separator />
                
                <div className="flex justify-between">
                  <span className="text-sm font-medium">Total:</span>
                  <span className="text-base font-bold text-green-700">{formatCurrency(timesheet.totalAmount)}</span>
                </div>
                
                {/* <div className="flex justify-between">
                  <span className="text-sm font-medium">Grand Total:</span>
                  <span className="text-base font-bold text-green-700">{formatCurrency(timesheet.grandTotal)}</span>
                </div> */}
                
                {/* <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Status:</span>
                  <span className="text-sm font-medium">
                    {timesheet.isPaid ? (
                      <span className="text-green-600">Paid</span>
                    ) : (
                      <span className="text-yellow-600">Unpaid</span>
                    )}
                  </span>
                </div> */}
                
                {/* {timesheet.isPaid && (
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Payment Date:</span>
                    <span className="text-sm">{formatDate(timesheet.updatedAt)}</span>
                  </div>
                )} */}

                {timesheet.approvedAt && (
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Approved:</span>
                    <span className="text-sm">{formatDate(timesheet.approvedAt)}</span>
                  </div>
                )}
              </div>
              
              {/* {timesheet.status === 'approved' && !timesheet.isPaid && (
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
              )} */}
            </CardContent>
          </Card>
          
          {/* System Info Card */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">System Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 text-sm">
                {/* <div className="flex justify-between">
                  <span className="text-muted-foreground">Timesheet ID:</span>
                  <span className="font-mono text-xs">{timesheet._id}</span>
                </div> */}
                
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
                  <span className="font-mono text-xs truncate max-w-[150px]">{timesheet.shiftId.shiftId}</span>
                </div>

                {timesheet.approvedBy && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Approved By:</span>
                    <span className="font-mono text-xs">{timesheet.approvedBy}</span>
                  </div>
                )}

                <div className="flex justify-between">
                  <span className="text-muted-foreground">Multi-Worker:</span>
                  <span>{timesheet.isMultiWorkerShift ? 'Yes' : 'No'}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default TimesheetDetail;