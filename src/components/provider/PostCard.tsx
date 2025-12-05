import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Calendar,
  MapPoint,
  DollarMinimalistic,
  Home,
  MenuDots,
  Eye,
  Pen2,
  TrashBinTrash,
  UsersGroupTwoRounded,
  SuitcaseTag,
} from "@solar-icons/react";
import { Button } from "@/components/ui/button";

export type PostType = "event" | "accommodation" | "job";

interface BasePost {
  id: number | string;
  title: string;
  image?: string | null;
  status: string;
}

interface EventPost extends BasePost {
  type: "event";
  date: string;
  time?: string;
  location: string;
  participants: number;
}

interface AccommodationPost extends BasePost {
  type: "accommodation";
  location: string;
  price: number;
  priceUnit: string;
  bedrooms: number;
  bathrooms: number;
  propertyType: string;
  interested: number;
}

interface JobPost extends BasePost {
  type: "job";
  workerName: string;
  skills: string[];
  hourlyRate: number;
  availability: string;
  location: string;
  applicants: number;
  rating?: number;
  experience?: string;
  stateId?:string;
  regionId?:string;
  serviceAreaIds?:string[];
}

export type Post = EventPost | AccommodationPost | JobPost;

interface PostCardProps {
  post: Post;
  basePath: string;
  onEdit?: (id: number | string) => void;
  onDelete?: (id: number | string) => void;
}

