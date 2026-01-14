import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { CloseCircle, Star, Refresh } from "@solar-icons/react";

interface PanelMember {
  id: number;
  name: string;
  type: "Provider" | "Support Worker";
  status: "Active" | "Inactive";
  rating: number;
  distance: number;
  price: number;
  logo: string | null;
  isFavorite: boolean;
}

interface CompareModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedMembers: PanelMember[];
  onCompare: () => void;
}

export function CompareModal({
  open,
  onOpenChange,
  selectedMembers,
  onCompare,
}: CompareModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl p-6">
        <DialogHeader className="pb-4">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-2xl font-montserrat-bold">Compare</DialogTitle>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onOpenChange(false)}
              className="h-8 w-8 rounded-full hover:bg-gray-100"
            >
              <CloseCircle className="h-5 w-5" />
            </Button>
          </div>
        </DialogHeader>

        <div className="space-y-3 mb-6">
          {selectedMembers.map((member) => (
            <div
              key={member.id}
              className="flex items-center justify-between p-4 border border-gray-200 rounded-lg bg-white hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center gap-3 flex-1">
                {member.type === "Provider" ? (
                  <div className="h-12 w-12 rounded-full bg-gray-900 flex items-center justify-center flex-shrink-0">
                    <img
                      src="/tdesign_logo-cnb-filled.png"
                      alt="Provider logo"
                      className="h-8 w-8"
                    />
                  </div>
                ) : (
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={member.logo || undefined} />
                    <AvatarFallback className="bg-red-100 text-red-700 font-montserrat-semibold">
                      GL
                    </AvatarFallback>
                  </Avatar>
                )}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-montserrat-bold text-gray-900 truncate">
                      {member.name}
                    </h4>
                    <Badge className="bg-green-100 text-green-700 text-xs font-montserrat-semibold">
                      {member.status}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-600 font-montserrat mb-2">
                    {member.type}
                  </p>
                  <div className="flex items-center gap-3 text-xs text-gray-600">
                    <div className="flex items-center gap-1">
                      <Star className="h-3 w-3 text-orange-500 fill-orange-500" />
                      <span className="font-montserrat">{member.rating}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="font-montserrat">📍 {member.distance} km</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="font-montserrat">💰 ${member.price}</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="ml-4">
                <Checkbox
                  checked={true}
                  className="h-6 w-6 data-[state=checked]:bg-primary-600 data-[state=checked]:border-primary-600"
                />
              </div>
            </div>
          ))}
        </div>

        <Button
          onClick={onCompare}
          disabled={selectedMembers.length === 0}
          className="w-full bg-primary-600 hover:bg-primary-700 text-white font-montserrat-semibold h-12 gap-2"
        >
          <Refresh className="h-5 w-5" />
          Compare
        </Button>
      </DialogContent>
    </Dialog>
  );
}
