import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { CloseCircle, Calendar, CourseUp, Star } from "@solar-icons/react";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip } from "recharts";

interface ViewWorkerPerformanceModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  worker: any;
}

const performanceData = [
  { month: "Jan", value: 45 },
  { month: "Feb", value: 20 },
  { month: "Mar", value: 50 },
  { month: "Apr", value: 75 },
  { month: "May", value: 85 },
  { month: "Jun", value: 35 },
  { month: "Jul", value: 30 },
  { month: "Aug", value: 65 },
];

export function ViewWorkerPerformanceModal({
  open,
  onOpenChange,
  worker,
}: ViewWorkerPerformanceModalProps) {
  const [selectedMonth] = useState("April, 2025");

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl p-0">
        <DialogHeader className="p-6 pb-4">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-xl font-montserrat-bold">
              View Performance
            </DialogTitle>
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

        <div className="px-6 pb-6">
          {/* Provider Overview */}
          <div>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-montserrat-bold text-gray-900 mb-2">
                  Provider Overview
                </h3>
                <div className="flex items-center gap-2">
                  <span className="text-4xl font-montserrat-bold text-gray-900">80%</span>
                  <div className="flex items-center gap-1 px-2 py-1 bg-green-50 rounded">
                    <CourseUp className="h-3 w-3 text-green-600" />
                    <span className="text-sm font-montserrat-semibold text-green-600">
                      12.6%
                    </span>
                  </div>
                </div>
              </div>
              <Button variant="outline" size="sm" className="gap-2">
                <Calendar className="h-4 w-4" />
                Pick Date
              </Button>
            </div>

            {/* Chart and Stats */}
            <div className="grid grid-cols-3 gap-6">
              {/* Chart */}
              <div className="col-span-2">
                <div className="h-64 bg-gray-50 rounded-lg p-4">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={performanceData}>
                      <XAxis
                        dataKey="month"
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: "#6B7280", fontSize: 12 }}
                      />
                      <YAxis
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: "#6B7280", fontSize: 12 }}
                        tickFormatter={(value) => `${value}%`}
                      />
                      <Tooltip />
                      <Bar dataKey="value" fill="#1E3B93" radius={[8, 8, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Stats */}
              <div className="space-y-4">
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-sm font-montserrat-semibold text-gray-900 mb-3">
                    {selectedMonth}
                  </p>
                  <div className="space-y-3">
                    <div>
                      <div className="flex items-center gap-1 mb-1">
                        <Star className="h-4 w-4 text-orange-500" />
                        <span className="text-xs text-gray-600">
                          Participant Satisfaction
                        </span>
                      </div>
                      <p className="text-lg font-montserrat-bold text-gray-900">4.6/5</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-600 mb-1">
                        Service Completion Rate
                      </p>
                      <p className="text-lg font-montserrat-bold text-gray-900">95%</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-600 mb-1">
                        Average Response Time
                      </p>
                      <p className="text-lg font-montserrat-bold text-gray-900">
                        0.15 hrs
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-600 mb-1">Incident Report</p>
                      <p className="text-lg font-montserrat-bold text-gray-900">0</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

