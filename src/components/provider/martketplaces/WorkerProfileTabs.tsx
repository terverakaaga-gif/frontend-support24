import { 
  CheckCircle, 
  Star, 
  Suitcase, 
  ClockCircle, 
  CloseCircle,
  Danger
} from "@solar-icons/react";
import { cn } from "@/lib/design-utils";

// --- Types ---
interface TabProps {
  isUnlocked: boolean;
}

// --- Helper Components ---

// A row that blurs its text content if locked
const DataRow = ({ 
  label, 
  value, 
  isUnlocked, 
  icon 
}: { 
  label: string; 
  value?: string; 
  isUnlocked: boolean; 
  icon?: React.ReactNode 
}) => {
  return (
    <div className="flex items-center justify-between py-3 border-b border-gray-50 last:border-0">
      <div className="flex items-center gap-2">
        {icon && <div className="text-gray-400">{icon}</div>}
        <span className="text-gray-700 font-medium text-sm">{label}</span>
      </div>
      <div className={cn(
        "text-sm font-montserrat-semibold transition-all duration-500",
        isUnlocked ? "text-gray-900" : "text-transparent bg-gray-200 rounded animate-pulse select-none blur-[4px]"
      )}>
        {value || "Hidden Data"}
      </div>
    </div>
  );
};

