import { useState } from "react";
import {
  Bell,
  Magnifer,
  Upload,
  AltArrowDown,
  CalendarMinimalistic
} from "@solar-icons/react";
import {
  PAGE_WRAPPER,
  BUTTON_PRIMARY,
  cn
} from "@/lib/design-utils";
import { Button } from "@/components/ui/button";
import ShiftMetrics from "@/components/provider/shifts/ShiftMetrics";
import CalendarGrid from "@/components/provider/shifts/CalendarGrid";
import ShiftCard from "@/components/provider/shifts/ShiftCard";
import ShiftDetailModal from "@/components/provider/shifts/ShiftDetailModal";
import { RecommendationModal } from "@/components/modals/RecommendationModal";
import { Shift } from "@/types/shift";
import { useAuth } from "@/contexts/AuthContext";
import GeneralHeader from "@/components/GeneralHeader";
import { BORDER_STYLES, BORDER_WIDTH, FONT_FAMILY, RADIUS, TEXT_COLORS } from "@/constants/design-system";

// Mock Candidate Data for the recommendations
interface Candidate {
  id: string;
  name: string;
  role: string;
  rating: number;
  initials: string;
  responseTime: string;
  availability: 'Available' | 'Maybe' | 'Unavailable';
  matchScore: number;
}

