// src/components/profile/tabs/participant/SupportTab.tsx
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { UserHeart } from "@solar-icons/react";
import { Participant } from "@/types/participant";
import { EmptyState } from "../ProfileUtils";

interface Props {
  participant: Participant;
  onEdit: () => void;
}

export const SupportTab = ({ participant, onEdit }: Props) => {
  return (
    <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300">
      <CardContent className="p-6 space-y-6">
        <div>
          <h3 className="text-lg font-montserrat-bold text-gray-900 mb-4 flex items-center gap-2">
            <UserHeart className="w-5 h-5 text-primary" /> Support Needs
          </h3>
          {participant.supportNeeds && participant.supportNeeds.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {participant.supportNeeds.map((need, index) => (
                <Badge
                  key={index}
                  className="bg-primary-100 h-6 text-primary border-0 hover:bg-primary-200 transition-colors px-4 py-2 text-xs"
                >
                  {need.name}
                </Badge>
              ))}
            </div>
          ) : (
            <EmptyState 
                icon={UserHeart} 
                title="No support needs specified" 
                actionLabel="Add Support Needs" 
                onAction={onEdit} 
            />
          )}
        </div>
      </CardContent>
    </Card>
  );
};