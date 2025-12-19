import React, { useState } from "react";
import { format } from "date-fns";
import { enAU } from "date-fns/locale";
import { Calendar as CalendarIcon, ClockCircle } from "@solar-icons/react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface Props {
  date: Date | undefined;
  setDate: (date: Date | undefined) => void;
  label?: string;
  minDate?: Date;
}

export function CustomDateTimePicker({ date, setDate, label, minDate }: Props) {
  const [isTimeOpen, setIsTimeOpen] = useState(false);

  // Get current time values
  const getTimeValues = () => {
    if (!date) return { hour: 12, minute: 0, period: 'AM' };
    const hours24 = date.getHours();
    const minutes = date.getMinutes();
    const period = hours24 >= 12 ? 'PM' : 'AM';
    const hour = hours24 % 12 || 12;
    return { hour, minute: minutes, period };
  };

  const { hour, minute, period } = getTimeValues();

  // Helper to update time on the selected date
  const updateTime = (newHour: number, newMinute: number, newPeriod: string) => {
    if (!date) return;
    const newDate = new Date(date);
    let hours24 = newHour;
    if (newPeriod === 'PM' && newHour !== 12) {
      hours24 = newHour + 12;
    } else if (newPeriod === 'AM' && newHour === 12) {
      hours24 = 0;
    }
    newDate.setHours(hours24);
    newDate.setMinutes(newMinute);
    setDate(newDate);
  };

  return (
    <div className="flex flex-col gap-2">
      {label && <span className="text-sm font-semibold">{label}</span>}
      <div className="flex gap-2">
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" className={cn("w-full justify-start text-left font-normal", !date && "text-muted-foreground")}>
              <CalendarIcon className="mr-2 h-4 w-4" />
              {date ? format(date, "PPP", { locale: enAU }) : <span>Pick a date</span>}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0">
            <Calendar mode="single" selected={date} onSelect={setDate} disabled={(d) => (minDate ? d < minDate : false)} autoFocus />
          </PopoverContent>
        </Popover>
        
        <Popover open={isTimeOpen} onOpenChange={setIsTimeOpen}>
          <PopoverTrigger asChild>
            <Button 
              variant="outline" 
              disabled={!date}
              className={cn("w-36 justify-start text-left font-normal", !date && "text-muted-foreground")}
            >
              <ClockCircle className="mr-2 h-4 w-4" />
              {date ? format(date, "h:mm a") : <span>Time</span>}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-4">
            <div className="flex flex-col gap-3">
              <div className="text-sm font-semibold">Select Time</div>
              <div className="flex gap-2 items-center">
                <Select
                  value={hour.toString()}
                  onValueChange={(val) => updateTime(parseInt(val), minute, period)}
                >
                  <SelectTrigger className="w-20">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Array.from({ length: 12 }, (_, i) => i + 1).map((h) => (
                      <SelectItem key={h} value={h.toString()}>
                        {h.toString().padStart(2, '0')}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                
                <span className="text-lg font-semibold">:</span>
                
                <Select
                  value={minute.toString()}
                  onValueChange={(val) => updateTime(hour, parseInt(val), period)}
                >
                  <SelectTrigger className="w-20">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Array.from({ length: 60 }, (_, i) => i).map((m) => (
                      <SelectItem key={m} value={m.toString()}>
                        {m.toString().padStart(2, '0')}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                
                <Select
                  value={period}
                  onValueChange={(val) => updateTime(hour, minute, val)}
                >
                  <SelectTrigger className="w-20">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="AM">AM</SelectItem>
                    <SelectItem value="PM">PM</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </PopoverContent>
        </Popover>
      </div>
      {date && (
          <p className="text-xs text-gray-500">
              Australian Time: {new Intl.DateTimeFormat('en-AU', { dateStyle: 'full', timeStyle: 'short', timeZone: 'Australia/Sydney' }).format(date)}
          </p>
      )}
    </div>
  );
}