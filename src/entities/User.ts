
import { Gender, UserRole, UserStatus } from './types';

export interface User {
  _id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  status: UserStatus;
  phone?: string;
  gender?: Gender;
  dateOfBirth?: Date;
  address?: {
    street: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  };
  profileImage?: string;
  bio?: string;
  
  // Helper virtual property not stored in database
  get fullName(): string;
}

// Add a helper implementation for the virtual property
export const getUserFullName = (user: Pick<User, 'firstName' | 'lastName'>): string => {
  return `${user.firstName} ${user.lastName}`;
};
