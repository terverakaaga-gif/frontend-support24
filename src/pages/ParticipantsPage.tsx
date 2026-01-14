import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import {
  Magnifer,
  BellBing,
  UsersGroupRounded,
  Calendar,
  ClockCircle,
  MapPoint,
  AltArrowRight,
  AddCircle,
} from "@solar-icons/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card } from "@/components/ui/card";

// Mock data
const participants = [
  {
    id: 1,
    name: "Sarah Reves",
    status: "On track",
    statusType: "success",
    ndisNo: "12345",
    age: "37 Years",
    supportWorkers: 3,
    budgetUtilization: 65,
    planExpiryDate: "15 Nov, 2025",
    nextReviewDate: "2 Dec, 2025",
    location: "123 Main Street",
    avatar: null,
  },
  {
    id: 2,
    name: "Sarah Reves",
    status: "Attention needed",
    statusType: "warning",
    ndisNo: "12345",
    age: "37 Years",
    supportWorkers: 3,
    budgetUtilization: 65,
    planExpiryDate: "15 Nov, 2025",
    nextReviewDate: "2 Dec, 2025",
    location: "123 Main Street",
    avatar: null,
  },
  {
    id: 3,
    name: "Sarah Reves",
    status: "Urgent",
    statusType: "danger",
    ndisNo: "12345",
    age: "37 Years",
    supportWorkers: 3,
    budgetUtilization: 65,
    planExpiryDate: "15 Nov, 2025",
    nextReviewDate: "2 Dec, 2025",
    location: "123 Main Street",
    avatar: null,
  },
  {
    id: 4,
    name: "Sarah Reves",
    status: "Attention needed",
    statusType: "warning",
    ndisNo: "12345",
    age: "37 Years",
    supportWorkers: 3,
    budgetUtilization: 65,
    planExpiryDate: "15 Nov, 2025",
    nextReviewDate: "2 Dec, 2025",
    location: "123 Main Street",
    avatar: null,
  },
  {
    id: 5,
    name: "Sarah Reves",
    status: "On track",
    statusType: "success",
    ndisNo: "12345",
    age: "37 Years",
    supportWorkers: 3,
    budgetUtilization: 65,
    planExpiryDate: "15 Nov, 2025",
    nextReviewDate: "2 Dec, 2025",
    location: "123 Main Street",
    avatar: null,
  },
  {
    id: 6,
    name: "Sarah Reves",
    status: "Urgent",
    statusType: "danger",
    ndisNo: "12345",
    age: "37 Years",
    supportWorkers: 3,
    budgetUtilization: 65,
    planExpiryDate: "15 Nov, 2025",
    nextReviewDate: "2 Dec, 2025",
    location: "123 Main Street",
    avatar: null,
  },
  {
    id: 7,
    name: "Sarah Reves",
    status: "Urgent",
    statusType: "danger",
    ndisNo: "12345",
    age: "37 Years",
    supportWorkers: 3,
    budgetUtilization: 65,
    planExpiryDate: "15 Nov, 2025",
    nextReviewDate: "2 Dec, 2025",
    location: "123 Main Street",
    avatar: null,
  },
  {
    id: 8,
    name: "Sarah Reves",
    status: "On track",
    statusType: "success",
    ndisNo: "12345",
    age: "37 Years",
    supportWorkers: 3,
    budgetUtilization: 65,
    planExpiryDate: "15 Nov, 2025",
    nextReviewDate: "2 Dec, 2025",
    location: "123 Main Street",
    avatar: null,
  },
  {
    id: 9,
    name: "Sarah Reves",
    status: "Attention needed",
    statusType: "warning",
    ndisNo: "12345",
    age: "37 Years",
    supportWorkers: 3,
    budgetUtilization: 65,
    planExpiryDate: "15 Nov, 2025",
    nextReviewDate: "2 Dec, 2025",
    location: "123 Main Street",
    avatar: null,
  },
];

