
import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface StatCardProps {
  title: string;
  value: string | number;
  icon: ReactNode;
  change?: { value: string; positive: boolean };
  additionalText?: string;
  className?: string;
  iconClassName?: string;
}

export function StatCard({
  title,
  value,
  icon,
  change,
  additionalText,
  className,
  iconClassName
}: StatCardProps) {
  return (
    <div className={cn("stat-card", className)}>
      <div className="text-sm text-gray-500 mb-2">{title}</div>
      <div className="flex justify-between items-center">
        <div>
          <div className="stat-value">{value}</div>
          {change && (
            <div className={change.positive ? "stat-change-positive" : "stat-change-negative"}>
              {change.positive ? '↑' : '↓'} {change.value}
            </div>
          )}
          {additionalText && <div className="text-xs text-gray-500 mt-1">{additionalText}</div>}
        </div>
        <div className={cn("text-guardian p-3 rounded-full bg-accent", iconClassName)}>
          {icon}
        </div>
      </div>
    </div>
  );
}
