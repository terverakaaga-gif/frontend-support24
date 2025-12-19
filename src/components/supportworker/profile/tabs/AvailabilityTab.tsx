// src/components/profile/tabs/AvailabilityTab.tsx
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CalendarMark } from "@solar-icons/react";
import { SupportWorker } from "@/types/support-worker";
import { EmptyState } from "../ProfileUtils";

interface Props {
  worker: SupportWorker;
  onEdit: () => void;
}

export const AvailabilityTab = ({ worker, onEdit }: Props) => {
  return (
    <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300">
      <CardContent className="p-6">
        <h3 className="text-lg font-montserrat-bold text-gray-900 mb-4 flex items-center gap-2">
          <CalendarMark className="w-5 h-5 text-primary" /> My Availability
        </h3>
        {worker.availability?.weekdays?.length > 0 ? (
          <div className="space-y-4">
            {worker.availability.weekdays.map((day, i) => (
              <div key={i} className="p-4 rounded-lg bg-gray-50 border border-gray-200">
                <h4 className="font-montserrat-bold capitalize text-gray-900 mb-3">{day.day}</h4>
                {day.slots?.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {day.slots.map((slot, j) => (
                      <Badge key={j} className="bg-primary-100 text-primary border-0 hover:bg-primary-200 transition-colors px-4 py-2 text-sm">
                        {slot.start} - {slot.end}
                      </Badge>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-gray-600">Not available</p>
                )}
              </div>
            ))}
          </div>
        ) : (
          <EmptyState 
            icon={CalendarMark} 
            title="No availability set yet" 
            subtitle="Set your availability to start receiving shift requests"
            actionLabel="Set Availability" 
            onAction={onEdit} 
          />
        )}
      </CardContent>
    </Card>
  );
};