import React, { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Calendar,
  Pin,
  ClockCircle,
  Magnifer,
  Bookmark,
  Flag2,
  Palette,
  MusicNote,
} from "@solar-icons/react";
import { MapPin, Calendar as CalendarIcon, Clock, ChevronDown, UtensilsCrossed, Trophy, Activity, Search } from "lucide-react";

// Mock data for events
const mockEvents = [
  {
    id: 1,
    title: "Local City Tour, 2025",
    location: "Albion Park, AU",
    description: "Join us for an exciting city tour experience where participants explore local attractions.",
    date: "22nd Nov - 29 Nov, 2025",
    time: "8:00 AM - 12:00 PM",
    image: "https://images.unsplash.com/photo-1511578314322-379afb476865?w=400&h=200&fit=crop",
    participants: 21,
    avatars: [
      { id: 1, name: "A", color: "bg-red-500" },
      { id: 2, name: "B", color: "bg-blue-500" },
      { id: 3, name: "C", color: "bg-green-500" },
    ],
  },
  {
    id: 2,
    title: "Outdoor Adventure Camp",
    location: "Sydney, AU",
    description: "Experience nature with camping, hiking, and outdoor activities for all skill levels.",
    date: "15th Dec - 20 Dec, 2025",
    time: "9:00 AM - 6:00 PM",
    image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=200&fit=crop",
    participants: 35,
    avatars: [
      { id: 1, name: "D", color: "bg-purple-500" },
      { id: 2, name: "E", color: "bg-orange-500" },
      { id: 3, name: "F", color: "bg-pink-500" },
    ],
  },
  {
    id: 3,
    title: "Community Sports Day",
    location: "Melbourne, AU",
    description: "Join us for a fun-filled day of sports activities including basketball, soccer, and more.",
    date: "5th Jan - 5th Jan, 2026",
    time: "10:00 AM - 4:00 PM",
    image: "https://images.unsplash.com/photo-1576678927484-cc907957088c?w=400&h=200&fit=crop",
    participants: 48,
    avatars: [
      { id: 1, name: "G", color: "bg-yellow-500" },
      { id: 2, name: "H", color: "bg-indigo-500" },
      { id: 3, name: "I", color: "bg-teal-500" },
    ],
  },
  {
    id: 4,
    title: "Art Exhibition Opening",
    location: "Brisbane, AU",
    description: "Explore local artists' work in this curated exhibition featuring paintings and sculptures.",
    date: "10th Jan - 15th Jan, 2026",
    time: "2:00 PM - 8:00 PM",
    image: "https://images.unsplash.com/photo-1541961017774-98749e632b85?w=400&h=200&fit=crop",
    participants: 12,
    avatars: [
      { id: 1, name: "J", color: "bg-red-500" },
      { id: 2, name: "K", color: "bg-blue-500" },
      { id: 3, name: "L", color: "bg-green-500" },
    ],
  },
  {
    id: 5,
    title: "Nature Walk & Picnic",
    location: "Perth, AU",
    description: "Enjoy a guided nature walk followed by a community picnic in the park.",
    date: "20th Jan - 20th Jan, 2026",
    time: "11:00 AM - 3:00 PM",
    image: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400&h=200&fit=crop",
    participants: 28,
    avatars: [
      { id: 1, name: "M", color: "bg-purple-500" },
      { id: 2, name: "N", color: "bg-orange-500" },
      { id: 3, name: "O", color: "bg-pink-500" },
    ],
  },
  {
    id: 6,
    title: "Music Festival",
    location: "Adelaide, AU",
    description: "A day of live music performances featuring local bands and artists.",
    date: "25th Jan - 25th Jan, 2026",
    time: "12:00 PM - 10:00 PM",
    image: "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=400&h=200&fit=crop",
    participants: 65,
    avatars: [
      { id: 1, name: "P", color: "bg-yellow-500" },
      { id: 2, name: "Q", color: "bg-indigo-500" },
      { id: 3, name: "R", color: "bg-teal-500" },
    ],
  },
];

const categories = [
  { id: "nearby", label: "Nearby you", icon: Pin, active: true },
  { id: "camping", label: "Camping Events", icon: Flag2, active: false },
  { id: "sport", label: "Sport Events", icon: Trophy, active: false },
  { id: "art", label: "Art Exhibition", icon: Palette, active: false },
  { id: "outdoor", label: "Outdoor Activities", icon: Activity, active: false },
  { id: "music", label: "Musical Events", icon: MusicNote, active: false },
  { id: "food", label: "Food Events", icon: UtensilsCrossed, active: false },
];

interface EventCardProps {
  event: typeof mockEvents[0];
}

