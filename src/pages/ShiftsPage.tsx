import React, { useState } from "react";
import {
  Search,
  MapPin,
  Calendar,
  Clock,
  ChevronLeft,
  ChevronRight,
  X,
  Grid3x3,
  List,
  ArrowRight,
  User,
  User2,
} from "lucide-react";
import { useGetShifts } from "@/hooks/useShiftHooks";
import Loader from "@/components/Loader";
import { useQuery } from "@tanstack/react-query";
import shiftService from "@/api/services/shiftService";
import * as Dialog from "@radix-ui/react-dialog";

const ShiftsPage = () => {
  const [statusFilter, setStatusFilter] = useState("all");
  const [viewMode, setViewMode] = useState("grid");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedShift, setSelectedShift] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // fetch shifts data from API
  // Fetch shifts data
  const {
    data: shifts = [],
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["support-worker-shifts"],
    queryFn: () => shiftService.getShifts(),
  });

  const getStatusBadgeStyle = (status) => {
    switch (status.toLowerCase()) {
      case "confirmed":
        return "bg-blue-50 text-primary border-blue-200";
      case "pending":
        return "bg-orange-50 text-orange-600 border-orange-200";
      case "in_progress":
        return "bg-purple-50 text-purple-600 border-purple-200";
      case "completed":
        return "bg-green-50 text-green-600 border-green-200";
      case "cancelled":
        return "bg-red-50 text-red-600 border-red-200";
      default:
        return "bg-gray-50 text-gray-600 border-gray-200";
    }
  };

  const getStatusLabel = (status) => {
    return (
      status.replace(/_/g, " ").charAt(0).toUpperCase() +
      status.replace(/_/g, " ").slice(1)
    );
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  const formatLongDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  };

  const getStatusCount = (status) => {
    if (status === "all") return shifts.length;
    return shifts.filter((s) => s.status.toLowerCase() === status).length;
  };

  const filteredShifts = shifts.filter((shift) => {
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

  const ShiftCard = ({ shift }) => (
    <div
      className="bg-white border font-sans border-gray-200 rounded-lg p-5 hover:shadow-lg transition-shadow cursor-pointer"
      onClick={() => setSelectedShift(shift)}
    >
      <div className="flex justify-between items-start">
        <div className="font-montserrat-semibold flex gap-1 items-center">
          <h3 className="font-semibold text-gray-900 text-base mb-2">
            {shift.serviceTypeId.name}
          </h3>
          <span
            className={`p-1 text-xs border rounded-full ${getStatusBadgeStyle(
              shift.status
            )}`}
          >
            {getStatusLabel(shift.status)}
          </span>
        </div>
        <div className="flex -space-x-2">
          <img
            src={`https://i.pravatar.cc/32?img=${parseInt(shift._id) % 10}`}
            alt="Avatar"
            className="w-8 h-8 rounded-full border-2 border-white"
          />
          <img
            src={`https://i.pravatar.cc/32?img=${
              (parseInt(shift._id) + 1) % 10
            }`}
            alt="Avatar"
            className="w-8 h-8 rounded-full border-2 border-white"
          />
        </div>
      </div>

      <div className="font-montserrat-semibold flex gap-1 items-center text-sm">
        <div className="flex items-center text-gray-600">
          <span className="text-gray-500">
            Date: {formatDate(shift.startTime)}
          </span>
        </div>
        |
        <div className="flex items-center text-gray-600">
          <span className="text-gray-500">
            Time: {formatTime(shift.startTime)} - {formatTime(shift.endTime)}
          </span>
        </div>
      </div>

      <div className="flex justify-between items-center mt-4 gap-3">
        <div className="flex text-sm font-montserrat-medium gap-2 flex-1 min-w-0">
          <div className="bg-gray-100 rounded-full border border-gray-300 p-1 flex items-center gap-1 text-gray-600">
            <User2 />
            <span className="font-medium">
              {shift.participantId?.firstName} {shift.participantId?.lastName}
            </span>
          </div>
          <div className="bg-gray-100 rounded-full border border-gray-300 p-1 flex items-center gap-1 text-gray-600">
            <MapPin className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
            <span className="text-gray-500 line-clamp-1">{shift.address}</span>
          </div>
        </div>
        <button className="bg-primary hover:bg-blue-600 text-white p-2 rounded-full flex items-center justify-center gap-2 transition-colors">
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );

  // Show loading state
  if (isLoading) {
    return <Loader />;
  }

  console.log("shifts:", shifts);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="px-8 py-6">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Shifts</h1>
          <p className="text-gray-600">
            Manage your schedules and view upcoming assignments
          </p>
        </div>

        {/* Filters */}
        <div className="font-montserrat-semibold flex gap-2 mb-6 overflow-x-auto pb-2">
          <button
            onClick={() => {
              setStatusFilter("all");
              setCurrentPage(1);
            }}
            className={`px-4 py-2 rounded-full text-sm  whitespace-nowrap transition-colors flex items-center gap-2 ${
              statusFilter === "all"
                ? "bg-primary text-white"
                : "bg-white text-gray-600 border border-gray-300 hover:bg-gray-50"
            }`}
          >
            All
            <span
              className={`px-1.5 py-0.5 rounded-full text-xs ${
                statusFilter === "all" ? "bg-white text-primary" : "bg-gray-100"
              }`}
            >
              {getStatusCount("all")}
            </span>
          </button>
          <button
            onClick={() => {
              setStatusFilter("pending");
              setCurrentPage(1);
            }}
            className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors flex items-center gap-2 ${
              statusFilter === "pending"
                ? "bg-orange-600 text-white"
                : "bg-white text-gray-600 border border-gray-300 hover:bg-gray-50"
            }`}
          >
            Pending
            <span
              className={`px-1.5 py-0.5 rounded-full text-xs ${
                statusFilter === "pending"
                  ? "bg-white text-orange-600"
                  : "bg-orange-100"
              }`}
            >
              {getStatusCount("pending")}
            </span>
          </button>
          <button
            onClick={() => {
              setStatusFilter("confirmed");
              setCurrentPage(1);
            }}
            className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors flex items-center gap-2 ${
              statusFilter === "confirmed"
                ? "bg-purple-600 text-white"
                : "bg-white text-purple-600 border border-gray-300 hover:bg-gray-50"
            }`}
          >
            Confirmed
            <span
              className={`px-1.5 py-0.5 rounded-full text-xs ${
                statusFilter === "confirmed"
                  ? "bg-white text-purple-600"
                  : "bg-purple-100"
              }`}
            >
              {getStatusCount("confirmed")}
            </span>
          </button>
          <button
            onClick={() => {
              setStatusFilter("in_progress");
              setCurrentPage(1);
            }}
            className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors flex items-center gap-2 ${
              statusFilter === "in_progress"
                ? "bg-yellow-600 text-white"
                : "bg-white text-yellow-600 border border-gray-300 hover:bg-gray-50"
            }`}
          >
            In Progress
            <span
              className={`px-1.5 py-0.5 rounded-full text-xs ${
                statusFilter === "in_progress"
                  ? "bg-white text-primary"
                  : "bg-gray-100"
              }`}
            >
              {getStatusCount("in_progress")}
            </span>
          </button>
          <button
            onClick={() => {
              setStatusFilter("completed");
              setCurrentPage(1);
            }}
            className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors flex items-center gap-2 ${
              statusFilter === "completed"
                ? "bg-green-600 text-white"
                : "bg-white text-green-600 border border-gray-300 hover:bg-gray-50"
            }`}
          >
            Completed
            <span
              className={`px-1.5 py-0.5 rounded-full text-xs ${
                statusFilter === "completed"
                  ? "bg-white text-primary"
                  : "bg-gray-100"
              }`}
            >
              {getStatusCount("completed")}
            </span>
          </button>
          <button
            onClick={() => {
              setStatusFilter("cancelled");
              setCurrentPage(1);
            }}
            className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors flex items-center gap-2 ${
              statusFilter === "cancelled"
                ? "bg-red-600 text-white"
                : "bg-white text-red-600 border border-gray-300 hover:bg-gray-50"
            }`}
          >
            Cancelled
            <span
              className={`px-1.5 py-0.5 rounded-full text-xs ${
                statusFilter === "cancelled"
                  ? "bg-white text-red-600"
                  : "bg-gray-100"
              }`}
            >
              {getStatusCount("cancelled")}
            </span>
          </button>
        </div>

        {/* Search and View Toggle */}
        <div className="flex gap-4 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search shifts here...."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div className="flex bg-white border border-gray-300 rounded-md">
            <button
              onClick={() => setViewMode("grid")}
              className={`px-4 py-2 flex items-center gap-2 text-sm font-medium transition-colors ${
                viewMode === "grid"
                  ? "bg-primary text-white"
                  : "text-gray-600 hover:bg-gray-50"
              } rounded-l-md`}
            >
              <Grid3x3 className="w-4 h-4" />
              Grid
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={`px-4 py-2 flex items-center gap-2 text-sm font-medium transition-colors ${
                viewMode === "list"
                  ? "bg-primary text-white"
                  : "text-gray-600 hover:bg-gray-50"
              } rounded-r-md`}
            >
              <List className="w-4 h-4" />
              List
            </button>
          </div>
        </div>

        {/* Shifts Grid */}
        <div
          className={`grid gap-5 ${
            viewMode === "grid"
              ? "md:grid-cols-2 lg:grid-cols-3"
              : "grid-cols-1"
          }`}
        >
          {paginatedShifts.map((shift) => (
            <ShiftCard key={shift._id} shift={shift} />
          ))}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between mt-6">
            <p className="text-sm text-gray-600">
              Showing <span className="font-medium">{itemsPerPage}</span>{" "}
              entries
            </p>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
                className="p-2 rounded-md border border-gray-300 bg-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              {[...Array(totalPages)].map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentPage(idx + 1)}
                  className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                    currentPage === idx + 1
                      ? "bg-primary text-white"
                      : "bg-white text-gray-600 border border-gray-300 hover:bg-gray-50"
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
                className="p-2 rounded-md border border-gray-300 bg-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Shift Detail Modal */}
        <Dialog.Root open={!!selectedShift} onOpenChange={() => setSelectedShift(null)}>
          <Dialog.Portal>
            <Dialog.Overlay className="fixed inset-0 bg-black bg-opacity-50 z-50" />
            <Dialog.Content className="fixed top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] bg-white rounded-lg max-w-lg w-[90vw] max-h-[90vh] overflow-y-auto p-6 z-50">
              <Dialog.Close className="absolute right-4 top-4 p-1 hover:bg-gray-100 rounded-full">
          <X className="w-5 h-5 text-gray-500" />
              </Dialog.Close>

              {selectedShift && (
          <>
            <div className="flex gap-1 mb-4 items-center font-montserrat-semibold">
              <Dialog.Title className="text-xl text-gray-900 mb-2">
                {selectedShift.serviceTypeId.name}
              </Dialog.Title>
              <span
                className={`px-3 py-1 text-xs font-medium border rounded-full ${getStatusBadgeStyle(
            selectedShift.status
                )}`}
              >
                {getStatusLabel(selectedShift.status)}
              </span>
            </div>

            <div className="space-y-6">
              {/* Schedule */}
              <div>
                <h3 className="text-sm font-semibold text-gray-900 mb-3">Schedule</h3>
                <div className="flex gap-3 items-center">
            <div className="flex items-start gap-3">
              <Calendar className="w-5 h-5 text-gray-400 mt-0.5" />
              <div>
                <p className="text-xs text-gray-500">Date</p>
                <p className="text-sm font-montserrat-semibold text-gray-900">
                  {formatLongDate(selectedShift.startTime)}
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Clock className="w-5 h-5 text-gray-400 mt-0.5" />
              <div>
                <p className="text-xs text-gray-500">Time</p>
                <p className="text-sm font-montserrat-semibold text-gray-900">
                  {formatTime(selectedShift.startTime)} - {formatTime(selectedShift.endTime)} (
                  {Math.round(
              (new Date(selectedShift.endTime).getTime() -
                new Date(selectedShift.startTime).getTime()) /
                60000
                  )}{" "}
                  mins)
                </p>
              </div>
            </div>
                </div>
              </div>

              {/* Location */}
              <div>
                <h3 className="text-sm font-semibold text-gray-900 mb-3">Location</h3>
                <div className="flex items-start gap-3">
            <MapPin className="w-5 h-5 text-gray-400 mt-0.5" />
            <div>
              <p className="text-xs text-gray-500 mb-1">In-person Service</p>
              <p className="text-sm font-medium text-gray-900">{selectedShift.address}</p>
            </div>
                </div>
              </div>

              {/* Shift Information */}
              <div>
                <h3 className="text-sm font-semibold text-gray-900 mb-3">Shift Information</h3>
                <div className="grid grid-cols-2 gap-y-3 text-sm">
            <div>
              <p className="text-gray-500">Shift ID:</p>
              <p className="font-medium text-gray-900">{selectedShift.shiftId}</p>
            </div>
            <div>
              <p className="text-gray-500">Service Type:</p>
              <p className="font-medium text-gray-900">{selectedShift.serviceTypeId.name}</p>
            </div>
            <div>
              <p className="text-gray-500">Requires Supervision:</p>
              <p className="font-medium text-gray-900">
                {selectedShift.requiresSupervision ? "Yes" : "No"}
              </p>
            </div>
                </div>
              </div>

              {/* Special Instructions */}
              <div>
                <h3 className="text-sm font-semibold text-gray-900 mb-3">Special Instructions</h3>
                <div className="bg-blue-50 border border-blue-100 rounded-md p-3">
            <p className="text-sm text-blue-900">{selectedShift.specialInstructions}</p>
                </div>
              </div>
            </div>
          </>
              )}
            </Dialog.Content>
          </Dialog.Portal>
        </Dialog.Root>
      </div>
    </div>
  );
};

export default ShiftsPage;
