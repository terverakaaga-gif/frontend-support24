// src/components/profile/tabs/participant/PreferencesTab.tsx
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star } from "@solar-icons/react";
import { Participant } from "@/types/participant";

interface Props {
  participant: Participant;
}

export const PreferencesTab = ({ participant }: Props) => {
  return (
    <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300">
      <CardContent className="p-6 space-y-6">
        <div>
          <h3 className="text-lg font-montserrat-bold text-gray-900 mb-4 flex items-center gap-2">
            <Star className="w-5 h-5 text-primary" /> Preferences
          </h3>

          <div className="space-y-4">
            {/* Preferred Languages */}
            <div className="p-4 rounded-lg bg-gray-50 border border-gray-200">
              <h4 className="font-montserrat-semibold text-gray-900 mb-2">Preferred Languages</h4>
              {participant.preferredLanguages && participant.preferredLanguages.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {participant.preferredLanguages.map((lang, index) => (
                    <Badge key={index} className="bg-primary-100 text-primary border-0">{lang}</Badge>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-600">No preferred languages specified</p>
              )}
            </div>

            {/* Preferred Genders */}
            <div className="p-4 rounded-lg bg-gray-50 border border-gray-200">
              <h4 className="font-montserrat-semibold text-gray-900 mb-2">Preferred Worker Gender</h4>
              {participant.preferredGenders && participant.preferredGenders.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {participant.preferredGenders.map((gender, index) => (
                    <Badge key={index} className="bg-primary-100 text-primary border-0">{gender}</Badge>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-600">No gender preference specified</p>
              )}
            </div>

            {/* Notification Preferences */}
            <div className="p-4 rounded-lg bg-gray-50 border border-gray-200">
              <h4 className="font-montserrat-semibold text-gray-900 mb-2">Notification Preferences</h4>
              <p className="text-sm text-gray-900 capitalize">{participant.notificationPreferences || "Email"}</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};