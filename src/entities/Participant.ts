
import { User } from './User';

export interface Participant extends User {
  supportNeeds: string[];
  emergencyContact?: {
    name: string;
    relationship: string;
    phone: string;
  };
}
