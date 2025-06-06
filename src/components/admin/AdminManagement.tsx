// pages/admin/AdminsList.tsx
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
  AlertCircle,
  Shield,
  UserCheck,
  Settings,
  Crown,
  Building,
  X
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
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';

import { useGetAdmins, useGetFilterOptions } from '@/hooks/useAdminUserHooks';
import { AdminFilters, SortOptions, PaginationOptions } from '@/api/services/adminUserService';
import { Admin, AdminTableFilters, PermissionSummary } from '@/entities/Admin';

const AdminsList: React.FC = () => {
  const navigate = useNavigate();
  
  // State for filters, sorting, and pagination
  const [filters, setFilters] = useState<AdminTableFilters>({});
  const [sort, setSort] = useState<SortOptions>({ field: 'createdAt', direction: 'desc' });
  const [pagination, setPagination] = useState<PaginationOptions>({ page: 1, limit: 20 });
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);

  // API calls
  const { data: adminsData, isLoading, error } = useGetAdmins(filters, sort, pagination);
  const { data: filterOptions } = useGetFilterOptions();

  // Handlers
  const handleFilterChange = (key: keyof AdminTableFilters, value: string | boolean | undefined) => {
    const newFilters = { ...filters };
    
    if (value === 'all' || value === '' || value === undefined) {
      delete newFilters[key];
    } else {
      newFilters[key] = value;
    }
    
    setFilters(newFilters);
    setPagination({ ...pagination, page: 1 }); // Reset to first page when filters change
  };

  const handleSearchChange = (value: string) => {
    const newFilters = { ...filters };
    
    if (value === '' || value === undefined) {
      delete newFilters.search;
    } else {
      newFilters.search = value;
    }
    
    setFilters(newFilters);
    setPagination({ ...pagination, page: 1 });
  };

  const handleSortChange = (field: string) => {
    const newDirection = sort.field === field && sort.direction === 'asc' ? 'desc' : 'asc';
    setSort({ field, direction: newDirection });
  };

  const handlePageChange = (page: number) => {
    setPagination({ ...pagination, page });
  };

  const handleViewAdmin = (adminId: string) => {
    navigate(`/admin/administrators/${adminId}`);
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

  const getAdminTypeIcon = (adminType: string) => {
    switch (adminType.toLowerCase()) {
      case 'superadmin':
        return <Crown className="h-4 w-4 text-yellow-500" />;
      default:
        return <Shield className="h-4 w-4 text-blue-500" />;
    }
  };

  const getAdminTypeVariant = (adminType: string): "default" | "secondary" | "destructive" | "outline" => {
    switch (adminType.toLowerCase()) {
      case 'superadmin':
        return 'default';
      default:
        return 'secondary';
    }
  };

  const calculatePermissionProgress = (permissions: Admin['permissions']): PermissionSummary => {
    if (!permissions) {
      return { total: 0, granted: 0, percentage: 0 };
    }
    
    const permissionValues = Object.values(permissions);
    const granted = permissionValues.filter(permission => permission === true).length;
    const total = permissionValues.length;
    const percentage = total > 0 ? Math.round((granted / total) * 100) : 0;
    
    return { 
      total, 
      granted, 
      percentage 
    };
  };

  // Get active filters count (excluding search)
  const activeFiltersCount = Object.keys(filters).filter(key => key !== 'search').length;

  // Pagination component
  const PaginationControls = () => {
    if (!adminsData?.pagination) return null;

    const { page, totalPages, hasMore } = adminsData.pagination;
    const maxVisiblePages = 5;
    const startPage = Math.max(1, page - Math.floor(maxVisiblePages / 2));
    const endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    return (
      <div className="flex items-center justify-between px-2">
        <div className="text-sm text-muted-foreground">
          Showing {((page - 1) * pagination.limit) + 1} to{' '}
          {Math.min(page * pagination.limit, adminsData.pagination.totalResults)} of{' '}
          {adminsData.pagination.totalResults} administrators
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
              Error loading administrators. Please try again.
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <TooltipProvider>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          {/* <div>
            <h1 className="text-3xl font-bold tracking-tight">Administrators</h1>
            <p className="text-muted-foreground">
              Manage and view all administrators in the system
            </p>
          </div> */}
          
        </div>

        {/* Search Bar */}
        <div className='flex items-center justify-between'>
            <div className="flex items-center space-x-4">
            <div className="flex-1 max-w-md">
                <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                    placeholder="Search by name or email..."
                    value={filters.search || ''}
                    onChange={(e) => handleSearchChange(e.target.value)}
                    className="pl-10"
                />
                </div>
            </div>
            </div>

            <div className="flex items-center space-x-2">
            <Button variant="outline" onClick={() => setIsFiltersOpen(!isFiltersOpen)}>
              <Filter className="h-4 w-4 mr-2" />
              Filters
              {activeFiltersCount > 0 && (
                <Badge variant="secondary" className="ml-2 h-5 min-w-5 text-xs">
                  {activeFiltersCount}
                </Badge>
              )}
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
                <CardDescription>Filter administrators by various criteria</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
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

                  {/* Admin Type */}
                  <div className="space-y-2">
                    <Label>Admin Type</Label>
                    <Select
                      value={filters.adminType || 'all'}
                      onValueChange={(value) => handleFilterChange('adminType', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select admin type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Types</SelectItem>
                        {filterOptions?.adminTypes.map((type) => (
                          <SelectItem key={type} value={type}>
                            {type.charAt(0).toUpperCase() + type.slice(1)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

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

                  {/* Has Assigned Organizations */}
                  <div className="space-y-2">
                    <Label>Assigned Organizations</Label>
                    <Select
                      value={filters.hasAssignedOrganizations === undefined ? 'all' : filters.hasAssignedOrganizations.toString()}
                      onValueChange={(value) => {
                        if (value === 'all') {
                          handleFilterChange('hasAssignedOrganizations', undefined);
                        } else {
                          handleFilterChange('hasAssignedOrganizations', value === 'true');
                        }
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select assignment status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All</SelectItem>
                        <SelectItem value="true">Has Organizations</SelectItem>
                        <SelectItem value="false">No Organizations</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Can Manage Users */}
                  <div className="space-y-2">
                    <Label>Manage Users Permission</Label>
                    <Select
                      value={filters.canManageUsers === undefined ? 'all' : filters.canManageUsers.toString()}
                      onValueChange={(value) => {
                        if (value === 'all') {
                          handleFilterChange('canManageUsers', undefined);
                        } else {
                          handleFilterChange('canManageUsers', value === 'true');
                        }
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select permission" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All</SelectItem>
                        <SelectItem value="true">Can Manage</SelectItem>
                        <SelectItem value="false">Cannot Manage</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Can Manage Workers */}
                  <div className="space-y-2">
                    <Label>Manage Workers Permission</Label>
                    <Select
                      value={filters.canManageWorkers === undefined ? 'all' : filters.canManageWorkers.toString()}
                      onValueChange={(value) => {
                        if (value === 'all') {
                          handleFilterChange('canManageWorkers', undefined);
                        } else {
                          handleFilterChange('canManageWorkers', value === 'true');
                        }
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select permission" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All</SelectItem>
                        <SelectItem value="true">Can Manage</SelectItem>
                        <SelectItem value="false">Cannot Manage</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Can Manage Participants */}
                  <div className="space-y-2">
                    <Label>Manage Participants Permission</Label>
                    <Select
                      value={filters.canManageParticipants === undefined ? 'all' : filters.canManageParticipants.toString()}
                      onValueChange={(value) => {
                        if (value === 'all') {
                          handleFilterChange('canManageParticipants', undefined);
                        } else {
                          handleFilterChange('canManageParticipants', value === 'true');
                        }
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select permission" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All</SelectItem>
                        <SelectItem value="true">Can Manage</SelectItem>
                        <SelectItem value="false">Cannot Manage</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Can Access Financials */}
                  <div className="space-y-2">
                    <Label>Financial Access Permission</Label>
                    <Select
                      value={filters.canAccessFinancials === undefined ? 'all' : filters.canAccessFinancials.toString()}
                      onValueChange={(value) => {
                        if (value === 'all') {
                          handleFilterChange('canAccessFinancials', undefined);
                        } else {
                          handleFilterChange('canAccessFinancials', value === 'true');
                        }
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select permission" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All</SelectItem>
                        <SelectItem value="true">Has Access</SelectItem>
                        <SelectItem value="false">No Access</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Can Manage Admins */}
                  <div className="space-y-2">
                    <Label>Manage Admins Permission</Label>
                    <Select
                      value={filters.canManageAdmins === undefined ? 'all' : filters.canManageAdmins.toString()}
                      onValueChange={(value) => {
                        if (value === 'all') {
                          handleFilterChange('canManageAdmins', undefined);
                        } else {
                          handleFilterChange('canManageAdmins', value === 'true');
                        }
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select permission" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All</SelectItem>
                        <SelectItem value="true">Can Manage</SelectItem>
                        <SelectItem value="false">Cannot Manage</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Filter Actions */}
                <div className="flex items-center justify-between mt-6 pt-4 border-t">
                  <div className="text-sm text-muted-foreground">
                    {activeFiltersCount > 0 && (
                      <span>{activeFiltersCount} filter(s) applied</span>
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

        {/* Active Filters Display */}
        {activeFiltersCount > 0 && (
          <div className="flex items-center space-x-2">
            <span className="text-sm text-muted-foreground">Active filters:</span>
            <Badge variant="secondary">
              {activeFiltersCount} filter{activeFiltersCount !== 1 ? 's' : ''} applied
            </Badge>
            <Button variant="ghost" size="sm" onClick={clearAllFilters}>
              <X className="h-4 w-4 mr-1" />
              Clear all
            </Button>
          </div>
        )}

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
                          <span>Administrator</span>
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
                      <TableHead>Admin Type</TableHead>
                      <TableHead>Permissions</TableHead>
                      {/* <TableHead>Organizations</TableHead> */}
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
                    {adminsData?.users?.map((admin: Admin) => {
                      const permissionProgress = calculatePermissionProgress(admin.permissions);
                      
                      return (
                        <TableRow key={admin._id}>
                          <TableCell>
                            <div className="flex items-center space-x-3">
                              <Avatar>
                                <AvatarFallback>
                                  {admin.firstName.charAt(0)}{admin.lastName.charAt(0)}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <div className="font-medium flex items-center space-x-2">
                                  <span>{admin.firstName} {admin.lastName}</span>
                                  {admin.isEmailVerified && (
                                    <CheckCircle className="h-3 w-3 text-green-500" />
                                  )}
                                </div>
                                <div className="text-sm text-muted-foreground">
                                  {admin.phone}
                                </div>
                              </div>
                            </div>
                          </TableCell>
                          
                          <TableCell>
                            <span>{admin.email}</span>
                          </TableCell>
                          
                          <TableCell>
                            <div className="flex items-center space-x-2">
                              {getStatusIcon(admin.status)}
                              <Badge variant={getStatusVariant(admin.status)}>
                                {admin.status}
                              </Badge>
                            </div>
                          </TableCell>
                          
                          <TableCell>
                            <div className="flex items-center space-x-2">
                              {getAdminTypeIcon(admin.adminType)}
                              <Badge variant={getAdminTypeVariant(admin.adminType)}>
                                {admin.adminType}
                              </Badge>
                            </div>
                          </TableCell>
                          
                          <TableCell>
                            <Tooltip>
                              <TooltipTrigger>
                                <div className="flex items-center space-x-2">
                                  <Progress 
                                    value={permissionProgress.percentage} 
                                    className="w-16 h-2"
                                  />
                                  <span className="text-sm font-medium">
                                    {permissionProgress.granted}/{permissionProgress.total}
                                  </span>
                                </div>
                              </TooltipTrigger>
                              <TooltipContent>
                                <div className="space-y-1">
                                  <div className="font-medium">Permissions</div>
                                  <div className="grid grid-cols-2 gap-2 text-sm">
                                    <div className="flex items-center space-x-1">
                                      <Users className="h-3 w-3" />
                                      <span>Users: {admin.permissions?.canManageUsers ? '✓' : '✗'}</span>
                                    </div>
                                    <div className="flex items-center space-x-1">
                                      <UserCheck className="h-3 w-3" />
                                      <span>Workers: {admin.permissions?.canManageWorkers ? '✓' : '✗'}</span>
                                    </div>
                                    <div className="flex items-center space-x-1">
                                      <Users className="h-3 w-3" />
                                      <span>Participants: {admin.permissions?.canManageParticipants ? '✓' : '✗'}</span>
                                    </div>
                                    <div className="flex items-center space-x-1">
                                      <CheckCircle className="h-3 w-3" />
                                      <span>Invites: {admin.permissions?.canApproveInvites ? '✓' : '✗'}</span>
                                    </div>
                                    <div className="flex items-center space-x-1">
                                      <Settings className="h-3 w-3" />
                                      <span>Agreements: {admin.permissions?.canManageServiceAgreements ? '✓' : '✗'}</span>
                                    </div>
                                    <div className="flex items-center space-x-1">
                                      <Crown className="h-3 w-3" />
                                      <span>Subscriptions: {admin.permissions?.canManageSubscriptions ? '✓' : '✗'}</span>
                                    </div>
                                    <div className="flex items-center space-x-1">
                                      <Settings className="h-3 w-3" />
                                      <span>Financials: {admin.permissions?.canAccessFinancials ? '✓' : '✗'}</span>
                                    </div>
                                    <div className="flex items-center space-x-1">
                                      <Shield className="h-3 w-3" />
                                      <span>Admins: {admin.permissions?.canManageAdmins ? '✓' : '✗'}</span>
                                    </div>
                                  </div>
                                </div>
                              </TooltipContent>
                            </Tooltip>
                          </TableCell>
                          
                          {/* <TableCell>
                            <div className="flex items-center space-x-1">
                              <Building className="h-4 w-4 text-muted-foreground" />
                              <span className="text-sm">
                                {admin.assignedOrganizationCount} org{admin.assignedOrganizationCount !== 1 ? 's' : ''}
                              </span>
                            </div>
                          </TableCell> */}
                          
                          <TableCell>
                            <div className="flex items-center space-x-1">
                              <Calendar className="h-4 w-4 text-muted-foreground" />
                              <span className="text-sm">
                                {format(new Date(admin.createdAt), 'MMM dd, yyyy')}
                              </span>
                            </div>
                          </TableCell>
                          
                          <TableCell>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleViewAdmin(admin._id)}
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
                {adminsData?.users?.length === 0 && (
                  <div className="text-center py-12">
                    <Shield className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-medium">No administrators found</h3>
                    <p className="text-muted-foreground">
                      {Object.keys(filters).length > 0 
                        ? "Try adjusting your filters to see more results."
                        : "No administrators have been registered yet."
                      }
                    </p>
                  </div>
                )}

                {/* Pagination */}
                {adminsData?.users?.length > 0 && (
                  <div className="border-t p-4">
                    <PaginationControls />
                  </div>
                )}
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </TooltipProvider>
  );
};

export default AdminsList;