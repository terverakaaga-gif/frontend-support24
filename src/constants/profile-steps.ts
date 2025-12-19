// src/constants/profile-steps.ts
import {
  User,
  MapPoint,
  Heart,
  DangerCircle,
  Buildings2,
  Star,
  CaseRoundMinimalistic,
  Translation,
  CalendarMark,
} from "@solar-icons/react";

export const PARTICIPANT_STEPS = [
  { id: 1, title: "Basic Information", icon: User },
  { id: 2, title: "Contact & Location", icon: MapPoint },
  { id: 3, title: "NDIS & Support", icon: Heart },
  { id: 4, title: "Emergency Contact", icon: DangerCircle },
  { id: 5, title: "Care Team", icon: Buildings2 },
  { id: 6, title: "Preferences", icon: Star },
];

export const SUPPORT_WORKER_STEPS = [
  { id: 1, title: "Basic Information", icon: User },
  { id: 2, title: "Professional Bio", icon: CaseRoundMinimalistic },
  { id: 3, title: "Skills & Languages", icon: Star },
  { id: 4, title: "Experience", icon: Translation },
  { id: 5, title: "Location & Service Areas", icon: MapPoint },
  { id: 6, title: "Rates & Availability", icon: CalendarMark },
];