export function PostCard({ post, basePath, onEdit, onDelete }: PostCardProps) {
  const navigate = useNavigate();
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowMenu(false);
      }
    };

    if (showMenu) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showMenu]);

  const getStatusColor = (status: string) => {
    const statusLower = status.toLowerCase();
    switch (statusLower) {
      case "upcoming":
      case "available":
      case "active":
        return "bg-green-100 text-green-800";
      case "past":
      case "occupied":
      case "unavailable":
      case "inactive":
        return "bg-red-100 text-red-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-primary-100 text-primary-800";
    }
  };

  const getParticipantLabel = () => {
    switch (post.type) {
      case "event":
        return "View Registered Participants";
      case "accommodation":
        return "View Enquired Participants";
      case "job":
        return "View Applicants";
      default:
        return "View Participants";
    }
  };

  const getParticipantCount = () => {
    switch (post.type) {
      case "event":
        return post.participants;
      case "accommodation":
        return post.interested;
      case "job":
        return post.applicants;
      default:
        return 0;
    }
  };

  const getIcon = () => {
    switch (post.type) {
      case "event":
        return <Calendar className="h-8 w-8 text-gray-400" />;
      case "accommodation":
        return <Home className="h-8 w-8 text-gray-400" />;
      case "job":
        return <SuitcaseTag className="h-8 w-8 text-gray-400" />;
      default:
        return null;
    }
  };

  const handleMenuClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowMenu(!showMenu);
  };

  const handleViewDetails = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowMenu(false);
    navigate(`/participant${basePath}/${post.id}`);
  };

  const handleViewParticipants = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowMenu(false);
    navigate(`/participant${basePath}/${post.id}/interested`);
  };

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowMenu(false);
    if (onEdit) {
      onEdit(post.id);
    } else {
      navigate(`/participant${basePath}/${post.id}/edit`);
    }
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowMenu(false);
    if (onDelete) {
      onDelete(post.id);
    }
  };

  const renderDetails = () => {
    switch (post.type) {
      case "event":
        return (
          <>
            <div className="flex items-center gap-1 text-xs text-gray-600 mb-1">
              <Calendar className="h-3 w-3 flex-shrink-0" />
              <span className="truncate">{post.date}</span>
              <p className="text-xs text-gray-500 truncate">{post.location}</p>
            </div>
          </>
        );
      case "accommodation":
        return (
          <>
            <div className="flex items-center gap-1 text-xs text-gray-600 mb-1">
              <MapPoint className="h-3 w-3 flex-shrink-0" />
              <span className="truncate">{post.location}</span>
            </div>
            <div className="flex items-center gap-1 text-xs text-gray-600 mb-1">
              <DollarMinimalistic className="h-3 w-3 flex-shrink-0" />
              <span className="font-semibold text-primary">
                ${post.price}/{post.priceUnit}
              </span>
              <p className="text-xs text-gray-500">
                {post.bedrooms} bed · {post.bathrooms} bath ·{" "}
                {post.propertyType}
              </p>
            </div>
          </>
        );
      case "job":
        return (
          <>
            <div className="flex items-center gap-1 text-xs text-gray-600 mb-1">
              <MapPoint className="h-3 w-3 flex-shrink-0" />
              <span className="truncate">{post.location}</span>
            </div>
            <div className="flex items-center gap-1 text-xs text-gray-600 mb-1">
              <DollarMinimalistic className="h-3 w-3 flex-shrink-0" />
              <span className="font-semibold text-primary">
                ${post.hourlyRate}/hr
              </span>
              <p className="text-xs text-gray-500 truncate">
                {post.skills.slice(0, 2).join(" · ")}
                {post.skills.length > 2 && ` +${post.skills.length - 2}`}
              </p>
            </div>
          </>
        );
      default:
        return null;
    }
  };

  return (
    <div
      className="bg-white border border-gray-200 rounded-lg p-3 md:p-4 hover:shadow-md transition-shadow cursor-pointer flex flex-col relative"
      onClick={() => navigate(`/participant${basePath}/${post.id}`)}
    >
      <div className="flex-1">
        {/* Image Placeholder with Status Badge and Menu */}
        <div className="relative w-full h-36 md:h-28 bg-gray-200 rounded-lg mb-3 flex items-center justify-center">
          {post.image ? (
            <img
              src={post.image}
              alt={post.title}
              className="w-full h-full object-cover rounded-lg"
            />
          ) : (
            getIcon()
          )}

          {/* Status Badge - Bottom Left */}
          <span
            className={`absolute bottom-1 left-1 px-2 py-0.5 rounded-full text-xs font-semibold ${getStatusColor(
              post.status
            )}`}
          >
            {post.status}
          </span>

          {/* Menu Button - Top Right */}
          <div className="absolute top-1 right-1" ref={menuRef}>
            <button
              onClick={handleMenuClick}
              className="p-1.5 bg-white/90 hover:bg-white rounded-full shadow-sm transition-colors"
            >
              <MenuDots className="h-4 w-4 text-gray-600" />
            </button>

            {/* Dropdown Menu */}
            {showMenu && (
              <div className="absolute top-8 right-0 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-50 py-1">
                <button
                  onClick={handleViewDetails}
                  className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                >
                  <Eye className="h-4 w-4" />
                  View Details
                </button>
                <button
                  onClick={handleViewParticipants}
                  className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                >
                  <UsersGroupTwoRounded className="h-4 w-4" />
                  {getParticipantLabel()}
                </button>
                <hr className="my-1" />
                <button
                  onClick={handleEdit}
                  className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                >
                  <Pen2 className="h-4 w-4" />
                  Edit
                </button>
                <button
                  onClick={handleDelete}
                  className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                >
                  <TrashBinTrash className="h-4 w-4" />
                  Delete
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Title */}
        <h3 className="text-sm font-semibold text-gray-900 line-clamp-2 mb-2">
          {post.type === "job" ? post.workerName : post.title}
        </h3>

        {/* Type-specific Details */}
        {renderDetails()}
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between mt-3 pt-2">
        <div className="flex items-center gap-1">
          <div className="flex -space-x-1">
            {[1, 2].map((i) => (
              <div
                key={i}
                className="w-5 h-5 rounded-full bg-gray-300 border-2 border-white"
              ></div>
            ))}
          </div>
          <span className="text-xs text-gray-600">
            +{getParticipantCount()}
          </span>
        </div>
        <Button
          size="sm"
          className="font-montserrat-semibold"
          onClick={(e) => {
            e.stopPropagation();
            navigate(`/participant${basePath}/${post.id}`);
          }}
        >
          View Details
        </Button>
      </div>
    </div>
  );
}
