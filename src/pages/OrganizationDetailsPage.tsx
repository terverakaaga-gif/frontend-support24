import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useParams, useNavigate } from "react-router-dom";
import {
  Building2,
  Users,
  Calendar,
  DollarSign,
  Mail,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Eye,
  MoreVertical,
  Building,
  TrendingUp,
  Activity,
  ArrowLeft,
  Phone,
  User,
  MapPin,
  Edit,
  Trash2,
  UserPlus,
  Settings,
  Star,
  FileText,
  CreditCard,
  Shield,
  Target,
  Award,
  Calendar as CalendarIcon,
  ChevronDown,
  ChevronUp,
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
import { Separator } from "@/components/ui/separator";
import { get } from "@/api/apiClient";
import { format, parseISO } from "date-fns";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

// Updated types based on actual API response
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

interface OrganizationResponse {
  organization: Organization;
}

// API service
const organizationDetailService = {
  getOrganization: async (id: string): Promise<Organization> => {
    // For now, we'll use the organizations endpoint and filter
    // In a real app, this would be a dedicated endpoint like /organizations/:id
    const response = await get<{ organizations: Organization[] }>(
      "/organizations"
    );
    const organization = response.organizations.find((org) => org._id === id);
    if (!organization) {
      throw new Error("Organization not found");
    }
    return organization;
  },
};

export default function OrganizationDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [expandedSections, setExpandedSections] = useState<
    Record<string, boolean>
  >({
    workers: true,
    invites: true,
    agreements: false,
  });

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

  const toggleSection = (section: string) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  // Helper function to get rate band name
  const getRateBandName = (rateTimeBandId: string | RateTimeBand): string => {
    if (typeof rateTimeBandId === "object") {
      return rateTimeBandId.name;
    }
    // For string IDs, try to provide a more readable name based on common patterns
    const rateBandNames: { [key: string]: string } = {
      "681c6f750ab224ca6685d05c": "Morning Shift",
      "681c6f750ab224ca6685d05d": "Afternoon Shift",
      "681c6f750ab224ca6685d05e": "Night Shift",
      "681c6f750ab224ca6685d05f": "Weekend Shift",
      "681c6f750ab224ca6685d060": "Holiday Shift",
    };
    return (
      rateBandNames[rateTimeBandId] || `Rate Band ${rateTimeBandId.slice(-4)}`
    );
  };

  // Helper function to get rate band details
  const getRateBandDetails = (
    rateTimeBandId: string | RateTimeBand
  ): RateTimeBand | null => {
    if (typeof rateTimeBandId === "object") {
      return rateTimeBandId;
    }
    return null;
  };

  // Helper function to format time
  const formatTime = (time?: string): string => {
    if (!time) return "";
    return time;
  };

  // Helper functions to handle worker ID (string or object)
  const getWorkerIdString = (workerId: string | WorkerProfile): string => {
    if (typeof workerId === "string") {
      return workerId;
    }
    return workerId._id;
  };

  const getWorkerDisplayName = (workerId: string | WorkerProfile): string => {
    if (typeof workerId === "string") {
      return `Worker ${workerId.slice(-8)}`;
    }
    return `${workerId.firstName} ${workerId.lastName}`;
  };

  const getWorkerInitials = (workerId: string | WorkerProfile): string => {
    if (typeof workerId === "string") {
      return workerId.slice(-2).toUpperCase();
    }
    return `${workerId.firstName[0]}${workerId.lastName[0]}`;
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

  const getWorkerProfileImage = (
    workerId: string | WorkerProfile
  ): string | undefined => {
    if (typeof workerId === "string") {
      return undefined;
    }
    return workerId.profileImage;
  };

  // Calculate stats
  const stats = organization
    ? {
        totalWorkers: organization.workers.length,
        totalInvites: organization.pendingInvites.length,
        pendingInvites: organization.pendingInvites.filter(
          (invite) => invite.status === "pending"
        ).length,
        declinedInvites: organization.pendingInvites.filter(
          (invite) => invite.status === "declined"
        ).length,
        averageBaseRate:
          organization.workers.length > 0
            ? Math.round(
                organization.workers.reduce(
                  (sum, worker) => sum + worker.serviceAgreement.baseHourlyRate,
                  0
                ) / organization.workers.length
              )
            : 0,
        averageDistanceRate:
          organization.workers.length > 0
            ? (
                organization.workers.reduce(
                  (sum, worker) =>
                    sum + worker.serviceAgreement.distanceTravelRate,
                  0
                ) / organization.workers.length
              ).toFixed(2)
            : 0,
      }
    : null;

  if (error) {
    return (
      <div className="p-6">
        <div className="text-center py-12">
          <XCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Failed to load organization
          </h3>
          <p className="text-gray-600 mb-4">
            There was an error loading the organization details. Please try
            again.
          </p>
          <Button onClick={() => refetch()}>Try Again</Button>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="p-6 space-y-6">
        <div className="flex items-center gap-4">
          <Skeleton className="w-8 h-8" />
          <Skeleton className="h-8 w-64" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-32" />
          ))}
        </div>
        <Skeleton className="h-96" />
      </div>
    );
  }

  if (!organization) {
    return (
      <div className="p-6">
        <div className="text-center py-12">
          <Building2 className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Organization not found
          </h3>
          <p className="text-gray-600 mb-4">
            The organization you're looking for doesn't exist or has been
            removed.
          </p>
          <Button onClick={() => navigate(-1)}>Go Back</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate(-1)}
          className="p-2"
        >
          <ArrowLeft className="w-4 h-4" />
        </Button>
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#1e3b93] to-blue-600 flex items-center justify-center">
              <Building className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                {organization.name}
              </h1>
              <p className="text-gray-600">{organization.description}</p>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
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
              <DropdownMenuItem>
                <Settings className="w-4 h-4 mr-2" />
                Settings
              </DropdownMenuItem>
              <DropdownMenuItem>
                <UserPlus className="w-4 h-4 mr-2" />
                Invite Workers
              </DropdownMenuItem>
              <DropdownMenuItem className="text-red-600">
                <Trash2 className="w-4 h-4 mr-2" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Organization Info Bar */}
      <Card className="border-0 shadow-lg">
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex items-center gap-3">
              <CalendarIcon className="w-5 h-5 text-gray-500" />
              <div>
                <p className="text-sm text-gray-500">Created</p>
                <p className="font-medium">
                  {format(parseISO(organization.createdAt), "MMMM dd, yyyy")}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Activity className="w-5 h-5 text-gray-500" />
              <div>
                <p className="text-sm text-gray-500">Last Updated</p>
                <p className="font-medium">
                  {format(parseISO(organization.updatedAt), "MMMM dd, yyyy")}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <FileText className="w-5 h-5 text-gray-500" />
              <div>
                <p className="text-sm text-gray-500">Organization ID</p>
                <p className="font-medium font-mono text-xs">
                  {organization._id}
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="relative overflow-hidden border-0 shadow-lg">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-blue-600/10" />
          <CardContent className="p-6 relative">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-sm font-medium text-blue-600">
                  Active Workers
                </p>
                <p className="text-3xl font-bold text-gray-900">
                  {stats?.totalWorkers}
                </p>
                <p className="text-xs text-gray-500">Employed</p>
              </div>
              <div className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden border-0 shadow-lg">
          <div className="absolute inset-0 bg-gradient-to-br from-orange-500/5 to-orange-600/10" />
          <CardContent className="p-6 relative">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-sm font-medium text-orange-600">
                  Pending Invites
                </p>
                <p className="text-3xl font-bold text-gray-900">
                  {stats?.pendingInvites}
                </p>
                <p className="text-xs text-gray-500">Awaiting Response</p>
              </div>
              <div className="w-12 h-12 rounded-lg bg-orange-100 flex items-center justify-center">
                <Clock className="w-6 h-6 text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden border-0 shadow-lg">
          <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 to-green-600/10" />
          <CardContent className="p-6 relative">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-sm font-medium text-green-600">
                  Avg Base Rate
                </p>
                <p className="text-3xl font-bold text-gray-900">
                  ${stats?.averageBaseRate}
                </p>
                <p className="text-xs text-gray-500">Per Hour</p>
              </div>
              <div className="w-12 h-12 rounded-lg bg-green-100 flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden border-0 shadow-lg">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-purple-600/10" />
          <CardContent className="p-6 relative">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-sm font-medium text-purple-600">
                  Travel Rate
                </p>
                <p className="text-3xl font-bold text-gray-900">
                  ${stats?.averageDistanceRate}
                </p>
                <p className="text-xs text-gray-500">Per Mile</p>
              </div>
              <div className="w-12 h-12 rounded-lg bg-purple-100 flex items-center justify-center">
                <MapPin className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Active Workers Section */}
      <Card className="border-0 shadow-lg">
        <Collapsible
          open={expandedSections.workers}
          onOpenChange={() => toggleSection("workers")}
        >
          <CollapsibleTrigger asChild>
            <CardHeader className="cursor-pointer hover:bg-gray-50 transition-colors">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Users className="w-5 h-5 text-blue-600" />
                  <CardTitle className="text-xl">
                    Active Workers ({organization.workers.length})
                  </CardTitle>
                </div>
                {expandedSections.workers ? (
                  <ChevronUp className="w-5 h-5" />
                ) : (
                  <ChevronDown className="w-5 h-5" />
                )}
              </div>
            </CardHeader>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <CardContent className="space-y-6">
              {organization.workers.length === 0 ? (
                <div className="text-center py-12">
                  <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">No active workers yet</p>
                  <Button className="mt-4 bg-[#1e3b93] hover:bg-[#1e3b93]/90">
                    <UserPlus className="w-4 h-4 mr-2" />
                    Invite Workers
                  </Button>
                </div>
              ) : (
                organization.workers.map((worker) => (
                  <Card key={worker._id} className="border border-gray-200">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-4">
                          <Avatar className="w-16 h-16">
                            <AvatarImage
                              src={getWorkerProfileImage(worker.workerId)}
                            />
                            <AvatarFallback className="text-lg">
                              {getWorkerInitials(worker.workerId)}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <h3 className="text-lg font-semibold text-gray-900">
                              {getWorkerDisplayName(worker.workerId)}
                            </h3>
                            <div className="flex items-center gap-4 text-sm text-gray-600 mt-1">
                              {typeof worker.workerId === "string" ? (
                                <span className="flex items-center gap-1">
                                  <User className="w-4 h-4" />
                                  Worker ID: {worker.workerId}
                                </span>
                              ) : (
                                <>
                                  <span className="flex items-center gap-1">
                                    <Mail className="w-4 h-4" />
                                    {getWorkerEmail(worker.workerId)}
                                  </span>
                                  <span className="flex items-center gap-1">
                                    <Phone className="w-4 h-4" />
                                    {getWorkerPhone(worker.workerId)}
                                  </span>
                                </>
                              )}
                            </div>
                          </div>
                        </div>
                        <Badge
                          variant="outline"
                          className="bg-green-50 text-green-700 border-green-200"
                        >
                          <CheckCircle className="w-3 h-3 mr-1" />
                          Active
                        </Badge>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                        <div className="bg-blue-50 p-4 rounded-lg">
                          <p className="text-sm font-medium text-blue-700">
                            Base Rate
                          </p>
                          <p className="text-2xl font-bold text-blue-900">
                            ${worker.serviceAgreement.baseHourlyRate}
                          </p>
                          <p className="text-xs text-blue-600">per hour</p>
                        </div>
                        <div className="bg-purple-50 p-4 rounded-lg">
                          <p className="text-sm font-medium text-purple-700">
                            Travel Rate
                          </p>
                          <p className="text-2xl font-bold text-purple-900">
                            ${worker.serviceAgreement.distanceTravelRate}
                          </p>
                          <p className="text-xs text-purple-600">per mile</p>
                        </div>
                        <div className="bg-gray-50 p-4 rounded-lg">
                          <p className="text-sm font-medium text-gray-700">
                            Joined
                          </p>
                          <p className="text-2xl font-bold text-gray-900">
                            {format(parseISO(worker.joinedDate), "MMM dd")}
                          </p>
                          <p className="text-xs text-gray-600">
                            {format(parseISO(worker.joinedDate), "yyyy")}
                          </p>
                        </div>
                      </div>

                      {/* Shift Rates */}
                      <div>
                        <h4 className="font-medium text-gray-900 mb-3">
                          Shift Rates
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                          {worker.serviceAgreement.shiftRates.map((rate) => (
                            <div
                              key={rate._id}
                              className="bg-gray-50 p-3 rounded-lg border"
                            >
                              <div className="flex items-center justify-between">
                                <span className="text-sm font-medium text-gray-700">
                                  {getRateBandName(rate.rateTimeBandId)}
                                </span>
                                <span className="text-sm font-bold text-gray-900">
                                  ${rate.hourlyRate}/hr
                                </span>
                              </div>
                              {getRateBandDetails(rate.rateTimeBandId) ? (
                                <div className="text-xs text-gray-500 mt-1">
                                  {getRateBandDetails(rate.rateTimeBandId)
                                    ?.startTime &&
                                    getRateBandDetails(rate.rateTimeBandId)
                                      ?.endTime && (
                                      <span>
                                        {formatTime(
                                          getRateBandDetails(
                                            rate.rateTimeBandId
                                          )?.startTime
                                        )}{" "}
                                        -
                                        {formatTime(
                                          getRateBandDetails(
                                            rate.rateTimeBandId
                                          )?.endTime
                                        )}
                                      </span>
                                    )}
                                </div>
                              ) : (
                                <div className="text-xs text-gray-500 mt-1">
                                  ID: {String(rate.rateTimeBandId).slice(-8)}
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Service Agreement Info */}
                      <div className="mt-4 pt-4 border-t">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Shield className="w-4 h-4 text-green-500" />
                            <span className="text-sm text-gray-600">
                              Service Agreement
                            </span>
                          </div>
                          <div className="flex items-center gap-4 text-xs text-gray-500">
                            <span>
                              Start:{" "}
                              {format(
                                parseISO(worker.serviceAgreement.startDate),
                                "MMM dd, yyyy"
                              )}
                            </span>
                            <Badge
                              variant={
                                worker.serviceAgreement.termsAccepted
                                  ? "default"
                                  : "secondary"
                              }
                              className="text-xs"
                            >
                              {worker.serviceAgreement.termsAccepted
                                ? "Terms Accepted"
                                : "Pending Acceptance"}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </CardContent>
          </CollapsibleContent>
        </Collapsible>
      </Card>

      {/* Pending Invites Section */}
      <Card className="border-0 shadow-lg">
        <Collapsible
          open={expandedSections.invites}
          onOpenChange={() => toggleSection("invites")}
        >
          <CollapsibleTrigger asChild>
            <CardHeader className="cursor-pointer hover:bg-gray-50 transition-colors">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Mail className="w-5 h-5 text-orange-600" />
                  <CardTitle className="text-xl">
                    Pending Invitations ({organization.pendingInvites.length})
                  </CardTitle>
                </div>
                {expandedSections.invites ? (
                  <ChevronUp className="w-5 h-5" />
                ) : (
                  <ChevronDown className="w-5 h-5" />
                )}
              </div>
            </CardHeader>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <CardContent className="space-y-6">
              {organization.pendingInvites.length === 0 ? (
                <div className="text-center py-12">
                  <Mail className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">No pending invitations</p>
                </div>
              ) : (
                organization.pendingInvites.map((invite) => (
                  <Card key={invite._id} className="border border-gray-200">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-4">
                          <Avatar className="w-16 h-16">
                            <AvatarImage
                              src={getWorkerProfileImage(invite.workerId)}
                            />
                            <AvatarFallback className="text-lg">
                              {getWorkerInitials(invite.workerId)}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <h3 className="text-lg font-semibold text-gray-900">
                              {getWorkerDisplayName(invite.workerId)}
                            </h3>
                            <div className="flex items-center gap-4 text-sm text-gray-600 mt-1">
                              {typeof invite.workerId === "string" ? (
                                <span className="flex items-center gap-1">
                                  <User className="w-4 h-4" />
                                  Worker ID: {invite.workerId}
                                </span>
                              ) : (
                                <>
                                  <span className="flex items-center gap-1">
                                    <Mail className="w-4 h-4" />
                                    {getWorkerEmail(invite.workerId)}
                                  </span>
                                  <span className="flex items-center gap-1">
                                    <Phone className="w-4 h-4" />
                                    {getWorkerPhone(invite.workerId)}
                                  </span>
                                </>
                              )}
                            </div>
                          </div>
                        </div>
                        <Badge
                          variant={
                            invite.status === "pending"
                              ? "default"
                              : invite.status === "declined"
                              ? "destructive"
                              : "secondary"
                          }
                          className="capitalize"
                        >
                          {invite.status === "pending" && (
                            <Clock className="w-3 h-3 mr-1" />
                          )}
                          {invite.status === "declined" && (
                            <XCircle className="w-3 h-3 mr-1" />
                          )}
                          {invite.status}
                        </Badge>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                        <div className="bg-blue-50 p-4 rounded-lg">
                          <p className="text-sm font-medium text-blue-700">
                            Proposed Base Rate
                          </p>
                          <p className="text-2xl font-bold text-blue-900">
                            ${invite.proposedRates.baseHourlyRate}
                          </p>
                          <p className="text-xs text-blue-600">per hour</p>
                        </div>
                        <div className="bg-purple-50 p-4 rounded-lg">
                          <p className="text-sm font-medium text-purple-700">
                            Travel Rate
                          </p>
                          <p className="text-2xl font-bold text-purple-900">
                            ${invite.proposedRates.distanceTravelRate}
                          </p>
                          <p className="text-xs text-purple-600">per mile</p>
                        </div>
                        <div className="bg-gray-50 p-4 rounded-lg">
                          <p className="text-sm font-medium text-gray-700">
                            Invited
                          </p>
                          <p className="text-2xl font-bold text-gray-900">
                            {format(parseISO(invite.inviteDate), "MMM dd")}
                          </p>
                          <p className="text-xs text-gray-600">
                            {format(parseISO(invite.inviteDate), "yyyy")}
                          </p>
                        </div>
                      </div>

                      {/* Proposed Shift Rates */}
                      <div className="mb-4">
                        <h4 className="font-medium text-gray-900 mb-3">
                          Proposed Shift Rates
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                          {invite.proposedRates.shiftRates.map((rate) => {
                            const rateBand = getRateBandDetails(
                              rate.rateTimeBandId
                            );
                            return (
                              <div
                                key={rate._id}
                                className="bg-gray-50 p-3 rounded-lg border"
                              >
                                <div className="flex items-center justify-between">
                                  <span className="text-sm font-medium text-gray-700">
                                    {getRateBandName(rate.rateTimeBandId)}
                                  </span>
                                  <span className="text-sm font-bold text-gray-900">
                                    ${rate.hourlyRate}/hr
                                  </span>
                                </div>
                                {rateBand ? (
                                  <>
                                    {rateBand.startTime && rateBand.endTime && (
                                      <div className="text-xs text-gray-500 mt-1">
                                        {formatTime(rateBand.startTime)} -{" "}
                                        {formatTime(rateBand.endTime)}
                                      </div>
                                    )}
                                    <div className="text-xs text-gray-500 mt-1">
                                      Code: {rateBand.code}
                                    </div>
                                  </>
                                ) : (
                                  <div className="text-xs text-gray-500 mt-1">
                                    ID: {String(rate.rateTimeBandId).slice(-8)}
                                  </div>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      </div>

                      {/* Notes and Response */}
                      <div className="space-y-3">
                        {invite.notes && (
                          <div className="bg-blue-50 p-3 rounded-lg">
                            <p className="text-sm font-medium text-blue-700 mb-1">
                              Invitation Notes
                            </p>
                            <p className="text-sm text-blue-900">
                              {invite.notes}
                            </p>
                          </div>
                        )}

                        {invite.status === "declined" && (
                          <div className="space-y-2">
                            {invite.responseDate && (
                              <div className="bg-red-50 p-3 rounded-lg">
                                <p className="text-sm font-medium text-red-700 mb-1">
                                  Declined on{" "}
                                  {format(
                                    parseISO(invite.responseDate),
                                    "MMMM dd, yyyy"
                                  )}
                                </p>
                                {invite.declineReason && (
                                  <p className="text-sm text-red-900">
                                    {invite.declineReason}
                                  </p>
                                )}
                              </div>
                            )}
                            {invite.adminNotes && (
                              <div className="bg-yellow-50 p-3 rounded-lg">
                                <p className="text-sm font-medium text-yellow-700 mb-1">
                                  Admin Notes
                                </p>
                                <p className="text-sm text-yellow-900">
                                  {invite.adminNotes}
                                </p>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </CardContent>
          </CollapsibleContent>
        </Collapsible>
      </Card>
    </div>
  );
}
