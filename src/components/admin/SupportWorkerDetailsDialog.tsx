import { format } from "date-fns";
import {
  CheckCircle,
  CloseCircle,
  Letter,
  Phone,
  Calendar,
  UsersGroupTwoRounded,
  User,
  VerifiedCheck,
  Bell,
  Star,
  MapPoint,
  Global,
  ClipboardText,
  Case,
  MedalStar,
  Shield,
  ClockCircle,
  DangerCircle,
} from "@solar-icons/react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Progress } from "@/components/ui/progress";
import { SupportWorker, VerificationSummary } from "@/entities/SupportWorker";

interface WeekdayAvailability {
  day: string;
  available: boolean;
  slots?: { start: string; end: string }[];
  _id?: string;
}

interface SupportWorkerDetailsDialogProps {
  worker: SupportWorker | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function SupportWorkerDetailsDialog({
  worker,
  open,
  onOpenChange,
}: SupportWorkerDetailsDialogProps) {
  if (!worker) return null;

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "active":
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case "pending":
        return <ClockCircle className="h-4 w-4 text-yellow-500" />;
      case "suspended":
        return <DangerCircle className="h-4 w-4 text-red-500" />;
      case "inactive":
        return <CloseCircle className="h-4 w-4 text-gray-500" />;
      default:
        return <ClockCircle className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusBadgeStyle = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "suspended":
        return "bg-red-100 text-red-800";
      case "inactive":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const calculateVerificationProgress = (
    verificationStatus: SupportWorker["verificationStatus"]
  ): VerificationSummary => {
    if (!verificationStatus) {
      return { total: 0, completed: 0, percentage: 0 };
    }
    const statuses = Object.values(verificationStatus);
    const completed = statuses.filter((status) => status === true).length;
    const total = statuses.length;
    const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;
    return { total, completed, percentage };
  };

  const verificationProgress = calculateVerificationProgress(worker.verificationStatus);

  const verificationItems = [
    {
      key: "profileSetupComplete",
      label: "Profile Setup",
      verified: worker.verificationStatus?.profileSetupComplete,
    },
    {
      key: "identityVerified",
      label: "Identity Verified",
      verified: worker.verificationStatus?.identityVerified,
    },
    {
      key: "policeCheckVerified",
      label: "Police Check",
      verified: worker.verificationStatus?.policeCheckVerified,
    },
    {
      key: "ndisWorkerScreeningVerified",
      label: "NDIS Screening",
      verified: worker.verificationStatus?.ndisWorkerScreeningVerified,
    },
    {
      key: "onboardingComplete",
      label: "Onboarding Complete",
      verified: worker.verificationStatus?.onboardingComplete,
    },
    {
      key: "onboardingFeeReceived",
      label: "Onboarding Fee",
      verified: worker.verificationStatus?.onboardingFeeReceived,
    },
  ];

  // Helper to get available weekdays from the availability object
  const getAvailableWeekdays = (): string[] => {
    if (!worker.availability?.weekdays) return [];

    // Handle both array of objects and array of strings
    return worker.availability.weekdays
      .filter((item: WeekdayAvailability | string) => {
        if (typeof item === "string") return true;
        return item.available === true;
      })
      .map((item: WeekdayAvailability | string) => {
        if (typeof item === "string") return item;
        return item.day;
      });
  };

  const availableWeekdays = getAvailableWeekdays();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[85vh]">
        <DialogHeader>
          <DialogTitle>Support Worker Details</DialogTitle>
          <DialogDescription>
            View detailed information about this support worker
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="max-h-[65vh] pr-4">
          <div className="space-y-6">
            {/* Profile Header */}
            <div className="flex items-start gap-4">
              <Avatar className="h-16 w-16">
                <AvatarImage
                  src={worker.profileImage || undefined}
                  alt={`${worker.firstName} ${worker.lastName}`}
                />
                <AvatarFallback className="text-lg">
                  {worker.firstName?.charAt(0)}
                  {worker.lastName?.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <h3 className="text-xl font-montserrat-semibold text-gray-900">
                  {worker.firstName} {worker.lastName}
                </h3>
                <div className="flex items-center gap-2 mt-1 flex-wrap">
                  <div className="flex items-center gap-1">
                    {getStatusIcon(worker.status)}
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-montserrat-semibold ${getStatusBadgeStyle(
                        worker.status
                      )}`}
                    >
                      {worker.status}
                    </span>
                  </div>
                  {worker.isEmailVerified ? (
                    <Badge variant="outline" className="text-green-600 border-green-300">
                      <CheckCircle className="h-3 w-3 mr-1" />
                      Email Verified
                    </Badge>
                  ) : (
                    <Badge variant="outline" className="text-red-600 border-red-300">
                      <CloseCircle className="h-3 w-3 mr-1" />
                      Email Not Verified
                    </Badge>
                  )}
                </div>
                {/* Rating */}
                {worker.ratings && worker.ratings.count > 0 ? (
                  <div className="flex items-center gap-1 mt-2">
                    <Star className="h-4 w-4 text-yellow-400" />
                    <span className="font-montserrat-semibold">{worker.ratings.average.toFixed(1)}</span>
                    <span className="text-xs text-gray-500">
                      ({worker.ratings.count} reviews)
                    </span>
                  </div>
                ) : (
                  <div className="flex items-center gap-1 mt-2">
                    <Star className="h-4 w-4 text-gray-300" />
                    <span className="text-sm text-gray-400">No ratings yet</span>
                  </div>
                )}
              </div>
            </div>

            <Separator />

            {/* Contact Information */}
            <div>
              <h4 className="text-sm font-montserrat-semibold text-gray-700 mb-3 flex items-center gap-2">
                <User className="h-4 w-4" />
                Contact Information
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center gap-2 text-sm">
                  <Letter className="h-4 w-4 text-gray-400" />
                  <span className="text-gray-600">Email:</span>
                  <span className="font-montserrat-medium">{worker.email}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Phone className="h-4 w-4 text-gray-400" />
                  <span className="text-gray-600">Phone:</span>
                  <span className="font-montserrat-medium">{worker.phone || "Not provided"}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Bell className="h-4 w-4 text-gray-400" />
                  <span className="text-gray-600">Notifications:</span>
                  <span className="font-montserrat-medium capitalize">
                    {worker.notificationPreferences || "Not set"}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <UsersGroupTwoRounded className="h-4 w-4 text-gray-400" />
                  <span className="text-gray-600">Organizations:</span>
                  <span className="font-montserrat-medium">{worker.organizationCount}</span>
                </div>
              </div>
            </div>

            <Separator />

            {/* Verification Status */}
            <div>
              <h4 className="text-sm font-montserrat-semibold text-gray-700 mb-3 flex items-center gap-2">
                <Shield className="h-4 w-4" />
                Verification Status
              </h4>
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm text-gray-600">Overall Progress</span>
                  <span className="font-montserrat-semibold">
                    {verificationProgress.completed}/{verificationProgress.total} ({verificationProgress.percentage}%)
                  </span>
                </div>
                <Progress value={verificationProgress.percentage} className="h-2 mb-4" />
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {verificationItems.map((item) => (
                    <div
                      key={item.key}
                      className={`flex items-center gap-2 p-2 rounded-md ${item.verified ? "bg-green-50" : "bg-gray-100"
                        }`}
                    >
                      {item.verified ? (
                        <CheckCircle className="h-4 w-4 text-green-500" />
                      ) : (
                        <CloseCircle className="h-4 w-4 text-gray-400" />
                      )}
                      <span
                        className={`text-xs ${item.verified ? "text-green-700" : "text-gray-500"
                          }`}
                      >
                        {item.label}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <Separator />

            {/* Skills & Languages */}
            <div>
              <h4 className="text-sm font-montserrat-semibold text-gray-700 mb-3 flex items-center gap-2">
                <ClipboardText className="h-4 w-4" />
                Skills & Languages
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-gray-500 mb-2">Skills</p>
                  <div className="flex flex-wrap gap-1">
                    {worker.skills && worker.skills.length > 0 ? (
                      worker.skills.map((skill) => (
                        <Badge key={skill} variant="secondary" className="text-xs">
                          {skill}
                        </Badge>
                      ))
                    ) : (
                      <span className="text-sm text-gray-400">No skills listed</span>
                    )}
                  </div>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-2">Languages</p>
                  <div className="flex flex-wrap gap-1">
                    {worker.languages && worker.languages.length > 0 ? (
                      worker.languages.map((lang) => (
                        <Badge key={lang} variant="outline" className="text-xs">
                          <Global className="h-3 w-3 mr-1" />
                          {lang}
                        </Badge>
                      ))
                    ) : (
                      <span className="text-sm text-gray-400">No languages listed</span>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <Separator />

            {/* Service Areas & Availability */}
            <div>
              <h4 className="text-sm font-montserrat-semibold text-gray-700 mb-3 flex items-center gap-2">
                <MapPoint className="h-4 w-4" />
                Service Areas & Availability
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-gray-500 mb-2">Service Areas</p>
                  <div className="flex flex-wrap gap-1">
                    {worker.serviceAreas && worker.serviceAreas.length > 0 ? (
                      worker.serviceAreas.map((area) => (
                        <Badge key={area} variant="secondary" className="text-xs">
                          <MapPoint className="h-3 w-3 mr-1" />
                          {area}
                        </Badge>
                      ))
                    ) : (
                      <span className="text-sm text-gray-400">No service areas set</span>
                    )}
                  </div>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-2">Available Weekdays</p>
                  <div className="flex flex-wrap gap-1">
                    {availableWeekdays.length > 0 ? (
                      availableWeekdays.map((day) => (
                        <Badge key={day} variant="outline" className="text-xs">
                          {day}
                        </Badge>
                      ))
                    ) : (
                      <span className="text-sm text-gray-400">Not specified</span>
                    )}
                  </div>
                </div>
              </div>
              {worker.travelRadiusKm !== undefined && worker.travelRadiusKm !== null && (
                <div className="mt-3">
                  <p className="text-xs text-gray-500 mb-1">Travel Radius</p>
                  <Badge variant="secondary">{worker.travelRadiusKm} km</Badge>
                </div>
              )}
            </div>

            {/* Qualifications */}
            {worker.qualifications && worker.qualifications.length > 0 && (
              <>
                <Separator />
                <div>
                  <h4 className="text-sm font-montserrat-semibold text-gray-700 mb-3 flex items-center gap-2">
                    <MedalStar className="h-4 w-4" />
                    Qualifications
                  </h4>
                  <div className="space-y-2">
                    {worker.qualifications.map((qual) => (
                      <div
                        key={qual._id}
                        className="bg-gray-50 rounded-lg p-3 border border-gray-200"
                      >
                        <p className="font-montserrat-medium">{qual.title}</p>
                        <p className="text-sm text-gray-500">{qual.institution}</p>
                        <p className="text-xs text-gray-400 mt-1">
                          Obtained: {format(new Date(qual.dateObtained), "MMM yyyy")}
                          {qual.expiryDate && (
                            <> • Expires: {format(new Date(qual.expiryDate), "MMM yyyy")}</>
                          )}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}

            {/* Experience */}
            {worker.experience && worker.experience.length > 0 && (
              <>
                <Separator />
                <div>
                  <h4 className="text-sm font-montserrat-semibold text-gray-700 mb-3 flex items-center gap-2">
                    <Case className="h-4 w-4" />
                    Experience
                  </h4>
                  <div className="space-y-2">
                    {worker.experience.map((exp) => (
                      <div
                        key={exp._id}
                        className="bg-gray-50 rounded-lg p-3 border border-gray-200"
                      >
                        <p className="font-montserrat-medium">{exp.jobTitle}</p>
                        <p className="text-sm text-gray-500">{exp.organization}</p>
                        <p className="text-xs text-gray-400 mt-1">
                          {format(new Date(exp.startDate), "MMM yyyy")} -{" "}
                          {exp.endDate ? format(new Date(exp.endDate), "MMM yyyy") : "Present"}
                        </p>
                        {exp.description && (
                          <p className="text-sm text-gray-600 mt-2">{exp.description}</p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}

            <Separator />

            {/* Timestamps */}
            <div className="flex items-center justify-between text-xs text-gray-500">
              <div className="flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                <span>
                  Created: {format(new Date(worker.createdAt), "MMM dd, yyyy 'at' HH:mm")}
                </span>
              </div>
              <div className="flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                <span>
                  Updated: {format(new Date(worker.updatedAt), "MMM dd, yyyy 'at' HH:mm")}
                </span>
              </div>
            </div>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}