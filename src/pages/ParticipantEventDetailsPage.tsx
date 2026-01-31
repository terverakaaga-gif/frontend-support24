import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, MapPoint, Calendar, ClockSquare } from "@solar-icons/react";
import { useGetEventById, useGetEvents } from "@/hooks/useEventHooks";
import { useAuth } from "@/contexts/AuthContext";
import GeneralHeader from "@/components/GeneralHeader";
import Loader from "@/components/Loader";
import EventRegistrationModal from "@/components/participant/events/EventRegistrationModal";
import EventCard from "@/components/participant/events/EventCard";
import { Button } from "@/components/ui/button";
import {
  PAGE_WRAPPER,
  BUTTON_GHOST,
  BUTTON_PRIMARY,
  cn,
} from "@/lib/design-utils";
import {
  BG_COLORS,
  HEADING_STYLES,
  TEXT_STYLES,
  CONTAINER_PADDING,
  SPACING,
  GAP,
} from "@/constants/design-system";

export default function EventDetailsPage() {
  const { eventId } = useParams<{ eventId: string }>();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);

  // Fetch current event
  const { data: event, isLoading } = useGetEventById(eventId);

  // Fetch similar events (mocking query for now)
  const { data: similarEventsData } = useGetEvents({ limit: 3 });
  const similarEvents =
    similarEventsData?.events
      ?.filter((e: any) => e._id !== eventId)
      ?.slice(0, 3) || [];

  if (isLoading) return <Loader />;
  if (!event) return <div>Event not found</div>;

  return (
    <div className={cn(PAGE_WRAPPER, BG_COLORS.muted)}>
      <GeneralHeader
        title="Event Details"
        subtitle="Explore and register for this event"
        user={user}
        onLogout={logout}
        onViewProfile={() => navigate("/participant/profile")}
      />

      <div className={cn("max-w-7xl mx-auto flex flex-col lg:flex-row gap-8 mt-6")}>
        {/* Left Column: Main Content */}
        <div className="flex-1">
          <Button
            variant="ghost"
            onClick={() => navigate(-1)}
            className={cn(
              BUTTON_GHOST,
              `mb-${SPACING.lg} pl-0 hover:bg-transparent hover:text-primary`
            )}
          >
            <ArrowLeft className="w-5 h-5 mr-2" /> Back to Events
          </Button>

          <div className={cn("bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden")}>
            {/* Hero Image */}
            <div className="h-64 md:h-96 w-full bg-gray-200 relative overflow-hidden">
              <img
                src={event.eventImage || "/placeholder-event.jpg"}
                alt={event.eventName || "Incoming Event"}
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
              />
            </div>

            <div className={CONTAINER_PADDING.cardLg}>
              <div className={cn("flex flex-col md:flex-row justify-between items-start gap-4 mb-6")}>
                <div className="flex-1">
                  <h1 className={cn(HEADING_STYLES.h2, `mb-${SPACING.md}`)}>
                    {event.eventName || "Untitled Event"}
                  </h1>
                  <div className={cn("flex flex-wrap gap-4 text-gray-500 text-sm")}>
                    <div className={cn("flex items-center gap-2")}>
                      <Calendar className="w-4 h-4 text-primary" />
                      {new Date(
                        event.eventStartDate
                      ).toLocaleDateString()} -{" "}
                      {new Date(event.eventEndDate).toLocaleDateString()}
                    </div>
                    <div className={cn("flex items-center gap-2")}>
                      <ClockSquare className="w-4 h-4 text-primary" />
                      {event.eventStartTime} - {event.eventEndTime}
                    </div>
                  </div>
                </div>

                <div className={cn("flex items-center gap-2 text-gray-600 bg-gray-50 px-4 py-2 rounded-lg")}>
                  <MapPoint className="w-5 h-5 text-primary" />
                  <span className="text-sm font-medium">{event.eventLocation}</span>
                </div>
              </div>

              <div className={cn("space-y-6")}>
                <section>
                  <h3 className={cn(HEADING_STYLES.h4, `mb-${SPACING.md}`)}>About This Event</h3>
                  <p className={cn(TEXT_STYLES.body, "text-gray-700 leading-relaxed")}>
                    {event.eventDescr}
                  </p>
                </section>

                <div className={cn(`pt-${SPACING.lg}`)}>
                  <Button
                    onClick={() => setIsRegisterModalOpen(true)}
                    className={cn(BUTTON_PRIMARY, "w-full py-4 text-lg font-montserrat-semibold shadow-sm hover:shadow-md")}
                  >
                    Register for Event
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Similar Events */}
        <div className={cn("w-full lg:w-96 flex-shrink-0")}>
          <div className={cn("flex justify-between items-center mb-4")}>
            <h3 className={cn(HEADING_STYLES.h4)}>Similar Events</h3>
            <Button variant="link" className="text-primary text-sm font-medium hover:underline p-0 h-auto">
              View all
            </Button>
          </div>

          <div className={cn(GAP.base, "flex flex-col")}>
            {similarEvents.map((simEvent: any) => (
              <EventCard
                key={simEvent._id}
                event={simEvent}
                basePath="/participant/events"
              />
            ))}
          </div>

          {similarEvents.length === 0 && (
            <div className={cn("bg-white rounded-lg p-6 text-center border border-gray-200")}>
              <p className="text-gray-500 text-sm">No similar events at the moment</p>
            </div>
          )}
        </div>
      </div>

      {/* Registration Modal */}
      <EventRegistrationModal
        isOpen={isRegisterModalOpen}
        onClose={() => setIsRegisterModalOpen(false)}
        eventId={event._id}
        eventName={event.eventName}
        userEmail={user?.email}
        userName={`${user?.firstName || ""} ${user?.lastName || ""}`}
      />
    </div>
  );
}
