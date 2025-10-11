// src/components/analytics/DashboardSection.tsx
import { ReactNode } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface DashboardSectionProps {
  title: string;
  description?: string;
  children: ReactNode;
  className?: string;
  icon?: ReactNode;
  action?: ReactNode;
  collapsible?: boolean;
  defaultCollapsed?: boolean;
}

export function DashboardSection({
  title,
  description,
  children,
  className,
  icon,
  action,
  collapsible = false,
  defaultCollapsed = false,
}: DashboardSectionProps) {
  // For future implementation of collapsible sections
  
  return (
    <Card className={cn('transition-all duration-200', className)}>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {icon}
            <CardTitle className="text-xl font-montserrat-semibold text-guardian">{title}</CardTitle>
          </div>
          {action}
        </div>
        {description && <p className="text-sm text-muted-foreground mt-1">{description}</p>}
      </CardHeader>
      <CardContent>
        {children}
      </CardContent>
    </Card>
  );
}