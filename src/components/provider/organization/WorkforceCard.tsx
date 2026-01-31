import { 
  Star, 
  MapPoint, 
  DollarMinimalistic, 
  VerifiedCheck,
  CheckCircle,
  CloseCircle
} from "@solar-icons/react";
import { cn } from "@/lib/utils";
import { OrgWorker } from "@/types/organization";

// UI Components from Design System
import { Card } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface WorkforceCardProps {
  worker: OrgWorker;
  onViewProfile: (id: string) => void;
  onVetWorker: (id: string) => void;
  onHireWorker: (id: string) => void;
  onAddToWorkforce: (id: string) => void;
  onAssignShift: (id: string) => void;
  onDeleteWorker: (id: string) => void;
}

export default function WorkforceCard({ 
  worker, 
  onViewProfile, 
  onVetWorker,
  onAddToWorkforce,
  onAssignShift,
  onDeleteWorker
}: WorkforceCardProps) {
  const isVetted = worker.status === 'vetted';

  // Get initials for avatar fallback
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <Card className="p-6 flex flex-col items-center border border-gray-200 shadow-sm hover:shadow-md transition-all bg-white rounded-xl relative">
      
      {/* Top Status Badge (For Onboarding Candidates) */}
      {!isVetted && (
        <Badge className="absolute top-4 right-4 bg-primary-50 text-primary-600 hover:bg-primary-50 gap-1 rounded-full">
          <CheckCircle className="w-4 h-4" />
          Interview Completed
        </Badge>
      )}

      {/* Avatar Section */}
      <div className="relative mb-3 mt-4">
        <Avatar className="w-20 h-20 border border-gray-100">
          <AvatarImage src={worker.avatar} alt={worker.name} />
          <AvatarFallback className="text-lg font-montserrat-bold bg-primary-100 text-primary-600">
            {getInitials(worker.name)}
          </AvatarFallback>
        </Avatar>
        {/* Green Vetted Badge - only if vetted */}
        {isVetted && (
          <Badge 
            variant="outline" 
            className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 bg-white border-green-500 text-green-600 text-[10px] uppercase tracking-wide px-2 py-0.5 rounded-full shadow-sm"
          >
            Vetted
          </Badge>
        )}
      </div>

      {/* Info Section */}
      <div className="flex items-center gap-1 mb-1 mt-1">
        <h3 className="font-montserrat-bold text-gray-900 text-lg">{worker.name}</h3>
        {worker.isVerified && <VerifiedCheck className="w-5 h-5 text-primary-600" />}
      </div>
      
      <p className="text-gray-500 text-sm font-medium mb-3">{worker.role}</p>

      {/* Metrics Row */}
      <div className="flex items-center gap-3 text-xs text-gray-500 mb-6">
        <div className="flex items-center gap-1">
          <Star className="w-3.5 h-3.5 text-yellow-400" />
          <span>{worker.rating}</span>
        </div>
        <div className="w-px h-3 bg-gray-300"></div>
        <div className="flex items-center gap-1">
          <MapPoint className="w-3.5 h-3.5 text-gray-400" />
          <span>{worker.location} ({worker.distance})</span>
        </div>
        <div className="w-px h-3 bg-gray-300"></div>
        <div className="flex items-center gap-1">
          <DollarMinimalistic className="w-3.5 h-3.5 text-gray-400" />
          <span>{worker.hourlyRate}</span>
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-3 w-full mt-auto">
        {isVetted ? (
          // Vetted Worker Actions (Assign Shift + Remove)
          <>
            <Button 
              variant="outline"
              onClick={() => onAssignShift(worker.id)}
              className="flex-1 text-primary-600 border-primary-600 hover:bg-primary-50 py-2.5 h-auto text-sm font-bold rounded-lg"
            >
              Assign Shift
            </Button>
            <Button 
              variant="outline"
              size="icon"
              onClick={() => onDeleteWorker(worker.id)}
              className="w-10 border-red-200 hover:bg-red-50 text-red-500"
            >
              <CloseCircle className="w-5 h-5" />
            </Button>
          </>
        ) : (
          // Candidate Actions (Start Onboarding)
          <Button 
            variant="outline"
            onClick={() => onAddToWorkforce(worker.id)}
            className="w-full text-primary-600 border-primary-600 py-2.5 h-auto text-sm font-bold rounded-lg"
          >
            Start Onboarding
          </Button>
        )}
      </div>
    </Card>
  );
}