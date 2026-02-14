import { useState, useEffect } from "react";
import { CloseCircle, CheckRead, ConfettiMinimalistic } from "@solar-icons/react";
import { 
  MODAL_OVERLAY, 
  MODAL_CONTENT, 
  BUTTON_PRIMARY,
  cn 
} from "@/lib/design-utils";
import { VettingPlanTier } from "@/types/organization";

interface VettingFlowProps {
  isOpen: boolean;
  workerName: string;
  onClose: () => void;
  onComplete: () => void;
}

type Step = 'plans' | 'video-setup' | 'loading' | 'success';

export default function VettingFlow({ isOpen, workerName, onClose, onComplete }: VettingFlowProps) {
  const [step, setStep] = useState<Step>('plans');
  const [selectedPlan, setSelectedPlan] = useState<VettingPlanTier | null>(null);

  // Reset state when opening
  useEffect(() => {
    if (isOpen) {
      setStep('plans');
      setSelectedPlan(null);
    }
  }, [isOpen]);

  // Loading Simulation
  useEffect(() => {
    if (step === 'loading') {
      const timer = setTimeout(() => {
        setStep('success');
      }, 2500); // 2.5s simulated wait
      return () => clearTimeout(timer);
    }
  }, [step]);

  const handlePlanSelect = (plan: VettingPlanTier) => {
    setSelectedPlan(plan);
    if (plan === 'premium') {
      setStep('video-setup');
    } else {
      setStep('loading');
    }
  };

  const handleScheduleAssessment = () => {
    setStep('loading');
  };

  if (!isOpen) return null;

  return (
    <div className={cn(MODAL_OVERLAY, "z-50 flex items-center justify-center p-4")}>
      
      {/* 1. PLANS STEP */}
      {step === 'plans' && (
        <div className={cn(MODAL_CONTENT, "max-w-5xl w-full p-8 rounded-2xl bg-white")}>
          <div className="flex justify-between items-start mb-2">
            <div className="text-center w-full">
              <h2 className="text-2xl font-montserrat-bold text-gray-900">Assessment Plans</h2>
              <p className="text-gray-500 text-sm mt-1">Choose the level of insights you need</p>
            </div>
            <button onClick={onClose} className="absolute right-6 top-6 text-gray-400 hover:text-gray-600">
               <CloseCircle className="w-8 h-8" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
            {/* Basic Plan */}
            <PlanCard 
              title="Basic Report" 
              desc="Get a quick overview" 
              price="$89" 
              features={['Compliance', 'Competency']} 
              onSelect={() => handlePlanSelect('basic')}
            />
            {/* Standard Plan */}
            <PlanCard 
              title="Standard Report" 
              desc="Gain deeper insights" 
              price="$119" 
              features={['Compliance', 'Competency', 'Risk Scoring']} 
              onSelect={() => handlePlanSelect('standard')}
              isPopular
            />
            {/* Premium Plan */}
            <PlanCard 
              title="Premium Report" 
              desc="Unlock the full potential" 
              price="$149" 
              features={['Compliance', 'Competency', 'Risk Scoring', 'Video Assessment']} 
              onSelect={() => handlePlanSelect('premium')}
            />
          </div>
        </div>
      )}

      {/* 2. VIDEO ASSESSMENT SETUP (Only for Premium) */}
      {step === 'video-setup' && (
        <div className={cn(MODAL_CONTENT, "max-w-xl w-full p-6 rounded-2xl bg-white")}>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-montserrat-bold text-gray-900">Video Assessment Setup</h2>
            <button onClick={onClose}><CloseCircle className="w-6 h-6 text-gray-400" /></button>
          </div>

          <div className="space-y-4">
             <div>
                <label className="block text-sm font-montserrat-sembold text-gray-900 mb-2">Name of Assessment</label>
                <input className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:ring-2 focus:ring-primary-500 outline-none" placeholder="Input name of assessment" />
             </div>
             <div>
                <label className="block text-sm font-montserrat-sembold text-gray-900 mb-2">Preferred Date</label>
                <input className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:ring-2 focus:ring-primary-500 outline-none" placeholder="Select day for the video assessment" />
             </div>
             <div>
                <label className="block text-sm font-montserrat-sembold text-gray-900 mb-2">Preferred Time</label>
                <input className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:ring-2 focus:ring-primary-500 outline-none" placeholder="Choose a suitable time" />
             </div>
             <div>
                <label className="block text-sm font-montserrat-sembold text-gray-900 mb-2">Additional Note</label>
                <textarea className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm h-24 resize-none focus:ring-2 focus:ring-primary-500 outline-none" placeholder="Any special instructions or context" />
             </div>

             <button 
               onClick={handleScheduleAssessment}
               className={cn(BUTTON_PRIMARY, "w-full py-3.5 bg-primary-600 hover:bg-primary-700 text-white font-montserrat-bold rounded-lg mt-4")}
             >
               Schedule Assessment
             </button>
          </div>
        </div>
      )}

      {/* 3. LOADING STATE */}
      {step === 'loading' && (
        <div className={cn(MODAL_CONTENT, "max-w-sm w-full p-10 rounded-2xl bg-white flex flex-col items-center justify-center text-center")}>
          <div className="relative w-20 h-20 mb-6">
             {/* Spinner implementation using SVG */}
             <svg className="animate-spin w-full h-full text-primary-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
               <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
               <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
             </svg>
             <span className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 font-montserrat-bold text-primary-600 text-sm">95%</span>
          </div>
          <h3 className="font-montserrat-bold text-gray-900 text-lg">Vetting Support worker...</h3>
          <p className="text-gray-500 text-sm mt-1">Please wait</p>
        </div>
      )}

      {/* 4. SUCCESS STATE */}
      {step === 'success' && (
        <div className={cn(MODAL_CONTENT, "max-w-md w-full p-8 rounded-2xl bg-white text-center")}>
           <div className="w-16 h-16 bg-white mx-auto mb-4 flex items-center justify-center">
             <ConfettiMinimalistic className="w-12 h-12 text-yellow-500" />
           </div>
           <h2 className="text-xl font-montserrat-bold text-gray-900 mb-2">Vetted Successfully</h2>
           <p className="text-gray-600 mb-8 px-4">
             You have successfully vetted <span className="font-montserrat-bold text-gray-900">Support Worker</span> {workerName}
           </p>
           
           <button 
             onClick={onComplete}
             className={cn(BUTTON_PRIMARY, "w-full py-3 bg-primary-600 hover:bg-primary-700 text-white font-montserrat-bold rounded-xl")}
           >
             View Report
           </button>
        </div>
      )}

    </div>
  );
}

