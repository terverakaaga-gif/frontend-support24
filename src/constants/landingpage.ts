
import {  Calendar, CalendarAdd, CheckCircle, EyeClosed, Flag2, HandStars, SettingsMinimalistic, ShieldCheck } from "@solar-icons/react";

export const LANDINGPAGE_NAVS = [
  { name: "How it Works", href: "#how_it_works" },
  { name: "Events", href: "#events" },
  { name: "Accommodation", href: "#accommodation" },
  { name: "FAQs", href: "#faqs" },
  { name: "Contact Us", href: "#contact_us" },
] as const;

export const FEATURE_CARDS = [
  {
    title: "Verified Support Workers",
    content:
      "Every support worker undergoes comprehensive police checks. references verification, and skills assessment before joining our platform.",
    icon: ShieldCheck,
    footer: "100% verification rate",
  },
  {
    title: "Insurance Transparency",
    content:
      "All insurance documentation is verified and displayed clearly. Worker coverage details are updated in real-time for your peace of mind.",
    icon: CheckCircle,
    footer: "$20M coverage",
  },
  {
    title: "Privacy Protected",
    content:
      "Enterprise-grade security with end-end encryption. Your personal information and communication remains completely private.",
    icon: EyeClosed,
    footer: "256-bit encryption",
  },
  {
    title: "Protected Booking",
    content:
      "Every appointment is secured with verified workers and encrypted transactions, gibing you confidence from start to finish.",
    icon: Calendar,
    footer: "100% booking protection",
  },
];

export const ALL_IN_ONE_CARDS = [
  {
    title: "Daily Routine",
    content:
      "Create and share some routine so support is consistent and clear everyday",
      icon: CalendarAdd,
  },
  {
    title: "Choice & Control",
    content:
      "Monitor your support worker's arrival and service progress with our live tracking feature.",
    icon: SettingsMinimalistic,
  },
  {
    title: "Camps & Activities",
    content:
      "Discover community programs, group outings, and camps designed to connect and inspire",
    icon: Flag2,
  },
  {
    title: "Specialist Support",
    content:
      "Need something specific, our team is here to guide you to the right support",
    icon: HandStars,
  }
];
