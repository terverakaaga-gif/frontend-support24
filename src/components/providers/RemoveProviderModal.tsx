import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface RemoveProviderModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  provider: any;
  onConfirm: () => void;
}

export function RemoveProviderModal({
  open,
  onOpenChange,
  provider,
  onConfirm,
}: RemoveProviderModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md p-6">
        <div className="text-center">
          <h3 className="text-lg font-montserrat-bold text-gray-900 mb-2">
            Remove Provider
          </h3>
          <p className="text-gray-600 font-montserrat mb-6">
            Do you really want to remove {provider?.name} as a provider
          </p>
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              className="flex-1 font-montserrat-semibold"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button
              className="flex-1 bg-red-600 hover:bg-red-700 text-white font-montserrat-semibold"
              onClick={onConfirm}
            >
              Remove
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