// Mock Data Generation
const MOCK_SHIFTS: Shift[] = [
  {
    id: "1",
    type: "Personal Care",
    riskLevel: "Critical",
    startTime: "7:00",
    endTime: "8:00 PM",
    date: "Sept 1 - Oct 1, 2023",
    dayName: "Mon",
    primaryWorker: { id: "w1", name: "Michael C", reliability: 73, avatar: "/avatars/m1.jpg" },
    backupWorker: { id: "w2", name: "Sarah M", reliability: 90, avatar: "/avatars/f1.jpg" },
    reason: "Car breakdown on highway."
  },
  {
    id: "2",
    type: "Personal Care",
    riskLevel: "Medium",
    startTime: "8:00",
    endTime: "8:00 PM",
    date: "Sept 1 - Oct 1, 2023",
    dayName: "Tue",
    primaryWorker: { id: "w3", name: "Michael C", reliability: 90, avatar: "/avatars/m1.jpg" },
    backupWorker: { id: "w4", name: "Jane D", reliability: 85, avatar: "/avatars/f2.jpg" }
  },
  {
    id: "3",
    type: "Personal Care",
    riskLevel: "Low",
    startTime: "7:00",
    endTime: "8:00 PM",
    date: "Sept 1 - Oct 1, 2023",
    dayName: "Wed",
    primaryWorker: { id: "w1", name: "Michael C", reliability: 73, avatar: "/avatars/m1.jpg" },
    backupWorker: { id: "w2", name: "Sarah M", reliability: 90, avatar: "/avatars/f1.jpg" }
  },
  {
    id: "4",
    type: "Personal Care",
    riskLevel: "Manageable",
    startTime: "10:00",
    endTime: "8:00 PM",
    date: "Sept 1 - Oct 1, 2023",
    dayName: "Tue",
    primaryWorker: { id: "w1", name: "Michael C", reliability: 73, avatar: "/avatars/m1.jpg" },
    backupWorker: { id: "w2", name: "Sarah M", reliability: 90, avatar: "/avatars/f1.jpg" }
  },
  {
    id: "5",
    type: "Therapeutic Support",
    riskLevel: "Critical",
    startTime: "9:00",
    endTime: "10:00 AM",
    date: "Sept 1 - Oct 1, 2023",
    dayName: "Mon",
    primaryWorker: { id: "w5", name: "Jessica L", reliability: 88, avatar: "/avatars/f3.jpg" },
    backupWorker: { id: "w6", name: "David P", reliability: 92, avatar: "/avatars/m2.jpg" },
    reason: "Unexpected family emergency."
  },
  {
    id: "6",
    type: "Mobility Assistance",
    riskLevel: "Manageable",
    startTime: "2:00",
    endTime: "4:00 PM",
    date: "Sept 1 - Oct 1, 2023",
    dayName: "Wed",
    primaryWorker: { id: "w7", name: "Robert K", reliability: 85, avatar: "/avatars/m3.jpg" },
    backupWorker: { id: "w8", name: "Emma W", reliability: 80, avatar: "/avatars/f4.jpg" }
  },
  {
    id: "7",
    type: "Personal Care",
    riskLevel: "Medium",
    startTime: "11:00",
    endTime: "12:00 PM",
    date: "Sept 1 - Oct 1, 2023",
    dayName: "Thu",
    primaryWorker: { id: "w9", name: "Paul T", reliability: 75, avatar: "/avatars/m4.jpg" },
    backupWorker: { id: "w10", name: "Lisa H", reliability: 87, avatar: "/avatars/f5.jpg" }
  },
  {
    id: "8",
    type: "Companionship",
    riskLevel: "Low",
    startTime: "3:00",
    endTime: "5:00 PM",
    date: "Sept 1 - Oct 1, 2023",
    dayName: "Fri",
    primaryWorker: { id: "w11", name: "Andrew B", reliability: 82, avatar: "/avatars/m5.jpg" },
    backupWorker: { id: "w12", name: "Nicole R", reliability: 91, avatar: "/avatars/f6.jpg" }
  },
  {
    id: "9",
    type: "Personal Care",
    riskLevel: "Critical",
    startTime: "6:00",
    endTime: "7:30 PM",
    date: "Sept 1 - Oct 1, 2023",
    dayName: "Fri",
    primaryWorker: { id: "w13", name: "Thomas M", reliability: 70, avatar: "/avatars/m6.jpg" },
    backupWorker: { id: "w14", name: "Rachel G", reliability: 89, avatar: "/avatars/f7.jpg" },
    reason: "Medical appointment couldn't be rescheduled."
  },
  {
    id: "10",
    type: "Household Tasks",
    riskLevel: "Manageable",
    startTime: "8:00",
    endTime: "9:00 AM",
    date: "Sept 1 - Oct 1, 2023",
    dayName: "Mon",
    primaryWorker: { id: "w15", name: "George S", reliability: 86, avatar: "/avatars/m7.jpg" },
    backupWorker: { id: "w16", name: "Sophia V", reliability: 93, avatar: "/avatars/f8.jpg" }
  },
  {
    id: "11",
    type: "Personal Care",
    riskLevel: "Low",
    startTime: "1:00",
    endTime: "3:00 PM",
    date: "Sept 1 - Oct 1, 2023",
    dayName: "Tue",
    primaryWorker: { id: "w17", name: "William D", reliability: 84, avatar: "/avatars/m8.jpg" },
    backupWorker: { id: "w18", name: "Victoria C", reliability: 88, avatar: "/avatars/f9.jpg" }
  },
  {
    id: "12",
    type: "Medical Support",
    riskLevel: "Critical",
    startTime: "4:00",
    endTime: "6:00 PM",
    date: "Sept 1 - Oct 1, 2023",
    dayName: "Wed",
    primaryWorker: { id: "w19", name: "Marcus J", reliability: 72, avatar: "/avatars/m9.jpg" },
    backupWorker: { id: "w20", name: "Angela F", reliability: 90, avatar: "/avatars/f10.jpg" },
    reason: "COVID-19 positive test."
  },
];

