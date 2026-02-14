export interface SupportNeed {
  name: string;
  _id: string;
}

export interface EmergencyContact {
  name: string;
  relationship: string;
  phone: string;
}

export interface PlanManager {
  name: string;
  email: string;
}

export interface Coordinator {
  name: string;
  email: string;
}

export interface BehaviorSupportPractitioner {
  name: string;
  email: string;
}

export interface Subscription {
  tier: string;
  isActive: boolean;
  autoRenew: boolean;
  startDate: string;
}

export interface ParticipantLocation {
  type: "Point";
  coordinates: number[];
}

export interface Participant {
  _id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: "participant";
  status: string;
  phone: string;
  profileImage?: string;
  notificationPreferences: string;
  isEmailVerified: boolean;
  supportNeeds: SupportNeed[];
  supportCoordinators: any[]; // Define if structure known
  preferredLanguages: string[];
  preferredGenders: string[];
  requiresSupervision: boolean;
  onboardingComplete: boolean;
  pushTokens: string[];
  createdAt: string;
  updatedAt: string;
  lastLogin: string;
  address: string;
  ndisNumber: string;
  regionId: string;
  serviceAreaId: string;
  stateId: string;
  suburbId: string;
  gender: string;
  dateOfBirth: string;
  serviceCategories: any[]; // Define if structure known
  emergencyContact?: EmergencyContact;
  planManager?: PlanManager;
  coordinator?: Coordinator;
  behaviorSupportPractitioner?: BehaviorSupportPractitioner;
  subscription?: Subscription;
  participantLocation?: ParticipantLocation;
}
