import React from "react";
import { LandingLayout } from "@/components/layouts/LandingLayout";
import { EventsHeroSection } from "@/components/events/EventsHeroSection";
import { EventsListingSection } from "@/components/events/EventsListingSection";
import { CTASection } from "@/components/CTASection";
import { ContactSection } from "@/components/ContactSection";

export default function EventsPage() {
  return (
    <LandingLayout>
      <EventsHeroSection />
      <EventsListingSection />
       {/* contact section */}
       <ContactSection />
      {/* CTA Section */}
      <CTASection />  
    </LandingLayout>
  );
}
