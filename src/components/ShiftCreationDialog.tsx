import { useState, useMemo, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { useGetActiveServiceTypes } from "@/hooks/useServiceTypeHooks";
import { useGetOrganizations } from "@/hooks/useOrganizationHooks";
import { useGetRoutines, useCreateRoutine } from "@/hooks/useRoutineHooks";
import { useCreateShift } from "@/hooks/useShiftHooks";
import { filterValidWorkers } from "@/lib/utils";
import { toast } from "sonner";
import { SHIFT_TYPES } from "@/constants/shift-types";
import { AltArrowLeft, AltArrowRight, Refresh, CheckCircle } from "@solar-icons/react";
import {
  cn,
  FLEX_ROW_CENTER,
  FLEX_ROW_BETWEEN,
} from "@/lib/design-utils";
import {
  SPACING,
  RADIUS,
  BG_COLORS,
  HEADING_STYLES,
  GAP,
} from "@/constants/design-system";

// Modules
import { ShiftTypeStep } from "@/components/shifts/steps/ShiftTypeStep";
import { ShiftDetailsStep } from "@/components/shifts/steps/ShiftDetailsStep";
import { AssignWorkersStep } from "@/components/shifts/steps/AssignWorkersStep";
import { ReviewStep } from "@/components/shifts/steps/ReviewStep";

interface ShiftCreationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function ShiftCreationDialog({ open, onOpenChange }: ShiftCreationDialogProps) {
  const { user } = useAuth();
  const [step, setStep] = useState(1);
  const [shiftTypeSelection, setShiftTypeSelection] = useState("");
  
  // Routine State
  const [routineOption, setRoutineOption] = useState<"none" | "create" | "select">("none");
  

  // Queries
  const { data: serviceTypes = [] } = useGetActiveServiceTypes();
  const { data: existingRoutines, isLoading: loadingRoutines } = useGetRoutines();
  const { data: orgs = [] } = useGetOrganizations();
  const createShiftMutation = useCreateShift();
  const createRoutineMutation = useCreateRoutine();

  const workers = useMemo(() => orgs.length ? filterValidWorkers(orgs[0].workers) : [], [orgs]);

  // Form State
  const [formData, setFormData] = useState<any>({
    organizationId: "",
    isMultiWorkerShift: false,
    serviceTypeId: "",
    startTime: "",
    endTime: "",
    locationType: "inPerson",
    address: user?.address || "",
    shiftType: "directBooking",
    requiresSupervision: false,
    specialInstructions: "",
    recurrence: { pattern: "none" },
    routine: undefined, // Object for new creation
    routineId: undefined // ID for existing selection
  });

  useEffect(() => {
    if (orgs.length > 0) setFormData((prev: any) => ({ ...prev, organizationId: orgs[0]._id }));
  }, [orgs]);

  const handleInputChange = (field: string, value: any) => {
    setFormData((prev: any) => ({ ...prev, [field]: value }));
  };

  // Routine Actions Wrapper
  const routineActions = {
    setOption: (opt: "none" | "create" | "select") => {
        setRoutineOption(opt);
        // Reset routine data based on option
        if (opt === "create") {
            setFormData(prev => ({ ...prev, routineId: undefined, routine: { name: "", description: "", tasks: [{ title: "", description: "" }] } }));
        } else if (opt === "select") {
            setFormData(prev => ({ ...prev, routine: undefined, routineId: "" }));
        } else {
            setFormData(prev => ({ ...prev, routine: undefined, routineId: undefined }));
        }
    },
    
    setRoutineField: (field: string, val: string) => 
        setFormData(prev => ({ ...prev, routine: { ...prev.routine, [field]: val } })),
    
    setRoutineId: (id: string) => 
        handleInputChange("routineId", id),
    
    addTask: () => 
        setFormData(prev => ({ ...prev, routine: { ...prev.routine, tasks: [...(prev.routine?.tasks || []), { title: "", description: "" }] } })),
    
    removeTask: (index: number) => 
        setFormData(prev => ({ ...prev, routine: { ...prev.routine, tasks: prev.routine?.tasks.filter((_: any, i: number) => i !== index) } })),
    
    updateTask: (index: number, field: string, val: string) => 
        setFormData(prev => {
            const newTasks = [...(prev.routine?.tasks || [])];
            newTasks[index] = { ...newTasks[index], [field]: val };
            return { ...prev, routine: { ...prev.routine, tasks: newTasks } };
        }),
  };

  const handleNext = () => {
      // Validate current step here
      setStep(prev => prev + 1);
  };

  const handleSubmit = async () => {
      // Logic for submitting routine first if needed, then shift
      // ... (Implementation same as original but cleaner)
      
      const payload = { ...formData };
      
      if (routineOption === "create" && formData.routine) {
          try {
             const res = await createRoutineMutation.mutateAsync(formData.routine);
             payload.routineId = res._id; // Attach newly created ID
          } catch(e) { return; }
      }

      createShiftMutation.mutate(payload, {
          onSuccess: () => {
              toast.success("Shift Created");
              onOpenChange(false);
              setStep(1);
          },
          onError: (e: any) => toast.error(e.message)
      });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className={cn("max-w-3xl max-h-[90vh] overflow-y-auto", BG_COLORS.white)}>
        <DialogHeader>
          <DialogTitle className={cn(HEADING_STYLES.h3)}>Create New Shift</DialogTitle>
          <DialogDescription>Step {step} of 4</DialogDescription>
        </DialogHeader>

        {/* Progress Bar */}
        <div className={cn(FLEX_ROW_CENTER, GAP.sm, `mb-${SPACING.lg}`)}>
          {[1, 2, 3, 4].map(s => <div key={s} className={cn("h-2 flex-1 transition-all", RADIUS.full, s <= step ? BG_COLORS.primary : "bg-gray-200")} />)}
        </div>

        {/* Step Content */}
        {step === 1 && <ShiftTypeStep selection={shiftTypeSelection} onSelect={(id: string) => { setShiftTypeSelection(id); handleInputChange("isMultiWorkerShift", id === "multiple"); }} />}
        
        {step === 2 && <ShiftDetailsStep 
            formData={formData} 
            onChange={handleInputChange} 
            serviceTypes={serviceTypes}
            shiftTypeSelection={shiftTypeSelection}
            routineState={{ option: routineOption, existing: existingRoutines, loading: loadingRoutines }}
            routineActions={routineActions}
        />}

        {step === 3 && <AssignWorkersStep 
            workers={workers} 
            shiftType={shiftTypeSelection} 
            formData={formData} 
            onChange={handleInputChange} 
        />}

        {step === 4 && <ReviewStep formData={formData} shiftTypeLabel={SHIFT_TYPES.find(t => t.id === shiftTypeSelection)?.title} />}

        {/* Footer */}
        <div className={cn(FLEX_ROW_BETWEEN, "pt-6 border-t")}>
            <Button variant="outline" onClick={() => step === 1 ? onOpenChange(false) : setStep(prev => prev - 1)}>
                <AltArrowLeft className="w-5 h-5 mr-2" /> {step === 1 ? "Cancel" : "Back"}
            </Button>
            
            {step < 4 ? (
                <Button onClick={handleNext} disabled={false /* Add validation check here */}>
                    Next <AltArrowRight className="w-5 h-5 ml-2" />
                </Button>
            ) : (
                <Button onClick={handleSubmit} disabled={createShiftMutation.isPending}>
                    {createShiftMutation.isPending ? <Refresh className="animate-spin w-5 h-5" /> : <><CheckCircle className="w-5 h-5 mr-2" /> Create Shift</>}
                </Button>
            )}
        </div>
      </DialogContent>
    </Dialog>
  );
}