// Mock Candidates Data
const MOCK_CANDIDATES: Candidate[] = [
  {
    id: "c1",
    name: "Sarah Johnson",
    role: "DSW",
    rating: 4.5,
    initials: "SJ",
    responseTime: "2 mins ago",
    availability: "Available",
    matchScore: 92
  },
  {
    id: "c2",
    name: "Michael Chen",
    role: "DSW",
    rating: 4.8,
    initials: "MC",
    responseTime: "5 mins ago",
    availability: "Available",
    matchScore: 88
  },
  {
    id: "c3",
    name: "Emma Wilson",
    role: "DSW",
    rating: 4.3,
    initials: "EW",
    responseTime: "12 mins ago",
    availability: "Maybe",
    matchScore: 85
  },
  {
    id: "c4",
    name: "Daniel Martinez",
    role: "DSW",
    rating: 4.6,
    initials: "DM",
    responseTime: "18 mins ago",
    availability: "Available",
    matchScore: 82
  },
  {
    id: "c5",
    name: "Rachel Kumar",
    role: "DSW",
    rating: 4.7,
    initials: "RK",
    responseTime: "22 mins ago",
    availability: "Unavailable",
    matchScore: 79
  },
  {
    id: "c6",
    name: "James Dixon",
    role: "DSW",
    rating: 4.4,
    initials: "JD",
    responseTime: "28 mins ago",
    availability: "Available",
    matchScore: 81
  },
];

