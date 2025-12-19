import * as React from "react";
import { format } from "date-fns";
import { enAU } from "date-fns/locale";
import { Calendar as CalendarIcon } from "@solar-icons/react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface CustomDatePickerProps {
  value?: Date;
  onChange: (date?: Date) => void;
  minDate?: Date;
  maxDate?: Date;
  placeholder?: string;
  disabled?: boolean;
}

export function CustomDatePicker({
  value,
  onChange,
  minDate,
  maxDate,
  placeholder = "Pick a date",
  disabled = false,
}: CustomDatePickerProps) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          disabled={disabled}
          className={cn(
            "w-full pl-3 text-left font-normal h-12 rounded-lg border-gray-200",
            !value && "text-muted-foreground"
          )}
        >
          {value ? (
            format(value, "dd/MM/yyyy", { locale: enAU })
          ) : (
            <span className="text-gray-400">{placeholder}</span>
          )}
          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          selected={value}
          onSelect={onChange}
          disabled={(date) =>
            (minDate ? date < minDate : false) ||
            (maxDate ? date > maxDate : false)
          }
          locale={enAU}
          initialFocus
        />
      </PopoverContent>
    </Popover>
  );
}
