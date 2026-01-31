import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Magnifer, Bell } from "@solar-icons/react";
import { PAGE_WRAPPER } from "@/lib/design-utils";
import { cn } from "@/lib/utils";
import { GAP, GRID_LAYOUTS } from "@/constants/design-system";
import WorkforceCard from "@/components/provider/organization/WorkforceCard";
import OnboardingModal from "@/components/provider/organization/OnboardingModal";
import AssignShiftModal from "@/components/provider/organization/AssignShiftModal";
import GeneralHeader from "@/components/GeneralHeader";
import { useAuth } from "@/contexts/AuthContext";
import { OrgWorker } from "@/types/organization";

// UI Components from Design System
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";

// Mock Data
const MOCK_WORKERS: OrgWorker[] = [
  { id: "1", name: "Sarah Johnson", role: "Disability Support Worker", avatar: "/avatars/sarah.jpg", location: "Brimbank", distance: "8km", hourlyRate: "$65-75/hr", rating: 4.5, status: "unvetted", isVerified: true },
  { id: "2", name: "Michael Chen", role: "Disability Support Worker", avatar: "/avatars/michael.jpg", location: "Brimbank", distance: "12km", hourlyRate: "$65-75/hr", rating: 4.2, status: "unvetted", isVerified: true },
  { id: "3", name: "Jessica Smith", role: "Disability Support Worker", avatar: "/avatars/jessica.jpg", location: "Albion", distance: "5km", hourlyRate: "$65-75/hr", rating: 4.8, status: "vetted", isVerified: true },
];

export default function ProviderWorkforcePage() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  
  // State
  const [activeTab, setActiveTab] = useState<"onboarding" | "vetted">("onboarding");
  const [workers, setWorkers] = useState<OrgWorker[]>(MOCK_WORKERS);
  
  // Modal States
  const [onboardingWorkerId, setOnboardingWorkerId] = useState<string | null>(null);
  const [assignShiftId, setAssignShiftId] = useState<string | null>(null);

  // Filter Logic
  const filteredWorkers = workers.filter(w => 
    activeTab === "onboarding" ? w.status === "unvetted" : w.status === "vetted"
  );

  // Handlers
  const handleStartOnboarding = (id: string) => {
    setOnboardingWorkerId(id);
  };

  const handleOnboardingComplete = () => {
    if (onboardingWorkerId) {
      // Move worker to 'vetted' status
      setWorkers(prev => prev.map(w => 
        w.id === onboardingWorkerId ? { ...w, status: "vetted" } : w
      ));
      setOnboardingWorkerId(null);
      // Optional: Auto switch to vetted tab to show the new worker
      setActiveTab("vetted");
    }
  };

  const handleAssignShift = (id: string) => {
    setAssignShiftId(id);
  };

  const handleDeleteWorker = (id: string) => {
    if(window.confirm("Are you sure you want to remove this worker?")) {
       setWorkers(prev => prev.filter(w => w.id !== id));
    }
  };

  // Helper to get active worker object for modals
  const activeOnboardingWorker = workers.find(w => w.id === onboardingWorkerId) 
    ? {
        name: workers.find(w => w.id === onboardingWorkerId)!.name,
        role: workers.find(w => w.id === onboardingWorkerId)!.role,
        avatar: workers.find(w => w.id === onboardingWorkerId)!.avatar,
        rating: workers.find(w => w.id === onboardingWorkerId)!.rating,
        location: workers.find(w => w.id === onboardingWorkerId)!.location,
        price: workers.find(w => w.id === onboardingWorkerId)!.hourlyRate
      } 
    : null;

  return (
    <div className={cn(PAGE_WRAPPER)}>
      <GeneralHeader
        user={user}
        onLogout={logout}
        onViewProfile={() => navigate("/provider/profile")}
        title="My Workforce"
        subtitle="Manage Support Worker Profiles, and Approvals"
        rightComponent={
          <div className="flex items-center gap-3 w-full md:w-auto">
            <div className="relative flex-grow md:w-64">
              <Magnifer className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input 
                placeholder="Search...." 
                className="w-full pl-10 h-11 rounded-full bg-white border-gray-200 focus:ring-primary-500" 
              />
            </div>
            <Button 
              variant="outline" 
              size="icon" 
              className="relative rounded-full border-gray-200 bg-white"
            >
               <Bell className="w-5 h-5 text-gray-600" />
               <Badge className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] w-4 h-4 flex items-center justify-center p-0 rounded-full border-2 border-white">
                 6
               </Badge>
            </Button>
          </div>
        }
      />

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b md:border-b-0 border-gray-100 pb-2 md:pb-0 w-full md:w-auto mt-6 mb-8">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setActiveTab("onboarding")}
          className={cn(
            "px-4 h-6 rounded-full text-xs font-montserrat-semibold whitespace-nowrap overflow-hidden",
            activeTab === 'onboarding' 
              ? "bg-primary text-white hover:bg-primary-700 hover:text-white" 
              : "text-gray-600 hover:bg-gray-50"
          )}
        >
          Onboarding Candidates 
          <Badge variant="secondary" className="ml-1 bg-white/20 text-inherit h-5 px-1.5">
            {workers.filter(w => w.status === 'unvetted').length}
          </Badge>
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setActiveTab("vetted")}
          className={cn(
            "px-4 h-8 rounded-full text-xs font-montserrat-semibold whitespace-nowrap",
            activeTab === 'vetted' 
              ? "bg-primary text-white hover:bg-primary-700 hover:text-white" 
              : "text-gray-600 hover:bg-gray-50"
          )}
        >
          Vetted Support Workers 
          <Badge variant="secondary" className="ml-1 bg-white/20 text-inherit h-5 px-1.5">
            {workers.filter(w => w.status === 'vetted').length}
          </Badge>
        </Button>
      </div>

      {/* Grid Content */}
      <div className={cn(GRID_LAYOUTS.responsive, GAP.responsive)}>
        {filteredWorkers.map((worker) => (
          <WorkforceCard
            key={worker.id}
            worker={worker}
            onViewProfile={() => navigate(`/provider/worker/${worker.id}`)}
            onVetWorker={() => {}} // Not used in this flow
            onHireWorker={() => {}} // Not used in this flow
            onAddToWorkforce={handleStartOnboarding}
            onAssignShift={handleAssignShift}
            onDeleteWorker={handleDeleteWorker}
          />
        ))}
        
        {filteredWorkers.length === 0 && (
          <Card className="col-span-full py-20 text-center text-gray-500 bg-white rounded-xl border-gray-200 border-dashed">
            <p className="font-medium">No workers found in this section.</p>
          </Card>
        )}
      </div>

      {/* Modals */}
      <OnboardingModal 
        isOpen={!!onboardingWorkerId}
        worker={activeOnboardingWorker}
        onClose={() => setOnboardingWorkerId(null)}
        onComplete={handleOnboardingComplete}
      />

      <AssignShiftModal 
        isOpen={!!assignShiftId}
        workerName={workers.find(w => w.id === assignShiftId)?.name || ""}
        onClose={() => setAssignShiftId(null)}
        onConfirm={(shiftId) => {
           // Handle shift assignment logic here
           setAssignShiftId(null);
           alert("Shift assigned successfully!");
        }}
      />

    </div>
  );
}