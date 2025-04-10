import { useState } from "react";
import { Link } from "react-router-dom";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Search, MessageCircle, Calendar } from "lucide-react";
import { SupportWorker } from "@/entities/SupportWorker";
import { getUserFullName } from "@/entities/User";

// Mock data for accepted connections
const mockConnections: SupportWorker[] = [
    {
      _id: "sw1",
      email: "olivia.thompson@example.com.au",
      firstName: "Olivia",
      lastName: "Thompson",
      role: "support-worker",
      status: "active",
      profileImage: "https://i.pravatar.cc/150?img=5",
      skills: ["personal-care", "transport", "social-support"],
      experience: [
        {
          title: "Support Worker",
          organization: "Care Connect",
          startDate: new Date("2023-01-15"),
          description: "Provided in-home care and support services."
        }
      ],
      hourlyRate: {
        baseRate: 35,
        weekendRate: 45,
        holidayRate: 55
      },
      availability: {
        weekdays: [
          { day: "Monday", available: true },
          { day: "Tuesday", available: true },
          { day: "Wednesday", available: false },
          { day: "Thursday", available: true },
          { day: "Friday", available: true },
          { day: "Saturday", available: false },
          { day: "Sunday", available: false }
        ],
        unavailableDates: []
      },
      languages: ["English", "Mandarin"],
      get fullName() {
        return getUserFullName(this);
      }
    },
    {
      _id: "sw2",
      email: "michael.brown@example.com.au",
      firstName: "Michael",
      lastName: "Brown",
      role: "support-worker",
      status: "active",
      profileImage: "https://i.pravatar.cc/150?img=6",
      skills: ["therapy", "behavior-support", "communication"],
      experience: [
        {
          title: "Behavioral Therapist",
          organization: "Wellness Center",
          startDate: new Date("2022-03-10"),
          description: "Provided behavioral therapy and support."
        }
      ],
      hourlyRate: {
        baseRate: 40,
        weekendRate: 50
      },
      availability: {
        weekdays: [
          { day: "Monday", available: false },
          { day: "Tuesday", available: true },
          { day: "Wednesday", available: true },
          { day: "Thursday", available: true },
          { day: "Friday", available: false },
          { day: "Saturday", available: true },
          { day: "Sunday", available: false }
        ],
        unavailableDates: []
      },
      languages: ["English", "Spanish"],
      get fullName() {
        return getUserFullName(this);
      }
    }
  ];