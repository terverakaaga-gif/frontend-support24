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
} from "@solar-icons/react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { ParticipantDetailsModal } from "@/components/coordinator/ParticipantDetailsModal";
import { ProviderDetailsModal } from "@/components/coordinator/ProviderDetailsModal";
import { EditBudgetModal } from "@/components/coordinator/EditBudgetModal";

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
};

export default function ParticipantDetailsPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("plan");
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showProviderModal, setShowProviderModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedProvider, setSelectedProvider] = useState<any>(null);

  const handleViewProvider = (provider: any) => {
    setSelectedProvider(provider);
    setShowProviderModal(true);
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
          <div className="relative">
            <div className="h-10 w-10 rounded-full bg-red-100 flex items-center justify-center">
              <span className="text-red-600 font-montserrat-semibold">1</span>
            </div>
          </div>

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
                <p className="text-gray-600 font-montserrat">
                  Providers & Support Workers content coming soon...
                </p>
              </TabsContent>

              <TabsContent value="timeline">
                <p className="text-gray-600 font-montserrat">
                  Timeline/Activity Feeds content coming soon...
                </p>
              </TabsContent>

              <TabsContent value="goals">
                <p className="text-gray-600 font-montserrat">
                  Goals & Outcome content coming soon...
                </p>
              </TabsContent>

              <TabsContent value="documents">
                <p className="text-gray-600 font-montserrat">
                  Documents content coming soon...
                </p>
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
    </div>
  );
}
