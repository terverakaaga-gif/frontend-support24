/**
 * ConfirmationDialog Component
 * 
 * Reusable confirmation dialog for destructive actions.
 * Prevents accidental deletions with a two-button confirmation.
 */

interface ConfirmationDialogProps {
  isOpen: boolean;
  title: string;
  description: string;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
  isDestructive?: boolean;
  isProcessing?: boolean;
}

export function ConfirmationDialog({
  isOpen,
  title,
  description,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  onConfirm,
  onCancel,
  isDestructive = false,
  isProcessing = false,
}: ConfirmationDialogProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl p-8 max-w-sm w-full text-center animate-in zoom-in-95">
        <h3 className="text-lg font-montserrat-bold text-gray-900 mb-2">
          {title}
        </h3>
        <p className="text-sm text-gray-600 mb-6">
          {description}
        </p>
        
        <div className="flex gap-3">
          <button
            onClick={onCancel}
            disabled={isProcessing}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-sm text-gray-700 font-montserrat-semibold hover:bg-gray-50 disabled:opacity-50 transition-colors"
          >
            {cancelLabel}
          </button>
          <button
            onClick={onConfirm}
            disabled={isProcessing}
            className={`flex-1 px-4 py-2 rounded-lg text-sm font-montserrat-semibold transition-colors disabled:opacity-50 ${
              isDestructive
                ? "bg-red-600 text-white hover:bg-red-700"
                : "bg-primary-600 text-white hover:bg-primary-700"
            }`}
          >
            {isProcessing ? "Processing..." : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
