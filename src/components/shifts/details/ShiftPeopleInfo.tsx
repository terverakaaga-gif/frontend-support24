import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { UserInfo } from "@/types/shift-details";

interface Props {
  participant?: UserInfo | null;
  workers: Array<{ user: UserInfo | null; status: string; id: string }>;
  isMultiWorker: boolean;
  currentUserId?: string;
  getStatusBadgeStyle: (status: string) => string;
  getStatusLabel: (status: string) => string;
}

export const ShiftPeopleInfo = React.memo(
  ({
    participant,
    workers,
    isMultiWorker,
    currentUserId,
    getStatusBadgeStyle,
    getStatusLabel,
  }: Props) => {
    return (
      <div className="space-y-4">
        {/* Participant */}
        {participant && (
          <div className="bg-white shadow-sm border border-gray-200 rounded-lg p-3 sm:p-4">
            <h3 className="text-sm font-montserrat-semibold text-gray-900 mb-3">
              Participant
            </h3>
            <div className="flex items-center gap-3">
              <Avatar>
                <AvatarImage
                  src={participant.profileImage}
                  className="w-10 h-10 rounded-full object-cover"
                />
                <AvatarFallback className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center text-primary-700 font-montserrat-semibold">
                  {participant.firstName?.[0]}
                  {participant.lastName?.[0]}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <p className="font-montserrat-semibold text-gray-900">
                  {participant.firstName} {participant.lastName}
                </p>
                <p className="text-xs text-gray-600">{participant.email}</p>
              </div>
            </div>
          </div>
        )}

        {/* Workers */}
        {workers.length > 0 && (
          <div className="bg-white shadow-sm border border-gray-200 rounded-lg p-3 sm:p-4">
            <h3 className="text-sm font-montserrat-semibold text-gray-900 mb-3">
              {isMultiWorker ? "Assigned Workers" : "Support Worker"}
            </h3>
            <div className="space-y-3">
              {workers.map((worker) => (
                <div
                  key={worker.id}
                  className="flex items-center gap-3 p-2 rounded-lg bg-gray-50"
                >
                  {worker.user ? (
                    <>
                      <Avatar>
                        <AvatarImage
                          src={worker.user.profileImage}
                          className="w-10 h-10 rounded-full object-cover"
                        />
                        <AvatarFallback className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center text-primary-700 font-montserrat-semibold">
                          {worker.user.firstName?.[0]}
                          {worker.user.lastName?.[0]}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <p className="font-montserrat-semibold text-gray-900 text-sm">
                          {worker.user.firstName} {worker.user.lastName}
                          {worker.id === currentUserId && (
                            <span className="ml-2 text-xs text-primary-600">
                              (You)
                            </span>
                          )}
                        </p>
                        <p className="text-xs text-gray-600">
                          {worker.user.email}
                        </p>
                      </div>
                      <Badge className={getStatusBadgeStyle(worker.status)}>
                        {getStatusLabel(worker.status)}
                      </Badge>
                    </>
                  ) : (
                    <div className="flex-1">
                      <p className="text-sm text-gray-600">
                        Worker ID: {worker.id}
                      </p>
                      <Badge className={getStatusBadgeStyle(worker.status)}>
                        {getStatusLabel(worker.status)}
                      </Badge>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }
);
