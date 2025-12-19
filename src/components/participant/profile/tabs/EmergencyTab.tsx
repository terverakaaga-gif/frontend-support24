// src/components/profile/tabs/participant/EmergencyTab.tsx
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { DangerCircle } from "@solar-icons/react";
import { Participant } from "@/types/participant";
import { EmptyState } from "../ProfileUtils";

interface Props {
  participant: Participant;
  onEdit: () => void;
}

export const EmergencyTab = ({ participant, onEdit }: Props) => {
  return (
    <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300">
      <CardContent className="p-6">
        <h3 className="text-lg font-montserrat-bold text-gray-900 mb-4 flex items-center gap-2">
          <DangerCircle className="w-5 h-5 text-primary" /> Emergency Contact
        </h3>

        {participant.emergencyContact ? (
          <div className="bg-primary-50 rounded-lg p-6 border-2 border-primary-100">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-3 rounded-lg bg-white border border-primary-100">
                <p className="text-xs text-primary-600 font-montserrat-semibold mb-1">Name</p>
                <p className="text-sm text-gray-900 font-montserrat-semibold">{participant.emergencyContact.name}</p>
              </div>
              <div className="p-3 rounded-lg bg-white border border-primary-100">
                <p className="text-xs text-primary-600 font-montserrat-semibold mb-1">Relationship</p>
                <p className="text-sm text-gray-900 font-montserrat-semibold">{participant.emergencyContact.relationship}</p>
              </div>
              <div className="p-3 rounded-lg bg-white border border-primary-100">
                <p className="text-xs text-primary-600 font-montserrat-semibold mb-1">Phone</p>
                <p className="text-sm text-gray-900 font-montserrat-semibold">{participant.emergencyContact.phone}</p>
              </div>
            </div>
          </div>
        ) : (
          <EmptyState 
            icon={DangerCircle} 
            title="No emergency contact specified" 
            actionLabel="Add Emergency Contact" 
            onAction={onEdit} 
          />
        )}
      </CardContent>
    </Card>
  );
};