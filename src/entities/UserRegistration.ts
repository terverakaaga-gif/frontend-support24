
import { UserRole } from './types';

export interface UserRegistrationInput {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  phone: string;
}
