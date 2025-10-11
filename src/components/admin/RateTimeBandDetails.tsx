import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { 
  ArrowLeft, 
  Calendar, 
  Clock, 
  Edit, 
  Sun, 
  Moon, 
  DollarSign,
  Bed,
  Calendar as CalendarIcon,
  CheckCircle,
  XCircle,
  RefreshCw
} from "lucide-react";
import { 
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import { format } from "date-fns";
import { useGetRateTimeBandById } from "@/hooks/useRateTimeBandHooks";
import { RateTimeBand } from "@/entities/RateTimeBand";

export function RateTimeBandDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  // API call to get rate time band details
  const { data: timeBand, isLoading, error } = useGetRateTimeBandById(id);

  const handleGoBack = () => {
    navigate('/admin/rate-time-band');
  };

  const handleEdit = () => {
    navigate(`/admin/rate-time-band/${id}/edit`);
  };

  const formatDate = (dateString: string) => {
    return format(new Date(dateString), 'PPP p');
  };

  // Icon based on shift type
  const getShiftTypeIcon = (timeBand: RateTimeBand) => {
    if (timeBand.isPublicHoliday) return <CalendarIcon className="h-6 w-6 text-red-500" />;
    if (timeBand.isWeekend) return <Sun className="h-6 w-6 text-orange-500" />;
    if (timeBand.isSleepover) return <Bed className="h-6 w-6 text-primary-500" />;
    
    // For regular day shifts based on time
    if (timeBand.startTime && timeBand.endTime) {
      const startHour = parseInt(timeBand.startTime.split(':')[0]);
      if (startHour >= 6 && startHour < 12) return <Sun className="h-6 w-6 text-yellow-500" />;
      if (startHour >= 12 && startHour < 18) return <Sun className="h-6 w-6 text-orange-400" />;
      return <Moon className="h-6 w-6 text-indigo-500" />;
    }
    
    return <Clock className="h-6 w-6 text-gray-1000" />;
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="container mx-auto py-6 max-w-3xl">
        <div className="flex items-center mb-6">
          <Button variant="ghost" size="sm" onClick={handleGoBack} className="mr-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Time Bands
          </Button>
          <Skeleton className="h-8 w-48" />
        </div>
        
        <Card>
          <CardHeader className="pb-4">
            <div className="flex items-center gap-3">
              <Skeleton className="h-6 w-6 rounded-full" />
              <div>
                <Skeleton className="h-6 w-32 mb-2" />
                <Skeleton className="h-4 w-24" />
              </div>
            </div>
          </CardHeader>
          
          <CardContent className="space-y-6">
            <div>
              <Skeleton className="h-4 w-24 mb-2" />
              <Skeleton className="h-4 w-full" />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <Skeleton className="h-32 w-full" />
                <Skeleton className="h-32 w-full" />
              </div>
              <div className="space-y-4">
                <Skeleton className="h-32 w-full" />
                <Skeleton className="h-32 w-full" />
              </div>
            </div>
          </CardContent>
          
          <CardFooter className="border-t pt-6">
            <Skeleton className="h-10 w-32" />
          </CardFooter>
        </Card>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="container mx-auto py-6 max-w-3xl">
        <div className="flex items-center mb-6">
          <Button variant="ghost" size="sm" onClick={handleGoBack} className="mr-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Time Bands
          </Button>
          <h1 className="text-2xl font-montserrat-bold">Error Loading Rate Time Band</h1>
        </div>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-center h-64">
              <div className="text-center text-red-600">
                <RefreshCw className="h-8 w-8 mx-auto mb-4" />
                <p className="font-medium">Error loading rate time band details</p>
                <p className="text-sm text-gray-600 mt-1">Please try again later</p>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="mt-4"
                  onClick={() => window.location.reload()}
                >
                  Retry
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Not found state
  if (!timeBand) {
    return (
      <Card className="max-w-3xl mx-auto mt-8">
        <CardHeader>
          <div className="flex items-center">
            <Button variant="ghost" size="sm" onClick={handleGoBack} className="mr-4">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            <CardTitle>Rate Time Band Not Found</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <p>The rate time band you're looking for could not be found.</p>
        </CardContent>
        <CardFooter>
          <Button onClick={handleGoBack}>Return to Time Bands</Button>
        </CardFooter>
      </Card>
    );
  }

  return (
    <div className="container mx-auto py-6 max-w-3xl">
      <div className="flex items-center mb-6">
        <Button variant="ghost" size="sm" onClick={handleGoBack} className="mr-4">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Time Bands
        </Button>
        <h1 className="text-2xl font-montserrat-bold">Rate Time Band Details</h1>
      </div>
      
      <Card>
        <CardHeader className="pb-4 flex flex-row items-start justify-between">
          <div>
            <div className="flex items-center gap-3">
              {getShiftTypeIcon(timeBand)}
              <div>
                <CardTitle className="text-xl">{timeBand.name}</CardTitle>
                <CardDescription>{timeBand.code}</CardDescription>
              </div>
            </div>
          </div>
          <Badge 
            variant="outline" 
            className={timeBand.isActive ? 
              "bg-green-50 text-green-700 border-green-300" : 
              "bg-red-50 text-red-700 border-red-300"
            }
          >
            {timeBand.isActive ? "Active" : "Inactive"}
          </Badge>
        </CardHeader>
        
        <CardContent className="space-y-6">
          <div>
            <h3 className="text-sm font-medium text-muted-foreground mb-2">Description</h3>
            <p>{timeBand.description || "No description provided."}</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-2">Time Information</h3>
                <div className="bg-muted/40 p-4 rounded-lg space-y-3">
                  {timeBand.startTime && timeBand.endTime ? (
                    <div className="flex items-center gap-3">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="text-sm font-medium">Time Range</p>
                        <p className="text-sm">{timeBand.startTime} - {timeBand.endTime}</p>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center gap-3">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="text-sm font-medium">Time Range</p>
                        <p className="text-sm text-muted-foreground">Not specified</p>
                      </div>
                    </div>
                  )}
                  
                  <div className="flex items-center gap-3">
                    <DollarSign className="h-4 w-4 text-green-600" />
                    <div>
                      <p className="text-sm font-medium">Base Rate Multiplier</p>
                      <p className="text-sm">{timeBand.baseRateMultiplier}x standard rate</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-2">Shift Categories</h3>
                <div className="bg-muted/40 p-4 rounded-lg space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <p className="text-sm">Weekend Shift</p>
                    </div>
                    {timeBand.isWeekend ? 
                      <CheckCircle className="h-4 w-4 text-green-600" /> : 
                      <XCircle className="h-4 w-4 text-muted-foreground" />
                    }
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <p className="text-sm">Public Holiday</p>
                    </div>
                    {timeBand.isPublicHoliday ? 
                      <CheckCircle className="h-4 w-4 text-green-600" /> : 
                      <XCircle className="h-4 w-4 text-muted-foreground" />
                    }
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Bed className="h-4 w-4 text-muted-foreground" />
                      <p className="text-sm">Sleepover Shift</p>
                    </div>
                    {timeBand.isSleepover ? 
                      <CheckCircle className="h-4 w-4 text-green-600" /> : 
                      <XCircle className="h-4 w-4 text-muted-foreground" />
                    }
                  </div>
                </div>
              </div>
            </div>
            
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-2">System Information</h3>
                <div className="bg-muted/40 p-4 rounded-lg space-y-3">
                  <div>
                    <p className="text-sm font-medium">ID</p>
                    <p className="text-xs font-mono mt-1 bg-muted p-1 rounded">{timeBand._id}</p>
                  </div>
                  
                  <div>
                    <p className="text-sm font-medium">Created</p>
                    <p className="text-sm">{formatDate(timeBand.createdAt)}</p>
                  </div>
                  
                  <div>
                    <p className="text-sm font-medium">Last Updated</p>
                    <p className="text-sm">{formatDate(timeBand.updatedAt)}</p>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-2">Usage Information</h3>
                <div className="bg-muted/40 p-4 rounded-lg">
                  <p className="text-sm">This time band is currently used in X rate configurations and Y support worker profiles.</p>
                  <p className="text-sm mt-2 text-muted-foreground">Deactivating this time band will affect these configurations.</p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
        
        <CardFooter className="border-t pt-6 flex flex-wrap gap-3">
          <Button onClick={handleEdit}>
            <Edit className="h-4 w-4 mr-2" />
            Edit Time Band
          </Button>
          <Button variant="outline" onClick={handleGoBack}>
            Back to Time Bands
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}