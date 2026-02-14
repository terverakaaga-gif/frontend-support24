/**
 * RecommendationModal Component
 * 
 * Modal displaying candidate recommendation details with verification checklist
 * and action buttons for assignment, offer, or viewing full profile.
 */

import { useState } from "react";
import { CheckCircle } from "@solar-icons/react";
import { cn } from "@/lib/design-utils";
import { CloseIcon } from "../icons";

interface Candidate {
  id: string;
  name: string;
  role: string;
  rating: number;
  avatar?: string;
  initials: string;
}

interface RecommendationModalProps {
  isOpen: boolean;
  candidate: Candidate | null;
  onClose: () => void;
  onAutoAssign?: (candidateId: string) => void;
  onSendOffer?: (candidateId: string) => void;
  onViewProfile?: (candidateId: string) => void;
}

export function RecommendationModal({
  isOpen,
  candidate,
  onClose,
  onAutoAssign,
  onSendOffer,
  onViewProfile,
}: RecommendationModalProps) {
  const [offerSent, setOfferSent] = useState(false);

  if (!isOpen || !candidate) return null;

  const handleSendOffer = () => {
    setOfferSent(true);
    onSendOffer?.(candidate.id);
    // Auto-reset after 2 seconds for UX
    setTimeout(() => setOfferSent(false), 2000);
  };

  const checklist = [
    { label: "Certificates Current", status: true },
    { label: "Previously Worked", status: true },
    { label: "Available Now", status: true },
  ];

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-md w-full max-h-[90vh] overflow-y-auto animate-in zoom-in-95">
        {/* Header with Close Button */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <h3 className="text-lg font-montserrat-bold text-gray-900">
            Recommendation Details
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Candidate Info Card */}
          <div className="bg-gradient-to-br from-primary-50 to-primary-100 rounded-lg p-4 border border-primary-200">
            <div className="flex items-start gap-4">
              <div className="w-14 h-14 rounded-full bg-primary-600 flex items-center justify-center text-white font-montserrat-bold text-lg flex-shrink-0">
                {candidate.initials}
              </div>
              <div className="flex-1">
                <h4 className="text-base font-montserrat-bold text-gray-900">
                  {candidate.name}
                </h4>
                <p className="text-sm text-gray-600 font-montserrat-medium">
                  {candidate.role}
                </p>
                <div className="flex items-center gap-1 mt-2">
                  <span className="text-sm font-montserrat-semibold text-gray-700">
                    ★ {candidate.rating}
                  </span>
                  <span className="text-xs text-gray-500">(Based on reviews)</span>
                </div>
              </div>
            </div>
          </div>

          {/* Verification Checklist */}
          <div className="space-y-3">
            <h4 className="text-sm font-montserrat-bold text-gray-900">
              Verification Status
            </h4>
            <div className="space-y-2">
              {checklist.map((item, index) => (
                <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  {item.status ? (
                    <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                  ) : (
                <CloseIcon className="w-5 h-5 text-red-600 flex-shrink-0" />
                  )}
                  <span
                    className={cn(
                      "text-sm font-montserrat-medium",
                      item.status ? "text-green-700" : "text-red-700"
                    )}
                  >
                    {item.label}
                  </span>
                  <span
                    className={cn(
                      "ml-auto text-xs font-montserrat-semibold px-2 py-1 rounded",
                      item.status
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    )}
                  >
                    {item.status ? "✓ Good" : "✗ Flag"}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Match Score */}
          <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
            <div className="flex items-center justify-between">
              <span className="text-sm font-montserrat-semibold text-gray-700">
                Overall Match Score
              </span>
              <span className="text-2xl font-montserrat-bold text-blue-600">92%</span>
            </div>
            <div className="w-full bg-blue-200 rounded-full h-2 mt-3 overflow-hidden">
              <div className="bg-blue-600 h-full" style={{ width: "92%" }}></div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3 pt-4 border-t border-gray-200">
            <button
              onClick={() => {
                onAutoAssign?.(candidate.id);
                onClose();
              }}
              className="w-full px-4 py-2.5 bg-primary-600 text-white rounded-lg text-sm font-montserrat-semibold hover:bg-primary-700 transition-colors"
            >
              Auto Assign
            </button>

            <button
              onClick={handleSendOffer}
              disabled={offerSent}
              className={cn(
                "w-full px-4 py-2.5 rounded-lg text-sm font-montserrat-semibold transition-colors",
                offerSent
                  ? "bg-green-100 text-green-700 border border-green-200"
                  : "bg-orange-50 text-orange-700 border border-orange-200 hover:bg-orange-100"
              )}
            >
              {offerSent ? "Offer Sent ✓" : "Send Offer"}
            </button>

            <button
              onClick={() => {
                onViewProfile?.(candidate.id);
                onClose();
              }}
              className="w-full px-4 py-2.5 border border-gray-300 text-gray-700 rounded-lg text-sm font-montserrat-semibold hover:bg-gray-50 transition-colors"
            >
              View Profile
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
