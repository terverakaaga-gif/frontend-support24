
import { RateTimeBand } from "@/types/organization.types";

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