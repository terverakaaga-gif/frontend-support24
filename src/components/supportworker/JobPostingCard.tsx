import { useNavigate } from "react-router-dom";
import {
  Bookmark,
  BookmarkCircle,
  ClockCircle,
  DollarMinimalistic,
  MapPoint,
  SuitcaseTag,
} from "@solar-icons/react";
import { Button } from "@/components/ui/button";

export interface JobPosting {
  id: number;
  title: string;
  providerName: string;
  providerImage: string | null;
  location: string;
  hourlyRate: number;
  postedDate: string;
  isSaved: boolean;
  isApplied: boolean;
}

interface JobPostingCardProps {
  job: JobPosting;
  onSaveJob?: (e: React.MouseEvent, jobId: number) => void;
  onApply?: (e: React.MouseEvent, jobId: number) => void;
  onClick?: (jobId: number) => void;
  isActive?: boolean;
  variant?: "default" | "compact";
}

export function JobPostingCard({
  job,
  onSaveJob,
  onApply,
  onClick,
  isActive = false,
  variant = "default",
}: JobPostingCardProps) {
  const navigate = useNavigate();

  const getStatusInfo = () => {
    if (job.isApplied) {
      return { text: "Applied", class: "bg-primary-100 text-primary-800" };
    }
    return { text: "Open", class: "bg-green-100 text-green-800" };
  };

  const status = getStatusInfo();

  const handleClick = () => {
    if (onClick) {
      onClick(job.id);
    } else {
      navigate(`/support-worker/jobs/${job.id}`);
    }
  };

  const handleSaveClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onSaveJob?.(e, job.id);
  };

  const handleApplyClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onApply?.(e, job.id);
  };

  return (
    <div
      onClick={handleClick}
      className={`bg-white border rounded-lg p-3 md:p-4 hover:shadow-md transition-all cursor-pointer flex flex-col relative ${
        isActive
          ? "border-primary ring-2 ring-primary/20"
          : "border-gray-200"
      } ${variant === "compact" ? "p-3" : ""}`}
    >
      <div className="flex-1">
        {/* Image Placeholder with Status Badge and Save Button */}
        <div
          className={`relative w-full bg-gray-200 rounded-lg mb-3 flex items-center justify-center ${
            variant === "compact" ? "h-24" : "h-36 md:h-28"
          }`}
        >
          {job.providerImage ? (
            <img
              src={job.providerImage}
              alt={job.providerName}
              className="w-full h-full object-cover rounded-lg"
            />
          ) : (
            <SuitcaseTag className="h-8 w-8 text-gray-400" />
          )}

          {/* Status Badge - Bottom Left */}
          <span
            className={`absolute bottom-1 left-1 px-2 py-0.5 rounded-full text-xs font-montserrat-semibold ${status.class}`}
          >
            {status.text}
          </span>

          {/* Save Button - Top Right */}
          <button
            onClick={handleSaveClick}
            className="absolute top-1 right-1 p-1.5 bg-white/90 hover:bg-white rounded-full shadow-sm transition-colors"
          >
            {job.isSaved ? (
              <BookmarkCircle className="h-4 w-4 text-primary" />
            ) : (
              <Bookmark className="h-4 w-4 text-gray-600" />
            )}
          </button>
        </div>

        {/* Title */}
        <h3 className="text-sm font-montserrat-semibold text-gray-900 line-clamp-2 mb-1">
          {job.title}
        </h3>

        {/* Provider Name */}
        <p className="text-xs text-gray-500 mb-2">{job.providerName}</p>

        {/* Location */}
        <div className="flex items-center gap-1 text-xs text-gray-600 mb-1">
          <MapPoint className="h-3 w-3 flex-shrink-0" />
          <span className="truncate">{job.location}</span>
        </div>

        {/* Hourly Rate */}
        <div className="flex items-center gap-1 text-xs text-gray-600 mb-1">
          <DollarMinimalistic className="h-3 w-3 flex-shrink-0" />
          <span className="font-montserrat-semibold text-primary text-xs p-1 w-fit bg-primary-100 rounded-full">
            ${job.hourlyRate}/hr
          </span>
        </div>

        {/* Posted Date */}
        <div className="flex items-center gap-1 text-xs text-gray-400">
          <ClockCircle className="h-3 w-3 flex-shrink-0" />
          <span>Posted {job.postedDate}</span>
        </div>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between mt-3 pt-2 border-t border-gray-100">
        <div className="flex items-center gap-1">
          <div className="w-6 h-6 rounded-full bg-gray-300 flex items-center justify-center text-xs font-montserrat-semibold text-gray-600">
            {job.providerName.charAt(0)}
          </div>
        </div>
        <Button
          size="sm"
          className="font-montserrat-semibold"
          onClick={handleApplyClick}
        >
          {job.isApplied ? "View" : "Apply"}
        </Button>
      </div>
    </div>
  );
}
