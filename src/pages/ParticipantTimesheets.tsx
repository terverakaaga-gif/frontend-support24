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
import {
  cn,
  FLEX_ROW_BETWEEN,
  FLEX_ROW_CENTER,
  FLEX_COL,
  PAGE_WRAPPER,
} from "@/lib/design-utils";
import {
  GAP,
  BUTTON_VARIANTS,
  BG_COLORS,
  CONTAINER_PADDING,
  GRID_LAYOUTS,
  GAP as GRID_GAP,
  SPACING,
  HEADING_STYLES,
  TEXT_STYLES,
  FONT_FAMILY,
  TEXT_COLORS,
  SHADOW,
  RADIUS,
  BORDER_STYLES,
  ICON_SIZES,
} from "@/constants/design-system";
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
import {
  useApproveTimesheet,
  useGetParticipantTimesheets,
  useRejectTimesheet,
} from "@/hooks/useTimesheetHooks";
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
    action: "approve" | "reject";
  } | null>(null);

  const {
    data: timesheetData,
    isLoading,
    error,
  } = useGetParticipantTimesheets(user?._id || "", filters, !!user?._id);

  const {
    mutateAsync: approveTimesheet,
    isSuccess: isApproveSuccess,
    isError: isApproveError,
  } = useApproveTimesheet();

  const {
    mutateAsync: rejectTimesheet,
    isSuccess: isRejectSuccess,
    isError: isRejectError,
  } = useRejectTimesheet();

  const formatDateShort = (dateString: string) =>
    format(new Date(dateString), "d MMM, yyyy");

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

  const handleTimeSheetApproval = useCallback(
    async (id: string) => {
      if (!id || processingTimesheet?.id === id) {
        return;
      }

      setProcessingTimesheet({ id, action: "approve" });

      try {
        await approveTimesheet(id);
        if (isApproveSuccess) {
          toast.success("Timesheet approved successfully");
        }
        if (isApproveError) {
          toast.error("Timesheet approval failed");
        }
      } finally {
        setProcessingTimesheet(null);
      }
    },
    [approveTimesheet, isApproveError, isApproveSuccess, processingTimesheet]
  );

  const handleTimeSheetRejection = useCallback(
    async (id: string) => {
      if (!id || processingTimesheet?.id === id) {
        return;
      }

      setProcessingTimesheet({ id, action: "reject" });

      try {
        await rejectTimesheet(id);
        if (isRejectSuccess) {
          toast.success("Timesheet rejected successfully");
        }
        if (isRejectError) {
          toast.error("Timesheet decline failed");
        }
      } finally {
        setProcessingTimesheet(null);
      }
    },
    [rejectTimesheet, isRejectError, isRejectSuccess, processingTimesheet]
  );

  if (isLoading) {
    return <Loader />;
  }

  const getStatusBadge = (status: string, isPaid: boolean) => {
    const commonClasses = cn(BORDER_STYLES.none, FONT_FAMILY.montserratSemibold);

    if (isPaid) {
      return (
        <Badge className={cn("bg-green-100 text-green-700 hover:bg-green-100", commonClasses)}>
          Paid
        </Badge>
      );
    }

    if (status === "pending") {
      return (
        <Badge className={cn("bg-yellow-100 text-yellow-700 hover:bg-yellow-100", commonClasses)}>
          Pending
        </Badge>
      );
    }

    if (status === "approved") {
      return (
        <Badge className={cn("bg-green-100 text-green-700 hover:bg-green-100", commonClasses)}>
          Approved
        </Badge>
      );
    }

    if (status === "rejected") {
      return (
        <Badge className={cn("bg-red-100 text-red-700 hover:bg-red-100", commonClasses)}>
          Rejected
        </Badge>
      );
    }

    return (
      <Badge className={cn("bg-gray-100 text-gray-700 hover:bg-gray-100", commonClasses)}>
        {status}
      </Badge>
    );
  };

  if (error) {
    return (
      <div className={cn("min-h-screen", BG_COLORS.muted, CONTAINER_PADDING.responsive)}>
        <Card className={cn(BORDER_STYLES.none, SHADOW.sm)}>
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
    <div className={cn(PAGE_WRAPPER,)}>
      <div className={cn("space-y-6")}>
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
              ) as string
            );
          }}
          onLogout={logout}
        />

        {/* Stats Cards */}
        {timesheetData?.summary && (
          <div className={cn(GRID_LAYOUTS.responsive, "gap-4")}>
            {/* Total Timesheet */}
            <Card className={cn(BORDER_STYLES.none, "hover:shadow-sm transition-all bg-white")}>
              <CardContent className="p-6">
                <div className={cn(FLEX_ROW_BETWEEN, "items-start")}>
                  <div className={cn("flex-1", FONT_FAMILY.montserratSemibold)}>
                    <p className={cn("text-sm", TEXT_COLORS.gray600, "mb-2")}>
                      Total Timesheet
                    </p>
                    <p className={cn("text-3xl", FONT_FAMILY.montserratBold, TEXT_COLORS.gray900)}>
                      {timesheetData.summary.totalTimesheets}
                    </p>
                  </div>
                  <div className={cn("w-12 h-12 rounded-full bg-primary-100", FLEX_ROW_CENTER, "justify-center")}>
                    <Document className={cn(ICON_SIZES.lg, "text-primary")} />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Total Hours */}
            <Card className={cn(BORDER_STYLES.none, "hover:shadow-sm transition-all bg-white")}>
              <CardContent className="p-6">
                <div className={cn(FLEX_ROW_BETWEEN, "items-start")}>
                  <div className={cn("flex-1", FONT_FAMILY.montserratSemibold)}>
                    <p className={cn("text-sm", TEXT_COLORS.gray600, "mb-2")}>Total Hours</p>
                    <p className={cn("text-3xl", FONT_FAMILY.montserratBold, TEXT_COLORS.gray900)}>
                      {Math.round(timesheetData.summary.totalHours)}
                    </p>
                  </div>
                  <div className={cn("w-12 h-12 rounded-full bg-primary-100", FLEX_ROW_CENTER, "justify-center")}>
                    <ClockCircle className={cn(ICON_SIZES.lg, "text-primary")} />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Total Amount */}
            <Card className={cn(BORDER_STYLES.none, "hover:shadow-sm transition-all bg-white")}>
              <CardContent className="p-6">
                <div className={cn(FLEX_ROW_BETWEEN, "items-start")}>
                  <div className={cn("flex-1", FONT_FAMILY.montserratSemibold)}>
                    <p className={cn("text-sm", TEXT_COLORS.gray600, "mb-2")}>Total Amount</p>
                    <p className={cn("text-3xl", TEXT_COLORS.gray900, FONT_FAMILY.montserratBold)}>
                      {formatCurrency(timesheetData.summary.totalAmount)}
                    </p>
                  </div>
                  <div className={cn("w-12 h-12 rounded-full bg-primary-100", FLEX_ROW_CENTER, "justify-center")}>
                    <Dollar className={cn(ICON_SIZES.lg, "text-primary")} />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Pending Reviews */}
            <Card className={cn(BORDER_STYLES.none, "hover:shadow-sm transition-all bg-white")}>
              <CardContent className="p-6">
                <div className={cn(FLEX_ROW_BETWEEN, "items-start")}>
                  <div className={cn("flex-1", FONT_FAMILY.montserratSemibold)}>
                    <p className={cn("text-sm", TEXT_COLORS.gray600, "mb-2")}>
                      Pending Reviews
                    </p>
                    <p className={cn("text-3xl", TEXT_COLORS.gray900, FONT_FAMILY.montserratBold)}>
                      {timesheetData.summary.pendingCount}
                    </p>
                  </div>
                  <div className={cn("w-12 h-12 rounded-full bg-primary-100", FLEX_ROW_CENTER, "justify-center")}>
                    <ClockCircle className={cn(ICON_SIZES.lg, "text-primary")} />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Search Bar */}
        <div className={cn(FLEX_ROW_BETWEEN, GAP.md)}>
          <div className="flex-1 max-w-md relative">
            <Magnifer className={cn("absolute left-3 top-1/2 -translate-y-1/2", ICON_SIZES.md, TEXT_COLORS.gray400)} />
            <Input
              placeholder="Search by worker or shift ID..."
              value={filters.search || ""}
              onChange={(e) => handleSearchChange(e.target.value)}
              className={cn("pl-10", BORDER_STYLES.default, "focus:border-primary-500 bg-white h-11")}
            />
          </div>
        </div>

        {/* Table */}
        <Card className={cn(BORDER_STYLES.none, SHADOW.sm, BG_COLORS.white)}>
          <CardContent className="p-0">
            {isLoading ? (
              <div className="p-6">
                <div className={cn("space-y-4")}>
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
                    <TableRow className={cn(FONT_FAMILY.montserratSemibold, "border-b border-gray-100 hover:bg-transparent")}>
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
                          <div className={cn(FLEX_COL, "items-center justify-center space-y-3")}>
                            <Document className={cn(ICON_SIZES["3xl"], TEXT_COLORS.gray400)} />
                            <div>
                              <h3 className={cn("text-base", FONT_FAMILY.montserratSemibold, TEXT_COLORS.gray900)}>
                                No timesheets found
                              </h3>
                              <p className={cn("text-sm text-gray-400 mt-1")}>
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
                            <div className={cn("flex flex-col gap-1")}>
                              <span className={cn(FONT_FAMILY.montserratSemibold, TEXT_COLORS.gray900, "text-sm")}>
                                {timesheet.shiftIdRef}
                              </span>
                              <span className={cn("text-xs", TEXT_COLORS.gray500)}>
                                {timesheet.organizationId.name}
                              </span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className={cn("text-sm", TEXT_COLORS.gray900)}>
                              {formatDateShort(timesheet.scheduledStartTime)}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className={cn(FLEX_ROW_CENTER, "gap-3")}>
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
                              <span className={cn("text-sm", TEXT_COLORS.gray700, FONT_FAMILY.montserratSemibold)}>
                                {getWorkerDisplayName(timesheet.workerId)}
                              </span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className={cn(FLEX_ROW_CENTER, "gap-2")}>
                              <BillList className={cn(ICON_SIZES.lg, TEXT_COLORS.gray500)} />
                              <div className="flex flex-col">
                                <span className={cn("text-sm", FONT_FAMILY.montserratSemibold, TEXT_COLORS.gray900)}>
                                  {formatCurrency(timesheet.totalExpenses)}
                                </span>
                                <span className={cn("text-xs", TEXT_COLORS.gray500)}>
                                  {timesheet.expenses.length} Item Purchased
                                </span>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <span className={cn("text-sm", FONT_FAMILY.montserratBold, TEXT_COLORS.primary)}>
                              {formatCurrency(timesheet.totalAmount)}
                            </span>
                          </TableCell>
                          <TableCell>
                            {getStatusBadge(timesheet.status, timesheet.isPaid)}
                          </TableCell>
                          <TableCell className="text-right">
                            <div className={cn(FLEX_ROW_CENTER, "gap-3 text-xs place-self-end")}>
                              {timesheet.status === "pending" && (
                                <>
                                  <Button
                                    disabled={
                                      processingTimesheet?.id === timesheet._id &&
                                      processingTimesheet?.action === "approve"
                                    }
                                    variant="outline"
                                    className="border-green-600 text-green-600 hover:bg-green-600 hover:text-white h-9 w-9 px-0"
                                    onClick={() =>
                                      handleTimeSheetApproval(timesheet._id)
                                    }
                                  >
                                    {processingTimesheet?.id === timesheet._id &&
                                    processingTimesheet?.action === "approve" ? (
                                      <Spinner  />
                                    ) : (
                                      <CheckCircle className={ICON_SIZES.sm} />
                                    )}
                                  </Button>
                                  <Button
                                    disabled={
                                      processingTimesheet?.id === timesheet._id &&
                                      processingTimesheet?.action === "reject"
                                    }
                                    variant="outline"
                                    className="border-red-600 text-red-600 hover:bg-red-600 hover:text-white h-9 w-9 px-0"
                                    onClick={() =>
                                      handleTimeSheetRejection(timesheet._id)
                                    }
                                  >
                                    {processingTimesheet?.id === timesheet._id &&
                                    processingTimesheet?.action === "reject" ? (
                                      <Spinner />
                                    ) : (
                                      <CloseCircle className={ICON_SIZES.sm} />
                                    )}
                                  </Button>
                                </>
                              )}
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() =>
                                  handleViewTimesheet(timesheet._id)
                                }
                                className={cn("border-primary text-primary hover:bg-primary hover:text-white px-0", CONTAINER_PADDING.mobile)}
                              >
                                <Eye className={ICON_SIZES.sm} />
                                <span className="">View</span>
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
                      <div className={cn(FLEX_ROW_BETWEEN)}>
                        <div className={cn("text-sm", TEXT_COLORS.gray600)}>
                          Showing{" "}
                          <span className={FONT_FAMILY.montserratSemibold}>
                            {timesheetData.pagination.totalResults}
                          </span>{" "}
                          entries
                        </div>
                        <div className={cn(FLEX_ROW_CENTER, "gap-2")}>
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
                                  className={cn(
                                    "h-9 w-9",
                                    pageNum === currentPage
                                      ? "bg-primary text-white border-primary"
                                      : "border-gray-200 text-gray-700 hover:bg-gray-100"
                                  )}
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
