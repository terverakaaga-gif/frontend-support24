// src/components/analytics/RealTimeMetrics.tsx
import { useEffect, useState } from 'react';
import { RefreshCw, Users, Clock, Calendar } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';
import { StatCard } from '@/components/StatCard';
import { useGetRealTimeMetrics } from '@/hooks/useAnalyticsHooks';
import { formatDateTime } from '@/lib/formatters';
import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

interface RealTimeMetricsProps {
  className?: string;
  autoRefresh?: boolean;
  refreshInterval?: number;
}

export function RealTimeMetrics({
  className,
  autoRefresh = true,
  refreshInterval = 60000, // 1 minute
}: RealTimeMetricsProps) {
  const [lastRefreshed, setLastRefreshed] = useState<Date>(new Date());
  
  // Fetch real-time metrics
  const { 
    data: metrics,
    isLoading,
    isFetching,
    refetch
  } = useGetRealTimeMetrics(true, autoRefresh ? refreshInterval : undefined);
  
  // Update last refreshed time when data is fetched
  useEffect(() => {
    if (!isFetching && metrics) {
      setLastRefreshed(new Date());
    }
  }, [isFetching, metrics]);
  
  // Handle manual refresh
  const handleRefresh = () => {
    refetch();
  };
  
  return (
    <Card className={className}>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-primary" />
            <CardTitle className="text-lg font-medium">Real-Time Metrics</CardTitle>
          </div>
          <Button 
            variant="outline" 
            size="sm"
            onClick={handleRefresh}
            disabled={isLoading || isFetching}
            className="flex items-center gap-2"
          >
            <RefreshCw className={cn("h-4 w-4", {
              "animate-spin": isLoading || isFetching
            })} />
            Refresh
          </Button>
        </div>
        <p className="text-xs text-muted-foreground">
          Last updated: {formatDateTime(lastRefreshed)}
        </p>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 md:grid-cols-3">
          <StatCard
            title="Active Users"
            value={isLoading ? "Loading..." : metrics?.activeUsers.toString() || "0"}
            icon={<Users className="h-4 w-4 text-guardian" />}
            additionalText="Currently online"
            trend="none"
          />
          <StatCard
            title="Today's Shifts"
            value={isLoading ? "Loading..." : metrics?.shiftsToday.toString() || "0"}
            icon={<Calendar className="h-4 w-4 text-guardian" />}
            additionalText={`${metrics?.completedShiftsToday || 0} completed`}
            trend="none"
          />
          <StatCard
            title="Platform Activity"
            value={isLoading ? "Loading..." : (metrics?.platformUsage[0]?.value || 0).toString()}
            icon={<Clock className="h-4 w-4 text-guardian" />}
            additionalText="Active sessions"
            trend="none"
          />
        </div>
      </CardContent>
    </Card>
  );
}

// Helper function for class names
// function cn(...classes: (string | boolean | undefined)[]) {
//   return classes.filter(Boolean).join(' ');
// }

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}