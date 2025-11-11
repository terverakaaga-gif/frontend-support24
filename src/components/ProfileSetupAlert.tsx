import { useState, useMemo } from "react";
import { ChevronRight } from "lucide-react";
import { Button } from "./ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { SupportWorker } from "@/types/user.types";
import { useNavigate } from "react-router-dom";

interface ProfileItem {
  label: string;
  isComplete: boolean;
  key: string;
}

export function ProfileSetupAlert() {
  const [dismissed, setDismissed] = useState(false);
  const navigate = useNavigate();
  const authData = useAuth();
  const user = authData.user as SupportWorker;

  const profileItems: ProfileItem[] = useMemo(() => {
    if (!user) return [];

    return [
      {
        label: "Add Bio",
        isComplete: !!user.bio,
        key: "bio",
      },
      {
        label: "Add skills & services",
        isComplete: user.skills && user.skills.length > 0,
        key: "skills",
      },
      {
        label: "Add work experience",
        isComplete: user.experience && user.experience.length > 0,
        key: "experience",
      },
      {
        label: "Add hourly rates",
        isComplete: user.shiftRates && user.shiftRates.length > 0,
        key: "shiftRates",
      },
      {
        label: "Add availability",
        isComplete:
          user.availability?.weekdays && user.availability.weekdays.length > 0,
        key: "availability",
      },
      {
        label: "Add compliance check",
        isComplete:
          user.verificationStatus?.identityVerified &&
          user.verificationStatus?.policeCheckVerified &&
          user.verificationStatus?.ndisWorkerScreeningVerified,
        key: "compliance",
      },
    ];
  }, [user]);

  const { completedCount, completionPercentage } = useMemo(() => {
    const completed = profileItems.filter((item) => item.isComplete).length;
    const percentage = Math.round((completed / profileItems.length) * 100);
    return { completedCount: completed, completionPercentage: percentage };
  }, [profileItems]);

  const incompleteCount = profileItems.length - completedCount;

  if (dismissed || !user) {
    return null;
  }

  // Don't show if profile is complete
  if (completionPercentage === 100) {
    return null;
  }

  return (
    <div className="w-full max-w-7xl mx-auto p-4 space-y-4 fixed z-50 top-4 left-1/2 transform -translate-x-1/2">
      {/* white overlay */}
      <div className="fixed left-0 inset-0 bg-white z-0 w-screen min-h-screen backdrop:blur"></div>
      <div className="relative z-10 space-y-4 w-auto rounded-xl shadow-lg p-4 bg-gray-100">
        {/* Top Banner */}
        <div className="bg-primary/10 border border-primary-100 rounded-lg p-4 md:p-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex-1">
            <h2 className="text-gray-900 font-semibold text-base md:text-lg mb-1">
              Complete Your Support Worker Profile to Get Started
            </h2>
            <p className="text-gray-600 text-sm md:text-base">
              Provide your details and required documents to begin working under
              NDIS
            </p>
          </div>
          <Button
            onClick={() => navigate("/support-worker-setup")}
            className="bg-primary-600 hover:bg-primary-700 text-white font-montserrat-semibold px-6 py-2.5 rounded-lg flex items-center justify-center gap-2 whitespace-nowrap transition-colors"
          >
            Setup Profile
            <ChevronRight className="w-5 h-5" />
          </Button>
        </div>

        {/* Profile Completion Card */}
        <div className="bg-white border border-gray-200 rounded-lg p-4 md:p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-gray-900 font-semibold text-base md:text-lg">
              Complete Profile{" "}
              <span className="text-gray-500 font-normal">
                {completionPercentage}%
              </span>
            </h3>
            {incompleteCount > 0 && (
              <div className="bg-red-500 text-white text-sm font-semibold rounded-full w-7 h-7 flex items-center justify-center">
                {incompleteCount}
              </div>
            )}
          </div>

          <div className="space-y-3">
            {profileItems.map((item, index) => (
              <div
                key={index}
                className="flex items-center justify-between py-3 border-b border-gray-100 last:border-b-0 hover:bg-gray-50 -mx-2 px-2 rounded transition-colors cursor-pointer group"
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-5 h-5 rounded-full border-2 flex-shrink-0 flex items-center justify-center ${
                      item.isComplete
                        ? "bg-green-500 border-green-500"
                        : "border-gray-300"
                    }`}
                  >
                    {item.isComplete && (
                      <svg
                        className="w-3 h-3 text-white"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={3}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    )}
                  </div>
                  <span
                    className={`text-sm md:text-base ${
                      item.isComplete
                        ? "text-gray-500 line-through"
                        : "text-gray-700"
                    }`}
                  >
                    {item.label}
                  </span>
                </div>
                <ChevronRight className="w-5 h-5 text-primary-600 flex-shrink-0 group-hover:translate-x-1 transition-transform" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
