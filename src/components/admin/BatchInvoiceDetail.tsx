import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { format } from "date-fns";

import { 
  Card,
  CardContent,
  CardDescription,
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

// Import our types and hooks
import { 
  useGetBatchInvoice, 
  useDownloadBatchInvoice, 
  useSendBatchInvoiceEmail 
} from "@/hooks/useBatchInvoiceHooks";
import { 
  BatchInvoice,
  BATCH_INVOICE_STATUS_CONFIG,
  BatchInvoiceEmailRequest
} from "@/entities/BatchInvoice";
import { AltArrowLeft, Banknote2, Calendar, ClockCircle, CloudDownload, FileText, Hashtag, History2, Letter, Mailbox, SirenRounded, User, UserCircle, UsersGroupRounded } from "@solar-icons/react";
import { ReceiptIcon } from "../icons";

const BatchInvoiceDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("details");
  const [emailDialogOpen, setEmailDialogOpen] = useState(false);
  const [emailOptions, setEmailOptions] = useState<BatchInvoiceEmailRequest>({
    sendToParticipant: true,
    sendToWorker: true
  });

  // API calls
  const { data: batchInvoice, isLoading, error } = useGetBatchInvoice(id || '', !!id);
  const downloadMutation = useDownloadBatchInvoice();
  const sendEmailMutation = useSendBatchInvoiceEmail();

  const handleGoBack = () => {
    navigate('/admin/batch-invoices');
  };

  const handleDownload = () => {
    if (!batchInvoice) return;
    
    const fileName = `batch-invoice-${batchInvoice.batchNumber}.pdf`;
    downloadMutation.mutate({ 
      batchInvoiceId: batchInvoice._id, 
      fileName 
    });
  };

  const handleSendEmail = () => {
    if (!batchInvoice) return;
    
    sendEmailMutation.mutate({
      batchInvoiceId: batchInvoice._id,
      emailRequest: emailOptions
    }, {
      onSuccess: () => {
        setEmailDialogOpen(false);
        // Reset to default options
        setEmailOptions({
          sendToParticipant: true,
          sendToWorker: true
        });
      }
    });
  };

  // Helper functions
  const formatDate = (dateString: string) => format(new Date(dateString), "MMM d, yyyy");
  const formatDateTime = (dateString: string) => format(new Date(dateString), "PPp");
  const formatTime = (dateString: string) => format(new Date(dateString), "h:mm a");
  const getFullName = (user: { firstName: string; lastName: string }) => `${user.firstName} ${user.lastName}`;
  const getInitials = (user: { firstName: string; lastName: string }) => 
    `${user.firstName.charAt(0)}${user.lastName.charAt(0)}`;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    }).format(amount);
  };

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

  // Get status badge component
  const getStatusBadge = (status: string) => {
    const config = BATCH_INVOICE_STATUS_CONFIG[status as keyof typeof BATCH_INVOICE_STATUS_CONFIG];
    if (!config) {
      return (
        <Badge variant="outline" className="bg-gray-100 text-gray-800 border-gray-200">
          {status}
        </Badge>
      );
    }
    
    return (
      <Badge variant={config.variant} className={cn("text-sm", config.color)}>
        {config.label}
      </Badge>
    );
  };

  // Email status component
  const getEmailStatus = (sent: boolean, sentAt?: string) => {
    if (sent && sentAt) {
      return (
        <div className="flex items-center space-x-2">
          <Badge variant="outline" className="bg-green-100 text-green-800 border-green-200">
            <Mailbox className="h-3 w-3 mr-1" />
            Sent
          </Badge>
          <span className="text-sm text-gray-600">
            {formatDateTime(sentAt)}
          </span>
        </div>
      );
    }
    return (
      <Badge variant="outline" className="bg-gray-100 text-gray-600 border-gray-200">
        <Letter className="h-3 w-3 mr-1" />
        Not Sent
      </Badge>
    );
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="container mx-auto py-6 max-w-6xl">
        <div className="flex items-center mb-6">
          <Button variant="ghost" size="sm" onClick={handleGoBack} className="mr-4">
            <AltArrowLeft className="h-4 w-4 mr-2" />
            Back to Batch Invoices
          </Button>
          <h1 className="text-2xl font-montserrat-bold">Loading Batch Invoice...</h1>
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
  if (error || !batchInvoice) {
    return (
      <div className="container mx-auto py-6 max-w-6xl">
        <div className="flex items-center mb-6">
          <Button variant="ghost" size="sm" onClick={handleGoBack} className="mr-4">
            <AltArrowLeft className="h-4 w-4 mr-2" />
            Back to Batch Invoices
          </Button>
          <h1 className="text-2xl font-montserrat-bold">Batch Invoice Not Found</h1>
        </div>
        
        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <SirenRounded className="h-12 w-12 text-red-500 mx-auto mb-4" />
              <h3 className="text-lg font-montserrat-semibold mb-2">Batch Invoice Not Found</h3>
              <p className="text-gray-600 mb-4">
                The batch invoice you're looking for doesn't exist or has been removed.
              </p>
              <Button onClick={handleGoBack}>
                Go Back to Batch Invoices
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6 max-w-6xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <Button variant="ghost" size="sm" onClick={handleGoBack} className="mr-4">
            <AltArrowLeft className="h-4 w-4 mr-2" />
            Back to Batch Invoices
          </Button>
          <div>
            <h1 className="text-2xl font-montserrat-bold">{batchInvoice.batchNumber}</h1>
            <p className="text-sm text-gray-600">{batchInvoice.invoiceNumber}</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            onClick={handleDownload}
            disabled={downloadMutation.isPending}
          >
            <CloudDownload className="h-4 w-4 mr-2" />
            {downloadMutation.isPending ? 'Downloading...' : 'Download Invoice'}
          </Button>
          <Dialog open={emailDialogOpen} onOpenChange={setEmailDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Letter className="h-4 w-4 mr-2" />
                Letter Email
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Letter Batch Invoice Email</DialogTitle>
                <DialogDescription>
                  Choose who should receive this batch invoice via email.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="participant"
                    checked={emailOptions.sendToParticipant}
                    onCheckedChange={(checked) => 
                      setEmailOptions(prev => ({ ...prev, sendToParticipant: !!checked }))
                    }
                  />
                  <label htmlFor="participant" className="text-sm font-montserrat-semibold">
                    Letter to Participant ({getFullName(batchInvoice.participantId)})
                  </label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="worker"
                    checked={emailOptions.sendToWorker}
                    onCheckedChange={(checked) => 
                      setEmailOptions(prev => ({ ...prev, sendToWorker: !!checked }))
                    }
                  />
                  <label htmlFor="worker" className="text-sm font-montserrat-semibold">
                    Letter to Worker ({getFullName(batchInvoice.workerId)})
                  </label>
                </div>
              </div>
              <DialogFooter>
                <Button 
                  variant="outline" 
                  onClick={() => setEmailDialogOpen(false)}
                  disabled={sendEmailMutation.isPending}
                >
                  Cancel
                </Button>
                <Button 
                  onClick={handleSendEmail}
                  disabled={sendEmailMutation.isPending || (!emailOptions.sendToParticipant && !emailOptions.sendToWorker)}
                >
                  <Letter className="h-4 w-4 mr-2" />
                  {sendEmailMutation.isPending ? 'Sending...' : 'Letter Email'}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Content */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="md:col-span-2">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="details">Details</TabsTrigger>
              <TabsTrigger value="timesheets">Timesheets</TabsTrigger>
              <TabsTrigger value="summary">Summary</TabsTrigger>
            </TabsList>

            <TabsContent value="details" className="space-y-6">
              {/* Basic Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2 text-base">
                    <FileText className="h-4 w-4" />
                    <span>Invoice Information</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-3">
                      <div className="flex items-center space-x-2">
                        <Hashtag className="h-4 w-4 text-gray-1000" />
                        <div>
                          <p className="text-xs text-gray-600">Batch Number</p>
                          <p className="font-montserrat-semibold text-sm">{batchInvoice.batchNumber}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <ReceiptIcon className="h-4 w-4 text-gray-1000" />
                        <div>
                          <p className="text-xs text-gray-600">Invoice Number</p>
                          <p className="font-montserrat-semibold text-sm">{batchInvoice.invoiceNumber}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Calendar className="h-4 w-4 text-gray-1000" />
                        <div>
                          <p className="text-xs text-gray-600">Invoice Period</p>
                          <p className="font-montserrat-semibold text-sm">
                            {formatDate(batchInvoice.startDate)} - {formatDate(batchInvoice.endDate)}
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div className="flex items-center space-x-2">
                        <ClockCircle className="h-4 w-4 text-gray-1000" />
                        <div>
                          <p className="text-xs text-gray-600">Status</p>
                          <div className="mt-1">
                            {getStatusBadge(batchInvoice.status)}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <History2 className="h-4 w-4 text-gray-1000" />
                        <div>
                          <p className="text-xs text-gray-600">Generated At</p>
                          <p className="font-montserrat-semibold text-sm">{formatDateTime(batchInvoice.generatedAt)}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Banknote2 className="h-4 w-4 text-gray-1000" />
                        <div>
                          <p className="text-xs text-gray-600">Total Amount</p>
                          <p className="font-montserrat-bold text-base">{formatCurrency(batchInvoice.invoiceTotal)}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* People Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2 text-base">
                    <UsersGroupRounded className="h-4 w-4" />
                    <span>People</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Worker */}
                    <div className="space-y-3">
                      <h4 className="font-montserrat-semibold text-sm text-gray-900">Support Worker</h4>
                      <div className="flex items-center space-x-3">
                        <Avatar className="h-12 w-12">
                          <AvatarImage src="" alt={getFullName(batchInvoice.workerId)} />
                          <AvatarFallback>{getInitials(batchInvoice.workerId)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-montserrat-semibold text-sm">{getFullName(batchInvoice.workerId)}</p>
                          <p className="text-xs text-gray-600">{batchInvoice.workerId.email}</p>
                          <p className="text-xs text-gray-600">{batchInvoice.workerId.phone}</p>
                        </div>
                      </div>
                    </div>

                    {/* Participant */}
                    <div className="space-y-3">
                      <h4 className="font-montserrat-semibold text-sm text-gray-900">Participant</h4>
                      <div className="flex items-center space-x-3">
                        <Avatar className="h-12 w-12">
                          <AvatarImage src="" alt={getFullName(batchInvoice.participantId)} />
                          <AvatarFallback>{getInitials(batchInvoice.participantId)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-montserrat-semibold text-sm">{getFullName(batchInvoice.participantId)}</p>
                          <p className="text-xs text-gray-600">{batchInvoice.participantId.email}</p>
                          <p className="text-xs text-gray-600">{batchInvoice.participantId.phone}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Email Status */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2 text-base">
                    <Letter className="h-4 w-4" />
                    <span>Email Status</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <User className="h-4 w-4 text-gray-1000" />
                        <span className="text-sm font-montserrat-semibold">Participant Email</span>
                      </div>
                      {getEmailStatus(batchInvoice.sentToParticipant, batchInvoice.participantEmailSentAt)}
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <UserCircle className="h-4 w-4 text-gray-1000" />
                        <span className="text-sm font-montserrat-semibold">Worker Email</span>
                      </div>
                      {getEmailStatus(batchInvoice.sentToWorker, batchInvoice.workerEmailSentAt)}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="timesheets" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">
                    Included Timesheets ({batchInvoice.timesheetIds.length})
                  </CardTitle>
                  <CardDescription>
                    All timesheets included in this batch invoice
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="text-xs">Shift ID</TableHead>
                          <TableHead className="text-xs">Service Type</TableHead>
                          <TableHead className="text-xs">Date & Time</TableHead>
                          <TableHead className="text-xs">Duration</TableHead>
                          <TableHead className="text-xs">Travel</TableHead>
                          <TableHead className="text-xs">Subtotal</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {batchInvoice.timesheetIds.map((timesheet) => (
                          <TableRow key={timesheet._id}>
                            <TableCell className="font-montserrat-semibold text-sm">
                              {timesheet.shiftId.shiftId}
                            </TableCell>
                            <TableCell>
                              <div>
                                <p className="font-montserrat-semibold text-sm">{timesheet.shiftId.serviceTypeId.name}</p>
                                <p className="text-xs text-gray-600">
                                  Code: {timesheet.shiftId.serviceTypeId.code}
                                </p>
                              </div>
                            </TableCell>
                            <TableCell>
                              <div>
                                <p className="font-montserrat-semibold text-sm">
                                  {formatDate(timesheet.actualStartTime)}
                                </p>
                                <p className="text-xs text-gray-600">
                                  {formatTime(timesheet.actualStartTime)} - {formatTime(timesheet.actualEndTime)}
                                </p>
                              </div>
                            </TableCell>
                            <TableCell className="text-sm">
                              {formatDuration(timesheet.actualStartTime, timesheet.actualEndTime)}
                            </TableCell>
                            <TableCell className="text-sm">
                              {formatCurrency(timesheet.distanceTravelAmount)}
                            </TableCell>
                            <TableCell className="font-montserrat-semibold text-sm">
                              {formatCurrency(timesheet.subtotal)}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="summary" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Invoice Summary</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Subtotal:</span>
                      <span className="font-montserrat-semibold text-sm">{formatCurrency(batchInvoice.subtotal)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Travel Expenses:</span>
                      <span className="font-montserrat-semibold text-sm">{formatCurrency(batchInvoice.travelExpenseTotal)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Additional Expenses:</span>
                      <span className="font-montserrat-semibold text-sm">{formatCurrency(batchInvoice.additionalExpensesTotal)}</span>
                    </div>
                    <Separator />
                    <div className="flex justify-between items-center text-base font-montserrat-bold">
                      <span>Total Amount:</span>
                      <span>{formatCurrency(batchInvoice.invoiceTotal)}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button 
                className="w-full" 
                variant="outline"
                onClick={handleDownload}
                disabled={downloadMutation.isPending}
              >
                <CloudDownload className="h-4 w-4 mr-2" />
                {downloadMutation.isPending ? 'Downloading...' : 'Download PDF'}
              </Button>
              <Button 
                className="w-full"
                onClick={() => setEmailDialogOpen(true)}
                disabled={sendEmailMutation.isPending}
              >
                <Letter className="h-4 w-4 mr-2" />
                Letter Email
              </Button>
            </CardContent>
          </Card>

          {/* Status Card */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-600">Current Status:</span>
                  {getStatusBadge(batchInvoice.status)}
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-600">Generated:</span>
                  <span className="text-xs font-montserrat-semibold">{formatDate(batchInvoice.generatedAt)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-600">Last Updated:</span>
                  <span className="text-xs font-montserrat-semibold">{formatDate(batchInvoice.updatedAt)}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Invoice Stats */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Invoice Stats</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-600">Total Timesheets:</span>
                  <span className="text-xs font-montserrat-semibold">{batchInvoice.timesheetIds.length}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-600">Service Types:</span>
                  <span className="text-xs font-montserrat-semibold">
                    {new Set(batchInvoice.timesheetIds.map(t => t.shiftId.serviceTypeId.name)).size}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-600">Total Amount:</span>
                  <span className="text-sm font-montserrat-bold">{formatCurrency(batchInvoice.invoiceTotal)}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default BatchInvoiceDetail; 