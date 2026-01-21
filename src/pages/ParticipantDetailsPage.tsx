import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import {
  ArrowLeft,
  CalendarMark,
  MapPoint,
  ClockCircle,
  Pen,
  UsersGroupRounded,
  Download,
  Letter,
  Chart,
  AddCircle,
  AltArrowRight,
  Eye,
  FileText,
  Upload,
} from "@solar-icons/react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ParticipantDetailsModal } from "@/components/coordinator/ParticipantDetailsModal";
import { ProviderDetailsModal } from "@/components/coordinator/ProviderDetailsModal";
import { EditBudgetModal } from "@/components/coordinator/EditBudgetModal";
import { ViewPerformanceModal } from "@/components/coordinator/ViewPerformanceModal";
import { RemoveProviderModal } from "@/components/providers/RemoveProviderModal";
import { AddNoteModal } from "@/components/coordinator/AddNoteModal";

// Mock data
const participantData = {
  id: "1",
  name: "Sarah Reves",
  status: "On track",
  ndisNo: "12345",
  age: 37,
  avatar: null,
  budgetUtilization: 65,
  planExpiryDate: "15 Nov, 2025",
  nextReviewDate: "2 Dec, 2025",
  address: "123 Main Street",
  supportWorkersCount: 3,
  budgetCategories: [
    {
      category: "Core",
      planValue: "$2,000.000",
      progress: 60,
      allocation: 3,
      planManager: {
        name: "Grace Johnson",
        email: "gracejohnson@gmail.com",
      },
    },
    {
      category: "Capacity Building",
      planValue: "$1,000.000",
      progress: 60,
      allocation: 3,
      planManager: {
        name: "Grace Johnson",
        email: "gracejohnson@gmail.com",
      },
    },
    {
      category: "Capital",
      planValue: "$2,000.000",
      progress: 60,
      allocation: 3,
      planManager: {
        name: "Grace Johnson",
        email: "gracejohnson@gmail.com",
      },
    },
  ],
  planDates: {
    startDate: "January 1, 2025",
    endDate: "December 31, 2025",
    totalValue: "$5,000.00",
  },
  providers: [
    {
      id: "1",
      name: "HopeCare Services Ltd",
      logo: null,
      serviceType: "Personal Care",
      budgetCategory: "Core",
      amountSpent: "$12,500.00",
    },
    {
      id: "2",
      name: "HopeCare Services Ltd",
      logo: null,
      serviceType: "Personal Care",
      budgetCategory: "Core",
      amountSpent: "$12,500.00",
    },
    {
      id: "3",
      name: "HopeCare Services Ltd",
      logo: null,
      serviceType: "Personal Care",
      budgetCategory: "Core",
      amountSpent: "$12,500.00",
    },
  ],
  assignedProviders: [
    {
      id: "1",
      name: "Hope Care Services Ltd",
      logo: null,
      serviceType: "Personal Care",
      startDate: "Jan 15, 2025",
      status: "Active",
    },
    {
      id: "2",
      name: "Hope Care Services Ltd",
      logo: null,
      serviceType: "Personal Care",
      startDate: "Jan 15, 2025",
      status: "Active",
    },
    {
      id: "3",
      name: "Hope Care Services Ltd",
      logo: null,
      serviceType: "Personal Care",
      startDate: "Jan 15, 2025",
      status: "Active",
    },
    {
      id: "4",
      name: "Hope Care Services Ltd",
      logo: null,
      serviceType: "Personal Care",
      startDate: "Jan 15, 2025",
      status: "Active",
    },
  ],
  timeline: [
    {
      id: "1",
      type: "meeting",
      date: "Oct 26, 2025 3:30 PM",
      description: "Follow-up meeting with John Doe regarding progress on independence goals",
      participant: "Sarah Reves",
    },
    {
      id: "2",
      type: "provider_change",
      date: "Oct 26, 2025 3:30 PM",
      description: "Replaced well Link Transport with MobilityPlus Ltd due to service coverage",
      participant: "Sarah Reves",
    },
    {
      id: "3",
      type: "plan_review",
      date: "Oct 26, 2025 3:30 PM",
      description: "Updated Core support budget to $2,000,000 after quarterly review",
      participant: "Sarah Reves",
    },
    {
      id: "4",
      type: "incident",
      date: "Oct 26, 2025 3:30 PM",
      description: "Minor delay in physiotherapy session reported by participant",
      participant: "Sarah Reves",
    },
  ],
  goals: [
    {
      id: "1",
      title: "Increase Independence in Daily Living",
      date: "Oct 26, 2025 3:30 PM",
      description: "John can now manage personal hygiene and prepare simple meals independently",
      progress: 60,
    },
    {
      id: "2",
      title: "Increase Independence in Daily Living",
      date: "Oct 26, 2025 3:30 PM",
      description: "John can now manage personal hygiene and prepare simple meals independently",
      progress: 60,
    },
  ],
  documents: [
    {
      id: "1",
      name: "Q3 Progress Report.pdf",
      size: "234KB",
      type: "pdf",
    },
    {
      id: "2",
      name: "Mobility Evaluation.pdf",
      size: "234KB",
      type: "pdf",
    },
  ],
};