// Plan Card Sub-Component
function PlanCard({ title, desc, price, features, onSelect, isPopular }: any) {
  return (
    <div className={cn(
      "border rounded-xl p-6 flex flex-col h-full bg-gray-50", 
      isPopular ? "border-primary-600 ring-1 ring-primary-600 relative" : "border-gray-200"
    )}>
      {/* Header */}
      <div className="mb-6 bg-gray-200/50 p-4 rounded-lg -mx-2 -mt-2">
         <h3 className="font-montserrat-bold text-lg text-gray-900">{title}</h3>
         <p className="text-gray-600 text-xs mt-1">{desc}</p>
      </div>

      {/* Price */}
      <div className="mb-6 pb-6 border-b border-gray-200">
         <span className="text-2xl font-montserrat-bold text-gray-900">{price}</span>
         <span className="text-gray-500 text-sm">/month</span>
      </div>

      {/* Features */}
      <div className="space-y-4 flex-grow mb-8">
        {features.map((feat: string) => (
           <div key={feat} className="flex items-center gap-3">
              <CheckRead className="w-4 h-4 text-gray-900" />
              <span className="text-sm text-gray-700">{feat}</span>
           </div>
        ))}
      </div>

      {/* Button */}
      <button 
        onClick={onSelect}
        className={cn(
          "w-full py-3 rounded-lg font-montserrat-bold transition-colors",
          isPopular 
            ? "bg-primary-600 text-white hover:bg-primary-700" 
            : "bg-white border border-primary-600 text-primary-600 hover:bg-primary-50"
        )}
      >
        Get Started
      </button>
    </div>
  );
}