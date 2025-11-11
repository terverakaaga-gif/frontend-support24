import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { format } from "date-fns";
import { 
  ArrowLeft,
  Edit,
  Trash2,
  Calendar,
  Hash,
  Activity,
  RefreshCw
} from "lucide-react";
import { 
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
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
import { cn } from "@/lib/utils";

// Import our hooks and types
import { 
  useGetServiceTypeById, 
  useDeleteServiceType 
} from "@/hooks/useServiceTypeHooks";
import { 
  ServiceTypeStatus, 
  SERVICE_TYPE_STATUS_CONFIG 
} from "@/entities/ServiceType";

const ServiceTypeDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const { data: serviceType, isLoading, error } = useGetServiceTypeById(id);
  const deleteMutation = useDeleteServiceType();

  const handleGoBack = () => {
    navigate('/admin/service-types');
  };

  const handleEdit = () => {
    // TODO: Implement edit functionality - could open a modal or navigate to edit page
    console.log('Edit service type:', serviceType?._id);
  };

  const handleDelete = () => {
    if (!serviceType) return;
    
    deleteMutation.mutate(serviceType._id, {
      onSuccess: () => {
        navigate('/admin/service-types');
      },
    });
  };

  // Helper functions
  const formatDate = (dateString: string) => format(new Date(dateString), "MMM d, yyyy");
  const formatDateTime = (dateString: string) => format(new Date(dateString), "PPpp");

  // Get status badge component
  const getStatusBadge = (status: ServiceTypeStatus) => {
    const config = SERVICE_TYPE_STATUS_CONFIG[status];
    return (
      <Badge variant={config.variant} className={cn("text-sm", config.color)}>
        {config.label}
      </Badge>
    );
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="container mx-auto py-6 max-w-4xl">
        <div className="flex items-center mb-6">
          <Button variant="ghost" size="sm" onClick={handleGoBack} className="mr-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Service Types
          </Button>
          <h1 className="text-2xl font-montserrat-bold">Loading Service Type...</h1>
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
                </div>
              </CardContent>
            </Card>
          </div>
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <Skeleton className="h-5 w-1/2" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-24 w-full" />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error || !serviceType) {
    return (
      <div className="container mx-auto py-6 max-w-4xl">
        <Card>
          <CardHeader>
            <div className="flex items-center">
              <Button variant="ghost" size="sm" onClick={handleGoBack} className="mr-4">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
              <CardTitle>Service Type Not Found</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-red-600">The service type you're looking for could not be found.</p>
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
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Service Types
          </Button>
          <div>
            <h1 className="text-2xl font-montserrat-bold">{serviceType.name}</h1>
            <p className="text-sm text-gray-600">Service Type Details</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          {getStatusBadge(serviceType.status)}
        </div>
      </div>

      {/* Content */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="md:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Service Type Information</CardTitle>
              <CardDescription>
                Basic information about this service type
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {/* Basic Details */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-sm font-montserrat-semibold text-gray-600 mb-2">Service Name</h3>
                      <p className="text-sm font-montserrat-semibold">{serviceType.name}</p>
                    </div>
                    
                    <div>
                      <h3 className="text-sm font-montserrat-semibold text-gray-600 mb-2">Service Code</h3>
                      <code className="bg-gray-100 px-3 py-1 rounded text-sm font-mono">
                        {serviceType.code}
                      </code>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-sm font-montserrat-semibold text-gray-600 mb-2">Status</h3>
                      {getStatusBadge(serviceType.status)}
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Timestamps */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="flex items-center space-x-2">
                      <Calendar className="h-4 w-4 text-gray-1000" />
                      <div>
                        <h3 className="text-sm font-montserrat-semibold text-gray-600">Created</h3>
                        <p className="text-sm">{formatDateTime(serviceType.createdAt)}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="flex items-center space-x-2">
                      <Activity className="h-4 w-4 text-gray-1000" />
                      <div>
                        <h3 className="text-sm font-montserrat-semibold text-gray-600">Last Updated</h3>
                        <p className="text-sm">{formatDateTime(serviceType.updatedAt)}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          {/* Actions */}
          <Card className="mt-6">
            <CardHeader>
              <CardTitle className="text-base">Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-3">
                <Button variant="outline" onClick={handleEdit}>
                  <Edit className="h-4 w-4 mr-2" />
                  Edit Service Type
                </Button>
                
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="outline" className="text-red-600 hover:text-red-700 hover:bg-red-50">
                      <Trash2 className="h-4 w-4 mr-2" />
                      Deactivate Service Type
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Deactivate Service Type</AlertDialogTitle>
                      <AlertDialogDescription>
                        Are you sure you want to deactivate "{serviceType.name}"? 
                        This will change its status to inactive and it will no longer be available for new shifts.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={handleDelete}
                        className="bg-red-600 hover:bg-red-700"
                        disabled={deleteMutation.isPending}
                      >
                        {deleteMutation.isPending ? 'Deactivating...' : 'Deactivate'}
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Quick Info */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Quick Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-600">ID:</span>
                  <span className="text-xs font-mono text-gray-800">{serviceType._id}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-600">Code:</span>
                  <span className="text-xs font-mono text-gray-800">{serviceType.code}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-600">Status:</span>
                  {getStatusBadge(serviceType.status)}
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-600">Created:</span>
                  <span className="text-xs text-gray-800">{formatDate(serviceType.createdAt)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-600">Updated:</span>
                  <span className="text-xs text-gray-800">{formatDate(serviceType.updatedAt)}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Usage Statistics */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Usage Statistics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-600">Active Shifts:</span>
                  <span className="text-xs font-montserrat-semibold">-</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-600">Total Shifts:</span>
                  <span className="text-xs font-montserrat-semibold">-</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-600">Organizations Using:</span>
                  <span className="text-xs font-montserrat-semibold">-</span>
                </div>
              </div>
              <p className="text-xs text-gray-1000 mt-3">
                Usage statistics will be available in a future update.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ServiceTypeDetail; 