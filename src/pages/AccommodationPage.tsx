import React from "react";
import { LandingLayout } from "@/components/layouts/LandingLayout";
import { AccommodationHeroSection } from "@/components/accommodation/AccommodationHeroSection";
import { AccommodationListingSection } from "@/components/accommodation/AccommodationListingSection";
import { CTASection } from "@/components/CTASection";
import { ContactSection } from "@/components/ContactSection";

export default function AccommodationPage() {
  return (
    <LandingLayout>
      <AccommodationHeroSection />
      <AccommodationListingSection />
      {/* Contact Section */}
      <ContactSection />
      {/* CTA Section */}
      <CTASection />
    </LandingLayout>
  );
}
