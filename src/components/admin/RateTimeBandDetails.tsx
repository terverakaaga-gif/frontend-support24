import { useState, useEffect } from "react";
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
  XCircle
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
import { Separator } from "@/components/ui/separator";
import { format } from "date-fns";

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

export function RateTimeBandDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [timeBand, setTimeBand] = useState<RateTimeBand | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate API call to fetch time band details
    const fetchTimeBandDetails = () => {
      setLoading(true);
      setTimeout(() => {
        const foundBand = mockTimeBands.find(band => band._id === id) || null;
        setTimeBand(foundBand);
        setLoading(false);
      }, 500);
    };

    fetchTimeBandDetails();
  }, [id]);

  const handleGoBack = () => {
    navigate('/admin/rate-time-band');
  };

  const handleEdit = () => {
    navigate(`/admin/rate-time-band/${id}/edit`);
  };

  const formatDate = (dateString: string) => {
    return format(new Date(dateString), 'PPP p');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

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

  // Icon based on shift type
  const getShiftTypeIcon = () => {
    if (timeBand.isPublicHoliday) return <CalendarIcon className="h-6 w-6 text-red-500" />;
    if (timeBand.isWeekend) return <Sun className="h-6 w-6 text-orange-500" />;
    if (timeBand.isSleepover) return <Bed className="h-6 w-6 text-blue-500" />;
    
    // For regular day shifts based on time
    if (timeBand.startTime && timeBand.endTime) {
      const startHour = parseInt(timeBand.startTime.split(':')[0]);
      if (startHour >= 6 && startHour < 12) return <Sun className="h-6 w-6 text-yellow-500" />;
      if (startHour >= 12 && startHour < 18) return <Sun className="h-6 w-6 text-orange-400" />;
      return <Moon className="h-6 w-6 text-indigo-500" />;
    }
    
    return <Clock className="h-6 w-6 text-gray-500" />;
  };

  return (
    <div className="container mx-auto py-6 max-w-3xl">
      <div className="flex items-center mb-6">
        <Button variant="ghost" size="sm" onClick={handleGoBack} className="mr-4">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Time Bands
        </Button>
        <h1 className="text-2xl font-bold">Rate Time Band Details</h1>
      </div>
      
      <Card>
        <CardHeader className="pb-4 flex flex-row items-start justify-between">
          <div>
            <div className="flex items-center gap-3">
              {getShiftTypeIcon()}
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
  )}