export default function ProviderShiftCancellationPage() {
  const { user, logout } = useAuth();
  const [selectedShift, setSelectedShift] = useState<Shift | null>(null);
  const [activeTab, setActiveTab] = useState<'upcoming' | 'active'>('upcoming');
  const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(null);

  return (
    <div className={cn(PAGE_WRAPPER)}>

      {/* 1. Header Section */}
      <GeneralHeader user={user} onLogout={logout} title="Shift Cancellation" subtitle="Manage Support Worker Profiles, and Approvals" onViewProfile={() => { }} rightComponent={
        <div className="flex items-center gap-3 w-full md:w-auto">
          {/* Search Bar */}
          <div className="relative flex-grow md:w-64">
            <Magnifer className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              placeholder="Search...."
              className="w-full pl-10 h-11 rounded-full bg-white border border-gray-200 focus:ring-primary focus:border-primary outline-none"
            />
          </div>

          <Button className={cn(BUTTON_PRIMARY, "hidden md:flex bg-primary hover:bg-primary-700 h-11 px-4 gap-2")}>
            <Upload className="w-5 h-5" />
            Upload New Rooster
          </Button>
        </div>
      } />


      {/* 2. Metrics Section */}
      <ShiftMetrics />

      {/* 3. Action Bar / Filter Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-2 border-b md:border-b-0 border-gray-100 pb-2 md:pb-0 w-full md:w-auto">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setActiveTab('upcoming')}
            className={cn(
              "px-4 h-6 rounded-full text-xs font-montserrat-semibold whitespace-nowrap",
              activeTab === 'upcoming' ? "bg-primary text-white hover:bg-primary-700" : "text-gray-600 hover:bg-gray-50"
            )}
          >
            Upcoming Rooster
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setActiveTab('active')}
            className={cn(
              "px-4 h-6 rounded-full text-xs font-montserrat-semibold whitespace-nowrap border",
              activeTab === 'active' ? "bg-primary text-white border-primary hover:bg-primary-700" : "text-gray-600 hover:bg-gray-50 bg-white border-gray-200"
            )}
          >
            Active Cancellation - 6
          </Button>
          <Button variant="link" size="sm" className="md:hidden ml-auto text-primary text-sm font-montserrat-semibold">
            View all metrics →
          </Button>
        </div>
      </div>

      {/* 4. Info Banner */}
      <div className="bg-gray-50 rounded-lg p-3 mb-6 flex flex-wrap items-center gap-x-6 gap-y-2 text-xs md:text-sm text-gray-600 font-montserrat-medium">
        <span className="bg-gray-200/50 px-3 py-1 rounded-md text-gray-800 font-montserrat-bold">
          Last Uploaded: Nov 23 2025, 8:00 AM
        </span>
        <span>Total Shifts: 134</span>
        <span className="text-gray-300">|</span>
        <span>High-Risk: 12</span>
        <span className="text-gray-300">|</span>
        <span>Workers: 25</span>
      </div>

      {/* 5. Tab Content */}
      {activeTab === 'upcoming' ? (
        <>
          {/* 5. Desktop Calendar Grid */}
          <CalendarGrid
            shifts={MOCK_SHIFTS}
            onShiftClick={setSelectedShift}
          />

          {/* 6. Mobile List View */}
          <div className="lg:hidden space-y-6">
            {/* Mon 10 Section */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <span className="text-primary font-montserrat-bold text-xs uppercase">Mon 10 - 5 Shifts</span>
              </div>
              {MOCK_SHIFTS.filter(s => s.dayName === 'Mon').map(shift => (
                <ShiftCard key={shift.id} shift={shift} onClick={setSelectedShift} variant="mobile" />
              ))}
            </div>

            {/* Tue 11 Section */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <span className="text-gray-500 font-montserrat-bold text-xs uppercase">Tue 11 - 31 Shifts</span>
              </div>
              {MOCK_SHIFTS.filter(s => s.dayName === 'Tue').map(shift => (
                <ShiftCard key={shift.id} shift={shift} onClick={setSelectedShift} variant="mobile" />
              ))}
            </div>

            {/* ... render other days */}
          </div>
        </>
      ) : (
        /* Active Cancellation Tab - Candidates List */
        <div className="space-y-4">
          {/* Candidates Heading */}
          <div className="mb-4">
            <h3 className="text-lg font-montserrat-bold text-gray-900">Responses to Cancellations</h3>
            <p className="text-sm text-gray-600">Support workers interested in filling the cancelled shifts</p>
          </div>

          {/* Candidates Table */}
          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-montserrat-bold text-gray-700">Candidate</th>
                    <th className="px-4 py-3 text-left text-xs font-montserrat-bold text-gray-700">Response Time</th>
                    <th className="px-4 py-3 text-left text-xs font-montserrat-bold text-gray-700">Availability</th>
                    <th className="px-4 py-3 text-left text-xs font-montserrat-bold text-gray-700">Match Score</th>
                    <th className="px-4 py-3 text-left text-xs font-montserrat-bold text-gray-700">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {MOCK_CANDIDATES.map((candidate) => {
                    const availabilityStyle = {
                      Available: 'bg-green-50 text-green-700',
                      Maybe: 'bg-orange-50 text-orange-700',
                      Unavailable: 'bg-red-50 text-red-700'
                    }[candidate.availability];

                    return (
                      <tr key={candidate.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-xs font-montserrat-bold text-gray-600">
                              {candidate.initials}
                            </div>
                            <div>
                              <p className="text-sm font-montserrat-semibold text-gray-900">{candidate.name}</p>
                              <p className="text-xs text-gray-500">{candidate.role} • {candidate.rating} ★</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-600">{candidate.responseTime}</td>
                        <td className="px-4 py-3">
                          <span className={cn("px-2 py-1 text-xs font-montserrat-semibold rounded", availabilityStyle)}>
                            {candidate.availability}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-sm font-montserrat-semibold text-gray-900">{candidate.matchScore}%</td>
                        <td className="px-4 py-3">
                          <Button
                            variant="outline"
                            onClick={() => setSelectedCandidate(candidate)}
                            className={cn("px-4 py-2 border-primary text-primary font-montserrat-semibold rounded-lg hover:bg-primary-50")}
                          >
                            View Recommendation
                          </Button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}


      {/* 7. Detail Modal */}
      <ShiftDetailModal
        isOpen={!!selectedShift}
        shift={selectedShift}
        onClose={() => setSelectedShift(null)}
      />

      {/* 8. Recommendation Modal */}
      <RecommendationModal
        isOpen={!!selectedCandidate}
        candidate={selectedCandidate}
        onClose={() => setSelectedCandidate(null)}
        onAutoAssign={(id) => {
          console.log('Auto-assign candidate:', id);
          // TODO: Implement auto-assign logic
        }}
        onSendOffer={(id) => {
          console.log('Send offer to candidate:', id);
          // TODO: Implement send offer logic
        }}
        onViewProfile={(id) => {
          console.log('View profile of candidate:', id);
          // TODO: Navigate to profile page
        }}
      />

    </div>
  );
}