import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  VerifiedCheck,
  Star,
  MapPoint,
  DollarMinimalistic,
  Eye,
  AddSquare,
  Videocamera,
  CloseCircle,
  ConfettiMinimalistic,
  VideocameraAdd,
} from "@solar-icons/react";
import {
  PAGE_WRAPPER,
  PAGE_CONTAINER,
  BUTTON_OUTLINE,
  CARD,
  cn,
  FLEX_ROW_CENTER,
  TRANSITION,
} from "@/lib/design-utils";
import { Button } from "@/components/ui/button";
import GeneralHeader from "@/components/GeneralHeader";
import { useAuth } from "@/contexts/AuthContext";
import {
  ComplianceTab,
  ExperienceTab,
  RiskTab,
} from "@/components/provider/martketplaces/WorkerProfileTabs";
import SubscriptionModal from "@/components/provider/martketplaces/SubscriptionModal";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import {
  BG_COLORS,
  FONT_FAMILY,
  GAP,
  RADIUS,
  TEXT_COLORS,
} from "@/constants/design-system";
import ScheduleInterviewModal, {
  ScheduleInterviewData,
} from "@/components/provider/interviews/ScheduleInterviewModal";

// --- Mock Data ---
const WORKER_DETAILS = {
  id: "1",
  name: "Sarah Johnson",
  role: "Disability Support Worker",
  rating: 4.5,
  location: "Brimbank (42 km)",
  price: "$40",
  image: "/placeholder-avatar.jpg",
  isVerified: true,
};

