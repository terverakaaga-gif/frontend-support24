import { Shift } from "@/types/shift";
import ShiftCard from "./ShiftCard";

interface CalendarGridProps {
  shifts: Shift[];
  onShiftClick: (shift: Shift) => void;
}

const TIME_SLOTS = ["8:00 AM", "9:00 AM", "10:00 AM", "11:00 AM", "12:00 AM", "1:00 PM"];
const DAYS = [
  { id: "mon", label: "Mon 10", sub: "5 Shifts" },
  { id: "tue", label: "Tue 11", sub: "31 Shifts" },
  { id: "wed", label: "Wed 12", sub: "31 Shifts" },
  { id: "thu", label: "Thu 13", sub: "5 Shifts" },
  { id: "fri", label: "Fri 14", sub: "28 Shifts" },
];

export default function CalendarGrid({ shifts, onShiftClick }: CalendarGridProps) {
  // Helper to find shifts for a specific day and time slot
  // In a real app, you'd parse real Dates. For this UI clone, we match string keys.
  const getShiftsForSlot = (dayLabel: string, timeLabel: string) => {
    // Simplified logic for demo purposes based on Figma visuals
    return shifts.filter(s => s.dayName.includes(dayLabel.split(' ')[0]) && s.startTime === timeLabel.split(' ')[0]);
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden hidden lg:block">
      {/* Header Row */}
      <div className="grid grid-cols-[100px_1fr_1fr_1fr_1fr_1fr] divide-x divide-gray-200 border-b border-gray-200 bg-gray-50/50">
        <div className="p-4 flex items-center justify-center font-montserrat-bold text-gray-500 text-xs tracking-wider">
          TIME
        </div>
        {DAYS.map((day) => (
          <div key={day.id} className="p-4 flex flex-col items-center justify-center text-center">
             <span className="font-montserrat-bold text-gray-900 text-sm">{day.label}</span>
             <span className="font-montserrat-medium text-gray-500 text-xs">{day.sub}</span>
          </div>
        ))}
      </div>

      {/* Grid Rows */}
      <div className="divide-y divide-gray-200">
        {TIME_SLOTS.map((time) => (
          <div key={time} className="grid grid-cols-[100px_1fr_1fr_1fr_1fr_1fr] divide-x divide-gray-200 min-h-[140px]">
             {/* Time Column */}
             <div className="p-4 flex items-center justify-center text-xs font-montserrat-medium text-gray-500">
               {time}
             </div>
             
             {/* Days Columns */}
             {DAYS.map((day) => {
               const slotShifts = getShiftsForSlot(day.label, time);
               return (
                 <div key={`${day.id}-${time}`} className="p-2 relative bg-white">
                   <div className="flex flex-col gap-2 h-full">
                     {slotShifts.map(shift => (
                       <div key={shift.id} className="h-[120px]">
                         <ShiftCard shift={shift} onClick={onShiftClick} variant="desktop" />
                       </div>
                     ))}
                   </div>
                 </div>
               );
             })}
          </div>
        ))}
      </div>
    </div>
  );
}