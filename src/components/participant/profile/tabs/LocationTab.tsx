// src/components/profile/tabs/participant/LocationTab.tsx
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { MapPoint, Home } from "@solar-icons/react";
import { Participant } from "@/types/participant";
import { EmptyState } from "../ProfileUtils";

interface Props {
  participant: Participant;
  onEdit: () => void;
}

export const LocationTab = ({ participant, onEdit }: Props) => {
  return (
    <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300">
      <CardContent className="p-6">
        <h3 className="text-lg font-montserrat-bold text-gray-900 mb-4 flex items-center gap-2">
          <MapPoint className="w-5 h-5 text-primary" /> Address (Residential)
        </h3>

        {participant.address ? (
          <div className="p-4 rounded-lg bg-gray-50 border border-gray-200">
            <div className="space-y-2 text-sm text-gray-900">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center flex-shrink-0">
                  <Home className="w-5 h-5 text-primary" />
                </div>
                <div className="flex-1">
                  <p className="font-montserrat-semibold text-gray-900">{participant.address}</p>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <EmptyState 
            icon={MapPoint} 
            title="No address specified" 
            actionLabel="Add Address" 
            onAction={onEdit} 
          />
        )}
      </CardContent>
    </Card>
  );
};