export default function ProviderSupportWorkerProfilePage() {
  const navigate = useNavigate();
  const { workerId } = useParams();
  const { user, logout } = useAuth();

  // State
  const [activeTab, setActiveTab] = useState<
    "compliance" | "experience" | "risk"
  >("compliance");
  const [isUnlocked, setIsUnlocked] = useState(false); // Controls Blurred vs Clear view
  const [showSubscription, setShowSubscription] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [isScheduling, setIsScheduling] = useState(false);

  // --- Handlers ---

  // Simulating the flow: User clicks "Unlock" or "Add" -> Sub Modal -> Pay -> Success -> Unlocked
  const handleUnlockAttempt = () => {
    if (isUnlocked) return;
    setShowSubscription(true);
  };

  const handlePlanSelection = (plan: "free" | "paid") => {
    setShowSubscription(false);

    // Simulate payment processing delay
    setTimeout(() => {
      setShowSuccessModal(true);
    }, 500);
  };

  const handlePaymentSuccess = () => {
    setShowSuccessModal(false);
    setIsUnlocked(true); // This unblurs the content
    setShowScheduleModal(true); // Open scheduling after successful payment
  };

  const handleScheduleInterview = (data: ScheduleInterviewData) => {
    setIsScheduling(true);

    // Simulate scheduling delay
    setTimeout(() => {
      setIsScheduling(false);
      setShowScheduleModal(false);

      // Navigate to Interview Page with candidate info
      const params = new URLSearchParams({
        candidateId: WORKER_DETAILS.id,
        candidateName: data.name,
        preferredDate: data.preferredDate,
        preferredTime: data.preferredTime,
        notes: data.additionalNotes,
      });

      navigate(`/provider/interviews?${params.toString()}`);
    }, 500);
  };

  return (
    <div className={cn(PAGE_WRAPPER)}>
      <GeneralHeader
        showBackButton
        title="Marketplace"
        subtitle="Back to MarketPlace"
        user={user}
        onLogout={logout}
        onViewProfile={() => navigate("/participant/profile")}
        // Custom left component to match "Back to Marketplace" link in design
      />

      <div className={cn(PAGE_CONTAINER, "mt-6 max-w-4xl")}>
        <div
          className={cn(
            CARD,
            "p-6 md:p-8 rounded-2xl bg-white shadow-sm border border-gray-100",
          )}
        >
          {/* 1. Header Section */}
          <div className="flex flex-col items-center justify-center mb-8">
            <Avatar className="w-24 h-24 border-4 border-gray-100 mb-3">
              <AvatarImage
                src={WORKER_DETAILS.image}
                alt={WORKER_DETAILS.name}
                className="object-cover"
              />
              <AvatarFallback className="bg-gray-100 text-gray-900 font-montserrat-bold text-lg">
                {WORKER_DETAILS.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </AvatarFallback>
            </Avatar>

            <div className="flex items-center gap-2 mb-1">
              <h1 className="text-xl font-montserrat-bold text-gray-900">
                {WORKER_DETAILS.name}
              </h1>
              {WORKER_DETAILS.isVerified && (
                <VerifiedCheck className="w-6 h-6 text-primary-600" />
              )}
            </div>

            <p className="text-gray-500 font-medium mb-3">
              {WORKER_DETAILS.role}
            </p>

            <div className="flex items-center gap-4 text-sm text-gray-600">
              <div className="flex items-center gap-1">
                <Star className="w-4 h-4 text-yellow-500" />
                <span>{WORKER_DETAILS.rating}</span>
              </div>
              <div className="w-px h-4 bg-gray-300" />
              <div className="flex items-center gap-1">
                <MapPoint className="w-4 h-4 text-gray-400" />
                <span>{WORKER_DETAILS.location}</span>
              </div>
              <div className="w-px h-4 bg-gray-300" />
              <div className="flex items-center gap-1">
                <DollarMinimalistic className="w-4 h-4 text-gray-400" />
                <span>{WORKER_DETAILS.price}</span>
              </div>
            </div>
          </div>

          {/* 2. Action Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-3 mb-8">
            {/* View Icon (Blue background) */}
            <Button
              variant="ghost"
              onClick={handleUnlockAttempt}
              className={cn(
                "w-fit h-10 px-2",
                TEXT_COLORS.primary,
                BG_COLORS.primaryLight,
                "hover:bg-primary/20",
                FONT_FAMILY.montserratSemibold,
                "rounded-lg",
              )}
            >
              <Eye className="w-6 h-6" />
            </Button>

            {/* Video Icon */}
            <Button
              variant="ghost"
              onClick={() => setShowScheduleModal(true)}
              className={cn(
                "w-fit h-10 px-4",
                TEXT_COLORS.primary,
                BG_COLORS.primaryLight,
                "hover:bg-primary/20",
                FONT_FAMILY.montserratSemibold,
                "rounded-lg gap-2",
              )}
            >
              <VideocameraAdd className="w-6 h-6" />
              <span>Schedule for an interview</span>
            </Button>

            {/* Decline Button */}
            {/* <Button variant="outline" onClick={()=>navigate(-1)} className="h-10 px-8 rounded-lg border-red-500 text-red-500 hover:bg-red-50 font-medium">
              <CloseCircle className="w-5 h-5" />
              Decline
            </Button> */}
          </div>

          {/* 3. Tabs Navigation */}
          <div className="bg-gray-100 p-1 rounded-lg flex flex-col md:flex-row gap-1 mb-8">
            <TabButton
              label="Compliance Status & Competency Score"
              isActive={activeTab === "compliance"}
              onClick={() => setActiveTab("compliance")}
            />
            <TabButton
              label="Experience & Readability Score"
              isActive={activeTab === "experience"}
              onClick={() => setActiveTab("experience")}
            />
            <TabButton
              label="Risk Assessment & Specialization Match"
              isActive={activeTab === "risk"}
              onClick={() => setActiveTab("risk")}
            />
          </div>

          {/* 4. Tab Content (Blur logic handled inside) */}
          <div className="min-h-[400px]">
            {activeTab === "compliance" && (
              <ComplianceTab isUnlocked={isUnlocked} />
            )}
            {activeTab === "experience" && (
              <ExperienceTab isUnlocked={isUnlocked} />
            )}
            {activeTab === "risk" && <RiskTab isUnlocked={isUnlocked} />}

            {/* Locked Overlay Hint (Optional - to guide user) */}
            {!isUnlocked && (
              <div className="mt-8 p-4 bg-primary-50 rounded-lg border border-primary-100 flex flex-col items-center text-center">
                <p className="text-primary-800 font-medium mb-2">
                  Want to see full details?
                </p>
                <Button
                  onClick={handleUnlockAttempt}
                  className="text-sm bg-primary-600 text-white px-4 py-2 rounded-md hover:bg-primary-700 font-montserrat-bold shadow-md"
                >
                  Unlock Full Profile
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* --- Modals --- */}

      {/* 1. Subscription Selection */}
      <SubscriptionModal
        isOpen={showSubscription}
        onClose={() => setShowSubscription(false)}
        onSelectPlan={handlePlanSelection}
      />

      {/* 2. Success Modal (Simulates 'Payment Successful') */}
      {showSuccessModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-8 max-w-sm w-full text-center animate-in zoom-in-95">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <ConfettiMinimalistic className="w-8 h-8 text-orange-500" />
            </div>
            <h3 className="text-xl font-montserrat-bold text-gray-900 mb-2">
              Payment Successful
            </h3>
            <p className="text-sm text-gray-600 mb-6">
              This support worker has been added to your workforce panel. AI
              vetting insights are now available.
            </p>
            <Button
              onClick={handlePaymentSuccess}
              className="w-full bg-primary-600 text-white py-3 rounded-xl font-montserrat-bold hover:bg-primary-700"
            >
              Continue to Panel
            </Button>
          </div>
        </div>
      )}
      <ScheduleInterviewModal
        isOpen={showScheduleModal}
        candidateName={WORKER_DETAILS.name}
        onClose={() => {
          setShowScheduleModal(false);
        }}
        onSchedule={handleScheduleInterview}
        isProcessing={isScheduling}
      />
    </div>
  );
}

// Helper Tab Button
const TabButton = ({
  label,
  isActive,
  onClick,
}: {
  label: string;
  isActive: boolean;
  onClick: () => void;
}) => (
  <Button
    variant="ghost"
    onClick={onClick}
    className={cn(
      "flex-1 py-2.5 px-3 rounded-md text-xs md:text-sm font-montserrat-semibold",
      isActive
        ? "bg-white text-gray-900 shadow-sm hover:bg-white"
        : "text-gray-500 hover:text-gray-700 hover:bg-gray-200/50",
    )}
  >
    {label}
  </Button>
);
