import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useSupportWorkerProfile } from "@/hooks/useParticipant";
import { useMyOrganizations } from "@/hooks/useParticipant";
import { Loader2 } from "lucide-react";
import { SupportWorker } from "@/types/user.types";
import { Calendar, CheckCircle, CloseCircle, MapPoint, Star } from "@solar-icons/react";

export default function SupportWorkerProfilePreview() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const {
    data: workerProfile,
    isLoading,
    isError,
    error,
  } = useSupportWorkerProfile(id || "", {
    enabled: !!id,
    queryKey: ["supportWorkerProfile", id],
  });

  const { data: organizations } = useMyOrganizations();

  const isWorkerInOrganization = (workerId: string) => {
    return (
      organizations?.some((org) =>
        org.workers?.some((member) => member.workerId?._id === workerId)
      ) || false
    );
  };

  const isWorkerPendingInvite = (workerId: string) => {
    return (
      organizations?.some((org) =>
        org.pendingInvites?.some(
          (invite) =>
            invite.workerId?._id === workerId && invite.status === "pending"
        )
      ) || false
    );
  };

  const getWorkerInitials = (worker: SupportWorker) => {
    return `${worker.firstName?.charAt(0) || ""}${
      worker.lastName?.charAt(0) || ""
    }`.toUpperCase();
  };

  const getWorkerFullName = (worker: SupportWorker) => {
    return `${worker.firstName || ""} ${worker.lastName || ""}`.trim();
  };

  const handleInvite = () => {
    if (workerProfile?.worker?._id) {
      navigate(`/participant/invite/${workerProfile.worker._id}`);
    }
  };

  if (isLoading) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4">
          <div className="flex items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <span className="ml-2 text-primary">Loading profile...</span>
          </div>
        </div>
      </div>
    );
  }

  if (isError || !workerProfile?.worker) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4">
          <div className="text-center">
            <p className="text-red-600 font-medium">Failed to load profile</p>
            <p className="text-sm text-muted-foreground mt-1">
              {error instanceof Error
                ? error.message
                : "Please try again later"}
            </p>
            <Button onClick={() => navigate(-1)} className="mt-4">
              Go Back
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const worker = workerProfile.worker;
  const isInOrganization = isWorkerInOrganization(worker._id);
  const isPending = !isInOrganization && isWorkerPendingInvite(worker._id);
  const hasSkills = worker.skills && worker.skills.length > 0;
  const hasExperience = worker.experience && worker.experience.length > 0;
  const hasShiftRates = worker.shiftRates && worker.shiftRates.length > 0;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b px-4 md:px-6 py-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold">Profile</h2>
          <button
            onClick={() => navigate(-1)}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <CloseCircle className="h-5 w-5" />
          </button>
        </div>

        <div className="p-4 md:p-6">
          {/* Profile Header */}
          <div className="flex flex-col items-center text-center mb-6">
            <Avatar className="h-20 md:h-24 w-20 md:w-24 mb-3">
              <AvatarImage src={worker.profileImage || undefined} />
              <AvatarFallback className="text-xl md:text-2xl bg-primary text-white">
                {getWorkerInitials(worker)}
              </AvatarFallback>
            </Avatar>
            <div className="flex items-center gap-2 mb-1">
              <h1 className="text-xl md:text-2xl font-semibold">
                {getWorkerFullName(worker)}
              </h1>
              {worker.verificationStatus?.identityVerified && (
                <div className="bg-blue-500 rounded-full p-0.5">
                  <CheckCircle className="h-3 w-3 text-white" />
                </div>
              )}
            </div>
            <p className="text-muted-foreground mb-2">Support Worker</p>
            <div className="flex flex-col md:flex-row items-center gap-2 md:gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <Star className="h-4 w-4 text-yellow-500 fill-current" />
                <span>
                  {worker.ratings?.average?.toFixed(1) || "0"} |{" "}
                  {worker.ratings?.count || 0}
                </span>
              </div>
              <div className="flex items-center gap-1">
                <MapPoint className="h-4 w-4" />
                <span>
                  {worker.serviceAreas && worker.serviceAreas.length > 0
                    ? worker.serviceAreas.join(", ")
                    : "Location not specified"}
                </span>
              </div>
            </div>
          </div>

          {/* Verification Status */}
          <div className="bg-green-50 rounded-lg p-4 mb-6">
            <div className="flex flex-col md:flex-row items-center justify-center gap-2 md:gap-4 text-sm flex-wrap">
              <div className="flex items-center gap-1">
                {worker.verificationStatus?.identityVerified ? (
                  <CheckCircle className="h-4 w-4 text-green-600" />
                ) : (
                  <CloseCircle className="h-4 w-4 text-red-600" />
                )}
                <span className="text-gray-700">Identity</span>
              </div>
              <span className="text-gray-300 hidden md:inline">|</span>
              <div className="flex items-center gap-1">
                {worker.verificationStatus?.policeCheckVerified ? (
                  <CheckCircle className="h-4 w-4 text-green-600" />
                ) : (
                  <CloseCircle className="h-4 w-4 text-red-600" />
                )}
                <span className="text-gray-700">Policy Check</span>
              </div>
              <span className="text-gray-300 hidden md:inline">|</span>
              <div className="flex items-center gap-1">
                {worker.verificationStatus?.ndisWorkerScreeningVerified ? (
                  <CheckCircle className="h-4 w-4 text-green-600" />
                ) : (
                  <CloseCircle className="h-4 w-4 text-red-600" />
                )}
                <span className="text-gray-700">NDIS Screening</span>
              </div>
            </div>
            {(worker.verificationStatus?.identityVerified ||
              worker.verificationStatus?.policeCheckVerified ||
              worker.verificationStatus?.ndisWorkerScreeningVerified) && (
              <div className="mt-2 text-center">
                <span className="inline-block bg-green-600 text-white text-xs px-3 py-1 rounded-full font-medium">
                  Verification
                </span>
              </div>
            )}
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6 text-center">
            <div className="border rounded-lg p-3">
              <p className="text-sm text-muted-foreground mb-1">Skills</p>
              <p className="text-xl md:text-2xl font-semibold">
                {worker.skills?.length || 0}
              </p>
            </div>
            <div className="border rounded-lg p-3">
              <p className="text-sm text-muted-foreground mb-1">Experience</p>
              <p className="text-xl md:text-2xl font-semibold">
                {worker.experience?.length || 0} Jobs
              </p>
            </div>
            <div className="border rounded-lg p-3">
              <p className="text-sm text-muted-foreground mb-1">Status</p>
              <p className="text-lg font-semibold capitalize">
                {worker.status || "Active"}
              </p>
            </div>
            <div className="border rounded-lg p-3">
              <p className="text-sm text-muted-foreground mb-1">
                Base Hourly Rates
              </p>
              <p className="text-xl md:text-2xl font-semibold">
                ${worker.hourlyRate || 0}/hr
              </p>
            </div>
          </div>

          {/* Skills Section */}
          <div className="mb-6">
            <h3 className="font-semibold mb-3 flex items-center gap-2">
              <span>Skills</span>
              <span className="text-primary">{worker.skills?.length || 0}</span>
            </h3>
            {hasSkills ? (
              <div className="flex flex-wrap gap-2">
                {worker.skills.map((skill: any) => {
                  const skillName =
                    typeof skill === "string" ? skill : skill.name;
                  const skillKey =
                    typeof skill === "string" ? skill : skill._id;
                  return (
                    <span
                      key={skillKey}
                      className="px-3 py-1 bg-gray-100 rounded-full text-sm"
                    >
                      {skillName}
                    </span>
                  );
                })}
              </div>
            ) : (
              <p className="text-muted-foreground text-sm">No skills listed</p>
            )}
          </div>

          {/* Experience Section */}
          <div className="mb-6">
            <h3 className="font-semibold mb-3 flex items-center gap-2">
              <span>Experience</span>
              <span className="text-primary">
                {worker.experience?.length || 0}
              </span>
            </h3>
            {hasExperience ? (
              <div className="space-y-4">
                {worker.experience.map((exp: any, index: number) => (
                  <div key={index} className="border rounded-lg p-4">
                    <div className="flex flex-col md:flex-row justify-between items-start mb-2">
                      <h4 className="font-medium">{exp.title || "Position"}</h4>
                      <div className="flex items-center gap-1 text-sm text-orange-600 mt-1 md:mt-0">
                        <MapPoint className="h-3 w-3" />
                        <span>{exp.location || "Location not specified"}</span>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">
                      {exp.startDate || "Start"} - {exp.endDate || "End"}
                    </p>
                    {exp.responsibilities &&
                      exp.responsibilities.length > 0 && (
                        <ul className="space-y-1">
                          {exp.responsibilities.map(
                            (resp: string, idx: number) => (
                              <li
                                key={idx}
                                className="text-sm flex items-start gap-2"
                              >
                                <CheckCircle className="h-4 w-4 text-blue-600 flex-shrink-0 mt-0.5" />
                                <span>{resp}</span>
                              </li>
                            )
                          )}
                        </ul>
                      )}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground text-sm">
                No experience listed
              </p>
            )}
          </div>

          {/* Availability Section */}
          <div className="mb-6">
            <h3 className="font-semibold mb-3 flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              <span>Availability</span>
            </h3>
            {worker.availability?.weekdays &&
            worker.availability.weekdays.length > 0 ? (
              <div className="grid grid-cols-7 gap-1 md:gap-2">
                {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map(
                  (day, index) => {
                    const isAvailable = worker.availability?.weekdays?.some(
                      (wd: any) => wd.day === index
                    );
                    return (
                      <div
                        key={day}
                        className={`text-center p-2 rounded text-xs md:text-sm ${
                          isAvailable
                            ? "bg-blue-600 text-white font-medium"
                            : "bg-gray-100 text-gray-400"
                        }`}
                      >
                        {day}
                      </div>
                    );
                  }
                )}
              </div>
            ) : (
              <p className="text-muted-foreground text-sm">
                No availability listed
              </p>
            )}
          </div>

          {/* Proposed Shift Rates */}
          <div className="mb-6">
            <h3 className="font-semibold mb-3">Proposed Shift Rates</h3>
            {hasShiftRates ? (
              <div className="space-y-2">
                {worker.shiftRates.map((rate: any, index: number) => (
                  <div
                    key={index}
                    className="flex justify-between items-center p-3 bg-gray-50 rounded-lg"
                  >
                    <span className="text-sm font-medium">
                      {rate.rateTimeBandId?.name || "Shift"}
                    </span>
                    <span className="text-sm font-semibold text-blue-600">
                      ${rate.hourlyRate}/hr
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground text-sm">
                No proposed rate shift listed
              </p>
            )}
          </div>

          {/* Action Button */}
          <div className="sticky bottom-0 bg-white pt-4 border-t -mx-4 md:-mx-6 px-4 md:px-6 pb-6">
            {isInOrganization ? (
              <Button
                size="lg"
                variant="outline"
                disabled
                className="w-full bg-primary-100 border-primary-200 text-primary-700"
              >
                <CheckCircle size={16} className="mr-1" />
                Already in Organization
              </Button>
            ) : isPending ? (
              <Button
                size="lg"
                variant="outline"
                disabled
                className="w-full bg-yellow-50 border-yellow-200 text-yellow-700"
              >
                <CheckCircle size={16} className="mr-1" />
                Invite Pending
              </Button>
            ) : (
              <Button
                size="lg"
                onClick={handleInvite}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white"
              >
                Send Invite
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
