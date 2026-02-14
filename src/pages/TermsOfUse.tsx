import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { LandingLayout } from "@/components/layouts/LandingLayout";
import { FileText } from "@solar-icons/react";

export default function TermsOfUse() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5 },
  };

  return (
    <LandingLayout>
      <div className="min-h-screen mt-20 py-20 px-4 sm:px-6 lg:px-8">
        <motion.div
          className="max-w-7xl mx-auto"
          initial="initial"
          animate="animate"
          variants={fadeInUp}
        >
          {/* Header */}
          <div className="mb-12 text-center">
            <div className="flex items-center justify-center gap-3 mb-4">
              <FileText className="w-10 h-10 text-primary" />
              <h1 className="text-4xl md:text-5xl font-montserrat-bold text-white">
                Support24 Terms of Use
              </h1>
            </div>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 text-gray-400">
              <p className="text-sm">Version: 2.0</p>
              <span className="hidden sm:inline">•</span>
              <p className="text-sm">Effective Date: 10 November 2025</p>
              <span className="hidden sm:inline">•</span>
              <p className="text-sm">Last Updated: 10 November 2025</p>
            </div>
          </div>

          {/* Content */}
          <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 md:p-12 border border-white/10 shadow-2xl">
            <div className="prose prose-invert prose-lg max-w-none">
              {/* Important Information */}
              <section className="mb-10">
                <div className="bg-primary/10 border border-primary/30 rounded-lg p-6 mb-6">
                  <h2 className="text-2xl md:text-3xl font-montserrat-bold text-white mb-4">
                    Important Information
                  </h2>
                  <p className="text-gray-300 leading-relaxed mb-4">
                    Support24 operates a digital marketplace connecting NDIS
                    participants with qualified support workers, disability
                    service providers, and support coordinators. These Terms of
                    Use govern your access to and use of the Support24 platform,
                    website, and mobile applications (together, the "Platform").
                    Please read these Terms carefully before using Support24.
                  </p>
                  <h3 className="text-xl font-montserrat-semibold text-white mb-3 mt-4">
                    Key Points You Should Know:
                  </h3>
                  <ul className="list-disc list-inside text-gray-300 space-y-2">
                    <li>
                      By creating an account or using Support24, you agree to be
                      bound by these Terms of Use, our Platform Terms, and our
                      Privacy Policy
                    </li>
                    <li>
                      Support24 is a technology platform that facilitates
                      connections between users. We are not an employment agency,
                      labor hire company, or service provider
                    </li>
                    <li>
                      Users are responsible for verifying the suitability of
                      others before engaging them
                    </li>
                    <li>
                      Support24 is currently free to use, but we reserve the
                      right to introduce fees for certain features in the future
                    </li>
                    <li>
                      If you do not agree to these Terms, you must not access or
                      use the Platform
                    </li>
                  </ul>
                </div>
              </section>

              {/* 1. Definitions */}
              <section className="mb-10">
                <h2 className="text-2xl md:text-3xl font-montserrat-bold text-white mb-4">
                  1. Definitions
                </h2>
                <div className="space-y-4">
                  <p className="text-gray-300 leading-relaxed mb-4">
                    In these Terms of Use, the following terms have specific
                    meanings:
                  </p>
                  <ul className="list-disc list-inside text-gray-300 space-y-3">
                    <li>
                      <strong className="text-white">"Support24":</strong>{" "}
                      Support24  (ABN 19673683817), the company that
                      operates the Platform
                    </li>
                    <li>
                      <strong className="text-white">"Platform":</strong> The
                      Support24 website, mobile applications, and all associated
                      services
                    </li>
                    <li>
                      <strong className="text-white">"Account":</strong> Your
                      registered user profile on Support24
                    </li>
                    <li>
                      <strong className="text-white">"Participant":</strong> An
                      NDIS participant or their authorized representative seeking
                      support
                    </li>
                    <li>
                      <strong className="text-white">"Support Worker":</strong>{" "}
                      An individual registered to offer disability support
                      services
                    </li>
                    <li>
                      <strong className="text-white">"Provider":</strong> A
                      registered NDIS service provider organization
                    </li>
                    <li>
                      <strong className="text-white">
                        "Support Coordinator":
                      </strong>{" "}
                      An NDIS support coordinator or plan manager
                    </li>
                    <li>
                      <strong className="text-white">"Service Agreement":</strong>{" "}
                      The contractual arrangement between users governing support
                      services
                    </li>
                  </ul>
                </div>
              </section>

              {/* 2. Acceptance of Terms */}
              <section className="mb-10">
                <h2 className="text-2xl md:text-3xl font-montserrat-bold text-white mb-4">
                  2. Acceptance of Terms
                </h2>
                <p className="text-gray-300 leading-relaxed mb-4">
                  By accessing or using Support24, creating an Account, or
                  clicking "I Agree" during registration, you agree to be bound
                  by these Terms of Use, our Platform Terms, our Privacy Policy,
                  and any additional terms that apply to specific features you
                  use.
                </p>
                <p className="text-gray-300 leading-relaxed mb-4">
                  If you are accessing Support24 on behalf of an organization,
                  you represent that you have authority to bind that organization
                  to these Terms.
                </p>
                <div className="bg-yellow-900/20 border border-yellow-500/30 rounded-lg p-4 mb-4">
                  <h3 className="text-lg font-montserrat-semibold text-white mb-2">
                    Order of Precedence
                  </h3>
                  <p className="text-gray-300 mb-2">
                    If there is any conflict between different terms documents:
                  </p>
                  <ol className="list-decimal list-inside text-gray-300 space-y-1">
                    <li>These Terms of Use take precedence</li>
                    <li>User-type-specific terms apply next</li>
                    <li>Platform Terms apply for general guidelines</li>
                    <li>Privacy Policy applies for data handling</li>
                  </ol>
                </div>
                <p className="text-gray-300 leading-relaxed mb-4">
                  You must be at least 18 years old to create an Account. If you
                  are under 18, your parent, guardian, or authorized
                  representative must create and manage the Account on your
                  behalf.
                </p>
              </section>

              {/* 3. Account Registration and Eligibility */}
              <section className="mb-10">
                <h2 className="text-2xl md:text-3xl font-montserrat-bold text-white mb-4">
                  3. Account Registration and Eligibility
                </h2>
                <p className="text-gray-300 leading-relaxed mb-4">
                  To access most Platform features, you must register for an
                  Account. Registration requires:
                </p>
                <ul className="list-disc list-inside text-gray-300 space-y-2 mb-4">
                  <li>Providing accurate and complete information</li>
                  <li>Creating secure login credentials</li>
                  <li>Verifying your identity through our verification process</li>
                  <li>Agreeing to these Terms and all associated policies</li>
                </ul>

                <h3 className="text-xl font-montserrat-semibold text-white mb-3 mt-6">
                  Account Security
                </h3>
                <p className="text-gray-300 leading-relaxed mb-4">
                  You are responsible for maintaining the security of your
                  Account:
                </p>
                <ul className="list-disc list-inside text-gray-300 space-y-2 mb-4">
                  <li>Choose a strong, unique password</li>
                  <li>Never share your login credentials</li>
                  <li>Log out when using shared or public devices</li>
                  <li>
                    Notify us immediately of any suspected unauthorized access
                  </li>
                  <li>
                    You are responsible for all activity under your Account
                  </li>
                </ul>

                <h3 className="text-xl font-montserrat-semibold text-white mb-3 mt-6">
                  Eligibility Requirements
                </h3>
                <div className="space-y-4">
                  <div>
                    <h4 className="text-lg font-montserrat-semibold text-white mb-2">
                      Participants
                    </h4>
                    <p className="text-gray-300">
                      Must be NDIS participants or authorized representatives
                      with legal authority to act on behalf of the participant
                    </p>
                  </div>
                  <div>
                    <h4 className="text-lg font-montserrat-semibold text-white mb-2">
                      Support Workers
                    </h4>
                    <ul className="list-disc list-inside text-gray-300 space-y-1">
                      <li>Must be at least 18 years old</li>
                      <li>Legally authorized to work in Australia</li>
                      <li>Hold valid NDIS Worker Screening Check</li>
                      <li>Possess required qualifications for services offered</li>
                      <li>Maintain appropriate insurance coverage</li>
                      <li>Comply with NDIS Code of Conduct</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="text-lg font-montserrat-semibold text-white mb-2">
                      Providers
                    </h4>
                    <ul className="list-disc list-inside text-gray-300 space-y-1">
                      <li>Must be registered NDIS providers</li>
                      <li>Hold appropriate registration groups</li>
                      <li>
                        Maintain required insurance (public liability,
                        professional indemnity, workers compensation)
                      </li>
                      <li>Comply with NDIS Commission requirements</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="text-lg font-montserrat-semibold text-white mb-2">
                      Support Coordinators
                    </h4>
                    <ul className="list-disc list-inside text-gray-300 space-y-1">
                      <li>
                        Hold relevant qualifications in support coordination or
                        related fields
                      </li>
                      <li>
                        Maintain professional registration if required for your
                        profession
                      </li>
                      <li>Comply with NDIS requirements</li>
                    </ul>
                  </div>
                </div>
              </section>

              {/* 4. Verification Requirements */}
              <section className="mb-10">
                <h2 className="text-2xl md:text-3xl font-montserrat-bold text-white mb-4">
                  4. Verification Requirements
                </h2>
                <p className="text-gray-300 leading-relaxed mb-4">
                  All users must complete verification before gaining full access
                  to Platform features. Verification is essential for maintaining
                  safety and trust.
                </p>

                <h3 className="text-xl font-montserrat-semibold text-white mb-3 mt-6">
                  Identity Verification (All Users)
                </h3>
                <ul className="list-disc list-inside text-gray-300 space-y-2 mb-4">
                  <li>Government-issued ID (driver's license, passport)</li>
                  <li>
                    Verification through Australian Government's Document
                    Verification Service
                  </li>
                  <li>Confirmation that registration details match ID</li>
                </ul>

                <h3 className="text-xl font-montserrat-semibold text-white mb-3 mt-6">
                  Support Worker Verification
                </h3>
                <ul className="list-disc list-inside text-gray-300 space-y-2 mb-4">
                  <li>
                    NDIS Worker Screening Check (verified with screening unit)
                  </li>
                  <li>National police check (within last 12 months)</li>
                  <li>Working with Children Checks (where required)</li>
                  <li>Professional qualifications and certifications</li>
                  <li>Professional references from previous employers</li>
                  <li>Proof of insurance coverage</li>
                </ul>

                <h3 className="text-xl font-montserrat-semibold text-white mb-3 mt-6">
                  Provider Verification
                </h3>
                <ul className="list-disc list-inside text-gray-300 space-y-2 mb-4">
                  <li>NDIS registration verification with NDIS Commission</li>
                  <li>Organizational identity (ACN/ABN)</li>
                  <li>Authority verification for account representatives</li>
                  <li>Insurance coverage confirmation</li>
                </ul>

                <div className="bg-primary-900/20 border border-primary-500/30 rounded-lg p-4 mb-4">
                  <h3 className="text-lg font-montserrat-semibold text-white mb-2">
                    Verification Timeline
                  </h3>
                  <p className="text-gray-300">
                    Verification typically takes 5-10 business days after you
                    submit all required documents. You'll have limited Platform
                    access until verification is complete.
                  </p>
                </div>

                <p className="text-gray-300 leading-relaxed">
                  <strong className="text-white">Important:</strong>{" "}
                  Verification confirms baseline requirements but does not
                  constitute endorsement or guarantee of quality or suitability.
                  Users must conduct independent due diligence.
                </p>
              </section>

              {/* 5. Platform Use and Conduct Standards */}
              <section className="mb-10">
                <h2 className="text-2xl md:text-3xl font-montserrat-bold text-white mb-4">
                  5. Platform Use and Conduct Standards
                </h2>
                <p className="text-gray-300 leading-relaxed mb-4">
                  Support24 provides a marketplace for connecting NDIS
                  Participants with Support Workers, Providers, and Support
                  Coordinators. You may use the Platform only for lawful purposes
                  related to disability support services.
                </p>

                <h3 className="text-xl font-montserrat-semibold text-white mb-3 mt-6">
                  Required Conduct
                </h3>
                <ul className="list-disc list-inside text-gray-300 space-y-2 mb-4">
                  <li>
                    <strong className="text-white">Be honest:</strong> Represent
                    yourself, services, qualifications, and needs truthfully
                  </li>
                  <li>
                    <strong className="text-white">Be professional:</strong>{" "}
                    Honor commitments and maintain appropriate boundaries
                  </li>
                  <li>
                    <strong className="text-white">Be respectful:</strong> Treat
                    all users with courtesy regardless of background
                  </li>
                  <li>
                    <strong className="text-white">Prioritize safety:</strong>{" "}
                    Report concerns immediately and conduct services safely
                  </li>
                </ul>

                <h3 className="text-xl font-montserrat-semibold text-white mb-3 mt-6">
                  Prohibited Conduct
                </h3>
                <ul className="list-disc list-inside text-gray-300 space-y-2 mb-4">
                  <li>
                    <strong className="text-white">Harassment:</strong> Any
                    behavior that intimidates, threatens, or creates a hostile
                    environment
                  </li>
                  <li>
                    <strong className="text-white">Discrimination:</strong> Based
                    on disability, age, gender, race, religion, sexuality, or
                    other protected attributes
                  </li>
                  <li>
                    <strong className="text-white">Impersonation:</strong> Fake
                    identities, stolen credentials, or misrepresentation
                  </li>
                  <li>
                    <strong className="text-white">False content:</strong>{" "}
                    Misleading claims about qualifications, services, or
                    experiences
                  </li>
                  <li>
                    <strong className="text-white">
                      Platform interference:
                    </strong>{" "}
                    Circumventing security, unauthorized access, or data scraping
                  </li>
                  <li>
                    <strong className="text-white">Spam:</strong> Unsolicited
                    advertising or unrelated promotions
                  </li>
                  <li>
                    <strong className="text-white">
                      Unqualified services:
                    </strong>{" "}
                    Claiming to provide services you're not qualified for
                  </li>
                </ul>

                <div className="bg-red-900/20 border border-red-500/30 rounded-lg p-4">
                  <h3 className="text-lg font-montserrat-semibold text-white mb-2">
                    Consequences
                  </h3>
                  <p className="text-gray-300">
                    Violations may result in warnings, account suspension,
                    termination, reporting to authorities, or legal action.
                  </p>
                </div>
              </section>

              {/* 6. Service Arrangements and Agreements */}
              <section className="mb-10">
                <h2 className="text-2xl md:text-3xl font-montserrat-bold text-white mb-4">
                  6. Service Arrangements and Agreements
                </h2>
                <p className="text-gray-300 leading-relaxed mb-4">
                  Support24 facilitates connections between users, but all
                  service arrangements are made directly between users. We are
                  not a party to Service Agreements and do not oversee, control,
                  or guarantee the services provided.
                </p>

                <h3 className="text-xl font-montserrat-semibold text-white mb-3 mt-6">
                  Service Agreement Requirements
                </h3>
                <p className="text-gray-300 leading-relaxed mb-4">
                  We strongly recommend all service arrangements be documented in
                  writing with clear terms covering:
                </p>
                <ul className="list-disc list-inside text-gray-300 space-y-2 mb-4">
                  <li>Scope and nature of services</li>
                  <li>Schedule (days, times, duration)</li>
                  <li>Rates and payment terms</li>
                  <li>Cancellation and termination provisions</li>
                  <li>Specific requirements or considerations</li>
                </ul>

                <div className="bg-primary/10 border border-primary/30 rounded-lg p-4 mb-4">
                  <h3 className="text-lg font-montserrat-semibold text-white mb-2">
                    Minimum Rate Requirement
                  </h3>
                  <p className="text-gray-300">
                    Hourly rates for active service time must not be less than{" "}
                    <strong className="text-white">$39 per hour</strong>. This
                    ensures fair compensation and aligns with NDIS pricing.
                  </p>
                </div>

                <h3 className="text-xl font-montserrat-semibold text-white mb-3 mt-6">
                  Regulatory Requirements
                </h3>
                <p className="text-gray-300 leading-relaxed mb-4">
                  All Service Agreements must:
                </p>
                <ul className="list-disc list-inside text-gray-300 space-y-2">
                  <li>Comply with Australian law and NDIS Practice Standards</li>
                  <li>
                    Not include terms that are illegal, unconscionable, or unfair
                  </li>
                  <li>Respect Participants' rights to choice and control</li>
                  <li>Include appropriate safeguards for safety and dignity</li>
                  <li>
                    Comply with employment or contractor laws where applicable
                  </li>
                </ul>
              </section>

              {/* 7. Platform Features and Limitations */}
              <section className="mb-10">
                <h2 className="text-2xl md:text-3xl font-montserrat-bold text-white mb-4">
                  7. Platform Features and Limitations
                </h2>

                <h3 className="text-xl font-montserrat-semibold text-white mb-3 mt-6">
                  Platform Features
                </h3>
                <ul className="list-disc list-inside text-gray-300 space-y-2 mb-4">
                  <li>
                    <strong className="text-white">
                      Search and matching:
                    </strong>{" "}
                    Find users based on location, services, qualifications, and
                    ratings
                  </li>
                  <li>
                    <strong className="text-white">Profile creation:</strong>{" "}
                    Showcase services, qualifications, and experience
                  </li>
                  <li>
                    <strong className="text-white">Secure messaging:</strong>{" "}
                    Communicate privately to arrange services
                  </li>
                  <li>
                    <strong className="text-white">Booking management:</strong>{" "}
                    Coordinate service schedules
                  </li>
                  <li>
                    <strong className="text-white">
                      RosterRelay integration:
                    </strong>{" "}
                    Automated workforce management for Providers
                  </li>
                  <li>
                    <strong className="text-white">Reviews and ratings:</strong>{" "}
                    Provide and receive feedback
                  </li>
                  <li>
                    <strong className="text-white">Incident reporting:</strong>{" "}
                    Report safety concerns
                  </li>
                </ul>

                <h3 className="text-xl font-montserrat-semibold text-white mb-3 mt-6">
                  Our Role and Limitations
                </h3>
                <div className="bg-yellow-900/20 border border-yellow-500/30 rounded-lg p-4 mb-4">
                  <p className="text-gray-300 mb-2">
                    <strong className="text-white">
                      Support24 is a facilitator, not a service provider.
                    </strong>
                  </p>
                  <p className="text-gray-300">We do not:</p>
                  <ul className="list-disc list-inside text-gray-300 space-y-1 mt-2">
                    <li>Employ or contract Support Workers</li>
                    <li>Provide disability support services</li>
                    <li>Supervise or control service delivery</li>
                    <li>Guarantee service quality or outcomes</li>
                    <li>Form employment relationships with users</li>
                    <li>Provide health or medical advice</li>
                    <li>Guarantee Platform availability 24/7</li>
                  </ul>
                </div>
              </section>

              {/* 8. Partnership with Framer Health */}
              <section className="mb-10">
                <h2 className="text-2xl md:text-3xl font-montserrat-bold text-white mb-4">
                  8. Partnership with Framer Health
                </h2>
                <p className="text-gray-300 leading-relaxed mb-4">
                  Support24 partners with Framer Health, an allied health
                  services organization, to provide Participants with access to
                  complementary healthcare services when appropriate.
                </p>
                <div className="bg-primary-900/20 border border-primary-500/30 rounded-lg p-4 mb-4">
                  <p className="text-gray-300">
                    <strong className="text-white">Important:</strong> The Framer
                    Health partnership is optional. Participants are never
                    required to use Framer Health services. Information is shared
                    only with your explicit consent.
                  </p>
                </div>
                <p className="text-gray-300 leading-relaxed">
                  You can revoke consent for information sharing with Framer
                  Health at any time. Framer Health operates independently and is
                  bound by health privacy laws. Any services you receive are
                  governed by separate agreements with Framer Health.
                </p>
              </section>

              {/* 9. Payment Terms and Fees */}
              <section className="mb-10">
                <h2 className="text-2xl md:text-3xl font-montserrat-bold text-white mb-4">
                  9. Payment Terms and Fees
                </h2>
                <div className="bg-green-900/20 border border-green-500/30 rounded-lg p-4 mb-4">
                  <h3 className="text-lg font-montserrat-semibold text-white mb-2">
                    Current Status: Free to Use
                  </h3>
                  <p className="text-gray-300">
                    Support24 is currently free to use for all user types. There
                    are no subscription fees, listing fees, booking fees, or
                    transaction fees at this time.
                  </p>
                </div>
                <p className="text-gray-300 leading-relaxed mb-4">
                  However, we reserve the right to introduce fees for certain
                  Platform features in the future. When we implement fees, we
                  will provide at least 60 days' advance notice via email,
                  platform notices, and detailed information about fee structures.
                </p>
                <h3 className="text-xl font-montserrat-semibold text-white mb-3 mt-6">
                  Potential Future Fees
                </h3>
                <ul className="list-disc list-inside text-gray-300 space-y-2">
                  <li>Transaction fees for processed payments</li>
                  <li>Subscription fees for premium features</li>
                  <li>Listing fees for certain advertisements</li>
                  <li>Service fees for value-added services</li>
                </ul>
              </section>

              {/* 10. Intellectual Property Rights */}
              <section className="mb-10">
                <h2 className="text-2xl md:text-3xl font-montserrat-bold text-white mb-4">
                  10. Intellectual Property Rights
                </h2>
                <p className="text-gray-300 leading-relaxed mb-4">
                  Support24 owns or licenses all intellectual property in the
                  Platform, including software, designs, branding, text content,
                  and databases. These rights are protected by copyright,
                  trademark, and other intellectual property laws.
                </p>
                <h3 className="text-xl font-montserrat-semibold text-white mb-3 mt-6">
                  Your Content
                </h3>
                <p className="text-gray-300 leading-relaxed mb-4">
                  You retain ownership of content you create and post. However,
                  by posting content, you grant Support24 a non-exclusive,
                  worldwide, royalty-free license to:
                </p>
                <ul className="list-disc list-inside text-gray-300 space-y-2 mb-4">
                  <li>Display your content to other users</li>
                  <li>Store and backup your content</li>
                  <li>Transmit content as needed for Platform services</li>
                  <li>Reformat content for different devices</li>
                  <li>Create anonymized analytics</li>
                </ul>
                <p className="text-gray-300 leading-relaxed">
                  All content you post must be content you own or have permission
                  to post, accurate and lawful, and compliant with our standards.
                </p>
              </section>

              {/* 11. Privacy and Data Protection */}
              <section className="mb-10">
                <h2 className="text-2xl md:text-3xl font-montserrat-bold text-white mb-4">
                  11. Privacy and Data Protection
                </h2>
                <p className="text-gray-300 leading-relaxed mb-4">
                  Your privacy is important to us. Our Privacy Policy provides
                  comprehensive information about how we collect, use, store,
                  share, and protect your personal information.
                </p>
                <h3 className="text-xl font-montserrat-semibold text-white mb-3 mt-6">
                  Key Privacy Principles
                </h3>
                <ul className="list-disc list-inside text-gray-300 space-y-2 mb-4">
                  <li>We collect only information necessary for Platform operation</li>
                  <li>We use information only for disclosed purposes</li>
                  <li>We share information only as described in our Privacy Policy</li>
                  <li>We implement comprehensive security measures</li>
                  <li>We retain information only as long as necessary</li>
                  <li>We provide you with access and correction rights</li>
                </ul>
                <p className="text-gray-300 leading-relaxed">
                  For detailed information, please refer to our{" "}
                  <Link
                    to="/privacy-policy"
                    className="text-primary hover:underline"
                  >
                    Privacy Policy
                  </Link>{" "}
                  or contact our Privacy Officer at{" "}
                  <a
                    href="mailto:privacy@support24.com.au"
                    className="text-primary hover:underline"
                  >
                    privacy@support24.com.au
                  </a>
                  .
                </p>
              </section>

              {/* 12. Disclaimers and Limitations of Liability */}
              <section className="mb-10">
                <h2 className="text-2xl md:text-3xl font-montserrat-bold text-white mb-4">
                  12. Disclaimers and Limitations of Liability
                </h2>
                <div className="bg-yellow-900/20 border border-yellow-500/30 rounded-lg p-4 mb-4">
                  <p className="text-gray-300 mb-2">
                    <strong className="text-white">
                      Your use of Support24 is at your own risk.
                    </strong>
                  </p>
                  <p className="text-gray-300">
                    While we implement safety measures and verification
                    processes, we cannot eliminate all risks. You are responsible
                    for making informed decisions and conducting due diligence.
                  </p>
                </div>

                <h3 className="text-xl font-montserrat-semibold text-white mb-3 mt-6">
                  "As Is" Service
                </h3>
                <p className="text-gray-300 leading-relaxed mb-4">
                  Support24 is provided "as is" and "as available" without
                  warranties of any kind, except as required by law. We do not
                  warrant:
                </p>
                <ul className="list-disc list-inside text-gray-300 space-y-2 mb-4">
                  <li>That the Platform will be uninterrupted or error-free</li>
                  <li>That user information is accurate or trustworthy</li>
                  <li>That verification identifies all unsuitable users</li>
                  <li>That services arranged will be satisfactory</li>
                  <li>That disputes will be resolved satisfactorily</li>
                </ul>

                <h3 className="text-xl font-montserrat-semibold text-white mb-3 mt-6">
                  Australian Consumer Law
                </h3>
                <p className="text-gray-300 leading-relaxed mb-4">
                  Nothing in these Terms limits your rights under the Australian
                  Consumer Law. Consumer guarantees apply to services we provide
                  to you (Platform access), though not to services arranged
                  between users.
                </p>

                <h3 className="text-xl font-montserrat-semibold text-white mb-3 mt-6">
                  Limitation of Liability
                </h3>
                <p className="text-gray-300 leading-relaxed mb-4">
                  To the maximum extent permitted by law, Support24 is not liable
                  for indirect, incidental, or consequential damages arising from
                  Platform use. Our total liability is limited to fees you paid
                  in the prior 12 months, or $100 if no fees paid.
                </p>

                <h3 className="text-xl font-montserrat-semibold text-white mb-3 mt-6">
                  Indemnification
                </h3>
                <p className="text-gray-300 leading-relaxed">
                  You agree to indemnify Support24 from claims arising from your
                  Platform use, Terms breach, law violations, posted content,
                  services provided or received, or disputes with other users.
                </p>
              </section>

              {/* 13. Dispute Resolution */}
              <section className="mb-10">
                <h2 className="text-2xl md:text-3xl font-montserrat-bold text-white mb-4">
                  13. Dispute Resolution
                </h2>

                <h3 className="text-xl font-montserrat-semibold text-white mb-3 mt-6">
                  User-to-User Disputes
                </h3>
                <p className="text-gray-300 leading-relaxed mb-4">
                  Disputes between users should first be resolved directly
                  through communication and good faith negotiation. If direct
                  communication fails, consider:
                </p>
                <ul className="list-disc list-inside text-gray-300 space-y-2 mb-4">
                  <li>External mediation through Community Justice Centres</li>
                  <li>
                    NDIS Quality and Safeguards Commission (for provider
                    complaints):{" "}
                    <a
                      href="tel:1800035544"
                      className="text-primary hover:underline"
                    >
                      1800 035 544
                    </a>
                  </li>
                  <li>Assistance from Support Coordinators</li>
                </ul>

                <h3 className="text-xl font-montserrat-semibold text-white mb-3 mt-6">
                  Disputes with Support24
                </h3>
                <p className="text-gray-300 leading-relaxed mb-4">
                  For disputes involving Support24 directly, contact{" "}
                  <a
                    href="mailto:support@support24.com.au"
                    className="text-primary hover:underline"
                  >
                    support@support24.com.au
                  </a>
                  . Both parties agree to attempt resolution through good faith
                  negotiation and mediation before legal proceedings.
                </p>
              </section>

              {/* 14. Termination */}
              <section className="mb-10">
                <h2 className="text-2xl md:text-3xl font-montserrat-bold text-white mb-4">
                  14. Termination
                </h2>

                <h3 className="text-xl font-montserrat-semibold text-white mb-3 mt-6">
                  Your Right to Terminate
                </h3>
                <p className="text-gray-300 leading-relaxed mb-4">
                  You may close your Account at any time by contacting{" "}
                  <a
                    href="mailto:support@support24.com.au"
                    className="text-primary hover:underline"
                  >
                    support@support24.com.au
                  </a>{" "}
                  or using account closure options. We'll process your request
                  within 5-10 business days.
                </p>

                <h3 className="text-xl font-montserrat-semibold text-white mb-3 mt-6">
                  Our Right to Terminate
                </h3>
                <p className="text-gray-300 leading-relaxed mb-4">
                  Support24 may terminate or suspend your Account:
                </p>
                <ul className="list-disc list-inside text-gray-300 space-y-2 mb-4">
                  <li>
                    <strong className="text-white">For convenience:</strong> With
                    30 days' notice
                  </li>
                  <li>
                    <strong className="text-white">For breach:</strong> After
                    notice and opportunity to remedy (typically 14 days)
                  </li>
                  <li>
                    <strong className="text-white">
                      Immediately for serious violations:
                    </strong>{" "}
                    False information, criminal activity, safety risks,
                    harassment, repeated violations
                  </li>
                </ul>

                <h3 className="text-xl font-montserrat-semibold text-white mb-3 mt-6">
                  Surviving Obligations
                </h3>
                <p className="text-gray-300 leading-relaxed">
                  After termination, certain obligations survive including
                  confidentiality, intellectual property rights, liability
                  limitations, dispute resolution, and payment obligations.
                </p>
              </section>

              {/* 15. General Legal Provisions */}
              <section className="mb-10">
                <h2 className="text-2xl md:text-3xl font-montserrat-bold text-white mb-4">
                  15. General Legal Provisions
                </h2>
                <ul className="list-disc list-inside text-gray-300 space-y-2">
                  <li>
                    <strong className="text-white">Governing Law:</strong> These
                    Terms are governed by the laws of Victoria, Australia
                  </li>
                  <li>
                    <strong className="text-white">Entire Agreement:</strong>{" "}
                    These Terms, Platform Terms, and Privacy Policy constitute
                    the entire agreement
                  </li>
                  <li>
                    <strong className="text-white">Assignment:</strong> You
                    cannot transfer your Account without our consent
                  </li>
                  <li>
                    <strong className="text-white">Severability:</strong>{" "}
                    Invalid provisions don't invalidate the entire agreement
                  </li>
                  <li>
                    <strong className="text-white">Waiver:</strong> Our failure
                    to enforce doesn't constitute waiver
                  </li>
                  <li>
                    <strong className="text-white">Force Majeure:</strong> We're
                    not liable for events beyond our control
                  </li>
                </ul>
              </section>

              {/* 16. Changes to These Terms */}
              <section className="mb-10">
                <h2 className="text-2xl md:text-3xl font-montserrat-bold text-white mb-4">
                  16. Changes to These Terms
                </h2>
                <p className="text-gray-300 leading-relaxed mb-4">
                  We may modify these Terms to reflect changes in our services,
                  legal requirements, or operational practices. For material
                  changes, we will provide at least 30 days' advance notice via:
                </p>
                <ul className="list-disc list-inside text-gray-300 space-y-2 mb-4">
                  <li>Email to your registered address</li>
                  <li>Prominent notice on the Platform</li>
                  <li>In-app notification</li>
                </ul>
                <p className="text-gray-300 leading-relaxed">
                  Continued use after changes take effect constitutes acceptance.
                  If you don't agree, close your Account before changes become
                  effective.
                </p>
              </section>

              {/* 17. Contact Information */}
              <section className="mb-10">
                <h2 className="text-2xl md:text-3xl font-montserrat-bold text-white mb-4">
                  17. Contact Information
                </h2>
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-montserrat-semibold text-white mb-2">
                      General Inquiries and Support
                    </h3>
                    <p className="text-gray-300">
                      Email:{" "}
                      <a
                        href="mailto:support@support24.com.au"
                        className="text-primary hover:underline"
                      >
                        support@support24.com.au
                      </a>
                    </p>
                    <p className="text-gray-300">
                      Phone:{" "}
                      <a
                        href="tel:+61348324105"
                        className="text-primary hover:underline"
                      >
                        03 4832 4105
                      </a>{" "}
                      (Mon-Fri, 9 AM - 5 PM AEST/AEDT)
                    </p>
                  </div>
                  <div>
                    <h3 className="text-lg font-montserrat-semibold text-white mb-2">
                      Privacy Matters
                    </h3>
                    <p className="text-gray-300">
                      Email:{" "}
                      <a
                        href="mailto:privacy@support24.com.au"
                        className="text-primary hover:underline"
                      >
                        privacy@support24.com.au
                      </a>
                    </p>
                  </div>
                  <div>
                    <h3 className="text-lg font-montserrat-semibold text-white mb-2">
                      Incident Reports and Safety Concerns
                    </h3>
                    <p className="text-gray-300">
                      Email:{" "}
                      <a
                        href="mailto:incidents@support24.com.au"
                        className="text-primary hover:underline"
                      >
                        incidents@support24.com.au
                      </a>
                    </p>
                    <p className="text-gray-300">
                      Phone:{" "}
                      <a
                        href="tel:+61348324105"
                        className="text-primary hover:underline"
                      >
                        03 4832 4105
                      </a>{" "}
                      (business hours)
                    </p>
                  </div>
                  <div>
                    <h3 className="text-lg font-montserrat-semibold text-white mb-2">
                      Support24
                    </h3>
                    <p className="text-gray-300">ABN: 19673683817</p>
                    <p className="text-gray-300">
                      Website:{" "}
                      <a
                        href="https://www.support24.com.au"
                        className="text-primary hover:underline"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        www.support24.com.au
                      </a>
                    </p>
                  </div>
                </div>
              </section>

              {/* Footer */}
              <div className="mt-12 pt-8 border-t border-white/10">
                <div className="bg-primary/10 border border-primary/30 rounded-lg p-6 mb-6">
                  <h3 className="text-xl font-montserrat-semibold text-white mb-3">
                    Acknowledgment
                  </h3>
                  <p className="text-gray-300 leading-relaxed mb-4">
                    By using Support24, you acknowledge that you have read,
                    understood, and agree to be bound by these Terms of Use, our
                    Platform Terms, our Privacy Policy, and any additional terms
                    that apply to specific features or services you use.
                  </p>
                  <p className="text-gray-300 leading-relaxed">
                    If you have any questions about these Terms or need
                    clarification before agreeing, please contact us at{" "}
                    <a
                      href="mailto:support@support24.com.au"
                      className="text-primary hover:underline"
                    >
                      support@support24.com.au
                    </a>{" "}
                    before creating an Account or using the Platform.
                  </p>
                </div>
                <p className="text-gray-400 text-sm text-center mb-2">
                  We are committed to making the NDIS experience easier for
                  everyone involved by providing a transparent, safe, and
                  efficient marketplace for disability support services.
                </p>
                <p className="text-gray-500 text-xs text-center">
                  © 2025 Support24 . All rights reserved.
                </p>
                <p className="text-gray-500 text-xs text-center mt-2">
                  Version: 2.0 | Effective: 10 November 2025 | Last Updated: 10
                  November 2025
                </p>
                <p className="text-gray-500 text-xs text-center mt-4">
                  <strong>Document Relationships:</strong> This Terms of Use
                  document should be read together with{" "}
                  <Link
                    to="/platform-terms"
                    className="text-primary hover:underline"
                  >
                    Platform Terms
                  </Link>
                  ,{" "}
                  <Link
                    to="/privacy-policy"
                    className="text-primary hover:underline"
                  >
                    Privacy Policy
                  </Link>
                  , and{" "}
                  <Link
                    to="/incident-management-policy"
                    className="text-primary hover:underline"
                  >
                    Incident Management Policy
                  </Link>
                  .
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </LandingLayout>
  );
}

