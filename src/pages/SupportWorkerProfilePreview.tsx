import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useSupportWorkerProfile } from "@/hooks/useParticipant";
import { useMyOrganizations } from "@/hooks/useParticipant";
import { SupportWorker } from "@/types/user.types";
import {
  Calendar,
  CheckCircle,
  CloseCircle,
  InfoCircle,
  MapPoint,
  Star,
} from "@solar-icons/react";
import Loader from "@/components/Loader";
import {
  cn,
  FLEX_ROW_BETWEEN,
  FLEX_ROW_CENTER,
  FLEX_COL_CENTER,
} from "@/lib/design-utils";
import {
  BG_COLORS,
  BUTTON_VARIANTS,
  GAP,
  TEXT_COLORS,
  SPACING,
  RADIUS,
  SHADOW,
  BORDER_STYLES,
  HEADING_STYLES,
  TEXT_STYLES,
  FONT_FAMILY,
  GRID_LAYOUTS,
  ICON_SIZES,
} from "@/constants/design-system";

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

  const getHourlyRate = (hourlyRate: any) => {
    if (typeof hourlyRate === 'number') {
      return hourlyRate;
    }
    if (typeof hourlyRate === 'object' && hourlyRate !== null) {
      return hourlyRate.baseRate || 0;
    }
    return 0;
  };

  const handleInvite = () => {
    if (workerProfile?.worker?._id) {
      navigate(`/participant/invite/${workerProfile.worker._id}`);
    }
  };

  if (isLoading) {
    return <Loader />;
  }

  console.log("Worker Profile:", workerProfile);

  if (isError || !workerProfile?.worker) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
        <div className={cn(BG_COLORS.white, RADIUS.lg, "p-8 max-w-md w-full mx-4")}>
          <div className="text-center">
            <p className={cn("text-red-600", FONT_FAMILY.montserratSemibold)}>Failed to load profile</p>
            <p className={cn("text-sm text-muted-foreground mt-1")}>
              {error instanceof Error
                ? error.message
                : "Please try again later"}
            </p>
            <Button onClick={() => navigate(-1)} className={cn("mt-4", BUTTON_VARIANTS.primary)}>
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
      <div className={cn(BG_COLORS.white, RADIUS["2xl"], "max-w-5xl w-full max-h-[90vh] overflow-y-auto", SHADOW.xl)}>
        {/* Header */}
        <div className={cn("sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between z-10", `rounded-t-${RADIUS["2xl"]}`)}>
          <h2 className={cn("text-xl", FONT_FAMILY.montserratSemibold, TEXT_COLORS.muted)}>Profile</h2>
          <button
            onClick={() => navigate(-1)}
            className="p-1 hover:bg-gray-100 rounded-full text-gray-600 hover:text-gray-900 transition-colors"
          >
            <CloseCircle className={ICON_SIZES["2xl"]} />
          </button>
        </div>

        <div className={cn("px-6 py-6")}>
          {/* Profile Header */}
          <div className={cn(FLEX_COL_CENTER, "text-center mb-6")}>
            <Avatar className={cn("h-24 w-24 mb-3 border-4 border-gray-100", SHADOW.md)}>
              <AvatarImage src={worker.profileImage || undefined} />
              <AvatarFallback className={cn("text-2xl bg-primary text-white", FONT_FAMILY.montserratSemibold)}>
                {getWorkerInitials(worker)}
              </AvatarFallback>
            </Avatar>
            <div className={cn(FLEX_ROW_CENTER, "gap-2 mb-1")}>
              <h1 className={cn("text-2xl", FONT_FAMILY.montserratSemibold, TEXT_COLORS.gray900)}>
                {getWorkerFullName(worker)}
              </h1>
              {worker.verificationStatus?.identityVerified && (
                <div className="bg-primary-500 rounded-full p-0.5">
                  <CheckCircle className="h-4 w-4 text-white" />
                </div>
              )}
            </div>
            <p className={cn(TEXT_COLORS.gray600, "mb-3", FONT_FAMILY.montserratMedium)}>Support Worker</p>
            <div className={cn(FLEX_ROW_CENTER, GAP.md, TEXT_STYLES.small, TEXT_COLORS.gray600)}>
              <div className={cn(FLEX_ROW_CENTER, "gap-1")}>
                <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                <span className={cn(FONT_FAMILY.montserratMedium)}>
                  {worker.ratings?.average?.toFixed(1) || "0"} | {worker.ratings?.count || 0}
                </span>
              </div>
              <div className={cn(FLEX_ROW_CENTER, "gap-1")}>
                <MapPoint className="h-4 w-4 text-orange-500" />
                <span>
                  {worker.serviceAreas && worker.serviceAreas.length > 0
                    ? worker.serviceAreas[0]
                    : "Location not specified"}
                </span>
              </div>
            </div>
          </div>

          {/* Verification Status */}
          <div className={cn(BG_COLORS.gray50, RADIUS.xl, "p-4 mb-6 relative", SHADOW.md, BORDER_STYLES.default)}>
            <div className={cn(FLEX_ROW_CENTER, "justify-center gap-6 text-sm")}>
              <div className={cn(FLEX_ROW_CENTER, "gap-2")}>
                <CheckCircle className={`h-5 w-5 ${worker.verificationStatus?.identityVerified ? 'text-green-600' : 'text-gray-300'}`} />
                <span className={cn(TEXT_COLORS.gray700, FONT_FAMILY.montserratSemibold)}>Identity</span>
              </div>
              <div className="h-4 w-px bg-gray-300" />
              <div className={cn(FLEX_ROW_CENTER, "gap-2")}>
                <CheckCircle className={`h-5 w-5 ${worker.verificationStatus?.policeCheckVerified ? 'text-green-600' : 'text-gray-300'}`} />
                <span className={cn(TEXT_COLORS.gray700, FONT_FAMILY.montserratSemibold)}>Police Check</span>
              </div>
              <div className="h-4 w-px bg-gray-300" />
              <div className={cn(FLEX_ROW_CENTER, "gap-2")}>
                <CheckCircle className={`h-5 w-5 ${worker.verificationStatus?.ndisWorkerScreeningVerified ? 'text-green-600' : 'text-gray-300'}`} />
                <span className={cn(TEXT_COLORS.gray700, FONT_FAMILY.montserratSemibold)}>NDIS Screening</span>
              </div>
            </div>
            <div className="flex justify-center absolute inset-x-0 -top-3 right-4 place-self-end">
              <span className={cn("inline-block bg-green-600 text-white text-xs px-4 py-1", RADIUS.full, FONT_FAMILY.montserratSemibold)}>
                Verification
              </span>
            </div>
          </div>

          {/* Stats Grid */}
          <div className={cn(GRID_LAYOUTS.cols4, "gap-3 mb-6")}>
            <div className="relative p-3 text-center">
              <p className={cn("text-xs text-gray-600 mb-1", FONT_FAMILY.montserratSemibold)}>Skills</p>
              <p className={cn("text-2xl", FONT_FAMILY.montserratSemibold, TEXT_COLORS.primary)}>
              {worker.skills?.length || 0}
              </p>
              {/* vertical line */}
              <div className="absolute right-0 top-1/2 -translate-y-1/2 h-12 w-px bg-gray-400" />
            </div>
            <div className="relative p-3 text-center">
              <p className={cn("text-xs text-gray-600 mb-1", FONT_FAMILY.montserratSemibold)}>Experience</p>
              <p className={cn("text-2xl", FONT_FAMILY.montserratSemibold, TEXT_COLORS.primary)}>
                {worker.experience?.length || 0} <span className="text-sm">Jobs</span>
              </p>
               {/* vertical line */}
              <div className="absolute right-0 top-1/2 -translate-y-1/2 h-12 w-px bg-gray-400" />
            </div>
            <div className="relative p-3 text-center">
              <p className={cn("text-xs text-gray-600 mb-1", FONT_FAMILY.montserratSemibold)}>Status</p>
              <p className={cn("text-lg capitalize", FONT_FAMILY.montserratSemibold, TEXT_COLORS.primary)}>
                {worker.status || "Active"}
              </p>
               {/* vertical line */}
              <div className="absolute right-0 top-1/2 -translate-y-1/2 h-12 w-px bg-gray-400" />
            </div>
            <div className="relative p-3 text-center">
              <p className={cn("text-xs text-gray-600 mb-1", FONT_FAMILY.montserratSemibold)}>Base Hourly Rates</p>
              <p className={cn("text-2xl", FONT_FAMILY.montserratSemibold, TEXT_COLORS.primary)}>
                ${getHourlyRate(worker.hourlyRate)}<span className="text-sm">/hr</span>
              </p>
            </div>
          </div>

          {/* Skills Section */}
          <div className="mb-6">
            <h3 className={cn(FONT_FAMILY.montserratSemibold, TEXT_COLORS.gray900, "mb-3", FLEX_ROW_CENTER, "gap-2")}>
              <span>Skills</span>
              <span className={TEXT_COLORS.primary}>{worker.skills?.length || 0}</span>
            </h3>
            {hasSkills ? (
              <div className={cn("flex flex-wrap", GAP.sm)}>
                {worker.skills.map((skill: any) => {
                  const skillName = typeof skill === "string" ? skill : skill.name;
                  const skillKey = typeof skill === "string" ? skill : skill._id;
                  return (
                    <span
                      key={skillKey}
                      className={cn("px-4 py-2 text-sm text-gray-700 border border-gray-200", RADIUS.full, FONT_FAMILY.montserratMedium)}
                    >
                      {skillName}
                    </span>
                  );
                })}
              </div>
            ) : (
              <p className="text-gray-500 text-sm">No skills listed</p>
            )}
          </div>

          {/* Experience Section */}
          <div className="mb-6">
            <h3 className={cn(FONT_FAMILY.montserratSemibold, TEXT_COLORS.gray900, "mb-3", FLEX_ROW_CENTER, "gap-2")}>
              <span>Experience</span>
              <span className={TEXT_COLORS.primary}>{worker.experience?.length || 0}</span>
            </h3>
            {hasExperience ? (
              <div className={cn(`space-y-${SPACING.md}`)}>
                {worker.experience.map((exp: any, index: number) => (
                  <div key={index} className={cn("p-4 bg-white", BORDER_STYLES.default, RADIUS.xl)}>
                    <div className={cn(FLEX_ROW_BETWEEN, "items-start mb-2")}>
                      <h4 className={cn(FONT_FAMILY.montserratSemibold, TEXT_COLORS.gray900)}>
                        {exp.title || "Position"}
                      </h4>
                      <div className={cn("flex items-center gap-1 text-sm text-orange-500", FONT_FAMILY.montserratMedium)}>
                        <MapPoint className="h-4 w-4" />
                        <span>{exp.location || "Location not specified"}</span>
                      </div>
                    </div>
                    <p className={cn("text-sm text-gray-600 mb-3", FONT_FAMILY.montserratMedium)}>
                      {exp.startDate || "Start"} - {exp.endDate || "End"}
                    </p>
                    {exp.responsibilities && exp.responsibilities.length > 0 && (
                      <ul className="space-y-2">
                        {exp.responsibilities.map((resp: string, idx: number) => (
                          <li key={idx} className="text-sm flex items-start gap-2 text-gray-700">
                            <CheckCircle className="h-4 w-4 text-primary-600 flex-shrink-0 mt-0.5" />
                            <span>{resp}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-sm">No experience listed</p>
            )}
          </div>

          {/* Availability Section */}
          <div className="mb-6">
            <h3 className={cn(FONT_FAMILY.montserratSemibold, TEXT_COLORS.gray900, "mb-3", FLEX_ROW_CENTER, "gap-2")}>
              <Calendar className="h-5 w-5" />
              <span>Availability</span>
              <span className={cn("ml-auto text-sm text-orange-500", FONT_FAMILY.montserratMedium)}>September, 2025 ▾</span>
            </h3>
            {worker.availability?.weekdays && worker.availability.weekdays.length > 0 ? (
              <div className={cn("grid grid-cols-7", GAP.sm)}>
                {[
                  { day: "Mon", index: 0 },
                  { day: "Tue", index: 1 },
                  { day: "Wed", index: 2 },
                  { day: "Thu", index: 3 },
                  { day: "Fri", index: 4 },
                  { day: "Sat", index: 5 },
                  { day: "Sun", index: 6 },
                ].map(({ day, index }) => {
                    const dayName = day.toLowerCase();
                    const isAvailable = worker.availability?.weekdays?.find(
                    (wd) => wd.day.toLowerCase().slice(0, 3) === dayName
                    )?.available || false;
                  return (
                    <div
                      key={day}
                      className={cn(`text-center p-3 rounded-lg ${
                        isAvailable
                          ? "bg-primary-100 text-primary-700 font-montserrat-semibold"
                          : "bg-gray-100 text-gray-400 font-montserrat-medium"
                      }`)}
                    >
                      <div className="text-sm">{day}</div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="text-gray-500 text-sm">No availability listed</p>
            )}
          </div>

          {/* Proposed Shift Rates */}
          <div className="mb-6">
            <h3 className={cn(FONT_FAMILY.montserratSemibold, TEXT_COLORS.gray900, "mb-3")}>
              Proposed Shift Rates
            </h3>
            {hasShiftRates ? (
              <div className={cn("flex flex-wrap", GAP.sm)}>
                {worker.shiftRates.map((rate: any, index: number) => (
                  <div
                    key={index}
                    className={cn("flex justify-between items-center py-2 px-3 bg-gray-50 border border-gray-200", RADIUS.full)}
                  >
                    <span className={cn("text-sm text-gray-900", FONT_FAMILY.montserratSemibold)}>
                      {rate.rateTimeBandId?.name || "Shift"}
                    </span>
                    <span className={cn("text-xs bg-primary/10 p-1 text-primary-600 rounded-full ml-2", FONT_FAMILY.montserratSemibold)}>
                      ${rate.hourlyRate}/hr
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className={cn("flex flex-wrap", GAP.sm)}>
                {/* Fallback Static Rates - Refactored */}
                {[
                  { label: "Morning Shift", rate: 34 },
                  { label: "Afternoon Shift", rate: 34 },
                  { label: "Night Shift", rate: 40 },
                  { label: "PublicHoliday Shift", rate: 24 },
                  { label: "Weekend Shift", rate: 32, colSpan: true },
                ].map((item, idx) => (
                  <div 
                    key={idx}
                    className={cn(
                      "flex justify-between items-center p-3 bg-primary-50 border border-primary-100", 
                      RADIUS.full,
                      item.colSpan && "col-span-2"
                    )}
                  >
                    <span className={cn("text-sm text-gray-900", FONT_FAMILY.montserratSemibold)}>
                      {item.label}
                    </span>
                    <span className={cn("text-primary-600 bg-primary/10 text-xs p-1 ml-2 rounded", FONT_FAMILY.montserratSemibold)}>
                      ${item.rate}/hr
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Action Button */}
          <div className="sticky bottom-0 bg-white pt-4 -mx-6 px-6 pb-6">
            {isInOrganization ? (
              <Button
                size="lg"
                variant="outline"
                disabled
                className={cn("w-full bg-primary-50 border-primary-200 text-primary-700 hover:bg-primary-50", FONT_FAMILY.montserratSemibold)}
              >
                <CheckCircle size={20} className="mr-2" />
                Already in Organization
              </Button>
            ) : isPending ? (
              <Button
                size="lg"
                variant="outline"
                disabled
                className={cn("w-full bg-yellow-50 border-yellow-200 text-yellow-700 hover:bg-yellow-50", FONT_FAMILY.montserratSemibold)}
              >
                <InfoCircle size={20} />
                <span className="ml-2">Invite Pending</span>
              </Button>
            ) : (
              <Button
                size="lg"
                onClick={handleInvite}
                className={cn("w-full bg-primary-600 hover:bg-primary-700 text-white text-base py-6", RADIUS.xl, FONT_FAMILY.montserratSemibold)}
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