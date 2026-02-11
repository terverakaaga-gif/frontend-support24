// import React from "react";
import { LandingLayout } from "@/components/layouts/LandingLayout";
import { SupportProviderHeroSection } from "@/components/support-provider/SupportProviderHeroSection";
import { SupportProviderWhoSection } from "@/components/support-provider/SupportProviderWhoSection";
import { SupportProviderProblemSection } from "@/components/support-provider/SupportProviderProblemSection";
import { SupportProviderComparisonSection } from "@/components/support-provider/SupportProviderComparisonSection";
import { SupportProviderAgencyExitSection } from "@/components/support-provider/SupportProviderAgencyExitSection";
import { SupportProviderLegalClaritySection } from "@/components/support-provider/SupportProviderLegalClaritySection";
import { SupportProviderCostReductionSection } from "@/components/support-provider/SupportProviderCostReductionSection";
import { SupportProviderPricingSection } from "@/components/support-provider/SupportProviderPricingSection";
// import { CTASection } from "@/components/CTASection";
// import { ContactSection } from "@/components/ContactSection";
import { FAQSection } from "@/components/FAQSection";
import { SupportProviderThreeOptionsSection } from "@/components/support-provider/SupportProviderThreeOptionsSection";

export default function SupportProviderPage() {
  return (
    <LandingLayout>
      <SupportProviderHeroSection />
      <SupportProviderWhoSection />
      <SupportProviderProblemSection />
      <SupportProviderComparisonSection />
      <SupportProviderAgencyExitSection />
      <SupportProviderLegalClaritySection />
      <SupportProviderCostReductionSection />
      <SupportProviderPricingSection />
      <FAQSection />
      <SupportProviderThreeOptionsSection />

      {/* <CTASection />
      <ContactSection /> */}
    </LandingLayout>
  );
}
