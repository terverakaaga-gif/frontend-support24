export interface ApplicationFormData {
  fullName: string;
  email: string;
  phoneNumber: string;
  location: string;
  resume: File;
}

export type ApplicationStep = "form" | "review" | "success";

export interface DocumentStatus {
  name: string;
  uploaded: boolean;
}