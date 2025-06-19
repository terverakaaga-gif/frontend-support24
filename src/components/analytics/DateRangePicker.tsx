// src/components/analytics/DateRangePicker.tsx
import { useState, useEffect } from 'react';
import { CalendarIcon, ChevronDown } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { DateRange, DateRangeType } from '@/entities/Analytics';
import { createDateRange } from '@/api/services/analyticsService';

interface DateRangePickerProps {
  value: DateRange;
  onChange: (range: DateRange) => void;
  showComparison?: boolean;
  comparison?: boolean;
  onComparisonChange?: (comparison: boolean) => void;
  className?: string;
}

export function DateRangePicker({
  value,
  onChange,
  showComparison = false,
  comparison = true,
  onComparisonChange,
  className,
}: DateRangePickerProps) {
  const [selectedRange, setSelectedRange] = useState<DateRangeType>(value.type);
  const [dateRange, setDateRange] = useState<{ from: Date; to: Date }>({
    from: value.startDate,
    to: value.endDate,
  });

  // Update internal state when prop value changes
  useEffect(() => {
    setSelectedRange(value.type);
    setDateRange({ from: value.startDate, to: value.endDate });
  }, [value]);

  // Handle preset change
  const handlePresetChange = (preset: DateRangeType) => {
    if (preset === DateRangeType.CUSTOM) {
      // Just update the selected range type, don't change actual dates yet
      setSelectedRange(DateRangeType.CUSTOM);
      return;
    }

    const newRange = createDateRange(preset);
    setSelectedRange(preset);
    setDateRange({ from: newRange.startDate, to: newRange.endDate });
    onChange(newRange);
  };

  // Handle custom date selection
  const handleDateRangeChange = (range: { from?: Date; to?: Date }) => {
    if (range.from && range.to) {
      setDateRange({ from: range.from, to: range.to });
      
      // Create and emit the new date range
      const newRange: DateRange = {
        startDate: range.from,
        endDate: range.to,
        type: DateRangeType.CUSTOM,
      };
      
      onChange(newRange);
    } else {
      setDateRange({ ...dateRange, ...range });
    }
  };

  // Format date range for display
  const formatDateRange = () => {
    if (selectedRange !== DateRangeType.CUSTOM) {
      const labels: Record<DateRangeType, string> = {
        [DateRangeType.TODAY]: 'Today',
        [DateRangeType.WEEK]: 'This Week',
        [DateRangeType.MONTH]: 'This Month',
        [DateRangeType.QUARTER]: 'This Quarter',
        [DateRangeType.YEAR]: 'This Year',
        [DateRangeType.CUSTOM]: 'Custom Range',
      };
      return labels[selectedRange];
    }

    return `${format(dateRange.from, 'LLL d, yyyy')} - ${format(
      dateRange.to,
      'LLL d, yyyy'
    )}`;
  };

  return (
    <div className={cn('flex flex-col sm:flex-row gap-2', className)}>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className={cn(
              'w-full sm:w-auto justify-start text-left font-normal',
              !value && 'text-muted-foreground'
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {formatDateRange()}
            <ChevronDown className="ml-auto h-4 w-4 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-full p-0" align="start">
          <div className="p-3 border-b">
            <Tabs defaultValue={selectedRange} onValueChange={(v) => handlePresetChange(v as DateRangeType)}>
              <TabsList className="grid grid-cols-6 w-full">
                <TabsTrigger value={DateRangeType.TODAY}>Today</TabsTrigger>
                <TabsTrigger value={DateRangeType.WEEK}>Week</TabsTrigger>
                <TabsTrigger value={DateRangeType.MONTH}>Month</TabsTrigger>
                <TabsTrigger value={DateRangeType.QUARTER}>Quarter</TabsTrigger>
                <TabsTrigger value={DateRangeType.YEAR}>Year</TabsTrigger>
                <TabsTrigger value={DateRangeType.CUSTOM}>Custom</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
          
          {selectedRange === DateRangeType.CUSTOM && (
            <div className="p-3 border-b">
              <Calendar
                mode="range"
                selected={dateRange}
                onSelect={(range) => handleDateRangeChange(range || { from: new Date(), to: new Date() })}
                numberOfMonths={2}
                initialFocus
              />
            </div>
          )}
          
          {showComparison && (
            <div className="p-3 border-t flex items-center justify-between">
              <span className="text-sm">Compare with previous period</span>
              <Select
                value={comparison ? 'true' : 'false'}
                onValueChange={(value) => 
                  onComparisonChange?.(value === 'true')
                }
              >
                <SelectTrigger className="w-[120px]">
                  <SelectValue placeholder="Comparison" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="true">Yes</SelectItem>
                  <SelectItem value="false">No</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}
        </PopoverContent>
      </Popover>
    </div>
  );
}