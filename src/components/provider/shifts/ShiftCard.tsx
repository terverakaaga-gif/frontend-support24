import { cn } from "@/lib/design-utils";
import { Shift, RiskLevel } from "@/types/shift";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

interface ShiftCardProps {
  shift: Shift;
  onClick: (shift: Shift) => void;
  variant?: 'desktop' | 'mobile';
}

const getRiskStyles = (risk: RiskLevel) => {
  switch (risk) {
    case 'Critical':
      return { bg: 'bg-red-50', border: 'border-red-200', badge: 'bg-red-100 text-red-600', indicator: 'bg-red-500' };
    case 'High':
      return { bg: 'bg-orange-50', border: 'border-orange-200', badge: 'bg-orange-100 text-orange-600', indicator: 'bg-orange-500' };
    case 'Medium':
      return { bg: 'bg-yellow-50', border: 'border-yellow-200', badge: 'bg-yellow-100 text-yellow-600', indicator: 'bg-yellow-500' };
    case 'Manageable':
      return { bg: 'bg-green-50', border: 'border-green-200', badge: 'bg-green-100 text-green-600', indicator: 'bg-green-500' };
    case 'Low':
      return { bg: 'bg-primary-50', border: 'border-primary-200', badge: 'bg-primary-100 text-primary-600', indicator: 'bg-primary-500' };
    default:
      return { bg: 'bg-gray-50', border: 'border-gray-200', badge: 'bg-gray-100 text-gray-600', indicator: 'bg-gray-500' };
  }
};

export default function ShiftCard({ shift, onClick, variant = 'desktop' }: ShiftCardProps) {
  const styles = getRiskStyles(shift.riskLevel);

  if (variant === 'mobile') {
    return (
      <div
        onClick={() => onClick(shift)}
        className={cn(
          "relative p-3 rounded-lg border mb-3 cursor-pointer transition-all active:scale-[0.98]",
          styles.bg,
          styles.border
        )}
      >
        {/* Left Color Bar */}
        <div className={cn("absolute left-0 top-0 bottom-0 w-1 rounded-l-lg", styles.indicator)} />

        <div className="pl-3 flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <span className="font-montserrat-semibold text-sm text-gray-900">{shift.type}</span>
            <span className={cn("text-[10px] font-montserrat-bold px-2 py-0.5 rounded-full uppercase", styles.badge)}>
              ● {shift.riskLevel}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Avatar className="w-8 h-8 border border-white shadow-sm">
                <AvatarImage src={shift.primaryWorker.avatar} alt={shift.primaryWorker.name} className="object-cover" />
                <AvatarFallback className="bg-gray-100 text-gray-900 font-montserrat-bold text-xs">
                  {shift.primaryWorker.name.split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
              <div className="flex flex-col">
                <span className="text-xs font-montserrat-medium text-gray-700">{shift.primaryWorker.name}</span>
                <span className="text-[10px] text-gray-500">{shift.primaryWorker.reliability}% reliability</span>
              </div>
            </div>

            <div className="flex flex-col items-end gap-1">
              <span className="text-xs font-montserrat-medium text-gray-600">{shift.startTime}- {shift.endTime}</span>
              {shift.backupWorker && (
                <div className="relative">
                  <Avatar className="w-6 h-6 border border-white">
                    <AvatarImage src={shift.backupWorker.avatar} alt={shift.backupWorker.name} className="object-cover" />
                    <AvatarFallback className="bg-gray-100 text-gray-900 font-montserrat-bold text-[10px]">
                      {shift.backupWorker.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Desktop Card (More compact vertically for calendar slots)
  return (
    <div
      onClick={() => onClick(shift)}
      className={cn(
        "relative p-2 rounded-lg border h-full cursor-pointer hover:shadow-md transition-shadow",
        styles.bg,
        styles.border
      )}
    >
      <div className={cn("absolute left-0 top-0 bottom-0 w-1 rounded-l-lg", styles.indicator)} />

      <div className="pl-2 flex flex-col h-full justify-between gap-1.5">
        <div className="flex items-center justify-between gap-1">
          <span className="font-montserrat-semibold text-xs text-gray-900 truncate">{shift.type}</span>
          <span className={cn("text-[8px] font-montserrat-bold px-1.5 py-0.5 rounded-full uppercase shrink-0", styles.badge)}>
            ● {shift.riskLevel === 'Manageable' ? 'Manage..' : shift.riskLevel}
          </span>
        </div>

        <div className="flex items-center gap-1.5">
          <Avatar className="w-6 h-6">
            <AvatarImage src={shift.primaryWorker.avatar} alt={shift.primaryWorker.name} className="object-cover" />
            <AvatarFallback className="bg-gray-100 text-gray-900 font-montserrat-bold text-[10px]">
              {shift.primaryWorker.name.split(' ').map(n => n[0]).join('')}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col overflow-hidden">
            <span className="text-[10px] font-montserrat-medium text-gray-700 truncate">{shift.primaryWorker.name} - {shift.primaryWorker.reliability}%</span>
          </div>
        </div>

        <div className="flex items-center justify-between mt-auto">
          {shift.backupWorker && (
            <Avatar className="w-5 h-5 border border-white">
              <AvatarImage src={shift.backupWorker.avatar} alt={shift.backupWorker.name} className="object-cover" />
              <AvatarFallback className="bg-gray-100 text-gray-900 font-montserrat-bold text-[8px]">
                {shift.backupWorker.name.split(' ').map(n => n[0]).join('')}
              </AvatarFallback>
            </Avatar>
          )}
          <span className="text-[9px] text-gray-500 ml-auto">{shift.startTime}- {shift.endTime}</span>
        </div>
      </div>
    </div>
  );
}