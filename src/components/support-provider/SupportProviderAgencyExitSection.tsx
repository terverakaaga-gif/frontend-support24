import React from "react";
import { motion } from "framer-motion";
import { Check, Lightbulb } from "lucide-react";
import { InlineVectorText } from "../InlineVectorText";

const STEPS = [
  {
    num: "01",
    title: "Workforce Dependency Audit",
    description:
      "We analyze your current state to create a clear, quantified picture of what agencies are costing you and where the leverage is.",
    items: [
      "Agency spend analysis",
      "Recruitment costs",
      "Shift coverage platforms",
      "Risk exposure mapping",
    ],
    outcomeLabel: "OUTCOME",
    outcomeText: "Board-ready business case with 3-year saving projection",
  },
  {
    num: "02",
    title: "Build Your Worker Pool",
    description:
      "We provide the recruitment infrastructure so you can hire directly. You interview, you hire. Workers join your organization, not ours.",
    items: [
      "Job posting automation",
      "Credential verification",
      "Applicant tracking",
      "Interview scheduling",
    ],
    outcomeLabel: "TYPICAL RESULT",
    outcomeText: "30-50 verified workers in 4-6 weeks (average 5.3 weeks)",
  },
  {
    num: "03",
    title: "Transition Shift Coverage",
    description:
      "Once your pool exists, we gradually reduce reliance. Agency use decreases week by week.",
    items: [
      "Internal pool priority",
      "Worker self selection",
      "Configurable approvals",
      "Agency overflow only",
    ],
    outcomeLabel: "TYPICAL RESULT",
    outcomeText: "50% agency reduction within 8 weeks",
  },
  {
    num: "04",
    title: "Full Internalization",
    description:
      "Your workforce now runs on your infrastructure. You own the workforce economics completely.",
    items: [
      "Majority internal coverage",
      "Automated coordination",
      "24/7 emergency workflows",
      "Performance reporting",
    ],
    outcomeLabel: "TYPICAL RESULT",
    outcomeText: "40%+ total workforce cost reduction",
  },
];

export function SupportProviderAgencyExitSection() {
  return (
    <section className="relative py-16 md:py-24 px-4 md:px-8 bg-gradient-to-b from-[#1e293b] via-[#1e3a5f] to-[#1e293b] text-white overflow-hidden">
      {/* Subtle gradient orbs */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl" />
      </div>

        <div className="relative max-w-7xl mx-auto">
        {/* The Methodology label */}
        <motion.div
          className="mb-6"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/20 text-white font-montserrat-semibold text-sm border border-white/10">
            <Lightbulb className="h-4 w-4 shrink-0" />
            The Methodology
          </span>
        </motion.div>

        {/* Main title */}
        <motion.h2
          className="text-3xl md:text-4xl lg:text-5xl font-montserrat-bold text-white mb-6 leading-tight"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.05 }}
        >
          The Agency{" "}
          <motion.span
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <InlineVectorText className="italic text-white " text="Exit" 
              imageClassName="bottom-0 sm:-bottom-1 lg:w-[200px] w-[180px] translate-y-[35%] sm:translate-y-[45%]"
              />
            </motion.span>{"  "}
          Program
        </motion.h2>

        {/* Description */}
        <motion.p
          className="text-lg text-white/90 font-montserrat-medium mb-12 max-w-3xl leading-relaxed"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          A structured transition that helps NDIS providers eliminate agency
          dependency by building and operating their own casual workforce —
          without increasing internal workload.
        </motion.p>

        {/* Four step cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {STEPS.map((step, index) => (
            <motion.div
              key={step.num}
              className="rounded-xl bg-white/5 border border-white/10 backdrop-blur-sm p-6 flex flex-col"
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 + index * 0.05 }}
            >
              <span className="inline-flex w-10 h-10 items-center justify-center rounded-lg bg-white/10 text-white/90 font-montserrat-bold text-sm mb-4">
                {step.num}
              </span>
              <h3 className="text-lg font-montserrat-bold text-white mb-3">
                {step.title}
              </h3>
              <p className="text-sm text-white/80 font-montserrat-medium mb-4 leading-relaxed flex-1">
                {step.description}
              </p>
              <ul className="space-y-2 mb-4">
                {step.items.map((item) => (
                  <li key={item} className="flex items-center gap-2 text-sm text-white/90">
                    <Check className="h-4 w-4 text-primary shrink-0" />
                    <span className="font-montserrat-medium">{item}</span>
                  </li>
                ))}
              </ul>
              <div className="pt-3 border-t border-white/10">
                <p className="text-xs text-white/60 font-montserrat-semibold uppercase tracking-wide mb-1">
                  {step.outcomeLabel}
                </p>
                <p className="text-sm text-white font-montserrat-medium">
                  {step.outcomeText}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
