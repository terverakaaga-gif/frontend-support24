import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { LandingLayout } from "@/components/layouts/LandingLayout";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

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
          {/* Back Button */}
          {/* <Link to="/">
            <Button
              variant="ghost"
              className="mb-8 text-gray-300 hover:text-white hover:bg-white/10"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Button>
          </Link> */}

          {/* Header */}
          <div className="mb-12 text-center">
            <h1 className="text-4xl md:text-5xl font-montserrat-bold text-white mb-4">
              Support24 Platform Terms
            </h1>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 text-gray-400">
              <p className="text-sm">Version: 2.0</p>
              <span className="hidden sm:inline">•</span>
              <p className="text-sm">Effective Date: 10 November 2025</p>
              <span className="hidden sm:inline">•</span>
              <p className="text-sm">ABN: 19673683817</p>
            </div>
            <p className="text-sm text-gray-400 mt-2">
              Contact:{" "}
              <a
                href="mailto:support@support24.com.au"
                className="text-primary hover:underline"
              >
                support@support24.com.au
              </a>
            </p>
          </div>

          {/* Content */}
          <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 md:p-12 border border-white/10 shadow-2xl">
            <div className="prose prose-invert prose-lg max-w-none">
              {/* About Support24 */}
              <section className="mb-10">
                <h2 className="text-2xl md:text-3xl font-montserrat-bold text-white mb-4">
                  About Support24
                </h2>
                <p className="text-gray-300 leading-relaxed mb-4">
                  Welcome to Support24, a digital marketplace built to connect
                  NDIS participants with qualified and verified support workers,
                  disability service providers, and support coordinators.
                  Accessible via both web and mobile applications, Support24
                  provides a secure and transparent environment where users can
                  find, connect, and manage disability support services
                  efficiently and safely.
                </p>
                <p className="text-gray-300 leading-relaxed mb-4">
                  Our mission is simple: to make the NDIS experience easier for
                  everyone involved. Whether you are a participant seeking help,
                  a support worker offering services, a provider managing a
                  workforce, or a support coordinator facilitating care
                  arrangements, Support24 simplifies how you discover, manage,
                  and maintain trusted support relationships.
                </p>
                <p className="text-gray-300 leading-relaxed">
                  By using Support24, you can browse a verified marketplace of
                  users, search and connect with others based on location and
                  service needs, create and manage detailed profiles showcasing
                  your services or requirements, communicate securely through
                  in-app messaging, book and coordinate services with
                  transparency, complete comprehensive verification and safety
                  checks, access workforce management tools including
                  RosterRelay integration for automated shift allocation,
                  advertise SIL and STA accommodation placements, post and
                  respond to community events and activities, and contact our
                  safety team whenever assistance is required.
                </p>
              </section>

              {/* Who These Terms Apply To */}
              <section className="mb-10">
                <h2 className="text-2xl md:text-3xl font-montserrat-bold text-white mb-4">
                  Who These Terms Apply To
                </h2>
                <p className="text-gray-300 leading-relaxed mb-4">
                  These Platform Terms apply to all users of Support24 and
                  should be read together with our Terms of Use and Privacy
                  Policy. The users of Support24 include:
                </p>
                <ul className="list-disc list-inside text-gray-300 space-y-2 mb-4">
                  <li>
                    <strong className="text-white">Participants</strong> who are
                    NDIS participants or their representatives seeking support
                  </li>
                  <li>
                    <strong className="text-white">Support Workers</strong> who
                    are individuals providing NDIS-aligned services either
                    directly to Participants or through Providers
                  </li>
                  <li>
                    <strong className="text-white">Providers</strong> who are
                    registered NDIS provider organizations that employ or engage
                    Support Workers and deliver services to Participants
                  </li>
                  <li>
                    <strong className="text-white">
                      Support Coordinators
                    </strong>{" "}
                    who are plan managers and support coordinators assisting
                    Participants in finding and coordinating services
                  </li>
                </ul>
                <p className="text-gray-300 leading-relaxed">
                  Together with our Terms of Use and Privacy Policy, along with
                  user-type-specific terms such as Provider Terms and Conditions
                  and Support Coordinator Terms and Conditions, these Platform
                  Terms form the entire agreement between you and Support24.
                </p>
              </section>

              {/* 1. Responsibilities and Conduct */}
              <section className="mb-10">
                <h2 className="text-2xl md:text-3xl font-montserrat-bold text-white mb-4">
                  1. Responsibilities and Conduct
                </h2>
                <p className="text-gray-300 leading-relaxed mb-4">
                  When using Support24, you agree to act responsibly,
                  professionally, and respectfully at all times. This commitment
                  to professional conduct is essential for maintaining a safe
                  and effective marketplace for disability services.
                </p>
                <h3 className="text-xl font-montserrat-semibold text-white mb-3 mt-6">
                  Legal Requirements
                </h3>
                <p className="text-gray-300 leading-relaxed mb-4">
                  You must meet all legal requirements applicable to your role,
                  including:
                </p>
                <ul className="list-disc list-inside text-gray-300 space-y-2 mb-4">
                  <li>NDIS eligibility requirements</li>
                  <li>Worker screening requirements</li>
                  <li>Professional registration where required</li>
                  <li>Compliance with relevant state and federal legislation</li>
                </ul>

                <h3 className="text-xl font-montserrat-semibold text-white mb-3 mt-6">
                  Professional Boundaries
                </h3>
                <p className="text-gray-300 leading-relaxed mb-4">
                  You must maintain professional boundaries at all times. This
                  means:
                </p>
                <ul className="list-disc list-inside text-gray-300 space-y-2 mb-4">
                  <li>
                    Keeping relationships professional and not developing
                    personal or sexual relationships with participants or their
                    family members
                  </li>
                  <li>
                    Not accepting or offering inappropriate gifts or benefits
                  </li>
                  <li>
                    Maintaining appropriate physical boundaries and respecting
                    personal space
                  </li>
                  <li>
                    Not using your position to exploit, manipulate, or take
                    advantage of others
                  </li>
                </ul>

                <h3 className="text-xl font-montserrat-semibold text-white mb-3 mt-6">
                  Safety and Incident Reporting
                </h3>
                <p className="text-gray-300 leading-relaxed mb-4">
                  You must report incidents or misconduct immediately using the
                  appropriate channels:
                </p>
                <ul className="list-disc list-inside text-gray-300 space-y-2">
                  <li>
                    Report to Support24 through our incident reporting system at{" "}
                    <a
                      href="mailto:incidents@support24.com.au"
                      className="text-primary hover:underline"
                    >
                      incidents@support24.com.au
                    </a>{" "}
                    or via in-app reporting features
                  </li>
                  <li>
                    Report to relevant authorities such as police, child
                    protection, or the NDIS Quality and Safeguards Commission as
                    required
                  </li>
                  <li>
                    Notify other affected parties such as Participants,
                    families, or service providers as appropriate
                  </li>
                </ul>
              </section>

              {/* 2. Prohibited Activities */}
              <section className="mb-10">
                <h2 className="text-2xl md:text-3xl font-montserrat-bold text-white mb-4">
                  2. Prohibited Activities
                </h2>
                <p className="text-gray-300 leading-relaxed mb-4">
                  Users must not engage in unlawful, harmful, or dishonest
                  activity while using the Platform. Support24 has zero
                  tolerance for conduct that undermines safety, trust, or the
                  integrity of our marketplace. Prohibited conduct includes:
                </p>
                <ul className="list-disc list-inside text-gray-300 space-y-2 mb-4">
                  <li>
                    <strong className="text-white">Harassment:</strong> Any
                    behavior that intimidates, threatens, demeans, or creates a
                    hostile environment for others
                  </li>
                  <li>
                    <strong className="text-white">Discrimination:</strong>{" "}
                    Based on disability, age, gender, race, religion, sexuality,
                    or any other protected attribute
                  </li>
                  <li>
                    <strong className="text-white">Impersonation:</strong> Of
                    another person, organization, or entity
                  </li>
                  <li>
                    <strong className="text-white">Misleading content:</strong>{" "}
                    Including false claims about qualifications, experience, or
                    services
                  </li>
                  <li>
                    <strong className="text-white">System tampering:</strong>{" "}
                    Attempting to circumvent security features, verification
                    processes, or access controls
                  </li>
                  <li>
                    <strong className="text-white">Data scraping:</strong>{" "}
                    Copying or redistributing platform content without
                    permission
                  </li>
                  <li>
                    <strong className="text-white">Spam:</strong> Unsolicited
                    advertising or promotion of unrelated services
                  </li>
                </ul>
              </section>

              {/* 3. Agreement with Support24 */}
              <section className="mb-10">
                <h2 className="text-2xl md:text-3xl font-montserrat-bold text-white mb-4">
                  3. Agreement with Support24
                </h2>
                <p className="text-gray-300 leading-relaxed mb-4">
                  Your agreement with Support24 begins when you create an
                  account by completing the registration process and clicking "I
                  Agree" to these terms, or when you start using the Platform by
                  accessing features even if you have not completed full
                  registration.
                </p>
                <p className="text-gray-300 leading-relaxed mb-4">
                  The relationship between you and Support24 is governed by:
                </p>
                <ul className="list-disc list-inside text-gray-300 space-y-2 mb-4">
                  <li>These Platform Terms</li>
                  <li>
                    The Terms of Use which set out detailed legal terms and
                    conditions
                  </li>
                  <li>
                    The Privacy Policy which explains how we handle your
                    personal information
                  </li>
                  <li>
                    User-type-specific terms including Provider Terms and
                    Conditions and Support Coordinator Terms and Conditions
                  </li>
                </ul>
                <p className="text-gray-300 leading-relaxed">
                  These Platform Terms may be updated from time to time. We will
                  provide at least 30 days' notice of material changes. Your
                  continued use of Support24 after changes take effect
                  constitutes acceptance of the updated Platform Terms.
                </p>
              </section>

              {/* 4. Account Registration and Verification */}
              <section className="mb-10">
                <h2 className="text-2xl md:text-3xl font-montserrat-bold text-white mb-4">
                  4. Account Registration and Verification
                </h2>
                <p className="text-gray-300 leading-relaxed mb-4">
                  To access core platform features beyond basic browsing, users
                  must register for an account. Registration involves:
                </p>
                <ul className="list-disc list-inside text-gray-300 space-y-2 mb-4">
                  <li>Providing required information about yourself or your organization</li>
                  <li>Creating secure login credentials</li>
                  <li>Agreeing to these Platform Terms and related policies</li>
                  <li>Completing identity verification</li>
                </ul>

                <h3 className="text-xl font-montserrat-semibold text-white mb-3 mt-6">
                  Verification Requirements
                </h3>
                <p className="text-gray-300 leading-relaxed mb-4">
                  For all users, verification includes identity checks to
                  confirm you are who you claim to be using government-issued
                  identification documents.
                </p>
                <p className="text-gray-300 leading-relaxed mb-4">
                  <strong className="text-white">
                    For Support Workers:
                  </strong>
                </p>
                <ul className="list-disc list-inside text-gray-300 space-y-2 mb-4">
                  <li>NDIS Worker Screening Checks</li>
                  <li>Police checks</li>
                  <li>Reference checks</li>
                  <li>Verification of qualifications and certifications</li>
                  <li>Right-to-work documentation</li>
                </ul>
                <p className="text-gray-300 leading-relaxed mb-4">
                  <strong className="text-white">For Providers:</strong>
                </p>
                <ul className="list-disc list-inside text-gray-300 space-y-2 mb-4">
                  <li>NDIS registration status verification</li>
                  <li>Organizational identity verification (ACN/ABN)</li>
                  <li>Organizational authority confirmation</li>
                  <li>Insurance policy evidence</li>
                </ul>
                <p className="text-gray-300 leading-relaxed">
                  The verification process typically takes between 5 to 10
                  business days from the time you submit all required
                  documentation.
                </p>
              </section>

              {/* 5. Service Agreements */}
              <section className="mb-10">
                <h2 className="text-2xl md:text-3xl font-montserrat-bold text-white mb-4">
                  5. Service Agreements
                </h2>
                <p className="text-gray-300 leading-relaxed mb-4">
                  All service agreements between Participants and Support
                  Workers, between Participants and Providers, or between
                  Providers and Support Workers must comply with Australian law
                  and the NDIS Practice Standards.
                </p>
                <p className="text-gray-300 leading-relaxed mb-4">
                  Each service agreement should clearly define:
                </p>
                <ul className="list-disc list-inside text-gray-300 space-y-2 mb-4">
                  <li>
                    <strong className="text-white">Scope of work:</strong>{" "}
                    Describing the specific supports or services to be provided
                  </li>
                  <li>
                    <strong className="text-white">Service schedule:</strong>{" "}
                    Days, times, duration, and frequency of services
                  </li>
                  <li>
                    <strong className="text-white">Rates:</strong> The minimum
                    active service rate is $39 per hour
                  </li>
                  <li>
                    <strong className="text-white">
                      Cancellation policies:
                    </strong>{" "}
                    Notice requirements and cancellation fees
                  </li>
                  <li>
                    <strong className="text-white">Termination terms:</strong>{" "}
                    Notice periods and circumstances for ending the relationship
                  </li>
                </ul>
                <p className="text-gray-300 leading-relaxed">
                  Service agreements should be documented in writing wherever
                  possible, with copies retained by both parties.
                </p>
              </section>

              {/* 6. Platform Role and Limitations */}
              <section className="mb-10">
                <h2 className="text-2xl md:text-3xl font-montserrat-bold text-white mb-4">
                  6. Platform Role and Limitations
                </h2>
                <p className="text-gray-300 leading-relaxed mb-4">
                  Support24 acts as a facilitator, providing technology that
                  enables:
                </p>
                <ul className="list-disc list-inside text-gray-300 space-y-2 mb-4">
                  <li>Secure communication between users</li>
                  <li>Verified user connections based on background checks</li>
                  <li>Booking management tools</li>
                  <li>Incident reporting mechanisms</li>
                  <li>Directory services helping users find appropriate matches</li>
                  <li>
                    Workforce management integration through RosterRelay
                  </li>
                </ul>

                <h3 className="text-xl font-montserrat-semibold text-white mb-3 mt-6">
                  What We Don't Do
                </h3>
                <p className="text-gray-300 leading-relaxed mb-4">
                  Support24 does not:
                </p>
                <ul className="list-disc list-inside text-gray-300 space-y-2 mb-4">
                  <li>
                    <strong className="text-white">
                      Employ or contract workers:
                    </strong>{" "}
                    All Support Workers and Providers are independent
                    contractors
                  </li>
                  <li>
                    <strong className="text-white">
                      Manage service delivery:
                    </strong>{" "}
                    We do not supervise how services are provided
                  </li>
                  <li>
                    <strong className="text-white">
                      Offer health or medical advice:
                    </strong>{" "}
                    We are not healthcare professionals
                  </li>
                  <li>
                    <strong className="text-white">Guarantee outcomes:</strong>{" "}
                    We cannot promise that services will achieve particular
                    goals
                  </li>
                  <li>
                    <strong className="text-white">
                      Form employment relationships:
                    </strong>{" "}
                    All users are independent parties
                  </li>
                </ul>
              </section>

              {/* 7. Risk, Disclaimers, and Consumer Rights */}
              <section className="mb-10">
                <h2 className="text-2xl md:text-3xl font-montserrat-bold text-white mb-4">
                  7. Risk, Disclaimers, and Consumer Rights
                </h2>
                <p className="text-gray-300 leading-relaxed mb-4">
                  Your use of Support24 is at your own discretion and risk. You
                  are responsible for making informed decisions about who to
                  engage, which services to book, and assessing suitability for
                  your needs.
                </p>
                <p className="text-gray-300 leading-relaxed mb-4">
                  While Support24 takes reasonable steps to maintain a secure
                  and functional service, we do not guarantee:
                </p>
                <ul className="list-disc list-inside text-gray-300 space-y-2 mb-4">
                  <li>The accuracy of all user data</li>
                  <li>The quality of services provided</li>
                  <li>Uninterrupted access to the Platform</li>
                </ul>
                <p className="text-gray-300 leading-relaxed mb-4">
                  <strong className="text-white">
                    Australian Consumer Law:
                  </strong>{" "}
                  Nothing in these Terms limits your rights under the Australian
                  Consumer Law. The Australian Consumer Law provides consumer
                  guarantees that cannot be excluded for services supplied to
                  consumers.
                </p>
                <p className="text-gray-300 leading-relaxed">
                  Users should maintain appropriate insurance to cover their
                  activities and potential liabilities.
                </p>
              </section>

              {/* 8. Intellectual Property and Content */}
              <section className="mb-10">
                <h2 className="text-2xl md:text-3xl font-montserrat-bold text-white mb-4">
                  8. Intellectual Property and Content
                </h2>
                <p className="text-gray-300 leading-relaxed mb-4">
                  Support24 owns or licenses all intellectual property in the
                  Platform, including:
                </p>
                <ul className="list-disc list-inside text-gray-300 space-y-2 mb-4">
                  <li>Software, algorithms, and source code</li>
                  <li>Design elements, layout, and user interface</li>
                  <li>Branding including the Support24 name and logo</li>
                  <li>Text content including help articles and guides</li>
                  <li>Databases and data compilation</li>
                </ul>
                <p className="text-gray-300 leading-relaxed mb-4">
                  You retain ownership of your own content including profile
                  information, photos, messages, and reviews. However, by
                  posting content on Support24, you grant us a non-exclusive,
                  worldwide, royalty-free license to use your content for
                  platform operation and improvement purposes.
                </p>
                <p className="text-gray-300 leading-relaxed">
                  All content you post must be accurate, lawful, and respectful.
                  You must own the rights to content you post or have permission
                  to post it.
                </p>
              </section>

              {/* 9. Privacy and Confidentiality */}
              <section className="mb-10">
                <h2 className="text-2xl md:text-3xl font-montserrat-bold text-white mb-4">
                  9. Privacy and Confidentiality
                </h2>
                <p className="text-gray-300 leading-relaxed mb-4">
                  Both Support24 and users must protect confidential information
                  and disclose it only when legally required, to professional
                  advisers under confidentiality obligations, or with written
                  consent.
                </p>
                <p className="text-gray-300 leading-relaxed mb-4">
                  Confidential information includes:
                </p>
                <ul className="list-disc list-inside text-gray-300 space-y-2 mb-4">
                  <li>Personal details about users</li>
                  <li>Business information</li>
                  <li>Communication content such as private messages</li>
                  <li>Any information marked as confidential</li>
                </ul>
                <p className="text-gray-300 leading-relaxed">
                  Personal data is handled in compliance with the Privacy Act
                  1988 (Cth) and Support24's Privacy Policy. Users should read
                  the Privacy Policy carefully to understand their rights and
                  our obligations.
                </p>
              </section>

              {/* 10. Termination */}
              <section className="mb-10">
                <h2 className="text-2xl md:text-3xl font-montserrat-bold text-white mb-4">
                  10. Termination
                </h2>
                <p className="text-gray-300 leading-relaxed mb-4">
                  You may close your account at any time by notifying Support24
                  at{" "}
                  <a
                    href="mailto:support@support24.com.au"
                    className="text-primary hover:underline"
                  >
                    support@support24.com.au
                  </a>{" "}
                  or using account closure options in your account settings.
                </p>
                <p className="text-gray-300 leading-relaxed mb-4">
                  Support24 may terminate your account for:
                </p>
                <ul className="list-disc list-inside text-gray-300 space-y-2 mb-4">
                  <li>
                    Breach of these Terms after notice and opportunity to remedy
                  </li>
                  <li>
                    Serious violations such as providing false information,
                    criminal activity, or safety risks
                  </li>
                  <li>
                    Convenience with 30 days' notice if we discontinue the
                    Platform
                  </li>
                </ul>
                <p className="text-gray-300 leading-relaxed">
                  Obligations existing prior to termination remain enforceable,
                  including service agreements, payment obligations, and
                  indemnification obligations.
                </p>
              </section>

              {/* 11. Incidents and Disputes */}
              <section className="mb-10">
                <h2 className="text-2xl md:text-3xl font-montserrat-bold text-white mb-4">
                  11. Incidents and Disputes
                </h2>
                <p className="text-gray-300 leading-relaxed mb-4">
                  Incidents or complaints may be reported using:
                </p>
                <ul className="list-disc list-inside text-gray-300 space-y-2 mb-4">
                  <li>In-app reporting tools</li>
                  <li>
                    Email to{" "}
                    <a
                      href="mailto:incidents@support24.com.au"
                      className="text-primary hover:underline"
                    >
                      incidents@support24.com.au
                    </a>{" "}
                    for safety concerns
                  </li>
                  <li>
                    Email to{" "}
                    <a
                      href="mailto:support@support24.com.au"
                      className="text-primary hover:underline"
                    >
                      support@support24.com.au
                    </a>{" "}
                    for non-urgent matters
                  </li>
                  <li>
                    Phone at{" "}
                    <a
                      href="tel:+61348324105"
                      className="text-primary hover:underline"
                    >
                      03 4832 4105
                    </a>{" "}
                    during business hours
                  </li>
                </ul>
                <p className="text-gray-300 leading-relaxed mb-4">
                  Support24 will acknowledge reports within two business days
                  and investigate promptly, typically within 5 to 10 business
                  days for safety concerns.
                </p>
                <p className="text-gray-300 leading-relaxed">
                  User-to-user disputes should first be resolved directly
                  between parties. Support24 is not obligated to mediate but may
                  assist at our discretion.
                </p>
              </section>

              {/* 12. General Provisions */}
              <section className="mb-10">
                <h2 className="text-2xl md:text-3xl font-montserrat-bold text-white mb-4">
                  12. General Provisions
                </h2>
                <p className="text-gray-300 leading-relaxed mb-4">
                  Support24 may amend these Platform Terms from time to time. We
                  will provide at least 30 days' notice of material changes.
                  Continued use after changes take effect constitutes acceptance
                  of amended terms.
                </p>
                <p className="text-gray-300 leading-relaxed mb-4">
                  <strong className="text-white">Contact Us:</strong>
                </p>
                <ul className="list-disc list-inside text-gray-300 space-y-2 mb-4">
                  <li>
                    General inquiries:{" "}
                    <a
                      href="mailto:support@support24.com.au"
                      className="text-primary hover:underline"
                    >
                      support@support24.com.au
                    </a>
                  </li>
                  <li>
                    Safety concerns:{" "}
                    <a
                      href="mailto:incidents@support24.com.au"
                      className="text-primary hover:underline"
                    >
                      incidents@support24.com.au
                    </a>
                  </li>
                  <li>
                    Privacy inquiries:{" "}
                    <a
                      href="mailto:privacy@support24.com.au"
                      className="text-primary hover:underline"
                    >
                      privacy@support24.com.au
                    </a>
                  </li>
                  <li>
                    Phone:{" "}
                    <a
                      href="tel:+61348324105"
                      className="text-primary hover:underline"
                    >
                      03 4832 4105
                    </a>{" "}
                    (Business hours)
                  </li>
                </ul>
                <p className="text-gray-300 leading-relaxed">
                  These Terms are governed by the laws of Victoria, Australia.
                  Both parties submit to the non-exclusive jurisdiction of the
                  courts of Victoria and the Federal Court of Australia.
                </p>
              </section>

              {/* Footer */}
              <div className="mt-12 pt-8 border-t border-white/10">
                <p className="text-gray-400 text-sm text-center mb-4">
                  Thank you for taking the time to read and understand these
                  Platform Terms. By using Support24, you are joining a
                  community committed to safety, professionalism, and quality in
                  disability support services.
                </p>
                <p className="text-gray-400 text-sm text-center mb-6">
                  If you have questions about these Platform Terms or need
                  clarification on any provisions, please contact us at{" "}
                  <a
                    href="mailto:support@support24.com.au"
                    className="text-primary hover:underline"
                  >
                    support@support24.com.au
                  </a>
                  . We are happy to help you understand your rights and
                  obligations.
                </p>
                <p className="text-gray-500 text-xs text-center">
                  © 2025 Support24 . All rights reserved.
                </p>
                <p className="text-gray-500 text-xs text-center mt-2">
                  Version: 2.0 | Effective: 10 November 2025 | Previous
                  Version: 1.0 (10 November 2025)
                </p>
              </div>
            </div>
          </div>

          {/* CTA Section */}
          {/* <div className="mt-12 text-center">
            <Link to="/">
              <Button
                size="lg"
                className="bg-primary hover:bg-primary/90 text-white px-8 py-6 text-lg"
              >
                Return to Home
              </Button>
            </Link>
          </div> */}
        </motion.div>
      </div>
    </LandingLayout>
  );
}

