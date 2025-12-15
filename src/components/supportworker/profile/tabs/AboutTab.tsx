// src/components/profile/tabs/AboutTab.tsx
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { User, CaseRoundMinimalistic, Translation, DollarMinimalistic, Dollar } from "@solar-icons/react";
import { SupportWorker } from "@/types/support-worker";
import { EmptyState, formatSkill, formatDateRange } from "../ProfileUtils";

interface Props {
  worker: SupportWorker;
  onEdit: () => void;
}

export const AboutTab = ({ worker, onEdit }: Props) => {
  return (
    <div className="space-y-6">
      {/* Bio */}
      <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300">
        <CardContent className="p-6">
          <h3 className="text-lg font-montserrat-bold text-gray-900 mb-4">Bio</h3>
          {worker.bio ? (
            <p className="text-gray-700 leading-relaxed bg-gray-50 p-4 rounded-lg border border-gray-200">
              {worker.bio}
            </p>
          ) : (
            <EmptyState icon={User} title="No bio added yet" actionLabel="Add Bio" onAction={onEdit} />
          )}
        </CardContent>
      </Card>

      {/* Skills */}
      <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300">
        <CardContent className="p-6">
          <h3 className="text-lg font-montserrat-bold text-gray-900 mb-4">Skills</h3>
          {worker.skills?.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {worker.skills.map((s, i) => (
                <Badge key={i} className="bg-primary-100 text-primary border-0 hover:bg-primary-200 transition-colors px-4 py-2 text-sm">
                  {formatSkill(s.name)}
                </Badge>
              ))}
            </div>
          ) : (
            <EmptyState icon={CaseRoundMinimalistic} title="No skills added yet" actionLabel="Add Skills" onAction={onEdit} />
          )}
        </CardContent>
      </Card>

      {/* Languages & Shift Rates */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300">
          <CardContent className="p-6">
            <h3 className="text-lg font-montserrat-bold text-gray-900 mb-4 flex items-center gap-2">
              <Translation className="w-5 h-5 text-primary" /> Languages
            </h3>
            {worker.languages?.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {worker.languages.map((lang, i) => (
                  <Badge key={i} className="bg-primary-100 h-6 text-primary border-0 hover:bg-primary-200 transition-colors px-4 py-2 text-xs">
                    {lang}
                  </Badge>
                ))}
              </div>
            ) : (
              <EmptyState icon={Translation} title="No languages specified" actionLabel="Add Languages" onAction={onEdit} />
            )}
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300">
          <CardContent className="p-6">
            <h3 className="text-lg font-montserrat-bold text-gray-900 mb-4 flex items-center gap-2">
              <DollarMinimalistic className="w-5 h-5 text-primary" /> Shift Rates
            </h3>
            {worker.shiftRates?.length > 0 ? (
              <div className="space-y-2">
                {worker.shiftRates.map((rate, i) => (
                  <div key={i} className="flex justify-between items-center p-3 rounded-lg bg-gray-50 border border-gray-200">
                    <span className="text-sm text-gray-600 font-montserrat-semibold">{rate.rateTimeBandId.name}</span>
                    <span className="text-xs font-montserrat-bold bg-primary-100 rounded-full px-3 py-1 text-primary">
                      ${rate.hourlyRate}/hr
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <EmptyState icon={Dollar} title="No rates specified" actionLabel="Add Rates" onAction={onEdit} />
            )}
          </CardContent>
        </Card>
      </div>

      {/* Experience */}
      <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300">
        <CardContent className="p-6 space-y-6">
          <h3 className="text-lg font-montserrat-bold text-gray-900 mb-4">Experience</h3>
          {worker.experience?.length > 0 ? (
            <div className="space-y-4">
              {worker.experience.map((exp, i) => (
                <div key={i} className="p-4 rounded-lg bg-gray-50 border border-gray-200">
                  <h4 className="font-montserrat-bold text-gray-900 mb-1">{exp.title} at {exp.organization}</h4>
                  <span className="text-xs text-gray-600 font-montserrat-semibold">{formatDateRange(exp.startDate, exp.endDate)}</span>
                  {exp.description && <p className="mt-2 text-sm text-gray-700">{exp.description}</p>}
                </div>
              ))}
            </div>
          ) : (
            <EmptyState icon={CaseRoundMinimalistic} title="No experience added yet" actionLabel="Add Experience" onAction={onEdit} />
          )}
        </CardContent>
      </Card>
    </div>
  );
};