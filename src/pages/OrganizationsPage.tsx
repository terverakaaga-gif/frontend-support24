import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import {
  Building2,
  Users,
  Search,
  Calendar,
  DollarSign,
  Mail,
  Clock,
  CheckCircle,
  Eye,
  MoreVertical,
  Building,
  Activity,
  Plus,
  Settings,
  UserPlus,
  Edit,
  Trash2,
  ChevronLeft,
  Phone,
  MapPin,
  Star,
  Shield,
  FileText,
  TrendingUp,
  AlertCircle,
  X,
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

import { format, parseISO } from "date-fns";
import {
  organizationService,
  Organization,
  PendingInvite,
} from "@/api/services/organizationService";
import { pageTitles } from "@/constants/pageTitles";
import { useAuth } from "@/contexts/AuthContext";
import GeneralHeader from "@/components/GeneralHeader";
import Loader from "@/components/Loader";

// Helper functions
const getWorkerFullName = (worker: any): string => {
  if (!worker) return "Unknown Worker";

  const workerId = worker.workerId || worker;
  if (typeof workerId === "string") return `Worker ID: ${workerId}`;

  if (workerId.firstName && workerId.lastName) {
    return `${workerId.firstName} ${workerId.lastName}`;
  }
  return "Unknown Worker";
};

const getWorkerInitials = (worker: any): string => {
  if (!worker) return "??";

  const workerId = worker.workerId || worker;
  if (workerId.firstName && workerId.lastName) {
    return `${workerId.firstName.charAt(0)}${workerId.lastName.charAt(
      0
    )}`.toUpperCase();
  }
  return "??";
};

const getWorkerEmail = (worker: any): string => {
  if (!worker) return "No email";
  const workerId = worker.workerId || worker;
  return workerId.email || "No email";
};

const getWorkerPhone = (worker: any): string => {
  if (!worker) return "No phone";
  const workerId = worker.workerId || worker;
  return workerId.phone || "No phone";
};

// Support Worker Organizations Page
export default function SupportWorkerOrganizationsPage() {
  const { user, logout } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const navigate = useNavigate();

  const {
    data: organizationsData,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["support-worker-organizations"],
    queryFn: async () => {
      const response = await organizationService.getOrganizations();
      return response;
    },
  });

  const organizations: Organization[] = organizationsData?.organizations || [];

  const filteredOrganizations = organizations.filter((org) => {
    const matchesSearch =
      searchTerm === "" ||
      org.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      org.description.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === "all" ||
      (statusFilter === "active" && org.workers.length > 0) ||
      (statusFilter === "pending" &&
        org.pendingInvites.filter((inv) => inv.status === "pending").length >
          0);

    return matchesSearch && matchesStatus;
  });

  const stats = {
    totalOrganizations: organizations.length,
    activeConnections: organizations.filter((org) => org.workers.length > 0)
      .length,
    totalPendingInvites: organizations.reduce(
      (sum, org) =>
        sum +
        org.pendingInvites.filter((inv) => inv.status === "pending").length,
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
                    workerSum + (worker.serviceAgreement?.baseHourlyRate || 0),
                  0
                ),
              0
            ) /
              (organizations.reduce(
                (sum, org) => sum + org.workers.length,
                0
              ) || 1)
          )
        : 0,
  };

  if (error) {
    return (
      <div className="min-h-screen bg-gray-100 p-4 md:p-6">
        <div className="max-w-md mx-auto mt-20">
          <Card className="border-0 shadow-lg">
            <CardContent className="p-8 text-center">
              <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
              <h3 className="text-xl font-montserrat-semibold text-gray-900 mb-2">
                Failed to load organizations
              </h3>
              <p className="text-gray-600 mb-6">
                There was an error loading your organizations. Please try again.
              </p>
              <Button
                onClick={() => refetch()}
                className="bg-guardian hover:bg-guardian/90"
              >
                Try Again
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return <Loader />;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="p-10 space-y-6">
        {/* Header */}
        <GeneralHeader
          title={
            pageTitles.supportWorker["/support-worker/organizations"].title
          }
          subtitle={
            pageTitles.supportWorker["/support-worker/organizations"].subtitle
          }
          user={user}
          onViewProfile={() => {
            navigate(
              Object.keys(pageTitles.supportWorker).find(
                (key) =>
                  key !== "/support-worker/organizations" &&
                  pageTitles.supportWorker[key] ===
                    pageTitles.supportWorker["/support-worker/profile"]
              )
            );
          }}
          onLogout={logout}
        />

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card className="border-0 shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="p-4 md:p-6">
              <div className="flex items-center justify-between mb-2">
                <Building2 className="w-8 h-8 text-guardian" />
                <span className="text-xs text-gray-1000">Total</span>
              </div>
              <p className="text-2xl font-montserrat-bold text-gray-900">
                {stats.totalOrganizations}
              </p>
              <p className="text-sm text-gray-600">Organizations</p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="p-4 md:p-6">
              <div className="flex items-center justify-between mb-2">
                <CheckCircle className="w-8 h-8 text-green-600" />
                <span className="text-xs text-gray-1000">Active</span>
              </div>
              <p className="text-2xl font-montserrat-bold text-gray-900">
                {stats.activeConnections}
              </p>
              <p className="text-sm text-gray-600">Connections</p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="p-4 md:p-6">
              <div className="flex items-center justify-between mb-2">
                <Clock className="w-8 h-8 text-orange-600" />
                <span className="text-xs text-gray-1000">Pending</span>
              </div>
              <p className="text-2xl font-montserrat-bold text-gray-900">
                {stats.totalPendingInvites}
              </p>
              <p className="text-sm text-gray-600">Invites</p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="p-4 md:p-6">
              <div className="flex items-center justify-between mb-2">
                <DollarSign className="w-8 h-8 text-primary" />
                <span className="text-xs text-gray-1000">Average</span>
              </div>
              <p className="text-2xl font-montserrat-bold text-gray-900">
                ${stats.averageBaseRate}
              </p>
              <p className="text-sm text-gray-600">Per Hour</p>
            </CardContent>
          </Card>
        </div>

        {/* Search and Filters */}
        <Card className="border-0 shadow-sm">
          <CardContent className="p-4 md:p-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  placeholder="Search organizations..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full md:w-48">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Organizations</SelectItem>
                  <SelectItem value="active">Active Only</SelectItem>
                  <SelectItem value="pending">With Pending Invites</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Organizations List */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[...Array(4)].map((_, i) => (
              <Card key={i} className="border-0 shadow-sm">
                <CardContent className="p-6">
                  <Skeleton className="h-12 w-12 rounded-full mb-4" />
                  <Skeleton className="h-4 w-3/4 mb-2" />
                  <Skeleton className="h-3 w-1/2" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : filteredOrganizations.length === 0 ? (
          <Card className="border-0 shadow-sm">
            <CardContent className="p-12 text-center">
              <Building2 className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-montserrat-semibold text-gray-900 mb-2">
                No organizations found
              </h3>
              <p className="text-gray-600">
                {searchTerm
                  ? "Try adjusting your search criteria"
                  : "You don't have any organization connections yet"}
              </p>
            </CardContent>
          </Card>
        ) : (
          <div
            className={
              viewMode === "grid"
                ? "grid grid-cols-1 md:grid-cols-2 gap-4"
                : "space-y-4"
            }
          >
            {filteredOrganizations.map((org) => (
              <OrganizationCard
                key={org._id}
                organization={org}
                viewMode={viewMode}
                onViewDetails={() =>
                  navigate(`/support-worker/organizations/${org._id}`)
                }
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// Organization Card Component
function OrganizationCard({
  organization,
  viewMode,
  onViewDetails,
}: {
  organization: any;
  viewMode: "grid" | "list";
  onViewDetails: () => void;
}) {
  const activeWorkers = organization.workers || [];
  const pendingInvites = (organization.pendingInvites || []).filter(
    (inv: any) => inv.status === "pending"
  );

  return (
    <Card className="border-0 shadow-sm hover:shadow-lg transition-all duration-300">
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-guardian to-primary flex items-center justify-center flex-shrink-0">
              <Building className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="font-montserrat-semibold text-gray-900">
                {organization.name}
              </h3>
              <p className="text-sm text-gray-600">
                {organization.description}
              </p>
            </div>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm">
                <MoreVertical className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={onViewDetails}>
                <Eye className="w-4 h-4 mr-2" />
                View Details
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Mail className="w-4 h-4 mr-2" />
                Contact Organization
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3 mb-4">
          <div className="text-center p-2 bg-gray-100 rounded-lg">
            <p className="text-lg font-montserrat-semibold text-gray-900">
              {activeWorkers.length}
            </p>
            <p className="text-xs text-gray-600">Workers</p>
          </div>
          <div className="text-center p-2 bg-gray-100 rounded-lg">
            <p className="text-lg font-montserrat-semibold text-gray-900">
              {pendingInvites.length}
            </p>
            <p className="text-xs text-gray-600">Pending</p>
          </div>
          <div className="text-center p-2 bg-gray-100 rounded-lg">
            <p className="text-lg font-montserrat-semibold text-gray-900">
              $
              {activeWorkers.length > 0
                ? Math.round(
                    activeWorkers.reduce(
                      (sum: number, w: any) =>
                        sum + (w.serviceAgreement?.baseHourlyRate || 0),
                      0
                    ) / activeWorkers.length
                  )
                : 0}
            </p>
            <p className="text-xs text-gray-600">Avg Rate</p>
          </div>
        </div>

        {/* Recent Workers */}
        {activeWorkers.length > 0 && (
          <div className="mb-4">
            <p className="text-sm font-medium text-gray-700 mb-2">
              Recent Workers
            </p>
            <div className="space-y-2">
              {activeWorkers.slice(0, 2).map((worker: any) => (
                <div
                  key={worker._id}
                  className="flex items-center gap-2 p-2 bg-gray-100 rounded-lg"
                >
                  <Avatar className="w-8 h-8">
                    <AvatarFallback className="text-xs">
                      {getWorkerInitials(worker)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {getWorkerFullName(worker)}
                    </p>
                    <p className="text-xs text-gray-1000">
                      ${worker.serviceAgreement?.baseHourlyRate || 0}/hr
                    </p>
                  </div>
                  <Badge
                    variant="outline"
                    className="text-xs bg-green-50 text-green-700 border-green-200"
                  >
                    Active
                  </Badge>
                </div>
              ))}
            </div>
          </div>
        )}

        <Button
          className="w-full bg-guardian hover:bg-guardian/90"
          onClick={onViewDetails}
        >
          View Details
        </Button>
      </CardContent>
    </Card>
  );
}
