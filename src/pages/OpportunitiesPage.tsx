import React from "react";
import { LandingLayout } from "@/components/layouts/LandingLayout";
import { OpportunitiesHeroSection } from "@/components/opportunities/OpportunitiesHeroSection";
import { OpportunitiesListingSection } from "@/components/opportunities/OpportunitiesListingSection";
import { CTASection } from "@/components/CTASection";
import { ContactSection } from "@/components/ContactSection";

export default function OpportunitiesPage() {
  return (
    <LandingLayout>
      <OpportunitiesHeroSection />
      <OpportunitiesListingSection />
      {/* Contact Section */}
      <ContactSection />
      {/* CTA Section */}
      <CTASection />
    </LandingLayout>
  );
}
