import { RateTimeBand, WorkerProfile } from "@/types/suport-worker-organization.types";

export const getWorkerDisplayName = (workerId: string | WorkerProfile): string => {
  if (typeof workerId === "string") {
    return `Worker ${workerId.slice(-8)}`;
  }
  return `${workerId.firstName} ${workerId.lastName}`;
};

export const getWorkerInitials = (workerId: string | WorkerProfile): string => {
  if (typeof workerId === "string") {
    return workerId.slice(0, 2).toUpperCase();
  }
  return `${workerId.firstName[0]}${workerId.lastName[0]}`.toUpperCase();
};

export const getWorkerEmail = (workerId: string | WorkerProfile): string => {
  if (typeof workerId === "string") return "Email not available";
  return workerId.email;
};

export const getWorkerPhone = (workerId: string | WorkerProfile): string => {
  if (typeof workerId === "string") return "Phone not available";
  return workerId.phone;
};

export const getWorkerProfileImage = (workerId: string | WorkerProfile): string | undefined => {
  if (typeof workerId === "string") return undefined;
  return workerId.profileImage;
};

export const getShiftRateName = (code: string): string => {
  const shiftNames: { [key: string]: string } = {
    MORNING: "Morning Shift",
    AFTERNOON: "Afternoon Shift",
    NIGHT: "Night Shift",
    WEEKEND: "Weekend Shift",
    HOLIDAY: "Public Holiday Shift",
  };
  return shiftNames[code] || code;
};

export const getRateBandName = (rateTimeBandId: string | RateTimeBand): string => {
  if (typeof rateTimeBandId === "object") {
    return getShiftRateName(rateTimeBandId.code);
  }
  const rateBandNames: { [key: string]: string } = {
    "681c6f750ab224ca6685d05c": "Morning Shift",
    "681c6f750ab224ca6685d05d": "Afternoon Shift",
    "681c6f750ab224ca6685d05e": "Night Shift",
    "681c6f750ab224ca6685d05f": "Weekend Shift",
    "681c6f750ab224ca6685d060": "Public Holiday Shift",
  };
  return rateBandNames[rateTimeBandId] || `Rate Band ${rateTimeBandId.slice(-4)}`;
};

export const getRateBandCode = (rateTimeBandId: string | RateTimeBand): string => {
  if (typeof rateTimeBandId === "object") {
    return rateTimeBandId.code;
  }
  return "";
};