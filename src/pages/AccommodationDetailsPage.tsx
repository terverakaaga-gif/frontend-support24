import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { LandingLayout } from "@/components/layouts/LandingLayout";
import { Button } from "@/components/ui/button";
import { EnquireAccommodationModal } from "@/components/accommodation/EnquireAccommodationModal";
import { Home, DollarMinimalistic } from "@solar-icons/react";
import { MapPin, Bed, Users, Bath, Sofa, ChevronLeft, ChevronRight } from "lucide-react";
import { CTASection } from "@/components/CTASection";
import { ContactSection } from "@/components/ContactSection";

// Mock accommodation data - in a real app, this would come from an API
const mockAccommodation = {
  id: "1",
  title: "Independent Living Home",
  images: [
    "https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=1200&h=600&fit=crop",
    "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1200&h=600&fit=crop",
    "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200&h=600&fit=crop",
  ],
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
  description: `Experience the freedom of modern living in this beautifully designed independent living home. This property offers a perfect blend of comfort, accessibility, and style, making it an ideal choice for participants seeking a supportive yet independent lifestyle.

The home features spacious living areas with natural light streaming through large windows, creating a warm and inviting atmosphere. The open-plan design seamlessly connects the living, dining, and kitchen areas, perfect for both daily living and entertaining guests.

Each bedroom is thoughtfully designed with built-in storage and easy access features. The modern kitchen is fully equipped with quality appliances and ample workspace, making meal preparation a joy. The bathroom includes accessibility features while maintaining a contemporary aesthetic.

The property is situated in a quiet, well-maintained neighborhood with easy access to local amenities, public transport, and community services. The location offers the perfect balance between peaceful living and convenient access to everything you need.`,
  features: [
    "Fully Detached Structure",
    "Spacious Living Area",
    "Modern Kitchen",
    "En-suite Bedrooms",
    "Smart Home Features",
    "Private Garden/Yard",
    "Dedicated Parking Space",
    "High-Speed Internet Ready",
    "24/7 Security System",
    "Energy-Efficient Design",
  ],
};

export default function AccommodationDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const [isEnquireModalOpen, setIsEnquireModalOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % mockAccommodation.images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + mockAccommodation.images.length) % mockAccommodation.images.length);
  };

  return (
    <LandingLayout>
      <div className="bg-white">
        {/* Accommodation Header Section */}
        <section className="pt-32 md:pt-40 px-4 md:px-8 pb-12">
          <div className="max-w-5xl mx-auto">
            {/* Accommodation Title */}
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-montserrat-bold text-gray-900 mb-8">
              {mockAccommodation.title}
            </h1>

            {/* Image Carousel */}
            <div className="relative w-full h-[400px] md:h-[500px] rounded-2xl overflow-hidden mb-8">
              <img
                src={mockAccommodation.images[currentImageIndex]}
                alt={mockAccommodation.title}
                className="w-full h-full object-cover"
              />
              {/* Navigation Arrows */}
              {mockAccommodation.images.length > 1 && (
                <>
                  <button
                    onClick={prevImage}
                    className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-2 shadow-lg transition-colors"
                  >
                    <ChevronLeft className="h-6 w-6 text-gray-900" />
                  </button>
                  <button
                    onClick={nextImage}
                    className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-2 shadow-lg transition-colors"
                  >
                    <ChevronRight className="h-6 w-6 text-gray-900" />
                  </button>
                </>
              )}
              {/* Dots Indicator */}
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                {mockAccommodation.images.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`h-2 rounded-full transition-all ${
                      index === currentImageIndex
                        ? "w-8 bg-white"
                        : "w-2 bg-white/50"
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* Accommodation Metadata */}
            <div className="flex flex-wrap items-center gap-6 mb-6 pb-6 border-b border-gray-200">
              <div className="flex items-center gap-2 text-gray-700">
                <Bed className="h-5 w-5 text-primary" />
                <span className="font-montserrat-semibold">{mockAccommodation.bedrooms} Bed</span>
              </div>
              <div className="flex items-center gap-2 text-gray-700">
                <Users className="h-5 w-5 text-primary" />
                <span className="font-montserrat-semibold">{mockAccommodation.guests} Guests</span>
              </div>
              <div className="flex items-center gap-2 text-gray-700">
                <Bath className="h-5 w-5 text-primary" />
                <span className="font-montserrat-semibold">{mockAccommodation.bathrooms} Bathtub</span>
              </div>
              <div className="flex items-center gap-2 text-gray-700">
                <Sofa className="h-5 w-5 text-primary" />
                <span className="font-montserrat-semibold">{mockAccommodation.sofas} Sofa</span>
              </div>
              <div className="flex items-center gap-2 text-gray-700 ml-auto">
                <MapPin className="h-4 w-4 text-primary" />
                <span className="font-montserrat-semibold">{mockAccommodation.location}</span>
                <span className="mx-1">•</span>
                <span className="text-sm">{mockAccommodation.distance}</span>
              </div>
            </div>

            {/* Price and Status */}
            <div className="flex items-center justify-between mb-6 pb-6 border-b border-gray-200">
              <div>
                <span className="text-sm text-primary font-montserrat-semibold mr-4">
                  {mockAccommodation.status}
                </span>
                <span className="text-2xl font-montserrat-bold text-gray-900">
                  ${mockAccommodation.price}/{mockAccommodation.priceUnit}
                </span>
              </div>
              <div className="text-sm text-gray-600">
                Posted on {mockAccommodation.postedDate}
              </div>
            </div>

            {/* Accommodation Description */}
            <div className="mb-8">
              <h2 className="text-2xl font-montserrat-bold text-gray-900 mb-4">
                Accommodation Description
              </h2>
              <div className="prose max-w-none">
                {mockAccommodation.description.split("\n\n").map((paragraph, index) => (
                  <p
                    key={index}
                    className="text-gray-700 leading-relaxed mb-4 text-base md:text-lg"
                  >
                    {paragraph}
                  </p>
                ))}
              </div>
              <button className="text-primary hover:underline font-montserrat-semibold mt-2">
                Read More....
              </button>
            </div>

            {/* Unique Features */}
            <div className="mb-12">
              <h3 className="text-xl font-montserrat-semibold text-gray-900 mb-4">
                Unique Features
              </h3>
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {mockAccommodation.features.map((feature, index) => (
                  <li
                    key={index}
                    className="flex items-center gap-2 text-gray-700 text-base md:text-lg"
                  >
                    <span className="w-2 h-2 bg-primary rounded-full" />
                    {feature}
                  </li>
                ))}
              </ul>
            </div>

            {/* Enquire Button */}
            <div className="text-center mb-12">
              <Button
                onClick={() => setIsEnquireModalOpen(true)}
                className="bg-primary hover:bg-primary-700 text-white px-12 py-6 text-lg font-montserrat-semibold rounded-xl"
                size="lg"
              >
                Enquire
              </Button>
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <ContactSection />

        {/* CTA Section */}
        <CTASection />
      </div>

      {/* Enquire Modal */}
      <EnquireAccommodationModal
        open={isEnquireModalOpen}
        onOpenChange={setIsEnquireModalOpen}
        accommodationTitle={mockAccommodation.title}
      />
    </LandingLayout>
  );
}
