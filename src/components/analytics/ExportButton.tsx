// src/components/analytics/ExportButton.tsx
import { useState } from 'react';
import { Download, FileText, FileSpreadsheet, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { DateRange } from '@/entities/Analytics';
import { useExportAnalyticsData } from '@/hooks/useAnalyticsHooks';

interface ExportButtonProps {
  dateRange: DateRange;
  isLoading?: boolean;
  className?: string;
}

export function ExportButton({ dateRange, isLoading = false, className }: ExportButtonProps) {
  const [isExporting, setIsExporting] = useState(false);
  
  const exportMutation = useExportAnalyticsData();
  
  const handleExport = async (format: 'pdf' | 'csv' | 'excel' | 'json') => {
    setIsExporting(true);
    
    try {
      await exportMutation.mutateAsync({
        dateRange: dateRange.type,
        startDate: dateRange.type === 'custom' ? dateRange.startDate.toISOString() : undefined,
        endDate: dateRange.type === 'custom' ? dateRange.endDate.toISOString() : undefined,
        format
      });
    } finally {
      setIsExporting(false);
    }
  };
  
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="default"
          size="sm"
          className="h-9 bg-gradient-to-r from-guardian to-guardian-dark hover:from-guardian-dark hover:to-guardian"
          disabled={isLoading || isExporting}
        >
          <Download className="h-4 w-4 mr-2" />
          {isExporting ? 'Exporting...' : 'Export Report'}
          <ChevronDown className="h-4 w-4 ml-2" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => handleExport('pdf')}>
          <FileText className="h-4 w-4 mr-2" />
          <span>Export as PDF</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleExport('csv')}>
          <FileSpreadsheet className="h-4 w-4 mr-2" />
          <span>Export as CSV</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}