function EventCard({ event }: EventCardProps) {
  const [isBookmarked, setIsBookmarked] = useState(false);
  const navigate = useNavigate();

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
      <div className="relative">
        <img
          src={event.image}
          alt={event.title}
          className="w-full h-48 object-cover"
        />
        <button
          onClick={() => setIsBookmarked(!isBookmarked)}
          className="absolute top-3 right-3 w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-md hover:bg-gray-50 transition-colors"
        >
          <Bookmark
            className={`h-5 w-5 ${
              isBookmarked ? "text-primary fill-primary" : "text-gray-600"
            }`}
          />
        </button>
      </div>
      <div className="p-4">
        <div className="flex items-start justify-between mb-2">
          <h3 className="text-lg font-montserrat-semibold text-gray-900 flex-1">
            {event.title}
          </h3>
          <div className="flex items-center gap-1 text-sm text-gray-600 ml-2">
            <MapPin className="h-4 w-4 text-primary" />
            <span>{event.location}</span>
          </div>
        </div>
        <p className="text-sm text-gray-600 mb-3 line-clamp-2">{event.description}</p>
        <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
          <div className="flex items-center gap-1">
            <CalendarIcon className="h-4 w-4 text-primary" />
            <span>{event.date}</span>
          </div>
          <div className="flex items-center gap-1">
            <Clock className="h-4 w-4 text-primary" />
            <span>{event.time}</span>
          </div>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex -space-x-2">
              {event.avatars.map((avatar) => (
                <Avatar key={avatar.id} className="w-6 h-6 border-2 border-white">
                  <AvatarFallback className={`${avatar.color} text-white text-xs`}>
                    {avatar.name}
                  </AvatarFallback>
                </Avatar>
              ))}
            </div>
            <span className="text-xs text-gray-600">+{event.participants}</span>
          </div>
          <Button
            size="sm"
            className="bg-primary hover:bg-primary-700 text-white text-xs px-4 py-2"
            onClick={() => navigate(`/events/${event.id}`)}
          >
            View Details
          </Button>
        </div>
      </div>
    </Card>
  );
}

export function EventsListingSection() {
  const [selectedCategory, setSelectedCategory] = useState("nearby");

  return (
    <section className="relative py-16 md:py-24 px-4 md:px-8 bg-white">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 bg-purple-100 text-purple-700 px-4 py-1.5 rounded-full text-sm font-montserrat-semibold mb-4"
          >
            <Calendar className="h-4 w-4" />
            <span>Events</span>
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-3xl md:text-4xl lg:text-5xl font-montserrat-bold text-gray-900 mb-4"
          >
            Explore Upcoming{" "}
            <span className="text-primary">Events</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg text-gray-600 max-w-2xl mx-auto"
          >
            Browse all verified events and find the ones that matches your schedule and interest
          </motion.p>
        </div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mb-8"
        >
          {/* Main Filters Row */}
          <div className="flex flex-col md:flex-row gap-4 mb-4">
            <div className="relative flex-1">
              <Pin className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <Input
                placeholder="Anywhere in Australia"
                className="pl-10 h-12 bg-gray-50 border-gray-200"
              />
            </div>
            <div className="relative flex-1">
              <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <Input
                placeholder="Any date"
                className="pl-10 h-12 bg-gray-50 border-gray-200"
              />
            </div>
            <div className="flex-1">
              <Select>
                <SelectTrigger className="h-12 bg-gray-50 border-gray-200">
                  <div className="flex items-center gap-2">
                    <span className="text-gray-400">$</span>
                    <SelectValue placeholder="Free events" />
                  </div>
                  <ChevronDown className="h-4 w-4 text-gray-400" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="free">Free events</SelectItem>
                  <SelectItem value="paid">Paid events</SelectItem>
                  <SelectItem value="all">All events</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button
              className="bg-primary hover:bg-primary-700 text-white h-12 px-8 font-montserrat-semibold"
            >
              <Magnifer className="h-5 w-5 mr-2" />
              Search
            </Button>
          </div>

          {/* Category Tags */}
          <div className="flex flex-wrap gap-2 overflow-x-auto pb-2">
            {categories.map((category) => {
              const Icon = category.icon;
              const isActive = selectedCategory === category.id;
              return (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`
                    flex items-center gap-2 px-4 py-2 rounded-full text-sm font-montserrat-semibold transition-colors whitespace-nowrap
                    ${
                      isActive
                        ? "bg-primary/10 text-primary border border-primary/20"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }
                  `}
                >
                  <Icon className="h-4 w-4" />
                  <span>{category.label}</span>
                </button>
              );
            })}
          </div>
        </motion.div>

        {/* Events Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8"
        >
          {mockEvents.map((event) => (
            <EventCard key={event.id} event={event} />
          ))}
        </motion.div>

        {/* See More Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="text-center"
        >
          <Button
            variant="outline"
            className="bg-primary hover:bg-primary-700 text-white border-primary px-8 py-6 text-lg font-montserrat-semibold"
          >
            See More
          </Button>
        </motion.div>
      </div>
    </section>
  );
}
