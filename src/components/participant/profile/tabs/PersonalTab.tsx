// src/components/profile/tabs/participant/PersonalTab.tsx
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { User } from "@solar-icons/react";
import { Participant } from "@/types/participant";
import { formatDate } from "../ProfileUtils";

interface Props {
  participant: Participant;
}

export const PersonalTab = ({ participant }: Props) => {
  return (
    <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300">
      <CardContent className="p-6 space-y-6">
        <div>
          <h3 className="text-lg font-montserrat-bold text-gray-900 mb-4 flex items-center gap-2">
            <User className="w-5 h-5 text-primary" /> Personal Information
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-lg bg-gray-50 border border-gray-200 hover:bg-primary/5 transition-colors">
              <p className="text-xs text-gray-600 font-montserrat-semibold mb-1">Date of Birth</p>
              <p className="text-sm text-gray-900 font-montserrat-semibold">
                {participant.dateOfBirth ? formatDate(participant.dateOfBirth) : "Not provided"}
              </p>
            </div>

            <div className="p-4 rounded-lg bg-gray-50 border border-gray-200 hover:bg-primary/5 transition-colors">
              <p className="text-xs text-gray-600 font-montserrat-semibold mb-1">Gender</p>
              <p className="text-sm text-gray-900 font-montserrat-semibold capitalize">
                {participant.gender || "Not provided"}
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};