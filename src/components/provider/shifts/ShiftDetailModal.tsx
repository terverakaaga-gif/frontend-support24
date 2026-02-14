import { 
  CloseCircle, 
  User,
  MapPoint,
} from "@solar-icons/react";
import { 
  MODAL_OVERLAY, 
  MODAL_CONTENT, 
  BUTTON_PRIMARY,
  cn 
} from "@/lib/design-utils";
import { Shift, RiskLevel } from "@/types/shift";
import { CloseIcon } from "@/components/icons";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { BG_COLORS, BORDER_STYLES, RADIUS, TRANSITIONS } from "@/constants/design-system";

interface ShiftDetailModalProps {
  shift: Shift | null;
  isOpen: boolean;
  onClose: () => void;
}

const getRiskStatusStyles = (risk: RiskLevel) => {
  switch (risk) {
    case 'Critical':
      return { bg: 'bg-red-100', text: 'text-red-600', border: 'border-red-200', dot: 'bg-red-600' };
    case 'High':
      return { bg: 'bg-orange-100', text: 'text-orange-600', border: 'border-orange-200', dot: 'bg-orange-600' };
    case 'Medium':
      return { bg: 'bg-yellow-100', text: 'text-yellow-600', border: 'border-yellow-200', dot: 'bg-yellow-600' };
    case 'Manageable':
      return { bg: 'bg-green-100', text: 'text-green-600', border: 'border-green-200', dot: 'bg-green-600' };
    case 'Low':
      return { bg: 'bg-primary-100', text: 'text-primary-600', border: 'border-primary-200', dot: 'bg-primary-600' };
    default:
      return { bg: 'bg-gray-100', text: 'text-gray-600', border: 'border-gray-200', dot: 'bg-gray-600' };
  }
};

