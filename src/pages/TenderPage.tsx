import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { CreateTenderModal } from "@/components/tender/CreateTenderModal";
import {
  Documents,
  CheckCircle,
  ClockCircle,
  CourseUp,
  Chart,
  MenuDots,
  Pen,
  Copy,
  DocumentText,
  ClipboardList,
  Download,
  CloseCircle,
  BellBing,
  AddCircle,
} from "@solar-icons/react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Card } from "@/components/ui/card";

// Mock data for tenders
const mockStats = {
  totalTendersCreated: 6,
  activeTenders: 1,
  avgResponseRate: 72,
  avgTimeToAward: 5.4,
};

const mockTenders = [
  {
    id: "ST24-001234",
    status: "open" as const,
    timeline: "7 Days Minimum",
    budgetAllocation: 500000,
    diagnosisCategory: "Autism",
    participant: {
      name: "Matthew Tim",
      avatar: null,
      role: "Participant",
    },
    submissions: 3,
  },
  {
    id: "ST24-001234",
    status: "evaluation" as const,
    timeline: "7 Days Minimum",
    budgetAllocation: 500000,
    diagnosisCategory: "Autism",
    participant: {
      name: "Matthew Tim",
      avatar: null,
      role: "Participant",
    },
    submissions: 2,
  },
  {
    id: "ST24-001234",
    status: "awarded" as const,
    timeline: "7 Days Minimum",
    budgetAllocation: 500000,
    diagnosisCategory: "Autism",
    participant: {
      name: "Matthew Tim",
      avatar: null,
      role: "Participant",
    },
    submissions: 0,
    awardedTo: "HopeCare Services Ltd",
  },
  {
    id: "ST24-001234",
    status: "cancelled" as const,
    timeline: "7 Days Minimum",
    budgetAllocation: 500000,
    diagnosisCategory: "Autism",
    participant: {
      name: "Matthew Tim",
      avatar: null,
      role: "Participant",
    },
    submissions: 2,
  },
  {
    id: "ST24-001234",
    status: "evaluated" as const,
    timeline: "7 Days Minimum",
    budgetAllocation: 500000,
    diagnosisCategory: "Autism",
    participant: {
      name: "Matthew Tim",
      avatar: null,
      role: "Participant",
    },
    submissions: 2,
  },
  {
    id: "ST24-001234",
    status: "open" as const,
    timeline: "7 Days Minimum",
    budgetAllocation: 500000,
    diagnosisCategory: "Autism",
    participant: {
      name: "Matthew Tim",
      avatar: null,
      role: "Participant",
    },
    submissions: 2,
  },
];

type TenderStatus = "all" | "open" | "evaluation" | "awarded" | "cancelled";

// Local StatCard component
interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  trend?: string;
  trendUp?: boolean;
}

function StatCard({ title, value, icon: Icon, trend, trendUp = true }: StatCardProps) {
  return (
    <Card className="bg-white rounded-xl p-6 border border-gray-200">
      <div className="flex items-start justify-between mb-4">
        <div>
          <p className="text-sm font-montserrat-semibold text-gray-600 mb-2">{title}</p>
          <h3 className="text-3xl font-montserrat-bold text-gray-900">{value}</h3>
        </div>
        <div className="p-3 rounded-lg bg-primary-50">
          <Icon className="h-6 w-6 text-primary-600" />
        </div>
      </div>
      {trend && (
        <div className="flex items-center gap-1 text-sm">
          <CourseUp className="h-4 w-4 text-green-600" />
          <span className="text-green-600 font-montserrat-semibold">{trend}</span>
        </div>
      )}
    </Card>
  );
}

// Tender Card Component
interface TenderCardProps {
  tender: typeof mockTenders[0];
  onViewDetails: () => void;
}

