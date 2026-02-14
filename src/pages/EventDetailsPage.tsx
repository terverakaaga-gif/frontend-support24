import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { LandingLayout } from "@/components/layouts/LandingLayout";
import { Button } from "@/components/ui/button";
import { RegisterEventModal } from "@/components/events/RegisterEventModal";
import { Calendar, ClockCircle, UsersGroupRounded } from "@solar-icons/react";
import { Calendar as CalendarIcon, Clock, MapPin, Users } from "lucide-react";
import { CTASection } from "@/components/CTASection";
import { ContactSection } from "@/components/ContactSection";

// Mock event data - in a real app, this would come from an API
const mockEvent = {
  id: "1",
  title: "Local City Tour, 2025",
  image: "https://images.unsplash.com/photo-1511578314322-379afb476865?w=1200&h=600&fit=crop",
  date: "22nd Nov - 29 Nov, 2025",
  time: "8:00 AM - 12:00 PM",
  location: "Albion Park, AU",
  description: `Join us for an exciting city tour experience where participants explore local attractions, discover hidden gems, and learn about the rich culture and history of our vibrant city. This comprehensive tour is designed to be engaging, informative, and accessible for everyone.

Our expert local guides will lead you through iconic landmarks, share fascinating stories, and provide insights into the city's development and cultural significance. Whether you're a long-time resident or a first-time visitor, this tour offers a fresh perspective on familiar places and introduces you to lesser-known treasures.

The tour is carefully curated to include a mix of historical sites, modern architecture, cultural centers, and local hotspots. We'll take you through bustling markets, quiet neighborhoods, and scenic viewpoints that showcase the city's diverse character.

Participants can look forward to:
- Enjoy a fun and informative tour led by local experts who are passionate about sharing their knowledge
- Visit iconic attractions as well as lesser-known spots that reveal the city's authentic character
- Immerse yourself in the local lifestyle through art, music, markets, and street food
- Connect with fellow participants and build lasting friendships
- Learn about accessibility features and inclusive spaces throughout the city
- Take memorable photos at picturesque locations
- Enjoy refreshments and breaks at carefully selected venues

The tour includes comfortable transportation, refreshments, and all entrance fees. Our guides are trained in accessibility awareness and will ensure that all participants can fully enjoy the experience.`,
};

export default function EventDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);

  return (
    <LandingLayout>
      <div className="bg-white">
        {/* Event Header Section */}
        <section className="pt-32 md:pt-40 px-4 md:px-8 pb-12">
          <div className="max-w-7xl mx-auto">
            {/* Event Title */}
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-montserrat-bold text-gray-900 mb-8">
              {mockEvent.title}
            </h1>

            {/* Hero Image */}
            <div className="relative w-full h-[400px] md:h-[500px] rounded-2xl overflow-hidden mb-8">
              <img
                src={mockEvent.image}
                alt={mockEvent.title}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Event Metadata */}
            <div className="flex flex-wrap items-center gap-6 mb-8 pb-8 border-b border-gray-200">
              <div className="flex items-center gap-2 text-gray-700">
                <Calendar className="h-5 w-5 text-primary" />
                <span className="font-montserrat-semibold">{mockEvent.date}</span>
              </div>
              <div className="flex items-center gap-2 text-gray-700">
                <Clock className="h-5 w-5 text-primary" />
                <span className="font-montserrat-semibold">{mockEvent.time}</span>
              </div>
              <div className="flex items-center gap-2 text-gray-700">
                <Users className="h-5 w-5 text-primary" />
                <MapPin className="h-4 w-4 text-primary" />
                <span className="font-montserrat-semibold">{mockEvent.location}</span>
              </div>
            </div>

            {/* Event Description */}
            <div className="mb-12">
              <h2 className="text-2xl font-montserrat-bold text-gray-900 mb-4">
                Event Description
              </h2>
              <div className="prose max-w-none">
                {mockEvent.description.split("\n\n").map((paragraph, index) => (
                  <p
                    key={index}
                    className="text-gray-700 leading-relaxed mb-4 text-base md:text-lg"
                  >
                    {paragraph}
                  </p>
                ))}
              </div>

              {/* Participants can look forward to */}
              <div className="mt-8">
                <h3 className="text-xl font-montserrat-semibold text-gray-900 mb-4">
                  Participants can look forward to:
                </h3>
                <ul className="space-y-3 list-disc list-inside text-gray-700">
                  <li className="text-base md:text-lg">
                    Enjoy a fun and informative tour led by local experts who are passionate about sharing their knowledge
                  </li>
                  <li className="text-base md:text-lg">
                    Visit iconic attractions as well as lesser-known spots that reveal the city's authentic character
                  </li>
                  <li className="text-base md:text-lg">
                    Immerse yourself in the local lifestyle through art, music, markets, and street food
                  </li>
                  <li className="text-base md:text-lg">
                    Connect with fellow participants and build lasting friendships
                  </li>
                  <li className="text-base md:text-lg">
                    Learn about accessibility features and inclusive spaces throughout the city
                  </li>
                  <li className="text-base md:text-lg">
                    Take memorable photos at picturesque locations
                  </li>
                  <li className="text-base md:text-lg">
                    Enjoy refreshments and breaks at carefully selected venues
                  </li>
                </ul>
              </div>
            </div>

            {/* Register Button */}
            <div className="text-left mb-12">
              <Button
                onClick={() => setIsRegisterModalOpen(true)}
                className="bg-primary hover:bg-primary-700 text-white px-12 py-6 text-lg font-montserrat-semibold rounded-xl"
                size="lg"
              >
                Register
              </Button>
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <ContactSection />

        {/* CTA Section */}
        <CTASection />
      </div>

      {/* Register Modal */}
      <RegisterEventModal
        open={isRegisterModalOpen}
        onOpenChange={setIsRegisterModalOpen}
        eventTitle={mockEvent.title}
      />
    </LandingLayout>
  );
}