export default function ShiftDetailModal({ shift, isOpen, onClose }: ShiftDetailModalProps) {
  if (!isOpen || !shift) return null;

  const statusStyles = getRiskStatusStyles(shift.riskLevel);
  const isCritical = shift.riskLevel === 'Critical';

  return (
    <div className={cn(MODAL_OVERLAY, "z-50 flex items-center justify-center p-4 animate-in fade-in duration-200")}>
      <div className={cn(MODAL_CONTENT, BG_COLORS.white, RADIUS.lg,"max-w-md w-full p-6 shadow-2xl")}>
        
        {/* Close Button */}
        {/* <button
          onClick={onClose}
          className={cn(TRANSITIONS.colors,BORDER_STYLES.default,RADIUS.full,"absolute p-1 top-2 right-4")}
          aria-label="Close modal"
        >
          <CloseIcon className="w-4 h-4" />
        </button> */}

        {/* Header */}
        <div className="flex items-start justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="relative">
              <Avatar className="w-16 h-16 border border-gray-100">
                <AvatarImage 
                  src={shift.primaryWorker.avatar} 
                  alt={shift.primaryWorker.name}
                  className="object-cover"
                />
                <AvatarFallback className="bg-gray-100 text-gray-900 font-montserrat-bold text-sm">
                  {shift.primaryWorker.name.split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-montserrat-bold text-gray-900 text-lg">{shift.primaryWorker.name}</h3>
                <div className="bg-primary-600 rounded-full p-0.5">
                   <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="4"><path d="M20 6L9 17L4 12" /></svg>
                </div>
              </div>
              <p className="text-sm text-gray-500">
                Disability Support Worker <br/>
                <span className="text-gray-400 text-xs">{shift.primaryWorker.reliability}% reliability | No show | 0 hours (past shift time)</span>
              </p>
            </div>
          </div>
          
          <span className={cn("border px-3 py-1 rounded-full text-xs font-montserrat-bold flex items-center gap-1", statusStyles.bg, statusStyles.text, statusStyles.border)}>
             <span className={cn("w-2 h-2 rounded-full", statusStyles.dot)}></span> {shift.riskLevel}
          </span>
        </div>

        {/* Reason Box */}
        <div className="bg-gray-50 p-4 rounded-lg mb-6 text-sm text-gray-800 border border-gray-100">
          <span className="font-montserrat-sembold block mb-1">Reason:</span>
          {shift.reason || "Running late can't make it to the 2pm shift. My car just broke down, really sorry"}
        </div>

        {/* Shift Details Timeline Look */}
        <div className="mb-6 relative">
          <h4 className="font-montserrat-bold text-gray-900 mb-4">Shift Details</h4>
          
          <div className="flex gap-4 relative">
             {/* Dotted Line */}
             <div className="flex flex-col items-center mt-1.5">
               <div className="w-3 h-3 rounded-full border border-primary-500 bg-white z-10"></div>
               <div className="w-0.5 h-10 border-l border-dashed border-primary-300 my-1"></div>
               <div className="w-3 h-3 rounded-full border border-primary-500 bg-white z-10"></div>
             </div>

             <div className="flex flex-col gap-6 w-full">
               <div>
                  <div className="flex justify-between items-start">
                    <span className="text-xs text-gray-500">Shift Type</span>
                    <span className="text-xs text-gray-400">Shift ID: <span className="text-gray-900 font-montserrat-sembold">#{shift.id.substring(0,8)}</span></span>
                  </div>
                  <p className="font-montserrat-semibold text-gray-900 text-sm mt-0.5">
                    {shift.type} - {shift.participantName || "Michy Tami (participant)"}
                  </p>
               </div>

               <div>
                  <span className="text-xs text-gray-500 block">Shift Date and Time</span>
                  <p className="font-montserrat-bold text-gray-900 text-sm mt-0.5">
                    {shift.date}, {shift.startTime} - {shift.endTime}
                  </p>
               </div>
             </div>
          </div>
        </div>

        {/* Backup Worker */}
        <div className="mb-6">
           <h4 className="font-montserrat-bold text-gray-900 mb-4">Backup Worker</h4>
           <div className="flex gap-4">
              <div className="flex flex-col items-center mt-1.5">
                 <div className="w-3 h-3 rounded-full border border-primary-500 bg-white z-10"></div>
                 <div className="w-0.5 h-12 border-l border-dashed border-primary-300 my-1"></div>
                 <div className="w-3 h-3 rounded-full border border-primary-500 bg-white z-10"></div>
              </div>

              <div className="w-full space-y-4">
                 {/* Worker Info */}
                 <div>
                    <span className="text-xs text-gray-500 block mb-2">Support Worker Name</span>
                    <div className="flex items-center gap-3">
                       <Avatar className="w-10 h-10">
                         <AvatarImage 
                            src={shift.backupWorker?.avatar || "/placeholder.jpg"}
                            alt={shift.backupWorker?.name || "Backup"}
                            className="object-cover"
                         />
                         <AvatarFallback className="bg-gray-100 text-gray-900 font-montserrat-bold text-xs">
                           {(shift.backupWorker?.name || "BW").split(' ').map(n => n[0]).join('')}
                         </AvatarFallback>
                       </Avatar>
                       <div>
                          <p className="font-montserrat-bold text-gray-900 text-sm">{shift.backupWorker?.name || "Sarah M"}</p>
                          <p className="text-xs text-gray-500">73% reliability | Active</p>
                       </div>
                    </div>
                 </div>

                 {/* Location */}
                 <div>
                    <span className="text-xs text-gray-500 block mb-1">Support Worker Location</span>
                    <p className="font-montserrat-semibold text-gray-900 text-sm">
                       123 Main Street, Anytown, Australia (12 km)
                    </p>
                 </div>
              </div>
           </div>
        </div>

        {/* Action Button - Only show for Critical */}
        {isCritical && (
          <div className="flex gap-3">
           
            <button 
              onClick={onClose}
              className={cn(BUTTON_PRIMARY, "flex-1 py-3 bg-primary-600 text-white border border-primary-600 hover:bg-primary-700 font-montserrat-bold rounded-lg")}
            >
              Pre-notify Backup Worker
            </button>
          </div>
        )}

        {/* Cancel Button - Only show for non-Critical */}
        {!isCritical && (
          <button 
            onClick={onClose}
            className="w-full py-3 border border-gray-300 text-gray-700 rounded-lg font-montserrat-bold hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
        )}

      </div>
    </div>
  )};