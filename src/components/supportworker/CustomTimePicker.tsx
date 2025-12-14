import * as React from "react";
import { ClockCircle } from "@solar-icons/react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { FormControl } from "@/components/ui/form";
import { ScrollArea } from "@/components/ui/scroll-area";

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

  const hours = format === "24" 
    ? Array.from({ length: 24 }, (_, i) => i)
    : Array.from({ length: 12 }, (_, i) => i + 1);
  
  const minutes = Array.from({ length: 60 / minuteStep }, (_, i) => i * minuteStep);

  const parseTime = (timeString?: string) => {
    if (!timeString) return { hour: 9, minute: 0, period: "AM" };
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

  const formatTime = (hour: number, minute: number, period?: string) => {
    let h = hour;
    if (format === "12" && period) {
      h = period === "PM" && hour !== 12 ? hour + 12 : hour;
      h = period === "AM" && hour === 12 ? 0 : h;
    }
    return `${String(h).padStart(2, "0")}:${String(minute).padStart(2, "0")}`;
  };

  const formatDisplayTime = (timeString?: string) => {
    if (!timeString) return placeholder;
    const { hour, minute, period } = parseTime(timeString);
    if (format === "12") {
      return `${hour}:${String(minute).padStart(2, "0")} ${period}`;
    }
    return `${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}`;
  };

  const { hour: currentHour, minute: currentMinute, period: currentPeriod } = parseTime(value);
  const [selectedHour, setSelectedHour] = React.useState(currentHour);
  const [selectedMinute, setSelectedMinute] = React.useState(currentMinute);
  const [selectedPeriod, setSelectedPeriod] = React.useState<"AM" | "PM">(currentPeriod as "AM" | "PM");

  React.useEffect(() => {
    const { hour, minute, period } = parseTime(value);
    setSelectedHour(hour);
    setSelectedMinute(minute);
    setSelectedPeriod(period as "AM" | "PM");
  }, [value, format]);

  const handleSelect = (hour: number, minute: number, period?: "AM" | "PM") => {
    const time = formatTime(hour, minute, period);
    onChange(time);
    setOpen(false);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <FormControl>
          <Button
            variant="outline"
            disabled={disabled}
            className={cn(
              "w-full pl-3 text-left font-normal h-12 rounded-lg border-gray-200",
              !value && "text-muted-foreground"
            )}
          >
            {value ? (
              formatDisplayTime(value)
            ) : (
              <span className="text-gray-400">{placeholder}</span>
            )}
            <ClockCircle className="ml-auto h-4 w-4 opacity-50" />
          </Button>
        </FormControl>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <div className="flex gap-2 p-3">
          {/* Hours */}
          <div className="flex flex-col">
            <span className="text-xs font-medium text-gray-500 mb-2 text-center">
              Hour
            </span>
            <ScrollArea className="h-[200px] w-[60px] rounded-md border">
              <div className="p-1">
                {hours.map((hour) => (
                  <button
                    key={hour}
                    type="button"
                    onClick={() => {
                      setSelectedHour(hour);
                      if (format === "24") {
                        handleSelect(hour, selectedMinute);
                      }
                    }}
                    className={cn(
                      "w-full rounded px-2 py-1.5 text-sm hover:bg-primary-100 transition-colors",
                      selectedHour === hour && "bg-primary-600 text-white hover:bg-primary-700"
                    )}
                  >
                    {String(hour).padStart(2, "0")}
                  </button>
                ))}
              </div>
            </ScrollArea>
          </div>

          {/* Minutes */}
          <div className="flex flex-col">
            <span className="text-xs font-medium text-gray-500 mb-2 text-center">
              Min
            </span>
            <ScrollArea className="h-[200px] w-[60px] rounded-md border">
              <div className="p-1">
                {minutes.map((minute) => (
                  <button
                    key={minute}
                    type="button"
                    onClick={() => {
                      setSelectedMinute(minute);
                      if (format === "24") {
                        handleSelect(selectedHour, minute);
                      }
                    }}
                    className={cn(
                      "w-full rounded px-2 py-1.5 text-sm hover:bg-primary-100 transition-colors",
                      selectedMinute === minute && "bg-primary-600 text-white hover:bg-primary-700"
                    )}
                  >
                    {String(minute).padStart(2, "0")}
                  </button>
                ))}
              </div>
            </ScrollArea>
          </div>

          {/* AM/PM for 12-hour format */}
          {format === "12" && (
            <div className="flex flex-col">
              <span className="text-xs font-medium text-gray-500 mb-2 text-center">
                Period
              </span>
              <div className="flex flex-col gap-1">
                <button
                  type="button"
                  onClick={() => {
                    setSelectedPeriod("AM");
                    handleSelect(selectedHour, selectedMinute, "AM");
                  }}
                  className={cn(
                    "w-[60px] rounded px-2 py-2 text-sm hover:bg-primary-100 transition-colors",
                    selectedPeriod === "AM" && "bg-primary-600 text-white hover:bg-primary-700"
                  )}
                >
                  AM
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setSelectedPeriod("PM");
                    handleSelect(selectedHour, selectedMinute, "PM");
                  }}
                  className={cn(
                    "w-[60px] rounded px-2 py-2 text-sm hover:bg-primary-100 transition-colors",
                    selectedPeriod === "PM" && "bg-primary-600 text-white hover:bg-primary-700"
                  )}
                >
                  PM
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Quick selection buttons */}
        {format === "24" && (
          <div className="border-t p-2 flex gap-1 flex-wrap">
            <button
              type="button"
              onClick={() => handleSelect(9, 0)}
              className="text-xs px-2 py-1 rounded hover:bg-gray-100"
            >
              09:00
            </button>
            <button
              type="button"
              onClick={() => handleSelect(12, 0)}
              className="text-xs px-2 py-1 rounded hover:bg-gray-100"
            >
              12:00
            </button>
            <button
              type="button"
              onClick={() => handleSelect(17, 0)}
              className="text-xs px-2 py-1 rounded hover:bg-gray-100"
            >
              17:00
            </button>
            <button
              type="button"
              onClick={() => handleSelect(18, 0)}
              className="text-xs px-2 py-1 rounded hover:bg-gray-100"
            >
              18:00
            </button>
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
}