export default function ParticipantDetailsPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("plan");
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showProviderModal, setShowProviderModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showPerformanceModal, setShowPerformanceModal] = useState(false);
  const [showAddNoteModal, setShowAddNoteModal] = useState(false);
  const [timelineFilter, setTimelineFilter] = useState("all");
  const [showRemoveModal, setShowRemoveModal] = useState(false);
  const [selectedProvider, setSelectedProvider] = useState<any>(null);

  const handleViewProvider = (provider: any) => {
    setSelectedProvider(provider);
    setShowProviderModal(true);
  };

  const handleViewPerformance = (provider: any) => {
    setSelectedProvider(provider);
    setShowPerformanceModal(true);
  };

  const handleRemoveClick = (provider: any) => {
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
      <div className="flex items-center justify-between mb-6">
        <Button
          variant="ghost"
          onClick={() => navigate("/support-coordinator/participants")}
          className="text-primary-600 hover:text-primary-700 font-montserrat-semibold"
        >
          <ArrowLeft className="h-5 w-5 mr-2" />
          Back to Participant
        </Button>

        <div className="flex items-center gap-3">
          {/* Notification Badge */}
          <button
            onClick={() => navigate("/support-coordinator/notifications")}
            className="relative h-10 w-10 rounded-full bg-red-100 flex items-center justify-center hover:bg-red-200 transition-colors cursor-pointer"
          >
            <span className="text-red-600 font-montserrat-semibold">1</span>
          </button>

          {/* User Avatar */}
          <Avatar className="h-10 w-10 cursor-pointer">
            <AvatarImage src={user?.profileImage || undefined} />
            <AvatarFallback className="bg-primary-100 text-primary-700 font-montserrat-semibold">
              {user?.firstName?.charAt(0)}
              {user?.lastName?.charAt(0)}
            </AvatarFallback>
          </Avatar>

          {/* Export Button */}
          <Button className="bg-primary-600 hover:bg-primary-700 text-white font-montserrat-semibold">
            <Download className="h-5 w-5 mr-2" />
            Export
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Side - Participant Card */}
        <div className="lg:col-span-1">
          <Card className="p-6">
            {/* Participant Info */}
            <div className="flex items-start gap-4 mb-6">
              <Avatar className="h-16 w-16">
                <AvatarImage src={participantData.avatar || undefined} />
                <AvatarFallback className="bg-primary-100 text-primary-700 font-montserrat-semibold text-xl">
                  {participantData.name
                    .split(" ")
                    .map((n) => n.charAt(0))
                    .join("")}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <div className="flex items-start justify-between mb-1">
                  <h2 className="text-xl font-montserrat-bold text-gray-900">
                    {participantData.name}
                  </h2>
                  <Badge className="bg-green-100 text-green-700 hover:bg-green-100 font-montserrat">
                    {participantData.status}
                  </Badge>
                </div>
                <p className="text-sm text-gray-600 font-montserrat">
                  NDIS No: {participantData.ndisNo} | Age: {participantData.age} Years
                </p>
                <div className="flex items-center gap-2 mt-2">
                  <UsersGroupRounded className="h-4 w-4 text-primary-600" />
                  <span className="text-sm font-montserrat-semibold text-primary-600">
                    {participantData.supportWorkersCount}
                  </span>
                </div>
              </div>
            </div>

            {/* Budget Utilization */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-montserrat-semibold text-gray-900">
                  Budget Utilization
                </span>
                <span className="text-sm font-montserrat-semibold text-gray-900">
                  {participantData.budgetUtilization}% Complete
                </span>
              </div>
              <Progress value={participantData.budgetUtilization} className="h-2" />
            </div>

            {/* Dates and Location */}
            <div className="space-y-3 mb-6">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <CalendarMark className="h-4 w-4" />
                <span className="font-montserrat">
                  {participantData.planExpiryDate} (Plan expiry date)
                </span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <MapPoint className="h-4 w-4" />
                <span className="font-montserrat">{participantData.address}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <ClockCircle className="h-4 w-4" />
                <span className="font-montserrat">
                  {participantData.nextReviewDate} (Next review date)
                </span>
              </div>
            </div>

            {/* Refer Button */}
            <Button
              variant="link"
              className="text-primary-600 hover:text-primary-700 font-montserrat-semibold p-0"
            >
              Refer via Framer Health
              <ArrowLeft className="h-4 w-4 ml-2 rotate-180" />
            </Button>
          </Card>
        </div>

        {/* Right Side - Tabs Content */}
        <div className="lg:col-span-2">
          <Card className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-montserrat-bold text-gray-900">
                Participant Details
              </h2>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setShowEditModal(true)}
                className="h-8 w-8"
              >
                <Pen className="h-5 w-5 text-gray-600" />
              </Button>
            </div>

            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="w-full justify-start border-b rounded-none h-auto p-0 bg-transparent mb-6">
                <TabsTrigger
                  value="plan"
                  className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary-600 data-[state=active]:bg-transparent font-montserrat-semibold"
                >
                  Plan
                </TabsTrigger>
                <TabsTrigger
                  value="providers"
                  className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary-600 data-[state=active]:bg-transparent font-montserrat-semibold"
                >
                  Providers & Support Workers
                </TabsTrigger>
                <TabsTrigger
                  value="timeline"
                  className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary-600 data-[state=active]:bg-transparent font-montserrat-semibold"
                >
                  Timeline/Activity Feeds
                </TabsTrigger>
                <TabsTrigger
                  value="goals"
                  className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary-600 data-[state=active]:bg-transparent font-montserrat-semibold"
                >
                  Goals & Outcome
                </TabsTrigger>
                <TabsTrigger
                  value="documents"
                  className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary-600 data-[state=active]:bg-transparent font-montserrat-semibold"
                >
                  Documents
                </TabsTrigger>
              </TabsList>

              <TabsContent value="plan" className="space-y-6">
                {/* Participant Budget Plan Breakdown */}
                <div>
                  <h3 className="text-lg font-montserrat-bold text-gray-900 mb-4">
                    Participant Budget Plan Breakdown
                  </h3>

                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left py-3 px-4 text-sm font-montserrat-semibold text-gray-600 uppercase">
                            Category
                          </th>
                          <th className="text-left py-3 px-4 text-sm font-montserrat-semibold text-gray-600 uppercase">
                            Plan Value
                          </th>
                          <th className="text-left py-3 px-4 text-sm font-montserrat-semibold text-gray-600 uppercase">
                            Progress
                          </th>
                          <th className="text-left py-3 px-4 text-sm font-montserrat-semibold text-gray-600 uppercase">
                            Allocation
                          </th>
                          <th className="text-left py-3 px-4 text-sm font-montserrat-semibold text-gray-600 uppercase">
                            Plan Manager
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {participantData.budgetCategories.map((category, index) => (
                          <tr
                            key={index}
                            className="border-b hover:bg-gray-50 cursor-pointer"
                            onClick={() => setShowDetailsModal(true)}
                          >
                            <td className="py-4 px-4">
                              <span className="font-montserrat text-gray-900">
                                {category.category}
                              </span>
                            </td>
                            <td className="py-4 px-4">
                              <span className="font-montserrat-semibold text-gray-900">
                                {category.planValue}
                              </span>
                            </td>
                            <td className="py-4 px-4">
                              <div className="flex items-center gap-3">
                                <Progress value={category.progress} className="h-2 flex-1" />
                                <span className="text-sm font-montserrat text-gray-600">
                                  {category.progress}%
                                </span>
                              </div>
                            </td>
                            <td className="py-4 px-4">
                              <div className="flex items-center gap-2">
                                <UsersGroupRounded className="h-4 w-4 text-primary-600" />
                                <span className="text-sm font-montserrat-semibold text-primary-600">
                                  {category.allocation}
                                </span>
                              </div>
                            </td>
                            <td className="py-4 px-4">
                              <div>
                                <p className="font-montserrat-semibold text-gray-900">
                                  {category.planManager.name}
                                </p>
                                <p className="text-sm text-gray-600 font-montserrat">
                                  {category.planManager.email}
                                </p>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Plan Dates & Value */}
                <div>
                  <h3 className="text-lg font-montserrat-bold text-gray-900 mb-4">
                    Plan Dates & Value
                  </h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600 font-montserrat">
                        Plan Start Date
                      </span>
                      <span className="font-montserrat-semibold text-gray-900">
                        {participantData.planDates.startDate}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600 font-montserrat">Plan End Date</span>
                      <span className="font-montserrat-semibold text-gray-900">
                        {participantData.planDates.endDate}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600 font-montserrat">
                        Total Plan Value
                      </span>
                      <span className="font-montserrat-semibold text-gray-900">
                        {participantData.planDates.totalValue}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Spending By Provider */}
                <div>
                  <h3 className="text-lg font-montserrat-bold text-gray-900 mb-4">
                    Spending By Provider
                  </h3>
                  <div>
                    <h4 className="text-base font-montserrat-semibold text-gray-900 mb-3">
                      Provider Budget Plan Breakdown
                    </h4>
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="border-b">
                            <th className="text-left py-3 px-4 text-sm font-montserrat-semibold text-gray-600 uppercase">
                              Provider Name
                            </th>
                            <th className="text-left py-3 px-4 text-sm font-montserrat-semibold text-gray-600 uppercase">
                              Service Type
                            </th>
                            <th className="text-left py-3 px-4 text-sm font-montserrat-semibold text-gray-600 uppercase">
                              Budget Category
                            </th>
                            <th className="text-left py-3 px-4 text-sm font-montserrat-semibold text-gray-600 uppercase">
                              Amount Spent
                            </th>
                            <th className="text-left py-3 px-4 text-sm font-montserrat-semibold text-gray-600 uppercase">
                              Action
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {participantData.providers.map((provider) => (
                            <tr key={provider.id} className="border-b hover:bg-gray-50">
                              <td className="py-4 px-4">
                                <div className="flex items-center gap-3">
                                  <Avatar className="h-8 w-8">
                                    <AvatarImage src={provider.logo || undefined} />
                                    <AvatarFallback className="bg-gray-800 text-white text-xs">
                                      HC
                                    </AvatarFallback>
                                  </Avatar>
                                  <span className="font-montserrat text-gray-900">
                                    {provider.name}
                                  </span>
                                </div>
                              </td>
                              <td className="py-4 px-4">
                                <span className="font-montserrat text-gray-900">
                                  {provider.serviceType}
                                </span>
                              </td>
                              <td className="py-4 px-4">
                                <span className="font-montserrat text-gray-900">
                                  {provider.budgetCategory}
                                </span>
                              </td>
                              <td className="py-4 px-4">
                                <span className="font-montserrat-semibold text-gray-900">
                                  {provider.amountSpent}
                                </span>
                              </td>
                              <td className="py-4 px-4">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleViewProvider(provider)}
                                  className="border-primary-600 text-primary-600 hover:bg-primary-50 font-montserrat-semibold"
                                >
                                  View Invoice
                                </Button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="providers">
                <div>
                  <h3 className="text-lg font-montserrat-bold text-gray-900 mb-4">
                    Assigned Providers & Support Workers
                  </h3>

                  {/* Find Providers Button */}
                  <Button
                    className="mb-6 bg-primary-600 hover:bg-primary-700 text-white font-montserrat-semibold"
                  >
                    <AddCircle className="h-5 w-5 mr-2" />
                    Find Providers & Support Workers
                  </Button>

                  {/* Provider Cards Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {participantData.assignedProviders.map((provider) => (
                      <Card key={provider.id} className="p-4">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex items-center gap-3">
                            <Avatar className="h-10 w-10">
                              <AvatarImage src={provider.logo || undefined} />
                              <AvatarFallback className="bg-gray-800 text-white text-xs">
                                HC
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="text-sm font-montserrat-bold text-gray-900">
                                {provider.name}
                              </p>
                              <Badge className="bg-green-100 text-green-700 hover:bg-green-100 font-montserrat text-xs mt-1">
                                {provider.status}
                              </Badge>
                            </div>
                          </div>
                        </div>

                        {/* Provider Details */}
                        <div className="space-y-2 mb-4">
                          <div className="text-sm">
                            <span className="text-gray-600 font-montserrat">
                              Service Type:{" "}
                            </span>
                            <span className="font-montserrat-semibold text-gray-900">
                              {provider.serviceType}
                            </span>
                          </div>
                          <div className="text-sm">
                            <span className="text-gray-600 font-montserrat">
                              Start Date:{" "}
                            </span>
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
                </div>
              </TabsContent>

              <TabsContent value="timeline">
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-montserrat-bold text-gray-900">
                      Timeline/Activity Feeds
                    </h3>
                    <Select value={timelineFilter} onValueChange={setTimelineFilter}>
                      <SelectTrigger className="w-[180px] bg-white">
                        <SelectValue placeholder="Type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All</SelectItem>
                        <SelectItem value="meeting">Meetings</SelectItem>
                        <SelectItem value="provider_change">Provider Changes</SelectItem>
                        <SelectItem value="plan_review">Plan Reviews</SelectItem>
                        <SelectItem value="incident">Incidents</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-4">
                    {participantData.timeline
                      .filter((item) =>
                        timelineFilter === "all" ? true : item.type === timelineFilter
                      )
                      .map((item) => (
                        <Card key={item.id} className="p-4">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-2">
                                <span className="text-sm font-montserrat-semibold text-gray-900 capitalize">
                                  {item.type.replace("_", " ")}
                                </span>
                                <span className="text-sm text-gray-600 font-montserrat">
                                  {item.date}
                                </span>
                              </div>
                              <p className="text-sm text-gray-700 font-montserrat">
                                {item.description}
                              </p>
                            </div>
                            <div className="flex items-center gap-2 ml-4">
                              <AltArrowRight className="h-5 w-5 text-gray-400" />
                              <span className="text-sm font-montserrat-semibold text-gray-900">
                                {item.participant}
                              </span>
                            </div>
                          </div>
                        </Card>
                      ))}
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="goals">
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-montserrat-bold text-gray-900">
                      Goals and Outcome
                    </h3>
                    <Button
                      className="bg-primary-600 hover:bg-primary-700 text-white font-montserrat-semibold"
                      onClick={() => setShowAddNoteModal(true)}
                    >
                      <AddCircle className="h-5 w-5 mr-2" />
                      Add Notes
                    </Button>
                  </div>

                  <div className="space-y-4">
                    {participantData.goals.map((goal) => (
                      <Card key={goal.id} className="p-4">
                        <div className="mb-3">
                          <h4 className="text-base font-montserrat-bold text-gray-900 mb-2">
                            {goal.title}
                          </h4>
                          <p className="text-sm text-gray-600 font-montserrat mb-2">
                            {goal.date}
                          </p>
                          <p className="text-sm text-gray-700 font-montserrat mb-3">
                            {goal.description}
                          </p>
                          <div className="space-y-2">
                            <div className="flex items-center justify-between">
                              <span className="text-sm font-montserrat text-gray-600">
                                Progress
                              </span>
                              <span className="text-sm font-montserrat-semibold text-gray-900">
                                {goal.progress}%
                              </span>
                            </div>
                            <Progress value={goal.progress} className="h-2" />
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="documents">
                <div>
                  <h3 className="text-lg font-montserrat-bold text-gray-900 mb-6">
                    Documents
                  </h3>

                  {/* Documents List */}
                  <div className="space-y-3 mb-8">
                    {participantData.documents.map((doc) => (
                      <Card key={doc.id} className="p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded bg-red-100 flex items-center justify-center">
                              <FileText className="h-6 w-6 text-red-600" />
                            </div>
                            <div>
                              <p className="text-sm font-montserrat-semibold text-gray-900">
                                {doc.name}
                              </p>
                              <p className="text-xs text-gray-600 font-montserrat">
                                {doc.size}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-10 w-10 hover:bg-gray-100"
                            >
                              <Eye className="h-5 w-5 text-gray-600" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-10 w-10 hover:bg-gray-100"
                            >
                              <Download className="h-5 w-5 text-gray-600" />
                            </Button>
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>

                  {/* Upload Documents */}
                  <div>
                    <h4 className="text-base font-montserrat-bold text-gray-900 mb-4">
                      Upload Documents
                    </h4>
                    <Card className="p-8 border-2 border-dashed border-gray-300 hover:border-primary-400 transition-colors">
                      <div className="flex flex-col items-center justify-center text-center">
                        <div className="h-16 w-16 rounded-full bg-primary-100 flex items-center justify-center mb-4">
                          <Upload className="h-8 w-8 text-primary-600" />
                        </div>
                        <p className="text-sm text-gray-600 font-montserrat mb-2">
                          Drop and drop your file or{" "}
                          <button className="text-primary-600 hover:text-primary-700 font-montserrat-semibold">
                            Browse
                          </button>
                        </p>
                        <p className="text-xs text-gray-500 font-montserrat">
                          File type: PNG + JPG + PDF, File limit: 5MB
                        </p>
                      </div>
                    </Card>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </Card>
        </div>
      </div>

      {/* Modals */}
      <ParticipantDetailsModal
        open={showDetailsModal}
        onOpenChange={setShowDetailsModal}
      />

      <ProviderDetailsModal
        open={showProviderModal}
        onOpenChange={setShowProviderModal}
        provider={selectedProvider}
      />

      <EditBudgetModal
        open={showEditModal}
        onOpenChange={setShowEditModal}
        budgetData={participantData.budgetCategories}
      />

      <ViewPerformanceModal
        open={showPerformanceModal}
        onOpenChange={setShowPerformanceModal}
        provider={selectedProvider}
      />

      <AddNoteModal
        open={showAddNoteModal}
        onOpenChange={setShowAddNoteModal}
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
