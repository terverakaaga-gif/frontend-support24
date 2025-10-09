import React from 'react';
import { 
  MapPin, 
  User,
  Calendar,
  Clock
} from 'lucide-react';

interface ShiftCardProps {
  shift: any;
  onClick: () => void;
  viewMode?: 'grid' | 'list';
}

const ShiftCard: React.FC<ShiftCardProps> = ({ shift, onClick, viewMode = 'grid' }) => {
  const getStatusBadgeStyle = (status: string) => {
    switch (status.toLowerCase()) {
      case "confirmed":
        return "bg-primary-100 text-primary border border-primary-200";
      case "pending":
        return "bg-orange-50 text-orange-600 border border-orange-200";
      case "in progress":
      case "in_progress":
        return "bg-purple-50 text-purple-600 border border-purple-200";
      case "completed":
        return "bg-green-50 text-green-600 border border-green-200";
      case "cancelled":
        return "bg-red-50 text-red-600 border border-red-200";
      default:
        return "bg-gray-100 text-gray-600 border border-gray-200";
    }
  };

  const getStatusLabel = (status: string) => {
    return (
      status.replace(/_/g, " ").charAt(0).toUpperCase() +
      status.replace(/_/g, " ").slice(1)
    );
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  const calculateDuration = (start: string, end: string) => {
    const startDate = new Date(start);
    const endDate = new Date(end);
    const diff = (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60);
    return `${diff.toFixed(1)}hr duration`;
  };

  if (viewMode === 'list') {
    return (
      <div
        className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
        onClick={onClick}
      >
        <div className="flex items-center justify-between gap-4">
          {/* Left Section - Service Info */}
          <div className="flex-shrink-0 min-w-0">
            <h3 className="font-montserrat-semibold text-gray-900 text-base mb-1">
              {shift.serviceTypeId.name}
            </h3>
            <div className="flex items-center gap-2 text-sm text-gray-1000">
              <span>{formatDate(shift.startTime)}</span>
              <span>•</span>
              <span>
                {formatTime(shift.startTime)} - {formatTime(shift.endTime)}
              </span>
            </div>
          </div>

          {/* Middle Section - User & Location */}
          <div className="flex items-center gap-6 flex-1 min-w-0">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <User className="w-4 h-4 flex-shrink-0" />
              <span className="truncate">
                {shift.participantId?.firstName} {shift.participantId?.lastName}
              </span>
            </div>
            
            <div className="flex items-center gap-2 text-sm text-gray-600 flex-1 min-w-0">
              <MapPin className="w-4 h-4 flex-shrink-0" />
              <span className="truncate">{shift.address}</span>
            </div>
          </div>

          {/* Right Section - Status & Action */}
          <div className="flex items-center gap-3 flex-shrink-0">
            <span
              className={`px-3 py-1 text-xs font-medium rounded-full ${getStatusBadgeStyle(
                shift.status
              )}`}
            >
              {getStatusLabel(shift.status)}
            </span>
            <button className="bg-primary hover:bg-primary-700 text-white p-2 rounded-full transition-colors">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M5.33333 10.6667L10.6667 5.33333M10.6667 5.33333H5.33333M10.6667 5.33333V10.6667" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Grid View
  return (
    <div
      className="bg-white border border-gray-200 rounded-lg p-5 hover:shadow-md transition-shadow cursor-pointer"
      onClick={onClick}
    >
      {/* Header with Title and Status */}
      <div className="flex justify-between items-center mb-4">
        <div className="flex justify-center items-start gap-1 flex-1 min-w-0">
          <h3 className="font-montserrat-semibold text-base mb-1">
            {shift.serviceTypeId.name}
          </h3>
          <span
            className={`inline-flex px-3 py-1 text-xs font-medium rounded-full ${getStatusBadgeStyle(
              shift.status
            )}`}
          >
            {getStatusLabel(shift.status)}
          </span>
        </div>
        
        {/* Avatar Stack */}
        <div className="flex -space-x-2 flex-shrink-0">
          <img
            src={`https://i.pravatar.cc/32?img=${Math.abs(parseInt(shift._id.slice(-4), 16)) % 10}`}
            alt="Avatar"
            className="w-8 h-8 rounded-full border-2 border-white"
          />
          <img
            src={`https://i.pravatar.cc/32?img=${(Math.abs(parseInt(shift._id.slice(-4), 16)) + 1) % 10}`}
            alt="Avatar"
            className="w-8 h-8 rounded-full border-2 border-white"
          />
        </div>
      </div>

      {/* Date and Time Info */}
      <div className="space-y-2 mb-4">
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Calendar className="w-4 h-4" />
          <span className="font-medium">Date:</span>
          <span>{formatDate(shift.startTime)}</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Clock className="w-4 h-4" />
          <span className="font-medium">Time:</span>
          <span>
            {formatTime(shift.startTime)} - {formatTime(shift.endTime)}
          </span>
          <span className="text-gray-400">
            ({calculateDuration(shift.startTime, shift.endTime)})
          </span>
        </div>
      </div>

      {/* Participant and Location Pills */}
      <div className="flex items-center gap-2 flex-wrap">
        <div className="bg-gray-100 rounded-full border border-gray-200 px-3 py-1.5 flex items-center gap-2 text-sm text-gray-700">
          <User className="w-4 h-4 flex-shrink-0" />
          <span className="truncate font-montserrat-semibold">
            {shift.participantId?.firstName} {shift.participantId?.lastName}
          </span>
        </div>
        <div className="bg-gray-100 rounded-full border border-gray-200 px-3 py-1.5 flex items-center gap-2 text-sm text-gray-600 flex-1 min-w-0">
          <MapPin className="w-4 h-4 flex-shrink-0" />
          <span className="truncate font-montserrat-semibold">{shift.address}</span>
        </div>
      </div>
    </div>
  );
};

export default ShiftCard;