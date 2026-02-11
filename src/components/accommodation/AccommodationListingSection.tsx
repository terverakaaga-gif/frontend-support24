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
import {
  Calendar,
  Pin,
  ClockCircle,
  Magnifer,
  Bookmark,
  Home,
  DollarMinimalistic,
} from "@solar-icons/react";
import { MapPin, Calendar as CalendarIcon, ChevronDown, Users, Bath, Sofa, Bed } from "lucide-react";

// Mock data for accommodations
const mockAccommodations = [
  {
    id: 1,
    title: "Independent Living Home",
    location: "Albion Park, AU",
    distance: "1.4 km from location",
    price: 500,
    priceUnit: "week",
    status: "Available",
    bedrooms: 1,
    guests: 2,
    bathrooms: 1,
    sofas: 1,
    postedDate: "19th Nov, 2025",
    image: "https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=400&h=300&fit=crop",
  },
  {
    id: 2,
    title: "Independent Living Home",
    location: "Sydney, AU",
    distance: "2.1 km from location",
    price: 450,
    priceUnit: "week",
    status: "Available",
    bedrooms: 2,
    guests: 4,
    bathrooms: 1,
    sofas: 2,
    postedDate: "18th Nov, 2025",
    image: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=400&h=300&fit=crop",
  },
  {
    id: 3,
    title: "Independent Living Home",
    location: "Melbourne, AU",
    distance: "3.5 km from location",
    price: 600,
    priceUnit: "week",
    status: "Available",
    bedrooms: 3,
    guests: 6,
    bathrooms: 2,
    sofas: 2,
    postedDate: "17th Nov, 2025",
    image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=400&h=300&fit=crop",
  },
  {
    id: 4,
    title: "Independent Living Home",
    location: "Brisbane, AU",
    distance: "0.8 km from location",
    price: 480,
    priceUnit: "week",
    status: "Available",
    bedrooms: 2,
    guests: 3,
    bathrooms: 1,
    sofas: 1,
    postedDate: "16th Nov, 2025",
    image: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=400&h=300&fit=crop",
  },
  {
    id: 5,
    title: "Independent Living Home",
    location: "Perth, AU",
    distance: "5.2 km from location",
    price: 550,
    priceUnit: "week",
    status: "Available",
    bedrooms: 2,
    guests: 4,
    bathrooms: 2,
    sofas: 2,
    postedDate: "15th Nov, 2025",
    image: "https://images.unsplash.com/photo-1600566753190-17f0baa2a74c?w=400&h=300&fit=crop",
  },
  {
    id: 6,
    title: "Independent Living Home",
    location: "Adelaide, AU",
    distance: "2.7 km from location",
    price: 420,
    priceUnit: "week",
    status: "Available",
    bedrooms: 1,
    guests: 2,
    bathrooms: 1,
    sofas: 1,
    postedDate: "14th Nov, 2025",
    image: "https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=400&h=300&fit=crop",
  },
];

interface AccommodationCardProps {
  accommodation: typeof mockAccommodations[0];
}

function AccommodationCard({ accommodation }: AccommodationCardProps) {
  const [isBookmarked, setIsBookmarked] = useState(false);
  const navigate = useNavigate();

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
      <div className="relative">
        <img
          src={accommodation.image}
          alt={accommodation.title}
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
        <h3 className="text-lg font-montserrat-semibold text-gray-900 mb-2">
          {accommodation.title}
        </h3>
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm text-primary font-montserrat-semibold">
            {accommodation.status}
          </span>
          <span className="text-lg font-montserrat-bold text-gray-900">
            ${accommodation.price}/{accommodation.priceUnit}
          </span>
        </div>
        <div className="flex items-center gap-1 text-sm text-gray-600 mb-3">
          <MapPin className="h-4 w-4 text-primary" />
          <span>{accommodation.location}</span>
          <span className="mx-1">•</span>
          <span>{accommodation.distance}</span>
        </div>
        <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
          <div className="flex items-center gap-1">
            <Bed className="h-4 w-4 text-primary" />
            <span>{accommodation.bedrooms} Bed</span>
          </div>
          <div className="flex items-center gap-1">
            <Users className="h-4 w-4 text-primary" />
            <span>{accommodation.guests} Guests</span>
          </div>
          <div className="flex items-center gap-1">
            <Bath className="h-4 w-4 text-primary" />
            <span>{accommodation.bathrooms} Bathtub</span>
          </div>
          <div className="flex items-center gap-1">
            <Sofa className="h-4 w-4 text-primary" />
            <span>{accommodation.sofas} Sofa</span>
          </div>
        </div>
        <div className="text-xs text-gray-500 mb-3">
          Posted on {accommodation.postedDate}
        </div>
        <Button
          size="sm"
          className="w-full bg-primary hover:bg-primary-700 text-white text-sm px-4 py-2"
          onClick={() => navigate(`/accommodations/${accommodation.id}`)}
        >
          View Details
        </Button>
      </div>
    </Card>
  );
}

export function AccommodationListingSection() {
  return (
    <section id="accommodation-listings" className="relative py-16 md:py-24 px-4 md:px-8 bg-white">
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
            <span>Accommodation</span>
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-3xl md:text-4xl lg:text-5xl font-montserrat-bold text-gray-900 mb-4"
          >
            Explore Affordable{" "}
            <span className="text-primary">Accommodation</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg text-gray-600 max-w-2xl mx-auto"
          >
            Find comfortable and verified housing options that fit your budget and lifestyle
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
          <div className="flex flex-col md:flex-row gap-4">
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
                placeholder="Any date posted"
                className="pl-10 h-12 bg-gray-50 border-gray-200"
              />
            </div>
            <div className="flex-1">
              <Select>
                <SelectTrigger className="h-12 bg-gray-50 border-gray-200">
                  <div className="flex items-center gap-2">
                    <DollarMinimalistic className="h-5 w-5 text-gray-400" />
                    <SelectValue placeholder="Price" />
                  </div>
                  <ChevronDown className="h-4 w-4 text-gray-400" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Prices</SelectItem>
                  <SelectItem value="0-300">$0 - $300/week</SelectItem>
                  <SelectItem value="300-500">$300 - $500/week</SelectItem>
                  <SelectItem value="500-700">$500 - $700/week</SelectItem>
                  <SelectItem value="700+">$700+/week</SelectItem>
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
        </motion.div>

        {/* Accommodations Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8"
        >
          {mockAccommodations.map((accommodation) => (
            <AccommodationCard key={accommodation.id} accommodation={accommodation} />
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
