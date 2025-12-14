import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { LandingLayout } from "@/components/layouts/LandingLayout";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export default function PrivacyPolicy() {
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
              Support24 Privacy Policy
            </h1>
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
              {/* 1. About This Policy */}
              <section className="mb-10">
                <h2 className="text-2xl md:text-3xl font-montserrat-bold text-white mb-4">
                  1. About This Policy
                </h2>
                <p className="text-gray-300 leading-relaxed mb-4">
                  Support24  (ABN 19673683817) operates a digital
                  marketplace connecting NDIS participants with qualified
                  support workers, disability service providers, and support
                  coordinators. This Privacy Policy explains how we collect,
                  use, store, and protect your personal information when you use
                  our website and mobile application, which together form the
                  "Platform."
                </p>
                <p className="text-gray-300 leading-relaxed mb-4">
                  We are committed to protecting your privacy and complying with
                  the Privacy Act 1988 (Cth) and the Australian Privacy
                  Principles (APPs). These laws require us to handle your
                  personal information responsibly, transparently, and with
                  appropriate security measures.
                </p>
                <p className="text-gray-300 leading-relaxed">
                  By using Support24, you agree to the collection and use of
                  information in accordance with this policy. If you do not
                  agree with any part of this policy, you should not use our
                  Platform.
                </p>
              </section>

              {/* 2. Key Definitions */}
              <section className="mb-10">
                <h2 className="text-2xl md:text-3xl font-montserrat-bold text-white mb-4">
                  2. Key Definitions
                </h2>
                <div className="space-y-4">
                  <div>
                    <h3 className="text-xl font-montserrat-semibold text-white mb-2">
                      Personal Information
                    </h3>
                    <p className="text-gray-300 leading-relaxed">
                      Information or an opinion about an identified individual,
                      or an individual who is reasonably identifiable, whether
                      the information or opinion is true or not and whether it
                      is recorded in a material form or not.
                    </p>
                  </div>
                  <div>
                    <h3 className="text-xl font-montserrat-semibold text-white mb-2">
                      Sensitive Information
                    </h3>
                    <p className="text-gray-300 leading-relaxed">
                      A special category of personal information that includes
                      information about your health, disability, racial or
                      ethnic origin, political opinions, religious beliefs,
                      sexual orientation, criminal record, biometric
                      information, or genetic information.
                    </p>
                  </div>
                  <div>
                    <h3 className="text-xl font-montserrat-semibold text-white mb-2">
                      User Types
                    </h3>
                    <ul className="list-disc list-inside text-gray-300 space-y-2">
                      <li>
                        <strong className="text-white">Participants:</strong>{" "}
                        NDIS participants or their representatives seeking
                        support
                      </li>
                      <li>
                        <strong className="text-white">Support Workers:</strong>{" "}
                        Individuals providing NDIS-aligned services
                      </li>
                      <li>
                        <strong className="text-white">Providers:</strong>{" "}
                        Registered NDIS provider organizations
                      </li>
                      <li>
                        <strong className="text-white">
                          Support Coordinators:
                        </strong>{" "}
                        Plan managers and support coordinators
                      </li>
                    </ul>
                  </div>
                </div>
              </section>

              {/* 3. Information We Collect */}
              <section className="mb-10">
                <h2 className="text-2xl md:text-3xl font-montserrat-bold text-white mb-4">
                  3. Information We Collect
                </h2>
                <p className="text-gray-300 leading-relaxed mb-4">
                  The information we collect depends on how you use Support24
                  and your user type. We collect information to verify
                  identities, maintain platform safety, facilitate connections
                  between users, comply with legal obligations, and provide and
                  improve our services.
                </p>

                <h3 className="text-xl font-montserrat-semibold text-white mb-3 mt-6">
                  3.1 Information From Support Workers
                </h3>
                <p className="text-gray-300 leading-relaxed mb-4">
                  Support Workers provide extensive information due to safety
                  and regulatory requirements:
                </p>
                <ul className="list-disc list-inside text-gray-300 space-y-2 mb-4">
                  <li>Full name, date of birth, and contact details</li>
                  <li>Identity verification documents (driver's license, passport)</li>
                  <li>NDIS Worker Screening Check details</li>
                  <li>Police checks and Working with Children Checks</li>
                  <li>Professional qualifications and certifications</li>
                  <li>Work experience and references</li>
                  <li>Profile information and service descriptions</li>
                  <li>Skills, availability, and service preferences</li>
                  <li>Banking details (for future payment processing)</li>
                  <li>Performance metrics (reviews, ratings, response times)</li>
                </ul>

                <h3 className="text-xl font-montserrat-semibold text-white mb-3 mt-6">
                  3.2 Information From Participants
                </h3>
                <p className="text-gray-300 leading-relaxed mb-4">
                  Participants provide information necessary to find appropriate
                  supports:
                </p>
                <ul className="list-disc list-inside text-gray-300 space-y-2 mb-4">
                  <li>Full name, date of birth, and contact details</li>
                  <li>Identity verification documents</li>
                  <li>Service location and support requirements</li>
                  <li>
                    Health conditions and care needs (Sensitive Information)
                  </li>
                  <li>NDIS plan details and funding information</li>
                  <li>Emergency contact information</li>
                  <li>Profile information and preferences</li>
                  <li>Guardian or representative details (if applicable)</li>
                </ul>

                <h3 className="text-xl font-montserrat-semibold text-white mb-3 mt-6">
                  3.3 Information From Providers
                </h3>
                <p className="text-gray-300 leading-relaxed mb-4">
                  Providers supply organizational information for verification:
                </p>
                <ul className="list-disc list-inside text-gray-300 space-y-2 mb-4">
                  <li>Organization's legal name, ACN/ABN, and business details</li>
                  <li>Contact information and authorized representatives</li>
                  <li>NDIS registration details and registration groups</li>
                  <li>
                    Insurance documentation (public liability, professional
                    indemnity, workers compensation)
                  </li>
                  <li>Workforce information</li>
                  <li>Services provided and geographic coverage</li>
                  <li>RosterRelay integration details (if applicable)</li>
                  <li>SIL/STA accommodation details (if applicable)</li>
                </ul>

                <h3 className="text-xl font-montserrat-semibold text-white mb-3 mt-6">
                  3.4 Information From Support Coordinators
                </h3>
                <ul className="list-disc list-inside text-gray-300 space-y-2 mb-4">
                  <li>Full name, date of birth, and contact details</li>
                  <li>Professional qualifications and registrations</li>
                  <li>Organizational affiliation (if applicable)</li>
                  <li>Information about Participants they support</li>
                  <li>Referral tracking information</li>
                  <li>Profile information</li>
                </ul>

                <h3 className="text-xl font-montserrat-semibold text-white mb-3 mt-6">
                  3.5 Information Collected Automatically
                </h3>
                <p className="text-gray-300 leading-relaxed mb-4">
                  We automatically collect certain information to understand
                  platform usage and improve functionality:
                </p>
                <ul className="list-disc list-inside text-gray-300 space-y-2 mb-4">
                  <li>Device information (type, OS, browser)</li>
                  <li>IP address and location data</li>
                  <li>
                    Usage data (pages visited, features used, time spent)
                  </li>
                  <li>Technical data (performance metrics, error messages)</li>
                  <li>
                    Cookies and tracking technologies (session, persistent,
                    analytics)
                  </li>
                </ul>

                <h3 className="text-xl font-montserrat-semibold text-white mb-3 mt-6">
                  3.6 Information From Third Parties
                </h3>
                <p className="text-gray-300 leading-relaxed mb-4">
                  We collect information from third parties for verification and
                  safety:
                </p>
                <ul className="list-disc list-inside text-gray-300 space-y-2">
                  <li>Background check providers</li>
                  <li>
                    Identity verification services (Australian Government's
                    Document Verification Service)
                  </li>
                  <li>NDIS plan managers and coordinators</li>
                  <li>Healthcare providers (Framer Health)</li>
                  <li>Referees and previous employers</li>
                  <li>Government agencies</li>
                  <li>Other Platform users (reviews, reports)</li>
                </ul>
              </section>

              {/* 4. How We Use Your Information */}
              <section className="mb-10">
                <h2 className="text-2xl md:text-3xl font-montserrat-bold text-white mb-4">
                  4. How We Use Your Information
                </h2>
                <p className="text-gray-300 leading-relaxed mb-4">
                  We use your personal information for various purposes
                  connected to operating the Platform:
                </p>

                <h3 className="text-xl font-montserrat-semibold text-white mb-3 mt-6">
                  Platform Operations
                </h3>
                <ul className="list-disc list-inside text-gray-300 space-y-2 mb-4">
                  <li>Creating and managing your Account and profile</li>
                  <li>Verifying your identity and conducting background checks</li>
                  <li>
                    Connecting Participants with suitable Support Workers and
                    Providers
                  </li>
                  <li>Facilitating secure in-app communication</li>
                  <li>Processing and managing bookings</li>
                  <li>
                    Enabling workforce management features (RosterRelay
                    integration)
                  </li>
                  <li>Providing customer support</li>
                </ul>

                <h3 className="text-xl font-montserrat-semibold text-white mb-3 mt-6">
                  Platform Improvement
                </h3>
                <ul className="list-disc list-inside text-gray-300 space-y-2 mb-4">
                  <li>Analyzing feature usage and identifying improvements</li>
                  <li>Testing new features and functionality</li>
                  <li>Personalizing your Platform experience</li>
                  <li>Conducting user research and gathering feedback</li>
                </ul>

                <h3 className="text-xl font-montserrat-semibold text-white mb-3 mt-6">
                  Safety and Security
                </h3>
                <ul className="list-disc list-inside text-gray-300 space-y-2 mb-4">
                  <li>Monitoring for suspicious activity or Terms violations</li>
                  <li>Investigating reports and complaints</li>
                  <li>
                    Identifying and preventing fraud, spam, or unauthorized
                    access
                  </li>
                  <li>Maintaining user verification systems</li>
                  <li>Enforcing our Terms and policies</li>
                </ul>

                <h3 className="text-xl font-montserrat-semibold text-white mb-3 mt-6">
                  Legal Compliance
                </h3>
                <ul className="list-disc list-inside text-gray-300 space-y-2 mb-4">
                  <li>
                    Reporting to the NDIS Quality and Safeguards Commission
                  </li>
                  <li>Responding to legal process and court orders</li>
                  <li>Meeting record-keeping obligations</li>
                  <li>Conducting audits and maintaining compliance records</li>
                </ul>

                <h3 className="text-xl font-montserrat-semibold text-white mb-3 mt-6">
                  AI and Technology
                </h3>
                <p className="text-gray-300 leading-relaxed mb-4">
                  We use AI to enhance Platform functionality:
                </p>
                <ul className="list-disc list-inside text-gray-300 space-y-2 mb-4">
                  <li>
                    Improving matching between Participants and Support Workers
                  </li>
                  <li>Providing AI-powered chatbot support</li>
                  <li>Analyzing usage patterns and detecting unusual activity</li>
                  <li>Personalizing your Platform experience</li>
                </ul>
                <p className="text-gray-300 leading-relaxed">
                  <strong className="text-white">Important:</strong> All
                  AI-assisted decisions involve human oversight. Significant
                  decisions are reviewed and made by human staff members.
                </p>
              </section>

              {/* 5. How We Share Your Information */}
              <section className="mb-10">
                <h2 className="text-2xl md:text-3xl font-montserrat-bold text-white mb-4">
                  5. How We Share Your Information
                </h2>

                <h3 className="text-xl font-montserrat-semibold text-white mb-3 mt-6">
                  5.1 Information Sharing Between Platform Users
                </h3>
                <p className="text-gray-300 leading-relaxed mb-4">
                  We share information between users to facilitate connections:
                </p>
                <ul className="list-disc list-inside text-gray-300 space-y-2 mb-4">
                  <li>
                    <strong className="text-white">In search results:</strong>{" "}
                    Limited profile information (first name, location, services,
                    ratings)
                  </li>
                  <li>
                    <strong className="text-white">
                      When reviewing matches:
                    </strong>{" "}
                    More detailed profiles and qualification summaries
                  </li>
                  <li>
                    <strong className="text-white">After connection:</strong>{" "}
                    Full contact details and relevant background information
                  </li>
                  <li>
                    <strong className="text-white">Messages:</strong> Visible to
                    sender and recipient only
                  </li>
                </ul>

                <h3 className="text-xl font-montserrat-semibold text-white mb-3 mt-6">
                  5.2 Information Sharing with Service Providers
                </h3>
                <p className="text-gray-300 leading-relaxed mb-4">
                  We share information with trusted third-party service
                  providers:
                </p>
                <ul className="list-disc list-inside text-gray-300 space-y-2 mb-4">
                  <li>Verification and background check providers</li>
                  <li>Platform hosting and technology service providers</li>
                  <li>Customer support and communication platforms</li>
                  <li>Analytics and performance monitoring services</li>
                  <li>Security and fraud prevention services</li>
                </ul>

                <h3 className="text-xl font-montserrat-semibold text-white mb-3 mt-6">
                  5.3 Information Sharing with Healthcare Partners
                </h3>
                <p className="text-gray-300 leading-relaxed mb-4">
                  We may share relevant information with Framer Health (our
                  allied health partner) with your explicit consent for care
                  coordination purposes.
                </p>

                <h3 className="text-xl font-montserrat-semibold text-white mb-3 mt-6">
                  5.4 Information Sharing with RosterRelay
                </h3>
                <p className="text-gray-300 leading-relaxed mb-4">
                  Providers using RosterRelay integration share workforce
                  information with RosterRelay for automated shift allocation,
                  subject to Support Worker consent.
                </p>

                <h3 className="text-xl font-montserrat-semibold text-white mb-3 mt-6">
                  5.5 Legal Requirements and Safety Disclosures
                </h3>
                <p className="text-gray-300 leading-relaxed mb-4">
                  We may disclose information when:
                </p>
                <ul className="list-disc list-inside text-gray-300 space-y-2">
                  <li>Required by law (court orders, subpoenas)</li>
                  <li>
                    Necessary to report to the NDIS Quality and Safeguards
                    Commission
                  </li>
                  <li>Needed to protect safety or prevent harm</li>
                  <li>Required to investigate or prevent fraud or illegal activity</li>
                  <li>Necessary to enforce our Terms or protect our legal rights</li>
                </ul>
              </section>

              {/* 6. How We Protect Your Information */}
              <section className="mb-10">
                <h2 className="text-2xl md:text-3xl font-montserrat-bold text-white mb-4">
                  6. How We Protect Your Information
                </h2>
                <p className="text-gray-300 leading-relaxed mb-4">
                  We implement comprehensive security measures to protect your
                  information:
                </p>

                <h3 className="text-xl font-montserrat-semibold text-white mb-3 mt-6">
                  Technical Security
                </h3>
                <ul className="list-disc list-inside text-gray-300 space-y-2 mb-4">
                  <li>
                    Encryption of data in transit (SSL/TLS) and at rest
                  </li>
                  <li>Secure authentication with strong password requirements</li>
                  <li>Regular security updates and patches</li>
                  <li>Intrusion detection and prevention systems</li>
                  <li>Automated backup systems with secure offsite storage</li>
                </ul>

                <h3 className="text-xl font-montserrat-semibold text-white mb-3 mt-6">
                  Organizational Security
                </h3>
                <ul className="list-disc list-inside text-gray-300 space-y-2 mb-4">
                  <li>Privacy and security training for staff</li>
                  <li>Background checks for employees</li>
                  <li>Role-based access controls</li>
                  <li>Incident response procedures</li>
                  <li>Regular security audits and assessments</li>
                </ul>

                <h3 className="text-xl font-montserrat-semibold text-white mb-3 mt-6">
                  Your Responsibilities
                </h3>
                <ul className="list-disc list-inside text-gray-300 space-y-2">
                  <li>Use strong, unique passwords</li>
                  <li>Enable multi-factor authentication if available</li>
                  <li>Log out when using shared devices</li>
                  <li>Be cautious about phishing attempts</li>
                  <li>Keep your device and applications updated</li>
                  <li>Never share your login credentials</li>
                </ul>
              </section>

              {/* 7. Data Retention */}
              <section className="mb-10">
                <h2 className="text-2xl md:text-3xl font-montserrat-bold text-white mb-4">
                  7. Data Retention
                </h2>
                <p className="text-gray-300 leading-relaxed mb-4">
                  We retain your personal information only as long as necessary:
                </p>
                <ul className="list-disc list-inside text-gray-300 space-y-2 mb-4">
                  <li>
                    <strong className="text-white">Account information:</strong>{" "}
                    Duration of active account plus 7 years
                  </li>
                  <li>
                    <strong className="text-white">
                      Verification documents:
                    </strong>{" "}
                    Duration of account plus 7 years
                  </li>
                  <li>
                    <strong className="text-white">
                      Messages and communications:
                    </strong>{" "}
                    Duration of account plus 3 years
                  </li>
                  <li>
                    <strong className="text-white">Transaction records:</strong>{" "}
                    7 years (tax compliance)
                  </li>
                  <li>
                    <strong className="text-white">Incident reports:</strong> 7
                    years or longer if required
                  </li>
                  <li>
                    <strong className="text-white">Reviews and ratings:</strong>{" "}
                    Retained indefinitely (may be anonymized)
                  </li>
                  <li>
                    <strong className="text-white">Usage data:</strong> 2 years
                    (then aggregated/anonymized)
                  </li>
                </ul>
              </section>

              {/* 8. Your Privacy Rights */}
              <section className="mb-10">
                <h2 className="text-2xl md:text-3xl font-montserrat-bold text-white mb-4">
                  8. Your Privacy Rights
                </h2>
                <p className="text-gray-300 leading-relaxed mb-4">
                  Under Australian privacy law, you have several rights:
                </p>

                <h3 className="text-xl font-montserrat-semibold text-white mb-3 mt-6">
                  Right to Access
                </h3>
                <p className="text-gray-300 leading-relaxed mb-4">
                  You can request copies of your personal information and
                  details about how we've used it. Contact{" "}
                  <a
                    href="mailto:privacy@support24.com.au"
                    className="text-primary hover:underline"
                  >
                    privacy@support24.com.au
                  </a>
                  . We respond within 30 days.
                </p>

                <h3 className="text-xl font-montserrat-semibold text-white mb-3 mt-6">
                  Right to Correction
                </h3>
                <p className="text-gray-300 leading-relaxed mb-4">
                  You can update information in your Account settings or request
                  corrections through{" "}
                  <a
                    href="mailto:privacy@support24.com.au"
                    className="text-primary hover:underline"
                  >
                    privacy@support24.com.au
                  </a>
                  .
                </p>

                <h3 className="text-xl font-montserrat-semibold text-white mb-3 mt-6">
                  Right to Delete
                </h3>
                <p className="text-gray-300 leading-relaxed mb-4">
                  You can request deletion of your Account and information,
                  subject to retention requirements.
                </p>

                <h3 className="text-xl font-montserrat-semibold text-white mb-3 mt-6">
                  Right to Complain
                </h3>
                <p className="text-gray-300 leading-relaxed mb-4">
                  Contact our Privacy Officer first. If not satisfied, you can
                  complain to:
                </p>
                <ul className="list-disc list-inside text-gray-300 space-y-2 mb-4">
                  <li>
                    Office of the Australian Information Commissioner (OAIC):{" "}
                    <a
                      href="tel:1300363992"
                      className="text-primary hover:underline"
                    >
                      1300 363 992
                    </a>
                  </li>
                  <li>
                    NDIS Quality and Safeguards Commission:{" "}
                    <a
                      href="tel:1800035544"
                      className="text-primary hover:underline"
                    >
                      1800 035 544
                    </a>
                  </li>
                </ul>

                <h3 className="text-xl font-montserrat-semibold text-white mb-3 mt-6">
                  Right to Opt Out
                </h3>
                <p className="text-gray-300 leading-relaxed">
                  You can opt out of marketing communications while still
                  receiving essential Account communications.
                </p>
              </section>

              {/* 9. Cookies and Tracking Technologies */}
              <section className="mb-10">
                <h2 className="text-2xl md:text-3xl font-montserrat-bold text-white mb-4">
                  9. Cookies and Tracking Technologies
                </h2>
                <p className="text-gray-300 leading-relaxed mb-4">
                  We use cookies and similar technologies to enable
                  functionality and improve user experience:
                </p>

                <h3 className="text-xl font-montserrat-semibold text-white mb-3 mt-6">
                  Types of Cookies
                </h3>
                <ul className="list-disc list-inside text-gray-300 space-y-2 mb-4">
                  <li>
                    <strong className="text-white">Essential cookies:</strong>{" "}
                    Required for platform functionality (login, security)
                  </li>
                  <li>
                    <strong className="text-white">Functional cookies:</strong>{" "}
                    Remember preferences and settings
                  </li>
                  <li>
                    <strong className="text-white">Analytics cookies:</strong>{" "}
                    Understand usage patterns and improve features
                  </li>
                </ul>

                <h3 className="text-xl font-montserrat-semibold text-white mb-3 mt-6">
                  Cookie Control
                </h3>
                <p className="text-gray-300 leading-relaxed">
                  You can control cookies through your browser settings, though
                  disabling some cookies may affect platform functionality.
                </p>
              </section>

              {/* 10. International Data Transfers */}
              <section className="mb-10">
                <h2 className="text-2xl md:text-3xl font-montserrat-bold text-white mb-4">
                  10. International Data Transfers
                </h2>
                <p className="text-gray-300 leading-relaxed mb-4">
                  Support24 operates within Australia, with servers and data
                  storage located in Australia. However, some service providers
                  may process or store data overseas.
                </p>
                <p className="text-gray-300 leading-relaxed">
                  When we transfer information internationally, we implement
                  safeguards including assessing privacy laws, using contractual
                  protections, encrypting data, and conducting due diligence on
                  overseas recipients.
                </p>
              </section>

              {/* 11. Information About Children and Minors */}
              <section className="mb-10">
                <h2 className="text-2xl md:text-3xl font-montserrat-bold text-white mb-4">
                  11. Information About Children and Minors
                </h2>
                <p className="text-gray-300 leading-relaxed mb-4">
                  Support24 is designed for adults aged 18 and over. Minors
                  under 18 cannot create accounts independently.
                </p>
                <p className="text-gray-300 leading-relaxed mb-4">
                  If you are under 18, your parent, guardian, or authorized
                  representative must create and manage the Account on your
                  behalf. We take additional privacy precautions when minors are
                  involved.
                </p>
                <p className="text-gray-300 leading-relaxed">
                  Parents or guardians with concerns should contact{" "}
                  <a
                    href="mailto:privacy@support24.com.au"
                    className="text-primary hover:underline"
                  >
                    privacy@support24.com.au
                  </a>
                  .
                </p>
              </section>

              {/* 12. Changes to This Privacy Policy */}
              <section className="mb-10">
                <h2 className="text-2xl md:text-3xl font-montserrat-bold text-white mb-4">
                  12. Changes to This Privacy Policy
                </h2>
                <p className="text-gray-300 leading-relaxed mb-4">
                  We may update this Privacy Policy to reflect changes in our
                  practices, technology, or legal requirements. Material changes
                  will be notified at least 30 days in advance via:
                </p>
                <ul className="list-disc list-inside text-gray-300 space-y-2 mb-4">
                  <li>Email to your registered address</li>
                  <li>Prominent notice on the Platform</li>
                  <li>In-app notification</li>
                </ul>
                <p className="text-gray-300 leading-relaxed">
                  Continued use after changes take effect constitutes acceptance
                  of the updated Privacy Policy.
                </p>
              </section>

              {/* 13. Contact Us */}
              <section className="mb-10">
                <h2 className="text-2xl md:text-3xl font-montserrat-bold text-white mb-4">
                  13. Contact Us
                </h2>
                <p className="text-gray-300 leading-relaxed mb-4">
                  If you have questions or concerns about this Privacy Policy:
                </p>

                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-montserrat-semibold text-white mb-2">
                      Privacy Officer
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
                      General Inquiries
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
                      Incident Reports
                    </h3>
                    <p className="text-gray-300">
                      Email:{" "}
                      <a
                        href="mailto:incidents@support24.com.au"
                        className="text-primary hover:underline"
                      >
                        incidents@support24.com.au
                      </a>{" "}
                      (Urgent safety matters only)
                    </p>
                  </div>

                  <div>
                    <h3 className="text-lg font-montserrat-semibold text-white mb-2">
                      Support24 
                    </h3>
                    <p className="text-gray-300">ABN: 19673683817</p>
                  </div>
                </div>
              </section>

              {/* Footer */}
              <div className="mt-12 pt-8 border-t border-white/10">
                <p className="text-gray-400 text-sm text-center mb-4">
                  We aim to acknowledge all privacy inquiries within two
                  business days and provide substantive responses within 30
                  days.
                </p>
                <p className="text-gray-500 text-xs text-center">
                  © 2025 Support24 . All rights reserved.
                </p>
                <p className="text-gray-500 text-xs text-center mt-2">
                  Version: 2.0 | Effective: 10 November 2025 | Last Updated: 10
                  November 2025
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

