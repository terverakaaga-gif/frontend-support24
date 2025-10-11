import React, { useState, useMemo } from "react";
import { format } from "date-fns";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Search,
  Filter,
  Eye,
  Edit,
  Trash2,
  RefreshCw,
  Plus,
  ChevronDown,
  MoreVertical,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

// Import our hooks and types
import {
  useGetServiceTypes,
  useCreateServiceType,
  useUpdateServiceType,
  useDeleteServiceType,
} from "@/hooks/useServiceTypeHooks";
import {
  ServiceType,
  ServiceTypeStatus,
  ServiceTypeFilters,
  CreateServiceTypeRequest,
  UpdateServiceTypeRequest,
  SERVICE_TYPE_STATUS_CONFIG,
} from "@/entities/ServiceType";

const ServiceTypesManagement: React.FC = () => {
  // Filter states
  const [filters, setFilters] = useState<ServiceTypeFilters>({
    sortField: "createdAt",
    sortDirection: "desc",
  });
  const [showFilters, setShowFilters] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  // Dialog states
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editingServiceType, setEditingServiceType] = useState<ServiceType | null>(null);

  // Form states
  const [formData, setFormData] = useState<CreateServiceTypeRequest>({
    name: "",
    code: "",
    status: ServiceTypeStatus.ACTIVE,
  });

  // API calls
  const { data: serviceTypes = [], isLoading, error } = useGetServiceTypes(filters);
  const createMutation = useCreateServiceType();
  const updateMutation = useUpdateServiceType();
  const deleteMutation = useDeleteServiceType();

  // Helper functions
  const formatDate = (dateString: string) => format(new Date(dateString), "MMM d, yyyy");
  const formatDateTime = (dateString: string) => format(new Date(dateString), "PPp");

  // Client-side search filtering
  const filteredServiceTypes = useMemo(() => {
    if (!searchTerm) return serviceTypes;
    
    const searchTermLower = searchTerm.toLowerCase();
    return serviceTypes.filter(
      (serviceType) =>
        serviceType.name.toLowerCase().includes(searchTermLower) ||
        serviceType.code.toLowerCase().includes(searchTermLower)
    );
  }, [serviceTypes, searchTerm]);

  // Filter change handlers
  const handleFilterChange = (key: keyof ServiceTypeFilters, value: any) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value === "all" || value === "" ? undefined : value,
    }));
  };

  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
  };

  const handleResetFilters = () => {
    setFilters({
      sortField: "createdAt",
      sortDirection: "desc",
    });
    setSearchTerm("");
  };

  // Form handlers
  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createMutation.mutate(formData, {
      onSuccess: () => {
        setCreateDialogOpen(false);
        setFormData({
          name: "",
          code: "",
          status: ServiceTypeStatus.ACTIVE,
        });
      },
    });
  };

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingServiceType) return;
    
    updateMutation.mutate(
      { id: editingServiceType._id, data: formData as UpdateServiceTypeRequest },
      {
        onSuccess: () => {
          setEditDialogOpen(false);
          setEditingServiceType(null);
          setFormData({
            name: "",
            code: "",
            status: ServiceTypeStatus.ACTIVE,
          });
        },
      }
    );
  };

  const handleEdit = (serviceType: ServiceType) => {
    setEditingServiceType(serviceType);
    setFormData({
      name: serviceType.name,
      code: serviceType.code,
      status: serviceType.status,
    });
    setEditDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    deleteMutation.mutate(id);
  };

  // Check if any filters are active
  const hasActiveFilters = filters.status || searchTerm;

  // Status badge component
  const getStatusBadge = (status: ServiceTypeStatus) => {
    const config = SERVICE_TYPE_STATUS_CONFIG[status];
    return (
      <Badge variant={config.variant} className={cn("text-xs", config.color)}>
        {config.label}
      </Badge>
    );
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-4 w-64 mt-2" />
          </div>
          <Skeleton className="h-10 w-32" />
        </div>
        
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-32" />
            <Skeleton className="h-4 w-48" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-64 w-full" />
          </CardContent>
        </Card>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-montserrat-bold">Service Types</h1>
            <p className="text-sm text-gray-600 mt-1">Manage service type categories</p>
          </div>
        </div>
        
        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <h3 className="text-base font-montserrat-semibold text-red-600 mb-2">Error Loading Service Types</h3>
              <p className="text-sm text-gray-600 mb-4">
                There was an error loading the service types. Please try again.
              </p>
              <Button onClick={() => window.location.reload()}>
                <RefreshCw className="h-4 w-4 mr-2" />
                Retry
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-montserrat-bold">Service Types</h1>
          <p className="text-sm text-gray-600 mt-1">Manage service type categories</p>
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowFilters(!showFilters)}
          >
            <Filter className="h-4 w-4 mr-2" />
            {showFilters ? "Hide" : "Show"} Filters
          </Button>
          <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add Service Type
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New Service Type</DialogTitle>
                <DialogDescription>
                  Add a new service type category to the system.
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleCreateSubmit}>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Name</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="Enter service type name"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="code">Code</Label>
                    <Input
                      id="code"
                      value={formData.code}
                      onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                      placeholder="Enter service type code"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="status">Status</Label>
                    <Select
                      value={formData.status}
                      onValueChange={(value) => setFormData({ ...formData, status: value as ServiceTypeStatus })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value={ServiceTypeStatus.ACTIVE}>Active</SelectItem>
                        <SelectItem value={ServiceTypeStatus.INACTIVE}>Inactive</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <DialogFooter>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setCreateDialogOpen(false)}
                    disabled={createMutation.isPending}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" disabled={createMutation.isPending}>
                    {createMutation.isPending ? "Creating..." : "Create"}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Search Bar */}
      <div className="flex items-center space-x-4">
        <div className="flex-1 max-w-md">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by name or code..."
              value={searchTerm}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
      </div>

      {/* Filters */}
      {showFilters && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Filters</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Status filter */}
              <div className="space-y-2">
                <label className="text-xs font-medium">Status</label>
                <Select
                  value={filters.status || "all"}
                  onValueChange={(value) => handleFilterChange("status", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="All statuses" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Statuses</SelectItem>
                    <SelectItem value={ServiceTypeStatus.ACTIVE}>Active</SelectItem>
                    <SelectItem value={ServiceTypeStatus.INACTIVE}>Inactive</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex items-center justify-between mt-4">
              <div className="text-xs text-muted-foreground">
                {hasActiveFilters && <span>Filters applied</span>}
              </div>
              <Button variant="outline" onClick={handleResetFilters}>
                Clear All Filters
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Service Types Table */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">
            Service Types ({filteredServiceTypes.length})
          </CardTitle>
          <CardDescription>
            {hasActiveFilters 
              ? `Showing filtered results from ${serviceTypes.length} service types`
              : 'All service types in the system'
            }
          </CardDescription>
        </CardHeader>
        <CardContent>
          {filteredServiceTypes.length === 0 ? (
            <div className="text-center py-8">
              <h3 className="text-base font-montserrat-semibold mb-2">No service types found</h3>
              <p className="text-sm text-gray-600">
                {hasActiveFilters 
                  ? "No service types match your current filters." 
                  : "No service types have been created yet."
                }
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-xs">Name</TableHead>
                    <TableHead className="text-xs">Code</TableHead>
                    <TableHead className="text-xs">Status</TableHead>
                    <TableHead className="text-xs">Created</TableHead>
                    <TableHead className="text-xs">Last Updated</TableHead>
                    <TableHead className="text-xs">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredServiceTypes.map((serviceType) => (
                    <TableRow key={serviceType._id}>
                      <TableCell className="font-medium text-sm">
                        {serviceType.name}
                      </TableCell>
                      <TableCell className="text-sm">
                        <code className="bg-gray-100 px-2 py-1 rounded text-xs">
                          {serviceType.code}
                        </code>
                      </TableCell>
                      <TableCell>
                        {getStatusBadge(serviceType.status)}
                      </TableCell>
                      <TableCell className="text-sm">
                        {formatDate(serviceType.createdAt)}
                      </TableCell>
                      <TableCell className="text-sm">
                        {formatDate(serviceType.updatedAt)}
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => handleEdit(serviceType)}>
                              <Edit className="h-4 w-4 mr-2" />
                              Edit
                            </DropdownMenuItem>
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                                  <Trash2 className="h-4 w-4 mr-2" />
                                  Deactivate
                                </DropdownMenuItem>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>Deactivate Service Type</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    Are you sure you want to deactivate "{serviceType.name}"? 
                                    This will change its status to inactive.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                                  <AlertDialogAction
                                    onClick={() => handleDelete(serviceType._id)}
                                    className="bg-red-600 hover:bg-red-700"
                                  >
                                    Deactivate
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Edit Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Service Type</DialogTitle>
            <DialogDescription>
              Update the service type information.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleEditSubmit}>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="edit-name">Name</Label>
                <Input
                  id="edit-name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Enter service type name"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-code">Code</Label>
                <Input
                  id="edit-code"
                  value={formData.code}
                  onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                  placeholder="Enter service type code"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-status">Status</Label>
                <Select
                  value={formData.status}
                  onValueChange={(value) => setFormData({ ...formData, status: value as ServiceTypeStatus })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={ServiceTypeStatus.ACTIVE}>Active</SelectItem>
                    <SelectItem value={ServiceTypeStatus.INACTIVE}>Inactive</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setEditDialogOpen(false)}
                disabled={updateMutation.isPending}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={updateMutation.isPending}>
                {updateMutation.isPending ? "Updating..." : "Update"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ServiceTypesManagement; 