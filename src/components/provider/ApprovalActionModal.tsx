import {
  CheckCircle,
  CloseCircle,
  DownloadMinimalistic,
} from "@solar-icons/react";
import { useState } from "react";

// Types
export type EntityType =
  | "job-application"
  | "event-participant"
  | "accommodation-interest";
export type ActionType = "accept" | "reject";

interface BaseEntity {
  id: number | string;
  name: string;
  email: string;
  avatar?: string | null;
  location?: string;
  phone?: string;
}

interface JobApplicant extends BaseEntity {
  experience?: string;
  skills?: string;
  availability?: string;
  complianceStatus?: Array<{ label: string; valid: boolean; date?: string }>;
  attachments?: Array<{ name: string; size: string; url: string }>;
}

interface EventParticipant extends BaseEntity {
  reason?: string;
}

interface AccommodationInterest extends BaseEntity {
  ndisNumber?: string;
  reasonForEnquiry?: string;
  message?: string;
  attachments?: Array<{ name: string; size: string; url: string }>;
}

export type EntityData = JobApplicant | EventParticipant | AccommodationInterest;

interface ApprovalActionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (data: { entityId: number | string; reason?: string }) => void;
  entity: EntityData | null;
  entityType: EntityType;
  actionType: ActionType;
  isLoading?: boolean;
  contextTitle?: string;
}

