import { User, UsersGroupRounded, Repeat } from "@solar-icons/react";

export const SHIFT_TYPES = [
  { id: "single", title: "Single Worker", description: "Assign one worker", icon: User },
  { id: "multiple", title: "Multiple Workers", description: "Assign multiple workers", icon: UsersGroupRounded },
  { id: "recurring", title: "Recurring Shift", description: "Create repeating schedule", icon: Repeat },
];

export const RECURRENCE_PATTERNS = [
  { value: "none", label: "No Recurrence" },
  { value: "daily", label: "Daily" },
  { value: "weekly", label: "Weekly" },
  { value: "biweekly", label: "Bi-weekly" },
  { value: "monthly", label: "Monthly" },
];

export const SHIFT_DURATIONS = [
  { value: 2, label: "2 Hours" },
  { value: 3, label: "3 Hours" },
  { value: 4, label: "4 Hours" },
  { value: 8, label: "8 Hours" },
];
