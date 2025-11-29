import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { format } from "date-fns";
import {
  Magnifer,
  Tuning2,
  SortVertical,
  Eye,
  Calendar,
  UsersGroupTwoRounded,
  CheckCircle,
  CloseCircle,
  ClockCircle,
  DangerCircle,
  AltArrowLeft,
  AltArrowRight,
  Letter,
  Phone,
  Filter,
} from "@solar-icons/react";

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
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import GeneralHeader from "@/components/GeneralHeader";
import Loader from "@/components/Loader";
import ErrorDisplay from "@/components/ErrorDisplay";
import { useAuth } from "@/contexts/AuthContext";
import {
  useGetParticipants,
  useGetFilterOptions,
} from "@/hooks/useAdminUserHooks";
import { SortOptions, PaginationOptions } from "@/api/services/adminUserService";
import ParticipantDetailsDialog from "@/components/admin/ParticipantDetailsDialog";
import { Participant, ParticipantTableFilters } from "@/entities/Participant";

export default function ParticipantsManagementPage() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  // State for filters, sorting, and pagination
  const [filters, setFilters] = useState<ParticipantTableFilters>({});
  const [sort, setSort] = useState<SortOptions>({
    field: "createdAt",
    direction: "desc",
  });
  const [pagination, setPagination] = useState<PaginationOptions>({
    page: 1,
    limit: 10,
  });
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  const [tempFilters, setTempFilters] = useState<ParticipantTableFilters>({});
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedParticipant, setSelectedParticipant] = useState<Participant | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  // API calls
  const {
    data: participantsData,
    isLoading,
    error,
  } = useGetParticipants(filters, sort, pagination);
  const { data: filterOptions } = useGetFilterOptions();

  // Handlers
  const handleTempFilterChange = (
    key: keyof ParticipantTableFilters,
    value: string | boolean | undefined
  ) => {
    const newFilters = { ...tempFilters };

    if (value === "all" || value === "" || value === undefined) {
      delete newFilters[key];
    } else {
      newFilters[key] = value;
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
    setTempFilters(filters);
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

  const handleViewParticipant = (participant: Participant) => {
    setSelectedParticipant(participant);
    setIsDetailsOpen(true);
  };

  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
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
        return <CloseCircle className="h-4 w-4 text-gray-500" />;
      default:
        return <ClockCircle className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusBadgeStyle = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "suspended":
        return "bg-red-100 text-red-800";
      case "inactive":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  // Get active filters count
  const activeFiltersCount = Object.keys(filters).filter(
    (key) => key !== "search"
  ).length;

  if (isLoading) {
    return <Loader />;
  }

  if (error) {
    return <ErrorDisplay message="Error loading participants" />;
  }

  return (
    <div className="min-h-screen bg-gray-100 p-4 md:p-6 lg:p-8">
      <GeneralHeader
        stickyTop={true}
        title="Participants Management"
        subtitle="Manage and view all participants in the system"
        user={user}
        onLogout={logout}
        onViewProfile={() => navigate("/admin/profile")}
        rightComponent={
          <div className="flex items-center gap-3">
            <div className="relative">
              <Magnifer className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <Input
                placeholder="Search by name or email..."
                value={searchQuery}
                onChange={(e) => handleSearchChange(e.target.value)}
                className="w-48 md:w-72 pl-10"
              />
            </div>

            <Dialog open={isFiltersOpen} onOpenChange={setIsFiltersOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" onClick={handleOpenFilters}>
                  <Filter className="h-4 w-4 mr-2" />
                  Filters
                  {activeFiltersCount > 0 && (
                    <span className="ml-2 bg-primary text-white text-xs px-2 py-0.5 rounded-full">
                      {activeFiltersCount}
                    </span>
                  )}
                </Button>
              </DialogTrigger>

              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Filter Participants</DialogTitle>
                  <DialogDescription>
                    Apply filters to narrow down the list of participants
                  </DialogDescription>
                </DialogHeader>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4">
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
                        {filterOptions?.userStatuses?.map((status) => (
                          <SelectItem key={status} value={status}>
                            {status.charAt(0).toUpperCase() + status.slice(1)}
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
                          handleTempFilterChange("isEmailVerified", undefined);
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

                  {/* Has Organization */}
                  <div className="space-y-2">
                    <Label>Organization</Label>
                    <Select
                      value={
                        tempFilters.hasOrganization === undefined
                          ? "all"
                          : tempFilters.hasOrganization.toString()
                      }
                      onValueChange={(value) => {
                        if (value === "all") {
                          handleTempFilterChange("hasOrganization", undefined);
                        } else {
                          handleTempFilterChange(
                            "hasOrganization",
                            value === "true"
                          );
                        }
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select organization status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All</SelectItem>
                        <SelectItem value="true">Has Organization</SelectItem>
                        <SelectItem value="false">No Organization</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Has Guardian */}
                  <div className="space-y-2">
                    <Label>Guardian</Label>
                    <Select
                      value={
                        tempFilters.hasGuardian === undefined
                          ? "all"
                          : tempFilters.hasGuardian.toString()
                      }
                      onValueChange={(value) => {
                        if (value === "all") {
                          handleTempFilterChange("hasGuardian", undefined);
                        } else {
                          handleTempFilterChange(
                            "hasGuardian",
                            value === "true"
                          );
                        }
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select guardian status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All</SelectItem>
                        <SelectItem value="true">Has Guardian</SelectItem>
                        <SelectItem value="false">No Guardian</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <DialogFooter className="flex justify-between">
                  <div className="flex gap-2">
                    <Button variant="outline" onClick={resetFilters}>
                      Reset
                    </Button>
                    {activeFiltersCount > 0 && (
                      <Button variant="outline" onClick={clearAllFilters}>
                        Clear All
                      </Button>
                    )}
                  </div>
                  <div className="flex gap-2">
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
        }
      />

      {/* Active Filters Display */}
      {activeFiltersCount > 0 && (
        <div className="flex items-center gap-2 mb-4">
          <span className="text-sm text-gray-600">Active filters:</span>
          <span className="bg-primary/10 text-primary text-xs px-2 py-1 rounded-full font-semibold">
            {activeFiltersCount} filter{activeFiltersCount !== 1 ? "s" : ""}{" "}
            applied
          </span>
          <Button
            variant="ghost"
            size="sm"
            onClick={clearAllFilters}
            className="text-gray-600 hover:text-red-600"
          >
            <CloseCircle className="h-4 w-4 mr-1" />
            Clear all
          </Button>
        </div>
      )}

      {/* Table */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="border-b border-gray-200 bg-gray-50 hover:bg-gray-50">
              <TableHead
                className="px-6 py-3 text-left text-xs font-semibold text-black uppercase cursor-pointer hover:bg-gray-100"
                onClick={() => handleSortChange("firstName")}
              >
                <div className="flex items-center gap-1">
                  Participant
                  {sort.field === "firstName" && (
                    <SortVertical
                      className={`h-4 w-4 ${
                        sort.direction === "asc" ? "rotate-180" : ""
                      }`}
                    />
                  )}
                </div>
              </TableHead>
              <TableHead
                className="px-6 py-3 text-left text-xs font-semibold text-black uppercase cursor-pointer hover:bg-gray-100"
                onClick={() => handleSortChange("email")}
              >
                <div className="flex items-center gap-1">
                  Email
                  {sort.field === "email" && (
                    <SortVertical
                      className={`h-4 w-4 ${
                        sort.direction === "asc" ? "rotate-180" : ""
                      }`}
                    />
                  )}
                </div>
              </TableHead>
              <TableHead className="px-6 py-3 text-left text-xs font-semibold text-black uppercase">
                Status
              </TableHead>
              <TableHead className="px-6 py-3 text-left text-xs font-semibold text-black uppercase">
                Organizations
              </TableHead>
              <TableHead className="px-6 py-3 text-left text-xs font-semibold text-black uppercase">
                Email Verified
              </TableHead>
              <TableHead
                className="px-6 py-3 text-left text-xs font-semibold text-black uppercase cursor-pointer hover:bg-gray-100"
                onClick={() => handleSortChange("createdAt")}
              >
                <div className="flex items-center gap-1">
                  Created
                  {sort.field === "createdAt" && (
                    <SortVertical
                      className={`h-4 w-4 ${
                        sort.direction === "asc" ? "rotate-180" : ""
                      }`}
                    />
                  )}
                </div>
              </TableHead>
              <TableHead className="px-6 py-3 text-left text-xs font-semibold text-black uppercase">
                Actions
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {participantsData?.users?.map((participant: Participant) => (
              <TableRow
                key={participant._id}
                className="hover:bg-gray-50 transition-colors"
              >
                <TableCell className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10">
                      <AvatarImage
                        src={participant.profile }
                        alt={`${participant.firstName} ${participant.lastName}`}
                      />
                      <AvatarFallback>
                        {participant.firstName?.charAt(0)}
                        {participant.lastName?.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-sm font-semibold text-gray-900">
                        {participant.firstName} {participant.lastName}
                      </p>
                      <div className="flex items-center gap-1 text-xs text-gray-500">
                        <Phone className="h-3 w-3" />
                        {participant.phone || "No phone"}
                      </div>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <Letter className="h-4 w-4 text-gray-400" />
                    <span className="text-sm text-gray-900">
                      {participant.email}
                    </span>
                  </div>
                </TableCell>
                <TableCell className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    {getStatusIcon(participant.status)}
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-semibold ${getStatusBadgeStyle(
                        participant.status
                      )}`}
                    >
                      {participant.status}
                    </span>
                  </div>
                </TableCell>
                <TableCell className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <UsersGroupTwoRounded className="h-4 w-4 text-gray-400" />
                    <span className="text-sm text-gray-900">
                      {participant.organizationCount} org
                      {participant.organizationCount !== 1 ? "s" : ""}
                    </span>
                  </div>
                </TableCell>
                <TableCell className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    {participant.isEmailVerified ? (
                      <>
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        <span className="text-sm text-green-700">Verified</span>
                      </>
                    ) : (
                      <>
                        <CloseCircle className="h-4 w-4 text-red-500" />
                        <span className="text-sm text-red-700">
                          Not Verified
                        </span>
                      </>
                    )}
                  </div>
                </TableCell>
                <TableCell className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-gray-400" />
                    <span className="text-sm text-gray-900">
                      {format(new Date(participant.createdAt), "MMM dd, yyyy")}
                    </span>
                  </div>
                </TableCell>
                <TableCell className="px-6 py-4">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleViewParticipant(participant)}
                    className="text-primary border-primary hover:bg-primary hover:text-white"
                  >
                    <Eye className="h-4 w-4 mr-2" />
                    View
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {/* Empty state */}
        {participantsData?.users?.length === 0 && (
          <div className="text-center py-12">
            <UsersGroupTwoRounded className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900">
              No participants found
            </h3>
            <p className="text-gray-500 mt-1">
              {Object.keys(filters).length > 0
                ? "Try adjusting your filters to see more results."
                : "No participants have been registered yet."}
            </p>
          </div>
        )}

        {/* Pagination */}
        {participantsData?.users?.length > 0 && (
          <div className="p-4 border-t border-gray-200 flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-sm text-gray-600">
              Showing{" "}
              {(participantsData.pagination.page - 1) * pagination.limit + 1} to{" "}
              {Math.min(
                participantsData.pagination.page * pagination.limit,
                participantsData.pagination.totalResults
              )}{" "}
              of {participantsData.pagination.totalResults} participants
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                className="h-9 w-9"
                onClick={() =>
                  handlePageChange(participantsData.pagination.page - 1)
                }
                disabled={participantsData.pagination.page <= 1}
              >
                <AltArrowLeft className="h-4 w-4" />
              </Button>
              {Array.from(
                {
                  length: Math.min(5, participantsData.pagination.totalPages),
                },
                (_, i) => i + 1
              ).map((page) => (
                <Button
                  key={page}
                  size="sm"
                  onClick={() => handlePageChange(page)}
                  className={`h-9 w-9 ${
                    participantsData.pagination.page === page
                      ? "bg-primary text-white hover:bg-primary/90"
                      : "border border-gray-200 bg-white text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  {page}
                </Button>
              ))}
              <Button
                variant="outline"
                size="sm"
                className="h-9 w-9"
                onClick={() =>
                  handlePageChange(participantsData.pagination.page + 1)
                }
                disabled={!participantsData.pagination.hasMore}
              >
                <AltArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      </div>

      <ParticipantDetailsDialog
        participant={selectedParticipant}
        open={isDetailsOpen}
        onOpenChange={setIsDetailsOpen}
      />
    </div>
  );
}