/**
 * AssignShiftModal Component
 * 
 * Modal that displays available shifts for assignment to a support worker.
 * Allows selection and confirmation of shift assignment.
 */

import { useState } from "react";
import { Calendar, ClockCircle } from "@solar-icons/react";

interface Shift {
  id: string;
  title: string;
  date: string;
  time: string;
  location: string;
  participants?: number;
}

interface AssignShiftModalProps {
  isOpen: boolean;
  workerName: string;
  shifts?: Shift[];
  onClose: () => void;
  onConfirm: (shiftId: string) => void;
  isProcessing?: boolean;
}

// Mock shifts
const MOCK_SHIFTS: Shift[] = [
  {
    id: "1",
    title: "Morning Care Session",
    date: "2024-01-25",
    time: "08:00 - 12:00",
    location: "Brimbank, VIC",
    participants: 1,
  },
  {
    id: "2",
    title: "Afternoon Support",
    date: "2024-01-26",
    time: "14:00 - 18:00",
    location: "Footscray, VIC",
    participants: 1,
  },
  {
    id: "3",
    title: "Evening Assistance",
    date: "2024-01-27",
    time: "18:00 - 22:00",
    location: "Sunshine, VIC",
    participants: 2,
  },
  {
    id: "4",
    title: "Weekend Care",
    date: "2024-01-28",
    time: "10:00 - 16:00",
    location: "Brimbank, VIC",
    participants: 1,
  },
];

export default function AssignShiftModal({
  isOpen,
  workerName,
  shifts = MOCK_SHIFTS,
  onClose,
  onConfirm,
  isProcessing = false,
}: AssignShiftModalProps) {
  const [selectedShiftId, setSelectedShiftId] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleConfirm = () => {
    if (selectedShiftId) {
      onConfirm(selectedShiftId);
      setSelectedShiftId(null);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl p-8 max-w-lg w-full max-h-[80vh] overflow-y-auto animate-in zoom-in-95">
        <h3 className="text-xl font-montserrat-bold text-gray-900 mb-2">
          Assign Shift to {workerName}
        </h3>
        <p className="text-sm text-gray-600 mb-6">
          Select a shift to assign to this support worker.
        </p>

        {/* Shifts List */}
        <div className="space-y-3 mb-6 max-h-64 overflow-y-auto">
          {shifts.map((shift) => (
            <div
              key={shift.id}
              onClick={() => setSelectedShiftId(shift.id)}
              className={`p-4 border rounded-lg cursor-pointer transition-all ${
                selectedShiftId === shift.id
                  ? "border-primary-600 bg-primary-50"
                  : "border-gray-200 bg-white hover:bg-gray-50"
              }`}
            >
              <div className="flex items-start justify-between mb-2">
                <h4 className="font-montserrat-semibold text-gray-900">
                  {shift.title}
                </h4>
                <span className="text-xs px-2 py-1 bg-gray-100 rounded text-gray-700">
                  {shift.participants} participant{shift.participants !== 1 ? "s" : ""}
                </span>
              </div>

              <div className="space-y-1 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-gray-400" />
                  <span>
                    {new Date(shift.date).toLocaleDateString("en-AU", {
                      weekday: "short",
                      month: "short",
                      day: "numeric",
                    })}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <ClockCircle className="w-4 h-4 text-gray-400" />
                  <span>{shift.time}</span>
                </div>
                <div className="text-gray-500 ml-6">{shift.location}</div>
              </div>
            </div>
          ))}

          {shifts.length === 0 && (
            <div className="py-8 text-center text-gray-500">
              No available shifts at the moment.
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3">
          <button
            onClick={onClose}
            disabled={isProcessing}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 font-montserrat-semibold hover:bg-gray-50 disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            disabled={isProcessing || !selectedShiftId}
            className="flex-1 px-4 py-2 bg-primary-600 text-white rounded-lg font-montserrat-semibold hover:bg-primary-700 disabled:opacity-50"
          >
            {isProcessing ? "Assigning..." : "Assign Shift"}
          </button>
        </div>
      </div>
    </div>
  );
}
