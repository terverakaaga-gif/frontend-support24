import React, { memo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Badge } from "@/components/ui/badge";
import {
  ListCheck, AddCircle, CloseCircle, Refresh, CheckCircle
} from "@solar-icons/react";
import { cn } from "@/lib/utils";

interface RoutineManagerProps {
  state: {
    option: "none" | "create" | "select";
    existing: any[]; // Replace 'any' with your Routine interface
    loading: boolean;
  };
  actions: {
    setOption: (option: "none" | "create" | "select") => void;
    setRoutineField: (field: string, value: string) => void;
    setRoutineId: (id: string) => void;
    addTask: () => void;
    removeTask: (index: number) => void;
    updateTask: (index: number, field: string, value: string) => void;
  };
  currentRoutine?: any;
  currentRoutineId?: string;
}

export const RoutineManager = memo(({
  state, actions, currentRoutine, currentRoutineId
}: RoutineManagerProps) => {
  const { option, existing, loading } = state;
  const { setOption, setRoutineField, setRoutineId, addTask, removeTask, updateTask } = actions;

  return (
    <div className="border-t pt-6 space-y-4">
      <div className="space-y-3">
        <Label className="text-base font-montserrat-semibold">Routine Options</Label>

        {/* Option Selection Buttons */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <SelectionButton
            active={option === "none"}
            onClick={() => setOption("none")}
            icon={CloseCircle}
            label="No Routine"
          />
          <SelectionButton
            active={option === "create"}
            onClick={() => setOption("create")}
            icon={AddCircle}
            label="Create New"
          />
          <SelectionButton
            active={option === "select"}
            onClick={() => setOption("select")}
            icon={ListCheck}
            label="Select Existing"
          />
        </div>
      </div>

      {/* CREATE MODE */}
      {option === "create" && (
        <Card className="bg-white border-2 border-primary/10">
          <CardContent className="p-6 space-y-4">
            <h3 className="font-montserrat-bold flex items-center gap-2">
              <ListCheck className="w-5 h-5 text-primary" /> Create Routine
            </h3>

            <div className="space-y-2">
              <Label>Routine Name *</Label>
              <Input
                placeholder="e.g., Morning Care"
                value={currentRoutine?.name || ""}
                onChange={(e) => setRoutineField("name", e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label>Description *</Label>
              <Textarea
                placeholder="Describe the routine..."
                value={currentRoutine?.description || ""}
                onChange={(e) => setRoutineField("description", e.target.value)}
                rows={2}
              />
            </div>

            <div className="space-y-3">
              <Label>Tasks *</Label>
              {currentRoutine?.tasks?.map((task: any, index: number) => (
                <div key={index} className="bg-gray-50 p-3 rounded-lg border space-y-2 relative group">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-xs font-montserrat-semibold text-gray-500">Task {index + 1}</span>
                    <button
                      type="button"
                      onClick={() => removeTask(index)}
                      className="text-red-400 hover:text-red-600 transition-colors"
                    >
                      <CloseCircle className="w-4 h-4" />
                    </button>
                  </div>
                  <Input
                    placeholder="Task Title"
                    value={task.title}
                    onChange={(e) => updateTask(index, "title", e.target.value)}
                    className="bg-white h-9"
                  />
                  <Textarea
                    placeholder="Details..."
                    value={task.description}
                    onChange={(e) => updateTask(index, "description", e.target.value)}
                    rows={1}
                    className="bg-white min-h-[40px]"
                  />
                </div>
              ))}
              <Button type="button" variant="outline" onClick={addTask} className="w-full border-dashed text-primary border-primary/30 hover:bg-primary/5">
                <AddCircle className="w-4 h-4 mr-2" /> Add Task
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* SELECT MODE */}
      {option === "select" && (
        <div className="space-y-3">
          {loading ? (
            <div className="flex justify-center py-8"><Refresh className="animate-spin w-6 h-6 text-gray-400" /></div>
          ) : existing.length === 0 ? (
            <div className="text-center py-8 text-gray-500 bg-gray-50 rounded-lg border border-dashed">
              No existing routines found.
            </div>
          ) : (
            <RadioGroup value={currentRoutineId} onValueChange={setRoutineId} className="space-y-3">
              {existing.map((routine: any) => (
                <div
                  key={routine.routineId}
                  className={cn(
                    "flex items-start gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all hover:bg-gray-50",
                    currentRoutineId === routine.routineId ? "border-primary bg-primary/5" : "border-gray-200 bg-white"
                  )}
                  onClick={() => setRoutineId(routine.routineId)}
                >
                  <RadioGroupItem value={routine.routineId} id={routine.routineId} className="mt-1" />
                  <div className="flex-1">
                    <div className="flex justify-between">
                      <h4 className="font-montserrat-semibold text-sm">{routine.name}</h4>
                      <Badge variant="outline" className="text-[10px]">{routine.tasks.length} Tasks</Badge>
                    </div>
                    <p className="text-xs text-gray-500 mt-1 line-clamp-2">{routine.description}</p>

                    {/* Task Preview (Only if selected) */}
                    {currentRoutineId === routine.routineId && (
                      <div className="mt-3 pt-3 border-t grid gap-2">
                        {routine.tasks.slice(0, 3).map((t: any, i: number) => (
                          <div key={i} className="text-xs flex gap-2">
                            <span className="font-montserrat-medium text-gray-700">{i + 1}.</span>
                            <span className="text-gray-600">{t.title}</span>
                          </div>
                        ))}
                        {routine.tasks.length > 3 && <span className="text-xs text-primary italic">+{routine.tasks.length - 3} more...</span>}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </RadioGroup>
          )}
        </div>
      )}
    </div>
  );
});

// Helper Button Component
const SelectionButton = memo(({ active, onClick, icon: Icon, label }: any) => (
  <Button
    type="button"
    variant={active ? "default" : "outline"}
    onClick={onClick}
    className={cn("h-auto py-4 flex-col gap-2", active ? "border-primary" : "border-gray-200")}
  >
    <Icon className="w-5 h-5" />
    <span className="text-sm">{label}</span>
  </Button>
));