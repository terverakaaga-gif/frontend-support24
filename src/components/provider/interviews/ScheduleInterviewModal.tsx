/**
 * ScheduleInterviewModal Component
 *
 * Modal form for scheduling an interview with a support worker.
 * Collects candidate name, preferred date/time, and additional notes.
 */

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { CustomDateTimePicker } from "@/components/ui/CustomDateTimePicker";
import { CARD, cn, MODAL_CONTENT } from "@/lib/design-utils";
import { CONTAINER_PADDING, FLEX_LAYOUTS, GAP } from "@/constants/design-system";

interface ScheduleInterviewModalProps {
  isOpen: boolean;
  candidateName?: string;
  onClose: () => void;
  onSchedule: (data: ScheduleInterviewData) => void;
  isProcessing?: boolean;
}

export interface ScheduleInterviewData {
  preferredDate: string;
  preferredTime: string;
  name: string;
  scheduledDateTime: Date | undefined;
  additionalNotes: string;
}

export default function ScheduleInterviewModal({
  isOpen,
  candidateName = "",
  onClose,
  onSchedule,
  isProcessing = false,
}: ScheduleInterviewModalProps) {
  const [formData, setFormData] = useState<ScheduleInterviewData>({
    preferredDate: "",
    preferredTime: "",
    name: candidateName,
    scheduledDateTime: undefined,
    additionalNotes: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleDateTimeChange = (newDate: Date | undefined) => {
    setFormData((prev) => ({
      ...prev,
      scheduledDateTime: newDate,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.name && formData.scheduledDateTime) {
      onSchedule(formData);
    }
  };

  if (!isOpen) return null;

  const isFormValid = formData.name.trim() && formData.scheduledDateTime;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div
        className={cn(
          CARD,
          CONTAINER_PADDING.responsive,
          MODAL_CONTENT,
          "max-w-xl w-full p-0 overflow-hidden animate-in zoom-in-95 duration-200",
        )}
      >
        <h3 className="text-xl font-montserrat-bold text-gray-900 mb-2">
          Schedule Interview
        </h3>
        <p className="text-sm text-gray-600 mb-6">
          Set up an interview session with the candidate.
        </p>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Candidate Name */}
          <div>
            <label className="block text-sm font-montserrat-semibold text-gray-700 mb-2">
              Candidate Name
            </label>
            <Input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter candidate name"
              disabled={isProcessing}
            />
          </div>

          {/* Scheduled Date & Time */}
          <div>
            <label className="block text-sm font-montserrat-semibold text-gray-700 mb-2">
              Scheduled Interview Date & Time
            </label>
            <CustomDateTimePicker
              date={formData.scheduledDateTime}
              setDate={handleDateTimeChange}
              minDate={new Date()}
            />
          </div>

          {/* Additional Notes */}
          <div>
            <label className="block text-sm font-montserrat-semibold text-gray-700 mb-2">
              Additional Notes (Optional)
            </label>
            <Textarea
              name="additionalNotes"
              value={formData.additionalNotes}
              onChange={handleChange}
              placeholder="Add any special requirements or notes..."
              disabled={isProcessing}
            />
          </div>

          {/* Action Buttons */}
          <div className={cn(FLEX_LAYOUTS.rowStart,GAP.sm)}>
            <button
              type="button"
              onClick={onClose}
              disabled={isProcessing}
              className="flex-[0.4] px-4 py-2.5 border border-gray-300 rounded-lg text-gray-700 font-montserrat-semibold hover:bg-gray-50 disabled:opacity-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!isFormValid || isProcessing}
              className="flex-1 px-4 py-2.5 bg-primary-600 text-white rounded-lg font-montserrat-semibold hover:bg-primary-700 disabled:opacity-50 transition-colors"
            >
              {isProcessing ? "Scheduling..." : "Schedule Interview"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
