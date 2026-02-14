import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import {
  ArrowLeft,
  BellBing,
  Pen,
  Chart,
  MenuDots,
} from "@solar-icons/react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// Mock data
const tenderData = {
  id: "ST24-001234",
  title: "SIL",
  status: "open",
  timeline: "7 Days Minimum",
  budgetAllocation: "$500,000",
  diagnosisCategory: "Autism",
  participant: {
    name: "Sarah Reves",
    avatar: null,
    role: "Participant",
  },
  submissions: 21,
  submissionAvatars: ["A", "B", "C"],
  basics: {
    participantName: "Sarah Reves",
    participantAvatar: null,
    serviceType: "SIL",
    serviceStartDate: "28 May, 2025",
    duration: "3 Weeks",
    hoursPerWeek: "2 hours",
    supportRatio: "3.1",
    submissionDeadline: "5 days",
  },
  participantNeeds: {
    age: "50 years",
    gender: "Female",
    location: "Sydney, Australia",
    supportNeeds: "SIL",
    diagnosisCategory: "Autism",
    communicationMethod: "Verbal",
    additionalNotes: "",
  },
  requirements: {
    mandatoryQualifications: "Cert III / IV",
    preferredQualifications: "First Aid",
    competencies: "Must be in Australia",
    supportNeeds: "SIL",
    experienceRequirement: "2+ years autism experience",
  },
  budget: {
    totalBudget: "$500,000",
    hourlyRange: "2-10",
    ndisPriceGuide: "",
    visibilityPreferences: "Show provider",
    fundingSource: "Core",
    paymentTermsPreference: "Core",
  },
};

