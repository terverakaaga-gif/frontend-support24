import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { LandingLayout } from "@/components/layouts/LandingLayout";
import { Button } from "@/components/ui/button";
import { ArrowLeft, AlertCircle } from "lucide-react";

export default function IncidentManagementPolicy() {
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
              <AlertCircle className="w-10 h-10 text-primary" />
              <h1 className="text-4xl md:text-5xl font-bold text-white">
                Incident Management Policy
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
              Policy Owner: Chief Safety Officer | Review Date: 10 November 2026
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
                  This Incident Management Policy establishes Support24's
                  framework for preventing, responding to, managing, and
                  learning from incidents involving participants, support
                  workers, providers, and other users of our platform. This
                  policy ensures compliance with the NDIS Quality and Safeguards
                  Commission (NDIS Commission) requirements and the Aged Care
                  Quality and Safety Commission requirements.
                </p>
                <p className="text-gray-300 leading-relaxed mb-4">
                  The primary purposes of this policy are to:
                </p>
                <ul className="list-disc list-inside text-gray-300 space-y-2 mb-4">
                  <li>
                    Protect the health, safety, and wellbeing of all platform
                    users
                  </li>
                  <li>
                    Ensure timely and appropriate responses to incidents
                  </li>
                  <li>
                    Meet regulatory reporting obligations to the NDIS Commission
                    and Aged Care Quality and Safety Commission
                  </li>
                  <li>
                    Establish clear procedures for incident identification,
                    reporting, investigation, and resolution
                  </li>
                  <li>
                    Support affected parties through trauma-informed,
                    person-centered approaches
                  </li>
                  <li>
                    Promote a culture of safety, transparency, and continuous
                    improvement
                  </li>
                  <li>Ensure accountability at all levels of the organization</li>
                </ul>

                <h3 className="text-xl font-semibold text-white mb-3 mt-6">
                  1.2 Scope
                </h3>
                <p className="text-gray-300 leading-relaxed mb-4">
                  This policy applies to all Support24 staff members, directors,
                  and officers, all users of the Support24 platform including
                  NDIS participants, support workers, registered NDIS providers,
                  support coordinators, aged care recipients, and any other
                  person involved in services arranged through Support24.
                </p>

                <h3 className="text-xl font-semibold text-white mb-3 mt-6">
                  1.3 Legislative and Regulatory Framework
                </h3>
                <p className="text-gray-300 leading-relaxed mb-4">
                  This policy is designed to ensure compliance with:
                </p>
                <ul className="list-disc list-inside text-gray-300 space-y-2">
                  <li>National Disability Insurance Scheme Act 2013</li>
                  <li>NDIS (Incident Management and Reportable Incidents) Rules 2018</li>
                  <li>NDIS Code of Conduct</li>
                  <li>NDIS Practice Standards and Quality Indicators</li>
                  <li>Aged Care Act 1997 and Aged Care Quality Standards</li>
                  <li>Serious Incident Response Scheme (SIRS) requirements</li>
                  <li>State and territory work health and safety legislation</li>
                  <li>Privacy Act 1988 (Cth) and Australian Privacy Principles</li>
                </ul>
              </section>

              {/* 2. Definitions */}
              <section className="mb-10">
                <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
                  2. Definitions
                </h2>
                <div className="space-y-4">
                  <div>
                    <h3 className="text-xl font-semibold text-white mb-2">
                      Incident
                    </h3>
                    <p className="text-gray-300 leading-relaxed">
                      Any act, omission, event, or circumstance that occurs in
                      connection with services arranged through Support24 and
                      that has resulted in harm or has the potential to result
                      in harm to any person. This includes near misses.
                    </p>
                  </div>

                  <div>
                    <h3 className="text-xl font-semibold text-white mb-2">
                      Reportable Incident (NDIS)
                    </h3>
                    <p className="text-gray-300 leading-relaxed mb-2">
                      An incident that must be reported to the NDIS Commission,
                      including:
                    </p>
                    <ul className="list-disc list-inside text-gray-300 space-y-2">
                      <li>Death of a person with disability</li>
                      <li>Serious injury of a person with disability</li>
                      <li>Abuse or neglect of a person with disability</li>
                      <li>Unlawful sexual or physical contact or assault</li>
                      <li>Sexual misconduct</li>
                      <li>Unauthorized use of restrictive practice</li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="text-xl font-semibold text-white mb-2">
                      Serious Incident (Aged Care)
                    </h3>
                    <p className="text-gray-300 leading-relaxed mb-2">
                      An incident that must be reported to the Aged Care Quality
                      and Safety Commission under SIRS, including:
                    </p>
                    <ul className="list-disc list-inside text-gray-300 space-y-2">
                      <li>Death of a care recipient</li>
                      <li>Serious injury of a care recipient</li>
                      <li>Unreasonable use of force or restraint</li>
                      <li>Unlawful sexual or physical contact</li>
                      <li>Neglect or psychological abuse</li>
                      <li>Unexpected absence of a care recipient at risk</li>
                      <li>Stealing or financial coercion</li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="text-xl font-semibold text-white mb-2">
                      Other Key Terms
                    </h3>
                    <ul className="list-disc list-inside text-gray-300 space-y-2">
                      <li>
                        <strong className="text-white">Serious Injury:</strong>{" "}
                        Requires medical treatment by a registered medical
                        practitioner
                      </li>
                      <li>
                        <strong className="text-white">Abuse:</strong> Any act
                        causing physical, sexual, emotional, psychological, or
                        financial harm
                      </li>
                      <li>
                        <strong className="text-white">Neglect:</strong> Failure
                        to provide necessary services or support
                      </li>
                      <li>
                        <strong className="text-white">Near Miss:</strong>{" "}
                        Incident where harm could have occurred but didn't
                      </li>
                    </ul>
                  </div>
                </div>
              </section>

              {/* 3. Types of Incidents and Reporting Categories */}
              <section className="mb-10">
                <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
                  3. Types of Incidents and Reporting Categories
                </h2>

                <h3 className="text-xl font-semibold text-white mb-3 mt-6">
                  3.1 NDIS Reportable Incidents
                </h3>
                <p className="text-gray-300 leading-relaxed mb-4">
                  The following incidents involving NDIS participants must be
                  reported to the NDIS Commission:
                </p>
                <ul className="list-disc list-inside text-gray-300 space-y-2 mb-4">
                  <li>
                    <strong className="text-white">
                      Death of a person with disability:
                    </strong>{" "}
                    Any death during or following services, regardless of cause
                  </li>
                  <li>
                    <strong className="text-white">Serious injury:</strong>{" "}
                    Injuries requiring medical treatment, causing ongoing
                    impairment, or psychological harm
                  </li>
                  <li>
                    <strong className="text-white">Abuse or neglect:</strong>{" "}
                    Physical, emotional, psychological, financial abuse, or
                    failure to provide adequate care
                  </li>
                  <li>
                    <strong className="text-white">Sexual assault:</strong> Any
                    sexual contact without valid consent
                  </li>
                  <li>
                    <strong className="text-white">Sexual misconduct:</strong>{" "}
                    Inappropriate sexual comments, behaviors, or grooming
                  </li>
                  <li>
                    <strong className="text-white">
                      Unauthorized restrictive practice:
                    </strong>{" "}
                    Use of restraint or restriction without proper authorization
                  </li>
                </ul>

                <h3 className="text-xl font-semibold text-white mb-3 mt-6">
                  3.2 Aged Care Serious Incidents
                </h3>
                <p className="text-gray-300 leading-relaxed mb-4">
                  The following incidents involving aged care recipients must be
                  reported under SIRS:
                </p>
                <ul className="list-disc list-inside text-gray-300 space-y-2 mb-4">
                  <li>Death of a care recipient</li>
                  <li>Serious injury requiring medical treatment</li>
                  <li>Unreasonable use of force including restraint</li>
                  <li>Unlawful sexual or physical contact</li>
                  <li>Sexual misconduct</li>
                  <li>Neglect or psychological/emotional abuse</li>
                  <li>Unexpected absence where recipient may be at risk</li>
                  <li>Stealing or financial coercion</li>
                </ul>

                <h3 className="text-xl font-semibold text-white mb-3 mt-6">
                  3.3 Platform-Specific Incidents
                </h3>
                <p className="text-gray-300 leading-relaxed mb-4">
                  Other incidents requiring internal management:
                </p>
                <ul className="list-disc list-inside text-gray-300 space-y-2 mb-4">
                  <li>Service delivery failures</li>
                  <li>Allegations of misconduct</li>
                  <li>Near misses and hazards</li>
                  <li>Property damage or loss</li>
                  <li>Privacy or data breaches</li>
                  <li>Complaints escalated to incidents</li>
                </ul>

                <h3 className="text-xl font-semibold text-white mb-3 mt-6">
                  3.4 Reporting Timeframes
                </h3>
                <div className="bg-primary/10 border border-primary/30 rounded-lg p-4 mb-4">
                  <h4 className="text-lg font-semibold text-white mb-2">
                    NDIS Reportable Incidents
                  </h4>
                  <ul className="list-disc list-inside text-gray-300 space-y-2">
                    <li>
                      <strong className="text-white">24 hours:</strong> Death,
                      serious injury requiring emergency care, sexual/physical
                      assault, immediate risk
                    </li>
                    <li>
                      <strong className="text-white">5 business days:</strong>{" "}
                      Other reportable incidents not requiring immediate
                      notification
                    </li>
                  </ul>
                </div>
                <div className="bg-primary/10 border border-primary/30 rounded-lg p-4">
                  <h4 className="text-lg font-semibold text-white mb-2">
                    Aged Care Serious Incidents
                  </h4>
                  <ul className="list-disc list-inside text-gray-300 space-y-2">
                    <li>
                      <strong className="text-white">Priority 1 (24 hours):</strong>{" "}
                      Death, sexual/physical assault, immediate risk, unexplained
                      absence
                    </li>
                    <li>
                      <strong className="text-white">Priority 2 (30 days):</strong>{" "}
                      Other serious injuries, abuse, neglect, financial coercion
                    </li>
                  </ul>
                </div>
              </section>

              {/* 4. Reporting Obligations and Responsibilities */}
              <section className="mb-10">
                <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
                  4. Reporting Obligations and Responsibilities
                </h2>

                <h3 className="text-xl font-semibold text-white mb-3 mt-6">
                  4.1 Who Must Report
                </h3>
                <ul className="list-disc list-inside text-gray-300 space-y-2 mb-4">
                  <li>
                    <strong className="text-white">Support Workers:</strong>{" "}
                    Must immediately report any incident they witness or become
                    aware of
                  </li>
                  <li>
                    <strong className="text-white">Providers:</strong> Primary
                    responsibility for managing and reporting incidents involving
                    their services
                  </li>
                  <li>
                    <strong className="text-white">Participants:</strong>{" "}
                    Encouraged to report any incidents or unsafe situations
                  </li>
                  <li>
                    <strong className="text-white">
                      Support Coordinators:
                    </strong>{" "}
                    Must report incidents they become aware of
                  </li>
                  <li>
                    <strong className="text-white">Support24 Staff:</strong> Must
                    report any incidents that come to their attention
                  </li>
                  <li>
                    <strong className="text-white">Third Parties:</strong>{" "}
                    Encouraged to report concerns about participant safety
                  </li>
                </ul>

                <h3 className="text-xl font-semibold text-white mb-3 mt-6">
                  4.2 How to Report
                </h3>
                <div className="bg-red-900/20 border border-red-500/30 rounded-lg p-4 mb-4">
                  <h4 className="text-lg font-semibold text-white mb-2 flex items-center gap-2">
                    <AlertCircle className="w-5 h-5 text-red-400" />
                    For Immediate Emergencies
                  </h4>
                  <p className="text-gray-300 mb-2">
                    Call emergency services on{" "}
                    <a
                      href="tel:000"
                      className="text-primary hover:underline font-bold"
                    >
                      000
                    </a>{" "}
                    first, then notify Support24.
                  </p>
                </div>
                <div className="space-y-3">
                  <div>
                    <h4 className="text-lg font-semibold text-white mb-2">
                      Urgent Incidents (Business Hours)
                    </h4>
                    <p className="text-gray-300">
                      Call:{" "}
                      <a
                        href="tel:+61348324105"
                        className="text-primary hover:underline"
                      >
                        03 4832 4105
                      </a>
                    </p>
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-white mb-2">
                      Serious Incidents (Anytime)
                    </h4>
                    <p className="text-gray-300">
                      Email:{" "}
                      <a
                        href="mailto:incidents@support24.com.au"
                        className="text-primary hover:underline"
                      >
                        incidents@support24.com.au
                      </a>
                    </p>
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-white mb-2">
                      Non-Urgent Incidents
                    </h4>
                    <p className="text-gray-300">
                      Use the in-app incident reporting tool in your Support24
                      account
                    </p>
                  </div>
                </div>

                <h3 className="text-xl font-semibold text-white mb-3 mt-6">
                  4.3 What Information to Include
                </h3>
                <p className="text-gray-300 leading-relaxed mb-4">
                  When reporting an incident, provide:
                </p>
                <ul className="list-disc list-inside text-gray-300 space-y-2 mb-4">
                  <li>Date, time, and location of the incident</li>
                  <li>Type of incident and clear description of what happened</li>
                  <li>Who was involved and who witnessed the incident</li>
                  <li>Information about injuries or harm sustained</li>
                  <li>Immediate actions taken to ensure safety</li>
                  <li>Your contact details and relationship to the incident</li>
                </ul>

                <h3 className="text-xl font-semibold text-white mb-3 mt-6">
                  4.4 Protection for Reporters
                </h3>
                <div className="bg-green-900/20 border border-green-500/30 rounded-lg p-4 mb-4">
                  <p className="text-gray-300">
                    <strong className="text-white">
                      Support24 prohibits retaliation
                    </strong>{" "}
                    against anyone who reports an incident in good faith.
                    Retaliation includes termination of services, reduction in
                    work opportunities, negative reviews, threats, harassment, or
                    any adverse action because someone reported an incident.
                  </p>
                </div>

                <h3 className="text-xl font-semibold text-white mb-3 mt-6">
                  4.5 Mandatory Reporting to External Authorities
                </h3>
                <p className="text-gray-300 leading-relaxed mb-4">
                  Certain incidents must be reported directly to external
                  authorities:
                </p>
                <ul className="list-disc list-inside text-gray-300 space-y-2">
                  <li>
                    <strong className="text-white">Child abuse:</strong> Report
                    to state/territory child protection services
                  </li>
                  <li>
                    <strong className="text-white">Elder abuse:</strong> Contact
                    relevant elder abuse helplines
                  </li>
                  <li>
                    <strong className="text-white">Criminal activity:</strong>{" "}
                    Report to police immediately
                  </li>
                  <li>
                    <strong className="text-white">
                      Workplace incidents:
                    </strong>{" "}
                    Report to WorkSafe or equivalent regulator
                  </li>
                </ul>
              </section>

              {/* 5. Immediate Response Procedures */}
              <section className="mb-10">
                <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
                  5. Immediate Response Procedures
                </h2>

                <h3 className="text-xl font-semibold text-white mb-3 mt-6">
                  5.1 Ensure Immediate Safety
                </h3>
                <p className="text-gray-300 leading-relaxed mb-4">
                  The first priority is ensuring safety:
                </p>
                <ul className="list-disc list-inside text-gray-300 space-y-2 mb-4">
                  <li>Remove affected parties from danger if safe to do so</li>
                  <li>Call emergency services on 000 for immediate dangers</li>
                  <li>Provide first aid if trained and safe to do so</li>
                  <li>Separate alleged perpetrators from victims</li>
                  <li>Do not leave victims alone unless necessary for safety</li>
                </ul>

                <h3 className="text-xl font-semibold text-white mb-3 mt-6">
                  5.2 Provide Immediate Medical Attention
                </h3>
                <ul className="list-disc list-inside text-gray-300 space-y-2 mb-4">
                  <li>
                    Call 000 for serious injuries or medical emergencies
                  </li>
                  <li>Provide first aid within your scope of training</li>
                  <li>Do not move injured persons unless in immediate danger</li>
                  <li>Arrange transport to medical care for non-emergency injuries</li>
                  <li>Notify family members about injuries and treatment</li>
                  <li>Obtain medical documentation of injuries</li>
                </ul>

                <h3 className="text-xl font-semibold text-white mb-3 mt-6">
                  5.3 Preserve Evidence
                </h3>
                <ul className="list-disc list-inside text-gray-300 space-y-2 mb-4">
                  <li>
                    Do not clean up or alter the incident scene unless necessary
                  </li>
                  <li>Take photographs of scene, injuries, or damaged property</li>
                  <li>
                    Preserve physical evidence (equipment, clothing, medications)
                  </li>
                  <li>Write down immediate recollections while memory is fresh</li>
                  <li>Record contact details for witnesses</li>
                  <li>Preserve electronic evidence (messages, emails, photos)</li>
                </ul>

                <h3 className="text-xl font-semibold text-white mb-3 mt-6">
                  5.4 Notification and Escalation
                </h3>
                <p className="text-gray-300 leading-relaxed mb-4">
                  After ensuring safety, notify appropriate parties:
                </p>
                <ul className="list-disc list-inside text-gray-300 space-y-2">
                  <li>Notify Support24 immediately for all serious incidents</li>
                  <li>Notify families or representatives of affected parties</li>
                  <li>Notify relevant providers if incident involves their services</li>
                  <li>Notify support coordinators assisting the participant</li>
                  <li>Notify external authorities as required by law</li>
                  <li>Escalate to senior management for serious incidents</li>
                </ul>
              </section>

              {/* 6. Investigation Process */}
              <section className="mb-10">
                <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
                  6. Investigation Process
                </h2>

                <h3 className="text-xl font-semibold text-white mb-3 mt-6">
                  6.1 Investigation Principles
                </h3>
                <ul className="list-disc list-inside text-gray-300 space-y-2 mb-4">
                  <li>
                    <strong className="text-white">Trauma-informed:</strong>{" "}
                    Prioritizing dignity, autonomy, and wellbeing
                  </li>
                  <li>
                    <strong className="text-white">Fair and impartial:</strong>{" "}
                    No predetermined conclusions, opportunity for all parties to
                    respond
                  </li>
                  <li>
                    <strong className="text-white">Thorough:</strong> Gathering
                    all available evidence before conclusions
                  </li>
                  <li>
                    <strong className="text-white">Timely:</strong> Conducted as
                    quickly as possible while ensuring fairness
                  </li>
                  <li>
                    <strong className="text-white">Confidential:</strong>{" "}
                    Information shared only with those who need to know
                  </li>
                  <li>
                    <strong className="text-white">Compliant:</strong> Following
                    NDIS and Aged Care Commission guidance
                  </li>
                </ul>

                <h3 className="text-xl font-semibold text-white mb-3 mt-6">
                  6.2 Investigation Procedure
                </h3>
                <ol className="list-decimal list-inside text-gray-300 space-y-3 mb-4">
                  <li>
                    <strong className="text-white">Acknowledgment:</strong>{" "}
                    Receipt acknowledged within 24 hours, investigator assigned
                  </li>
                  <li>
                    <strong className="text-white">Initial Assessment:</strong>{" "}
                    Determine severity, reporting requirements, and investigation
                    scope
                  </li>
                  <li>
                    <strong className="text-white">Evidence Gathering:</strong>{" "}
                    Review records, interview parties, examine physical evidence
                  </li>
                  <li>
                    <strong className="text-white">Analysis:</strong> Determine
                    findings on the balance of probabilities
                  </li>
                  <li>
                    <strong className="text-white">Investigation Report:</strong>{" "}
                    Document findings, reasoning, and recommendations
                  </li>
                  <li>
                    <strong className="text-white">Actions:</strong> Senior
                    management determines actions based on findings
                  </li>
                </ol>

                <h3 className="text-xl font-semibold text-white mb-3 mt-6">
                  6.3 Timeframes for Investigation
                </h3>
                <ul className="list-disc list-inside text-gray-300 space-y-2 mb-4">
                  <li>
                    Serious incidents: Preliminary investigation within 24 hours
                    for initial notification
                  </li>
                  <li>
                    NDIS reportable: Completed within regulatory timeframes (60
                    days)
                  </li>
                  <li>
                    Aged Care SIRS: Within 60 days (Priority 1) or 40 days
                    (Priority 2)
                  </li>
                  <li>
                    Platform-specific: Generally completed within 20 business
                    days
                  </li>
                </ul>

                <h3 className="text-xl font-semibold text-white mb-3 mt-6">
                  6.4 Communication of Outcomes
                </h3>
                <p className="text-gray-300 leading-relaxed">
                  After investigation completion, outcomes are communicated to
                  affected parties, reporters, subjects of investigation,
                  providers, families, and regulators while respecting privacy
                  and confidentiality obligations.
                </p>
              </section>

              {/* 7. Support for Affected Parties */}
              <section className="mb-10">
                <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
                  7. Support for Affected Parties
                </h2>

                <h3 className="text-xl font-semibold text-white mb-3 mt-6">
                  7.1 Immediate Support
                </h3>
                <ul className="list-disc list-inside text-gray-300 space-y-2 mb-4">
                  <li>Emotional support and reassurance</li>
                  <li>Information about next steps</li>
                  <li>Practical assistance (transport, contacting family)</li>
                  <li>
                    Opportunity to express preferences where they have capacity
                  </li>
                  <li>Do not leave affected parties alone if distressed</li>
                </ul>

                <h3 className="text-xl font-semibold text-white mb-3 mt-6">
                  7.2 Ongoing Support
                </h3>
                <ul className="list-disc list-inside text-gray-300 space-y-2 mb-4">
                  <li>Counseling or psychological support referrals</li>
                  <li>Advocacy support through disability or aged care advocates</li>
                  <li>Peer support connections where appropriate</li>
                  <li>Practical support for service continuity</li>
                  <li>Access to community services and resources</li>
                </ul>

                <h3 className="text-xl font-semibold text-white mb-3 mt-6">
                  7.3 Support for Witnesses and Others Impacted
                </h3>
                <p className="text-gray-300 leading-relaxed mb-4">
                  Witnesses may experience vicarious trauma. Support includes:
                </p>
                <ul className="list-disc list-inside text-gray-300 space-y-2">
                  <li>Employee Assistance Programs or counseling referrals</li>
                  <li>Peer support and debriefing</li>
                  <li>Information about trauma reactions and coping strategies</li>
                  <li>
                    Assurance that reactions are normal and seeking support is
                    encouraged
                  </li>
                </ul>
              </section>

              {/* 8. Regulatory Reporting and Notifications */}
              <section className="mb-10">
                <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
                  8. Regulatory Reporting and Notifications
                </h2>

                <h3 className="text-xl font-semibold text-white mb-3 mt-6">
                  8.1 NDIS Commission Reporting
                </h3>
                <p className="text-gray-300 leading-relaxed mb-4">
                  Reports are submitted through the NDIS Commission's online
                  portal within required timeframes. Initial notifications
                  include all available information, with follow-up reports and
                  final investigation reports submitted within 60 days.
                </p>

                <h3 className="text-xl font-semibold text-white mb-3 mt-6">
                  8.2 Aged Care Commission Reporting
                </h3>
                <p className="text-gray-300 leading-relaxed mb-4">
                  Reports are submitted through the SIRS portal within required
                  timeframes. Final reports must be submitted within 60 days
                  (Priority 1) or 40 days (Priority 2).
                </p>

                <h3 className="text-xl font-semibold text-white mb-3 mt-6">
                  8.3 Other Regulatory Notifications
                </h3>
                <ul className="list-disc list-inside text-gray-300 space-y-2">
                  <li>WorkSafe: Serious workplace incidents</li>
                  <li>Coroners: Reportable deaths</li>
                  <li>OAIC: Data breaches involving personal information</li>
                  <li>AHPRA: Professional misconduct by health practitioners</li>
                  <li>Police: Criminal conduct</li>
                </ul>
              </section>

              {/* 9. Actions to Prevent Recurrence */}
              <section className="mb-10">
                <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
                  9. Actions to Prevent Recurrence
                </h2>

                <h3 className="text-xl font-semibold text-white mb-3 mt-6">
                  9.1 Root Cause Analysis
                </h3>
                <p className="text-gray-300 leading-relaxed mb-4">
                  For serious incidents, Support24 conducts root cause analysis
                  to understand underlying factors including human factors,
                  system factors, environmental factors, communication factors,
                  and organizational factors.
                </p>

                <h3 className="text-xl font-semibold text-white mb-3 mt-6">
                  9.2 Corrective and Preventive Actions
                </h3>
                <p className="text-gray-300 leading-relaxed mb-4">
                  Based on findings, Support24 implements:
                </p>
                <ul className="list-disc list-inside text-gray-300 space-y-2 mb-4">
                  <li>Policy or procedure revisions</li>
                  <li>Training or retraining for staff and users</li>
                  <li>Supervision or oversight enhancements</li>
                  <li>Disciplinary action where appropriate</li>
                  <li>Environmental modifications</li>
                  <li>Equipment replacement or maintenance</li>
                  <li>Communication improvements</li>
                </ul>

                <h3 className="text-xl font-semibold text-white mb-3 mt-6">
                  9.3 Learning and Continuous Improvement
                </h3>
                <p className="text-gray-300 leading-relaxed">
                  Support24 shares learnings through de-identified case studies,
                  safety alerts, policy updates, and regular trend analysis to
                  identify systemic issues and inform strategic planning.
                </p>
              </section>

              {/* 10. Record Keeping and Documentation */}
              <section className="mb-10">
                <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
                  10. Record Keeping and Documentation
                </h2>
                <p className="text-gray-300 leading-relaxed mb-4">
                  Comprehensive records are maintained for:
                </p>
                <ul className="list-disc list-inside text-gray-300 space-y-2 mb-4">
                  <li>Initial incident reports</li>
                  <li>Investigation records and evidence</li>
                  <li>Notification records</li>
                  <li>Regulatory reporting records</li>
                  <li>Support and follow-up documentation</li>
                </ul>
                <p className="text-gray-300 leading-relaxed mb-4">
                  Records are stored securely with access limited to authorized
                  personnel. Retention periods are:
                </p>
                <ul className="list-disc list-inside text-gray-300 space-y-2">
                  <li>NDIS reportable incidents: At least 7 years</li>
                  <li>Aged care serious incidents: At least 7 years</li>
                  <li>Platform-specific incidents: At least 3 years</li>
                  <li>
                    Incidents involving serious harm, death, or potential
                    criminal conduct: At least 10 years
                  </li>
                </ul>
              </section>

              {/* 11. Training and Awareness */}
              <section className="mb-10">
                <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
                  11. Training and Awareness
                </h2>
                <p className="text-gray-300 leading-relaxed mb-4">
                  All Support24 staff receive training on this policy during
                  induction and annually thereafter. Training covers incident
                  definitions, reporting obligations, immediate response
                  procedures, investigation processes, and trauma-informed
                  approaches.
                </p>
                <p className="text-gray-300 leading-relaxed">
                  Platform users receive education about incident management
                  during onboarding and through ongoing communications,
                  educational resources, and webinars.
                </p>
              </section>

              {/* 12. Review and Continuous Improvement */}
              <section className="mb-10">
                <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
                  12. Review and Continuous Improvement
                </h2>
                <p className="text-gray-300 leading-relaxed">
                  This policy is reviewed annually or more frequently if
                  significant incidents occur, legislative changes are made, or
                  feedback suggests improvements are needed. Reviews consider
                  incident data and trends, stakeholder feedback, regulatory
                  audit findings, and emerging risks.
                </p>
              </section>

              {/* 13. Governance and Accountability */}
              <section className="mb-10">
                <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
                  13. Governance and Accountability
                </h2>
                <ul className="list-disc list-inside text-gray-300 space-y-2">
                  <li>
                    <strong className="text-white">CEO:</strong> Ultimate
                    accountability for incident management compliance
                  </li>
                  <li>
                    <strong className="text-white">Chief Safety Officer:</strong>{" "}
                    Operational responsibility for policy implementation
                  </li>
                  <li>
                    <strong className="text-white">
                      Incident Management Team:
                    </strong>{" "}
                    Receiving reports, conducting investigations, coordinating
                    reporting
                  </li>
                  <li>
                    <strong className="text-white">All Staff:</strong> Report
                    incidents, cooperate with investigations, implement
                    preventive actions
                  </li>
                  <li>
                    <strong className="text-white">Board:</strong> Governance
                    oversight of safety performance and compliance
                  </li>
                </ul>
              </section>

              {/* 14. Contact Information */}
              <section className="mb-10">
                <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
                  14. Contact Information
                </h2>

                <div className="space-y-6">
                  <div className="bg-primary/10 border border-primary/30 rounded-lg p-4">
                    <h3 className="text-xl font-semibold text-white mb-3">
                      Incident Reporting (24/7)
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
                    <p className="text-gray-300 mt-2">
                      <strong className="text-white">Emergency:</strong> Call{" "}
                      <a
                        href="tel:000"
                        className="text-red-400 hover:underline font-bold"
                      >
                        000
                      </a>{" "}
                      then notify Support24
                    </p>
                  </div>

                  <div>
                    <h3 className="text-xl font-semibold text-white mb-3">
                      External Regulatory Bodies
                    </h3>
                    <div className="space-y-2 text-gray-300">
                      <p>
                        <strong className="text-white">
                          NDIS Quality and Safeguards Commission:
                        </strong>{" "}
                        <a
                          href="tel:1800035544"
                          className="text-primary hover:underline"
                        >
                          1800 035 544
                        </a>
                      </p>
                      <p>
                        <strong className="text-white">
                          Aged Care Quality and Safety Commission:
                        </strong>{" "}
                        <a
                          href="tel:1800951822"
                          className="text-primary hover:underline"
                        >
                          1800 951 822
                        </a>
                      </p>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-xl font-semibold text-white mb-3">
                      Support Services
                    </h3>
                    <div className="space-y-2 text-gray-300">
                      <p>
                        <strong className="text-white">1800 RESPECT:</strong>{" "}
                        <a
                          href="tel:1800737732"
                          className="text-primary hover:underline"
                        >
                          1800 737 732
                        </a>
                      </p>
                      <p>
                        <strong className="text-white">Lifeline:</strong>{" "}
                        <a
                          href="tel:131114"
                          className="text-primary hover:underline"
                        >
                          13 11 14
                        </a>
                      </p>
                      <p>
                        <strong className="text-white">Beyond Blue:</strong>{" "}
                        <a
                          href="tel:1300224636"
                          className="text-primary hover:underline"
                        >
                          1300 224 636
                        </a>
                      </p>
                      <p>
                        <strong className="text-white">
                          National Disability Abuse and Neglect Hotline:
                        </strong>{" "}
                        <a
                          href="tel:1800880052"
                          className="text-primary hover:underline"
                        >
                          1800 880 052
                        </a>
                      </p>
                    </div>
                  </div>
                </div>
              </section>

              {/* Footer */}
              <div className="mt-12 pt-8 border-t border-white/10">
                <div className="bg-primary/10 border border-primary/30 rounded-lg p-6 mb-6">
                  <h3 className="text-xl font-semibold text-white mb-3">
                    Acknowledgment
                  </h3>
                  <p className="text-gray-300 leading-relaxed">
                    All Support24 staff and users are required to read and
                    understand this Incident Management Policy. By using the
                    Support24 platform, you acknowledge that you have read this
                    policy, understand your obligations to report incidents,
                    agree to cooperate with incident investigations, and commit
                    to supporting a culture of safety, transparency, and
                    continuous improvement.
                  </p>
                </div>
                <p className="text-gray-400 text-sm text-center mb-2">
                  If you have any questions about this policy or your
                  obligations under it, please contact Support24 at{" "}
                  <a
                    href="mailto:incidents@support24.com.au"
                    className="text-primary hover:underline"
                  >
                    incidents@support24.com.au
                  </a>{" "}
                  or{" "}
                  <a
                    href="tel:+61348324105"
                    className="text-primary hover:underline"
                  >
                    03 4832 4105
                  </a>
                  .
                </p>
                <p className="text-gray-500 text-xs text-center">
                  © 2025 Support24 Pty Ltd. All rights reserved. | ABN:
                  19673683817
                </p>
                <p className="text-gray-500 text-xs text-center mt-2">
                  Version: 1.0 | Effective: 10 November 2025 | Last Updated: 10
                  November 2025 | Next Review: 10 November 2026
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </LandingLayout>
  );
}

