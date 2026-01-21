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
  ConfettiMinimalistic
} from "@solar-icons/react";
import { 
  PAGE_WRAPPER, 
  PAGE_CONTAINER, 
  BUTTON_OUTLINE,
  CARD,
  cn 
} from "@/lib/design-utils";
import GeneralHeader from "@/components/GeneralHeader";
import { useAuth } from "@/contexts/AuthContext";
import { ComplianceTab, ExperienceTab, RiskTab } from "@/components/provider/martketplaces/WorkerProfileTabs";
import SubscriptionModal from "@/components/provider/martketplaces/SubscriptionModal";

// --- Mock Data ---
const WORKER_DETAILS = {
  id: "1",
  name: "Sarah Johnson",
  role: "Disability Support Worker",
  rating: 4.5,
  location: "Brimbank (42 km)",
  price: "$40",
  image: "/placeholder-avatar.jpg",
  isVerified: true
};

export default function ProviderSupportWorkerProfilePage() {
  const navigate = useNavigate();
  const { workerId } = useParams();
  const { user, logout } = useAuth();
  
  // State
  const [activeTab, setActiveTab] = useState<'compliance' | 'experience' | 'risk'>('compliance');
  const [isUnlocked, setIsUnlocked] = useState(false); // Controls Blurred vs Clear view
  const [showSubscription, setShowSubscription] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  // --- Handlers ---

  // Simulating the flow: User clicks "Unlock" or "Add" -> Sub Modal -> Pay -> Success -> Unlocked
  const handleUnlockAttempt = () => {
    if (isUnlocked) return;
    setShowSubscription(true);
  };

  const handlePlanSelection = (plan: 'free' | 'paid') => {
    setShowSubscription(false);
    
    // Simulate payment processing delay
    setTimeout(() => {
        setShowSuccessModal(true);
    }, 500);
  };

  const handlePaymentSuccess = () => {
    setShowSuccessModal(false);
    setIsUnlocked(true); // This unblurs the content
  };

  // Add to workflow action (Only works if unlocked, otherwise triggers unlock)
  const handleAddToWorkflow = () => {
    if (!isUnlocked) {
      handleUnlockAttempt();
    } else {
      // Logic to actually add to workflow
      alert("Added to workflow panel!");
    }
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
        <div className={cn(CARD, "p-6 md:p-8 rounded-2xl bg-white shadow-sm border border-gray-100")}>
          
          {/* 1. Header Section */}
          <div className="flex flex-col items-center justify-center mb-8">
            <div className="w-24 h-24 rounded-full border-4 border-gray-100 overflow-hidden mb-3">
              <img 
                src={WORKER_DETAILS.image} 
                alt={WORKER_DETAILS.name} 
                className="w-full h-full object-cover"
              />
            </div>
            
            <div className="flex items-center gap-2 mb-1">
              <h1 className="text-xl font-montserrat-bold text-gray-900">{WORKER_DETAILS.name}</h1>
              {WORKER_DETAILS.isVerified && <VerifiedCheck className="w-6 h-6 text-blue-600" />}
            </div>
            
            <p className="text-gray-500 font-medium mb-3">{WORKER_DETAILS.role}</p>
            
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
            <button className="w-10 h-10 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center hover:bg-blue-100 transition-colors">
              <Eye className="w-6 h-6" />
            </button>
            
            {/* Add Icon (Unlock Trigger) */}
            <button 
              onClick={handleAddToWorkflow}
              className="w-10 h-10 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center hover:bg-blue-100 transition-colors"
            >
              <AddSquare className="w-6 h-6" />
            </button>
            
            {/* Video Icon */}
            <button className="w-10 h-10 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center hover:bg-blue-100 transition-colors">
              <Videocamera className="w-6 h-6" />
            </button>

            {/* Decline Button */}
            <button className="h-10 px-8 rounded-lg border border-red-500 text-red-500 flex items-center gap-2 hover:bg-red-50 transition-colors font-medium">
              <CloseCircle className="w-5 h-5" />
              Decline
            </button>
          </div>

          {/* 3. Tabs Navigation */}
          <div className="bg-gray-100 p-1 rounded-lg flex flex-col md:flex-row gap-1 mb-8">
            <TabButton 
              label="Compliance Status & Competency Score" 
              isActive={activeTab === 'compliance'} 
              onClick={() => setActiveTab('compliance')} 
            />
            <TabButton 
              label="Experience & Readability Score" 
              isActive={activeTab === 'experience'} 
              onClick={() => setActiveTab('experience')} 
            />
            <TabButton 
              label="Risk Assessment & Specialization Match" 
              isActive={activeTab === 'risk'} 
              onClick={() => setActiveTab('risk')} 
            />
          </div>

          {/* 4. Tab Content (Blur logic handled inside) */}
          <div className="min-h-[400px]">
            {activeTab === 'compliance' && <ComplianceTab isUnlocked={isUnlocked} />}
            {activeTab === 'experience' && <ExperienceTab isUnlocked={isUnlocked} />}
            {activeTab === 'risk' && <RiskTab isUnlocked={isUnlocked} />}
            
            {/* Locked Overlay Hint (Optional - to guide user) */}
            {!isUnlocked && (
              <div className="mt-8 p-4 bg-blue-50 rounded-lg border border-blue-100 flex flex-col items-center text-center">
                <p className="text-blue-800 font-medium mb-2">Want to see full details?</p>
                <button 
                  onClick={handleUnlockAttempt}
                  className="text-sm bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 font-bold shadow-md"
                >
                  Unlock Full Profile
                </button>
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
            <h3 className="text-xl font-montserrat-bold text-gray-900 mb-2">Payment Successful</h3>
            <p className="text-sm text-gray-600 mb-6">
              This support worker has been added to your workforce panel. AI vetting insights are now available.
            </p>
            <button 
              onClick={handlePaymentSuccess}
              className="w-full bg-blue-600 text-white py-3 rounded-xl font-bold hover:bg-blue-700"
            >
              Continue to Panel
            </button>
          </div>
        </div>
      )}

    </div>
  );
}

// Helper Tab Button
const TabButton = ({ label, isActive, onClick }: { label: string, isActive: boolean, onClick: () => void }) => (
  <button
    onClick={onClick}
    className={cn(
      "flex-1 py-2.5 px-3 rounded-md text-xs md:text-sm font-semibold transition-all duration-200",
      isActive 
        ? "bg-white text-gray-900 shadow-sm" 
        : "text-gray-500 hover:text-gray-700 hover:bg-gray-200/50"
    )}
  >
    {label}
  </button>
);