export default function TenderDetailsPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { user } = useAuth();

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      open: { label: "Open", className: "bg-blue-100 text-blue-700 border-blue-200" },
      evaluation: { label: "Evaluation", className: "bg-yellow-100 text-yellow-700 border-yellow-200" },
      awarded: { label: "Awarded", className: "bg-green-100 text-green-700 border-green-200" },
      cancelled: { label: "Cancelled", className: "bg-red-100 text-red-700 border-red-200" },
      evaluated: { label: "Evaluated", className: "bg-purple-100 text-purple-700 border-purple-200" },
    };

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.open;
    return (
      <Badge className={`${config.className} border font-montserrat-semibold px-3 py-1 rounded-full`}>
        {config.label}
      </Badge>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <Button
          variant="ghost"
          onClick={() => navigate("/support-coordinator/tender")}
          className="text-primary-600 hover:text-primary-700 font-montserrat-semibold"
        >
          <ArrowLeft className="h-5 w-5 mr-2" />
          Back to Tender
        </Button>

        <div className="flex items-center gap-3">
          {/* Notification Badge */}
          <button
            onClick={() => navigate("/support-coordinator/notifications")}
            className="relative h-10 w-10 rounded-full bg-red-100 flex items-center justify-center hover:bg-red-200 transition-colors cursor-pointer"
          >
            <span className="text-red-600 font-montserrat-semibold">6</span>
          </button>

          {/* User Avatar */}
          <Avatar className="h-10 w-10 cursor-pointer">
            <AvatarImage src={user?.profileImage || undefined} />
            <AvatarFallback className="bg-primary-100 text-primary-700 font-montserrat-semibold">
              {user?.firstName?.charAt(0)}
              {user?.lastName?.charAt(0)}
            </AvatarFallback>
          </Avatar>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Section - Tender Card */}
        <div className="lg:col-span-1">
          <Card className="p-6">
            {/* Header with SIL, Status, and Actions */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <span className="text-lg font-montserrat-bold text-gray-900">
                  {tenderData.title}
                </span>
                {getStatusBadge(tenderData.status)}
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
                      className="h-8 w-8 text-primary-600 hover:bg-primary-50"
                    >
                      <MenuDots className="h-5 w-5" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48">
                    <DropdownMenuItem className="font-montserrat">
                      Edit Tender
                    </DropdownMenuItem>
                    <DropdownMenuItem className="font-montserrat">
                      Duplicate
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="text-red-600 font-montserrat">
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>

            {/* Tender ID */}
            <div className="mb-4">
              <span className="text-sm font-montserrat-semibold text-gray-600">
                {tenderData.id}
              </span>
            </div>

            {/* Key Details */}
            <div className="space-y-3 mb-6">
              <div>
                <span className="text-sm text-gray-600 font-montserrat">Timeline: </span>
                <span className="text-sm font-montserrat-semibold text-gray-900">
                  {tenderData.timeline}
                </span>
              </div>
              <div>
                <span className="text-sm text-gray-600 font-montserrat">
                  Budget Allocation:{" "}
                </span>
                <span className="text-sm font-montserrat-semibold text-gray-900">
                  {tenderData.budgetAllocation}
                </span>
              </div>
              <div>
                <span className="text-sm text-gray-600 font-montserrat">
                  Diagnosis Category:{" "}
                </span>
                <span className="text-sm font-montserrat-semibold text-gray-900">
                  {tenderData.diagnosisCategory}
                </span>
              </div>
            </div>

            {/* Participant Information */}
            <div className="flex items-center justify-between mb-6 pb-6 border-b">
              <div className="flex items-center gap-3">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={tenderData.participant.avatar || undefined} />
                  <AvatarFallback className="bg-primary-100 text-primary-700 font-montserrat-semibold">
                    {tenderData.participant.name
                      .split(" ")
                      .map((n) => n.charAt(0))
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm font-montserrat-semibold text-gray-900">
                    {tenderData.participant.name}
                  </p>
                  <p className="text-xs text-gray-600 font-montserrat">
                    {tenderData.participant.role}
                  </p>
                </div>
              </div>
            </div>

            {/* Submissions */}
            <div className="flex items-center gap-2 mb-6">
              <div className="flex items-center -space-x-2">
                {tenderData.submissionAvatars.map((letter, i) => (
                  <Avatar key={i} className="h-8 w-8 border-2 border-white">
                    <AvatarFallback className="bg-gray-200 text-gray-700 text-xs font-montserrat-semibold">
                      {letter}
                    </AvatarFallback>
                  </Avatar>
                ))}
                {tenderData.submissions > 3 && (
                  <div className="h-8 w-8 rounded-full bg-gray-200 border-2 border-white flex items-center justify-center">
                    <span className="text-xs font-montserrat-semibold text-gray-700">
                      +{tenderData.submissions - 3}
                    </span>
                  </div>
                )}
              </div>
              <span className="text-sm font-montserrat-semibold text-gray-600">
                Submissions
              </span>
            </div>

            {/* View Details Button */}
            <Button
              variant="outline"
              className="w-full border-primary-600 text-primary-600 hover:bg-primary-50 hover:text-primary-700 font-montserrat-semibold"
            >
              View Details
            </Button>
          </Card>
        </div>

        {/* Right Section - Tender Details */}
        <div className="lg:col-span-2">
          <Card className="p-6">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-montserrat-bold text-gray-900">
                Tender Details
              </h2>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <Pen className="h-5 w-5 text-gray-600" />
              </Button>
            </div>

            {/* Basics Section */}
            <div className="mb-8">
              <h3 className="text-base font-montserrat-bold text-gray-900 mb-4">
                Basics
              </h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600 font-montserrat">Participant Name:</span>
                  <div className="flex items-center gap-2">
                    <Avatar className="h-6 w-6">
                      <AvatarImage
                        src={tenderData.basics.participantAvatar || undefined}
                      />
                      <AvatarFallback className="bg-primary-100 text-primary-700 text-xs">
                        {tenderData.basics.participantName
                          .split(" ")
                          .map((n) => n.charAt(0))
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <span className="font-montserrat-semibold text-gray-900">
                      {tenderData.basics.participantName}
                    </span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600 font-montserrat">Service Type:</span>
                  <span className="font-montserrat-semibold text-gray-900">
                    {tenderData.basics.serviceType}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600 font-montserrat">
                    Service Start Date:
                  </span>
                  <span className="font-montserrat-semibold text-gray-900">
                    {tenderData.basics.serviceStartDate}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600 font-montserrat">Duration:</span>
                  <span className="font-montserrat-semibold text-gray-900">
                    {tenderData.basics.duration}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600 font-montserrat">
                    Hours Per Week & Support Ratio:
                  </span>
                  <span className="font-montserrat-semibold text-gray-900">
                    {tenderData.basics.hoursPerWeek} & {tenderData.basics.supportRatio}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600 font-montserrat">
                    Submission Deadline:
                  </span>
                  <span className="font-montserrat-semibold text-gray-900">
                    {tenderData.basics.submissionDeadline}
                  </span>
                </div>
              </div>
            </div>

            {/* Participant Needs Section */}
            <div className="mb-8">
              <h3 className="text-base font-montserrat-bold text-gray-900 mb-4">
                Participant Needs
              </h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600 font-montserrat">Participant Age:</span>
                  <span className="font-montserrat-semibold text-gray-900">
                    {tenderData.participantNeeds.age}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600 font-montserrat">Participant Gender:</span>
                  <span className="font-montserrat-semibold text-gray-900">
                    {tenderData.participantNeeds.gender}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600 font-montserrat">
                    Participant Location:
                  </span>
                  <span className="font-montserrat-semibold text-gray-900">
                    {tenderData.participantNeeds.location}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600 font-montserrat">Support Needs:</span>
                  <span className="font-montserrat-semibold text-gray-900">
                    {tenderData.participantNeeds.supportNeeds}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600 font-montserrat">Diagnosis Category:</span>
                  <span className="font-montserrat-semibold text-gray-900">
                    {tenderData.participantNeeds.diagnosisCategory}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600 font-montserrat">
                    Communication Method:
                  </span>
                  <span className="font-montserrat-semibold text-gray-900">
                    {tenderData.participantNeeds.communicationMethod}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600 font-montserrat">Additional Notes:</span>
                  <span className="font-montserrat-semibold text-gray-900">
                    {tenderData.participantNeeds.additionalNotes || "-"}
                  </span>
                </div>
              </div>
            </div>

            {/* Requirement & Competencies Section */}
            <div className="mb-8">
              <h3 className="text-base font-montserrat-bold text-gray-900 mb-4">
                Requirement & Competencies
              </h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600 font-montserrat">
                    Mandatory Qualifications:
                  </span>
                  <span className="font-montserrat-semibold text-gray-900">
                    {tenderData.requirements.mandatoryQualifications}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600 font-montserrat">
                    Preferred Qualifications:
                  </span>
                  <span className="font-montserrat-semibold text-gray-900">
                    {tenderData.requirements.preferredQualifications}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600 font-montserrat">Competencies:</span>
                  <span className="font-montserrat-semibold text-gray-900">
                    {tenderData.requirements.competencies}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600 font-montserrat">Support Needs:</span>
                  <span className="font-montserrat-semibold text-gray-900">
                    {tenderData.requirements.supportNeeds}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600 font-montserrat">
                    Experience Requirement:
                  </span>
                  <span className="font-montserrat-semibold text-gray-900">
                    {tenderData.requirements.experienceRequirement}
                  </span>
                </div>
              </div>
            </div>

            {/* Budget Section */}
            <div className="mb-8">
              <h3 className="text-base font-montserrat-bold text-gray-900 mb-4">
                Budget
              </h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600 font-montserrat">Total Budget:</span>
                  <span className="font-montserrat-semibold text-gray-900">
                    {tenderData.budget.totalBudget}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600 font-montserrat">Hourly Range:</span>
                  <span className="font-montserrat-semibold text-gray-900">
                    {tenderData.budget.hourlyRange}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600 font-montserrat">
                    NDIS Price Guide Applicability:
                  </span>
                  <span className="font-montserrat-semibold text-gray-900">
                    {tenderData.budget.ndisPriceGuide || "-"}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600 font-montserrat">
                    Visibility Preferences:
                  </span>
                  <span className="font-montserrat-semibold text-gray-900">
                    {tenderData.budget.visibilityPreferences}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600 font-montserrat">Funding Source:</span>
                  <span className="font-montserrat-semibold text-gray-900">
                    {tenderData.budget.fundingSource}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600 font-montserrat">
                    Payment terms preference:
                  </span>
                  <span className="font-montserrat-semibold text-gray-900">
                    {tenderData.budget.paymentTermsPreference}
                  </span>
                </div>
              </div>
            </div>

            {/* View Submission List Button */}
            <Button className="w-full bg-primary-600 hover:bg-primary-700 text-white font-montserrat-semibold">
              View Submission List
            </Button>
          </Card>
        </div>
      </div>
    </div>
  );
}
