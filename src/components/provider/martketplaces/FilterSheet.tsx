import { useState } from "react";
import { CloseCircle } from "@solar-icons/react";
import {
  MODAL_OVERLAY,
  MODAL_CONTENT,
  BUTTON_PRIMARY,
  cn
} from "@/lib/design-utils";

interface FilterOption {
  id: string;
  label: string;
}

interface FilterSheetProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  options: FilterOption[];
  onApply: (selectedId: string) => void;
  selectedId: string;
}

export default function FilterSheet({
  isOpen,
  onClose,
  title,
  options,
  onApply,
  selectedId: initialSelected
}: FilterSheetProps) {
  const [localSelected, setLocalSelected] = useState(initialSelected);

  if (!isOpen) return null;

  const handleShowResults = () => {
    onApply(localSelected);
    onClose();
  };

  return (
    <div className={cn(MODAL_OVERLAY, "z-50 flex items-end sm:items-center justify-center p-0 sm:p-4")}>
      <div className={cn(
        MODAL_CONTENT,
        "w-full max-w-md rounded-t-2xl sm:rounded-2xl max-h-[85vh] flex flex-col bg-white animate-in slide-in-from-bottom-10 fade-in"
      )}>
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-100">
          <h3 className="text-lg font-montserrat-bold text-gray-900">{title}</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <div className="bg-gray-500 rounded-full p-1 text-white">
              <CloseCircle className="w-4 h-4" color="white" />
            </div>
          </button>
        </div>

        {/* Drag Handle (Mobile Visual) */}
        <div className="w-full flex justify-center pt-2 sm:hidden absolute top-0">
          <div className="w-12 h-1.5 bg-gray-300 rounded-full" />
        </div>

        {/* Options List */}
        <div className="p-6 overflow-y-auto space-y-6">
          {options.map((option) => (
            <div
              key={option.id}
              className="flex items-center justify-between cursor-pointer group"
              onClick={() => setLocalSelected(option.id)}
            >
              <span className="text-gray-700 font-montserrat-medium group-hover:text-primary-600">
                {option.label}
              </span>

              <div className={cn(
                "w-6 h-6 rounded-full border flex items-center justify-center transition-all",
                localSelected === option.id
                  ? "border-primary-600"
                  : "border-gray-300 group-hover:border-primary-400"
              )}>
                {localSelected === option.id && (
                  <div className="w-3.5 h-3.5 bg-primary-600 rounded-full" />
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-100 mt-auto">
          <button
            onClick={handleShowResults}
            className={cn(BUTTON_PRIMARY, "w-full py-3 bg-primary-700 hover:bg-primary-800 rounded-xl")}
          >
            Show Results
          </button>
        </div>
      </div>
    </div>
  );
}