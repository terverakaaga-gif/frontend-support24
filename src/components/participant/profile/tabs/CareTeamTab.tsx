// src/components/profile/tabs/participant/CareTeamTab.tsx
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Shield, Buildings2, User } from "@solar-icons/react";
import { Participant } from "@/types/participant";
import { EmptyState } from "../ProfileUtils";

interface Props {
  participant: Participant;
  onEdit: () => void;
}

export const CareTeamTab = ({ participant, onEdit }: Props) => {
  return (
    <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300">
      <CardContent className="p-6 space-y-6">
        <div>
          <h3 className="text-lg font-montserrat-bold text-gray-900 mb-4 flex items-center gap-2">
            <Shield className="w-5 h-5 text-primary" /> Care Team
          </h3>

          {participant.planManager && (
            <div className="mb-6 p-4 rounded-lg bg-primary-50 border border-primary-200">
              <h4 className="font-montserrat-semibold text-gray-900 mb-2 flex items-center gap-2">
                <Buildings2 className="w-4 h-4 text-primary-600" /> Plan Manager
              </h4>
              <div className="space-y-2">
                <p className="text-sm"><span className="font-montserrat-semibold">Name:</span> {participant.planManager.name}</p>
                <p className="text-sm"><span className="font-montserrat-semibold">Email:</span> {participant.planManager.email}</p>
              </div>
            </div>
          )}

          {participant.coordinator && (
            <div className="mb-6 p-4 rounded-lg bg-green-50 border border-green-200">
              <h4 className="font-montserrat-semibold text-gray-900 mb-2 flex items-center gap-2">
                <User className="w-4 h-4 text-green-600" /> Support Coordinator
              </h4>
              <div className="space-y-2">
                <p className="text-sm"><span className="font-montserrat-semibold">Name:</span> {participant.coordinator.name}</p>
                <p className="text-sm"><span className="font-montserrat-semibold">Email:</span> {participant.coordinator.email}</p>
              </div>
            </div>
          )}

          {participant.behaviorSupportPractitioner && (
            <div className="mb-6 p-4 rounded-lg bg-primary-50 border border-primary-200">
              <h4 className="font-montserrat-semibold text-gray-900 mb-2 flex items-center gap-2">
                <User className="w-4 h-4 text-primary-600" /> Behavior Support Practitioner
              </h4>
              <div className="space-y-2">
                <p className="text-sm"><span className="font-montserrat-semibold">Name:</span> {participant.behaviorSupportPractitioner.name}</p>
                <p className="text-sm"><span className="font-montserrat-semibold">Email:</span> {participant.behaviorSupportPractitioner.email}</p>
              </div>
            </div>
          )}

          {!participant.planManager && !participant.coordinator && !participant.behaviorSupportPractitioner && (
            <EmptyState 
                icon={Shield} 
                title="No care team members specified" 
                actionLabel="Add Care Team Members" 
                onAction={onEdit} 
            />
          )}
        </div>
      </CardContent>
    </Card>
  );
};