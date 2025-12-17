import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { CheckCircle } from "@solar-icons/react";
import { getWorkerDisplayName, getWorkerInitials, getWorkerProfileImage } from "@/lib/utils";
import { cn } from "@/lib/utils";

export const AssignWorkersStep = ({ workers, shiftType, formData, onChange }: any) => {
  const toggleWorker = (id: string) => {
      const current = formData.workerIds || [];
      const newIds = current.includes(id) ? current.filter((x: string) => x !== id) : [...current, id];
      onChange("workerIds", newIds);
  };

  return (
    <div className="space-y-4">
      {shiftType === "single" || shiftType === "recurring" ? (
        <RadioGroup value={formData.workerId} onValueChange={(val) => onChange("workerId", val)}>
           {workers.map((worker: any) => (
               <WorkerCard 
                 key={worker.workerId._id} 
                 worker={worker} 
                 isSelected={formData.workerId === worker.workerId._id} 
                 onClick={() => onChange("workerId", worker.workerId._id)}
                 selectionComponent={<RadioGroupItem value={worker.workerId._id} id={worker.workerId._id} />}
               />
           ))}
        </RadioGroup>
      ) : (
        <div className="space-y-3">
            {workers.map((worker: any) => (
               <WorkerCard 
                 key={worker.workerId._id} 
                 worker={worker} 
                 isSelected={formData.workerIds?.includes(worker.workerId._id)} 
                 onClick={() => toggleWorker(worker.workerId._id)}
                 selectionComponent={<Checkbox checked={formData.workerIds?.includes(worker.workerId._id)} onCheckedChange={() => toggleWorker(worker.workerId._id)} />}
               />
           ))}
        </div>
      )}
    </div>
  );
};

const WorkerCard = ({ worker, isSelected, onClick, selectionComponent }: any) => (
    <Card 
        className={cn("cursor-pointer transition-all hover:border-primary", isSelected && "border-2 border-primary bg-primary/5")}
        onClick={onClick}
    >
        <CardContent className="p-4 flex items-center gap-4">
            <div onClick={(e) => e.stopPropagation()}>{selectionComponent}</div>
            <Avatar>
                <AvatarImage src={getWorkerProfileImage(worker.workerId)} />
                <AvatarFallback>{getWorkerInitials(worker.workerId)}</AvatarFallback>
            </Avatar>
            <div className="flex-1">
                <p className="font-semibold">{getWorkerDisplayName(worker.workerId)}</p>
                <p className="text-xs text-gray-500">Available</p>
            </div>
            {isSelected && <CheckCircle className="w-5 h-5 text-primary" />}
        </CardContent>
    </Card>
);