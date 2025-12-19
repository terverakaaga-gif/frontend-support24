import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Input } from "@/components/ui/input";
import { MapPoint } from "@solar-icons/react";
import { CustomDateTimePicker } from "@/components/ui/CustomDateTimePicker";
import { SHIFT_DURATIONS, RECURRENCE_PATTERNS } from "@/constants/shift-types";

// Routine logic separated into its own component for cleaner code
import { RoutineManager } from "./RoutineManager"; 
import { memo } from "react";

export const ShiftDetailsStep = memo(({ 
    formData, onChange, serviceTypes, shiftTypeSelection, 
    routineState, routineActions 
}: any) => {
    
  const handleStartDateChange = (date: Date | undefined) => {
      if (!date) return;
      onChange("startTime", date.toISOString());
      // Reset end time on start change
      onChange("endTime", "");
  };

  const handleDurationClick = (hours: number) => {
      if(!formData.startTime) return;
      const start = new Date(formData.startTime);
      start.setHours(start.getHours() + hours);
      onChange("endTime", start.toISOString());
  };

  return (
    <div className="space-y-6">
      {/* Service Type */}
      <div className="space-y-2">
        <Label>Service Type *</Label>
        <Select value={formData.serviceTypeId} onValueChange={(val) => onChange("serviceTypeId", val)}>
          <SelectTrigger><SelectValue placeholder="Select service type" /></SelectTrigger>
          <SelectContent>
            {serviceTypes.filter(s => s.status === "active").map((s: any) => <SelectItem key={s._id} value={s._id}>{s.name} <span className="text-xs text-gray-400 font-montserrat-semibold">{s.code}</span></SelectItem>)}
          </SelectContent>
        </Select>
      </div>

      {/* Date & Time with AU Timezone Support */}
      <div className="space-y-4">
         <CustomDateTimePicker 
            label="Start Time *" 
            date={formData.startTime ? new Date(formData.startTime) : undefined}
            setDate={handleStartDateChange}
            minDate={new Date()}
         />
         
         {formData.startTime && (
             <div className="space-y-2">
                 <Label>Duration</Label>
                 <div className="grid grid-cols-4 gap-2">
                     {SHIFT_DURATIONS.map(d => (
                         <Button key={d.value} type="button" variant="outline" onClick={() => handleDurationClick(d.value)} className={`text-xs ${formData.endTime && (new Date(formData.endTime).getTime() - new Date(formData.startTime).getTime()) / (1000 * 60 * 60) === d.value ? "bg-primary-100 border-primary text-primary font-montserrat-semibold" : ""}`}>
                             {d.label}
                         </Button>
                     ))}
                 </div>
             </div>
         )}
         
         {formData.endTime && (
             <div className="p-3 bg-primary-50 text-primary-700 rounded-lg text-sm flex justify-between items-center">
                 <span>End Time:</span>
                 <span className="font-bold">
                    {new Date(formData.endTime).toLocaleString("en-AU", { dateStyle: "short", timeStyle: "short" })}
                 </span>
             </div>
         )}
      </div>

      {/* Location */}
      <div className="space-y-2">
          <Label>Location Type</Label>
          <RadioGroup value={formData.locationType} onValueChange={(val) => onChange("locationType", val)} className="flex gap-4">
              <div className="flex items-center space-x-2">
                  <RadioGroupItem value="inPerson" id="inPerson" />
                  <Label htmlFor="inPerson">In Person</Label>
              </div>
              {/* Virtual Option */}
          </RadioGroup>
      </div>

      {formData.locationType === "inPerson" && (
          <div className="relative">
              <MapPoint className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5"/>
              <Input 
                value={formData.address} 
                onChange={(e) => onChange("address", e.target.value)} 
                className="pl-10" 
                placeholder="Address" 
                disabled={formData.locationType === "inPerson"}
              />
          </div>
      )}

      {/* Recurrence (Conditional) */}
      {shiftTypeSelection === "recurring" && (
          <div className="grid grid-cols-2 gap-4 bg-gray-50 p-4 rounded-lg">
              <div className="space-y-2">
                  <Label>Pattern</Label>
                  <Select 
                    value={formData.recurrence?.pattern || "none"} 
                    onValueChange={(val) => onChange("recurrence", { ...formData.recurrence, pattern: val })}
                  >
                      <SelectTrigger><SelectValue/></SelectTrigger>
                      <SelectContent>
                          {RECURRENCE_PATTERNS.map(p => <SelectItem key={p.value} value={p.value}>{p.label}</SelectItem>)}
                      </SelectContent>
                  </Select>
              </div>
              {formData.recurrence?.pattern !== "none" && (
                  <div className="space-y-2">
                      <Label>Occurrences</Label>
                      <Input 
                        type="number" 
                        min="1" max="52" 
                        value={formData.recurrence?.occurrences || ""} 
                        onChange={(e) => onChange("recurrence", { ...formData.recurrence, occurrences: parseInt(e.target.value) })}
                      />
                  </div>
              )}
          </div>
      )}

      <div className="space-y-2">
          <Label>Instructions</Label>
          <Textarea value={formData.specialInstructions} onChange={(e) => onChange("specialInstructions", e.target.value)} />
      </div>

      {/* Routine Logic */}
      <RoutineManager 
        state={routineState} 
        actions={routineActions} 
        currentRoutine={formData.routine} 
        currentRoutineId={formData.routineId} 
      />
    </div>
  );
});