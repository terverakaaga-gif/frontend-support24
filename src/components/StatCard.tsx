import { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import { TrendingUp, TrendingDown } from "lucide-react";

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
      <div className="p-6">
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
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-medium text-muted-foreground group-hover:text-[#1e3b93] transition-colors">
              {title}
            </h3>
            <div
              className={cn(
                "flex items-center justify-center w-10 h-10 rounded-full transition-all duration-200",
                "bg-[#1e3b93]/10 group-hover:bg-[#1e3b93]/20",
                iconClassName
              )}
            >
              <div className="text-[#1e3b93]">{icon}</div>
            </div>
          </div>

          <div className="space-y-1">
            <div className="flex items-baseline gap-2">
              <div className="text-2xl font-bold tracking-tight transition-transform group-hover:scale-105 text-[#1e3b93]">
                {value}
              </div>
              {change && (
                <div
                  className={cn(
                    "flex items-center text-sm font-medium transition-all",
                    change.positive
                      ? "text-emerald-600 group-hover:text-emerald-700"
                      : "text-red-500 group-hover:text-red-600"
                  )}
                >
                  {change.positive ? (
                    <TrendingUp className="w-4 h-4 mr-1" />
                  ) : (
                    <TrendingDown className="w-4 h-4 mr-1" />
                  )}
                  {change.value}
                </div>
              )}
            </div>

            {additionalText && (
              <div className="text-sm text-muted-foreground group-hover:text-[#1e3b93]/60">
                {additionalText}
              </div>
            )}
          </div>

          {/* Decorative Elements */}
          <div className="absolute -top-6 -right-6 pointer-events-none transition-opacity group-hover:opacity-75">
            <div
              className={cn(
                "w-24 h-24 rounded-full blur-3xl opacity-20 transition-all duration-500 group-hover:scale-110",
                change?.positive
                  ? "bg-emerald-500"
                  : change
                  ? "bg-red-500"
                  : "bg-[#1e3b93]"
              )}
            />
          </div>
        </div>
      </div>
    </Card>
  );
}
