import React, { useCallback, useState } from "react";
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
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Eye,
  Magnifer,
  Document,
  ClockCircle,
  Dollar,
  BillList,
  CloseCircle,
  CheckCircle,
} from "@solar-icons/react";

import { useAuth } from "@/contexts/AuthContext";
import { useApproveTimesheet, useGetParticipantTimesheets, useRejectTimesheet } from "@/hooks/useTimesheetHooks";
import {
  TimesheetClientFilters,
  Timesheet,
} from "@/entities/Timesheet";
import Loader from "@/components/Loader";
import GeneralHeader from "@/components/GeneralHeader";
import { pageTitles } from "@/constants/pageTitles";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  getWorkerDisplayName,
  getWorkerInitials,
  getWorkerProfileImage,
} from "@/lib/utils";
import { toast } from "sonner";
import { Spinner } from "@/components/Spinner";

const ParticipantTimesheets: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [filters, setFilters] = useState<
    Omit<TimesheetClientFilters, "participantId">
  >({
    page: 1,
    limit: 10,
    sortField: "createdAt",
    sortDirection: "desc",
  });
   const [processingTimesheet, setProcessingTimesheet] = useState<{
    id: string;
    action: 'approve' | 'reject';
  } | null>(null);

  const {
    data: timesheetData,
    isLoading,
    error,
  } = useGetParticipantTimesheets(user?._id || "", filters, !!user?._id);

  const {mutateAsync:approveTimesheet, isPending:isApprovePending, isSuccess:isApproveSuccess, isError:isApproveError, error:approveError} = useApproveTimesheet()

  const {mutateAsync:rejectTimesheet, isPending:isRejectPending, isSuccess:isRejectSuccess, isError:isRejectError, error:rejectError} = useRejectTimesheet()

  const formatDateShort = (dateString: string) =>
    format(new Date(dateString), "d MMM, yyyy");
  const getFullName = (user: { firstName: string; lastName: string }) =>
    `${user.firstName} ${user.lastName}`;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
    }).format(amount);
  };

  const handleSearchChange = (value: string) => {
    setFilters((prev) => ({
      ...prev,
      search: value || undefined,
      page: 1,
    }));
  };

  const handlePageChange = (page: number) => {
    setFilters((prev) => ({ ...prev, page }));
  };

  const handleViewTimesheet = (id: string) => {
    navigate(`/participant/timesheets/${id}`);
  };

  const handleTimeSheetApproval = useCallback( async (id:string)=>{
    if(!id || processingTimesheet?.id === id){
      return;
    }
    
    setProcessingTimesheet({ id, action: 'approve' });
    
    try {
      await approveTimesheet(id);
      if(isApproveSuccess){
        toast.success('Timesheet approved successfully');
      }
      if (isApproveError){
        toast.error('Timesheet approval failed')
      }
    } finally {
      setProcessingTimesheet(null);
    }
  },[approveTimesheet,isApproveError,isApproveSuccess, processingTimesheet])

  const handleTimeSheetRejection = useCallback( async (id:string)=>{
    if(!id || processingTimesheet?.id === id){
      return;
    }
    
    setProcessingTimesheet({ id, action: 'reject' });
    
    try {
      await rejectTimesheet(id);
      if(isRejectSuccess){
        toast.success('Timesheet rejected successfully');
      }
      if (isRejectError){
        toast.error('Timesheet decline failed')
      }
    } finally {
      setProcessingTimesheet(null);
    }
  },[rejectTimesheet,isRejectError,isRejectSuccess, processingTimesheet])


  if (isLoading) {
    return <Loader />;
  }

  const getStatusBadge = (status: string, isPaid: boolean) => {
    if (isPaid) {
      return (
        <Badge className="bg-green-100 text-green-700 hover:bg-green-100 border-0 font-montserrat-semibold">
          Paid
        </Badge>
      );
    }

    if (status === "pending") {
      return (
        <Badge className="bg-yellow-100 text-yellow-700 hover:bg-yellow-100 border-0 font-montserrat-semibold">
          Pending
        </Badge>
      );
    }

    if (status === "approved") {
      return (
        <Badge className="bg-green-100 text-green-700 hover:bg-green-100 border-0 font-montserrat-semibold">
          Approved
        </Badge>
      );
    }

    if (status === "rejected") {
      return (
        <Badge className="bg-red-100 text-red-700 hover:bg-red-100 border-0 font-montserrat-semibold">
          Rejected
        </Badge>
      );
    }

    return (
      <Badge className="bg-gray-100 text-gray-700 hover:bg-gray-100 border-0 font-montserrat-semibold">
        {status}
      </Badge>
    );
  };

  if (error) {
    return (
      <div className="min-h-screen bg-gray-100 p-6">
        <Card className="border-0 shadow-sm">
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
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="space-y-6">
        {/* Header */}
        <GeneralHeader
          title={pageTitles.participant["/participant/timesheets"].title}
          subtitle={pageTitles.participant["/participant/timesheets"].subtitle}
          user={user}
          onViewProfile={() => {
            navigate(
              Object.keys(pageTitles.participant).find(
                (key) =>
                  key !== "/participant/timesheets" &&
                  pageTitles.participant[key] ===
                    pageTitles.participant["/participant/profile"]
              )
            );
          }}
          onLogout={logout}
        />

        {/* Stats Cards */}
        {timesheetData?.summary && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Total Timesheet */}
            <Card className="border-0 hover:shadow-sm transition-all bg-white">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1 font-montserrat-semibold">
                    <p className="text-sm text-gray-600 mb-2">
                      Total Timesheet
                    </p>
                    <p className="text-3xl font-montserrat-bold text-gray-900">
                      {timesheetData.summary.totalTimesheets}
                    </p>
                    {/* <div className="flex items-center gap-1 mt-2">
                      <ArrowUp size={16} color="#10B981" />
                      <span className="text-xs text-green-600 font-montserrat-semibold">
                        From last month
                      </span>
                    </div> */}
                  </div>
                  <div className="w-12 h-12 rounded-full bg-primary-100 flex items-center justify-center">
                    <Document size={24} className="text-primary" />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Total Hours */}
            <Card className="border-0 hover:shadow-sm transition-all bg-white">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1 font-montserrat-semibold">
                    <p className="text-sm text-gray-600 mb-2">Total Hours</p>
                    <p className="text-3xl font-montserrat-bold text-gray-900">
                      {Math.round(timesheetData.summary.totalHours)}
                    </p>
                    {/* <div className="flex items-center gap-1 mt-2">
                      <ArrowUp size={16} color="#10B981" />
                      <span className="text-xs text-green-600 font-montserrat-semibold">
                        From last 24 Hours
                      </span>
                    </div> */}
                  </div>
                  <div className="w-12 h-12 rounded-full bg-primary-100 flex items-center justify-center">
                    <ClockCircle size={24} className="text-primary" />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Total Amount */}
            <Card className="border-0 hover:shadow-sm transition-all bg-white">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1 font-montserrat-semibold">
                    <p className="text-sm text-gray-600 mb-2">Total Amount</p>
                    <p className="text-3xl text-gray-900 font-montserrat-bold">
                      {formatCurrency(timesheetData.summary.totalAmount)}
                    </p>
                    {/* <div className="flex items-center gap-1 mt-2">
                      <ArrowUp size={16} color="#10B981" />
                      <span className="text-xs text-green-600 font-montserrat-semibold">
                        From last month
                      </span>
                    </div> */}
                  </div>
                  <div className="w-12 h-12 rounded-full bg-primary-100 flex items-center justify-center">
                    <Dollar size={24} className="text-primary" />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Pending Reviews */}
            <Card className="border-0 hover:shadow-sm transition-all bg-white">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1 font-montserrat-semibold">
                    <p className="text-sm text-gray-600 mb-2">
                      Pending Reviews
                    </p>
                    <p className="text-3xl text-gray-900 font-montserrat-bold">
                      {timesheetData.summary.pendingCount}
                    </p>
                    {/* <div className="flex items-center gap-1 mt-2">
                      <ArrowDown size={16} color="#EF4444" />
                      <span className="text-xs text-red-600 font-montserrat-semibold">
                        From Last Month
                      </span>
                    </div> */}
                  </div>
                  <div className="w-12 h-12 rounded-full bg-primary-100 flex items-center justify-center">
                    <ClockCircle size={24} className="text-primary" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Search Bar */}
        <div className="flex items-center justify-between gap-4">
          <div className="flex-1 max-w-md relative">
            <Magnifer className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <Input
              placeholder="Search by worker or shift ID..."
              value={filters.search || ""}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="pl-10 border-gray-200 focus:border-primary-500 bg-white h-11"
            />
          </div>
        </div>

        {/* Table */}
        <Card className="border-0 shadow-sm bg-white">
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
                    <TableRow className="font-montserrat-semibold border-b border-gray-100 hover:bg-transparent">
                      <TableHead className="uppercase">
                        Shift Reference
                      </TableHead>
                      <TableHead className="uppercase">Date</TableHead>
                      <TableHead className="uppercase">Worker</TableHead>
                      <TableHead className="uppercase">Expenses</TableHead>
                      <TableHead className="uppercase">Total</TableHead>
                      <TableHead className="uppercase">Status</TableHead>
                      <TableHead className="uppercase text-right">
                        Actions
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {timesheetData?.timesheets?.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={7} className="h-32 text-center">
                          <div className="flex flex-col items-center justify-center space-y-3">
                            <Document size={48} color="#9CA3AF" />
                            <div>
                              <h3 className="text-base font-montserrat-semibold text-gray-900">
                                No timesheets found
                              </h3>
                              <p className="text-sm text-gray-1000 mt-1">
                                No timesheets have been submitted for your
                                shifts yet.
                              </p>
                            </div>
                          </div>
                        </TableCell>
                      </TableRow>
                    ) : (
                      timesheetData?.timesheets?.map((timesheet: Timesheet) => (
                        <TableRow
                          key={timesheet._id}
                          className="border-b border-gray-100 hover:bg-gray-100/50"
                        >
                          <TableCell>
                            <div className="flex flex-col gap-1">
                              <span className="font-montserrat-semibold text-gray-900 text-sm">
                                {timesheet.shiftIdRef}
                              </span>
                              <span className="text-xs text-gray-1000">
                                {timesheet.organizationId.name}
                              </span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="text-sm text-gray-900">
                              {formatDateShort(timesheet.scheduledStartTime)}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-3">
                              <Avatar className="w-8 h-8">
                                <AvatarImage
                                  src={getWorkerProfileImage(
                                    timesheet.workerId
                                  )}
                                  alt={getWorkerDisplayName(timesheet.workerId)}
                                />
                                <AvatarFallback>
                                  {getWorkerInitials(timesheet.workerId)}
                                </AvatarFallback>
                              </Avatar>
                              <span className="text-sm text-gray-700 font-montserrat-semibold">
                                {getWorkerDisplayName(timesheet.workerId)}
                              </span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <BillList size={24} color="#6B7280" />
                              <div className="flex flex-col">
                                <span className="text-sm font-montserrat-semibold text-gray-900">
                                  {formatCurrency(timesheet.totalExpenses)}
                                </span>
                                <span className="text-xs text-gray-1000">
                                  {timesheet.expenses.length} Item Purchased
                                </span>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <span className="text-sm font-montserrat-bold text-primary">
                              {formatCurrency(timesheet.totalAmount)}
                            </span>
                          </TableCell>
                          <TableCell>
                            {getStatusBadge(timesheet.status, timesheet.isPaid)}
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex items-center gap-3 text-xs place-self-end">
                             { timesheet.status === 'pending' &&(<><Button 
                               disabled={processingTimesheet?.id === timesheet._id && processingTimesheet?.action === 'approve'} 
                               variant="outline" 
                               className="border-green-600 text-green-600 hover:bg-green-600 hover:text-white h-9 w-9" 
                               onClick={()=>handleTimeSheetApproval(timesheet._id)}
                             >
                               {processingTimesheet?.id === timesheet._id && processingTimesheet?.action === 'approve' ? (
                                 <>
                                   <Spinner /> <span className="ml-2">Approving...</span>
                                 </>
                               ) : (
                                 <CheckCircle size={16} />
                               )}
                             </Button>
                              <Button 
                                disabled={processingTimesheet?.id === timesheet._id && processingTimesheet?.action === 'reject'} 
                                variant="outline" 
                                className="border-red-600 text-red-600 hover:bg-red-600 hover:text-white h-9 w-9" 
                                onClick={()=>handleTimeSheetRejection(timesheet._id)}
                              >
                                {processingTimesheet?.id === timesheet._id && processingTimesheet?.action === 'reject' ? (
                                  <>
                                    <Spinner />
                                    <span className="ml-2">Declining...</span>
                                  </>
                                ) : (
                                  <CloseCircle size={16} />
                                )}
                              </Button>
                              
                              </>)}
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleViewTimesheet(timesheet._id)}
                              className="border-primary text-primary hover:bg-primary hover:text-white h-9 w-9"
                            >
                              <Eye size={16} className="" />
                            </Button>
                            </div>

                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>

                {/* Pagination */}
                {timesheetData?.timesheets &&
                  timesheetData.timesheets.length > 0 && (
                    <div className="border-t border-gray-100 px-6 py-4">
                      <div className="flex items-center justify-between">
                        <div className="text-sm text-gray-600">
                          Showing{" "}
                          <span className="font-montserrat-semibold">
                            {timesheetData.pagination.totalResults}
                          </span>{" "}
                          entries
                        </div>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() =>
                              handlePageChange(
                                timesheetData.pagination.page - 1
                              )
                            }
                            disabled={timesheetData.pagination.page <= 1}
                            className="border-gray-200 h-9"
                          >
                            Previous
                          </Button>
                          {Array.from(
                            {
                              length: Math.min(
                                timesheetData.pagination.totalPages,
                                5
                              ),
                            },
                            (_, i) => {
                              const currentPage = timesheetData.pagination.page;
                              const totalPages =
                                timesheetData.pagination.totalPages;
                              let pageNum;

                              if (totalPages <= 5) {
                                pageNum = i + 1;
                              } else if (currentPage <= 3) {
                                pageNum = i + 1;
                              } else if (currentPage >= totalPages - 2) {
                                pageNum = totalPages - 4 + i;
                              } else {
                                pageNum = currentPage - 2 + i;
                              }
                              if (pageNum < 1 || pageNum > totalPages)
                                return null;
                              return (
                                <Button
                                  key={i}
                                  variant={
                                    pageNum === currentPage
                                      ? "default"
                                      : "outline"
                                  }
                                  size="sm"
                                  onClick={() => handlePageChange(pageNum)}
                                  className={`h-9 w-9 ${
                                    pageNum === currentPage
                                      ? "bg-primary text-white border-primary"
                                      : "border-gray-200 text-gray-700 hover:bg-gray-100"
                                  }`}
                                >
                                  {pageNum}
                                </Button>
                              );
                            }
                          )}
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() =>
                              handlePageChange(
                                timesheetData.pagination.page + 1
                              )
                            }
                            disabled={
                              timesheetData.pagination.page >=
                              timesheetData.pagination.totalPages
                            }
                            className="border-gray-200 h-9"
                          >
                            Next
                          </Button>
                        </div>
                      </div>
                    </div>
                  )}
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ParticipantTimesheets;
