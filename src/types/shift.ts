export type RiskLevel = 'Critical' | 'High' | 'Medium' | 'Low' | 'Manageable';

export interface SupportWorker {
  id: string;
  name: string;
  avatar: string;
  reliability: number;
  status?: 'Active' | 'Inactive';
}

export interface Shift {
  id: string;
  type: string;
  riskLevel: RiskLevel;
  primaryWorker: SupportWorker;
  backupWorker?: SupportWorker;
  startTime: string; // "7:00"
  endTime: string;   // "8:00 PM"
  date: string;      // "2023-10-10"
  dayName: string;   // "Mon 10"
  participantName?: string;
  reason?: string;   // For cancellation
  isCancelled?: boolean;
}

export interface MetricData {
  label: string;
  value: string;
  trend: 'up' | 'down';
  trendLabel: string;
  iconType: 'cancel' | 'time' | 'users' | 'money';
}