import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { CloseCircle, Download } from "@solar-icons/react";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";

interface ParticipantDetailsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

// Mock data
const summaryData = {
  allocatedAmount: "$5,000.00",
  totalSpent: "$4,000.00",
  totalSpentPercent: 57,
  remaining: "$1,000.00",
  remainingPercent: 43,
  daysUntilPlanEnds: 58,
};

const categoryData = {
  category: "Core Support",
  allocatedAmount: "$2,000.00",
  progress: 60,
  totalSpent: "$1,500.00",
  totalSpentPercent: 57,
  remaining: "$500.00",
  remainingPercent: 43,
  daysUntilPlanEnds: 58,
  planManager: "Grace Johnson (gracejohnson @gmail.com)",
  burnRate: "Moderate",
  status: "On track",
};

const pieData = [
  { name: "Core Support", value: 53.33, amount: "$2,000.00", color: "#2563EB" },
  { name: "Capacity Building", value: 25, amount: "$1,000.00", color: "#F59E0B" },
  { name: "Capital", value: 8, amount: "$2,000.00", color: "#9CA3AF" },
];

export function ParticipantDetailsModal({
  open,
  onOpenChange,
}: ParticipantDetailsModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto p-0">
        {/* Header */}
        <DialogHeader className="px-6 pt-6 pb-4 border-b">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-xl font-montserrat-bold text-gray-900">
              Participant Details
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

        {/* Content */}
        <div className="px-6 py-6 space-y-6">
          {/* Summary Overview */}
          <div>
            <h3 className="text-lg font-montserrat-bold text-gray-900 mb-4">
              Summary Overview
            </h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-gray-900 font-montserrat">Allocated Amount:</span>
                <span className="font-montserrat-bold text-gray-900">
                  {summaryData.allocatedAmount}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-900 font-montserrat">Total Spent:</span>
                <span className="font-montserrat-bold text-gray-900">
                  {summaryData.totalSpent} ({summaryData.totalSpentPercent}%)
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-900 font-montserrat">Remaining:</span>
                <span className="font-montserrat-bold text-gray-900">
                  {summaryData.remaining} ({summaryData.remainingPercent}%)
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-900 font-montserrat">Days Until Plan Ends:</span>
                <span className="font-montserrat-bold text-gray-900">
                  {summaryData.daysUntilPlanEnds} days
                </span>
              </div>
            </div>
          </div>

          {/* Category Breakdown */}
          <div>
            <h3 className="text-lg font-montserrat-bold text-gray-900 mb-4">
              Category Breakdown
            </h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-gray-900 font-montserrat">Category:</span>
                <span className="font-montserrat-bold text-gray-900">
                  {categoryData.category}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-900 font-montserrat">Allocated Amount:</span>
                <span className="font-montserrat-bold text-gray-900">
                  {categoryData.allocatedAmount}
                </span>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-gray-900 font-montserrat">Progress:</span>
                  <span className="font-montserrat-bold text-gray-900">
                    {categoryData.progress}%
                  </span>
                </div>
                <Progress value={categoryData.progress} className="h-2" />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-900 font-montserrat">Total Spent:</span>
                <span className="font-montserrat-bold text-gray-900">
                  {categoryData.totalSpent} ({categoryData.totalSpentPercent}%)
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-900 font-montserrat">Remaining:</span>
                <span className="font-montserrat-bold text-gray-900">
                  {categoryData.remaining} ({categoryData.remainingPercent}%)
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-900 font-montserrat">Days Until Plan Ends:</span>
                <span className="font-montserrat-bold text-gray-900">
                  {categoryData.daysUntilPlanEnds} days
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-900 font-montserrat">Plan Manager</span>
                <span className="font-montserrat-bold text-gray-900">
                  {categoryData.planManager}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-900 font-montserrat">Burn Rate:</span>
                <span className="font-montserrat-bold text-gray-900">
                  {categoryData.burnRate}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-900 font-montserrat">Status:</span>
                <Badge className="bg-green-100 text-green-700 hover:bg-green-100 font-montserrat">
                  {categoryData.status}
                </Badge>
              </div>
            </div>
          </div>

          {/* Category Visual Breakdown */}
          <div className="bg-gray-50 rounded-xl p-6">
            <h3 className="text-base font-montserrat-bold text-gray-900 mb-4">
              Category Visual Breakdown
            </h3>

            {/* Pie Chart */}
            <div className="flex items-center justify-center mb-6">
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={0}
                    outerRadius={100}
                    dataKey="value"
                    label={({ value }) => `${value}%`}
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </div>

            {/* Legend */}
            <div className="space-y-3">
              {pieData.map((item, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div
                      className="h-3 w-3 rounded-full"
                      style={{ backgroundColor: item.color }}
                    ></div>
                    <span className="text-gray-900 font-montserrat">{item.name}</span>
                  </div>
                  <span className="font-montserrat-bold text-gray-900">{item.amount}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Export Button */}
          <Button className="w-full bg-primary-600 hover:bg-primary-700 text-white font-montserrat-semibold">
            <Download className="h-5 w-5 mr-2" />
            Export
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
