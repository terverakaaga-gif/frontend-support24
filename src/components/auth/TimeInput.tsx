
import React from "react";
import { Input } from "@/components/ui/input";

interface TimeInputProps {
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

export function TimeInput({ value, onChange, className }: TimeInputProps) {
  // Format the time value for consistent display and storage
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTime = e.target.value;
    onChange(newTime);
  };

  return (
    <Input
      type="time"
      value={value}
      onChange={handleChange}
      className={className}
      min="00:00"
      max="23:59"
      step="900" // 15-minute increments (900 seconds)
    />
  );
}
