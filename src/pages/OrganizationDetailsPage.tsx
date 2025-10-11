import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { get } from "@/api/apiClient";
import { format, parseISO } from "date-fns";
import {
  ArrowLeft,
  Buildings3,
  CheckCircle,
  ClockCircle,
  CloseCircle,
  DangerCircle,
  Letter,
  List,
  UsersGroupRounded,
  UsersGroupTwoRounded,
  Widget,
} from "@solar-icons/react";
import { Button } from "@/components/ui/button";

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

const getWorkerProfileImage = (
  workerId: string | WorkerProfile
): string | undefined => {
  if (typeof workerId === "string") {
    return undefined;
  }
  return workerId.profileImage;
};

const getShiftRateName = (code: string): string => {
  const shiftNames: { [key: string]: string } = {
    MORNING: "Morning Shift",
    AFTERNOON: "Afternoon Shift",
    NIGHT: "Night Shift",
    WEEKEND: "Weekend Shift",
    HOLIDAY: "Public Holiday Shift",
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
  return (
    rateBandNames[rateTimeBandId] || `Rate Band ${rateTimeBandId.slice(-4)}`
  );
};

const getRateBandCode = (rateTimeBandId: string | RateTimeBand): string => {
  if (typeof rateTimeBandId === "object") {
    return rateTimeBandId.code;
  }
  return "";
};

// Support Worker Organization Details Page
export default function SupportWorkerOrganizationDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<"workers" | "invites">("workers");
  const [viewMode, setViewMode] = useState("grid");
  const [selectedWorker, setSelectedWorker] = useState<Worker | null>(null);
  const [showWorkerDetails, setShowWorkerDetails] = useState(false);

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

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 p-4 md:p-6">
        <div className="max-w-md mx-auto mt-20">
          <Card className="border-0 shadow-lg">
            <CardContent className="p-8 text-center">
              <DangerCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Failed to load organization
              </h3>
              <p className="text-gray-600 mb-6">
                There was an error loading the organization details.
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
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-7xl mx-auto space-y-6">
          <Skeleton className="h-12 w-64" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[...Array(3)].map((_, i) => (
              <Skeleton key={i} className="h-32" />
            ))}
          </div>
          <Skeleton className="h-96" />
        </div>
      </div>
    );
  }

  if (!organization) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="">
          <Card className="border-0 shadow-lg">
            <CardContent className="p-8 text-center">
              <Buildings3 className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Organization not found
              </h3>
              <p className="text-gray-600 mb-6">
                The organization you're looking for doesn't exist.
              </p>
              <Button onClick={() => navigate(-1)}>Go Back</Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="space-y-6">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-sm p-4 md:p-6">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate(-1)}
            className="mb-4 hover:bg-transparent text-gray-600 hover:text-gray-900 "
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Organizations
          </Button>

          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-guardian to-blue-600 flex items-center justify-center">
                <UsersGroupTwoRounded className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
                  {organization.name}
                </h1>
                <p className="text-gray-600">{organization.description}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge
                variant="outline"
                className="text-green-700 bg-green-50 border-green-200"
              >
                <CheckCircle className="w-3 h-3 mr-1" />
                {activeWorkers.length} Active Workers
              </Badge>
              {pendingInvites.length > 0 && (
                <Badge
                  variant="outline"
                  className="text-orange-700 bg-orange-50 border-orange-200"
                >
                  <ClockCircle className="w-3 h-3 mr-1" />
                  {pendingInvites.length} Pending Invites
                </Badge>
              )}
              {declinedInvites.length > 0 && (
                <Badge
                  variant="outline"
                  className="text-red-700 bg-red-50 border-red-200"
                >
                  <CloseCircle className="w-3 h-3 mr-1" />
                  {declinedInvites.length} Declined Invites
                </Badge>
              )}
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex gap-1">
          <Button
            onClick={() => setActiveTab("workers")}
            className={`py-0 px-3 shadow-sm border border-slate-100 rounded-full text-xs font-montserrat-semibold transition-colors ${
              activeTab === "workers"
                ? "bg-guardian text-white"
                : "text-gray-600 bg-slate-100 hover:bg-gray-200"
            }`}
          >
            Active Workers
          </Button>
          <Button
            onClick={() => setActiveTab("invites")}
            className={`py-0 px-3 shadow-sm border border-slate-100 rounded-full text-xs font-montserrat-semibold transition-colors ${
              activeTab === "invites"
                ? "bg-guardian text-white"
                : "text-gray-600 bg-slate-100 hover:bg-gray-200"
            }`}
          >
            Pending Invites
          </Button>
        </div>

        {/* Content */}
        {activeTab === "workers" ? (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">
                Active Workers ({activeWorkers.length})
              </h2>
              <div className="flex bg-white border border-gray-300 rounded-lg overflow-hidden shadow-sm">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`px-4 py-2 flex items-center gap-2 text-sm font-medium transition-all duration-200 ${
                    viewMode === "grid"
                      ? "bg-primary text-white"
                      : "text-gray-600 hover:bg-gray-100"
                  }`}
                >
                  <Widget size={24} />
                  Grid
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`px-4 py-2 flex items-center gap-2 text-sm font-medium transition-all duration-200 ${
                    viewMode === "list"
                      ? "bg-primary text-white"
                      : "text-gray-600 hover:bg-gray-100"
                  }`}
                >
                  <List size={24} />
                  List
                </button>
              </div>
            </div>

            {activeWorkers.length === 0 ? (
              <Card className="border-0 shadow-sm">
                <CardContent className="p-12 text-center">
                  <UsersGroupTwoRounded className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    No active workers
                  </h3>
                  <p className="text-gray-600">
                    This organization doesn't have any active workers yet.
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div
                className={
                  viewMode === "grid"
                    ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
                    : "space-y-4"
                }
              >
                {activeWorkers.map((worker) => (
                  <Card
                    key={worker._id}
                    className="border-0 shadow-sm hover:shadow-lg transition-all cursor-pointer"
                    onClick={() => {
                      setSelectedWorker(worker);
                      setShowWorkerDetails(true);
                    }}
                  >
                    <CardContent className="p-6">
                      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                        <div className="flex items-center gap-4">
                          <Avatar className="w-12 h-12">
                            {getWorkerProfileImage(worker.workerId) ? (
                              <AvatarImage
                                src={getWorkerProfileImage(worker.workerId)}
                              />
                            ) : (
                              <AvatarFallback className="bg-guardian text-white">
                                {getWorkerInitials(worker.workerId)}
                              </AvatarFallback>
                            )}
                          </Avatar>
                          <div>
                            <h3 className="font-semibold text-gray-900">
                              {getWorkerDisplayName(worker.workerId)}
                            </h3>
                            <p className="text-sm text-gray-600">
                              {getWorkerEmail(worker.workerId)}
                            </p>
                            <p className="text-xs text-gray-500">
                              Joined:{" "}
                              {format(
                                parseISO(worker.joinedDate),
                                "dd/MM/yyyy"
                              )}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-6">
                          <div className="text-right">
                            <p className="text-2xl font-bold text-guardian">
                              ${worker.serviceAgreement.baseHourlyRate}/hr
                            </p>
                            <Badge
                              variant="outline"
                              className="mt-1 text-green-700 bg-green-50 border-green-200"
                            >
                              Active
                            </Badge>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">
                Pending Invites ({pendingInvites.length})
              </h2>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setViewMode("list")}
                  className={
                    viewMode === "list" ? "bg-guardian text-white" : ""
                  }
                >
                  List
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setViewMode("grid")}
                  className={
                    viewMode === "grid" ? "bg-guardian text-white" : ""
                  }
                >
                  Grid
                </Button>
              </div>
            </div>

            {pendingInvites.length === 0 ? (
              <Card className="border-0 shadow-sm">
                <CardContent className="p-12 text-center">
                  <Letter className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    No pending invites
                  </h3>
                  <p className="text-gray-600">
                    There are no pending invitations for this organization.
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div
                className={
                  viewMode === "grid"
                    ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
                    : "space-y-4"
                }
              >
                {pendingInvites.map((invite) => (
                  <Card key={invite._id} className="border-0 shadow-sm">
                    <CardContent className="p-6">
                      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                        <div className="flex items-center gap-4">
                          <Avatar className="w-12 h-12">
                            <AvatarFallback className="bg-orange-100 text-orange-700">
                              {getWorkerInitials(invite.workerId)}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <h3 className="font-semibold text-gray-900">
                              {getWorkerDisplayName(invite.workerId)}
                            </h3>
                            <p className="text-sm text-gray-600">
                              {getWorkerEmail(invite.workerId)}
                            </p>
                            <p className="text-xs text-gray-500">
                              Invited:{" "}
                              {format(
                                parseISO(invite.inviteDate),
                                "dd/MM/yyyy"
                              )}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-6">
                          <div className="text-right">
                            <p className="text-2xl font-bold text-orange-600">
                              ${invite.proposedRates.baseHourlyRate}/hr
                            </p>
                            <Badge
                              variant="outline"
                              className="mt-1 text-orange-700 bg-orange-50 border-orange-200"
                            >
                              Pending
                            </Badge>
                          </div>
                        </div>
                      </div>

                      {invite.notes && (
                        <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                          <p className="text-sm text-gray-600">
                            <span className="font-medium">Notes:</span>{" "}
                            {invite.notes}
                          </p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Worker Details Modal */}
      {showWorkerDetails && selectedWorker && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-900">
                  Worker Details
                </h2>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowWorkerDetails(false)}
                >
                  <CloseCircle className="w-4 h-4" />
                </Button>
              </div>
            </div>

            <div className="p-6 space-y-6">
              {/* Worker Info */}
              <div className="flex items-center gap-4">
                <Avatar className="w-20 h-20">
                  {getWorkerProfileImage(selectedWorker.workerId) ? (
                    <AvatarImage
                      src={getWorkerProfileImage(selectedWorker.workerId)}
                    />
                  ) : (
                    <AvatarFallback className="bg-guardian text-white text-2xl">
                      {getWorkerInitials(selectedWorker.workerId)}
                    </AvatarFallback>
                  )}
                </Avatar>
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-gray-900">
                    {getWorkerDisplayName(selectedWorker.workerId)}
                  </h3>
                  <p className="text-gray-600">
                    {getWorkerEmail(selectedWorker.workerId)}
                  </p>
                  <p className="text-gray-600">
                    {getWorkerPhone(selectedWorker.workerId)}
                  </p>
                </div>
              </div>

              {/* Service Agreement */}
              <div>
                <h4 className="font-semibold text-gray-900 mb-3">
                  Service Agreement
                </h4>
                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-3 bg-gray-50 rounded-lg">
                      <p className="text-sm text-gray-600">Base Hourly Rate:</p>
                      <p className="text-xl font-bold text-guardian">
                        ${selectedWorker.serviceAgreement.baseHourlyRate}/hr
                      </p>
                    </div>
                    <div className="p-3 bg-gray-50 rounded-lg">
                      <p className="text-sm text-gray-600">
                        Distance Travel Rate:
                      </p>
                      <p className="text-xl font-bold text-purple-600">
                        ${selectedWorker.serviceAgreement.distanceTravelRate}/km
                      </p>
                    </div>
                  </div>

                  <div className="p-3 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-600">Start Date:</p>
                    <p className="font-medium">
                      {format(
                        parseISO(selectedWorker.serviceAgreement.startDate),
                        "dd/MM/yyyy"
                      )}
                    </p>
                  </div>

                  <div className="p-3 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-600">Terms Accepted:</p>
                    <Badge
                      variant={
                        selectedWorker.serviceAgreement.termsAccepted
                          ? "default"
                          : "secondary"
                      }
                    >
                      {selectedWorker.serviceAgreement.termsAccepted
                        ? "Yes"
                        : "No"}
                    </Badge>
                  </div>

                  <div className="p-3 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-600">Joined Date:</p>
                    <p className="font-medium">
                      {format(
                        parseISO(selectedWorker.joinedDate),
                        "dd/MM/yyyy"
                      )}
                    </p>
                  </div>

                  <div className="p-3 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-600">Status:</p>
                    <Badge className="bg-green-100 text-green-700">
                      Active
                    </Badge>
                  </div>
                </div>
              </div>

              {/* Proposed Shift Rates */}
              <div>
                <h4 className="font-semibold text-gray-900 mb-3">
                  Proposed Shift Rates
                </h4>
                <div className="space-y-2">
                  {selectedWorker.serviceAgreement.shiftRates.map((rate) => (
                    <div
                      key={rate._id}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                    >
                      <div>
                        <p className="font-medium text-gray-900">
                          {getRateBandName(rate.rateTimeBandId)}
                        </p>
                        {getRateBandCode(rate.rateTimeBandId) && (
                          <p className="text-xs text-gray-500">
                            Code: {getRateBandCode(rate.rateTimeBandId)}
                          </p>
                        )}
                      </div>
                      <p className="text-lg font-bold text-guardian">
                        ${rate.hourlyRate}/hr
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Remove Worker Button */}
              <Button className="w-full bg-red-600 hover:bg-red-700 text-white">
                Remove Worker
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
