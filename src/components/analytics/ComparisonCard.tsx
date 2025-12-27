import { ReactNode } from 'react';
import { cn } from '@/lib/utils';
import { Card, CardContent } from '@/components/ui/card';
import { ComparisonData } from '@/entities/Analytics';
import { formatNumber } from '@/lib/formatters';
import { CourseDown, CourseUp } from '@solar-icons/react';
import { MinusIcon } from '../icons';

interface ComparisonCardProps {
  title: string;
  data: ComparisonData;
  prefix?: string;
  suffix?: string;
  icon?: ReactNode;
  className?: string;
  valueFormatter?: (value: number) => string;
}

export function ComparisonCard({
  title,
  data,
  prefix = '',
  suffix = '',
  icon,
  className,
  valueFormatter = formatNumber,
}: ComparisonCardProps) {
  const { current, previous, percentageChange, trend } = data;
  
  const formattedCurrent = `${prefix}${valueFormatter(current)}${suffix}`;
  const formattedPrevious = `${prefix}${valueFormatter(previous)}${suffix}`;
  const formattedChange = `${percentageChange > 0 ? '+' : ''}${percentageChange.toFixed(1)}%`;
  
  return (
    <Card className={cn('overflow-hidden transition-all duration-200 hover:shadow-lg', className)}>
      <CardContent className="p-6">
        <div className="flex justify-between items-start">
          <div className="space-y-1">
            <p className="text-sm font-montserrat-semibold text-muted-foreground">{title}</p>
            <div className="flex items-baseline gap-2">
              <p className="text-2xl font-montserrat-bold">{formattedCurrent}</p>
              <div 
                className={cn(
                  'flex items-center text-sm font-montserrat-semibold gap-1',
                  trend === 'up' ? 'text-emerald-600' : 
                  trend === 'down' ? 'text-red-500' : 
                  'text-muted-foreground'
                )}
              >
                {trend === 'up' ? (
                  <CourseUp className="h-3 w-3" />
                ) : trend === 'down' ? (
                  <CourseDown className="h-3 w-3" />
                ) : (
                  <MinusIcon className="h-3 w-3" />
                )}
                <span>{formattedChange}</span>
              </div>
            </div>
          </div>
          {icon && (
            <div className="p-2 rounded-md bg-muted/50">
              {icon}
            </div>
          )}
        </div>
        
        <div className="mt-4 text-sm text-muted-foreground">
          <span>Previous: {formattedPrevious}</span>
        </div>
        
        {/* Visual indicator */}
        <div className="mt-3 h-1.5 w-full bg-muted overflow-hidden rounded-full">
          <div 
            className={cn(
              'h-full rounded-full',
              trend === 'up' ? 'bg-emerald-500' : 
              trend === 'down' ? 'bg-red-500' : 
              'bg-primary'
            )}
            style={{ 
              width: `${Math.min(Math.max(
                (current / (previous || 1)) * 100, 
                0
              ), 100)}%`
            }}
          />
        </div>
      </CardContent>
    </Card>
  );
}