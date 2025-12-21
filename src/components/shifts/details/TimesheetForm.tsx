import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Document, TrashBinTrash } from "@solar-icons/react";
import { Spinner } from "@/components/Spinner";
import { TimesheetFormData } from "@/types/shift-details";

interface Props {
  formData: TimesheetFormData;
  onChange: (field: string, value: any) => void;
  onNestedChange: (index: number, field: string, value: any) => void;
  onAddExpense: () => void;
  onRemoveExpense: (index: number) => void;
  onSubmit: () => void;
  onCancel: () => void;
  isPending: boolean;
  
  // Custom Time Logic
  useCustomTimes: boolean;
  onToggleCustomTimes: (checked: boolean) => void;
  selectedDuration: number;
  onDurationSelect: (hours: number) => void;
  minTime: string;
  maxTime: string;
  formatTime: (date: string) => string;
  formatDateTimeLocal: (date: string) => string;
}

const DURATIONS = [0, 1, 2, 3, 4];

export const TimesheetForm = React.memo(({ 
    formData, onChange, onNestedChange, onAddExpense, onRemoveExpense, onSubmit, onCancel, isPending,
    useCustomTimes, onToggleCustomTimes, selectedDuration, onDurationSelect, 
    minTime, maxTime, formatTime, formatDateTimeLocal
}: Props) => {
  return (
    <div className="space-y-4 bg-white p-4 rounded-lg border">
      <h4 className="font-montserrat-semibold text-gray-900">Create Timesheet</h4>

      {/* Time Selection Logic */}
      <div className="flex items-center gap-2">
        <Checkbox id="customTimes" checked={useCustomTimes} onCheckedChange={onToggleCustomTimes} />
        <Label htmlFor="customTimes" className="cursor-pointer">Use different times from shift schedule</Label>
      </div>

      {!useCustomTimes ? (
        <div className="space-y-3">
            <Label className="font-montserrat-semibold">Timesheet Duration</Label>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                {DURATIONS.map((h) => (
                    <Button key={h} type="button" size="sm" variant={selectedDuration === h ? "default" : "outline"} onClick={() => onDurationSelect(h)} className="w-full">
                        {h === 0 ? "Same as shift" : `+${h} Hour${h > 1 ? 's' : ''}`}
                    </Button>
                ))}
            </div>
            {/* Display Readonly Times */}
            <div className="p-3 bg-primary-50 border border-primary-200 rounded-lg text-sm text-primary-900">
                <p><span className="font-semibold">Start:</span> {formatTime(formData.actualStartTime)}</p>
                <p><span className="font-semibold">End:</span> {formatTime(formData.actualEndTime)}</p>
            </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
                <Label>Actual Start Time *</Label>
                <Input type="datetime-local" min={minTime} max={maxTime} value={formatDateTimeLocal(formData.actualStartTime)} onChange={(e) => onChange("actualStartTime", new Date(e.target.value).toISOString())} />
            </div>
            <div className="space-y-2">
                <Label>Actual End Time *</Label>
                <Input type="datetime-local" min={minTime} max={maxTime} value={formatDateTimeLocal(formData.actualEndTime)} onChange={(e) => onChange("actualEndTime", new Date(e.target.value).toISOString())} />
            </div>
        </div>
      )}

      {/* Distance & Notes */}
      <div className="space-y-2">
        <Label>Distance Traveled (km)</Label>
        <Input type="number" step="0.1" value={formData.distanceTravelKm} onChange={(e) => onChange("distanceTravelKm", parseFloat(e.target.value) || 0)} />
      </div>
      <div className="space-y-2">
        <Label>Notes</Label>
        <Textarea value={formData.notes} onChange={(e) => onChange("notes", e.target.value)} placeholder="Add notes..." rows={3} />
      </div>

      {/* Expenses Section */}
      <div className="space-y-3 border-t pt-3">
        <div className="flex justify-between items-center">
            <Label className="font-semibold">Expenses (Optional)</Label>
            <Button type="button" variant="outline" size="sm" onClick={onAddExpense}>Add Expense</Button>
        </div>
        {formData.expenses.length > 0 && formData.expenses.map((expense, index) => (
            <div key={index} className="border rounded-lg p-3 space-y-3 bg-gray-50">
                <div className="space-y-2">
                    <Label>Title *</Label>
                    <Input 
                        value={expense.title} 
                        onChange={(e) => onNestedChange(index, "title", e.target.value)} 
                        placeholder="e.g., Parking fee, Meal, Transport"
                    />
                </div>
                
                <div className="space-y-2">
                    <Label>Description</Label>
                    <Textarea 
                        value={expense.description} 
                        onChange={(e) => onNestedChange(index, "description", e.target.value)} 
                        placeholder="Details about this expense..."
                        rows={2}
                    />
                </div>
                
                <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-2">
                        <Label>Amount ($) *</Label>
                        <Input 
                            type="number" 
                            step="0.01" 
                            min="0"
                            value={expense.amount} 
                            onChange={(e) => onNestedChange(index, "amount", parseFloat(e.target.value) || 0)} 
                            placeholder="0.00"
                        />
                    </div>
                    
                    <div className="space-y-2">
                        <Label>Paid By *</Label>
                        <Select 
                            value={expense.payer} 
                            onValueChange={(value) => onNestedChange(index, "payer", value)}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Select payer" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="supportWorker">Support Worker</SelectItem>
                                <SelectItem value="participant">Participant</SelectItem>
                                <SelectItem value="organization">Organization</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>
                
                <Button 
                    type="button" 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => onRemoveExpense(index)} 
                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                >
                    <TrashBinTrash className="w-4 h-4 mr-2" />
                    Remove Expense
                </Button>
            </div>
        ))}
      </div>

      {/* Footer */}
      <div className="flex gap-3 pt-4">
        <Button onClick={onSubmit} disabled={isPending} className="flex items-center gap-2">
            {isPending ? <><Spinner /> Creating...</> : <><Document className="w-4 h-4" /> Submit Timesheet</>}
        </Button>
        <Button variant="outline" onClick={onCancel} disabled={isPending}>Cancel</Button>
      </div>
    </div>
  );
});

TimesheetForm.displayName = "TimesheetForm";