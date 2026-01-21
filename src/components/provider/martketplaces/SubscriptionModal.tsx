import { CloseCircle, CheckRead } from "@solar-icons/react";
import { 
  MODAL_OVERLAY, 
  MODAL_CONTENT, 
  BUTTON_PRIMARY,
  BUTTON_OUTLINE,
  cn 
} from "@/lib/design-utils";

interface SubscriptionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectPlan: (plan: 'free' | 'paid') => void;
}

export default function SubscriptionModal({ 
  isOpen, 
  onClose,
  onSelectPlan 
}: SubscriptionModalProps) {
  if (!isOpen) return null;

  return (
    <div className={cn(MODAL_OVERLAY, "z-50 flex items-center justify-center p-4")}>
      <div className={cn(
        MODAL_CONTENT, 
        "max-w-4xl w-full p-0 bg-white rounded-2xl overflow-hidden animate-in zoom-in-95 duration-200"
      )}>
        
        {/* Header Section with soft gradient */}
        <div className="relative pt-12 pb-6 px-6 text-center bg-gradient-to-b from-primary-50/80 to-white">
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 text-black hover:text-gray-700 transition-colors"
          >
            <CloseCircle className="w-8 h-8"/>
          </button>

          <h2 className="text-2xl md:text-3xl font-montserrat-bold text-gray-900 mb-3">
            View Profile
          </h2>
          <p className="text-gray-600 max-w-lg mx-auto text-sm md:text-base leading-relaxed">
            Choose how you want to access this support worker's plan. Unlock more details and insights from the paid plan.
          </p>
        </div>

        {/* Plans Grid */}
        <div className="p-6 md:p-10 bg-white">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
            
            {/* 1. Basic Profile Card */}
            <div className="border border-gray-200 rounded-xl p-6 flex flex-col h-full hover:shadow-md transition-shadow">
              <div className="bg-gray-100 rounded-lg p-4 mb-6">
                <h3 className="font-montserrat-bold text-lg text-gray-900">Basic Profile</h3>
                <p className="text-gray-600 text-sm">View essential info for free</p>
              </div>

              <div className="mb-6 border-b border-gray-100 pb-6">
                <span className="text-2xl font-montserrat-bold text-gray-900">Free</span>
                <span className="text-gray-500">/month</span>
              </div>

              <ul className="space-y-4 mb-8 flex-grow">
                <FeatureItem text="Photo and Name" />
                <FeatureItem text="Location" />
                <FeatureItem text="Basic Details" />
              </ul>

              <button 
                onClick={() => onSelectPlan('free')}
                className={cn(BUTTON_OUTLINE, "w-full py-3 rounded-lg border-primary-600 text-primary-600 hover:bg-primary-50 font-montserrat-bold")}
              >
                Get Started
              </button>
            </div>

            {/* 2. Full Profile / Boosted Card */}
            <div className="border-2 border-primary-600 rounded-xl p-6 flex flex-col h-full relative shadow-lg transform md:-translate-y-2">
              <div className="bg-gray-100 rounded-lg p-4 mb-6 relative">
                <div className="absolute -top-3 right-4 bg-primary-600 text-white text-xs font-montserrat-bold px-3 py-1 rounded-full uppercase tracking-wide">
                  Best Choice
                </div>
                <h3 className="font-montserrat-bold text-lg text-gray-900">Full Profile</h3>
                <p className="text-gray-600 text-sm">Unlock details and competency Insights</p>
              </div>

              <div className="mb-6 border-b border-gray-100 pb-6">
                <span className="text-2xl font-montserrat-bold text-gray-900">$5-15</span>
                <span className="text-gray-500">/month</span>
              </div>

              <ul className="space-y-4 mb-8 flex-grow">
                <FeatureItem text="Photo and name" />
                <FeatureItem text="Location" />
                <FeatureItem text="Full profile + competency report" />
              </ul>

              <button 
                onClick={() => onSelectPlan('paid')}
                className={cn(BUTTON_PRIMARY, "w-full py-3 rounded-lg bg-primary-600 hover:bg-primary-700 text-white font-montserrat-bold shadow-primary-200")}
              >
                Get Started
              </button>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}

// Helper component for list items
function FeatureItem({ text }: { text: string }) {
  return (
    <li className="flex items-center gap-3">
      <CheckRead className="w-5 h-5 text-gray-900 shrink-0" /> {/* Using CheckRead to simulate double tick look if available, else standard check */}
      <span className="text-gray-700 text-sm font-medium">{text}</span>
    </li>
  );
}