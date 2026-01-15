import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Magnifer,
  CalendarMinimalistic,
  MapPoint,
} from "@solar-icons/react";
import GeneralHeader from "@/components/GeneralHeader";
import { PAGE_WRAPPER, cn } from "@/lib/design-utils";
import { BG_COLORS, GRID_LAYOUTS, GAP, CONTAINER_PADDING, SPACING, HEADING_STYLES, TEXT_STYLES } from "@/constants/design-system";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAuth } from "@/contexts/AuthContext";
import Loader from "@/components/Loader";
import ErrorDisplay from "@/components/ErrorDisplay";
import { useGetEvents } from "@/hooks/useEventHooks";
import EventCard from "@/components/participant/events/EventCard";

export default function EventsPage() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  // State for filters
  const [searchQuery, setSearchQuery] = useState("");
  const [dateFilter, setDateFilter] = useState("any");
  const [locationFilter, setLocationFilter] = useState("");

  // Fetch events
  const {
    data: eventsData,
    isLoading,
    error,
  } = useGetEvents({
    search: searchQuery,
  });

  if (isLoading) return <Loader />;

  if (error) {
    return (
      <div className={cn("min-h-screen", BG_COLORS.muted, CONTAINER_PADDING.responsive)}>
        <ErrorDisplay message="Failed to load events" />
      </div>
    );
  }

  const events = eventsData?.events || [];

  return (
    <div className={PAGE_WRAPPER}>
      <GeneralHeader
        stickyTop={true}
        title="Events"
        subtitle="Find events that match your interests and register to participate"
        user={user}
        onLogout={logout}
        onViewProfile={() => navigate("/participant/profile")}
      />

      {/* Filter Bar */}
      <div className={cn("bg-white rounded-xl shadow-sm border border-gray-200 mb-8 flex flex-col lg:flex-row gap-4", CONTAINER_PADDING.card)}>
        <div className="flex-grow relative">
          <MapPoint className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <Input
            placeholder="Search location..."
            className="pl-10 bg-gray-50 border-gray-200 focus:border-primary focus:bg-white transition-colors"
            value={locationFilter}
            onChange={(e) => setLocationFilter(e.target.value)}
          />
        </div>

        <div className="flex-grow relative">
          <CalendarMinimalistic className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <Select value={dateFilter} onValueChange={setDateFilter}>
            <SelectTrigger className="pl-10 bg-gray-50 border-gray-200 focus:border-primary transition-colors">
              <SelectValue placeholder="Any date" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="any">Any date</SelectItem>
              <SelectItem value="today">Today</SelectItem>
              <SelectItem value="week">This Week</SelectItem>
              <SelectItem value="month">This Month</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Button className="bg-primary hover:bg-primary/90 w-full lg:w-auto px-8 transition-all duration-200 shadow-sm hover:shadow-md">
          <Magnifer className="w-5 h-5 mr-2" />
          Search
        </Button>
      </div>

      {/* Featured Categories */}
      <div className={cn(`mb-${SPACING.lg}`)}>
        <h3 className={cn(HEADING_STYLES.h4, "mb-4")}>Browse by Category</h3>
        <div className="flex flex-wrap gap-3">
          <Button
            variant="secondary"
            className="bg-primary/10 text-primary hover:bg-primary hover:text-white border-primary/20 transition-all duration-200"
          >
            All Events
          </Button>
          <Button
            variant="outline"
            className="bg-white border-gray-200 text-gray-600 hover:border-primary hover:text-primary transition-all duration-200"
          >
            Nearby
          </Button>
          <Button
            variant="outline"
            className="bg-white border-gray-200 text-gray-600 hover:border-primary hover:text-primary transition-all duration-200"
          >
            This Week
          </Button>
          <Button
            variant="outline"
            className="bg-white border-gray-200 text-gray-600 hover:border-primary hover:text-primary transition-all duration-200"
          >
            Trending
          </Button>
        </div>
      </div>

      {/* Events Grid */}
      <div className={cn(GRID_LAYOUTS.responsive, GAP.responsive, `mb-${SPACING.xl}`)}>
        {events.map((event: any) => (
          <EventCard key={event._id} event={event} />
        ))}
      </div>

      {/* Empty State */}
      {events.length === 0 && (
        <div className={cn("text-center py-20 bg-white rounded-xl border border-gray-200 shadow-sm")}>
          <MapPoint className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <p className={cn(TEXT_STYLES.bodySecondary, "text-gray-600 mb-2")}>
            No events found
          </p>
          <p className="text-sm text-gray-500">
            Try adjusting your filters or check back later for new events
          </p>
        </div>
      )}
    </div>
  );
}
