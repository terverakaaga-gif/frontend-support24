
import { SupportWorkerSkill } from './types';
import { User } from './User';

export interface SupportWorker extends User {
  skills?: SupportWorkerSkill[];
  experience: {
    title: string;
    organization: string;
    startDate: Date;
    endDate?: Date;
    description: string;
  }[];
  hourlyRate: {
    baseRate: number;
    weekendRate?: number;
    holidayRate?: number;
    overnightRate?: number;
  };
  availability: {
    weekdays: {
      day: string;
      available: boolean;
      slots?: {
        start: string; // Time in HH:MM format
        end: string;
      }[];
    }[];
    unavailableDates: Date[];
  };
  languages: string[];
}
