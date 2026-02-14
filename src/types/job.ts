import { JobCompetencies } from "@/api/services/jobService";

export interface JobFormData {
  jobRole: string;
  location: string;
  price: string;
  jobType: string;
  status: string;
  jobDescription: string;
  keyResponsibilities: string;
  requiredCompetencies: JobCompetencies;
  additionalNote: string;
  stateId: string;
  regionId: string;
  serviceAreaIds: string[];
}

export const JOB_ROLE_OPTIONS = [
  { value: "Support Worker", label: "Support Worker" },
  { value: "Youth Worker", label: "Youth Worker" },
  { value: "Nursing Assistant", label: "Nursing Assistant" },
  { value: "Cleaner", label: "Cleaner" },
  { value: "Handy Person", label: "Handy Person" },
];

export const JOB_TYPE_OPTIONS = [
  { value: "fullTime", label: "Full-time" },
  { value: "partTime", label: "Part-time" },
  { value: "casual", label: "Casual" },
  { value: "contract", label: "Contract" },
  { value: "remote", label: "Remote" },
  { value: "hybrid", label: "Hybrid" },
];

export const STATUS_OPTIONS = [
  { value: "active", label: "Active" },
  { value: "closed", label: "Closed" },
  { value: "draft", label: "Draft" },
];

export const COMPETENCY_OPTIONS = [
  { id: "rightToWorkInAustralia", label: "Right to Work in Australia" },
  { id: "ndisWorkerScreeningCheck", label: "NDIS Worker Screening Check" },
  { id: "wwcc", label: "Working with Children Check" },
  { id: "policeCheck", label: "Police Check" },
  { id: "firstAid", label: "First Aid Certified" },
  { id: "cpr", label: "CPR Certified" },
  {
    id: "professionalIndemnityInsurance",
    label: "Professional Indemnity Insurance",
  },
  { id: "covidVaccinationStatus", label: "COVID-19 Vaccination" },
];

export const INITIAL_FORM_DATA: JobFormData = {
  jobRole: "",
  location: "",
  price: "",
  jobType: "",
  status: "active",
  jobDescription: "",
  keyResponsibilities: "",
  requiredCompetencies: {},
  additionalNote: "",
  stateId: "",
  regionId: "",
  serviceAreaIds: [],
};
