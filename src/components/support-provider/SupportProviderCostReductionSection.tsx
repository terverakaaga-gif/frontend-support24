import React from "react";
import { motion } from "framer-motion";
import { Send } from "lucide-react";
import { InlineVectorText } from "../InlineVectorText";

const CARDS = [
  {
    title: "Eliminate Agency Markup",
    agencyLabel: "Agency (Ongoing):",
    agencyValue: "$10-$20/hour embedded margin",
    agencyStrikePart: null as string | null,
    supportLabel: "Support24 (Ongoing):",
    supportValue: "$10/shift platform fee - $0 markup",
    savings: ["Year 1: $360K+ saved", "Year 2+: $360K+/year"],
  },
  {
    title: "Slash Recruitment Costs",
    agencyLabel: "Agency (per hire):",
    agencyValue: "$20,000 per hire",
    agencyStrikePart: "$20,000",
    supportLabel: "Support24 (per hire):",
    supportValue: "$500 per worker",
    savings: ["Year 1 (10 hires): $195K saved", "Year 2+: 97% savings"],
  },
  {
    title: "Automate Coordination",
    agencyLabel: "Before (Ongoing):",
    agencyValue: "$80K/year manual overhead",
    agencyStrikePart: "$80K",
    supportLabel: "After (Ongoing):",
    supportValue: "$20K/year (75% automated)",
    savings: ["Year 1: $60K saved", "Year 2+: $60K/year"],
  },
];

export function SupportProviderCostReductionSection() {
  return (
    <section className="relative py-16 md:py-24 px-4 md:px-8 bg-white">
      <div className="max-w-7xl mx-auto">
        {/* The Three Way Model badge */}
        <motion.div
          className="flex justify-center mb-6"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary font-montserrat-semibold text-sm">
            <Send className="h-4 w-4 shrink-0" />
            The Three Way Model
          </span>
        </motion.div>

        {/* Main heading */}
        <motion.h2
          className="text-3xl md:text-4xl lg:text-5xl font-montserrat-bold text-gray-900 text-center mb-12 leading-tight"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.05 }}
        >
          How{" "}
          <motion.span
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <InlineVectorText className="italic text-gray-900 " text="Support24" 
              imageClassName="bottom-0 sm:-bottom-1 lg:w-[200px] w-[180px] translate-y-[35%] sm:translate-y-[45%]"
              />
            </motion.span>{"  "}
            Reduces Workforce Costs
        </motion.h2>

        {/* Three cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {CARDS.map((card, index) => (
            <motion.div
              key={card.title}
              className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm flex flex-col"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 + index * 0.05 }}
            >
              <h3 className="text-lg font-montserrat-bold text-gray-900 mb-4">
                Cost Reduction #{index + 1}: {card.title}
              </h3>
              <div className="space-y-3 flex-1">
                <div>
                  <p className="text-xs font-montserrat-semibold text-gray-500 mb-1">
                    {card.agencyLabel}
                  </p>
                  <div className="rounded-lg bg-red-50 border border-red-100 px-3 py-2">
                    <span className="text-red-700 font-montserrat-medium text-sm">
                      {card.agencyStrikePart ? (
                        <>
                          <span className="line-through">
                            {card.agencyStrikePart}
                          </span>
                          {card.agencyValue.replace(card.agencyStrikePart, "")}
                        </>
                      ) : (
                        card.agencyValue
                      )}
                    </span>
                  </div>
                </div>
                <div>
                  <p className="text-xs font-montserrat-semibold text-gray-500 mb-1">
                    {card.supportLabel}
                  </p>
                  <div className="rounded-lg bg-primary/10 border border-primary/20 px-3 py-2">
                    <span className="text-primary font-montserrat-medium text-sm">
                      {card.supportValue}
                    </span>
                  </div>
                </div>
                <div className="pt-2 space-y-2">
                  {card.savings.map((saving) => (
                    <div
                      key={saving}
                      className="rounded-lg bg-gray-100 px-3 py-2"
                    >
                      <span className="text-gray-800 font-montserrat-semibold text-sm">
                        {saving}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
