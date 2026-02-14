import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { CloseCircle, Calendar, CourseUp, Star } from "@solar-icons/react";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip as RechartsTooltip } from "recharts";

interface ViewPerformanceModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  provider: any;
}

const performanceData = [
  { month: "Jan", value: 100, actual: 45 },
  { month: "Feb", value: 100, actual: 20 },
  { month: "Mar", value: 100, actual: 50 },
  { month: "Apr", value: 100, actual: 75 },
  { month: "May", value: 100, actual: 85 },
  { month: "Jun", value: 100, actual: 35 },
  { month: "Jul", value: 100, actual: 30 },
  { month: "Aug", value: 100, actual: 65 },
];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-4 rounded-lg shadow-lg border border-gray-200">
        <p className="font-montserrat-bold text-gray-900 mb-2">{label}, 2025</p>
        <div className="space-y-1">
          <p className="text-sm font-montserrat text-gray-700">
            Participant Satisfaction <Star className="inline h-3 w-3 text-yellow-500" /> 4.6/5
          </p>
          <p className="text-sm font-montserrat text-gray-700">
            Service Completion Rate 95%
          </p>
          <p className="text-sm font-montserrat text-gray-700">
            Average Response Time 0.15 hrs
          </p>
          <p className="text-sm font-montserrat text-gray-700">
            Incident Report 0
          </p>
        </div>
      </div>
    );
  }
  return null;
};

export function ViewPerformanceModal({
  open,
  onOpenChange,
  provider,
}: ViewPerformanceModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl p-0">
        <DialogHeader className="p-6 pb-4 border-b">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-xl font-montserrat-bold text-gray-900">
              View Performance
            </DialogTitle>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onOpenChange(false)}
              className="h-8 w-8 rounded-full hover:bg-gray-100"
            >
              <CloseCircle className="h-5 w-5 text-gray-500" />
            </Button>
          </div>
        </DialogHeader>

        <div className="p-6">
          {/* Provider Overview */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-montserrat-bold text-gray-900">
                Provider Overview
              </h3>
              <Button
                variant="outline"
                size="sm"
                className="font-montserrat-semibold"
              >
                <Calendar className="h-4 w-4 mr-2" />
                Pick Date
              </Button>
            </div>
            <div className="flex items-center gap-2 mb-4">
              <span className="text-2xl font-montserrat-bold text-gray-900">80%</span>
              <div className="flex items-center gap-1 text-green-600">
                <CourseUp className="h-5 w-5" />
                <span className="text-sm font-montserrat-semibold">12.6%</span>
              </div>
            </div>

            {/* Bar Chart */}
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={performanceData} margin={{ top: 5, right: 5, left: 0, bottom: 5 }}>
                  <XAxis
                    dataKey="month"
                    tick={{ fill: "#6B7280", fontSize: 12, fontFamily: "Montserrat" }}
                  />
                  <YAxis
                    tick={{ fill: "#6B7280", fontSize: 12, fontFamily: "Montserrat" }}
                    domain={[0, 100]}
                  />
                  <RechartsTooltip content={<CustomTooltip />} />
                  <Bar dataKey="value" fill="#E5E7EB" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="actual" fill="#2563EB" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
