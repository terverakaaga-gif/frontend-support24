
import {  Calendar, CalendarAdd, CheckCircle, EyeClosed, Flag2,  ShieldCheck, } from "@solar-icons/react";
import { BadgeCheck, Headset, Settings2 } from "lucide-react";

export const LANDINGPAGE_NAVS = [
  { name: "How it Works", href: "/how-it-works" },
  { name: "Events", href: "/coming-soon" },
  { name: "Accommodation", href: "/coming-soon" },
  { name: "Marketplace", href: "/coming-soon" },
  { name: "FAQs", href: "/coming-soon" },
  { name: "Contact Us", href: "/coming-soon" },
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
      "Decide who supports you, when, and how with full flexibility at your fingertips",
    icon: Settings2,
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
    icon: Headset,
  },
  {
    title: "Peace of Mind",
    content:
      "Every support worker is verified, every step is secure, transparency is built in",
    icon: BadgeCheck,
  }
];
