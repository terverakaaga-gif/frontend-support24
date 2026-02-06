import React from "react";
import { motion } from "framer-motion";
import { CheckCircle } from "@solar-icons/react";
import { X } from "lucide-react";
import { InlineVectorText } from "../InlineVectorText";

const STATS = [
  {
    value: "$10-$20",
    label: "Per Hour in Permanent Agency Margin",
  },
  {
    value: "97%",
    label: "Recruitment Cost Reduction",
  },
  {
    value: "60%",
    label: "Coordination Automation",
  },
];

const IDEAL_FIT_ITEMS = [
  "Run 500+ shifts per year",
  "Want to reduce agency reliance",
  "Are paying for coordination twice",
  "Care about continuity and cost control",
];

const NOT_IDEAL_ITEMS = [
  "You run fewer than 200 shifts per year",
  "Agencies are still cheaper at your scale",
];

export function SupportProviderWhoSection() {
  return (
    <section className="relative py-16 md:py-24 px-4 md:px-8 bg-white">
      <div className="max-w-7xl mx-auto">
        {/* Stats row */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12 mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          {STATS.map((stat) => (
            <div key={stat.label} className="text-center">
              <p className="text-3xl md:text-4xl font-montserrat-bold text-gray-900">
                {stat.value}
              </p>
              <p className="text-sm md:text-base text-gray-600 font-montserrat-medium mt-1">
                {stat.label}
              </p>
            </div>
          ))}
        </motion.div>

        {/* Is This Right For You pill */}
        <motion.div
          className="mb-6"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary font-montserrat-semibold text-sm">
            <CheckCircle className="h-4 w-4 shrink-0" />
            Is This Right For You
          </span>
        </motion.div>

        {/* Main heading */}
        <motion.h2
          className="text-3xl md:text-4xl lg:text-5xl font-montserrat-bold text-gray-900 mb-10 leading-tight"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.15 }}
        >
          {/* <span className="relative inline-block">
            Support24
            <svg
              className="absolute -bottom-1 left-0 w-full"
              viewBox="0 0 120 10"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M2 6C25 3 50 8 80 4C100 2 118 6"
                stroke="#F97316"
                strokeWidth="2.5"
                strokeLinecap="round"
              />
            </svg>
          </span>{" "} */}
          <motion.span
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <InlineVectorText className="italic text-gray-900 " text="Support24" 
              imageClassName="bottom-0 sm:-bottom-1 lg:w-[200px] w-[180px] translate-y-[35%] sm:translate-y-[45%]"
              />
            </motion.span>{"  "}
          Works Best For Provider Who
        </motion.h2>

        {/* Two cards */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          {/* Ideal Fit card */}
          <div className="rounded-xl border-2 border-primary bg-white p-6 md:p-8 shadow-sm">
            <h3 className="text-xl font-montserrat-bold text-gray-900 mb-5">
              Ideal Fit
            </h3>
            <ul className="space-y-3">
              {IDEAL_FIT_ITEMS.map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 mt-0.5">
                    <CheckCircle className="h-4 w-4 text-primary" />
                  </span>
                  <span className="text-gray-700 font-montserrat-medium text-sm md:text-base">
                    {item}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Not Ideal If card */}
          <div className="rounded-xl border border-gray-200 bg-white p-6 md:p-8 shadow-sm">
            <h3 className="text-xl font-montserrat-bold text-gray-900 mb-5">
              Not Ideal If
            </h3>
            <ul className="space-y-3">
              {NOT_IDEAL_ITEMS.map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-gray-200 mt-0.5">
                    <X className="h-3.5 w-3.5 text-gray-500" />
                  </span>
                  <span className="text-gray-700 font-montserrat-medium text-sm md:text-base">
                    {item}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
