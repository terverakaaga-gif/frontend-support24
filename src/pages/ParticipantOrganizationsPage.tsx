import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import {
  Building2,
  Users,
  Search,
  Filter,
  Calendar,
  DollarSign,
  Mail,
  User,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Eye,
  MoreVertical,
  Building,
  UserCheck,
  TrendingUp,
  Activity,
  Plus,
  Settings,
  UserPlus,
  Edit,
  Trash2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { get } from "@/api/apiClient";
import { format, parseISO } from "date-fns";

// Types based on actual API response
interface ShiftRate {
  rateTimeBandId: string;
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

interface Worker {
  serviceAgreement: ServiceAgreement;
  workerId: string | any;
  joinedDate: string;
  _id: string;
}

interface PendingInvite {
  inviteId: string;
  workerId: string | any;
  inviteDate: string;
  proposedHourlyRate: number;
  _id: string;
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

interface OrganizationsResponse {
  organizations: Organization[];
}

// API service function for participant organizations
const participantOrganizationService = {
  getOrganizations: async (): Promise<Organization[]> => {
    const response = await get<OrganizationsResponse>("/organizations");
    return response.organizations;
  },
};

// Helper function to safely get worker ID as string
const getWorkerIdString = (workerId: string | any): string => {
  if (typeof workerId === "string") {
    return workerId;
  }
  if (workerId && typeof workerId === "object" && workerId._id) {
    return workerId._id;
  }
  if (workerId && typeof workerId === "object" && workerId.id) {
    return workerId.id;
  }
  return String(workerId || "Unknown");
};

// Helper function to safely get last characters of worker ID
const getWorkerIdDisplay = (
  workerId: string | any,
  length: number = 8
): string => {
  const idString = getWorkerIdString(workerId);
  return idString.length >= length ? idString.slice(-length) : idString;
};

// Helper function to get worker initials
const getWorkerInitials = (workerId: string | any): string => {
  const idString = getWorkerIdString(workerId);
  return idString.length >= 2
    ? idString.slice(-2).toUpperCase()
    : idString.toUpperCase();
};

export default function ParticipantOrganizationsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const navigate = useNavigate();

  // Fetch organizations data
  const {
    data: organizations = [],
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["participant-organizations"],
    queryFn: () => participantOrganizationService.getOrganizations(),
  });

  // Filter organizations based on search
  const filteredOrganizations = organizations.filter((org) => {
    const matchesSearch =
      searchTerm === "" ||
      org.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      org.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      org.workers.some((worker) =>
        getWorkerIdString(worker.workerId)
          .toLowerCase()
          .includes(searchTerm.toLowerCase())
      ) ||
      org.pendingInvites.some((invite) =>
        getWorkerIdString(invite.workerId)
          .toLowerCase()
          .includes(searchTerm.toLowerCase())
      );

    return matchesSearch;
  });

  // Calculate stats
  const stats = {
    totalOrganizations: organizations.length,
    totalWorkers: organizations.reduce(
      (sum, org) => sum + org.workers.length,
      0
    ),
    totalPendingInvites: organizations.reduce(
      (sum, org) => sum + org.pendingInvites.length,
      0
    ),
    averageBaseRate:
      organizations.length > 0
        ? Math.round(
            organizations.reduce(
              (sum, org) =>
                sum +
                org.workers.reduce(
                  (workerSum, worker) =>
                    workerSum + worker.serviceAgreement.baseHourlyRate,
                  0
                ),
              0
            ) /
              organizations.reduce((sum, org) => sum + org.workers.length, 0) ||
              0
          )
        : 0,
    activeConnections: organizations.filter((org) => org.workers.length > 0)
      .length,
  };

  if (error) {
    return (
      <div className="p-6">
        <div className="text-center py-12">
          <XCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Failed to load organizations
          </h3>
          <p className="text-gray-600 mb-4">
            There was an error loading your organizations. Please try again.
          </p>
          <Button onClick={() => refetch()}>Try Again</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-8">
      {/* Enhanced Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="space-y-1">
          <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-[#1e3b93] to-blue-600 bg-clip-text text-transparent">
            My Organizations
          </h1>
          <p className="text-lg text-gray-600">
            Manage your organizations and support worker connections
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button
            className="bg-[#1e3b93] hover:bg-[#1e3b93]/90"
            onClick={() => {
              /* TODO: Add create organization logic */
            }}
          >
            <Plus className="w-4 h-4 mr-2" />
            Create Organization
          </Button>
          <Badge variant="outline" className="px-4 py-2 text-sm font-medium">
            <Activity className="w-4 h-4 mr-2" />
            {filteredOrganizations.length} organizations
          </Badge>
        </div>
      </div>

      {/* Enhanced Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* My Organizations */}
        <Card className="relative overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300 group">
          <div className="absolute inset-0 bg-gradient-to-br from-[#1e3b93]/5 to-blue-600/10" />
          <CardContent className="p-6 relative">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-sm font-medium text-[#1e3b93]">
                  My Organizations
                </p>
                <p className="text-3xl font-bold text-gray-900 group-hover:text-[#1e3b93] transition-colors">
                  {stats.totalOrganizations}
                </p>
                <p className="text-xs text-gray-500">Created & Managed</p>
              </div>
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-[#1e3b93] to-blue-600 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <Building2 className="w-7 h-7 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Support Workers */}
        <Card className="relative overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300 group">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-purple-600/10" />
          <CardContent className="p-6 relative">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-sm font-medium text-purple-600">
                  Support Workers
                </p>
                <p className="text-3xl font-bold text-gray-900 group-hover:text-purple-600 transition-colors">
                  {stats.totalWorkers}
                </p>
                <p className="text-xs text-gray-500">Active Team</p>
              </div>
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <Users className="w-7 h-7 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Average Pay Rate */}
        <Card className="relative overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300 group">
          <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 to-green-600/10" />
          <CardContent className="p-6 relative">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-sm font-medium text-green-600">
                  Average Pay Rate
                </p>
                <p className="text-3xl font-bold text-gray-900 group-hover:text-green-600 transition-colors">
                  ${stats.averageBaseRate}
                </p>
                <p className="text-xs text-gray-500">Per hour</p>
              </div>
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <DollarSign className="w-7 h-7 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Pending Invitations */}
        <Card className="relative overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300 group">
          <div className="absolute inset-0 bg-gradient-to-br from-orange-500/5 to-orange-600/10" />
          <CardContent className="p-6 relative">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-sm font-medium text-orange-600">
                  Pending Invitations
                </p>
                <p className="text-3xl font-bold text-gray-900 group-hover:text-orange-600 transition-colors">
                  {stats.totalPendingInvites}
                </p>
                <p className="text-xs text-gray-500">Awaiting Response</p>
              </div>
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <Mail className="w-7 h-7 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Enhanced Filters and Search */}
      <Card className="border-0 shadow-lg">
        <CardContent className="p-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-center">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search organizations, workers, or invitations..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 h-11"
              />
            </div>

            {/* Status Filter */}
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full md:w-48 h-11">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Organizations</SelectItem>
                <SelectItem value="active">Active Workers</SelectItem>
                <SelectItem value="pending">Pending Invites</SelectItem>
                <SelectItem value="empty">No Workers</SelectItem>
              </SelectContent>
            </Select>

            {/* Invite Workers Button */}
            <Button
              variant="outline"
              className="border-[#1e3b93]/20 text-[#1e3b93] hover:bg-[#1e3b93]/10"
              onClick={() => {
                /* TODO: Add invite workers logic */
              }}
            >
              <UserPlus className="w-4 h-4 mr-2" />
              Invite Workers
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Organizations Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="border-0 shadow-lg">
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <Skeleton className="w-12 h-12 rounded-full" />
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-48" />
                      <Skeleton className="h-3 w-32" />
                    </div>
                  </div>
                  <Skeleton className="h-20 w-full" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : filteredOrganizations.length === 0 ? (
        <Card className="border-0 shadow-lg">
          <CardContent className="p-12 text-center">
            <Building2 className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No organizations found
            </h3>
            <p className="text-gray-600 max-w-md mx-auto mb-6">
              {searchTerm
                ? "Try adjusting your search to see more results."
                : "You don't have any organizations yet. Create your first organization to start managing support workers."}
            </p>
            {!searchTerm && (
              <Button
                className="bg-[#1e3b93] hover:bg-[#1e3b93]/90"
                onClick={() => {
                  /* TODO: Add create organization logic */
                }}
              >
                <Plus className="w-4 h-4 mr-2" />
                Create Your First Organization
              </Button>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredOrganizations.map((organization) => (
            <Card
              key={organization._id}
              className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 group"
            >
              <CardHeader className="pb-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#1e3b93] to-blue-600 flex items-center justify-center">
                      <Building className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <CardTitle className="text-lg font-semibold text-gray-900 group-hover:text-[#1e3b93] transition-colors">
                        {organization.name}
                      </CardTitle>
                      <p className="text-sm text-gray-600">
                        {organization.description}
                      </p>
                    </div>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <MoreVertical className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem
                        onClick={() =>
                          navigate(
                            `/participant/organizations/${organization._id}`
                          )
                        }
                      >
                        <Eye className="w-4 h-4 mr-2" />
                        View Details
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Edit className="w-4 h-4 mr-2" />
                        Edit Organization
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Settings className="w-4 h-4 mr-2" />
                        Organization Settings
                      </DropdownMenuItem>
                      <DropdownMenuItem className="text-red-600">
                        <Trash2 className="w-4 h-4 mr-2" />
                        Delete Organization
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Organization Stats */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4 text-purple-500" />
                      <span className="text-sm font-medium text-purple-700">
                        Workers
                      </span>
                    </div>
                    <span className="text-sm font-bold text-purple-900">
                      {organization.workers.length}
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-orange-50 rounded-lg">
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-orange-500" />
                      <span className="text-sm font-medium text-orange-700">
                        Pending
                      </span>
                    </div>
                    <span className="text-sm font-bold text-orange-900">
                      {organization.pendingInvites.length}
                    </span>
                  </div>
                </div>

                {/* Created Date */}
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-gray-500" />
                    <span className="text-sm font-medium text-gray-700">
                      Created
                    </span>
                  </div>
                  <span className="text-sm text-gray-600">
                    {format(parseISO(organization.createdAt), "MMM dd, yyyy")}
                  </span>
                </div>

                {/* Active Workers Section */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="text-sm font-semibold text-gray-900">
                      Active Workers ({organization.workers.length})
                    </h4>
                    {organization.workers.length > 0 && (
                      <Badge variant="outline" className="text-xs">
                        <TrendingUp className="w-3 h-3 mr-1" />
                        Active
                      </Badge>
                    )}
                  </div>

                  {organization.workers.length === 0 ? (
                    <div className="text-center py-6 bg-gray-50 rounded-lg">
                      <Users className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                      <p className="text-sm text-gray-500">No workers yet</p>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="mt-2 text-[#1e3b93] hover:text-[#1e3b93]/80"
                        onClick={() => {
                          /* TODO: Add invite worker logic */
                        }}
                      >
                        <UserPlus className="w-3 h-3 mr-1" />
                        Invite Workers
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-3 max-h-48 overflow-y-auto">
                      {organization.workers.slice(0, 3).map((worker) => (
                        <div
                          key={worker._id}
                          className="flex items-center justify-between p-3 bg-white border border-gray-200 rounded-lg hover:border-[#1e3b93]/20 transition-colors"
                        >
                          <div className="flex items-center gap-3">
                            <Avatar className="w-8 h-8">
                              <AvatarFallback className="text-xs">
                                {getWorkerInitials(worker.workerId)}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="text-sm font-medium text-gray-900">
                                Worker {getWorkerIdDisplay(worker.workerId)}
                              </p>
                              <div className="flex items-center gap-3 text-xs text-gray-500">
                                <span className="flex items-center gap-1">
                                  <Calendar className="w-3 h-3" />
                                  {format(
                                    parseISO(worker.joinedDate),
                                    "MMM dd, yyyy"
                                  )}
                                </span>
                                <span className="flex items-center gap-1">
                                  <DollarSign className="w-3 h-3" />$
                                  {worker.serviceAgreement.baseHourlyRate}/hr
                                </span>
                              </div>
                            </div>
                          </div>
                          <Badge
                            variant="outline"
                            className="text-xs bg-green-50 text-green-700 border-green-200"
                          >
                            <CheckCircle className="w-3 h-3 mr-1" />
                            Active
                          </Badge>
                        </div>
                      ))}
                      {organization.workers.length > 3 && (
                        <div className="text-center py-2">
                          <Button variant="ghost" size="sm" className="text-xs">
                            View {organization.workers.length - 3} more workers
                          </Button>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Pending Invites Section */}
                {organization.pendingInvites.length > 0 && (
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="text-sm font-semibold text-gray-900">
                        Pending Invitations (
                        {organization.pendingInvites.length})
                      </h4>
                      <Badge
                        variant="outline"
                        className="text-xs bg-orange-50 text-orange-700 border-orange-200"
                      >
                        <Clock className="w-3 h-3 mr-1" />
                        Pending
                      </Badge>
                    </div>
                    <div className="space-y-2 max-h-32 overflow-y-auto">
                      {organization.pendingInvites.map((invite) => (
                        <div
                          key={invite._id}
                          className="flex items-center justify-between p-2 bg-orange-50 border border-orange-200 rounded-lg"
                        >
                          <div className="flex items-center gap-2">
                            <div className="w-6 h-6 rounded-full bg-orange-100 flex items-center justify-center">
                              <Mail className="w-3 h-3 text-orange-600" />
                            </div>
                            <div>
                              <p className="text-xs font-medium text-gray-900">
                                Worker {getWorkerIdDisplay(invite.workerId)}
                              </p>
                              <p className="text-xs text-gray-500">
                                ${invite.proposedHourlyRate}/hr
                              </p>
                            </div>
                          </div>
                          <Badge variant="secondary" className="text-xs">
                            Pending
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex gap-2 pt-4 border-t">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1 border-[#1e3b93]/20 text-[#1e3b93] hover:bg-[#1e3b93]/10"
                    onClick={() =>
                      navigate(`/participant/organizations/${organization._id}`)
                    }
                  >
                    <Settings className="w-4 h-4 mr-2" />
                    Manage
                  </Button>
                  <Button
                    size="sm"
                    className="flex-1 bg-[#1e3b93] hover:bg-[#1e3b93]/90"
                  >
                    <UserPlus className="w-4 h-4 mr-2" />
                    Invite Workers
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
