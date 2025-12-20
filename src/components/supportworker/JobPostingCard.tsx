import { useNavigate } from "react-router-dom";
import {
  Bookmark,
  BookmarkCircle,
  ClockCircle,
  DollarMinimalistic,
  MapPoint,
  SuitcaseTag,
  User,
} from "@solar-icons/react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ReactNode } from "react";

export interface JobPosting {
  id: string;
  title: string;
  providerName: string;
  providerImage: string | null;
  location: string;
  hourlyRate: number;
  postedDate: string;
  isSaved: boolean;
  isApplied: boolean;
  description?: string;
  jobType?: string;
  applicationCount?: number;
}

interface JobPostingCardProps {
  job: JobPosting;
  onSaveJob?: (e: React.MouseEvent, jobId: string) => void;
  onApply?: (e: React.MouseEvent, jobId: string) => void;
  onClick?: (jobId: string) => void;
  isActive?: boolean;
  variant?: "default" | "compact";
  children?: ReactNode;
}

export function JobPostingCard({
  job,
  onSaveJob,
  onApply,
  onClick,
  isActive = false,
  variant = "default",
  children,
}: JobPostingCardProps) {
  const navigate = useNavigate();

  const getStatusInfo = () => {
    if (job.isApplied) {
      return { text: "Applied", class: "bg-green-100 text-green-800" };
    }
    return { text: "Open", class: "bg-primary/10 text-primary" };
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
    <Card
      onClick={handleClick}
      className={`hover:shadow-md transition-all cursor-pointer relative ${
        variant === "compact" ? "p-2.5" : ""
      }`}
    >
      <CardHeader className="pb-3">
          {/* Status Badge */}
          <span
            className={`absolute top-2 left-2 px-2 py-0.5 rounded-full text-xs font-montserrat-semibold ${status.class}`}
          >
            {status.text}
          </span>
          {/* Save/Unsave Button */}
          <button
            onClick={handleSaveClick}
            className="absolute top-2 right-2 px-2 py-0.5 flex-shrink-0 p-1.5 hover:bg-gray-100 rounded-full transition-colors self-start"
            title={job.isSaved ? "Remove from saved" : "Save job"}
          >
            {job.isSaved ? (
             <img src="/new-res/vector-icons/un-save.svg" alt="UnSaved" className="h-5 w-5 text-primary" />
            ) : (
              <Bookmark className="h-5 w-5 text-gray-600" />
            )}
          </button>
        <div className="flex gap-3">
          {/* Avatar */}
          <div className="flex-shrink-0">
            {job.providerImage ? (
              <img
                src={job.providerImage}
                alt={job.providerName}
                className="w-12 h-12 rounded-full object-cover"
              />
            ) : (
              <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center">
                <User className="h-6 w-6 text-gray-400" />
              </div>
            )}
          </div>

          {/* Title and Provider Name */}
          <div className="flex-1 min-w-0">
            <CardTitle className="text-sm font-montserrat-semibold line-clamp-2 mb-0.5">
              {job.title}
            </CardTitle>
            <CardDescription className="text-xs">
              {job.providerName}
            </CardDescription>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-3 pb-3">
        {/* Job Details */}
        <div className="space-y-2">
          {/* Location */}
          <div className="flex items-center gap-1 text-xs text-gray-600">
            <MapPoint className="h-3.5 w-3.5 flex-shrink-0" />
            <span className="truncate">{job.location}</span>
          </div>

          {/* Hourly Rate */}
          <div className="flex items-center gap-1 text-xs text-gray-600">
            <DollarMinimalistic className="h-3.5 w-3.5 flex-shrink-0" />
            <span className="font-montserrat-semibold text-primary text-xs px-2 py-0.5 bg-primary/10 rounded-full">
              ${job.hourlyRate}/hr
            </span>
          </div>

          {/* Job Type (if available) */}
          {job.jobType && (
            <div className="flex items-center gap-1 text-xs text-gray-600">
              <SuitcaseTag className="h-3.5 w-3.5 flex-shrink-0" />
              <span className="capitalize">
                {job.jobType.replace(/([A-Z])/g, " $1").trim()}
              </span>
            </div>
          )}

          {/* Posted Date */}
          <div className="flex items-center gap-1 text-xs text-gray-400">
            <ClockCircle className="h-3.5 w-3.5 flex-shrink-0" />
            <span>Posted {job.postedDate}</span>
          </div>

          {/* Application Count (if available) */}
          {job.applicationCount !== undefined && (
            <div className="text-xs text-gray-500">
              {job.applicationCount}{" "}
              {job.applicationCount === 1 ? "application" : "applications"}
            </div>
          )}
        </div>

        {/* Description Preview (if available) */}
        {job.description && (
          <p className="text-xs text-gray-600 line-clamp-2">
            {job.description}
          </p>
        )}
      </CardContent>

      <CardFooter className="">
        <Button
          size="sm"
          className="flex place-self-end font-montserrat-semibold"
          onClick={handleApplyClick}
          disabled={job.isApplied}
        >
          {job.isApplied ? "Applied" : "Apply Now"}
        </Button>
      </CardFooter>

      {/* Children (for custom overlays like status badges) */}
      {children}
    </Card>
  );
}
