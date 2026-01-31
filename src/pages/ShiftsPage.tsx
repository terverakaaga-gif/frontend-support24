import { useState } from "react";
import {
  Magnifer,
  Widget,
  List,
} from "@solar-icons/react";
import { useGetShifts } from "@/hooks/useShiftHooks";
import Loader from "@/components/Loader";
import ErrorDisplay from "@/components/ErrorDisplay";
import ShiftCard from "@/components/ShiftCard";
import ShiftDetailsDialog from "@/components/ShiftDetailsDialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import GeneralHeader from "@/components/GeneralHeader";
import { pageTitles } from "@/constants/pageTitles";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DASHBOARD_PAGE_WRAPPER,
  DASHBOARD_CONTENT,
  CARD,
  FLEX_ROW_CENTER,
  FLEX_ROW_BETWEEN,
  FLEX_CENTER,
  FLEX_COL,
  GRID_RESPONSIVE,
  GRID_2_COLS,
  HEADING_5,
  TEXT_SMALL,
  TEXT_MUTED,
  FORM_INPUT,
  EMPTY_STATE,
  BUTTON_BASE,
  cn,
} from "@/lib/design-utils";
import { BG_COLORS, GAP } from "@/constants/design-system";

const ShiftsPage = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [statusFilter, setStatusFilter] = useState("all");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedShift, setSelectedShift] = useState<any>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);

  const { data: shifts = [], isLoading, error, refetch } = useGetShifts();

  const getStatusCount = (status: string) => {
    if (status === "all") return shifts.length;
    return shifts.filter((s: any) => s.status.toLowerCase() === status).length;
  };

  const filteredShifts = shifts
    .filter((shift: any) => {
      const matchesStatus =
        statusFilter === "all" || shift.status.toLowerCase() === statusFilter;
      const matchesSearch =
        searchQuery === "" ||
        shift.serviceTypeId.name
          .toLowerCase()
          .includes(searchQuery.toLowerCase()) ||
        (typeof shift.participantId === "object" &&
          shift.participantId.firstName &&
          shift.participantId.firstName
            .toLowerCase()
            .includes(searchQuery.toLowerCase())) ||
        (typeof shift.participantId === "object" &&
          shift.participantId.lastName &&
          shift.participantId.lastName
            .toLowerCase()
            .includes(searchQuery.toLowerCase())) ||
        shift.address.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesStatus && matchesSearch;
    })
    .sort((a: any, b: any) => {
      const aStatus = a.status.toLowerCase();
      const bStatus = b.status.toLowerCase();
      const recentStatuses = ["pending", "confirmed", "inprogress"];

      // If both shifts have status that should show recent first
      if (
        recentStatuses.includes(aStatus) &&
        recentStatuses.includes(bStatus)
      ) {
        return (
          new Date(b.startTime).getTime() - new Date(a.startTime).getTime()
        );
      }

      // If only one has the recent status, prioritize it
      if (recentStatuses.includes(aStatus)) return -1;
      if (recentStatuses.includes(bStatus)) return 1;

      // For other statuses, sort by start time (most recent first)
      return new Date(b.startTime).getTime() - new Date(a.startTime).getTime();
    });

  const totalPages = Math.ceil(filteredShifts.length / itemsPerPage);
  const paginatedShifts = filteredShifts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Show loading state with modern loader
  if (isLoading) {
    return <Loader type="pulse" />;
  }

  // Show custom error component
  if (error) {
    return (
      <ErrorDisplay
        title="Failed to load shifts"
        message={error.message}
        onRetry={refetch}
        showRetry={true}
      />
    );
  }

  return (
    <div className={cn(DASHBOARD_PAGE_WRAPPER, BG_COLORS.gray100)}>
      <div className={DASHBOARD_CONTENT}>
        {/* Header */}
        <GeneralHeader
          stickyTop={true}
          title={pageTitles.participant["/participant/shifts"].title}
          subtitle="Manage your care schedule and track upcoming appointments"
          user={user}
          onLogout={logout}
          rightComponent={
            <>
              <div className={cn("flex-1 relative max-w-[150px] md:max-w-md")}>
                <Magnifer className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Search shifts here...."
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setCurrentPage(1);
                  }}
                  className={cn("pl-10 pr-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-primary-600 focus:border-transparent")}
                />
              </div>
            </>
          }
          onViewProfile={() => {
            navigate(
              Object.keys(pageTitles.participant).find(
                (key) =>
                  pageTitles.participant[key] ===
                  pageTitles.participant["/participant/profile"]
              )
            );
          }}
        />

        {/* Filters */}
        <div className={cn(FLEX_ROW_CENTER, GAP.sm, "mb-6 overflow-x-auto")}>
          {[
            { key: "all", label: "All", bg: "bg-primary" },
            { key: "pending", label: "Pending", bg: "bg-orange-600" },
            { key: "confirmed", label: "Confirmed", bg: "bg-purple-600" },
            { key: "inprogress", label: "In Progress", bg: "bg-yellow-600" },
            { key: "completed", label: "Completed", bg: "bg-green-600" },
            { key: "cancelled", label: "Cancelled", bg: "bg-red-600" },
          ].map(({ key, label, bg }) => (
            <button
              key={key}
              onClick={() => {
                setStatusFilter(key);
                setCurrentPage(1);
              }}
              className={cn(
                "px-3 py-1 rounded-full text-xs md:text-sm font-montserrat-semibold whitespace-nowrap transition-colors flex items-center gap-2",
                statusFilter === key
                  ? `${bg} text-white`
                  : "bg-white text-gray-600 border border-gray-300 hover:bg-gray-100"
              )}
            >
              {label}
              <span
                className={cn(
                  "px-1.5 py-0.5 rounded-full text-xs",
                  statusFilter === key
                    ? `${bg}/10 text-white`
                    : `${bg} text-white`
                )}
              >
                {getStatusCount(key)}
              </span>
            </button>
          ))}
        </div>

        {/* Search and View Toggle */}
        <div className={cn(FLEX_ROW_CENTER, GAP.lg, "mb-6")}>
          <div className={cn("flex bg-white border border-gray-300 rounded-lg overflow-hidden shadow-sm")}> 
            <Button
              variant="ghost"
              onClick={() => setViewMode("grid")}
              className={cn(
                BUTTON_BASE,
                "px-4 py-2 flex items-center gap-2",
                viewMode === "grid" ? "bg-primary text-white rounded-r-none" : "text-gray-600 hover:bg-gray-100"
              )}
            >
              <Widget size={24} />
              Grid
            </Button>
            <Button
              variant="ghost"
              onClick={() => setViewMode("list")}
              className={cn(
                BUTTON_BASE,
                "px-4 py-2 flex items-center gap-2",
                viewMode === "list" ? "bg-primary text-white rounded-l-none" : "text-gray-600 hover:bg-gray-100"
              )}
            >
              <List size={24} />
              List
            </Button>
          </div>
        </div>

        {/* Shifts Grid/List */}
        <div className={cn(viewMode === "grid" ? GRID_RESPONSIVE : FLEX_COL, GAP.xl)}>
          {paginatedShifts.map((shift: any) => (
            <ShiftCard
              key={shift._id}
              shift={shift}
              onClick={() => setSelectedShift(shift)}
              viewMode={viewMode}
            />
          ))}
        </div>

        {/* No Results */}
        {paginatedShifts.length === 0 && (
          <div className={cn(EMPTY_STATE, "py-12 text-center")}>
            <p className={cn(HEADING_5)}>No shifts found</p>
            <p className={cn(TEXT_MUTED, "mt-2")}>Try adjusting your search or filters</p>
          </div>
        )}

        {/* Pagination and Items Per Page */}
        {filteredShifts.length > 0 && (
          <div className="flex items-center justify-between mt-6">
            <div className={cn(FLEX_ROW_CENTER, GAP.lg)}>
                <p className={cn(TEXT_SMALL, TEXT_MUTED)}>
                  Showing {" "}
                  <span className="font-montserrat-semibold">
                    {Math.min(itemsPerPage, paginatedShifts.length)}
                  </span>{" "}
                  of <span className="font-montserrat-semibold">{filteredShifts.length}</span>{" "}
                  entries
                </p>

              {/* Items Per Page Selector */}
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">Show:</span>
                <Select
                  value={itemsPerPage.toString()}
                  onValueChange={(value) => {
                    setItemsPerPage(Number(value));
                    setCurrentPage(1);
                  }}
                >
                  <SelectTrigger className="w-20 h-8">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="5">5</SelectItem>
                    <SelectItem value="10">10</SelectItem>
                    <SelectItem value="20">20</SelectItem>
                    <SelectItem value="50">50</SelectItem>
                  </SelectContent>
                </Select>
                <span className="text-sm text-gray-600">per page</span>
              </div>
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className={cn(FLEX_ROW_CENTER, GAP.md)}>
                <Button
                  onClick={() =>
                    setCurrentPage((prev) => Math.max(1, prev - 1))
                  }
                  disabled={currentPage === 1}
                  className={cn(BUTTON_BASE, "border-gray-200 border")}
                  variant="outline"
                >
                  Previous
                </Button>
                {[...Array(totalPages)].map((_, idx) => (
                  <Button
                    key={idx}
                    onClick={() => setCurrentPage(idx + 1)}
                    className={cn(
                      BUTTON_BASE,
                      "px-3 py-1 rounded-md text-sm font-montserrat-semibold transition-colors",
                      currentPage === idx + 1
                        ? "bg-primary text-white"
                        : "bg-white text-gray-600 border border-gray-300 hover:bg-gray-100"
                    )}
                  >
                    {idx + 1}
                  </Button>
                ))}
                <Button
                  onClick={() =>
                    setCurrentPage((prev) => Math.min(totalPages, prev + 1))
                  }
                  disabled={currentPage === totalPages}
                  className={cn(BUTTON_BASE, "border-gray-200")}
                  variant="outline"
                >
                  Next
                </Button>
              </div>
            )}
          </div>
        )}

        {/* Shift Details Dialog */}
        <ShiftDetailsDialog
          viewMode="worker"
          currentUserId={user._id}
          shift={selectedShift}
          open={!!selectedShift}
          onOpenChange={(open) => !open && setSelectedShift(null)}
        />
      </div>
    </div>
  );
};

export default ShiftsPage;
