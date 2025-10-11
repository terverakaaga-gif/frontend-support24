import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useParams, useNavigate } from "react-router-dom";
import {
  Building2,
  Users,
  DollarSign,
  Mail,
  Clock,
  CheckCircle,
  XCircle,
  Building,
  Activity,
  ArrowLeft,
  Phone,
  User,
  MapPin,
  UserPlus,
  FileText,
  Shield,
  Calendar as CalendarIcon,
  ChevronDown,
  ChevronUp,
  MoreVertical,
  Edit,
  Trash2,
  Settings,
  AlertCircle,
  TrendingUp,
  X,
  MessageSquare,
  Star,
  Award,
  Briefcase,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { get } from "@/api/apiClient";
import { format, parseISO } from "date-fns";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

// Types
interface RateTimeBand {
  _id: string;
  name: string;
  code: string;
  startTime?: string;
  endTime?: string;
  isActive: boolean;
}

interface ShiftRate {
  rateTimeBandId: string | RateTimeBand;
  hourlyRate: number;
  _id: string;
}

interface ServiceAgreement {
  baseHourlyRate: number;
  shiftRates: ShiftRate[];
  distanceTravelRate: number;
  startDate: string;
  termsAccepted: boolean;
}

interface WorkerProfile {
  _id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
  profileImage?: string;
}

interface Worker {
  serviceAgreement: ServiceAgreement;
  workerId: string | WorkerProfile;
  joinedDate: string;
  _id: string;
}

interface ProposedRates {
  baseHourlyRate: number;
  shiftRates: ShiftRate[];
  distanceTravelRate: number;
}

interface PendingInvite {
  proposedRates: ProposedRates;
  serviceAgreement: {
    shiftRates: ShiftRate[];
  };
  workerId: string | WorkerProfile;
  inviteDate: string;
  status: string;
  notes: string;
  _id: string;
  adminId?: string;
  responseDate?: string;
  adminNotes?: string;
  declineReason?: string;
}

interface Organization {
  _id: string;
  name: string;
  participantId: string;
  workers: Worker[];
  pendingInvites: PendingInvite[];
  description: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

// API service
const organizationDetailService = {
  getOrganization: async (id: string): Promise<Organization> => {
    const response = await get<{ organizations: Organization[] }>("/organizations");
    const organization = response.organizations.find((org) => org._id === id);
    if (!organization) {
      throw new Error("Organization not found");
    }
    return organization;
  },
};

// Helper functions
const getWorkerDisplayName = (workerId: string | WorkerProfile): string => {
  if (typeof workerId === "string") {
    return `Worker ${workerId.slice(-8)}`;
  }
  return `${workerId.firstName} ${workerId.lastName}`;
};

const getWorkerInitials = (workerId: string | WorkerProfile): string => {
  if (typeof workerId === "string") {
    return workerId.slice(0, 2).toUpperCase();
  }
  return `${workerId.firstName[0]}${workerId.lastName[0]}`.toUpperCase();
};

const getWorkerEmail = (workerId: string | WorkerProfile): string => {
  if (typeof workerId === "string") {
    return "Email not available";
  }
  return workerId.email;
};

const getWorkerPhone = (workerId: string | WorkerProfile): string => {
  if (typeof workerId === "string") {
    return "Phone not available";
  }
  return workerId.phone;
};

const getWorkerProfileImage = (workerId: string | WorkerProfile): string | undefined => {
  if (typeof workerId === "string") {
    return undefined;
  }
  return workerId.profileImage;
};

const getShiftRateName = (code: string): string => {
  const shiftNames: { [key: string]: string } = {
    "MORNING": "Morning Shift",
    "AFTERNOON": "Afternoon Shift", 
    "NIGHT": "Night Shift",
    "WEEKEND": "Weekend Shift",
    "HOLIDAY": "Public Holiday Shift",
  };
  return shiftNames[code] || code;
};

const getRateBandName = (rateTimeBandId: string | RateTimeBand): string => {
  if (typeof rateTimeBandId === "object") {
    return getShiftRateName(rateTimeBandId.code);
  }
  const rateBandNames: { [key: string]: string } = {
    "681c6f750ab224ca6685d05c": "Morning Shift",
    "681c6f750ab224ca6685d05d": "Afternoon Shift",
    "681c6f750ab224ca6685d05e": "Night Shift",
    "681c6f750ab224ca6685d05f": "Weekend Shift",
    "681c6f750ab224ca6685d060": "Public Holiday Shift",
  };
  return rateBandNames[rateTimeBandId] || `Rate Band ${rateTimeBandId.slice(-4)}`;
};

const getRateBandCode = (rateTimeBandId: string | RateTimeBand): string => {
  if (typeof rateTimeBandId === "object") {
    return rateTimeBandId.code;
  }
  return "";
};

export default function ParticipantOrganizationDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<
    "overview" | "workers" | "invites"
  >("overview");

  const {
    data: organization,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["organization-details", id],
    queryFn: () => organizationDetailService.getOrganization(id!),
    enabled: !!id,
  });

  const activeWorkers = organization?.workers || [];
  const pendingInvites =
    organization?.pendingInvites.filter((inv) => inv.status === "pending") ||
    [];
  const declinedInvites =
    organization?.pendingInvites.filter((inv) => inv.status === "declined") ||
    [];

  if (error || isLoading || !organization) {
    return (
      <div className="min-h-screen bg-gray-50 p-4 md:p-6">
        <div className="max-w-md mx-auto mt-20">
          <Card className="border-0 shadow-lg">
            <CardContent className="p-8 text-center">
              {error ? (
                <>
                  <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    Failed to load organization
                  </h3>
                  <Button
                    onClick={() => refetch()}
                    className="bg-[#008CFF] hover:bg-[#008CFF]/90"
                  >
                    Try Again
                  </Button>
                </>
              ) : isLoading ? (
                <>
                  <div className="space-y-4">
                    <Skeleton className="h-16 w-16 rounded-full mx-auto" />
                    <Skeleton className="h-4 w-48 mx-auto" />
                    <Skeleton className="h-4 w-32 mx-auto" />
                  </div>
                </>
              ) : (
                <>
                  <Building2 className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    Organization not found
                  </h3>
                  <Button onClick={() => navigate(-1)}>Go Back</Button>
                </>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto p-4 md:p-6 space-y-6">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-sm p-4 md:p-6">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate(-1)}
            className="mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Organizations
          </Button>

          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
            <div className="flex items-start gap-4">
              <div className="w-16 h-16 rounded-full bg-[#008CFF] flex items-center justify-center flex-shrink-0">
                <Users className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
                  {organization.name}
                </h1>
                <p className="text-gray-600">{organization.description}</p>

                <div className="flex flex-wrap gap-3 mt-4">
                  <Badge
                    variant="outline"
                    className="text-green-700 bg-green-50 border-green-200"
                  >
                    <Users className="w-3 h-3 mr-1" />
                    {activeWorkers.length} Active Workers
                  </Badge>
                  <Badge
                    variant="outline"
                    className="text-orange-700 bg-orange-50 border-orange-200"
                  >
                    <Clock className="w-3 h-3 mr-1" />
                    {pendingInvites.length} Pending Invites
                  </Badge>
                  <Badge
                    variant="outline"
                    className="text-red-700 bg-red-50 border-red-200"
                  >
                    <XCircle className="w-3 h-3 mr-1" />
                    {declinedInvites.length} Declined Invites
                  </Badge>
                </div>
              </div>
            </div>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm">
                  <MoreVertical className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>
                  <Edit className="w-4 h-4 mr-2" />
                  Edit Organization
                </DropdownMenuItem>
                <DropdownMenuItem>Delete Organization</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </div>
  );
}
