
// Common type definitions used across entities

export type UserRole = 'admin' | 'guardian' | 'participant' | 'support-worker';
export type UserStatus = 'active' | 'inactive' | 'pending' | 'suspended';
export type Gender = 'male' | 'female' | 'non-binary' | 'other' | 'prefer-not-to-say';
export type SupportWorkerSkill = 'personal-care' | 'transport' | 'therapy' | 'social-support' | 'household' | 'communication' | 'behavior-support' | 'medication-management' | 'meal-preparation' | 'first-aid';

// Interfaces based on API response
export interface UserSummary {
  _id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
  profileImage?: string;
}