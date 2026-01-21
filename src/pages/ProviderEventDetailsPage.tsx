import { useNavigate, useParams } from "react-router-dom";
import {
  Calendar,
  ClockCircle,
  MapPoint,
  AltArrowLeft,
  Pen2,
} from "@solar-icons/react";
import GeneralHeader from "@/components/GeneralHeader";
import { cn } from "@/lib/design-utils";
import { BG_COLORS, CONTAINER_PADDING } from "@/constants/design-system";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { useGetEventById } from "@/hooks/useEventHooks";

// Mock event data
const mockEvent = {
  id: 1,
  title: "Local City Tour, 2025",
  date: "22nd Nov - 29 Nov, 2025",
  time: "8:00 AM - 12:00 PM",
  location: "Albion Park, AU",
  image: null,
  description: `Discover the beauty, culture, and hidden gems of your city in an unforgettable experience designed to connect you with your surroundings. The Local City Tour offers participants the opportunity to visit key landmarks, historic sites, and entertainment hotspots while engaging with local guides who share stories, traditions, and facts that bring the city to life.

This tour is perfect for residents who want to rediscover their home, newcomers eager to explore, or travelers seeking an authentic city adventure. Expect a blend of sightseeing, cultural immersion, photo opportunities, and fun group activities along the way.

Participants will enjoy stops at major attractions, local markets, art districts, and recreational centers. Light refreshments and breaks are included to ensure comfort throughout the journey.

Whether you're joining solo or with friends, the Local City Tour promises an exciting, social, and educational day out that helps you see your city from a fresh perspective.`,
  highlights: [
    "Enjoy a fun and informative tour led by local experts who share fascinating stories about the city's history and culture.",
    "Visit iconic attractions as well as lesser-known spots that showcase the city's unique charm.",
    "Immerse yourself in the local lifestyle through art, music, markets, and street food.",
    "Immerse yourself in the local lifestyle through art, music, markets, and street food.",
  ],
};

type TabType = "new" | "accepted" | "rejected";

export default function ProviderEventDetailsPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { eventId } = useParams();

  const { data: eventData } = useGetEventById(eventId);

  const formatDateRange = (start?: string, end?: string) => {
    if (start && end) return `${new Date(start).toLocaleDateString()} - ${new Date(end).toLocaleDateString()}`;
    return start || end || "";
  };

  const formatTimeRange = (start?: string, end?: string) => {
    if (start && end) return `${start} - ${end}`;
    return start || end || "";
  };

  return (
    <div className={cn("min-h-screen", BG_COLORS.muted, CONTAINER_PADDING.responsive)}>
      <div className="">
        {/* Header */}
        <div className="mb-6">
          <GeneralHeader
            stickyTop={false}
            showBackButton
            title={eventData?.eventName || "Untitled Event"}
            subtitle=""
            user={user}
            onLogout={() => {}}
            onViewProfile={() => navigate("/provider/profile")}
          />
        </div>

        {/* Event Image */}
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden mb-6">
          <div className="w-full h-64 md:h-80 bg-gradient-to-r from-primary-100 to-purple-100 flex items-center justify-center">
            <div className="text-center text-gray-400">
              <Calendar className="h-16 w-16 mx-auto mb-2" />
              <p className="text-sm">Event Image</p>
            </div>
          </div>
        </div>

        {/* Event Details */}
        <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
            <h2 className="text-xl font-montserrat-bold text-gray-900">
              {eventData?.eventName}
            </h2>
            <Button
              onClick={() => navigate(`/provider/events/${eventId}/edit`)}
              className="bg-primary hover:bg-primary/90"
            >
              <Pen2 className="h-4 w-4 mr-2" />
              Pen2 Event
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary-50 rounded-lg">
                <Calendar className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-xs text-gray-500">Date</p>
                <p className="text-sm font-montserrat-semibold text-gray-900">
                  {formatDateRange(eventData?.eventStartDate, eventData?.eventEndDate)}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary-50 rounded-lg">
                <ClockCircle className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-xs text-gray-500">Time</p>
                <p className="text-sm font-montserrat-semibold text-gray-900">
                  {formatTimeRange(eventData?.eventStartTime, eventData?.eventEndTime)}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary-50 rounded-lg">
                <MapPoint className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-xs text-gray-500">Location</p>
                <p className="text-sm font-montserrat-semibold text-gray-900">
                  {eventData?.eventLocation}
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 mb-6">
            <div className="flex -space-x-2">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="w-8 h-8 rounded-full bg-gray-300 border-2 border-white"
                ></div>
              ))}
            </div>
            <span className="text-sm text-gray-600">+{eventData?.registrationCount || 0}</span>
          </div>

          <div className="border-t border-gray-200 pt-6">
            <h3 className="text-lg font-montserrat-semibold text-gray-900 mb-4">
              Event Description
            </h3>
            <div className="text-sm text-gray-600 space-y-4 whitespace-pre-line">
              {eventData?.eventDescr}
            </div>
          </div>

          <div className="border-t border-gray-200 pt-6 mt-6">
            <Button
              onClick={() =>
                navigate(`/provider/events/${eventId}/participants`)
              }
              className="w-full bg-primary hover:bg-primary/90"
            >
              View Registered Participant
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
