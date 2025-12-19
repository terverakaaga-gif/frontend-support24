import React from "react";
import { format, parseISO } from "date-fns";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { UsersGroupTwoRounded, Letter } from "@solar-icons/react";
import { Worker, PendingInvite } from "@/types/organization.types";
import { getWorkerDisplayName, getWorkerEmail, getWorkerInitials, getWorkerProfileImage } from "@/lib/utils";

// --- Active Workers List ---
interface ActiveWorkersListProps {
  workers: Worker[];
  onSelect: (worker: Worker) => void;
}

export const ActiveWorkersList = ({ workers, onSelect }: ActiveWorkersListProps) => {
  if (workers.length === 0) {
    return (
      <Card className="border-0 shadow-sm">
        <CardContent className="p-4 md:p-12 text-center">
          <UsersGroupTwoRounded className="w-10 h-10 md:w-16 md:h-16 text-gray-300 mx-auto mb-3 md:mb-4" />
          <h3 className="text-sm md:text-xl font-montserrat-semibold text-gray-900 mb-2">No workers found</h3>
          <p className="text-xs md:text-base text-gray-600">This organization doesn't have any active workers yet</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-2 md:space-y-3">
      {workers.map((worker) => (
        <Card
          key={worker._id}
          className="border-0 shadow-sm hover:shadow-md transition-all cursor-pointer"
          onClick={() => onSelect(worker)}
        >
          <CardContent className="p-3 md:p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 md:gap-3 flex-1 min-w-0">
                <Avatar className="w-8 h-8 md:w-12 md:h-12 flex-shrink-0">
                  {getWorkerProfileImage(worker.workerId) ? (
                    <AvatarImage src={getWorkerProfileImage(worker.workerId)} />
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
                    <Badge className="bg-green-50 text-green-600 text-xs px-1 md:px-2 py-0 h-4 md:h-5">Active</Badge>
                  </div>
                  <p className="text-xs md:text-sm text-gray-600 truncate">{getWorkerEmail(worker.workerId)}</p>
                  <p className="text-xs text-gray-500">Joined: {format(parseISO(worker.joinedDate), "dd/MM/yyyy")}</p>
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
  );
};

// --- Pending Invites List ---
interface PendingInvitesListProps {
  invites: PendingInvite[];
}

export const PendingInvitesList = ({ invites }: PendingInvitesListProps) => {
  if (invites.length === 0) {
    return (
      <Card className="border-0 shadow-sm">
        <CardContent className="p-4 md:p-12 text-center">
          <Letter className="w-10 h-10 md:w-16 md:h-16 text-gray-300 mx-auto mb-3 md:mb-4" />
          <h3 className="text-sm md:text-xl font-montserrat-semibold text-gray-900 mb-2">No pending invites</h3>
          <p className="text-xs md:text-base text-gray-600">There are no pending invitations for this organization.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-2 md:space-y-3">
      {invites.map((invite) => (
        <Card key={invite._id} className="border-0 shadow-sm hover:shadow-md transition-all">
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
                    <Badge className="bg-orange-50 text-orange-600 text-xs px-1 md:px-2 py-0 h-4 md:h-5">Pending</Badge>
                  </div>
                  <p className="text-xs md:text-sm text-gray-600 truncate">{getWorkerEmail(invite.workerId)}</p>
                  <p className="text-xs text-gray-500">Invited: {format(parseISO(invite.inviteDate), "dd/MM/yyyy")}</p>
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
                  <span className="font-montserrat-semibold">Notes:</span> {invite.notes}
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
};