import { useState, useEffect } from "react";
import { Magnifer } from "@solar-icons/react";
import { PAGE_WRAPPER, cn } from "@/lib/design-utils";
import {
  GRID_LAYOUTS,
  GAP,
  SPACING,
  FONT_FAMILY,
  TEXT_SIZE,
  TEXT_COLORS,
  RADIUS,
  CONTAINER_PADDING,
} from "@/constants/design-system";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate, useSearchParams } from "react-router-dom";

// Components
import GeneralHeader from "@/components/GeneralHeader";
import { InterviewCard } from "@/components/provider/interviews/InterviewCard";
import { InterviewDetail } from "@/components/provider/interviews/InterviewDetail";
import { InterviewSession } from "@/types/interview";

// --- MOCK DATA GENERATION ---
const MOCK_INTERVIEWS: InterviewSession[] = [
  {
    id: "1",
    candidateName: "Sarah Reeves",
    role: "Support Worker",
    date: "28 Nov, 2025",
    thumbnail: "/placeholder-video-1.jpg", // Replace with real asset
    durationLabel: "10 sec",
    avatar: "/avatars/sarah.jpg",
    summary:
      "My name is Sarah Reeves, a support worker with three years of experience, holds current First Aid, CPR, and Police Check certifications. They are based in Ikeja and can work across nearby areas. They're comfortable with personal care, communicate clearly with participants, and handle challenges calmly.",
    transcript: [
      {
        timestamp: "0:00",
        speaker: "Interviewer",
        text: "Hello, and welcome to your Support Worker Video Assessment. Before we begin, please confirm your full name.",
      },
      {
        timestamp: "0:16",
        speaker: "Candidate",
        text: "My name is Sarah Reeves, and I'm applying for the role of Support Worker. I have three years of experience...",
      },
      {
        timestamp: "0:32",
        speaker: "Interviewer",
        text: "Great. Can you share one example of a time you handled a challenging situation?",
      },
      {
        timestamp: "0:46",
        speaker: "Candidate",
        text: "Yes. I previously supported a participant who became anxious during a community outing. I used grounding techniques...",
      },
    ],
    aiReport: {
      behavioralProfile: [
        {
          category: "Community Clarity",
          rating: "Good",
          description: "Speaks clearly with structured explanations.",
          iconType: "clarity",
        },
        {
          category: "Professionalism",
          rating: "Strong",
          description: "Maintains calm tone and positive language throughout.",
          iconType: "professionalism",
        },
        {
          category: "Empathy Indicators",
          rating: "Strong",
          description:
            "Consistently uses supportive phrases such as 'I understand how they might feel'.",
          iconType: "empathy",
        },
      ],
      scenarioPerformance: [
        {
          category: "Behavioral Incident Handling",
          rating: "Strong",
          description:
            "Gives a structured approach using identifying triggers and ensuring safety first.",
          iconType: "handling",
        },
        {
          category: "Participant Refusal Scenario",
          rating: "Good",
          description: "Explained how to encourage participation respectfully.",
          iconType: "refusal",
        },
      ],
      personalityFit: "High alignment with teamwork and clear communication.",
      scores: {
        communication: 8.5,
        problemSolving: 8,
        empathy: 9,
        professionalism: 9,
        matchScore: 92,
      },
    },
  },
  // Add duplicates for grid visualization
  {
    id: "2",
    candidateName: "Daniel Joseph",
    role: "Support Worker",
    date: "28 Nov, 2025",
    thumbnail: "/placeholder-video-2.jpg",
    durationLabel: "1 min",
    avatar: "/avatars/daniel.jpg",
    summary: "Daniel demonstrates strong leadership qualities...",
    transcript: [],
    aiReport: {
      behavioralProfile: [],
      scenarioPerformance: [],
      personalityFit: "",
      scores: {
        communication: 7,
        problemSolving: 8,
        empathy: 8,
        professionalism: 8,
        matchScore: 85,
      },
    },
  },
  {
    id: "3",
    candidateName: "Michael Chen",
    role: "Support Worker",
    date: "27 Nov, 2025",
    thumbnail: "/placeholder-video-3.jpg",
    durationLabel: "10 sec",
    avatar: "/avatars/michael.jpg",
    summary: "Michael is excellent at manual handling...",
    transcript: [],
    aiReport: {
      behavioralProfile: [],
      scenarioPerformance: [],
      personalityFit: "",
      scores: {
        communication: 9,
        problemSolving: 7,
        empathy: 8,
        professionalism: 9,
        matchScore: 88,
      },
    },
  },
];

export default function ProviderInterviewPage() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [searchParams] = useSearchParams();
  
  const [selectedSession, setSelectedSession] =
    useState<InterviewSession | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [scheduledCandidateId, setScheduledCandidateId] = useState<string | null>(null);

  // Check if coming from ProviderMarketPlace with scheduled interview
  useEffect(() => {
    const candidateId = searchParams.get("candidateId");
    const candidateName = searchParams.get("candidateName");
    
    if (candidateId && candidateName) {
      setScheduledCandidateId(candidateId);
      // Auto-select the scheduled candidate if they exist in mock data
      const candidate = MOCK_INTERVIEWS.find(s => s.id === candidateId);
      if (candidate) {
        setSelectedSession(candidate);
      }
    }
  }, [searchParams]);

  const handleOnboard = () => {
    // Navigate to workforce with candidate info
    if (selectedSession) {
      navigate(`/provider/workforce?candidateId=${selectedSession.id}&candidateName=${selectedSession.candidateName}&mode=add-from-interview`);
    }
  };

  return (
    <div className={cn(PAGE_WRAPPER)}>
      {/* Header */}
      <GeneralHeader
        user={user}
        onLogout={logout}
        title="Assessment Report"
        subtitle="See all support worker assessments here"
        onViewProfile={() => {}}
        rightComponent={
          <div className="flex items-center gap-3 w-full md:w-auto">
            <div className="relative flex-grow md:w-80">
              <Magnifer className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                placeholder="Search...."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 h-11 rounded-full bg-white border border-gray-200 focus:ring-blue-500 outline-none transition-shadow"
              />
            </div>
          </div>
        }
      />

      {/* Content Area - Match other provider pages layout */}
      <div className={""}>
        {selectedSession ? (
          // --- Detail View ---
          <InterviewDetail
            session={selectedSession}
            onBack={() => setSelectedSession(null)}
            onOnboard={handleOnboard}
          />
        ) : (
          // --- List View ---
          <div className={cn(GRID_LAYOUTS.responsive, GAP.lg)}>
            {MOCK_INTERVIEWS.map((session) => (
              <InterviewCard
                key={session.id}
                session={session}
                onClick={setSelectedSession}
              />
            ))}

            {/* Empty State Mock */}
            {MOCK_INTERVIEWS.length === 0 && (
              <div className="col-span-full py-20 text-center text-gray-500">
                No assessments found matching your search.
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
