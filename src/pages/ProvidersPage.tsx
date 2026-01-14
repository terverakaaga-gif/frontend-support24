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
import { ViewPerformanceModal } from "@/components/providers/ViewPerformanceModal";
import { RemoveProviderModal } from "@/components/providers/RemoveProviderModal";

// Mock data
const providers = [
  {
    id: 1,
    name: "Hope Care Services Ltd",
    status: "Active",
    serviceType: "Personal Care",
    startDate: "Jan 15, 2025",
    participants: 3,
    logo: null,
  },
  {
    id: 2,
    name: "Hope Care Services Ltd",
    status: "Active",
    serviceType: "Personal Care",
    startDate: "Jan 15, 2025",
    participants: 3,
    logo: null,
  },
  {
    id: 3,
    name: "Hope Care Services Ltd",
    status: "Active",
    serviceType: "Personal Care",
    startDate: "Jan 15, 2025",
    participants: 3,
    logo: null,
  },
];

interface Provider {
  id: number;
  name: string;
  status: string;
  serviceType: string;
  startDate: string;
  participants: number;
  logo: string | null;
}

export default function ProvidersPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [serviceTypeFilter, setServiceTypeFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [selectedProvider, setSelectedProvider] = useState<Provider | null>(null);
  const [showPerformanceModal, setShowPerformanceModal] = useState(false);
  const [showRemoveModal, setShowRemoveModal] = useState(false);

  const handleViewPerformance = (provider: Provider) => {
    setSelectedProvider(provider);
    setShowPerformanceModal(true);
  };

  const handleRemoveClick = (provider: Provider) => {
    setSelectedProvider(provider);
    setShowRemoveModal(true);
  };

  const handleRemoveConfirm = () => {
    // Handle remove logic here
    console.log("Removing provider:", selectedProvider);
    setShowRemoveModal(false);
    setSelectedProvider(null);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-3xl font-montserrat-bold text-gray-900 mb-2">
            Providers
          </h1>
          <p className="text-gray-600 font-montserrat">
            Manage all providers
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
        </div>
      </div>

      {/* Search and Filters */}
      <div className="flex items-center gap-4 mb-6">
        {/* Search Bar */}
        <div className="relative flex-1 max-w-md">
          <Input
            type="text"
            placeholder="Search by provider name..."
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
            <SelectItem value="support-worker">Support Worker</SelectItem>
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

      {/* Provider Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {providers.map((provider) => (
          <Card
            key={provider.id}
            className="p-5 border border-gray-200 rounded-xl hover:shadow-lg transition-shadow bg-white"
          >
            {/* Header with Logo and Badge */}
            <div className="flex items-start gap-3 mb-4">
              <div className="h-12 w-12 rounded-full  flex items-center justify-center">
                {/* <svg className="h-8 w-8 text-white" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2L2 7v10c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-10-5z" />
                </svg> */}
                <img src="/tdesign_logo-cnb-filled.png" alt="Provider Logo" className="h-8 w-8" />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="font-montserrat-bold text-gray-900 mb-1">
                  {provider.name}
                </h4>
                <Badge className="bg-green-100 text-green-700 text-xs font-montserrat-semibold">
                  {provider.status}
                </Badge>
              </div>
              <div className="flex items-center gap-1">
                <UsersGroupRounded className="h-4 w-4 text-primary-600" />
                <span className="text-sm font-montserrat-semibold text-primary-600">
                  {provider.participants}
                </span>
              </div>
            </div>

            {/* Provider Details */}
            <div className="space-y-2 mb-4">
              <div className="text-sm">
                <span className="text-gray-600">Service Type: </span>
                <span className="font-montserrat-semibold text-gray-900">
                  {provider.serviceType}
                </span>
              </div>
              <div className="text-sm">
                <span className="text-gray-600">Start Date: </span>
                <span className="font-montserrat-semibold text-gray-900">
                  {provider.startDate}
                </span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-2">
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
                onClick={() => handleViewPerformance(provider)}
              >
                <Chart className="h-5 w-5 text-primary-600" />
              </Button>
              <Button
                variant="outline"
                className="flex-1 border-red-200 text-red-600 hover:bg-red-50 font-montserrat-semibold"
                onClick={() => handleRemoveClick(provider)}
              >
                Remove
              </Button>
            </div>
          </Card>
        ))}
      </div>

      {/* Modals */}
      <ViewPerformanceModal
        open={showPerformanceModal}
        onOpenChange={setShowPerformanceModal}
        provider={selectedProvider}
      />

      <RemoveProviderModal
        open={showRemoveModal}
        onOpenChange={setShowRemoveModal}
        provider={selectedProvider}
        onConfirm={handleRemoveConfirm}
      />
    </div>
  );
}

