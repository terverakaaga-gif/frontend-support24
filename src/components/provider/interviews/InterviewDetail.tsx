import { useState } from "react";
import { 
  Play, 
  Pause, 
  Rewind5SecondsBack, 
  Rewind5SecondsForward,
  DocumentText,
  FileText,
  ChartSquare,
  Star,
  ChatRoundLine,
  User
} from "@solar-icons/react";
import { 
  cn, 
  BUTTON_PRIMARY, 
  BADGE_BASE,
  BADGE_SM
} from "@/lib/design-utils";
import { 
  RADIUS, 
  SPACING, 
  TEXT_COLORS, 
  BG_COLORS,
  FONT_FAMILY
} from "@/constants/design-system";
import { InterviewSession } from "@/types/interview";

interface InterviewDetailProps {
  session: InterviewSession;
  onBack: () => void;
  onOnboard: () => void;
}

type TabType = 'summary' | 'transcript' | 'report';

export function InterviewDetail({ session, onBack, onOnboard }: InterviewDetailProps) {
  const [activeTab, setActiveTab] = useState<TabType>('summary');
  const [isPlaying, setIsPlaying] = useState(false);

  // --- Helper Components for the Report Tab ---
  const ReportItem = ({ title, desc, rating, icon }: any) => (
    <div className="flex gap-3 mb-6">
      <div className="mt-0.5 text-blue-600 shrink-0">{icon}</div>
      <div>
        <h4 className="font-montserrat-semibold text-gray-900 text-sm flex items-center gap-2">
          {title}
          {rating && (
            <span className={cn(BADGE_BASE, BADGE_SM, 
              rating === 'Strong' ? "bg-blue-100 text-blue-700" : "bg-blue-50 text-blue-600"
            )}>
              {rating}
            </span>
          )}
        </h4>
        <p className="text-sm text-gray-600 mt-1 leading-relaxed">{desc}</p>
      </div>
    </div>
  );

  return (
    <div className="flex flex-col gap-6 animate-in fade-in duration-300">
      {/* Header Breadcrumb equivalent */}
      <div className="flex flex-col">
        <h2 className="text-xl font-montserrat-bold text-gray-900">Support Worker Screening Interview</h2>
        <div className="flex items-center gap-2 text-sm text-gray-500 mt-1">
          <span className="font-medium text-gray-900">{session.candidateName}</span>
          <span>|</span>
          <span>{session.date}</span>
          <button onClick={onBack} className="ml-auto text-blue-600 hover:underline md:hidden">Back to list</button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:h-[calc(100vh-200px)]">
        
        {/* Left Col: Video Player */}
        <div className="lg:col-span-7 flex flex-col h-full">
          <div className={cn("relative w-full aspect-video bg-black rounded-xl overflow-hidden shadow-lg group", RADIUS.xl)}>
             <img src={session.thumbnail} className="w-full h-full object-cover opacity-80" />
             
             {/* Custom Controls UI Overlay */}
             <div className="absolute inset-0 flex items-center justify-center">
                <button 
                  onClick={() => setIsPlaying(!isPlaying)}
                  className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-all"
                >
                  {isPlaying ? <Pause  /> : <Play  />}
                </button>
             </div>

             {/* Progress Bar Mock */}
             <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent">
                <div className="w-full h-1 bg-gray-600 rounded-full mb-2 cursor-pointer">
                   <div className="w-1/3 h-full bg-blue-500 rounded-full relative">
                      <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full shadow" />
                   </div>
                </div>
                <div className="flex justify-between text-white text-xs font-medium">
                  <span>0:00</span>
                  <span>1:00</span>
                </div>
             </div>
          </div>

          {/* Video Summary Card (Below Video) */}
          <div className="mt-6 bg-gray-50 rounded-xl p-6 border border-gray-200 flex-grow overflow-y-auto">
             <h3 className="font-montserrat-bold text-gray-900 mb-3">Video Summary</h3>
             <p className="text-sm text-gray-600 leading-relaxed">
               {session.summary}
             </p>

             <button 
               onClick={onOnboard}
               className={cn(BUTTON_PRIMARY, "w-full mt-6 py-3 font-montserrat-bold shadow-blue-200")}
             >
               Proceed to Onboarding
             </button>
          </div>
        </div>

        {/* Right Col: Tabs & Content */}
        <div className="lg:col-span-5 flex flex-col h-full bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          {/* Tabs Header */}
          <div className="flex border-b border-gray-200">
             {[
               { id: 'summary', label: 'Summary' },
               { id: 'transcript', label: 'Transcript' },
               { id: 'report', label: 'Report' }
             ].map(tab => (
               <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as TabType)}
                className={cn(
                  "flex-1 py-4 text-sm font-montserrat-semibold text-center transition-colors border-b-2",
                  activeTab === tab.id 
                    ? "border-blue-600 text-blue-600 bg-blue-50/50" 
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50"
                )}
               >
                 {tab.label}
               </button>
             ))}
          </div>

          {/* Tab Content Container */}
          <div className="flex-1 overflow-y-auto p-6 scrollbar-hide">
            
            {/* 1. Summary Tab Content */}
            {activeTab === 'summary' && (
              <div className="space-y-4">
                <p className="text-sm text-gray-600">{session.summary}</p>
                {/* Reuse the logic from video summary or add specific summary metrics here */}
              </div>
            )}

            {/* 2. Transcript Tab Content */}
            {activeTab === 'transcript' && (
              <div className="space-y-6">
                {session.transcript.map((line, idx) => (
                  <div key={idx} className={cn(
                    "p-3 rounded-lg text-sm", 
                    line.speaker === 'Interviewer' ? "bg-blue-50/50" : "bg-transparent"
                  )}>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-montserrat-bold text-blue-600 text-xs">{line.timestamp}</span>
                      {line.speaker === 'Interviewer' && <span className="text-xs font-bold text-gray-700">Interviewer</span>}
                    </div>
                    <p className="text-gray-700 leading-relaxed">{line.text}</p>
                  </div>
                ))}
              </div>
            )}

            {/* 3. Report Tab Content */}
            {activeTab === 'report' && (
              <div className="space-y-8">
                {/* Behavioral Profile */}
                <section>
                  <h3 className="text-base font-montserrat-bold text-gray-900 mb-4 pb-2 border-b border-gray-100">
                    Behavioral Profile
                  </h3>
                  {session.aiReport.behavioralProfile.map((item, i) => (
                    <ReportItem 
                      key={i} 
                      title={item.category} 
                      desc={item.description} 
                      icon={<ChatRoundLine className="w-5 h-5" />} 
                    />
                  ))}
                </section>

                {/* Scenario Performance */}
                <section>
                  <h3 className="text-base font-montserrat-bold text-gray-900 mb-4 pb-2 border-b border-gray-100">
                    Scenario Question Performance
                  </h3>
                  {session.aiReport.scenarioPerformance.map((item, i) => (
                    <ReportItem 
                      key={i} 
                      title={item.category} 
                      desc={item.description}
                      rating={item.rating}
                      icon={<Star className="w-5 h-5" />} 
                    />
                  ))}
                </section>
                
                {/* AI Analysis Breakdown */}
                <section>
                  <h3 className="text-base font-montserrat-bold text-gray-900 mb-4 pb-2 border-b border-gray-100">
                    Response Quality Scoring
                  </h3>
                  <div className="space-y-3">
                    {Object.entries(session.aiReport.scores).map(([key, value]) => (
                      <div key={key} className="flex items-center justify-between text-sm">
                        <span className="capitalize text-gray-700 font-medium">
                          {key.replace(/([A-Z])/g, ' $1').trim()}
                        </span>
                        <span className="font-bold text-gray-900">{value}/10</span>
                      </div>
                    ))}
                  </div>
                </section>

                {/* Match Score Footer */}
                <div className="bg-blue-50 p-4 rounded-lg flex items-center gap-3">
                   <div className="bg-white p-2 rounded-full shadow-sm">
                     <ChartSquare className="w-6 h-6 text-blue-600" />
                   </div>
                   <div>
                     <p className="text-xs text-blue-600 font-bold uppercase">Match Score</p>
                     <p className="text-lg font-montserrat-bold text-gray-900">
                       {session.aiReport.scores.matchScore}% - Strong Match
                     </p>
                   </div>
                </div>
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
}