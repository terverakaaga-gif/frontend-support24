import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

// --- Helper Functions ---

export const formatDate = (date: string | Date | null | undefined) => {
  if (!date) return "Date not specified";
  try {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  } catch (error) {
    return "Invalid date";
  }
};

// --- Sub-Components ---

export const StatsCard = ({
  stats,
  title,
  Icon,
  subtitle,
}: {
  stats: { total: number };
  title: string;
  Icon: any;
  subtitle: string;
}) => {
  return (
    <Card className="relative overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300 group">
      <CardContent className="p-4 sm:p-6 relative">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-xs md:text-sm font-montserrat-bold text-gray-600">
              {title}
            </p>
            <p className="md:text-2xl text-3xl font-montserrat-bold text-gray-900 group-hover:text-primary transition-colors">
              {stats.total}
            </p>
            <p className="text-xs text-gray-600 font-montserrat-semibold">
              {subtitle}
            </p>
          </div>
          <div className="w-12 h-12 md:w-14 md:h-14 rounded-full bg-primary-100 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
            <Icon className="w-6 h-6 md:w-7 md:h-7 text-primary" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export const EmptyState = ({
  icon: Icon,
  title,
  subtitle,
  actionLabel,
  onAction,
}: {
  icon: any;
  title: string;
  subtitle?: string;
  actionLabel: string;
  onAction: () => void;
}) => (
  <div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
    <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
      <Icon className="w-8 h-8 text-gray-400" />
    </div>
    <p className="text-gray-600 mb-2 font-montserrat-semibold">{title}</p>
    {subtitle && <p className="text-sm text-gray-500 mb-3">{subtitle}</p>}
    <Button onClick={onAction} variant="outline" size="sm">
      {actionLabel}
    </Button>
  </div>
);
