import { useState } from "react";
import { Magnifer, AltArrowDown } from "@solar-icons/react";
import { PAGE_WRAPPER, GRID_4_COLS, cn } from "@/lib/design-utils";
import { Input } from "@/components/ui/input";
import { MOCK_WORKERS } from "@/types/marketplace";
import { CONTAINER_PADDING, GAP, GRID_LAYOUTS } from "@/constants/design-system";
import WorkerCard from "@/components/provider/martketplaces/WorkerCard";
import FilterSheet from "@/components/provider/martketplaces/FilterSheet";
import GeneralHeader from "@/components/GeneralHeader";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import SubscriptionModal from "@/components/provider/martketplaces/SubscriptionModal";

// Filter Data (Derived from your screenshots)
const FILTER_DATA = {
  suburbs: [
    { id: "bondi", label: "Bondi" },
    { id: "manly", label: "Manly" },
    { id: "ryde", label: "Ryde" },
    { id: "liverpool", label: "Liverpool" },
  ],
  specialization: [
    { id: "autism", label: "Autism" },
    { id: "behavioral", label: "Behavioral Support" },
    { id: "manual", label: "Manual Handling" },
    { id: "peg", label: "PEG Feeding" },
  ],
  experience: [
    { id: "entry", label: "Entry" },
    { id: "mid", label: "Mid-level" },
    { id: "senior", label: "Senior" },
  ],
  certification: [
    { id: "cert3", label: "Cert III" },
    { id: "cert4", label: "Cert IV" },
    { id: "rn", label: "RN" },
    { id: "ahpra", label: "AHPRA" },
  ],
  availability: [
    { id: "weekdays", label: "Weekdays" },
    { id: "weekend", label: "Weekend" },
    { id: "overnight", label: "Overnight" },
  ],
};

