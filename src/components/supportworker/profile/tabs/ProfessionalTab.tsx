// src/components/profile/tabs/ProfessionalTab.tsx
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CaseRoundMinimalistic, MapPoint } from "@solar-icons/react";
import { SupportWorker } from "@/types/support-worker";
import { EmptyState, formatDate } from "../ProfileUtils";

interface Props {
  worker: SupportWorker;
  onEdit: () => void;
}

export const ProfessionalTab = ({ worker, onEdit }: Props) => {
  return (
    <div className="space-y-6">
      {/* Qualifications */}
      <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300">
        <CardContent className="p-6">
          <h3 className="text-lg font-montserrat-bold text-gray-900 mb-4 flex items-center gap-2">
            <CaseRoundMinimalistic className="w-5 h-5 text-primary" /> Qualifications
          </h3>
          {worker.qualifications?.length > 0 ? (
            <div className="space-y-3">
              {worker.qualifications.map((qual, i) => (
                <div key={i} className="p-3 rounded-lg bg-gray-50 border border-gray-200">
                  <h4 className="font-montserrat-semibold text-gray-900">{qual.title}</h4>
                  <p className="text-sm text-gray-600">Issued by: {qual.issuer}</p>
                  <p className="text-xs text-gray-500">
                    Issued: {formatDate(qual.issueDate)}
                    {qual.expiryDate && ` | Expires: ${formatDate(qual.expiryDate)}`}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <EmptyState icon={CaseRoundMinimalistic} title="No qualifications added" actionLabel="Add Qualifications" onAction={onEdit} />
          )}
        </CardContent>
      </Card>

      {/* Verification Status */}
      <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300">
        <CardContent className="p-6">
          <h3 className="text-lg font-montserrat-bold text-gray-900 mb-4">Verification Status</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Object.entries(worker.verificationStatus || {}).map(([key, value]) => (
              <div key={key} className="flex items-center justify-between p-3 rounded-lg bg-gray-50 border border-gray-200">
                <span className="text-sm font-montserrat-semibold capitalize">{key.replace(/([A-Z])/g, " $1").toLowerCase()}</span>
                <Badge className={value ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}>
                  {value ? "Verified" : "Pending"}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Service Areas */}
      <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300">
        <CardContent className="p-6">
          <h3 className="text-lg font-montserrat-bold text-gray-900 mb-4 flex items-center gap-2">
            <MapPoint className="w-5 h-5 text-primary" /> Service Information
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-3 rounded-lg bg-gray-50 border border-gray-200">
              <p className="text-xs text-gray-600 font-montserrat-semibold mb-1">Travel Radius</p>
              <p className="text-sm text-gray-900">{worker.travelRadiusKm || 0} km</p>
            </div>
            <div className="p-3 rounded-lg bg-gray-50 border border-gray-200">
              <p className="text-xs text-gray-600 font-montserrat-semibold mb-1">Service Areas</p>
              <p className="text-sm text-gray-900">{worker.serviceAreaIds?.length || 0} areas</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};