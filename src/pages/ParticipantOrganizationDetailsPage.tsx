import { useCallback, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { get } from "@/api/apiClient";
import { format, parseISO } from "date-fns";
import {
  Buildings3,
  CheckCircle,
  CloseCircle,
  DangerCircle,
  Letter,
  UsersGroupTwoRounded,
} from "@solar-icons/react";
import GeneralHeader from "@/components/GeneralHeader";
import { pageTitles } from "@/constants/pageTitles";
import { useAuth } from "@/contexts/AuthContext";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { getWorkerEmail } from "@/constants/utils";
import {
  getWorkerDisplayName,
  getWorkerInitials,
  getWorkerPhone,
  getWorkerProfileImage,
  WorkerProfile,
} from "@/lib/utils";
import { organizationService } from "@/api/services/organizationService";
import {
  useGetOrganizationDetails,
  useRemoveWorkerFromOrganization,
} from "@/hooks/useOrganizationHooks";

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

export default function ParticipantOrganizationDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<"workers" | "invites">("workers");
  const [selectedWorker, setSelectedWorker] = useState<Worker | null>(null);
  const [showWorkerDetails, setShowWorkerDetails] = useState(false);

  const {
    data: organization,
    isLoading,
    error,
    refetch,
  } = useGetOrganizationDetails(id!);

  const activeWorkers = organization?.workers || [];
  const pendingInvites =
    organization?.pendingInvites.filter((inv) => inv.status === "pending") ||
    [];

  const removeWorkerMutation = useRemoveWorkerFromOrganization();

  const handleRemoveWorker = useCallback(
    (workerId: string) => {
      removeWorkerMutation.mutate({ organizationId: id!, workerId });
    },
    [id, removeWorkerMutation]
  );

  if (error) {
    return (
      <div className="min-h-screen bg-gray-100 p-4 md:p-6">
        <div className="max-w-md mx-auto mt-20">
          <Card className="border-0 shadow-lg">
            <CardContent className="p-8 text-center">
              <DangerCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
              <h3 className="text-xl font-montserrat-semibold text-gray-900 mb-2">
                Failed to load organization
              </h3>
              <p className="text-gray-600 mb-6">
                There was an error loading the organization details.
              </p>
              <Button
                onClick={() => refetch()}
                className="bg-primary-600 hover:bg-primary-600"
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
      <div className="min-h-screen bg-gray-100 p-8">
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
      <div className="min-h-screen bg-gray-100 p-8">
        <div className="max-w-md mx-auto mt-20">
          <Card className="border-0 shadow-lg">
            <CardContent className="p-8 text-center">
              <Buildings3 className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-montserrat-semibold text-gray-900 mb-2">
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
    <div className="min-h-screen bg-gray-100">
      <div className="w-full p-4 md:p-8">
        {/* Header */}
        <GeneralHeader
          showBackButton
          title={pageTitles.participant["/participant/organizations"].title}
          subtitle={
            pageTitles.participant["/participant/organizations"].subtitle
          }
          user={user}
          onViewProfile={() => {
            navigate(
              Object.keys(pageTitles.participant).find(
                (key) =>
                  key !== "/participant/organizations" &&
                  pageTitles.participant[key] ===
                    pageTitles.participant["/participant/profile"]
              )
            );
          }}
          onLogout={logout}
        />

        {/* Tab Navigation */}
        <div className="flex gap-2 mb-4 md:mb-6">
          <button
            onClick={() => setActiveTab("workers")}
            className={`rounded-full font-montserrat-semibold px-3 py-1 text-xs transition-all ${
              activeTab === "workers"
          ? "bg-primary text-white hover:bg-primary"
          : "bg-white text-gray-600 hover:bg-gray-100 border border-gray-200"
            }`}
          >
            Active Workers
          </button>
          <button
            onClick={() => setActiveTab("invites")}
            className={`rounded-full font-montserrat-semibold px-3 py-1 text-xs transition-all ${
              activeTab === "invites"
          ? "bg-primary text-white hover:bg-primary"
          : "bg-white text-gray-600 hover:bg-gray-100 border border-gray-200"
            }`}
          >
            Pending Invites
          </button>
        </div>
        

        {/* Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
          {/* Workers/Invites List */}
          <div className="lg:col-span-2">
            <h2 className="text-sm md:text-lg font-montserrat-bold text-gray-900 mb-3 md:mb-4">
              {activeTab === "workers"
                ? `Active Workers (${activeWorkers.length})`
                : `Pending Invites (${pendingInvites.length})`}
            </h2>

            {activeTab === "workers" ? (
              activeWorkers.length === 0 ? (
                <Card className="border-0 shadow-sm">
                  <CardContent className="p-4 md:p-12 text-center">
                    <UsersGroupTwoRounded className="w-10 h-10 md:w-16 md:h-16 text-gray-300 mx-auto mb-3 md:mb-4" />
                    <h3 className="text-sm md:text-xl font-montserrat-semibold text-gray-900 mb-2">
                      No workers found
                    </h3>
                    <p className="text-xs md:text-base text-gray-600">
                      This organization doesn't have any active workers yet
                    </p>
                  </CardContent>
                </Card>
              ) : (
                <div className="space-y-2 md:space-y-3">
                  {activeWorkers.map((worker) => (
                    <Card
                      key={worker._id}
                      className="border-0 shadow-sm hover:shadow-md transition-all cursor-pointer"
                      onClick={() => {
                        setSelectedWorker(worker);
                        setShowWorkerDetails(true);
                      }}
                    >
                      <CardContent className="p-3 md:p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2 md:gap-3 flex-1 min-w-0">
                            <Avatar className="w-8 h-8 md:w-12 md:h-12 flex-shrink-0">
                              {getWorkerProfileImage(worker.workerId) ? (
                                <AvatarImage
                                  src={getWorkerProfileImage(worker.workerId)}
                                />
                              ) : (
                                <AvatarFallback className="bg-primary-100 text-primary-600 font-montserrat-semibold text-xs md:text-base">
                                  {getWorkerInitials(worker.workerId)}
                                </AvatarFallback>
                              )}
                            </Avatar>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-0.5">
                                <h3 className="font-montserrat-semibold text-gray-900 text-xs md:text-base truncate">
                                  {getWorkerDisplayName(worker.workerId)}
                                </h3>
                                <Badge className="bg-green-50 text-green-600 text-xs px-1 md:px-2 py-0 h-4 md:h-5">
                                  Active
                                </Badge>
                              </div>
                              <p className="text-xs md:text-sm text-gray-600 truncate">
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
                          <div className="text-right ml-2 md:ml-4 bg-primary/10 px-2 py-1 rounded-full">
                            <p className="text-xs md:text-md font-montserrat-bold text-primary-600">
                              ${worker.serviceAgreement.baseHourlyRate}/hr
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )
            ) : pendingInvites.length === 0 ? (
              <Card className="border-0 shadow-sm">
                <CardContent className="p-4 md:p-12 text-center">
                  <Letter className="w-10 h-10 md:w-16 md:h-16 text-gray-300 mx-auto mb-3 md:mb-4" />
                  <h3 className="text-sm md:text-xl font-montserrat-semibold text-gray-900 mb-2">
                    No pending invites
                  </h3>
                  <p className="text-xs md:text-base text-gray-600">
                    There are no pending invitations for this organization.
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-2 md:space-y-3">
                {pendingInvites.map((invite) => (
                  <Card
                    key={invite._id}
                    className="border-0 shadow-sm hover:shadow-md transition-all"
                  >
                    <CardContent className="p-3 md:p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 md:gap-3 flex-1 min-w-0">
                          <Avatar className="w-8 h-8 md:w-12 md:h-12 flex-shrink-0">
                            <AvatarFallback className="bg-orange-100 text-orange-600 font-montserrat-semibold text-xs md:text-base">
                              {getWorkerInitials(invite.workerId)}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-0.5">
                              <h3 className="font-montserrat-semibold text-gray-900 text-xs md:text-base truncate">
                                {getWorkerDisplayName(invite.workerId)}
                              </h3>
                              <Badge className="bg-orange-50 text-orange-600 text-xs px-1 md:px-2 py-0 h-4 md:h-5">
                                Pending
                              </Badge>
                            </div>
                            <p className="text-xs md:text-sm text-gray-600 truncate">
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
                        <div className="text-right ml-2 md:ml-4">
                          <p className="text-sm md:text-xl font-montserrat-bold text-orange-600">
                            ${invite.proposedRates.baseHourlyRate}/hr
                          </p>
                        </div>
                      </div>
                      {invite.notes && (
                        <div className="mt-2 md:mt-3 p-2 md:p-3 bg-gray-50 rounded-lg">
                          <p className="text-xs md:text-sm text-gray-600">
                            <span className="font-montserrat-semibold">Notes:</span>{" "}
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

          {/* Worker Details Sidebar - Desktop */}
          {selectedWorker && (
            <div className="hidden lg:block">
              <Card className="border-0 shadow-sm sticky top-6">
                <CardContent className="p-0">
                  <div className="p-3 md:p-4 border-b flex items-center justify-between">
                    <h3 className="font-montserrat-bold text-gray-900 text-sm md:text-base">
                      {getWorkerDisplayName(selectedWorker.workerId)}
                    </h3>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0"
                      onClick={() => setSelectedWorker(null)}
                    >
                      <CloseCircle className="w-5 h-5 text-gray-400" />
                    </Button>
                  </div>

                  <div className="p-3 md:p-4 space-y-3 md:space-y-4">
                    {/* Worker Info */}
                    <div className="text-center">
                      <Avatar className="w-12 h-12 md:w-20 md:h-20 mx-auto mb-2 md:mb-3">
                        {getWorkerProfileImage(selectedWorker.workerId) ? (
                          <AvatarImage
                            src={getWorkerProfileImage(selectedWorker.workerId)}
                          />
                        ) : (
                          <AvatarFallback className="bg-primary-100 text-primary-600 text-base md:text-2xl font-montserrat-semibold">
                            {getWorkerInitials(selectedWorker.workerId)}
                          </AvatarFallback>
                        )}
                      </Avatar>
                      <h4 className="font-montserrat-bold text-gray-900 text-sm md:text-base mb-1">
                        {getWorkerDisplayName(selectedWorker.workerId)}
                      </h4>
                      <p className="text-xs md:text-sm text-gray-600 mb-0.5">
                        {getWorkerEmail(selectedWorker.workerId)}
                      </p>
                      <p className="text-xs md:text-sm text-gray-600">
                        {getWorkerPhone(selectedWorker.workerId)}
                      </p>
                    </div>

                    {/* Service Agreement */}
                    <div>
                      <h5 className="font-montserrat-semibold text-gray-900 text-sm md:text-base mb-2 md:mb-3">
                        Service Agreement
                      </h5>
                      <div className="space-y-2 md:space-y-3 text-xs md:text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-600">
                            Base Hourly Rate:
                          </span>
                          <span className="font-montserrat-bold text-primary-600">
                            ${selectedWorker.serviceAgreement.baseHourlyRate}/hr
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">
                            Distance Travel Rate:
                          </span>
                          <span className="font-montserrat-semibold text-gray-900">
                            $
                            {selectedWorker.serviceAgreement.distanceTravelRate}
                            /km
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Start Date:</span>
                          <span className="font-montserrat-semibold text-gray-900">
                            {format(
                              parseISO(
                                selectedWorker.serviceAgreement.startDate
                              ),
                              "dd/MM/yyyy"
                            )}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Terms Accepted:</span>
                          <span className="font-montserrat-semibold text-gray-900">
                            {selectedWorker.serviceAgreement.termsAccepted ? (
                              <span className="text-green-600 flex items-center gap-1">
                                Yes <CheckCircle className="w-3 h-3" />
                              </span>
                            ) : (
                              "No"
                            )}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Joined Date:</span>
                          <span className="font-montserrat-semibold text-gray-900">
                            {format(
                              parseISO(selectedWorker.joinedDate),
                              "dd/MM/yyyy"
                            )}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Status:</span>
                          <Badge className="bg-green-50 text-green-600 text-xs">
                            Active
                          </Badge>
                        </div>
                      </div>
                    </div>

                    {/* Shift Rates */}
                    <div>
                      <h5 className="font-montserrat-semibold text-gray-900 text-sm md:text-base mb-2 md:mb-3">
                        Shift Rates
                      </h5>
                      <div className="space-y-1 md:space-y-2">
                        {selectedWorker.serviceAgreement.shiftRates.map(
                          (rate) => (
                            <div
                              key={rate._id}
                              className="p-2 md:p-3 bg-gray-50 rounded-lg"
                            >
                              <div className="flex justify-between items-start mb-1">
                                <span className="font-montserrat-semibold text-gray-900 text-xs md:text-sm">
                                  {getRateBandName(rate.rateTimeBandId)}
                                </span>
                                <span className="font-montserrat-bold text-primary-600 text-xs md:text-sm">
                                  ${rate.hourlyRate}/hr
                                </span>
                              </div>
                              {getRateBandCode(rate.rateTimeBandId) && (
                                <p className="text-xs text-gray-500">
                                  Code: {getRateBandCode(rate.rateTimeBandId)}
                                </p>
                              )}
                            </div>
                          )
                        )}
                      </div>
                    </div>

                    {/* Remove Worker Button */}
                    {user?.role === "participant" && (
                      <Button
                        disabled={removeWorkerMutation.isPending}
                        onClick={() =>
                          handleRemoveWorker(selectedWorker.workerId._id as string)
                        }
                        className="w-full bg-red-600 hover:bg-red-700 text-white font-montserrat-semibold text-sm md:text-base min-h-[44px]"
                      >
                        Remove Worker{" "}
                        {removeWorkerMutation.isPending ? "..." : ""}
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>

      {/* Worker Details Modal - Mobile */}
      {showWorkerDetails && selectedWorker && (
        <Dialog open={showWorkerDetails} onOpenChange={setShowWorkerDetails}>
          <DialogClose>
            <div className="fixed inset-0 bg-black/30" />
          </DialogClose>
          <DialogContent className="lg:hidden max-w-full w-[90vw] mx-auto h-[90vh] p-0 rounded-t-2xl">
            <DialogHeader className="p-3 md:p-4 border-b">
              <DialogTitle className="font-montserrat-bold text-gray-900 text-sm md:text-base">
                {getWorkerDisplayName(selectedWorker.workerId)}
              </DialogTitle>
            </DialogHeader>
            <div className="p-3 md:p-4 space-y-3 md:space-y-4 overflow-y-auto">
              {/* Worker Info */}
              <div className="text-center">
                <Avatar className="w-12 h-12 md:w-20 md:h-20 mx-auto mb-2 md:mb-3">
                  {getWorkerProfileImage(selectedWorker.workerId) ? (
                    <AvatarImage
                      src={getWorkerProfileImage(selectedWorker.workerId)}
                    />
                  ) : (
                    <AvatarFallback className="bg-primary-100 text-primary-600 text-base md:text-2xl font-montserrat-semibold">
                      {getWorkerInitials(selectedWorker.workerId)}
                    </AvatarFallback>
                  )}
                </Avatar>
                <h4 className="font-montserrat-bold text-gray-900 text-sm md:text-base mb-1">
                  {getWorkerDisplayName(selectedWorker.workerId)}
                </h4>
                <p className="text-xs md:text-sm text-gray-600 mb-0.5">
                  {getWorkerEmail(selectedWorker.workerId)}
                </p>
                <p className="text-xs md:text-sm text-gray-600">
                  {getWorkerPhone(selectedWorker.workerId)}
                </p>
              </div>

              {/* Service Agreement */}
              <div>
                <h5 className="font-montserrat-semibold text-gray-900 text-sm md:text-base mb-2 md:mb-3">
                  Service Agreement
                </h5>
                <div className="space-y-2 md:space-y-3 text-xs md:text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Base Hourly Rate:</span>
                    <span className="font-montserrat-bold text-primary-600">
                      ${selectedWorker.serviceAgreement.baseHourlyRate}/hr
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Distance Travel Rate:</span>
                    <span className="font-montserrat-semibold text-gray-900">
                      ${selectedWorker.serviceAgreement.distanceTravelRate}/km
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Start Date:</span>
                    <span className="font-montserrat-semibold text-gray-900">
                      {format(
                        parseISO(selectedWorker.serviceAgreement.startDate),
                        "dd/MM/yyyy"
                      )}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Terms Accepted:</span>
                    <span className="font-montserrat-semibold text-gray-900">
                      {selectedWorker.serviceAgreement.termsAccepted ? (
                        <span className="text-green-600 flex items-center gap-1">
                          Yes <CheckCircle className="w-3 h-3" />
                        </span>
                      ) : (
                        "No"
                      )}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Joined Date:</span>
                    <span className="font-montserrat-semibold text-gray-900">
                      {format(
                        parseISO(selectedWorker.joinedDate),
                        "dd/MM/yyyy"
                      )}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Status:</span>
                    <Badge className="bg-green-50 text-green-600 text-xs">
                      Active
                    </Badge>
                  </div>
                </div>
              </div>

              {/* Shift Rates */}
              <div>
                <h5 className="font-montserrat-semibold text-gray-900 text-sm md:text-base mb-2 md:mb-3">
                  Shift Rates
                </h5>
                <div className="space-y-1 md:space-y-2">
                  {selectedWorker.serviceAgreement.shiftRates.map((rate) => (
                    <div
                      key={rate._id}
                      className="p-2 md:p-3 bg-gray-50 rounded-lg"
                    >
                      <div className="flex justify-between items-start mb-1">
                        <span className="font-montserrat-semibold text-gray-900 text-xs md:text-sm">
                          {getRateBandName(rate.rateTimeBandId)}
                        </span>
                        <span className="font-montserrat-bold text-primary-600 text-xs md:text-sm">
                          ${rate.hourlyRate}/hr
                        </span>
                      </div>
                      {getRateBandCode(rate.rateTimeBandId) && (
                        <p className="text-xs text-gray-500">
                          Code: {getRateBandCode(rate.rateTimeBandId)}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Remove Worker Button */}
              {user?.role === "participant" && (
                <Button
                  disabled={removeWorkerMutation.isPending}
                  onClick={() =>
                    handleRemoveWorker(selectedWorker.workerId._id as string)
                  }
                  className="w-full bg-red-600 hover:bg-red-700 text-white font-montserrat-semibold text-sm md:text-base min-h-[44px]"
                >
                  Remove Worker {removeWorkerMutation.isPending ? "..." : ""}
                </Button>
              )}
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
