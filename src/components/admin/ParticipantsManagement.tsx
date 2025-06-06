// pages/admin/ParticipantsList.tsx
import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { 
  Search, 
  Filter, 
  ChevronDown, 
  Eye, 
  Calendar,
  Users,
  CheckCircle,
  XCircle,
  Clock,
  AlertCircle
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';

// import { useGetParticipants, useGetFilterOptions } from '@/api/hooks/useAdminUserHooks';
import { useGetParticipants, useGetFilterOptions } from '@/hooks/useAdminUserHooks';
import { ParticipantFilters, SortOptions, PaginationOptions } from '@/api/services/adminUserService';
import { Participant, ParticipantTableFilters } from '@/entities/Participant';

const ParticipantsList: React.FC = () => {
  const navigate = useNavigate();
  
  // State for filters, sorting, and pagination
  const [filters, setFilters] = useState<ParticipantTableFilters>({});
  const [sort, setSort] = useState<SortOptions>({ field: 'createdAt', direction: 'desc' });
  const [pagination, setPagination] = useState<PaginationOptions>({ page: 1, limit: 20 });
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);

  // API calls
  const { data: participantsData, isLoading, error } = useGetParticipants(filters, sort, pagination);
  const { data: filterOptions } = useGetFilterOptions();

  // Handlers
  const handleFilterChange = (key: keyof ParticipantTableFilters, value: string | boolean | undefined) => {
    const newFilters = { ...filters };
    
    if (value === 'all' || value === '' || value === undefined) {
      delete newFilters[key];
    } else {
      newFilters[key] = value;
    }
    
    setFilters(newFilters);
    setPagination({ ...pagination, page: 1 }); // Reset to first page when filters change
  };

  const handleSortChange = (field: string) => {
    const newDirection = sort.field === field && sort.direction === 'asc' ? 'desc' : 'asc';
    setSort({ field, direction: newDirection });
  };

  const handlePageChange = (page: number) => {
    setPagination({ ...pagination, page });
  };

  const handleViewParticipant = (participantId: string) => {
    navigate(`/admin/participants/${participantId}`);
  };

  const clearAllFilters = () => {
    setFilters({});
    setPagination({ ...pagination, page: 1 });
  };

  // Helper functions
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'pending':
        return <Clock className="h-4 w-4 text-yellow-500" />;
      case 'suspended':
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      case 'inactive':
        return <XCircle className="h-4 w-4 text-gray-500" />;
      default:
        return <Clock className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusVariant = (status: string): "default" | "secondary" | "destructive" | "outline" => {
    switch (status) {
      case 'active':
        return 'default';
      case 'pending':
        return 'secondary';
      case 'suspended':
        return 'destructive';
      case 'inactive':
        return 'outline';
      default:
        return 'outline';
    }
  };

  // Pagination component
  const PaginationControls = () => {
    if (!participantsData?.pagination) return null;

    const { page, totalPages, hasMore } = participantsData.pagination;
    const maxVisiblePages = 5;
    const startPage = Math.max(1, page - Math.floor(maxVisiblePages / 2));
    const endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    return (
      <div className="flex items-center justify-between px-2">
        <div className="text-sm text-muted-foreground">
          Showing {((page - 1) * pagination.limit) + 1} to{' '}
          {Math.min(page * pagination.limit, participantsData.pagination.totalResults)} of{' '}
          {participantsData.pagination.totalResults} participants
        </div>
        
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePageChange(page - 1)}
            disabled={page <= 1}
          >
            Previous
          </Button>
          
          {Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage + i).map((pageNum) => (
            <Button
              key={pageNum}
              variant={pageNum === page ? "default" : "outline"}
              size="sm"
              onClick={() => handlePageChange(pageNum)}
            >
              {pageNum}
            </Button>
          ))}
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePageChange(page + 1)}
            disabled={!hasMore}
          >
            Next
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
              Error loading participants. Please try again.
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Participants Management</h1>
          <p className="text-muted-foreground">Manage all participants</p>
        </div>
      </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" onClick={() => setIsFiltersOpen(!isFiltersOpen)}>
            <Filter className="h-4 w-4 mr-2" />
            Filters
            <ChevronDown className={`h-4 w-4 ml-2 transition-transform ${isFiltersOpen ? 'rotate-180' : ''}`} />
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Collapsible open={isFiltersOpen} onOpenChange={setIsFiltersOpen}>
        <CollapsibleContent>
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Filters</CardTitle>
              <CardDescription>Filter participants by various criteria</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {/* Search */}
                <div className="space-y-2">
                  <Label htmlFor="search">Search</Label>
                  <div className="relative">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="search"
                      placeholder="Search by name or email..."
                      value={filters.search || ''}
                      onChange={(e) => handleFilterChange('search', e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>

                {/* Status */}
                <div className="space-y-2">
                  <Label>Status</Label>
                  <Select
                    value={filters.status || 'all'}
                    onValueChange={(value) => handleFilterChange('status', value)}
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

                {/* Subscription Tier */}
                {/* <div className="space-y-2">
                  <Label>Subscription Tier</Label>
                  <Select
                    value={filters.subscriptionTier || 'all'}
                    onValueChange={(value) => handleFilterChange('subscriptionTier', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select tier" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Tiers</SelectItem>
                      {filterOptions?.subscriptionTiers.map((tier) => (
                        <SelectItem key={tier} value={tier}>
                          {tier.charAt(0).toUpperCase() + tier.slice(1)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div> */}

                {/* Email Verified */}
                <div className="space-y-2">
                  <Label>Email Verification</Label>
                  <Select
                    value={filters.isEmailVerified === undefined ? 'all' : filters.isEmailVerified.toString()}
                    onValueChange={(value) => {
                      if (value === 'all') {
                        handleFilterChange('isEmailVerified', undefined);
                      } else {
                        handleFilterChange('isEmailVerified', value === 'true');
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
                    value={filters.hasOrganization === undefined ? 'all' : filters.hasOrganization.toString()}
                    onValueChange={(value) => {
                      if (value === 'all') {
                        handleFilterChange('hasOrganization', undefined);
                      } else {
                        handleFilterChange('hasOrganization', value === 'true');
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

                {/* Requires Supervision */}
                {/* <div className="space-y-2">
                  <Label>Supervision</Label>
                  <Select
                    value={filters.requiresSupervision === undefined ? 'all' : filters.requiresSupervision.toString()}
                    onValueChange={(value) => {
                      if (value === 'all') {
                        handleFilterChange('requiresSupervision', undefined);
                      } else {
                        handleFilterChange('requiresSupervision', value === 'true');
                      }
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select supervision" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All</SelectItem>
                      <SelectItem value="true">Requires Supervision</SelectItem>
                      <SelectItem value="false">No Supervision Required</SelectItem>
                    </SelectContent>
                  </Select>
                </div> */}

                {/* Subscription Status */}
                {/* <div className="space-y-2">
                  <Label>Subscription Status</Label>
                  <Select
                    value={filters.subscriptionStatus || 'all'}
                    onValueChange={(value) => handleFilterChange('subscriptionStatus', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select subscription status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All</SelectItem>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="inactive">Inactive</SelectItem>
                    </SelectContent>
                  </Select>
                </div> */}
              </div>

              {/* Filter Actions */}
              <div className="flex items-center justify-between mt-6 pt-4 border-t">
                <div className="text-sm text-muted-foreground">
                  {Object.keys(filters).length > 0 && (
                    <span>{Object.keys(filters).length} filter(s) applied</span>
                  )}
                </div>
                <Button variant="outline" onClick={clearAllFilters}>
                  Clear All Filters
                </Button>
              </div>
            </CardContent>
          </Card>
        </CollapsibleContent>
      </Collapsible>

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
                    <TableHead 
                      className="cursor-pointer hover:bg-muted/50"
                      onClick={() => handleSortChange('firstName')}
                    >
                      <div className="flex items-center space-x-1">
                        <span>Name</span>
                        {sort.field === 'firstName' && (
                          <ChevronDown className={`h-4 w-4 ${sort.direction === 'asc' ? 'rotate-180' : ''}`} />
                        )}
                      </div>
                    </TableHead>
                    <TableHead 
                      className="cursor-pointer hover:bg-muted/50"
                      onClick={() => handleSortChange('email')}
                    >
                      <div className="flex items-center space-x-1">
                        <span>Email</span>
                        {sort.field === 'email' && (
                          <ChevronDown className={`h-4 w-4 ${sort.direction === 'asc' ? 'rotate-180' : ''}`} />
                        )}
                      </div>
                    </TableHead>
                    <TableHead>Status</TableHead>
                    {/* <TableHead>Subscription</TableHead> */}
                    <TableHead>Organization</TableHead>
                    <TableHead>Email Verified</TableHead>
                    <TableHead 
                      className="cursor-pointer hover:bg-muted/50"
                      onClick={() => handleSortChange('createdAt')}
                    >
                      <div className="flex items-center space-x-1">
                        <span>Created</span>
                        {sort.field === 'createdAt' && (
                          <ChevronDown className={`h-4 w-4 ${sort.direction === 'asc' ? 'rotate-180' : ''}`} />
                        )}
                      </div>
                    </TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {participantsData?.users?.map((participant: Participant) => (
                    <TableRow key={participant._id}>
                      <TableCell>
                        <div>
                          <div className="font-medium">
                            {participant.firstName} {participant.lastName}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {participant.phone}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{participant.email}</TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          {getStatusIcon(participant.status)}
                          <Badge variant={getStatusVariant(participant.status)}>
                            {participant.status}
                          </Badge>
                        </div>
                      </TableCell>
                      {/* <TableCell>
                        <div>
                          <Badge variant={participant.subscription.isActive ? "default" : "secondary"}>
                            {participant.subscription.tier}
                          </Badge>
                          <div className="text-xs text-muted-foreground mt-1">
                            {participant.subscription.isActive ? "Active" : "Inactive"}
                          </div>
                        </div>
                      </TableCell> */}
                      <TableCell>
                        <div className="flex items-center space-x-1">
                          <Users className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm">
                            {participant.organizationCount} org{participant.organizationCount !== 1 ? 's' : ''}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          {participant.isEmailVerified ? (
                            <CheckCircle className="h-4 w-4 text-green-500" />
                          ) : (
                            <XCircle className="h-4 w-4 text-red-500" />
                          )}
                          <span className="text-sm">
                            {participant.isEmailVerified ? "Verified" : "Not Verified"}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-1">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm">
                            {format(new Date(participant.createdAt), 'MMM dd, yyyy')}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleViewParticipant(participant._id)}
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
                  <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium">No participants found</h3>
                  <p className="text-muted-foreground">
                    {Object.keys(filters).length > 0 
                      ? "Try adjusting your filters to see more results."
                      : "No participants have been registered yet."
                    }
                  </p>
                </div>
              )}

              {/* Pagination */}
              {participantsData?.users?.length > 0 && (
                <div className="border-t p-4">
                  <PaginationControls />
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ParticipantsList;