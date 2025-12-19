import * as React from "react";
import { format } from "date-fns";
import { enAU } from "date-fns/locale";
import { ClockCircle } from "@solar-icons/react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface CustomTimePickerProps {
  value?: string;
  onChange: (time: string) => void;
  placeholder?: string;
  disabled?: boolean;
  format?: "12" | "24";
  minuteStep?: number;
}

export function CustomTimePicker({
  value,
  onChange,
  placeholder = "Select time",
  disabled = false,
  format = "24",
  minuteStep = 15,
}: CustomTimePickerProps) {
  const [open, setOpen] = React.useState(false);

  const parseTime = (timeString?: string) => {
    if (!timeString) {
      return format === "12" 
        ? { hour: 12, minute: 0, period: "AM" }
        : { hour: 9, minute: 0, period: "AM" };
    }
    const [hourStr, minuteStr] = timeString.split(":");
    let hour = parseInt(hourStr, 10);
    const minute = parseInt(minuteStr, 10);
    
    if (format === "12") {
      const period = hour >= 12 ? "PM" : "AM";
      hour = hour % 12 || 12;
      return { hour, minute, period };
    }
    
    return { hour, minute, period: "AM" };
  };

  const formatDisplayTime = (timeString?: string) => {
    if (!timeString) return placeholder;
    const { hour, minute, period } = parseTime(timeString);
    if (format === "12") {
      return `${hour}:${String(minute).padStart(2, "0")} ${period}`;
    }
    return `${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}`;
  };

  const { hour, minute, period } = parseTime(value);

  const updateTime = (newHour: number, newMinute: number, newPeriod: string) => {
    let hours24 = newHour;
    if (format === "12") {
      if (newPeriod === 'PM' && newHour !== 12) {
        hours24 = newHour + 12;
      } else if (newPeriod === 'AM' && newHour === 12) {
        hours24 = 0;
      }
    }
    const time = `${String(hours24).padStart(2, "0")}:${String(newMinute).padStart(2, "0")}`;
    onChange(time);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          disabled={disabled}
          className={cn(
            "w-full pl-3 text-left font-normal h-12 rounded-lg border-gray-200",
            !value && "text-muted-foreground"
          )}
        >
          <ClockCircle className="mr-2 h-4 w-4" />
          {value ? (
            formatDisplayTime(value)
          ) : (
            <span className="text-gray-400">{placeholder}</span>
          )}
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
                {Array.from({ length: format === "12" ? 12 : 24 }, (_, i) => format === "12" ? i + 1 : i).map((h) => (
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
                {Array.from({ length: 60 / minuteStep }, (_, i) => i * minuteStep).map((m) => (
                  <SelectItem key={m} value={m.toString()}>
                    {m.toString().padStart(2, '0')}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            {format === "12" && (
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
            )}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