export default function ProviderMarketplacePage() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [showSubscriptionModal, setShowSubscriptionModal] = useState(false);
  const [selectedWorkerId, setSelectedWorkerId] = useState<string | null>(null);

  // Updated Handler
  const handleViewProfile = (id: string) => {
    // Ideally check if user is already subscribed here
    const isSubscribed = false; // Mock status
    
    if (isSubscribed) {
      navigate(`/provider/find-support-workers/${id}`);
    } else {
      setSelectedWorkerId(id);
      setShowSubscriptionModal(true);
    }
  };

  const handlePlanSelection = (plan: 'free' | 'paid') => {
    console.log(`User selected ${plan} plan for worker ${selectedWorkerId}`);
    setShowSubscriptionModal(false);
    
    if (plan === 'paid') {
      // Navigate to payment or checkout
      // navigate('/checkout');
    } else {
      // Navigate to limited view
      navigate(`/provider/find-support-workers/${selectedWorkerId}?view=limited`);
    }
  };

  // Search State
  const [searchQuery, setSearchQuery] = useState("");

  // Filter Modal States
  const [activeModal, setActiveModal] = useState<
    keyof typeof FILTER_DATA | null
  >(null);

  // Selected Filter Values
  const [filters, setFilters] = useState({
    suburbs: "",
    radius: "",
    role: "",
    qualification: "",
    specialization: "",
    availability: "",
    experience: "",
  });

  const handleContact = (id: string) => {
    console.log("Contact initiated", id);
  };

  const FilterButton = ({
    label,
    filterKey,
    active,
  }: {
    label: string;
    filterKey: keyof typeof FILTER_DATA;
    active?: boolean;
  }) => (
    <button
      onClick={() => setActiveModal(filterKey)}
      className={cn(
        "flex items-center gap-2 px-4 py-2 rounded-full border text-sm whitespace-nowrap transition-all",
        active
          ? "border-primary-600 bg-primary-50 text-primary-700" 
          : "border-gray-300 bg-white text-gray-700 hover:border-gray-400"
      )}
    >
      <span>
        {active && filters[filterKey as keyof typeof filters]
          ? filters[filterKey as keyof typeof filters]
          : label}
      </span>
      <AltArrowDown className="w-4 h-4" />
    </button>
  );

  return (
    <div className={cn(PAGE_WRAPPER)}>
      <GeneralHeader
        title="Marketplace"
        subtitle="Find and approach support worker"
        onViewProfile={() => {}}
        onLogout={logout}
        user={user}
        rightComponent={
          <div className="relative flex-grow md:w-80">
            <Magnifer className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            <Input
              placeholder="Search...."
              className="pl-10 h-11 rounded-full bg-gray-50 border-gray-200 focus:ring-primary-500"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        }
      />
      {/* 2. Scrollable Filter Bar */}
      <div className="flex items-center gap-3 overflow-x-auto pb-2 no-scrollbar -mx-6 px-6 md:mx-0 md:px-0">
        <FilterButton
          label="Suburbs"
          filterKey="suburbs"
          active={!!filters.suburbs}
        />
        <button className="flex items-center gap-2 px-4 py-2 rounded-full border border-gray-300 bg-white text-gray-700 text-sm whitespace-nowrap">
          Radius <AltArrowDown className="w-4 h-4" />
        </button>
        <button className="flex items-center gap-2 px-4 py-2 rounded-full border border-gray-300 bg-white text-gray-700 text-sm whitespace-nowrap">
          Role Type <AltArrowDown className="w-4 h-4" />
        </button>
        <FilterButton
          label="Qualification"
          filterKey="certification"
          active={!!filters.qualification}
        />
        <FilterButton
          label="Specialization"
          filterKey="specialization"
          active={!!filters.specialization}
        />
        <FilterButton
          label="Availability"
          filterKey="availability"
          active={!!filters.availability}
        />
        <FilterButton
          label="Experience Level"
          filterKey="experience"
          active={!!filters.experience}
        />
      </div>
      {/* 3. Main Content Grid */}
      <div className={cn(CONTAINER_PADDING)}>
        <div className={cn(GRID_LAYOUTS.responsive, GAP.base)}>
          {MOCK_WORKERS.map((worker) => (
            <WorkerCard
              key={worker.id}
              worker={worker}
              onViewProfile={handleViewProfile}
              onContact={handleContact}
            />
          ))}
        </div>

        {/* Pagination & Showing Count */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <span>Showing</span>
            <select className="border border-gray-300 rounded-md p-1 bg-white focus:outline-none focus:ring-1 focus:ring-primary-500">
              <option>5 entries</option>
              <option>10 entries</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            <button className="w-8 h-8 flex items-center justify-center border border-gray-200 rounded bg-white text-gray-500 hover:bg-gray-50">
              &lt;
            </button>
            <button className="w-8 h-8 flex items-center justify-center bg-primary-700 text-white rounded">
              1
            </button>
            <button className="w-8 h-8 flex items-center justify-center border border-gray-200 rounded bg-white text-gray-600 hover:bg-gray-50">
              2
            </button>
            <button className="w-8 h-8 flex items-center justify-center border border-gray-200 rounded bg-white text-gray-600 hover:bg-gray-50">
              3
            </button>
            <button className="w-8 h-8 flex items-center justify-center border border-gray-200 rounded bg-white text-gray-600 hover:bg-gray-50">
              4
            </button>
            <button className="w-8 h-8 flex items-center justify-center border border-gray-200 rounded bg-white text-gray-600 hover:bg-gray-50">
              5
            </button>
            <button className="w-8 h-8 flex items-center justify-center border border-gray-200 rounded bg-white text-gray-500 hover:bg-gray-50">
              &gt;
            </button>
          </div>
        </div>
      </div>

      {/* 4. Filter Modals/Sheets */}
      {/* Suburbs Filter */}
      <FilterSheet
        isOpen={activeModal === "suburbs"}
        onClose={() => setActiveModal(null)}
        title="Suburbs"
        options={FILTER_DATA.suburbs}
        selectedId={filters.suburbs}
        onApply={(val) => setFilters((prev) => ({ ...prev, suburbs: val }))}
      />

      {/* Specialization Filter */}
      <FilterSheet
        isOpen={activeModal === "specialization"}
        onClose={() => setActiveModal(null)}
        title="Specialization"
        options={FILTER_DATA.specialization}
        selectedId={filters.specialization}
        onApply={(val) =>
          setFilters((prev) => ({ ...prev, specialization: val }))
        }
      />

      {/* Certification/Qualification Filter */}
      <FilterSheet
        isOpen={activeModal === "certification"}
        onClose={() => setActiveModal(null)}
        title="Certification"
        options={FILTER_DATA.certification}
        selectedId={filters.qualification}
        onApply={(val) =>
          setFilters((prev) => ({ ...prev, qualification: val }))
        }
      />

      {/* Experience Filter */}
      <FilterSheet
        isOpen={activeModal === "experience"}
        onClose={() => setActiveModal(null)}
        title="Experience Level"
        options={FILTER_DATA.experience}
        selectedId={filters.experience}
        onApply={(val) => setFilters((prev) => ({ ...prev, experience: val }))}
      />

      {/* Availability Filter */}
      <FilterSheet
        isOpen={activeModal === "availability"}
        onClose={() => setActiveModal(null)}
        title="Availability"
        options={FILTER_DATA.availability}
        selectedId={filters.availability}
        onApply={(val) =>
          setFilters((prev) => ({ ...prev, availability: val }))
        }
      />

      <SubscriptionModal 
        isOpen={showSubscriptionModal}
        onClose={() => setShowSubscriptionModal(false)}
        onSelectPlan={handlePlanSelection}
      />
    </div>
  );
}
