import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { format } from "date-fns";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import { useGetWorkers, useGetFilterOptions } from "@/hooks/useAdminUserHooks";
import {
  WorkerFilters,
  SortOptions,
  PaginationOptions,
} from "@/api/services/adminUserService";
import {
  SupportWorker,
  WorkerTableFilters,
  VerificationSummary,
} from "@/entities/SupportWorker";
import { AltArrowDown, AltArrowLeft, AltArrowRight, Calendar, CheckCircle, ClockCircle, CloseCircle, CupStar, DangerCircle, Eye, Filter, Magnifer, Shield, Star, Suitcase, UserCheck, UsersGroupRounded } from "@solar-icons/react";
import GeneralHeader from "@/components/GeneralHeader";
import { useAuth } from "@/contexts/AuthContext";
import SupportWorkerDetailsDialog from "@/components/admin/SupportWorkerDetailsDialog";
import { CloseIcon } from "@/components/icons";
import { cn } from "@/lib/design-utils";
import { BG_COLORS, CONTAINER_PADDING } from "@/constants/design-system";

const SupportWorkersManagementPage: React.FC = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  // State for filters, sorting, and pagination
  const [filters, setFilters] = useState<WorkerTableFilters>({});
  const [sort, setSort] = useState<SortOptions>({
    field: "createdAt",
    direction: "desc",
  });
  const [pagination, setPagination] = useState<PaginationOptions>({
    page: 1,
    limit: 20,
  });
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  const [tempFilters, setTempFilters] = useState<WorkerTableFilters>({});
  const [selectedWorker, setSelectedWorker] = useState<SupportWorker | null>(
    null
  );
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  // API calls
  const {
    data: workersData,
    isLoading,
    error,
  } = useGetWorkers(filters, sort, pagination);
  const { data: filterOptions } = useGetFilterOptions();

  // Handlers
  const handleTempFilterChange = (
    key: keyof WorkerTableFilters,
    value: string | boolean | number | string[] | undefined
  ) => {
    const newFilters = { ...tempFilters };

    if (
      value === "all" ||
      value === "" ||
      value === undefined ||
      (Array.isArray(value) && value.length === 0)
    ) {
      delete newFilters[key];
    } else {
      newFilters[key] = value as any;
    }

    setTempFilters(newFilters);
  };

  const applyFilters = () => {
    setFilters(tempFilters);
    setPagination({ ...pagination, page: 1 });
    setIsFiltersOpen(false);
  };

  const resetFilters = () => {
    setTempFilters({});
  };

  const clearAllFilters = () => {
    setFilters({});
    setTempFilters({});
    setPagination({ ...pagination, page: 1 });
  };

  const handleOpenFilters = () => {
    setTempFilters(filters); // Initialize temp filters with current filters
    setIsFiltersOpen(true);
  };

  const handleSortChange = (field: string) => {
    const newDirection =
      sort.field === field && sort.direction === "asc" ? "desc" : "asc";
    setSort({ field, direction: newDirection });
  };

  const handlePageChange = (page: number) => {
    setPagination({ ...pagination, page });
  };

  const handleViewWorker = (worker: SupportWorker) => {
    setSelectedWorker(worker);
    setIsDetailsOpen(true);
  };

  const handleSearchChange = (value: string) => {
    const newFilters = { ...filters };

    if (value === "" || value === undefined) {
      delete newFilters.search;
    } else {
      newFilters.search = value;
    }

    setFilters(newFilters);
    setPagination({ ...pagination, page: 1 });
  };

  // Helper functions
  const getStatusIcon = (status: string) => {
    switch (status) {
      case "active":
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case "pending":
        return <ClockCircle className="h-4 w-4 text-yellow-500" />;
      case "suspended":
        return <DangerCircle className="h-4 w-4 text-red-500" />;
      case "inactive":
        return <CloseCircle className="h-4 w-4 text-gray-1000" />;
      default:
        return <ClockCircle className="h-4 w-4 text-gray-1000" />;
    }
  };

  const getStatusVariant = (
    status: string
  ): "default" | "secondary" | "destructive" | "outline" => {
    switch (status) {
      case "active":
        return "default";
      case "pending":
        return "secondary";
      case "suspended":
        return "destructive";
      case "inactive":
        return "outline";
      default:
        return "outline";
    }
  };

  const calculateVerificationProgress = (
    verificationStatus: SupportWorker["verificationStatus"]
  ): VerificationSummary => {
    // Handle case where verificationStatus is undefined or null
    if (!verificationStatus) {
      return { total: 0, completed: 0, percentage: 0 };
    }

    // Get all verification status values
    const statuses = Object.values(verificationStatus);

    // Count completed verifications (true values)
    const completed = statuses.filter((status) => status === true).length;

    // Total number of verification checks
    const total = statuses.length;

    // Calculate percentage with safe division
    const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;

    return {
      total,
      completed,
      percentage,
    };
  };

  const getRatingDisplay = (ratings: SupportWorker["ratings"] | undefined) => {
    if (!ratings || ratings.count === 0) {
      return <span className="text-muted-foreground text-sm">No ratings</span>;
    }

    return (
      <div className="flex items-center space-x-1">
        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
        <span className="text-sm font-montserrat-semibold">
          {ratings.average.toFixed(1)}
        </span>
        <span className="text-xs text-muted-foreground">({ratings.count})</span>
      </div>
    );
  };

  // Get active filters count
  const activeFiltersCount = Object.keys(filters).filter(
    (key) => key !== "search"
  ).length;

  // Pagination component
  const PaginationControls = () => {
    if (!workersData?.pagination) return null;

    const { page, totalPages, hasMore } = workersData.pagination;
    const maxVisiblePages = 5;
    const startPage = Math.max(1, page - Math.floor(maxVisiblePages / 2));
    const endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    return (
      <div className="flex items-center justify-between px-2">
        <div className="text-sm text-muted-foreground">
          Showing {(page - 1) * pagination.limit + 1} to{" "}
          {Math.min(
            page * pagination.limit,
            workersData.pagination.totalResults
          )}{" "}
          of {workersData.pagination.totalResults} support workers
        </div>

        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePageChange(page - 1)}
            disabled={page <= 1}
            className="h-9 w-9"
          >
            <AltArrowLeft className="h-4 w-4" />
          </Button>

          {Array.from(
            { length: endPage - startPage + 1 },
            (_, i) => startPage + i
          ).map((pageNum) => (
            <Button
              key={pageNum}
              variant={pageNum === page ? "default" : "outline"}
              size="sm"
              onClick={() => handlePageChange(pageNum)}
              className="h-9 w-9"
            >
              {pageNum}
            </Button>
          ))}

          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePageChange(page + 1)}
            disabled={!hasMore}
            className="h-9 w-9"
          >
            <AltArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    );
  };

  if (error) {
    return (
      <div className="p-6">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center text-red-500">
              Error loading support workers. Please try again.
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className={cn("min-h-screen", BG_COLORS.muted, CONTAINER_PADDING.responsive)}>
      <GeneralHeader
        stickyTop={true}
        title="Support Workers Management"
        subtitle="Manage and view all support workers in the system"
        user={user}
        onLogout={logout}
        onViewProfile={() => navigate("/admin/profile")}
        rightComponent={
          <div className="flex items-center gap-3">
            {/* Search and Filter Controls */}
            <div className="flex items-center justify-between">
              {/* Search Bar */}
              <div className="flex-1 max-w-md">
                <div className="relative">
                  <Magnifer className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search by name or email..."
                    value={filters.search || ""}
                    onChange={(e) => handleSearchChange(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              {/* Filter Button */}
              <Dialog open={isFiltersOpen} onOpenChange={setIsFiltersOpen}>
                <DialogTrigger asChild>
                  <Button variant="outline" onClick={handleOpenFilters}>
                    <Filter className="h-4 w-4 mr-2" />
                    Filters
                    {activeFiltersCount > 0 && (
                      <Badge
                        variant="secondary"
                        className="ml-2 h-5 min-w-5 text-xs"
                      >
                        {activeFiltersCount}
                      </Badge>
                    )}
                  </Button>
                </DialogTrigger>

                <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>Filter Support Workers</DialogTitle>
                    <DialogDescription>
                      Apply filters to narrow down the list of support workers
                    </DialogDescription>
                  </DialogHeader>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 py-4">
                    {/* Status */}
                    <div className="space-y-2">
                      <Label>Status</Label>
                      <Select
                        value={tempFilters.status || "all"}
                        onValueChange={(value) =>
                          handleTempFilterChange("status", value)
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Statuses</SelectItem>
                          {filterOptions?.userStatuses.map((status) => (
                            <SelectItem key={status} value={status}>
                              {status.charAt(0).toUpperCase() + status.slice(1)}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Languages */}
                    <div className="space-y-2">
                      <Label>Languages</Label>
                      <Select
                        value={tempFilters.languages?.join(",") || "all"}
                        onValueChange={(value) => {
                          if (value === "all") {
                            handleTempFilterChange("languages", undefined);
                          } else {
                            handleTempFilterChange("languages", [value]);
                          }
                        }}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select language" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Languages</SelectItem>
                          {filterOptions?.languages.map((language) => (
                            <SelectItem key={language} value={language}>
                              {language}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Email Verified */}
                    <div className="space-y-2">
                      <Label>Email Verification</Label>
                      <Select
                        value={
                          tempFilters.isEmailVerified === undefined
                            ? "all"
                            : tempFilters.isEmailVerified.toString()
                        }
                        onValueChange={(value) => {
                          if (value === "all") {
                            handleTempFilterChange(
                              "isEmailVerified",
                              undefined
                            );
                          } else {
                            handleTempFilterChange(
                              "isEmailVerified",
                              value === "true"
                            );
                          }
                        }}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select verification" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All</SelectItem>
                          <SelectItem value="true">Verified</SelectItem>
                          <SelectItem value="false">Not Verified</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Profile Setup Complete */}
                    <div className="space-y-2">
                      <Label>Profile Setup</Label>
                      <Select
                        value={
                          tempFilters.profileSetupComplete === undefined
                            ? "all"
                            : tempFilters.profileSetupComplete.toString()
                        }
                        onValueChange={(value) => {
                          if (value === "all") {
                            handleTempFilterChange(
                              "profileSetupComplete",
                              undefined
                            );
                          } else {
                            handleTempFilterChange(
                              "profileSetupComplete",
                              value === "true"
                            );
                          }
                        }}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select setup status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All</SelectItem>
                          <SelectItem value="true">Complete</SelectItem>
                          <SelectItem value="false">Incomplete</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Identity Verified */}
                    <div className="space-y-2">
                      <Label>Identity Verification</Label>
                      <Select
                        value={
                          tempFilters.identityVerified === undefined
                            ? "all"
                            : tempFilters.identityVerified.toString()
                        }
                        onValueChange={(value) => {
                          if (value === "all") {
                            handleTempFilterChange(
                              "identityVerified",
                              undefined
                            );
                          } else {
                            handleTempFilterChange(
                              "identityVerified",
                              value === "true"
                            );
                          }
                        }}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select verification" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All</SelectItem>
                          <SelectItem value="true">Verified</SelectItem>
                          <SelectItem value="false">Not Verified</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Police Check Verified */}
                    <div className="space-y-2">
                      <Label>Police Check</Label>
                      <Select
                        value={
                          tempFilters.policeCheckVerified === undefined
                            ? "all"
                            : tempFilters.policeCheckVerified.toString()
                        }
                        onValueChange={(value) => {
                          if (value === "all") {
                            handleTempFilterChange(
                              "policeCheckVerified",
                              undefined
                            );
                          } else {
                            handleTempFilterChange(
                              "policeCheckVerified",
                              value === "true"
                            );
                          }
                        }}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select verification" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All</SelectItem>
                          <SelectItem value="true">Verified</SelectItem>
                          <SelectItem value="false">Not Verified</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {/* NDIS Worker Screening */}
                    <div className="space-y-2">
                      <Label>NDIS Screening</Label>
                      <Select
                        value={
                          tempFilters.ndisWorkerScreeningVerified === undefined
                            ? "all"
                            : tempFilters.ndisWorkerScreeningVerified.toString()
                        }
                        onValueChange={(value) => {
                          if (value === "all") {
                            handleTempFilterChange(
                              "ndisWorkerScreeningVerified",
                              undefined
                            );
                          } else {
                            handleTempFilterChange(
                              "ndisWorkerScreeningVerified",
                              value === "true"
                            );
                          }
                        }}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select verification" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All</SelectItem>
                          <SelectItem value="true">Verified</SelectItem>
                          <SelectItem value="false">Not Verified</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Onboarding Complete */}
                    <div className="space-y-2">
                      <Label>Onboarding</Label>
                      <Select
                        value={
                          tempFilters.onboardingComplete === undefined
                            ? "all"
                            : tempFilters.onboardingComplete.toString()
                        }
                        onValueChange={(value) => {
                          if (value === "all") {
                            handleTempFilterChange(
                              "onboardingComplete",
                              undefined
                            );
                          } else {
                            handleTempFilterChange(
                              "onboardingComplete",
                              value === "true"
                            );
                          }
                        }}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select onboarding status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All</SelectItem>
                          <SelectItem value="true">Complete</SelectItem>
                          <SelectItem value="false">Incomplete</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Onboarding Fee Received */}
                    {/* <div className="space-y-2">
                  <Label>Onboarding Fee</Label>
                  <Select
                    value={tempFilters.onboardingFeeReceived === undefined ? 'all' : tempFilters.onboardingFeeReceived.toString()}
                    onValueChange={(value) => {
                      if (value === 'all') {
                        handleTempFilterChange('onboardingFeeReceived', undefined);
                      } else {
                        handleTempFilterChange('onboardingFeeReceived', value === 'true');
                      }
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select fee status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All</SelectItem>
                      <SelectItem value="true">Received</SelectItem>
                      <SelectItem value="false">Not Received</SelectItem>
                    </SelectContent>
                  </Select>
                </div> */}

                    {/* Has Profile Image */}
                    {/* <div className="space-y-2">
                  <Label>Profile Image</Label>
                  <Select
                    value={tempFilters.hasProfileImage === undefined ? 'all' : tempFilters.hasProfileImage.toString()}
                    onValueChange={(value) => {
                      if (value === 'all') {
                        handleTempFilterChange('hasProfileImage', undefined);
                      } else {
                        handleTempFilterChange('hasProfileImage', value === 'true');
                      }
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select image status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All</SelectItem>
                      <SelectItem value="true">Has Image</SelectItem>
                      <SelectItem value="false">No Image</SelectItem>
                    </SelectContent>
                  </Select>
                </div> */}
                  </div>

                  <DialogFooter className="flex justify-between">
                    <div className="flex space-x-2">
                      <Button variant="outline" onClick={resetFilters}>
                        Reset
                      </Button>
                      {Object.keys(filters).filter((key) => key !== "search")
                        .length > 0 && (
                        <Button variant="outline" onClick={clearAllFilters}>
                          Clear All
                        </Button>
                      )}
                    </div>
                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        onClick={() => setIsFiltersOpen(false)}
                      >
                        Cancel
                      </Button>
                      <Button onClick={applyFilters}>Apply Filters</Button>
                    </div>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>

            {/* Active Filters Display */}
            {activeFiltersCount > 0 && (
              <div className="flex items-center space-x-2">
                <span className="text-sm text-muted-foreground">
                  Active filters:
                </span>
                <Badge variant="secondary">
                  {activeFiltersCount} filter
                  {activeFiltersCount !== 1 ? "s" : ""} applied
                </Badge>
                <Button variant="ghost" size="sm" onClick={clearAllFilters}>
                  <CloseIcon className="h-4 w-4 mr-1" />
                  Clear all
                </Button>
              </div>
            )}
          </div>
        }
      />

      <TooltipProvider>
        <div className="py-6 space-y-6">
          {/* Table */}
          <Card>
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
                      <TableRow>
                        <TableHead>Worker</TableHead>
                        <TableHead
                          className="cursor-pointer hover:bg-muted/50"
                          onClick={() => handleSortChange("email")}
                        >
                          <div className="flex items-center space-x-1">
                            <span>Email</span>
                            {sort.field === "email" && (
                              <AltArrowDown
                                className={`h-4 w-4 ${
                                  sort.direction === "asc" ? "rotate-180" : ""
                                }`}
                              />
                            )}
                          </div>
                        </TableHead>
                        <TableHead>Status</TableHead>
                        {/* <TableHead>Rating</TableHead> */}
                        {/* <TableHead>Languages</TableHead> */}
                        <TableHead>Verification</TableHead>
                        <TableHead>Organizations</TableHead>
                        <TableHead
                          className="cursor-pointer hover:bg-muted/50"
                          onClick={() => handleSortChange("createdAt")}
                        >
                          <div className="flex items-center space-x-1">
                            <span>Created</span>
                            {sort.field === "createdAt" && (
                              <AltArrowDown
                                className={`h-4 w-4 ${
                                  sort.direction === "asc" ? "rotate-180" : ""
                                }`}
                              />
                            )}
                          </div>
                        </TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {workersData?.users?.map((worker: SupportWorker) => {
                        const verificationProgress =
                          calculateVerificationProgress(
                            worker.verificationStatus
                          );

                        return (
                          <TableRow key={worker._id}>
                            <TableCell>
                              <div className="flex items-center space-x-3">
                                <Avatar>
                                  <AvatarImage
                                    src={worker.profileImage}
                                    alt={`${worker.firstName} ${worker.lastName}`}
                                  />
                                  <AvatarFallback>
                                    {worker.firstName.charAt(0)}
                                    {worker.lastName.charAt(0)}
                                  </AvatarFallback>
                                </Avatar>
                                <div>
                                  <div className="font-montserrat-semibold flex items-center space-x-2">
                                    <span>
                                      {worker.firstName} {worker.lastName}
                                    </span>
                                    {worker.profileImage && (
                                      <img src={worker.profileImage} alt={`${worker.firstName} ${worker.lastName}`} className="h-3 w-3 text-muted-foreground" />
                                    )}
                                  </div>
                                  <div className="text-sm text-muted-foreground">
                                    {worker.phone}
                                  </div>
                                </div>
                              </div>
                            </TableCell>

                            <TableCell>
                              <div className="flex items-center space-x-2">
                                <span>{worker.email}</span>
                                {worker.isEmailVerified ? (
                                  <CheckCircle className="h-4 w-4 text-green-500" />
                                ) : (
                                  <CloseCircle className="h-4 w-4 text-red-500" />
                                )}
                              </div>
                            </TableCell>

                            <TableCell>
                              <div className="flex items-center space-x-2">
                                {getStatusIcon(worker.status)}
                                <Badge
                                  variant={getStatusVariant(worker.status)}
                                >
                                  {worker.status}
                                </Badge>
                              </div>
                            </TableCell>

                            {/* <TableCell>
                            {getRatingDisplay(worker.ratings)}
                          </TableCell> */}

                            {/* <TableCell>
                            {worker.languages && worker.languages.length > 0 ? (
                              <div className="flex flex-wrap gap-1">
                                {worker.languages.slice(0, 2).map((language) => (
                                  <Badge key={language} variant="secondary" className="text-xs">
                                    {language}
                                  </Badge>
                                ))}
                                {worker.languages.length > 2 && (
                                  <Badge variant="outline" className="text-xs">
                                    +{worker.languages.length - 2}
                                  </Badge>
                                )}
                              </div>
                            ) : (
                              <span className="text-muted-foreground text-sm">None</span>
                            )}
                          </TableCell> */}

                            <TableCell>
                              <Tooltip>
                                <TooltipTrigger>
                                  <div className="flex items-center space-x-2">
                                    <Progress
                                      value={verificationProgress.percentage}
                                      className="w-16 h-2"
                                    />
                                    <span className="text-sm font-montserrat-semibold">
                                      {verificationProgress.percentage}%
                                    </span>
                                  </div>
                                </TooltipTrigger>
                                <TooltipContent>
                                  <div className="space-y-1">
                                    <div className="font-montserrat-semibold">
                                      Verification Status
                                    </div>
                                    {worker.verificationStatus ? (
                                      <div className="grid grid-cols-2 gap-2 text-sm">
                                        <div className="flex items-center space-x-1">
                                          <UserCheck className="h-3 w-3" />
                                          <span>
                                            Profile:{" "}
                                            {worker.verificationStatus
                                              ?.profileSetupComplete
                                              ? "✓"
                                              : "✗"}
                                          </span>
                                        </div>
                                        <div className="flex items-center space-x-1">
                                          <Shield className="h-3 w-3" />
                                          <span>
                                            Identity:{" "}
                                            {worker.verificationStatus
                                              ?.identityVerified
                                              ? "✓"
                                              : "✗"}
                                          </span>
                                        </div>
                                        <div className="flex items-center space-x-1">
                                          <Shield className="h-3 w-3" />
                                          <span>
                                            Police:{" "}
                                            {worker.verificationStatus
                                              ?.policeCheckVerified
                                              ? "✓"
                                              : "✗"}
                                          </span>
                                        </div>
                                        <div className="flex items-center space-x-1">
                                          <CupStar className="h-3 w-3" />
                                          <span>
                                            NDIS:{" "}
                                            {worker.verificationStatus
                                              ?.ndisWorkerScreeningVerified
                                              ? "✓"
                                              : "✗"}
                                          </span>
                                        </div>
                                        <div className="flex items-center space-x-1">
                                          <CheckCircle className="h-3 w-3" />
                                          <span>
                                            Onboarding:{" "}
                                            {worker.verificationStatus
                                              ?.onboardingComplete
                                              ? "✓"
                                              : "✗"}
                                          </span>
                                        </div>
                                        <div className="flex items-center space-x-1">
                                          <Suitcase className="h-3 w-3" />
                                          <span>
                                            Fee:{" "}
                                            {worker.verificationStatus
                                              ?.onboardingFeeReceived
                                              ? "✓"
                                              : "✗"}
                                          </span>
                                        </div>
                                      </div>
                                    ) : (
                                      <div className="text-sm text-muted-foreground">
                                        No verification data available
                                      </div>
                                    )}
                                  </div>
                                </TooltipContent>
                              </Tooltip>
                            </TableCell>

                            <TableCell>
                              <div className="flex items-center space-x-1">
                                <UsersGroupRounded className="h-4 w-4 text-muted-foreground" />
                                <span className="text-sm">
                                  {worker.organizationCount} org
                                  {worker.organizationCount !== 1 ? "s" : ""}
                                </span>
                              </div>
                            </TableCell>

                            <TableCell>
                              <div className="flex items-center space-x-1">
                                <Calendar className="h-4 w-4 text-muted-foreground" />
                                <span className="text-sm">
                                  {format(
                                    new Date(worker.createdAt),
                                    "MMM dd, yyyy"
                                  )}
                                </span>
                              </div>
                            </TableCell>

                            <TableCell>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleViewWorker(worker)}
                                className="text-primary border-primary hover:bg-primary hover:text-white"
                              >
                                <Eye className="h-4 w-4 mr-2" />
                                View
                              </Button>
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>

                  {/* Empty state */}
                  {workersData?.users?.length === 0 && (
                    <div className="text-center py-12">
                      <UsersGroupRounded className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <h3 className="text-lg font-montserrat-semibold">
                        No support workers found
                      </h3>
                      <p className="text-muted-foreground">
                        {Object.keys(filters).length > 0
                          ? "Try adjusting your filters to see more results."
                          : "No support workers have been registered yet."}
                      </p>
                    </div>
                  )}

                  {/* Pagination */}
                  {workersData?.users?.length > 0 && (
                    <div className="border-t p-4">
                      <PaginationControls />
                    </div>
                  )}
                </>
              )}
            </CardContent>
          </Card>

          {/* Support Worker Details Dialog */}
          <SupportWorkerDetailsDialog
            worker={selectedWorker}
            open={isDetailsOpen}
            onOpenChange={setIsDetailsOpen}
          />
        </div>
      </TooltipProvider>
    </div>
  );
};

export default SupportWorkersManagementPage;
