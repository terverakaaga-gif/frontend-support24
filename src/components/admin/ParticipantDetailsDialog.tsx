import { format } from "date-fns";
import {
  CheckCircle,
  CloseCircle,
  Letter,
  Phone,
  Calendar,
  UsersGroupTwoRounded,
  User,
  Buildings,
  ShieldUser,
  Bell,
  Crown,
  ClipboardText,
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
import { Participant } from "@/entities/Participant";

interface ParticipantDetailsDialogProps {
  participant: Participant | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function ParticipantDetailsDialog({
  participant,
  open,
  onOpenChange,
}: ParticipantDetailsDialogProps) {
  if (!participant) return null;

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

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[85vh]">
        <DialogHeader>
          <DialogTitle>Participant Details</DialogTitle>
          <DialogDescription>
            View detailed information about this participant
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="max-h-[65vh] pr-4">
          <div className="space-y-6">
            {/* Profile Header */}
            <div className="flex items-start gap-4">
              <Avatar className="h-16 w-16">
                <AvatarImage
                  src={participant.profileImage || undefined}
                  alt={`${participant.firstName} ${participant.lastName}`}
                />
                <AvatarFallback className="text-lg">
                  {participant.firstName?.charAt(0)}
                  {participant.lastName?.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <h3 className="text-xl font-montserrat-semibold text-gray-900">
                  {participant.firstName} {participant.lastName}
                </h3>
                <div className="flex items-center gap-2 mt-1">
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-montserrat-semibold ${getStatusBadgeStyle(
                      participant.status
                    )}`}
                  >
                    {participant.status}
                  </span>
                  {participant.isEmailVerified ? (
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
                  <span className="font-montserrat-medium">{participant.email}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Phone className="h-4 w-4 text-gray-400" />
                  <span className="text-gray-600">Phone:</span>
                  <span className="font-montserrat-medium">{participant.phone || "Not provided"}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Bell className="h-4 w-4 text-gray-400" />
                  <span className="text-gray-600">Notifications:</span>
                  <span className="font-montserrat-medium capitalize">
                    {participant.notificationPreferences || "Not set"}
                  </span>
                </div>
              </div>
            </div>

            <Separator />

            {/* Subscription Details */}
            <div>
              <h4 className="text-sm font-montserrat-semibold text-gray-700 mb-3 flex items-center gap-2">
                <Crown className="h-4 w-4" />
                Subscription Details
              </h4>
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <p className="text-xs text-gray-500">Tier</p>
                    <p className="font-montserrat-semibold capitalize">
                      {participant.subscription?.tier || "None"}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Status</p>
                    <Badge
                      variant={participant.subscription?.isActive ? "default" : "secondary"}
                    >
                      {participant.subscription?.isActive ? "Active" : "Inactive"}
                    </Badge>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Auto Renew</p>
                    <p className="font-montserrat-medium">
                      {participant.subscription?.autoRenew ? "Yes" : "No"}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Start Date</p>
                    <p className="font-montserrat-medium text-sm">
                      {participant.subscription?.startDate
                        ? format(new Date(participant.subscription.startDate), "MMM dd, yyyy")
                        : "N/A"}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <Separator />

            {/* Preferences */}
            <div>
              <h4 className="text-sm font-montserrat-semibold text-gray-700 mb-3 flex items-center gap-2">
                <ClipboardText className="h-4 w-4" />
                Preferences & Requirements
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-gray-500 mb-1">Preferred Languages</p>
                  <div className="flex flex-wrap gap-1">
                    {participant.preferredLanguages?.length > 0 ? (
                      participant.preferredLanguages.map((lang) => (
                        <Badge key={lang} variant="secondary" className="text-xs">
                          {lang}
                        </Badge>
                      ))
                    ) : (
                      <span className="text-sm text-gray-400">Not specified</span>
                    )}
                  </div>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">Preferred Genders</p>
                  <div className="flex flex-wrap gap-1">
                    {participant.preferredGenders?.length > 0 ? (
                      participant.preferredGenders.map((gender) => (
                        <Badge key={gender} variant="secondary" className="text-xs">
                          {gender}
                        </Badge>
                      ))
                    ) : (
                      <span className="text-sm text-gray-400">No preference</span>
                    )}
                  </div>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">Support Needs</p>
                  <div className="flex flex-wrap gap-1">
                    {participant.supportNeeds?.length > 0 ? (
                      participant.supportNeeds.map((need) => (
                        <Badge key={need} variant="outline" className="text-xs">
                          {need}
                        </Badge>
                      ))
                    ) : (
                      <span className="text-sm text-gray-400">None specified</span>
                    )}
                  </div>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">Requires Supervision</p>
                  <Badge variant={participant.requiresSupervision ? "destructive" : "secondary"}>
                    {participant.requiresSupervision ? "Yes" : "No"}
                  </Badge>
                </div>
              </div>
            </div>

            <Separator />

            {/* Organizations */}
            <div>
              <h4 className="text-sm font-montserrat-semibold text-gray-700 mb-3 flex items-center gap-2">
                <Buildings className="h-4 w-4" />
                Organizations ({participant.organizationCount})
              </h4>
              {participant.organization?.length > 0 ? (
                <div className="space-y-3">
                  {participant.organization.map((org) => (
                    <div
                      key={org._id}
                      className="bg-gray-50 rounded-lg p-4 border border-gray-200"
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <h5 className="font-montserrat-semibold text-gray-900">{org.name}</h5>
                          <p className="text-sm text-gray-500">{org.description}</p>
                        </div>
                        <Badge variant="outline">
                          <UsersGroupTwoRounded className="h-3 w-3 mr-1" />
                          {org.workers?.length || 0} workers
                        </Badge>
                      </div>
                      <div className="mt-3 flex items-center gap-4 text-xs text-gray-500">
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          Created: {format(new Date(org.createdAt), "MMM dd, yyyy")}
                        </span>
                        {org.pendingInvites?.length > 0 && (
                          <Badge variant="secondary" className="text-xs">
                            {org.pendingInvites.length} pending invites
                          </Badge>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-6 bg-gray-50 rounded-lg">
                  <Buildings className="h-8 w-8 text-gray-300 mx-auto mb-2" />
                  <p className="text-sm text-gray-500">No organizations</p>
                </div>
              )}
            </div>

            {/* Guardians */}
            {participant.guardian?.length > 0 && (
              <>
                <Separator />
                <div>
                  <h4 className="text-sm font-montserrat-semibold text-gray-700 mb-3 flex items-center gap-2">
                    <ShieldUser className="h-4 w-4" />
                    Guardians
                  </h4>
                  <div className="space-y-2">
                    {participant.guardian.map((guard, index) => (
                      <div
                        key={index}
                        className="bg-gray-50 rounded-lg p-3 border border-gray-200"
                      >
                        <p className="font-montserrat-medium">{guard.name || "Guardian"}</p>
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
                  Created: {format(new Date(participant.createdAt), "MMM dd, yyyy 'at' HH:mm")}
                </span>
              </div>
              <div className="flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                <span>
                  Updated: {format(new Date(participant.updatedAt), "MMM dd, yyyy 'at' HH:mm")}
                </span>
              </div>
            </div>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}