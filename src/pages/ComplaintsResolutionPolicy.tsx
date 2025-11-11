import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { LandingLayout } from "@/components/layouts/LandingLayout";
import { Button } from "@/components/ui/button";
import { ArrowLeft, MessageSquare } from "lucide-react";

export default function ComplaintsResolutionPolicy() {
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
              <MessageSquare className="w-10 h-10 text-primary" />
              <h1 className="text-4xl md:text-5xl font-bold text-white">
                Complaints & Dispute Resolution Policy
              </h1>
            </div>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 text-gray-400">
              <p className="text-sm">Version: 1.0</p>
              <span className="hidden sm:inline">•</span>
              <p className="text-sm">Effective Date: 10 November 2025</p>
              <span className="hidden sm:inline">•</span>
              <p className="text-sm">Last Updated: 10 November 2025</p>
            </div>
            <p className="text-sm text-gray-400 mt-2">
              Policy Owner: Chief Customer Experience Officer | Review Date: 10
              November 2026
            </p>
          </div>

          {/* Content */}
          <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 md:p-12 border border-white/10 shadow-2xl">
            <div className="prose prose-invert prose-lg max-w-none">
              {/* 1. Purpose and Scope */}
              <section className="mb-10">
                <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
                  1. Purpose and Scope
                </h2>

                <h3 className="text-xl font-semibold text-white mb-3 mt-6">
                  1.1 Purpose
                </h3>
                <p className="text-gray-300 leading-relaxed mb-4">
                  This Complaints and Dispute Resolution Policy establishes
                  Support24's framework for receiving, assessing, investigating,
                  and resolving complaints and disputes in a fair, transparent,
                  and timely manner.
                </p>
                <div className="bg-primary/10 border border-primary/30 rounded-lg p-4 mb-4">
                  <p className="text-gray-300 mb-2">
                    <strong className="text-white">
                      Support24 is committed to:
                    </strong>
                  </p>
                  <ul className="list-disc list-inside text-gray-300 space-y-1">
                    <li>Listening to the voices of platform users</li>
                    <li>Addressing concerns constructively</li>
                    <li>Maintaining accountability for our services</li>
                    <li>Supporting positive relationships between users</li>
                    <li>Learning from feedback to drive improvement</li>
                    <li>Complying with regulatory requirements</li>
                  </ul>
                </div>

                <h3 className="text-xl font-semibold text-white mb-3 mt-6">
                  1.2 Scope
                </h3>
                <p className="text-gray-300 leading-relaxed mb-4">
                  This policy applies to all complaints and disputes involving:
                </p>
                <ul className="list-disc list-inside text-gray-300 space-y-2 mb-4">
                  <li>Support24 platform and its operation</li>
                  <li>Support24 policies, procedures, or decisions</li>
                  <li>Conduct of platform users</li>
                  <li>Disputes between platform users</li>
                </ul>

                <h3 className="text-xl font-semibold text-white mb-3 mt-6">
                  1.3 Relationship to Incident Management
                </h3>
                <div className="bg-yellow-900/20 border border-yellow-500/30 rounded-lg p-4 mb-4">
                  <p className="text-gray-300 mb-2">
                    <strong className="text-white">Key Distinction:</strong>
                  </p>
                  <ul className="list-disc list-inside text-gray-300 space-y-2">
                    <li>
                      <strong className="text-white">Incidents:</strong> Events
                      causing harm or serious safety risks (see{" "}
                      <Link
                        to="/incident-management-policy"
                        className="text-primary hover:underline"
                      >
                        Incident Management Policy
                      </Link>
                      )
                    </li>
                    <li>
                      <strong className="text-white">Complaints:</strong>{" "}
                      Expressions of dissatisfaction about services, decisions,
                      or conduct
                    </li>
                  </ul>
                </div>
              </section>

              {/* 2. Definitions */}
              <section className="mb-10">
                <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
                  2. Definitions
                </h2>
                <div className="space-y-4">
                  <div>
                    <h3 className="text-xl font-semibold text-white mb-2">
                      Complaint
                    </h3>
                    <p className="text-gray-300 leading-relaxed">
                      An expression of dissatisfaction about Support24's
                      services, platform operations, policies, decisions, or the
                      conduct of staff or users, where a response or resolution
                      is expected.
                    </p>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-white mb-2">
                      Dispute
                    </h3>
                    <p className="text-gray-300 leading-relaxed">
                      A disagreement between two or more parties about rights,
                      obligations, arrangements, or conduct where parties have
                      been unable to resolve the matter themselves.
                    </p>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-white mb-2">
                      Natural Justice
                    </h3>
                    <p className="text-gray-300 leading-relaxed mb-2">
                      Procedural fairness in decision-making, including:
                    </p>
                    <ul className="list-disc list-inside text-gray-300 space-y-1">
                      <li>Right to be heard</li>
                      <li>Right to an unbiased decision-maker</li>
                      <li>Right to clear reasoning</li>
                    </ul>
                  </div>
                </div>
              </section>

              {/* 3. Types of Complaints */}
              <section className="mb-10">
                <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
                  3. Types of Complaints
                </h2>

                <h3 className="text-xl font-semibold text-white mb-3 mt-6">
                  3.1 Complaints About Support24
                </h3>
                <ul className="list-disc list-inside text-gray-300 space-y-2 mb-4">
                  <li>Platform functionality and technical issues</li>
                  <li>Account and verification matters</li>
                  <li>Customer service and communication</li>
                  <li>Privacy and data handling</li>
                  <li>Billing and payments</li>
                  <li>Content moderation and platform governance</li>
                  <li>Policy and decision-making</li>
                </ul>

                <h3 className="text-xl font-semibold text-white mb-3 mt-6">
                  3.2 Complaints About Platform Users
                </h3>
                <ul className="list-disc list-inside text-gray-300 space-y-2 mb-4">
                  <li>Support worker conduct and performance</li>
                  <li>Provider practices and management</li>
                  <li>Participant behavior</li>
                  <li>Support coordinator practices</li>
                  <li>Inappropriate content</li>
                </ul>

                <h3 className="text-xl font-semibold text-white mb-3 mt-6">
                  3.3 Systemic Complaints
                </h3>
                <div className="bg-blue-900/20 border border-blue-500/30 rounded-lg p-4">
                  <p className="text-gray-300 mb-2">
                    <strong className="text-white">
                      Systemic complaints are particularly valuable
                    </strong>{" "}
                    as they identify patterns, trends, or system-wide issues
                    that require organizational attention. These may include:
                  </p>
                  <ul className="list-disc list-inside text-gray-300 space-y-1">
                    <li>Policy gaps or ambiguities</li>
                    <li>Training or competency issues</li>
                    <li>Operational inefficiencies</li>
                    <li>Communication problems</li>
                    <li>Discrimination or accessibility barriers</li>
                  </ul>
                </div>
              </section>

              {/* 4. Who Can Make a Complaint */}
              <section className="mb-10">
                <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
                  4. Who Can Make a Complaint
                </h2>
                <p className="text-gray-300 leading-relaxed mb-4">
                  Support24 accepts complaints from:
                </p>
                <ul className="list-disc list-inside text-gray-300 space-y-2 mb-4">
                  <li>
                    <strong className="text-white">Platform Users:</strong> All
                    registered users (Participants, Support Workers, Providers,
                    Coordinators)
                  </li>
                  <li>
                    <strong className="text-white">
                      Families and Representatives:
                    </strong>{" "}
                    With appropriate authority
                  </li>
                  <li>
                    <strong className="text-white">Third Parties:</strong> With
                    legitimate interest (advocates, family members, health
                    professionals)
                  </li>
                  <li>
                    <strong className="text-white">Staff and Contractors:</strong>{" "}
                    About workplace matters or organizational concerns
                  </li>
                </ul>
                <p className="text-gray-300 leading-relaxed">
                  We also accept anonymous complaints, though this may limit our
                  ability to investigate and provide outcomes.
                </p>
              </section>

              {/* 5. How to Make a Complaint */}
              <section className="mb-10">
                <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
                  5. How to Make a Complaint
                </h2>

                <h3 className="text-xl font-semibold text-white mb-3 mt-6">
                  5.1 Complaint Channels
                </h3>
                <div className="space-y-3 mb-4">
                  <div className="bg-primary/10 border border-primary/30 rounded-lg p-4">
                    <h4 className="text-lg font-semibold text-white mb-2">
                      Email (Recommended)
                    </h4>
                    <p className="text-gray-300">
                      <a
                        href="mailto:complaints@support24.com.au"
                        className="text-primary hover:underline"
                      >
                        complaints@support24.com.au
                      </a>
                    </p>
                    <p className="text-gray-300 text-sm mt-1">
                      Monitored daily, suitable for most complaints
                    </p>
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-white mb-2">
                      Phone
                    </h4>
                    <p className="text-gray-300">
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
                    <h4 className="text-lg font-semibold text-white mb-2">
                      Online Form
                    </h4>
                    <p className="text-gray-300">
                      <a
                        href="https://www.support24.com.au/complaints"
                        className="text-primary hover:underline"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        www.support24.com.au/complaints
                      </a>
                    </p>
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-white mb-2">
                      In-App
                    </h4>
                    <p className="text-gray-300">
                      Settings → Help → Make a Complaint
                    </p>
                  </div>
                </div>

                <h3 className="text-xl font-semibold text-white mb-3 mt-6">
                  5.2 What Information to Include
                </h3>
                <ul className="list-disc list-inside text-gray-300 space-y-2 mb-4">
                  <li>Your personal details and contact information</li>
                  <li>Support24 account details</li>
                  <li>Clear description of what happened</li>
                  <li>When and where it occurred</li>
                  <li>Who was involved</li>
                  <li>How you were affected</li>
                  <li>Supporting evidence (if available)</li>
                  <li>Desired outcome or resolution</li>
                </ul>

                <h3 className="text-xl font-semibold text-white mb-3 mt-6">
                  5.3 Assistance Available
                </h3>
                <p className="text-gray-300 leading-relaxed">
                  Support24 provides assistance for users who need help making
                  complaints, including phone support, in-person meetings,
                  advocacy referrals, interpreter services, and accessible
                  formats.
                </p>
              </section>

              {/* 6. Complaint Assessment */}
              <section className="mb-10">
                <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
                  6. Complaint Assessment and Triage
                </h2>

                <h3 className="text-xl font-semibold text-white mb-3 mt-6">
                  6.1 Acknowledgment
                </h3>
                <div className="bg-green-900/20 border border-green-500/30 rounded-lg p-4 mb-4">
                  <p className="text-gray-300">
                    All complaints are acknowledged within{" "}
                    <strong className="text-white">2 business days</strong>,
                    providing a complaint reference number and indicating the
                    likely timeframe for response.
                  </p>
                </div>

                <h3 className="text-xl font-semibold text-white mb-3 mt-6">
                  6.2 Complaint Categories
                </h3>
                <div className="space-y-3">
                  <div>
                    <h4 className="text-lg font-semibold text-white mb-2">
                      Category 1: Urgent (24-48 hours)
                    </h4>
                    <p className="text-gray-300">
                      Immediate action required due to risk, distress, or
                      time-sensitivity
                    </p>
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-white mb-2">
                      Category 2: Serious (20 business days)
                    </h4>
                    <p className="text-gray-300">
                      Significant misconduct, serious breaches, complex disputes
                    </p>
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-white mb-2">
                      Category 3: Standard (15 business days)
                    </h4>
                    <p className="text-gray-300">
                      Service quality, platform issues, routine disputes
                    </p>
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-white mb-2">
                      Category 4: Straightforward (5 business days)
                    </h4>
                    <p className="text-gray-300">
                      Quick resolution through explanation or simple action
                    </p>
                  </div>
                </div>
              </section>

              {/* 7. Early Resolution */}
              <section className="mb-10">
                <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
                  7. Early Resolution
                </h2>
                <p className="text-gray-300 leading-relaxed mb-4">
                  Support24 prioritizes early resolution wherever appropriate as
                  it is faster, less formal, less stressful, and more likely to
                  maintain positive relationships.
                </p>

                <h3 className="text-xl font-semibold text-white mb-3 mt-6">
                  Early Resolution Approaches
                </h3>
                <ul className="list-disc list-inside text-gray-300 space-y-2">
                  <li>
                    <strong className="text-white">
                      Direct communication:
                    </strong>{" "}
                    Providing clear information and explanation
                  </li>
                  <li>
                    <strong className="text-white">
                      Acknowledgment and apology:
                    </strong>{" "}
                    Recognizing shortcomings and poor experiences
                  </li>
                  <li>
                    <strong className="text-white">
                      Facilitated communication:
                    </strong>{" "}
                    Supporting parties to discuss and resolve
                  </li>
                  <li>
                    <strong className="text-white">Practical remedies:</strong>{" "}
                    Implementing quick fixes and corrective action
                  </li>
                  <li>
                    <strong className="text-white">
                      Problem-solving meetings:
                    </strong>{" "}
                    Collaborative discussions to find solutions
                  </li>
                </ul>
              </section>

              {/* 8. Formal Investigation */}
              <section className="mb-10">
                <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
                  8. Formal Investigation
                </h2>
                <p className="text-gray-300 leading-relaxed mb-4">
                  When complaints cannot be resolved early or involve serious
                  allegations, Support24 conducts formal investigations in
                  accordance with natural justice principles.
                </p>

                <h3 className="text-xl font-semibold text-white mb-3 mt-6">
                  8.1 Investigation Principles
                </h3>
                <ul className="list-disc list-inside text-gray-300 space-y-2 mb-4">
                  <li>
                    <strong className="text-white">
                      Fairness and impartiality:
                    </strong>{" "}
                    No conflicts of interest, objective assessment
                  </li>
                  <li>
                    <strong className="text-white">Thoroughness:</strong>{" "}
                    Evidence-based findings on balance of probabilities
                  </li>
                  <li>
                    <strong className="text-white">Procedural fairness:</strong>{" "}
                    Parties can respond to allegations
                  </li>
                  <li>
                    <strong className="text-white">Timeliness:</strong> As
                    quickly as possible with regular updates
                  </li>
                  <li>
                    <strong className="text-white">Confidentiality:</strong>{" "}
                    Information shared only with those who need to know
                  </li>
                </ul>

                <h3 className="text-xl font-semibold text-white mb-3 mt-6">
                  8.2 Investigation Process
                </h3>
                <ol className="list-decimal list-inside text-gray-300 space-y-2 mb-4">
                  <li>Develop investigation plan</li>
                  <li>Gather documentary evidence</li>
                  <li>Conduct interviews with parties and witnesses</li>
                  <li>Analyze evidence on balance of probabilities</li>
                  <li>Prepare investigation report with findings</li>
                  <li>Communicate outcomes to parties</li>
                </ol>

                <h3 className="text-xl font-semibold text-white mb-3 mt-6">
                  8.3 Timeframes
                </h3>
                <p className="text-gray-300 leading-relaxed">
                  Support24 aims to complete formal investigations within{" "}
                  <strong className="text-white">20 business days</strong>.
                  Complex investigations may take longer with regular updates
                  provided.
                </p>
              </section>

              {/* 9. Resolution Options and Remedies */}
              <section className="mb-10">
                <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
                  9. Resolution Options and Remedies
                </h2>
                <p className="text-gray-300 leading-relaxed mb-4">
                  When complaints are substantiated, various remedies may be
                  implemented:
                </p>
                <ul className="list-disc list-inside text-gray-300 space-y-2 mb-4">
                  <li>
                    <strong className="text-white">
                      Apologies and acknowledgment:
                    </strong>{" "}
                    Sincere recognition of shortcomings
                  </li>
                  <li>
                    <strong className="text-white">Corrective action:</strong>{" "}
                    Reversing decisions, reinstating accounts, updating records
                  </li>
                  <li>
                    <strong className="text-white">Compensation:</strong>{" "}
                    Financial remedies for documented loss, fee waivers,
                    reimbursement
                  </li>
                  <li>
                    <strong className="text-white">
                      Systemic improvements:
                    </strong>{" "}
                    Policy changes, training, technology enhancements
                  </li>
                  <li>
                    <strong className="text-white">Disciplinary action:</strong>{" "}
                    Warnings, suspensions, or terminations where appropriate
                  </li>
                </ul>
              </section>

              {/* 10. Mediation and ADR */}
              <section className="mb-10">
                <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
                  10. Mediation and Alternative Dispute Resolution
                </h2>
                <p className="text-gray-300 leading-relaxed mb-4">
                  For disputes between platform users, mediation or alternative
                  dispute resolution may be appropriate.
                </p>

                <h3 className="text-xl font-semibold text-white mb-3 mt-6">
                  When Mediation May Help
                </h3>
                <ul className="list-disc list-inside text-gray-300 space-y-2 mb-4">
                  <li>Conflicting accounts where facts are disputed</li>
                  <li>Relationships are important and worth preserving</li>
                  <li>Creative solutions needed</li>
                  <li>Parties willing to participate constructively</li>
                </ul>

                <h3 className="text-xl font-semibold text-white mb-3 mt-6">
                  External Mediation Services
                </h3>
                <ul className="list-disc list-inside text-gray-300 space-y-2">
                  <li>Community Justice Centres (free or low-cost)</li>
                  <li>NDIS dispute resolution services</li>
                  <li>Aged care external complaints schemes</li>
                  <li>Private mediators</li>
                </ul>
              </section>

              {/* 11. Review and Appeals */}
              <section className="mb-10">
                <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
                  11. Review and Appeals
                </h2>
                <p className="text-gray-300 leading-relaxed mb-4">
                  Complainants dissatisfied with outcomes can request:
                </p>

                <h3 className="text-xl font-semibold text-white mb-3 mt-6">
                  11.1 Internal Review (15 business days)
                </h3>
                <p className="text-gray-300 leading-relaxed mb-4">
                  Request within 14 days if you believe investigation was
                  inadequate, findings unsupported, or remedies insufficient.
                  Send to{" "}
                  <a
                    href="mailto:complaints@support24.com.au"
                    className="text-primary hover:underline"
                  >
                    complaints@support24.com.au
                  </a>
                </p>

                <h3 className="text-xl font-semibold text-white mb-3 mt-6">
                  11.2 CEO Review (20 business days)
                </h3>
                <p className="text-gray-300 leading-relaxed mb-4">
                  For serious complaints with significant policy implications.
                  Email{" "}
                  <a
                    href="mailto:ceo@support24.com.au"
                    className="text-primary hover:underline"
                  >
                    ceo@support24.com.au
                  </a>
                </p>

                <h3 className="text-xl font-semibold text-white mb-3 mt-6">
                  11.3 Board Review (30-60 days)
                </h3>
                <p className="text-gray-300 leading-relaxed">
                  In exceptional circumstances involving systemic issues or
                  organizational liability. Contact{" "}
                  <a
                    href="mailto:board@support24.com.au"
                    className="text-primary hover:underline"
                  >
                    board@support24.com.au
                  </a>
                </p>
              </section>

              {/* 12. External Escalation */}
              <section className="mb-10">
                <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
                  12. External Escalation Options
                </h2>
                <p className="text-gray-300 leading-relaxed mb-4">
                  Support24 respects your right to escalate unresolved
                  complaints to external bodies:
                </p>

                <div className="space-y-4">
                  <div className="bg-primary/10 border border-primary/30 rounded-lg p-4">
                    <h3 className="text-lg font-semibold text-white mb-2">
                      NDIS Quality and Safeguards Commission
                    </h3>
                    <p className="text-gray-300 mb-2">
                      For complaints about NDIS registered providers and
                      services
                    </p>
                    <p className="text-gray-300">
                      Phone:{" "}
                      <a
                        href="tel:1800035544"
                        className="text-primary hover:underline"
                      >
                        1800 035 544
                      </a>
                    </p>
                    <p className="text-gray-300">
                      Website:{" "}
                      <a
                        href="https://www.ndiscommission.gov.au"
                        className="text-primary hover:underline"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        www.ndiscommission.gov.au
                      </a>
                    </p>
                  </div>

                  <div className="bg-primary/10 border border-primary/30 rounded-lg p-4">
                    <h3 className="text-lg font-semibold text-white mb-2">
                      Aged Care Quality and Safety Commission
                    </h3>
                    <p className="text-gray-300 mb-2">
                      For complaints about aged care providers
                    </p>
                    <p className="text-gray-300">
                      Phone:{" "}
                      <a
                        href="tel:1800951822"
                        className="text-primary hover:underline"
                      >
                        1800 951 822
                      </a>
                    </p>
                    <p className="text-gray-300">
                      Website:{" "}
                      <a
                        href="https://www.agedcarequality.gov.au"
                        className="text-primary hover:underline"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        www.agedcarequality.gov.au
                      </a>
                    </p>
                  </div>

                  <div className="bg-primary/10 border border-primary/30 rounded-lg p-4">
                    <h3 className="text-lg font-semibold text-white mb-2">
                      Commonwealth Ombudsman
                    </h3>
                    <p className="text-gray-300 mb-2">
                      For complaints about government agencies or NDIS
                      administration
                    </p>
                    <p className="text-gray-300">
                      Phone:{" "}
                      <a
                        href="tel:1300362072"
                        className="text-primary hover:underline"
                      >
                        1300 362 072
                      </a>
                    </p>
                    <p className="text-gray-300">
                      Website:{" "}
                      <a
                        href="https://www.ombudsman.gov.au"
                        className="text-primary hover:underline"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        www.ombudsman.gov.au
                      </a>
                    </p>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-white mb-2">
                      Additional Resources
                    </h3>
                    <ul className="list-disc list-inside text-gray-300 space-y-1">
                      <li>
                        <strong className="text-white">
                          National Disability Advocacy Program:
                        </strong>{" "}
                        <a
                          href="tel:1800626365"
                          className="text-primary hover:underline"
                        >
                          1800 626 365
                        </a>
                      </li>
                      <li>
                        <strong className="text-white">
                          Community Justice Centres (NSW):
                        </strong>{" "}
                        <a
                          href="tel:1800990777"
                          className="text-primary hover:underline"
                        >
                          1800 990 777
                        </a>
                      </li>
                      <li>
                        <strong className="text-white">
                          Dispute Settlement Centre (VIC):
                        </strong>{" "}
                        <a
                          href="tel:1300372888"
                          className="text-primary hover:underline"
                        >
                          1300 372 888
                        </a>
                      </li>
                    </ul>
                  </div>
                </div>
              </section>

              {/* 13. Confidentiality and Privacy */}
              <section className="mb-10">
                <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
                  13. Confidentiality and Privacy
                </h2>
                <p className="text-gray-300 leading-relaxed mb-4">
                  All complaint information is treated confidentially and used
                  only for:
                </p>
                <ul className="list-disc list-inside text-gray-300 space-y-2 mb-4">
                  <li>Assessing, investigating, and resolving complaints</li>
                  <li>Improving services based on learnings</li>
                  <li>Complying with regulatory requirements</li>
                </ul>
                <div className="bg-green-900/20 border border-green-500/30 rounded-lg p-4">
                  <p className="text-gray-300">
                    <strong className="text-white">
                      Protection for Complainants:
                    </strong>{" "}
                    Support24 will not tolerate retaliation or adverse treatment
                    of complainants. Information is shared only as necessary for
                    investigation and fairness.
                  </p>
                </div>
              </section>

              {/* 14. Learning and Improvement */}
              <section className="mb-10">
                <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
                  14. Learning and Continuous Improvement
                </h2>
                <p className="text-gray-300 leading-relaxed mb-4">
                  Complaints are valuable sources of insight. Support24 uses
                  feedback to:
                </p>
                <ul className="list-disc list-inside text-gray-300 space-y-2">
                  <li>Identify problems and improvement opportunities</li>
                  <li>Develop improvement projects</li>
                  <li>Inform policy reviews and revisions</li>
                  <li>Guide training priorities</li>
                  <li>Direct resource allocation</li>
                  <li>Share learnings with platform users</li>
                </ul>
              </section>

              {/* Footer */}
              <div className="mt-12 pt-8 border-t border-white/10">
                <div className="bg-primary/10 border border-primary/30 rounded-lg p-6 mb-6">
                  <h3 className="text-xl font-semibold text-white mb-3">
                    Contact for Complaints
                  </h3>
                  <div className="space-y-2 text-gray-300">
                    <p>
                      <strong className="text-white">Email:</strong>{" "}
                      <a
                        href="mailto:complaints@support24.com.au"
                        className="text-primary hover:underline"
                      >
                        complaints@support24.com.au
                      </a>
                    </p>
                    <p>
                      <strong className="text-white">Phone:</strong>{" "}
                      <a
                        href="tel:+61348324105"
                        className="text-primary hover:underline"
                      >
                        03 4832 4105
                      </a>{" "}
                      (Mon-Fri, 9 AM - 5 PM AEST/AEDT)
                    </p>
                    <p>
                      <strong className="text-white">Online Form:</strong>{" "}
                      <a
                        href="https://www.support24.com.au/complaints"
                        className="text-primary hover:underline"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        www.support24.com.au/complaints
                      </a>
                    </p>
                  </div>
                </div>

                <div className="bg-blue-900/20 border border-blue-500/30 rounded-lg p-6 mb-6">
                  <h3 className="text-xl font-semibold text-white mb-3">
                    Acknowledgment
                  </h3>
                  <p className="text-gray-300 leading-relaxed">
                    Support24 is committed to continuous improvement and values
                    your feedback. We welcome complaints and treat all
                    complainants with respect, taking their concerns seriously
                    regardless of the nature or complexity of the issue raised.
                    If you have concerns about our services, policies, or
                    decisions, please raise them with us so we can address them
                    and improve our platform for everyone.
                  </p>
                </div>

                <p className="text-gray-500 text-xs text-center">
                  © 2025 Support24 Pty Ltd. All rights reserved. | ABN:
                  19673683817
                </p>
                <p className="text-gray-500 text-xs text-center mt-2">
                  Version: 1.0 | Effective: 10 November 2025 | Last Updated: 10
                  November 2025 | Next Review: 10 November 2026
                </p>
                <p className="text-gray-500 text-xs text-center mt-4">
                  <strong>Related Documents:</strong>{" "}
                  <Link
                    to="/terms-of-use"
                    className="text-primary hover:underline"
                  >
                    Terms of Use
                  </Link>{" "}
                  |{" "}
                  <Link
                    to="/platform-terms"
                    className="text-primary hover:underline"
                  >
                    Platform Terms
                  </Link>{" "}
                  |{" "}
                  <Link
                    to="/privacy-policy"
                    className="text-primary hover:underline"
                  >
                    Privacy Policy
                  </Link>{" "}
                  |{" "}
                  <Link
                    to="/incident-management-policy"
                    className="text-primary hover:underline"
                  >
                    Incident Management Policy
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </LandingLayout>
  );
}

