import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Calendar,
  Eye,
  AltArrowLeft,
  AltArrowRight,
  AddCircle,
} from "@solar-icons/react";
import GeneralHeader from "@/components/GeneralHeader";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/contexts/AuthContext";
import { Post, PostCard } from "@/components/provider/PostCard";
import { cn } from "@/lib/design-utils";
import {
  SPACING,
  GAP,
  CONTAINER_PADDING,
  BG_COLORS,
  FLEX_LAYOUTS,
  GRID_LAYOUTS,
  RADIUS,
  BORDER_STYLES,
  FONT_FAMILY,
  TEXT_SIZE,
} from "@/constants/design-system";

import { useGetEvents } from "@/hooks/useEventHooks";

type FilterType = "all" | "upcoming" | "past";

export default function ProviderEventsPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [currentFilter, setCurrentFilter] = useState<FilterType>("all");
  const [entriesPerPage, setEntriesPerPage] = useState("5");
  const [currentPage, setCurrentPage] = useState(1);

  // Load events from API
  const { data: eventsData, isLoading: isLoadingEvents } = useGetEvents();

  const events = (eventsData?.events || []).map((e) => ({
    id: e._id,
    title: e.eventName,
    date:
      e.eventStartDate && e.eventEndDate
        ? `${new Date(e.eventStartDate).toLocaleDateString()} - ${new Date(
            e.eventEndDate
          ).toLocaleDateString()}`
        : e.eventStartDate || "",
    time:
      e.eventStartTime && e.eventEndTime ? `${e.eventStartTime} - ${e.eventEndTime}` : e.eventStartTime || "",
    location: e.eventLocation || "",
    participants: e.registrationCount || 0,
    status: e.status || "published",
    image: e.eventImage || null,
  }));

  // Filter events based on status
  const filteredEvents = events.filter((event) => {
    const matchesSearch = event.title
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesFilter =
      currentFilter === "all" || event.status.toLowerCase() === currentFilter;
    return matchesSearch && matchesFilter;
  });

  // Count for each filter
  const allCount = events.length;
  const upcomingCount = events.filter((e) => e.status === "upcoming").length;
  const pastCount = events.filter((e) => e.status === "past").length;

  // Pagination
  const totalPages = Math.ceil(
    filteredEvents.length / parseInt(entriesPerPage)
  );
  const startIndex = (currentPage - 1) * parseInt(entriesPerPage);
  const endIndex = startIndex + parseInt(entriesPerPage);
  const currentEvents = filteredEvents.slice(startIndex, endIndex);

  const handleFilterChange = (filter: FilterType) => {
    setCurrentFilter(filter);
    setCurrentPage(1);
  };

  return (
    <div className={cn("min-h-screen", BG_COLORS.muted, CONTAINER_PADDING.responsive)}>
      <GeneralHeader
        stickyTop={true}
        title="Events"
        subtitle="Manage all your events here"
        user={user}
        onLogout={() => {}}
        onViewProfile={() => navigate("/provider/profile")}
        rightComponent={
          <div className="w-fit flex gap-2">
            <Input
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-36 md:w-64"
            />
            <Button
              onClick={() => navigate("/provider/events/create")}
              className="bg-primary hover:bg-primary-700"
            >
              <AddCircle className="h-5 w-5 mr-2" />
              Create Event
            </Button>
          </div>
        }
      />

      {/* Filter Tabs and Search */}
      <div className={`mb-${SPACING['2xl']} md:mb-${SPACING['3xl']} space-y-${SPACING.base}`}>
        <div className={cn(FLEX_LAYOUTS.colToRow, GAP.base)}>
          <div className={cn(FLEX_LAYOUTS.rowWrap, GAP.sm)}>
            <Button
              variant={"default"}
              size="sm"
              className={`h-6 rounded-full text-xs font-montserrat-semibold ${
                currentFilter === "all"
                  ? "hover:bg-white"
                  : "bg-gray-50 text-black hover:text-white hover:bg-primary border border-gray-200"
              }`}
              onClick={() => setCurrentFilter("all")}
            >
              All
            </Button>
            <Button
              variant={"default"}
              size="sm"
              className={`h-6 rounded-full text-xs font-montserrat-semibold ${
                currentFilter === "upcoming"
                  ? "hover:bg-white"
                  : "bg-gray-50 text-black hover:text-white hover:bg-primary border border-gray-200"
              }`}
              onClick={() => setCurrentFilter("upcoming")}
            >
              Upcoming
            </Button>
            <Button
              variant={"default"}
              size="sm"
              className={`h-6 rounded-full text-xs font-montserrat-semibold ${
                currentFilter === "past"
                  ? "hover:bg-white"
                  : "bg-gray-50 text-black hover:text-white hover:bg-primary border border-gray-200"
              }`}
              onClick={() => setCurrentFilter("past")}
            >
              Past
            </Button>
          </div>
        </div>

        {/* Events */}
        <div className={cn(GRID_LAYOUTS.responsive, "lg:grid-cols-4 xl:grid-cols-5", GAP.base)}>
          {currentEvents.map((event) => (
            <PostCard
              key={event.id}
              post={{ ...event, type: "event" } as Post}
              basePath={window.location.pathname}
              onDelete={() => {}}
            />
          ))}
        </div>

        {/* Pagination */}
        {currentEvents.length > 0 && (
          <div className="p-4 border-t border-gray-200 flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <span>Showing</span>
              <Select
                value={entriesPerPage}
                onValueChange={(value) => {
                  setEntriesPerPage(value);
                  setCurrentPage(1);
                }}
              >
                <SelectTrigger className="w-20 h-9">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="5">5</SelectItem>
                  <SelectItem value="10">10</SelectItem>
                  <SelectItem value="20">20</SelectItem>
                </SelectContent>
              </Select>
              <span>entries</span>
            </div>
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                size="sm"
                className="border-gray-200 h-9 w-9"
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
              >
                <AltArrowLeft className="h-4 w-4" />
              </Button>
              {Array.from(
                { length: Math.min(5, totalPages) },
                (_, i) => i + 1
              ).map((page) => (
                <Button
                  key={page}
                  size="sm"
                  onClick={() => setCurrentPage(page)}
                  className={`h-9 w-9 ${
                    currentPage === page
                      ? "bg-primary text-white hover:bg-primary/90"
                      : "border border-gray-200 bg-white text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  {page}
                </Button>
              ))}
              <Button
                variant="outline"
                size="sm"
                className="border-gray-200 h-9 w-9"
                onClick={() =>
                  setCurrentPage((p) => Math.min(totalPages, p + 1))
                }
                disabled={currentPage === totalPages}
              >
                <AltArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
