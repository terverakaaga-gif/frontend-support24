import { ReactNode } from "react";
import { cn } from "@/lib/design-utils";
import { Card } from "@/components/ui/card";
import { CourseUp, CourseDown } from "@solar-icons/react";
import { 
  SPACING, 
  RADIUS, 
  TEXT_SIZE, 
  FONT_FAMILY,
  TEXT_COLORS,
  TEXT_STYLES,
  HEADING_STYLES,
} from "@/constants/design-system";

interface StatCardProps {
  title: string;
  value: string | number;
  icon: ReactNode;
  change?: { value: string; positive: boolean };
  additionalText?: string;
  className?: string;
  iconClassName?: string;
  trend?: "up" | "down" | "none";
}

export function StatCard({
  title,
  value,
  icon,
  change,
  additionalText,
  className,
  iconClassName,
  trend = "none",
}: StatCardProps) {
  return (
    <Card
      className={cn(
        "relative overflow-hidden transition-all duration-200 hover:shadow-lg group",
        className
      )}
    >
      <div className={`p-${SPACING.md}`}>
        {/* Background Gradient Effect */}
        <div
          className="absolute inset-0 opacity-50 group-hover:opacity-70 transition-opacity"
          style={{
            background: `linear-gradient(to bottom right, rgba(30, 59, 147, 0.1), rgba(30, 59, 147, 0.02))`,
            maskImage:
              "radial-gradient(circle at top right, black, transparent 70%)",
          }}
        />

        {/* Content */}
        <div className="relative z-10">
          <div className={`flex items-center justify-between mb-${SPACING.sm}`}>
            <h3 className={cn(TEXT_STYLES.small, "group-hover:text-guardian transition-colors")}>
              {title}
            </h3>
            <div
              className={cn(
                "flex items-center justify-center w-10 h-10",
                RADIUS.full,
                "transition-all duration-200",
                "bg-guardian/10 group-hover:bg-guardian/20",
                iconClassName
              )}
            >
              <div className="text-guardian">{icon}</div>
            </div>
          </div>

          <div className="space-y-1">
            <div className={`flex items-baseline gap-${SPACING.xs}`}>
              <div className={cn(HEADING_STYLES.h4, "tracking-tight transition-transform group-hover:scale-105 text-guardian")}>
                {value}
              </div>
              {change && (
                <div
                  className={cn(
                    "flex items-center",
                    TEXT_SIZE.sm,
                    FONT_FAMILY.montserratSemibold,
                    "transition-all",
                    change.positive
                      ? "text-emerald-600 group-hover:text-emerald-700"
                      : "text-red-500 group-hover:text-red-600"
                  )}
                >
                  {change.positive ? (
                    <CourseUp className="w-4 h-4 mr-1" />
                  ) : (
                    <CourseDown className="w-4 h-4 mr-1" />
                  )}
                  {change.value}
                </div>
              )}
            </div>

            {additionalText && (
              <div className={cn(TEXT_STYLES.small, "group-hover:text-guardian/60")}>
                {additionalText}
              </div>
            )}
          </div>

          {/* Decorative Elements */}
          <div className="absolute -top-6 -right-6 pointer-events-none transition-opacity group-hover:opacity-75">
            <div
              className={cn(
                "w-24 h-24",
                RADIUS.full,
                "blur-3xl opacity-20 transition-all duration-500 group-hover:scale-110",
                change?.positive
                  ? "bg-emerald-500"
                  : change
                  ? "bg-red-500"
                  : "bg-guardian"
              )}
            />
          </div>
        </div>
      </div>
    </Card>
  );
}