function TenderCard({ tender, onViewDetails }: TenderCardProps) {
  const getStatusBadge = (status: string) => {
    const statusConfig = {
      open: { label: "Open", className: "bg-blue-100 text-blue-700 border-blue-200" },
      evaluation: { label: "Evaluation", className: "bg-yellow-100 text-yellow-700 border-yellow-200" },
      awarded: { label: "Awarded", className: "bg-green-100 text-green-700 border-green-200" },
      cancelled: { label: "Cancelled", className: "bg-red-100 text-red-700 border-red-200" },
      evaluated: { label: "Evaluated", className: "bg-purple-100 text-purple-700 border-purple-200" },
    };
    
    const config = statusConfig[status as keyof typeof statusConfig];
    return (
      <Badge className={`${config.className} border font-montserrat-semibold px-3 py-1 rounded-full`}>
        {config.label}
      </Badge>
    );
  };

  return (
    <Card className="bg-white rounded-xl p-6 border border-gray-200 hover:shadow-lg transition-shadow">
      {/* Header with SIL, Status, and Actions */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <span className="text-sm font-montserrat-bold text-gray-900">SIL</span>
          {getStatusBadge(tender.status)}
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-primary-600 hover:bg-primary-50"
          >
            <Chart className="h-5 w-5" />
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-12 w-12 text-primary-600 hover:bg-primary-50 rounded-lg"
              >
                <MenuDots className="h-2 w-2 text-primary-600" />
                
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-64 p-2">
              <div className="px-2 py-1.5 text-xs font-montserrat-semibold text-gray-500 uppercase">
                Action
              </div>
              <DropdownMenuItem className="flex items-center gap-3 px-3 py-2.5 cursor-pointer rounded-lg">
                <Pen className="h-5 w-5 text-gray-700" />
                <span className="font-montserrat-semibold text-gray-900">Edit Deadlines</span>
              </DropdownMenuItem>
              <DropdownMenuItem className="flex items-center gap-3 px-3 py-2.5 cursor-pointer rounded-lg">
                <Copy className="h-5 w-5 text-gray-700" />
                <span className="font-montserrat-semibold text-gray-900">Clone Tender</span>
              </DropdownMenuItem>
              <DropdownMenuItem className="flex items-center gap-3 px-3 py-2.5 cursor-pointer rounded-lg">
                <DocumentText className="h-5 w-5 text-gray-700" />
                <span className="font-montserrat-semibold text-gray-900">Generate Contract Template</span>
              </DropdownMenuItem>
              <DropdownMenuItem className="flex items-center gap-3 px-3 py-2.5 cursor-pointer rounded-lg">
                <ClipboardList className="h-5 w-5 text-gray-700" />
                <span className="font-montserrat-semibold text-gray-900">Activity History</span>
              </DropdownMenuItem>
              <DropdownMenuItem className="flex items-center gap-3 px-3 py-2.5 cursor-pointer rounded-lg">
                <Download className="h-5 w-5 text-gray-700" />
                <span className="font-montserrat-semibold text-gray-900">Export Tender</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator className="my-1" />
              <DropdownMenuItem className="flex items-center gap-3 px-3 py-2.5 cursor-pointer rounded-lg text-red-600 focus:text-red-600">
                <CloseCircle className="h-5 w-5" />
                <span className="font-montserrat-semibold">Cancel Tender</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Tender ID */}
      <h3 className="text-lg font-montserrat-bold text-gray-900 mb-4">{tender.id}</h3>

      {/* Tender Details */}
      <div className="space-y-2 mb-6">
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-600 font-montserrat">Timeline:</span>
          <span className="text-gray-900 font-montserrat-semibold">{tender.timeline}</span>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-600 font-montserrat">Budget Allocation:</span>
          <span className="text-gray-900 font-montserrat-semibold">
            ${tender.budgetAllocation.toLocaleString()}
          </span>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-600 font-montserrat">Diagnosis Category:</span>
          <span className="text-gray-900 font-montserrat-semibold">{tender.diagnosisCategory}</span>
        </div>
      </div>

      {/* Participant and Submissions */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <Avatar className="h-10 w-10">
            <AvatarImage src={tender.participant.avatar || undefined} />
            <AvatarFallback className="bg-primary-100 text-primary-700 font-montserrat-semibold">
              {tender.participant.name.split(' ').map(n => n[0]).join('')}
            </AvatarFallback>
          </Avatar>
          <div>
            <p className="text-sm font-montserrat-semibold text-gray-900">
              {tender.participant.name}
            </p>
            <p className="text-xs text-gray-600 font-montserrat">{tender.participant.role}</p>
          </div>
        </div>

        {tender.status === "awarded" && tender.awardedTo ? (
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1">
              <Avatar className="h-6 w-6 border-2 border-white">
                <AvatarFallback className="bg-green-100 text-green-700 text-xs">
                  HC
                </AvatarFallback>
              </Avatar>
            </div>
            <span className="text-xs font-montserrat-semibold text-gray-700">
              {tender.awardedTo}
            </span>
          </div>
        ) : tender.submissions > 0 ? (
          <div className="flex items-center gap-2">
            <div className="flex items-center -space-x-2">
              {Array.from({ length: Math.min(tender.submissions, 3) }).map((_, i) => (
                <Avatar key={i} className="h-6 w-6 border-2 border-white">
                  <AvatarFallback className="bg-gray-200 text-gray-700 text-xs">
                    {String.fromCharCode(65 + i)}
                  </AvatarFallback>
                </Avatar>
              ))}
              {tender.submissions > 3 && (
                <div className="h-6 w-6 rounded-full bg-gray-200 border-2 border-white flex items-center justify-center">
                  <span className="text-xs font-montserrat-semibold text-gray-700">
                    +{tender.submissions - 3}
                  </span>
                </div>
              )}
            </div>
            <span className="text-xs font-montserrat-semibold text-gray-600">
              Submissions
            </span>
          </div>
        ) : null}
      </div>

      {/* View Details Button */}
      <Button
        onClick={onViewDetails}
        variant="outline"
        className="w-full border-primary-600 text-primary-600 hover:bg-primary-50 hover:text-primary-700 font-montserrat-semibold"
      >
        View Details
      </Button>
    </Card>
  );
}

export default function TenderPage() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [activeFilter, setActiveFilter] = useState<TenderStatus>("all");
  const [showCreateModal, setShowCreateModal] = useState(false);

  const getFilteredTenders = () => {
    if (activeFilter === "all") return mockTenders;
    return mockTenders.filter((tender) => tender.status === activeFilter);
  };

  const getFilterCount = (status: TenderStatus) => {
    if (status === "all") return mockTenders.length;
    return mockTenders.filter((tender) => tender.status === status).length;
  };

  const filteredTenders = getFilteredTenders();

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6 lg:p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-montserrat-bold text-gray-900 mb-2">Tender</h1>
          <p className="text-gray-600 font-montserrat">
            Create and manage tender request with participant requirement
          </p>
        </div>
        <div className="flex items-center gap-4">
          {/* Notification Bell */}
          <Button
            variant="ghost"
            size="icon"
            className="relative h-10 w-10 rounded-full hover:bg-gray-100"
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

          {/* Create New Tender Button */}
          <Button
            onClick={() => setShowCreateModal(true)}
            className="bg-primary-600 hover:bg-primary-700 text-white font-montserrat-semibold px-6 rounded-lg"
          >
            <AddCircle className="h-5 w-5 mr-2" />
            Create New Tender
          </Button>
        </div>
      </div>

      {/* Create Tender Modal */}
      <CreateTenderModal open={showCreateModal} onOpenChange={setShowCreateModal} />

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-6">
        <StatCard
          title="Total Tenders Created"
          value={mockStats.totalTendersCreated}
          icon={Documents}
          trend="From last Month"
          trendUp
        />
        <StatCard
          title="Active Tenders"
          value={mockStats.activeTenders}
          icon={CheckCircle}
          trend="From last Month"
          trendUp
        />
        <StatCard
          title="Avg Response Rate"
          value={`${mockStats.avgResponseRate}%`}
          icon={Chart}
          trend="From last Month"
          trendUp
        />
        <StatCard
          title="Avg Time to Award"
          value={`${mockStats.avgTimeToAward} days`}
          icon={ClockCircle}
          trend="From last Month"
          trendUp
        />
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 mb-6 overflow-x-auto pb-2">
        <Button
          onClick={() => setActiveFilter("all")}
          className={`rounded-full font-montserrat-semibold whitespace-nowrap ${
            activeFilter === "all"
              ? "bg-primary-600 text-white hover:bg-primary-700"
              : "bg-white text-gray-700 border border-gray-200 hover:bg-gray-50"
          }`}
        >
          All {getFilterCount("all")}
        </Button>
        <Button
          onClick={() => setActiveFilter("open")}
          className={`rounded-full font-montserrat-semibold whitespace-nowrap ${
            activeFilter === "open"
              ? "bg-primary-600 text-white hover:bg-primary-700"
              : "bg-white text-gray-700 border border-gray-200 hover:bg-gray-50"
          }`}
        >
          Open {getFilterCount("open")}
        </Button>
        <Button
          onClick={() => setActiveFilter("evaluation")}
          className={`rounded-full font-montserrat-semibold whitespace-nowrap ${
            activeFilter === "evaluation"
              ? "bg-primary-600 text-white hover:bg-primary-700"
              : "bg-white text-gray-700 border border-gray-200 hover:bg-gray-50"
          }`}
        >
          Evaluation {getFilterCount("evaluation")}
        </Button>
        <Button
          onClick={() => setActiveFilter("awarded")}
          className={`rounded-full font-montserrat-semibold whitespace-nowrap ${
            activeFilter === "awarded"
              ? "bg-primary-600 text-white hover:bg-primary-700"
              : "bg-white text-gray-700 border border-gray-200 hover:bg-gray-50"
          }`}
        >
          Awarded {getFilterCount("awarded")}
        </Button>
        <Button
          onClick={() => setActiveFilter("cancelled")}
          className={`rounded-full font-montserrat-semibold whitespace-nowrap ${
            activeFilter === "cancelled"
              ? "bg-primary-600 text-white hover:bg-primary-700"
              : "bg-white text-gray-700 border border-gray-200 hover:bg-gray-50"
          }`}
        >
          Cancelled {getFilterCount("cancelled")}
        </Button>
      </div>

      {/* Tender Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTenders.map((tender, index) => (
          <TenderCard
            key={`${tender.id}-${index}`}
            tender={tender}
            onViewDetails={() => navigate(`/support-coordinator/tender/${tender.id}`)}
          />
        ))}
      </div>

      {/* Empty State */}
      {filteredTenders.length === 0 && (
        <div className="text-center py-12">
          <Documents className="h-16 w-16 mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-montserrat-bold text-gray-900 mb-2">
            No tenders found
          </h3>
          <p className="text-gray-600 font-montserrat mb-6">
            No tenders match your current filter
          </p>
          <Button
            onClick={() => setActiveFilter("all")}
            variant="outline"
            className="font-montserrat-semibold"
          >
            View All Tenders
          </Button>
        </div>
      )}
    </div>
  );
}

