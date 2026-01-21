import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import {
  Magnifer,
  BellBing,
  Letter,
  Chart,
  UsersGroupRounded,
} from "@solar-icons/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { ViewWorkerPerformanceModal } from "@/components/support-workers/ViewWorkerPerformanceModal";
import { RemoveWorkerModal } from "@/components/support-workers/RemoveWorkerModal";
import { WorkerDetailsModal } from "@/components/support-workers/WorkerDetailsModal";

// Mock data
const supportWorkers = [
  {
    id: 1,
    name: "Grace Lemmy",
    status: "Active",
    serviceType: "Personal Care",
    startDate: "Jan 15, 2025",
    participants: 3,
    avatar: null,
  },
  {
    id: 2,
    name: "Grace Lemmy",
    status: "Active",
    serviceType: "Personal Care",
    startDate: "Jan 15, 2025",
    participants: 3,
    avatar: null,
  },
  {
    id: 3,
    name: "Grace Lemmy",
    status: "Active",
    serviceType: "Personal Care",
    startDate: "Jan 15, 2025",
    participants: 3,
    avatar: null,
  },
];

interface SupportWorker {
  id: number;
  name: string;
  status: string;
  serviceType: string;
  startDate: string;
  participants: number;
  avatar: string | null;
}

export default function CoordinatorSupportWorkersPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [serviceTypeFilter, setServiceTypeFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [selectedWorker, setSelectedWorker] = useState<SupportWorker | null>(null);
  const [showPerformanceModal, setShowPerformanceModal] = useState(false);
  const [showRemoveModal, setShowRemoveModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);

  const handleViewPerformance = (worker: SupportWorker) => {
    setSelectedWorker(worker);
    setShowPerformanceModal(true);
  };

  const handleRemoveClick = (worker: SupportWorker) => {
    setSelectedWorker(worker);
    setShowRemoveModal(true);
  };

  const handleViewDetails = (worker: SupportWorker) => {
    setSelectedWorker(worker);
    setShowDetailsModal(true);
  };

  const handleRemoveConfirm = () => {
    // Handle remove logic here
    console.log("Removing worker:", selectedWorker);
    setShowRemoveModal(false);
    setSelectedWorker(null);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-3xl font-montserrat-bold text-gray-900 mb-2">
            Support Workers
          </h1>
          <p className="text-gray-600 font-montserrat">
            Manage all support workers
          </p>
        </div>
        <div className="flex items-center gap-4">
          {/* Notification */}
          <Button
            variant="ghost"
            size="icon"
            className="relative"
            onClick={() => navigate("/support-coordinator/notifications")}
          >
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
        </div>
      </div>

      {/* Search and Filters */}
      <div className="flex items-center gap-4 mb-6">
        {/* Search Bar */}
        <div className="relative flex-1 max-w-md">
          <Input
            type="text"
            placeholder="Search by support worker name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-white border-gray-200"
          />
          <Magnifer className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
        </div>

        {/* Service Type Filter */}
        <Select value={serviceTypeFilter} onValueChange={setServiceTypeFilter}>
          <SelectTrigger className="w-[180px] bg-white">
            <SelectValue placeholder="Service type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="personal-care">Personal Care</SelectItem>
            <SelectItem value="sil">SIL</SelectItem>
            <SelectItem value="community-support">Community Support</SelectItem>
          </SelectContent>
        </Select>

        {/* Status Filter */}
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[180px] bg-white">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="inactive">Inactive</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Support Worker Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {supportWorkers.map((worker) => (
          <Card
            key={worker.id}
            className="p-5 border border-gray-200 rounded-xl hover:shadow-lg transition-shadow bg-white cursor-pointer"
            onClick={() => handleViewDetails(worker)}
          >
            {/* Header with Avatar and Badge */}
            <div className="flex items-start gap-3 mb-4">
              <Avatar className="h-12 w-12">
                <AvatarImage src={worker.avatar || undefined} />
                <AvatarFallback className="bg-red-100 text-red-700 font-montserrat-semibold">
                  {worker.name.split(" ").map(n => n.charAt(0)).join("")}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <h4 className="font-montserrat-bold text-gray-900 mb-1">
                  {worker.name}
                </h4>
                <Badge className="bg-green-100 text-green-700 text-xs font-montserrat-semibold">
                  {worker.status}
                </Badge>
              </div>
              <div className="flex items-center gap-1">
                <UsersGroupRounded className="h-4 w-4 text-primary-600" />
                <span className="text-sm font-montserrat-semibold text-primary-600">
                  {worker.participants}
                </span>
              </div>
            </div>

            {/* Worker Details */}
            <div className="space-y-2 mb-4">
              <div className="text-sm">
                <span className="text-gray-600">Service Type: </span>
                <span className="font-montserrat-semibold text-gray-900">
                  {worker.serviceType}
                </span>
              </div>
              <div className="text-sm">
                <span className="text-gray-600">Start Date: </span>
                <span className="font-montserrat-semibold text-gray-900">
                  {worker.startDate}
                </span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
              <Button
                variant="ghost"
                size="icon"
                className="h-10 w-10 rounded-lg hover:bg-primary-50"
              >
                <Letter className="h-5 w-5 text-primary-600" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-10 w-10 rounded-lg hover:bg-primary-50"
                onClick={(e) => {
                  e.stopPropagation();
                  handleViewPerformance(worker);
                }}
              >
                <Chart className="h-5 w-5 text-primary-600" />
              </Button>
              <Button
                variant="outline"
                className="flex-1 border-red-200 text-red-600 hover:bg-red-50 font-montserrat-semibold"
                onClick={(e) => {
                  e.stopPropagation();
                  handleRemoveClick(worker);
                }}
              >
                Remove
              </Button>
            </div>
          </Card>
        ))}
      </div>

      {/* Modals */}
      <ViewWorkerPerformanceModal
        open={showPerformanceModal}
        onOpenChange={setShowPerformanceModal}
        worker={selectedWorker}
      />

      <RemoveWorkerModal
        open={showRemoveModal}
        onOpenChange={setShowRemoveModal}
        worker={selectedWorker}
        onConfirm={handleRemoveConfirm}
      />

      <WorkerDetailsModal
        open={showDetailsModal}
        onOpenChange={setShowDetailsModal}
        worker={selectedWorker}
      />
    </div>
  );
}