export function ApprovalActionModal({
  isOpen,
  onClose,
  onConfirm,
  entity,
  entityType,
  actionType,
  isLoading = false,
  contextTitle,
}: ApprovalActionModalProps) {
  const [reason, setReason] = useState("");

  if (!isOpen || !entity) return null;

  const isAccept = actionType === "accept";

  const handleConfirm = () => {
    onConfirm({
      entityId: entity.id,
      reason: reason.trim() || undefined,
    });
  };

  const handleReject = () => {
    onConfirm({
      entityId: entity.id,
      reason: reason.trim() || undefined,
    });
  };

  const handleClose = () => {
    if (!isLoading) {
      setReason("");
      onClose();
    }
  };

  // Get title based on entity type
  const getTitle = () => {
    switch (entityType) {
      case "job-application":
        return "Job Application";
      case "event-participant":
        return "Event Registration";
      case "accommodation-interest":
        return "Accommodation Enquiry";
      default:
        return "Application";
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
      <div className="bg-white rounded-2xl shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Header with Avatar - Only for Job Applications */}
        {entityType === "job-application" && (
          <div className="relative flex flex-col items-center pt-8 pb-6 px-6 border-b border-gray-100">
            <button
              onClick={handleClose}
              disabled={isLoading}
              className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
            >
              <CloseCircle className="h-5 w-5 text-gray-600" />
            </button>

            <div className="relative mb-3">
              <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center text-2xl font-montserrat-bold text-gray-700 border-4 border-white shadow-md">
                {entity.avatar ? (
                  <img
                    src={entity.avatar}
                    alt={entity.name}
                    className="w-full h-full rounded-full object-cover"
                  />
                ) : (
                  entity.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")
                    .toUpperCase()
                    .slice(0, 2)
                )}
              </div>
              <div className="absolute -bottom-1 -right-1 w-7 h-7 bg-primary-600 rounded-full flex items-center justify-center border-2 border-white">
                <CheckCircle className="h-4 w-4 text-white fill-current" />
              </div>
            </div>

            <h2 className="text-xl font-montserrat-bold text-gray-900 mb-1">
              {entity.name}
            </h2>
            <p className="text-sm text-gray-500">Support Worker</p>
            <div className="flex items-center gap-3 mt-2 text-xs text-gray-500 flex-wrap justify-center">
              <span>{entity.email}</span>
              {entity.phone && (
                <>
                  <span>•</span>
                  <span>{entity.phone}</span>
                </>
              )}
              {entity.location && (
                <>
                  <span>•</span>
                  <span>{entity.location}</span>
                </>
              )}
            </div>
          </div>
        )}

        {/* Simple Header for Events and Accommodation */}
        {entityType !== "job-application" && (
          <div className="relative flex items-center justify-between p-6 border-b border-gray-100">
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">
                {getTitle()}
              </p>
              <h2 className="text-xl font-montserrat-bold text-gray-900">{entity.name}</h2>
            </div>
            <button
              onClick={handleClose}
              disabled={isLoading}
              className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
            >
              <CloseCircle className="h-5 w-5 text-gray-600" />
            </button>
          </div>
        )}

        {/* Context Title */}
        {contextTitle && (
          <div className="px-6 pt-4">
            <div className="px-3 py-2 bg-gray-50 rounded-lg">
              <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">
                {entityType === "job-application"
                  ? "Position"
                  : entityType === "event-participant"
                  ? "Event"
                  : "Property"}
              </p>
              <p className="text-sm font-montserrat-semibold text-gray-900">
                {contextTitle}
              </p>
            </div>
          </div>
        )}

        <div className="p-6 space-y-4">
          {/* Job Application Content */}
          {entityType === "job-application" && (
            <>
              {/* Compliance Status */}
              {(entity as JobApplicant).complianceStatus && (
                <div>
                  <h3 className="text-base font-montserrat-bold text-gray-900 mb-3">
                    Compliance Status
                  </h3>
                  <ul className="space-y-2">
                    {(entity as JobApplicant).complianceStatus?.map(
                      (status, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <div className="mt-0.5">
                            <div
                              className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 ${
                                status.valid ? "bg-green-500" : "bg-red-500"
                              }`}
                            >
                              <CheckCircle className="h-3 w-3 text-white" />
                            </div>
                          </div>
                          <span className="text-sm text-gray-700">
                            {status.label}
                          </span>
                        </li>
                      )
                    )}
                  </ul>
                </div>
              )}

              {/* Attachments */}
              {(entity as JobApplicant).attachments &&
                (entity as JobApplicant).attachments!.length > 0 && (
                  <div>
                    <h3 className="text-base font-montserrat-bold text-gray-900 mb-3">
                      Attachments
                    </h3>
                    <div className="space-y-2">
                      {(entity as JobApplicant).attachments?.map(
                        (file, index) => (
                          <div
                            key={index}
                            className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200"
                          >
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                                <svg
                                  className="w-6 h-6 text-red-500"
                                  viewBox="0 0 24 24"
                                  fill="currentColor"
                                >
                                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6z" />
                                </svg>
                              </div>
                              <div>
                                <p className="text-sm font-montserrat-semibold text-gray-900">
                                  {file.name}
                                </p>
                                <p className="text-xs text-gray-500">
                                  {file.size}
                                </p>
                              </div>
                            </div>
                            <a
                              href={file.url}
                              download
                              className="text-gray-400 hover:text-gray-600"
                            >
                              <DownloadMinimalistic className="h-5 w-5" />
                            </a>
                          </div>
                        )
                      )}
                    </div>
                  </div>
                )}
            </>
          )}

          {/* Event Participant Content */}
          {entityType === "event-participant" && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <h3 className="text-sm font-montserrat-bold text-gray-900 mb-1">Email</h3>
                  <p className="text-sm text-gray-700">{entity.email}</p>
                </div>
                <div>
                  <h3 className="text-sm font-montserrat-bold text-gray-900 mb-1">
                    Phone Number
                  </h3>
                  <p className="text-sm text-gray-700">
                    {entity.phone || "Not provided"}
                  </p>
                </div>
              </div>
              <div>
                <h3 className="text-sm font-montserrat-bold text-gray-900 mb-1">
                  Location
                </h3>
                <p className="text-sm text-gray-700">
                  {entity.location || "Not provided"}
                </p>
              </div>
              {(entity as EventParticipant).reason && (
                <div>
                  <h3 className="text-sm font-montserrat-bold text-gray-900 mb-1">
                    Reason for Attending
                  </h3>
                  <p className="text-sm text-gray-700 bg-gray-50 p-3 rounded-lg">
                    {(entity as EventParticipant).reason}
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Accommodation Interest Content */}
          {entityType === "accommodation-interest" && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <h3 className="text-sm font-montserrat-bold text-gray-900 mb-1">Email</h3>
                  <p className="text-sm text-gray-700">{entity.email}</p>
                </div>
                <div>
                  <h3 className="text-sm font-montserrat-bold text-gray-900 mb-1">
                    Phone Number
                  </h3>
                  <p className="text-sm text-gray-700">
                    {entity.phone || "Not provided"}
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <h3 className="text-sm font-montserrat-bold text-gray-900 mb-1">
                    Location
                  </h3>
                  <p className="text-sm text-gray-700">
                    {entity.location || "Not provided"}
                  </p>
                </div>
                {(entity as AccommodationInterest).ndisNumber && (
                  <div>
                    <h3 className="text-sm font-montserrat-bold text-gray-900 mb-1">
                      NDIS Number
                    </h3>
                    <p className="text-sm text-gray-700">
                      {(entity as AccommodationInterest).ndisNumber}
                    </p>
                  </div>
                )}
              </div>
              {((entity as AccommodationInterest).reasonForEnquiry ||
                (entity as AccommodationInterest).message) && (
                <div>
                  <h3 className="text-sm font-montserrat-bold text-gray-900 mb-1">
                    Reason for Enquiry
                  </h3>
                  <p className="text-sm text-gray-700 bg-gray-50 p-3 rounded-lg">
                    {(entity as AccommodationInterest).reasonForEnquiry ||
                      (entity as AccommodationInterest).message}
                  </p>
                </div>
              )}

              {/* Attachments */}
              {(entity as AccommodationInterest).attachments &&
                (entity as AccommodationInterest).attachments!.length > 0 && (
                  <div>
                    <h3 className="text-sm font-montserrat-bold text-gray-900 mb-2">
                      Attachments
                    </h3>
                    <div className="space-y-2">
                      {(entity as AccommodationInterest).attachments?.map(
                        (file, index) => (
                          <div
                            key={index}
                            className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200"
                          >
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                                <svg
                                  className="w-6 h-6 text-red-500"
                                  viewBox="0 0 24 24"
                                  fill="currentColor"
                                >
                                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6z" />
                                </svg>
                              </div>
                              <div>
                                <p className="text-sm font-montserrat-semibold text-gray-900">
                                  {file.name}
                                </p>
                                <p className="text-xs text-gray-500">
                                  {file.size}
                                </p>
                              </div>
                            </div>
                            <a
                              href={file.url}
                              download
                              className="text-gray-400 hover:text-gray-600"
                            >
                              <DownloadMinimalistic className="h-5 w-5" />
                            </a>
                          </div>
                        )
                      )}
                    </div>
                  </div>
                )}
            </div>
          )}

          {/* Rejection Reason Input - Only show when rejecting */}
          {actionType === "reject" && (
            <div>
              <label className="text-sm font-montserrat-bold text-gray-900 mb-2 block">
                Reason for Rejection (Optional)
              </label>
              <textarea
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="Provide a reason for rejection..."
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary resize-none"
              />
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-6 pt-4 flex flex-col md:flex-row gap-3">
          <button
            onClick={() => {
              onConfirm({ entityId: entity.id, reason: reason.trim() || undefined });
            }}
            disabled={isLoading}
            className="flex-1 py-3 px-6 border-2 border-red-500 text-red-500 rounded-lg font-montserrat-semibold hover:bg-red-50 transition-colors disabled:opacity-50"
          >
            Reject
          </button>
          <button
            onClick={handleConfirm}
            disabled={isLoading}
            className="flex-1 bg-primary hover:bg-primary/90 text-white py-3 px-6 rounded-lg font-montserrat-semibold transition-colors disabled:opacity-50"
          >
            {isLoading ? (
              <div className="flex items-center justify-center gap-2">
                <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Processing...
              </div>
            ) : (
              "Accept"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
