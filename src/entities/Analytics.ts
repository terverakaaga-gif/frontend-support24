// src/types/analytics.types.ts

/**
 * Common date range options
 */
export enum DateRangeType {
  TODAY = 'today',
  WEEK = 'week',
  MONTH = 'month',
  QUARTER = 'quarter',
  YEAR = 'year',
  CUSTOM = 'custom'
}

/**
 * Date range interface
 */
export interface DateRange {
  startDate: Date;
  endDate: Date;
  type: DateRangeType;
}

/**
 * Trend data point
 */
export interface TrendDataPoint {
  date: string;
  value: number;
  label?: string;
}

/**
 * Comparison data
 */
export interface ComparisonData {
  current: number;
  previous: number;
  percentageChange: number;
  trend: 'up' | 'down' | 'stable';
}

/**
 * API response wrapper
 */
export interface AnalyticsResponse<T> {
  analytics: T;
  dateRange: DateRange;
}

/**
 * Analytics chart configuration
 */
export interface ChartConfig {
  id: string;
  title: string;
  description?: string;
  type: 'line' | 'bar' | 'pie' | 'area' | 'scatter';
  data: TrendDataPoint[] | any[];
  dataKey: string;
  xAxisKey: string;
  color?: string;
  height?: number;
  showLegend?: boolean;
}

/**
 * Stat card configuration
 */
export interface StatCardConfig {
  id: string;
  title: string;
  value: string | number;
  icon: React.ReactNode;
  change?: {
    value: string;
    positive: boolean;
  };
  additionalText?: string;
  className?: string;
  trend?: 'up' | 'down' | 'none';
}

/**
 * Export format options
 */
export type ExportFormat = 'pdf' | 'csv' | 'excel' | 'json';

/**
 * Date range preset option
 */
export interface DateRangeOption {
  label: string;
  value: DateRangeType;
  period?: number;
  unit?: 'day' | 'week' | 'month' | 'year';
}

/**
 * Analytics time series grouping
 */
export type TimeSeriesGrouping = 'hourly' | 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'yearly';

/**
 * User distribution by type
 */
export interface UserDistribution {
  label: string;
  value: number;
  percentage: number;
  color?: string;
}

/**
 * Financial metric
 */
export interface FinancialMetric {
  label: string;
  value: number;
  change?: number;
  trend?: 'up' | 'down' | 'stable';
  color?: string;
}

/**
 * Operational metric
 */
export interface OperationalMetric {
  label: string;
  value: number | string;
  change?: number;
  trend?: 'up' | 'down' | 'stable';
  icon?: React.ReactNode;
  color?: string;
}

/**
 * Analytics dashboard section
 */
export interface DashboardSection {
  id: string;
  title: string;
  description?: string;
  charts: ChartConfig[];
  stats: StatCardConfig[];
}

/**
 * Platform metrics summary
 */
export interface PlatformMetricsSummary {
  users: {
    total: number;
    active: number;
    growth: number;
  };
  shifts: {
    total: number;
    completed: number;
    cancelled: number;
    completion_rate: number;
  };
  financial: {
    revenue: number;
    pending: number;
    growth: number;
  };
  organizations: {
    total: number;
    active: number;
    pending_invites: number;
  };
}