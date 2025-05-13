import { useState, useEffect } from "react";
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
  DollarSign
} from "lucide-react";
import { toast } from "@/hooks/use-toast";

// Define the interface for the time band data
interface RateTimeBand {
  _id: string;
  name: string;
  code: string;
  startTime?: string;
  endTime?: string;
  description: string;
  isWeekend: boolean;
  isPublicHoliday: boolean;
  isSleepover: boolean;
  isActive: boolean;
  baseRateMultiplier: number;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

// Mock data
const mockTimeBands: RateTimeBand[] = [
  {
    "_id": "681c6f750ab224ca6685d05d",
    "name": "Afternoon Shift",
    "code": "AFTERNOON",
    "startTime": "14:00",
    "endTime": "22:00",
    "description": "Early afternoon to late evening shift",
    "isWeekend": false,
    "isPublicHoliday": false,
    "isSleepover": false,
    "isActive": true,
    "baseRateMultiplier": 1,
    "__v": 0,
    "createdAt": "2025-05-08T08:46:45.660Z",
    "updatedAt": "2025-05-08T08:46:45.660Z"
  },
  {
    "_id": "681c6f750ab224ca6685d05c",
    "name": "Morning Shift",
    "code": "MORNING",
    "startTime": "06:00",
    "endTime": "14:00",
    "description": "Early morning to early afternoon shift",
    "isWeekend": false,
    "isPublicHoliday": false,
    "isSleepover": false,
    "isActive": true,
    "baseRateMultiplier": 1,
    "__v": 0,
    "createdAt": "2025-05-08T08:46:45.659Z",
    "updatedAt": "2025-05-08T08:46:45.659Z"
  },
  {
    "_id": "681c6f750ab224ca6685d05e",
    "name": "Night Shift",
    "code": "NIGHT",
    "startTime": "22:00",
    "endTime": "06:00",
    "description": "Overnight shift",
    "isWeekend": false,
    "isPublicHoliday": false,
    "isSleepover": true,
    "isActive": true,
    "baseRateMultiplier": 1.25,
    "__v": 0,
    "createdAt": "2025-05-08T08:46:45.660Z",
    "updatedAt": "2025-05-08T08:46:45.660Z"
  },
  {
    "_id": "681c6f750ab224ca6685d060",
    "name": "Public Holiday Shift",
    "code": "HOLIDAY",
    "description": "Any shift during a public holiday",
    "isWeekend": false,
    "isPublicHoliday": true,
    "isSleepover": false,
    "isActive": true,
    "baseRateMultiplier": 2,
    "__v": 0,
    "createdAt": "2025-05-08T08:46:45.662Z",
    "updatedAt": "2025-05-08T08:46:45.662Z"
  },
  {
    "_id": "681c6f750ab224ca6685d05f",
    "name": "Weekend Shift",
    "code": "WEEKEND",
    "description": "Any shift during the weekend",
    "isWeekend": true,
    "isPublicHoliday": false,
    "isSleepover": false,
    "isActive": true,
    "baseRateMultiplier": 1.5,
    "__v": 0,
    "createdAt": "2025-05-08T08:46:45.661Z",
    "updatedAt": "2025-05-08T08:46:45.661Z"
  }
];

export function RateTimeBandsManagement() {
  const navigate = useNavigate();
  const [timeBands, setTimeBands] = useState<RateTimeBand[]>(mockTimeBands);
  const [searchQuery, setSearchQuery] = useState("");
  const [showInactive, setShowInactive] = useState(false);
  const [loading, setLoading] = useState(false);

  // Filter time bands based on search query and active status
  const filteredTimeBands = timeBands.filter(band => {
    const matchesSearch = 
      band.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      band.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      band.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = showInactive ? true : band.isActive;
    
    return matchesSearch && matchesStatus;
  });

  // Sort time bands by name
  const sortedTimeBands = [...filteredTimeBands].sort((a, b) => 
    a.name.localeCompare(b.name)
  );

  const handleViewTimeBand = (id: string) => {
    navigate(`/admin/rate-time-band/${id}/view`);
  };

  const handleEditTimeBand = (id: string) => {
    navigate(`/admin/rate-time-band/${id}/edit`);
  };

  const handleDeactivateTimeBand = (id: string) => {
    setTimeBands(prevBands => 
      prevBands.map(band => 
        band._id === id ? { ...band, isActive: false } : band
      )
    );
    
    toast({
      title: "Rate Time Band Deactivated",
      description: "The rate time band has been deactivated successfully.",
    });
  };

  const handleAddTimeBand = () => {
    navigate('/admin/rate-time-band/create');
  };

  const getShiftTypeIcon = (band: RateTimeBand) => {
    if (band.isPublicHoliday) return <CalendarIcon className="h-4 w-4 text-red-500" />;
    if (band.isWeekend) return <Sun className="h-4 w-4 text-orange-500" />;
    if (band.isSleepover) return <Bed className="h-4 w-4 text-blue-500" />;
    
    // For regular day shifts based on time
    if (band.startTime && band.endTime) {
      const startHour = parseInt(band.startTime.split(':')[0]);
      if (startHour >= 6 && startHour < 12) return <Sun className="h-4 w-4 text-yellow-500" />;
      if (startHour >= 12 && startHour < 18) return <Sun className="h-4 w-4 text-orange-400" />;
      return <Moon className="h-4 w-4 text-indigo-500" />;
    }
    
    return <Clock className="h-4 w-4 text-gray-500" />;
  };

  const getStatusBadge = (isActive: boolean) => {
    return isActive ? 
      <Badge variant="outline" className="bg-green-50 text-green-700 border-green-300">Active</Badge> : 
      <Badge variant="outline" className="bg-red-50 text-red-700 border-red-300">Inactive</Badge>;
  };

  const formatMultiplier = (multiplier: number) => {
    return `${multiplier}x`;
  };

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
              {sortedTimeBands.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="h-24 text-center">
                    No time bands found.
                  </TableCell>
                </TableRow>
              ) : (
                sortedTimeBands.map((band) => (
                  <TableRow key={band._id}>
                    <TableCell className="font-medium">
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
                        <span className="font-medium">{formatMultiplier(band.baseRateMultiplier)}</span>
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
                              >
                                <XCircle className="h-4 w-4 mr-2" />
                                Deactivate
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Deactivate Rate Time Band</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Are you sure you want to deactivate this rate time band? This will affect any rates that use this time band.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction 
                                  onClick={() => handleDeactivateTimeBand(band._id)}
                                  className="bg-red-600 hover:bg-red-700"
                                >
                                  Deactivate
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
      </CardContent>
    </Card>
  );
}