import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle 
} from "@/components/ui/card";
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
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  Search, 
  Plus, 
  Eye, 
  Edit, 
  XCircle, 
  Clock, 
  Calendar, 
  Sun, 
  Moon,
  Bed,
  Calendar as CalendarIcon,
  DollarSign,
  RefreshCw
} from "lucide-react";
import { toast } from "sonner";
import { 
  useGetRateTimeBands, 
  useDeleteRateTimeBand 
} from "@/hooks/useRateTimeBandHooks";
import { RateTimeBand, RateTimeBandFilters } from "@/entities/RateTimeBand";

export function RateTimeBandsManagement() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [showInactive, setShowInactive] = useState(false);
  
  // Create filters for API call
  const filters: RateTimeBandFilters = useMemo(() => {
    const filterObj: RateTimeBandFilters = {};
    
    if (!showInactive) {
      filterObj.isActive = true;
    }
    
    if (searchQuery.trim()) {
      filterObj.search = searchQuery.trim();
    }
    
    // Sort by name by default
    filterObj.sortField = 'name';
    filterObj.sortDirection = 'asc';
    
    return filterObj;
  }, [searchQuery, showInactive]);

  // API calls
  const { data: rateTimeBands = [], isLoading, error } = useGetRateTimeBands(filters);
  const deleteRateTimeBandMutation = useDeleteRateTimeBand();

  // Client-side filtering for search (in case API doesn't support search)
  const filteredRateTimeBands = useMemo(() => {
    if (!searchQuery.trim()) return rateTimeBands;
    
    const searchTermLower = searchQuery.toLowerCase();
    return rateTimeBands.filter(band => 
      band.name.toLowerCase().includes(searchTermLower) ||
      band.code.toLowerCase().includes(searchTermLower) ||
      band.description.toLowerCase().includes(searchTermLower)
    );
  }, [rateTimeBands, searchQuery]);

  const handleViewTimeBand = (id: string) => {
    navigate(`/admin/rate-time-band/${id}/view`);
  };

  const handleEditTimeBand = (id: string) => {
    navigate(`/admin/rate-time-band/${id}/edit`);
  };

  const handleDeleteTimeBand = async (id: string) => {
    try {
      await deleteRateTimeBandMutation.mutateAsync(id);
    } catch (error) {
      // Error is handled by the hook
    }
  };

  const handleAddTimeBand = () => {
    navigate('/admin/rate-time-band/create');
  };

  const getShiftTypeIcon = (band: RateTimeBand) => {
    if (band.isPublicHoliday) return <CalendarIcon className="h-4 w-4 text-red-500" />;
    if (band.isWeekend) return <Sun className="h-4 w-4 text-orange-500" />;
    if (band.isSleepover) return <Bed className="h-4 w-4 text-primary-500" />;
    
    // For regular day shifts based on time
    if (band.startTime && band.endTime) {
      const startHour = parseInt(band.startTime.split(':')[0]);
      if (startHour >= 6 && startHour < 12) return <Sun className="h-4 w-4 text-yellow-500" />;
      if (startHour >= 12 && startHour < 18) return <Sun className="h-4 w-4 text-orange-400" />;
      return <Moon className="h-4 w-4 text-indigo-500" />;
    }
    
    return <Clock className="h-4 w-4 text-gray-1000" />;
  };

  const getStatusBadge = (isActive: boolean) => {
    return isActive ? 
      <Badge variant="outline" className="bg-green-50 text-green-700 border-green-300">Active</Badge> : 
      <Badge variant="outline" className="bg-red-50 text-red-700 border-red-300">Inactive</Badge>;
  };

  const formatMultiplier = (multiplier: number) => {
    return `${multiplier}x`;
  };

  // Loading state
  if (isLoading) {
    return (
      <Card className="w-full">
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
            <div>
              <CardTitle>Rate Time Bands</CardTitle>
              <CardDescription>
                Manage shift time bands and their rate multipliers
              </CardDescription>
            </div>
            <Skeleton className="h-10 w-40" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
              <Skeleton className="h-10 w-full sm:w-[300px]" />
              <Skeleton className="h-10 w-32" />
            </div>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[250px]">Name</TableHead>
                    <TableHead className="w-[150px]">Code</TableHead>
                    <TableHead className="w-[200px]">Time</TableHead>
                    <TableHead className="w-[100px]">Multiplier</TableHead>
                    <TableHead className="w-[100px]">Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {Array.from({ length: 5 }).map((_, i) => (
                    <TableRow key={i}>
                      <TableCell><Skeleton className="h-4 w-full" /></TableCell>
                      <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                      <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                      <TableCell><Skeleton className="h-4 w-12" /></TableCell>
                      <TableCell><Skeleton className="h-4 w-16" /></TableCell>
                      <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Error state
  if (error) {
    return (
      <Card className="w-full">
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
            <div>
              <CardTitle>Rate Time Bands</CardTitle>
              <CardDescription>
                Manage shift time bands and their rate multipliers
              </CardDescription>
            </div>
            <Button onClick={handleAddTimeBand}>
              <Plus className="h-4 w-4 mr-2" />
              Add New Time Band
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-64">
            <div className="text-center text-red-600">
              <RefreshCw className="h-8 w-8 mx-auto mb-4" />
              <p className="font-montserrat-semibold">Error loading rate time bands</p>
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
    );
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
          <div>
            <CardTitle>Rate Time Bands</CardTitle>
            <CardDescription>
              Manage shift time bands and their rate multipliers
            </CardDescription>
          </div>
          <Button onClick={handleAddTimeBand}>
            <Plus className="h-4 w-4 mr-2" />
            Add New Time Band
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
          <div className="relative w-full sm:w-auto">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search time bands..."
              className="pl-8 w-full sm:w-[300px]"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => setShowInactive(!showInactive)}
              className={showInactive ? "bg-muted" : ""}
            >
              {showInactive ? "Hide Inactive" : "Show Inactive"}
            </Button>
          </div>
        </div>

        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[250px]">Name</TableHead>
                <TableHead className="w-[150px]">Code</TableHead>
                <TableHead className="w-[200px]">Time</TableHead>
                <TableHead className="w-[100px]">Multiplier</TableHead>
                <TableHead className="w-[100px]">Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredRateTimeBands.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="h-24 text-center">
                    {searchQuery.trim() 
                      ? "No rate time bands match your search." 
                      : "No rate time bands found."}
                  </TableCell>
                </TableRow>
              ) : (
                filteredRateTimeBands.map((band) => (
                  <TableRow key={band._id}>
                    <TableCell className="font-montserrat-semibold">
                      <div className="flex items-center gap-2">
                        {getShiftTypeIcon(band)}
                        <span>{band.name}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="font-mono bg-muted">
                        {band.code}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {band.startTime && band.endTime ? (
                        <span className="text-sm">{band.startTime} - {band.endTime}</span>
                      ) : (
                        <span className="text-sm text-muted-foreground">Not specified</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <DollarSign className="h-3 w-3 text-green-600 mr-1" />
                        <span className="font-montserrat-semibold">{formatMultiplier(band.baseRateMultiplier)}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      {getStatusBadge(band.isActive)}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="h-8"
                          onClick={() => handleViewTimeBand(band._id)}
                        >
                          <Eye className="h-4 w-4 mr-2" />
                          View
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="h-8"
                          onClick={() => handleEditTimeBand(band._id)}
                        >
                          <Edit className="h-4 w-4 mr-2" />
                          Edit
                        </Button>
                        
                        {band.isActive && (
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button 
                                variant="outline" 
                                size="sm" 
                                className="h-8 text-red-600 hover:text-red-700 hover:bg-red-50"
                                disabled={deleteRateTimeBandMutation.isPending}
                              >
                                <XCircle className="h-4 w-4 mr-2" />
                                {deleteRateTimeBandMutation.isPending ? "Deleting..." : "Delete"}
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Delete Rate Time Band</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Are you sure you want to delete this rate time band? This action cannot be undone and will affect any rates that use this time band.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction 
                                  onClick={() => handleDeleteTimeBand(band._id)}
                                  className="bg-red-600 hover:bg-red-700"
                                  disabled={deleteRateTimeBandMutation.isPending}
                                >
                                  {deleteRateTimeBandMutation.isPending ? "Deleting..." : "Delete"}
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
        
        {/* Results info */}
        <div className="text-sm text-muted-foreground mt-4">
          Showing {filteredRateTimeBands.length} rate time band{filteredRateTimeBands.length !== 1 ? 's' : ''}
        </div>
      </CardContent>
    </Card>
  );
}