// --- Tab 1: Compliance & Competency ---
export const ComplianceTab = ({ isUnlocked }: TabProps) => {
  const complianceItems = [
    { label: "NDIS Screening Check: Valid until 2026-08-15" },
    { label: "Working with Children Check: Valid until 2025-12-31" },
    { label: "Police Check: Completed 2024-03-20" },
    { label: "First Aid: Current until 2025-11-30" },
    { label: "Right to Work in Australia: Australian Citizen" },
  ];

  const skills = [
    { name: "Autism Support", score: "9/10" },
    { name: "Positive Support Behavior", score: "8/10" },
    { name: "Manual Handling", score: "9/10" },
    { name: "Communication", score: "8/10" },
  ];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Compliance Section */}
      <section>
        <h3 className="font-montserrat-bold text-lg text-gray-900 mb-4">Compliance Status</h3>
        <div className="space-y-4">
          {complianceItems.map((item, idx) => (
            <div key={idx} className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-black shrink-0" />
                <span className={cn(
                  "text-sm text-gray-700 transition-all duration-300",
                  !isUnlocked && "blur-[5px] opacity-60 select-none"
                )}>
                  {item.label}
                </span>
              </div>
              <CheckCircle className="w-6 h-6 text-green-500 shrink-0" />
            </div>
          ))}
        </div>
      </section>

      {/* Competency Section */}
      <section>
        <h3 className="font-montserrat-bold text-lg text-gray-900 mb-4">Competency Score</h3>
        <div className="space-y-3">
          {skills.map((skill, idx) => (
            <div key={idx} className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-black shrink-0" />
                <span className="text-sm text-gray-700 font-medium">{skill.name}</span>
              </div>
              
              <div className="flex items-center gap-2">
                <span className="text-sm font-montserrat-bold text-gray-900 mr-2">{skill.score}</span>
                <div className="flex">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star key={star} className="w-4 h-4 text-yellow-400" />
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

// --- Tab 2: Experience & Readability ---
export const ExperienceTab = ({ isUnlocked }: TabProps) => {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Experience Timeline */}
      <section>
        <h3 className="font-montserrat-bold text-lg text-gray-900 mb-4">Experience</h3>
        <div className="space-y-6 relative">
          {/* Mock Timeline Items */}
          <div className="flex justify-between items-start">
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-black shrink-0" />
              <span className="text-sm text-gray-700 font-medium">Disability Support Worker</span>
            </div>
            <div className="text-right">
              <div className={cn("text-sm font-montserrat-bold text-gray-900 flex items-center justify-end gap-1", !isUnlocked && "blur-sm")}>
                <Suitcase className="w-4 h-4 text-yellow-500" /> Provider A
              </div>
              <div className="text-xs text-gray-500 italic">2 years</div>
            </div>
          </div>
          
          <div className="flex justify-between items-start">
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-black shrink-0" />
              <span className="text-sm text-gray-700 font-medium">Support Worker</span>
            </div>
            <div className="text-right">
              <div className={cn("text-sm font-montserrat-bold text-gray-900 flex items-center justify-end gap-1", !isUnlocked && "blur-sm")}>
                <Suitcase className="w-4 h-4 text-yellow-500" /> Provider B
              </div>
              <div className="text-xs text-gray-500 italic">2 months</div>
            </div>
          </div>

          <div className="flex justify-between items-start">
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-black shrink-0" />
              <span className="text-sm text-gray-700 font-medium">Casual Support Worker</span>
            </div>
            <div className="text-right">
              <div className={cn("text-sm font-montserrat-bold text-gray-900 flex items-center justify-end gap-1", !isUnlocked && "blur-sm")}>
                <Suitcase className="w-4 h-4 text-yellow-500" /> Provider C
              </div>
              <div className="text-xs text-gray-500 italic">1 years</div>
            </div>
          </div>
        </div>
      </section>

      {/* Readability Score */}
      <section>
        <h3 className="font-montserrat-bold text-lg text-gray-900 mb-4">Readability Score</h3>
        <div className="bg-gray-50 rounded-lg p-4 space-y-1">
          <DataRow label="Past Attendance" value="98%" isUnlocked={isUnlocked} />
          <DataRow label="Shifts" value="42" isUnlocked={isUnlocked} />
          <DataRow label="Cancellation" value="1" isUnlocked={isUnlocked} />
          <DataRow label="No Shows" value="0" isUnlocked={isUnlocked} />
          <DataRow label="Average Notice for Cancellation" value="2-5%" isUnlocked={isUnlocked} />
          <div className="flex items-center justify-between py-3">
            <div className="flex items-center gap-2">
               <span className="text-gray-700 font-medium text-sm">Punctuality</span>
            </div>
            <div className={cn("text-sm font-montserrat-bold", isUnlocked ? "text-gray-900" : "blur-sm")}>
              95% on time arrivals
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

// --- Tab 3: Risk Assessment ---
export const RiskTab = ({ isUnlocked }: TabProps) => {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <section>
        <h3 className="font-montserrat-bold text-lg text-gray-900 mb-4 flex items-center gap-2">
          Risk Assessment <span className="text-sm font-montserrat text-green-600 bg-green-50 px-2 py-0.5 rounded-full">(Low Risk)</span>
        </h3>
        <div className="space-y-1">
          <DataRow label="Predicted Cancellation Rate" value="2-5%" isUnlocked={isUnlocked} />
          <DataRow label="Predicted Tenure" value="12+ months" isUnlocked={isUnlocked} />
          <DataRow label="No Show Probability" value="<1%" isUnlocked={isUnlocked} />
        </div>
      </section>

      <section>
        <h3 className="font-montserrat-bold text-lg text-gray-900 mb-4">Specialization Match</h3>
        <div className="space-y-3">
           <div className="flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-black shrink-0" />
              <span className="text-sm text-gray-700">Autism (High match)</span>
           </div>
           <div className="flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-black shrink-0" />
              <span className="text-sm text-gray-700">Behavioral Support (High match)</span>
           </div>
           <div className="flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-black shrink-0" />
              <span className="text-sm text-gray-700">Manual Handling (Medium high match)</span>
           </div>
        </div>
      </section>

      <section>
        <h3 className="font-montserrat-bold text-lg text-gray-900 mb-2">Recommendation</h3>
        <p className={cn("text-sm text-gray-600 leading-relaxed", !isUnlocked && "blur-[3px] select-none")}>
          Highly recommended for immediate hire. Strong compliance, excellent reliability, specific autism expertise aligns with your service needs.
        </p>
      </section>

      <section>
        <h3 className="font-montserrat-bold text-lg text-gray-900 mb-2">Suggested Role</h3>
        <p className={cn("text-sm text-gray-600 leading-relaxed", !isUnlocked && "blur-[3px] select-none")}>
          Primary support worker for participants requiring autism-specific support and PBS.
        </p>
      </section>

       <section>
        <h3 className="font-montserrat-bold text-lg text-gray-900 mb-2">Onboarding Readiness (95%)</h3>
        <p className={cn("text-sm text-gray-600 leading-relaxed", !isUnlocked && "blur-[3px] select-none")}>
          Ready to start within 48 hours of acceptance
        </p>
      </section>
    </div>
  );
};