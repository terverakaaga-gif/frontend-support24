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
import { Card, CardContent } from "@/components/ui/card";
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
  Eye,
  Magnifer,
  Document,
  ClockCircle,
  Dollar,
  BillList,
  ArrowUp,
  ArrowDown,
  CourseUp,
  CourseDown,
} from "@solar-icons/react";
import { cn } from "@/lib/utils";

import { useAuth } from "@/contexts/AuthContext";
import { useGetWorkerTimesheets } from "@/hooks/useTimesheetHooks";
import {
  TimesheetClientFilters,
  Timesheet,
  SERVICE_TYPE_LABELS,
} from "@/entities/Timesheet";
import Loader from "@/components/Loader";
import GeneralHeader from "@/components/GeneralHeader";
import { pageTitles } from "@/constants/pageTitles";

const SupportWorkerTimesheets: React.FC = () => {
  const navigate = useNavigate();
  const { user,logout  } = useAuth();

  const [filters, setFilters] = useState<
    Omit<TimesheetClientFilters, "workerId">
  >({
    page: 1,
    limit: 10,
    sortField: "createdAt",
    sortDirection: "desc",
  });
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);

  const {
    data: timesheetData,
    isLoading,
    error,
  } = useGetWorkerTimesheets(user?._id || "", filters, !!user?._id);

  const formatTime = (dateString: string) =>
    format(new Date(dateString), "h:mm a");
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
    navigate(`/support-worker/timesheets/${id}`);
  };

   if (isLoading) {
    return <Loader />;
  }

  const getStatusBadge = (status: string, isPaid: boolean) => {
    if (isPaid) {
      return (
        <Badge className="bg-green-100 text-green-700 hover:bg-green-100 border-0 font-medium">
          Paid
        </Badge>
      );
    }

    if (status === "pending") {
      return (
        <Badge className="bg-yellow-100 text-yellow-700 hover:bg-yellow-100 border-0 font-medium">
          Pending
        </Badge>
      );
    }

    if (status === "approved") {
      return (
        <Badge className="bg-green-100 text-green-700 hover:bg-green-100 border-0 font-medium">
          Approved
        </Badge>
      );
    }

    if (status === "rejected") {
      return (
        <Badge className="bg-red-100 text-red-700 hover:bg-red-100 border-0 font-medium">
          Rejected
        </Badge>
      );
    }

    return (
      <Badge className="bg-gray-100 text-gray-700 hover:bg-gray-100 border-0 font-medium">
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
    <div className="min-h-screen bg-gray-100 p-10">
      <div className="space-y-6">
        {/* Header */}
        <GeneralHeader
          title={
            pageTitles.supportWorker["/support-worker/timesheets"].title
          }
          subtitle={
            pageTitles.supportWorker["/support-worker/timesheets"].subtitle
          }
          user={user}
          onViewProfile={() => {
            navigate(
              Object.keys(pageTitles.supportWorker).find(
                (key) =>
                  key !== "/support-worker/timesheets" &&
                  pageTitles.supportWorker[key] ===
                    pageTitles.supportWorker["/support-worker/profile"]
              )
            );
          }}
          onLogout={logout}
        />


        {/* Stats Cards */}
        {timesheetData?.summary && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Total Timesheet */}
            <Card className="border-0 shadow-sm bg-white hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <p className="text-sm text-black mb-2">Total Timesheet</p>
                    <p className="text-3xl font-montserrat-bold text-gray-900">
                      {timesheetData.summary.totalTimesheets}
                    </p>
                    {/* <div className="flex items-center gap-1 mt-2">
                      <CourseUp size={16} color="#10B981" />
                      <span className="text-xs text-green-600 font-medium">
                        From last month
                      </span>
                    </div> */}
                  </div>
                  <div className="w-12 h-12 rounded-full bg-primary-100 flex items-center justify-center">
                    <Document size={24} color="#3B82F6" />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Total Hours */}
            <Card className="border-0 shadow-sm bg-white hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <p className="text-sm text-black mb-2">Total Hours</p>
                    <p className="text-3xl font-montserrat-bold text-gray-900">
                      {Math.round(timesheetData.summary.totalHours)}
                    </p>
                    {/* <div className="flex items-center gap-1 mt-2">
                      <CourseUp size={16} color="#10B981" />
                      <span className="text-xs text-green-600 font-medium">
                        From last 24 Hours
                      </span>
                    </div> */}
                  </div>
                  <div className="w-12 h-12 rounded-full bg-primary-100 flex items-center justify-center">
                    <ClockCircle size={24} color="#3B82F6" />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Total Earned */}
            <Card className="border-0 shadow-sm bg-white hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <p className="text-sm text-black mb-2">Total Earned</p>
                    <p className="text-3xl font-montserrat-bold text-gray-900">
                      {formatCurrency(timesheetData.summary.totalAmount)}
                    </p>
                    {/* <div className="flex items-center gap-1 mt-2">
                      <CourseUp size={16} color="#10B981" />
                      <span className="text-xs text-green-600 font-medium">
                        From last month
                      </span>
                    </div> */}
                  </div>
                  <div className="w-12 h-12 rounded-full bg-primary-100 flex items-center justify-center">
                    <Dollar size={24} color="#3B82F6" />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Pending Reviews */}
            <Card className="border-0 shadow-sm bg-white hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <p className="text-sm text-black mb-2">Pending Reviews</p>
                    <p className="text-3xl font-montserrat-bold text-gray-900">
                      {timesheetData.summary.pendingCount}
                    </p>
                    {/* <div className="flex items-center gap-1 mt-2">
                      <CourseDown size={16} color="#EF4444" />
                      <span className="text-xs text-red-600 font-medium">
                        From Last Month
                      </span>
                    </div> */}
                  </div>
                  <div className="w-12 h-12 rounded-full bg-primary-100 flex items-center justify-center">
                    <ClockCircle size={24} color="#3B82F6" />
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
              placeholder="Search participant name or shift ID..."
              value={filters.search || ""}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="pl-10 border-gray-200 focus:border-primary-500 bg-white h-11"
            />
          </div>
        </div>

        {/* Table */}
        <Card className="border-0 shadow-sm bg-white">
          <CardContent className="p-0">
            <>
              <Table>
                <TableHeader>
                  <TableRow className="border-b border-gray-100 font-montserrat-semibold uppercase hover:bg-transparent">
                    <TableHead className="text-black">
                      Shift Reference
                    </TableHead>
                    <TableHead className="text-black">Date</TableHead>
                    <TableHead className="text-black">Participant</TableHead>
                    <TableHead className="text-black">Expenses</TableHead>
                    <TableHead className="text-black">Total</TableHead>
                    <TableHead className="text-black">Status</TableHead>
                    <TableHead className="text-black text-right">
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
                              No timesheets have been submitted for your shifts
                              yet.
                            </p>
                          </div>
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : (
                    timesheetData?.timesheets?.map((timesheet: Timesheet) => (
                      <TableRow
                        key={timesheet._id}
                        className="border-b font-montserrat-semibold border-gray-100 hover:shadow-md transition-shadow hover:bg-gray-100/50"
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
                            <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
                              <span className="text-sm font-medium text-black">
                                {timesheet.participantId.firstName.charAt(0)}
                                {timesheet.participantId.lastName.charAt(0)}
                              </span>
                            </div>
                            <span className="text-sm text-gray-900 font-medium">
                              {getFullName(timesheet.participantId)}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <BillList size={16} color="#6B7280" />
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
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleViewTimesheet(timesheet._id)}
                            className="border-primary text-primary hover:bg-primary hover:text-white font-medium h-9"
                          >
                            <Eye size={16} className="mr-2" />
                            View
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>

              {/* Page Entries */}
              {timesheetData?.timesheets &&
                timesheetData.timesheets.length > 0 && (
                  <div className="px-6 py-3 border-t border-gray-100">
                    <div className="text-sm text-black">
                      Showing{" "}
                      <span className="font-medium">
                        {Math.min(
                          (timesheetData.pagination.page - 1) *
                            timesheetData.pagination.limit +
                            1,
                          timesheetData.pagination.totalResults
                        )}
                      </span>{" "}
                      to{" "}
                      <span className="font-medium">
                        {Math.min(
                          timesheetData.pagination.page *
                            timesheetData.pagination.limit,
                          timesheetData.pagination.totalResults
                        )}
                      </span>{" "}
                      of{" "}
                      <span className="font-medium">
                        {timesheetData.pagination.totalResults}
                      </span>{" "}
                      entries
                    </div>
                  </div>
                )}

              {/* Pagination */}
              {timesheetData?.timesheets &&
                timesheetData.timesheets.length > 0 && (
                  <div className="border-t border-gray-100 px-6 py-4">
                    <div className="flex items-center justify-between">
                      <div className="text-sm text-black">
                        Showing{" "}
                        <span className="font-medium">
                          {timesheetData.pagination.totalResults}
                        </span>{" "}
                        entries
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            handlePageChange(timesheetData.pagination.page - 1)
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

                            return pageNum;
                          }
                        ).map((pageNum) => (
                          <Button
                            key={pageNum}
                            variant={
                              pageNum === timesheetData.pagination.page
                                ? "default"
                                : "outline"
                            }
                            size="sm"
                            onClick={() => handlePageChange(pageNum)}
                            className={
                              pageNum === timesheetData.pagination.page
                                ? "bg-primary hover:bg-primary-700 h-9 min-w-[36px]"
                                : "border-gray-200 h-9 min-w-[36px]"
                            }
                          >
                            {pageNum}
                          </Button>
                        ))}
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            handlePageChange(timesheetData.pagination.page + 1)
                          }
                          disabled={!timesheetData.pagination.hasMore}
                          className="border-gray-200 h-9"
                        >
                          Next
                        </Button>
                      </div>
                    </div>
                  </div>
                )}
            </>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SupportWorkerTimesheets;
