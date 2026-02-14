import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Star } from "@solar-icons/react";

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

export const formatDateRange = (
  startDate?: string | Date | null,
  endDate?: string | Date | null
) => {
  if (!startDate) return "No date specified";
  const start = formatDate(startDate);
  return endDate ? `${start} - ${formatDate(endDate)}` : `${start} - Present`;
};

export const formatSkill = (skill: string | any) => {
  if (!skill) return "";
  
  // If skill is an object with a name property, use that
  const skillName = typeof skill === 'string' ? skill : skill?.name;
  
  if (!skillName) return "";
  
  return skillName
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
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

export const StarRating = ({ rating }: { rating: number }) => {
  return (
    <div className="flex">
      {[...Array(5)].map((_, i) => (
        <Star
          key={i}
          className={cn("w-4 h-4", {
            "text-yellow-400": i < rating,
            "text-gray-300": i >= rating,
          })}
        />
      ))}
    </div>
  );
};

export const EmptyState = ({ 
  icon: Icon, 
  title, 
  subtitle, 
  actionLabel, 
  onAction 
}: { 
  icon: any, title: string, subtitle?: string, actionLabel: string, onAction: () => void 
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

import { Button } from "@/components/ui/button";