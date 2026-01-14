import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Magnifer, BellBing, Pen } from "@solar-icons/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import { CreateTenderModal } from "@/components/tender/CreateTenderModal";

interface DraftTender {
  id: number;
  title: string;
  timeline: string;
  budget: string;
  diagnosisCategory: string;
  participant: {
    name: string;
    role: string;
    avatar: string | null;
  };
  // Full tender data for editing
  fullData?: any;
}

// Mock data
const mockDrafts: DraftTender[] = [
  {
    id: 1,
    title: "SIL",
    timeline: "7 Days Minimum",
    budget: "$500,000",
    diagnosisCategory: "Autism",
    participant: {
      name: "Matthew Tim",
      role: "Participant",
      avatar: null,
    },
    // Full data that would be loaded from API
    fullData: {
      tenderTitle: "SIL",
      serviceType: "sil",
      location: "Sydney",
      responseDeadline: "2025-02-01",
      startDate: "2025-02-15",
      minTimeline: "7",
      budgetAllocation: "500000",
      participantName: "Matthew Tim",
      diagnosisCategory: "Autism",
      levelOfSupport: "High",
      mobilityRequirements: "Wheelchair accessible",
      communicationPreferences: "Verbal and visual aids",
      specificNeeds: "Requires 24/7 support for daily living activities",
      mustHaveQualifications: ["NDIS Registration", "First Aid Certificate"],
      preferredQualifications: ["Experience with Autism"],
      experienceRequired: "Minimum 2 years",
      languageRequirements: "English",
      complianceRequirements: ["Police Check", "Working with Children Check"],
      priceGuidance: "NDIS",
      ndisPriceGuide: "Yes",
      customRate: "",
      paymentTerms: "Net 30",
      invoicingRequirements: "Monthly",
    },
  },
];

export default function DraftPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [drafts] = useState<DraftTender[]>(mockDrafts);
  const [editingDraft, setEditingDraft] = useState<DraftTender | null>(null);
  const [showTenderModal, setShowTenderModal] = useState(false);

  const handleEditDraft = (draftId: number) => {
    const draft = drafts.find((d) => d.id === draftId);
    if (draft) {
      setEditingDraft(draft);
      setShowTenderModal(true);
    }
  };

  const handleCloseTenderModal = () => {
    setShowTenderModal(false);
    setEditingDraft(null);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-3xl font-montserrat-bold text-gray-900 mb-2">Draft</h1>
          <p className="text-gray-600 font-montserrat">Edit and publish tender</p>
        </div>
        <div className="flex items-center gap-4">
          {/* Search Bar */}
          <div className="relative">
            <Input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-white border-gray-200 w-64"
            />
            <Magnifer className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
          </div>

          {/* Notification */}
          <Button variant="ghost" size="icon" className="relative">
            <BellBing className="h-6 w-6 text-gray-700" />
            <span className="absolute top-1 right-1 h-2 w-2 bg-red-500 rounded-full"></span>
          </Button>

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

      {/* Draft Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {drafts.map((draft) => (
          <Card
            key={draft.id}
            className="overflow-hidden border border-gray-200 rounded-xl hover:shadow-lg transition-shadow bg-white"
          >
            {/* Card Header with Title and Edit Icon */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <h3 className="text-lg font-montserrat-bold text-gray-900">
                {draft.title}
              </h3>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => handleEditDraft(draft.id)}
                className="h-8 w-8 rounded-lg hover:bg-primary-50"
              >
                <Pen className="h-5 w-5 text-primary-600" />
              </Button>
            </div>

            {/* Tender Details Section (Gray Background) */}
            <div className="p-4 bg-gray-50 space-y-2">
              <div className="text-sm">
                <span className="text-gray-900 font-montserrat">
                  <span className="font-montserrat-semibold">Timeline:</span>{" "}
                  {draft.timeline}
                </span>
              </div>
              <div className="text-sm">
                <span className="text-gray-900 font-montserrat">
                  <span className="font-montserrat-semibold">Budget Allocation:</span>{" "}
                  {draft.budget}
                </span>
              </div>
              <div className="text-sm">
                <span className="text-gray-900 font-montserrat">
                  <span className="font-montserrat-semibold">Diagnosis Category:</span>{" "}
                  {draft.diagnosisCategory}
                </span>
              </div>
            </div>

            {/* Participant Section (White Background) */}
            <div className="p-4 flex items-center gap-3">
              <Avatar className="h-10 w-10">
                <AvatarImage src={draft.participant.avatar || undefined} />
                <AvatarFallback className="bg-primary-100 text-primary-700 font-montserrat-semibold">
                  {draft.participant.name
                    .split(" ")
                    .map((n) => n.charAt(0))
                    .join("")}
                </AvatarFallback>
              </Avatar>
              <div>
                <h4 className="font-montserrat-semibold text-gray-900">
                  {draft.participant.name}
                </h4>
                <p className="text-sm text-gray-600 font-montserrat">
                  {draft.participant.role}
                </p>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Empty State (if no drafts) */}
      {drafts.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-600 font-montserrat text-lg mb-4">
            No draft tenders found
          </p>
          <Button
            onClick={() => navigate("/support-coordinator/tender")}
            className="bg-primary-600 hover:bg-primary-700 text-white font-montserrat-semibold"
          >
            Create New Tender
          </Button>
        </div>
      )}

      {/* Create/Edit Tender Modal */}
      <CreateTenderModal
        open={showTenderModal}
        onOpenChange={handleCloseTenderModal}
        draftData={editingDraft?.fullData}
        isDraft={true}
      />
    </div>
  );
}
