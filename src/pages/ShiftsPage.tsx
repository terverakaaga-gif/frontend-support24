import React, { useState } from "react";
import {
  Magnifer,
  Widget,
  List,
  AltArrowLeft,
  AltArrowRight,
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

  const filteredShifts = shifts.filter((shift: any) => {
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
    <div className="min-h-screen bg-gray-100">
      <div className="px-8 py-6">
        {/* Header */}
        <GeneralHeader
          stickyTop={true}
          title={pageTitles.participant["/participant/shifts"].title}
          subtitle="Manage your care schedule and track upcoming appointments"
          user={user}
          onLogout={logout}
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
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          {[
            { key: "all", label: "All", bg: "bg-primary" },
            { key: "pending", label: "Pending", bg: "bg-orange-600" },
            { key: "confirmed", label: "Confirmed", bg: "bg-purple-600" },
            { key: "in_progress", label: "In Progress", bg: "bg-yellow-600" },
            { key: "completed", label: "Completed", bg: "bg-green-600" },
            { key: "cancelled", label: "Cancelled", bg: "bg-red-600" },
          ].map(({ key, label, bg }) => (
            <button
              key={key}
              onClick={() => {
                setStatusFilter(key);
                setCurrentPage(1);
              }}
              className={`px-4 py-2 rounded-full text-sm whitespace-nowrap transition-colors flex items-center gap-2 ${
                statusFilter === key
                  ? `${bg} text-white`
                  : "bg-white text-gray-600 border border-gray-300 hover:bg-gray-100"
              }`}
            >
              {label}
              <span
                className={`px-1.5 py-0.5 rounded-full text-xs ${
                  statusFilter === key
                    ? "bg-white text-gray-700"
                    : "bg-gray-100"
                }`}
              >
                {getStatusCount(key)}
              </span>
            </button>
          ))}
        </div>

        {/* Search and View Toggle */}
        <div className="flex gap-4 mb-6">
          <div className="flex-1 relative">
            <Magnifer className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search shifts here...."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>
          <div className="flex bg-white border border-gray-300 rounded-lg overflow-hidden shadow-sm">
            <button
              onClick={() => setViewMode("grid")}
              className={`px-4 py-2 flex items-center gap-2 text-sm font-medium transition-all duration-200 ${
                viewMode === "grid"
                  ? "bg-primary text-white"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              <Widget size={24} />
              Grid
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={`px-4 py-2 flex items-center gap-2 text-sm font-medium transition-all duration-200 ${
                viewMode === "list"
                  ? "bg-primary text-white"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              <List size={24} />
              List
            </button>
          </div>
        </div>

        {/* Shifts Grid/List */}
        <div
          className={`gap-5 ${
            viewMode === "grid"
              ? "grid md:grid-cols-2 lg:grid-cols-3"
              : "flex flex-col"
          }`}
        >
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
          <div className="text-center py-12">
            <p className="text-gray-1000 text-lg">No shifts found</p>
            <p className="text-gray-400 text-sm mt-2">
              Try adjusting your search or filters
            </p>
          </div>
        )}

        {/* Pagination and Items Per Page */}
        {filteredShifts.length > 0 && (
          <div className="flex items-center justify-between mt-6">
            <div className="flex items-center gap-4">
              <p className="text-sm text-gray-600">
                Showing{" "}
                <span className="font-medium">
                  {Math.min(itemsPerPage, paginatedShifts.length)}
                </span>{" "}
                of <span className="font-medium">{filteredShifts.length}</span>{" "}
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
              <div className="flex items-center gap-2">
                <button
                  onClick={() =>
                    setCurrentPage((prev) => Math.max(1, prev - 1))
                  }
                  disabled={currentPage === 1}
                  className="p-2 rounded-md border border-gray-300 bg-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100"
                >
                  <AltArrowLeft className="w-4 h-4" />
                </button>
                {[...Array(totalPages)].map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentPage(idx + 1)}
                    className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                      currentPage === idx + 1
                        ? "bg-primary text-white"
                        : "bg-white text-gray-600 border border-gray-300 hover:bg-gray-100"
                    }`}
                  >
                    {idx + 1}
                  </button>
                ))}
                <button
                  onClick={() =>
                    setCurrentPage((prev) => Math.min(totalPages, prev + 1))
                  }
                  disabled={currentPage === totalPages}
                  className="p-2 rounded-md border border-gray-300 bg-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100"
                >
                  <AltArrowRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        )}

        {/* Shift Details Dialog */}
        <ShiftDetailsDialog
          shift={selectedShift}
          open={!!selectedShift}
          onOpenChange={(open) => !open && setSelectedShift(null)}
        />
      </div>
    </div>
  );
};

export default ShiftsPage;
