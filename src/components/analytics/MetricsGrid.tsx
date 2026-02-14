// src/components/analytics/MetricsGrid.tsx
import { ReactNode } from 'react';
import { StatCard } from '@/components/StatCard';
import { ComparisonCard } from '@/components/analytics/ComparisonCard';
import { ComparisonData } from '@/entities/Analytics';
import { cn } from '@/lib/utils';

interface MetricConfig {
  id: string;
  title: string;
  value: string | number;
  icon: ReactNode;
  change?: { value: string; positive: boolean };
  additionalText?: string;
  className?: string;
  comparisonData?: ComparisonData;
}

interface MetricsGridProps {
  metrics: MetricConfig[];
  columns?: 2 | 3 | 4 | 5;
  className?: string;
  showComparison?: boolean;
}

export function MetricsGrid({
  metrics,
  columns = 4,
  className,
  showComparison = true,
}: MetricsGridProps) {
  return (
    <div
      className={cn(
        'grid gap-4',
        {
          'md:grid-cols-2 lg:grid-cols-2': columns === 2,
          'md:grid-cols-2 lg:grid-cols-3': columns === 3,
          'md:grid-cols-2 lg:grid-cols-4': columns === 4,
          'md:grid-cols-3 lg:grid-cols-5': columns === 5,
        },
        className
      )}
    >
      {metrics.map((metric) => (
        metric.comparisonData && showComparison ? (
          <ComparisonCard
            key={metric.id}
            title={metric.title}
            data={metric.comparisonData}
            icon={metric.icon}
            className={metric.className}
          />
        ) : (
          <StatCard
            key={metric.id}
            title={metric.title}
            value={metric.value}
            icon={metric.icon}
            change={metric.change}
            additionalText={metric.additionalText}
            className={metric.className}
            trend={metric.change?.positive ? 'up' : metric.change ? 'down' : 'none'}
          />
        )
      ))}
    </div>
  );
}