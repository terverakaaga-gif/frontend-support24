import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { SHIFT_TYPES } from "@/constants/shift-types";
import { CheckCircle } from "@solar-icons/react";
import { cn } from "@/lib/utils";
import { memo } from "react";

export const ShiftTypeStep = memo(({ selection, onSelect }: any) => (
  <div className="space-y-4">
    <Label className="text-base font-semibold">Choose Shift Type</Label>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {SHIFT_TYPES.map((type) => {
        const Icon = type.icon;
        return (
          <Card
            key={type.id}
            className={cn("cursor-pointer transition-all hover:shadow-lg", selection === type.id ? "border-2 border-primary shadow-lg" : "border-2 border-transparent")}
            onClick={() => onSelect(type.id)}
          >
            <CardContent className="p-6 text-center space-y-3">
              <div className="w-16 h-16 mx-auto rounded-full bg-primary-100 flex items-center justify-center">
                <Icon className="w-8 h-8 text-primary" />
              </div>
              <h3 className="font-semibold text-lg">{type.title}</h3>
              <p className="text-sm text-gray-600">{type.description}</p>
              {selection === type.id && <CheckCircle className="w-6 h-6 text-primary mx-auto" />}
            </CardContent>
          </Card>
        );
      })}
    </div>
  </div>
));