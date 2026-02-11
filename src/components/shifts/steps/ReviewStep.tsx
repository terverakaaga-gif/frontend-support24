import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";

export const ReviewStep = ({ formData, shiftTypeLabel }: any) => {
    return (
        <div className="space-y-6">
            <Card>
                <CardContent className="p-6 space-y-4">
                    <h3 className="font-montserrat-bold text-lg">{shiftTypeLabel} Shift</h3>
                    <div className="grid grid-cols-2 gap-4 border-t pt-4">
                        <div>
                            <p className="text-xs text-gray-500">Start</p>
                            <p className="font-montserrat-medium">{formData.startTime ? format(new Date(formData.startTime), "PP p") : "-"}</p>
                        </div>
                        <div>
                            <p className="text-xs text-gray-500">End</p>
                            <p className="font-montserrat-medium">{formData.endTime ? format(new Date(formData.endTime), "PP p") : "-"}</p>
                        </div>
                    </div>
                    <div>
                        <Badge>{formData.locationType}</Badge>
                        {formData.requiresSupervision && <Badge variant="destructive" className="ml-2">Supervision Required</Badge>}
                    </div>
                    <p className="text-sm bg-gray-50 p-3 rounded">{formData.specialInstructions}</p>
                </CardContent>
            </Card>
            {/* Add Worker Summary & Routine Summary Components here similar to original */}
        </div>
    );
}