export default function ParticipantsPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [planExpiryFilter, setPlanExpiryFilter] = useState("");
  const [budgetStatusFilter, setBudgetStatusFilter] = useState("");
  const [lastContactFilter, setLastContactFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const getFilteredParticipants = () => {
    let filtered = [...participants];

    // Apply search filter
    if (searchQuery) {
      filtered = filtered.filter((p) =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Apply budget status filter
    if (budgetStatusFilter) {
      filtered = filtered.filter((p) => {
        if (budgetStatusFilter === "on-track") return p.statusType === "success";
        if (budgetStatusFilter === "attention") return p.statusType === "warning";
        if (budgetStatusFilter === "urgent") return p.statusType === "danger";
        return true;
      });
    }

    return filtered;
  };

  const filteredParticipants = getFilteredParticipants();
  const totalPages = Math.ceil(filteredParticipants.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedParticipants = filteredParticipants.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-3xl font-montserrat-bold text-gray-900 mb-2">
            Participants
          </h1>
          <p className="text-gray-600 font-montserrat">
            Manage all participants, their plans, providers, budgets and progress
          </p>
        </div>
        <div className="flex items-center gap-4">
          {/* Notification */}
          <Button variant="ghost" size="icon" className="relative">
            <BellBing className="h-6 w-6 text-gray-700" />
            <span className="absolute top-1 right-1 h-2 w-2 bg-red-500 rounded-full"></span>
          </Button>

          {/* User Avatar */}
          <Avatar className="h-10 w-10 cursor-pointer">
            <AvatarImage src={user?.profileImage || undefined} />
            <AvatarFallback className="bg-primary-100 text-primary-700 font-montserrat-semibold">
              {user?.firstName?.charAt(0)}{user?.lastName?.charAt(0)}
            </AvatarFallback>
          </Avatar>

          {/* Create New Participant Button */}
          <Button
            onClick={() => navigate("/support-coordinator/participants/create")}
            className="bg-primary-600 hover:bg-primary-700 text-white font-montserrat-semibold px-6"
          >
            <AddCircle className="h-5 w-5 mr-2" />
            Create New Participant
          </Button>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="flex items-center gap-4 mb-6">
        {/* Search Bar */}
        <div className="relative flex-1 max-w-md">
          <Input
            type="text"
            placeholder="Search by participant name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-white border-gray-200"
          />
          <Magnifer className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
        </div>

        {/* Plan Expiry Date Filter */}
        <Select value={planExpiryFilter} onValueChange={setPlanExpiryFilter}>
          <SelectTrigger className="w-[180px] bg-white">
            <SelectValue placeholder="Plan expiry date" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="30-days">30 days</SelectItem>
            <SelectItem value="60-days">60 days</SelectItem>
            <SelectItem value="90-days">90 days</SelectItem>
          </SelectContent>
        </Select>

        {/* Budget Status Filter */}
        <Select value={budgetStatusFilter} onValueChange={setBudgetStatusFilter}>
          <SelectTrigger className="w-[180px] bg-white">
            <SelectValue placeholder="Budget status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="on-track">On track</SelectItem>
            <SelectItem value="attention">Attention needed</SelectItem>
            <SelectItem value="urgent">Urgent</SelectItem>
          </SelectContent>
        </Select>

        {/* Last Contact Date Filter */}
        <Select value={lastContactFilter} onValueChange={setLastContactFilter}>
          <SelectTrigger className="w-[200px] bg-white">
            <SelectValue placeholder="Last contact date" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="oldest">Oldest</SelectItem>
            <SelectItem value="newest">Newest</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Participant Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
        {paginatedParticipants.map((participant) => (
          <Card
            key={participant.id}
            className="p-5 border border-gray-200 rounded-xl hover:shadow-lg transition-shadow bg-white"
          >
            {/* Header with Avatar and Status */}
            <div className="flex items-start gap-3 mb-4">
              <Avatar className="h-12 w-12">
                <AvatarFallback className="bg-primary-100 text-primary-700 font-montserrat-semibold">
                  {participant.name.split(" ").map((n) => n[0]).join("")}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <h4 className="font-montserrat-bold text-gray-900 mb-1">
                  {participant.name}
                </h4>
                <Badge
                  className={`text-xs font-montserrat-semibold ${
                    participant.statusType === "success"
                      ? "bg-green-100 text-green-700"
                      : participant.statusType === "warning"
                      ? "bg-yellow-100 text-yellow-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {participant.status}
                </Badge>
              </div>
            </div>

            {/* Participant Details */}
            <div className="space-y-2 mb-4">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">NDIS No: {participant.ndisNo}</span>
                <span className="text-gray-600">Age: {participant.age}</span>
              </div>
              <div className="flex items-center gap-2">
                <UsersGroupRounded className="h-4 w-4 text-primary-600" />
                <span className="text-sm font-montserrat-semibold text-gray-900">
                  {participant.supportWorkers}
                </span>
              </div>
            </div>

            {/* Budget Utilization */}
            <div className="mb-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-montserrat text-gray-600">
                  Budget Utilization
                </span>
                <span className="text-sm font-montserrat-semibold text-gray-900">
                  {participant.budgetUtilization}% Complete
                </span>
              </div>
              <Progress
                value={participant.budgetUtilization}
                className="h-2"
              />
            </div>

            {/* Important Dates */}
            <div className="space-y-2 mb-4">
              <div className="flex items-center gap-2 text-xs text-gray-600">
                <Calendar className="h-4 w-4" />
                <span>
                  {participant.planExpiryDate} (Plan expiry date)
                </span>
              </div>
              {participant.location && (
                <div className="flex items-center gap-2 text-xs text-gray-600">
                  <MapPoint className="h-4 w-4" />
                  <span>{participant.location}</span>
                </div>
              )}
              <div className="flex items-center gap-2 text-xs text-gray-600">
                <ClockCircle className="h-4 w-4" />
                <span>
                  {participant.nextReviewDate} ( Next review date)
                </span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-2">
              <Button
                className="flex-1 bg-primary-50 hover:bg-primary-100 text-primary-600 font-montserrat-semibold border-0 gap-2"
                onClick={() =>
                  navigate(`/support-coordinator/participants/${participant.id}`)
                }
              >
                <div className="h-5 w-5 rounded-full bg-primary-600 flex items-center justify-center">
                  <AltArrowRight className="h-3 w-3 text-white" />
                </div>
                View Details
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="border-gray-300 hover:bg-gray-50 h-10 w-10 rounded-lg"
              >
                <AltArrowRight className="h-5 w-5 text-gray-600" />
              </Button>
            </div>
          </Card>
        ))}
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-600">
          Showing <span className="font-montserrat-semibold">{itemsPerPage}</span>{" "}
          entries
        </p>
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
            disabled={currentPage === 1}
          >
            ‹
          </Button>
          {Array.from({ length: Math.min(5, totalPages) }, (_, i) => i + 1).map(
            (page) => (
              <Button
                key={page}
                className={`h-8 w-8 ${
                  currentPage === page
                    ? "bg-primary-600 text-white hover:bg-primary-700"
                    : "bg-transparent text-gray-700 hover:bg-gray-100"
                }`}
                onClick={() => setCurrentPage(page)}
              >
                {page}
              </Button>
            )
          )}
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
            disabled={currentPage === totalPages}
          >
            ›
          </Button>
        </div>
      </div>
    </div>
  );
}

