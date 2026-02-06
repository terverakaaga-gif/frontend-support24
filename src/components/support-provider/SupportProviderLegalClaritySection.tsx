import React from "react";
import { motion } from "framer-motion";
import { Check, X } from "lucide-react";
import { InlineVectorText } from "../InlineVectorText";

const IS_NOT_ITEMS = [
  "Labor Hire",
  "Employment Agency",
  "Staffing Supplier",
  "Workforce Outsourcing",
];

const IS_ITEMS = [
  {
    title: "Recruitment Infrastructure (SaaS)",
    description:
      "Technology enabling providers to source, verify and hire workers directly. You make all hiring decisions.",
  },
  {
    title: "Workforce Coordination Platform",
    description:
      "A shift marketplace for provider-employed workers. The platform executes provider policies, it does not create them.",
  },
  {
    title: "Back-Office Operations Support (BPO)",
    description:
      "Administrative and automation services executed on the provider's behalf. All actions may be overridden at any time.",
  },
];

export function SupportProviderLegalClaritySection() {
  return (
    <section className="relative py-16 md:py-24 px-4 md:px-8 bg-gradient-to-b from-[#0f172a] via-[#1e293b] to-[#0f172a] text-white overflow-hidden">
      {/* Subtle blue glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 -left-32 w-96 h-96 bg-primary/15 rounded-full blur-3xl" />
      </div>

        <div className="relative max-w-7xl mx-auto">
        {/* Legal Clarity badge */}
        <motion.div
          className="mb-6"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary text-white font-montserrat-semibold text-sm">
            <Check className="h-4 w-4 shrink-0" />
            Legal Clarity
          </span>
        </motion.div>

        {/* Main heading */}
        <motion.h2
          className="text-3xl md:text-4xl lg:text-5xl font-montserrat-bold text-white mb-6 leading-tight"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.05 }}
        >
          What{" "}
            <motion.span
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <InlineVectorText className="italic text-white " text="Support24" 
              imageClassName="bottom-0 sm:-bottom-1 lg:w-[200px] w-[180px] translate-y-[35%] sm:translate-y-[45%]"
              />
            </motion.span>{"  "}
              
          is Not
        </motion.h2>

        {/* Intro paragraph */}
        <motion.p
          className="text-xl text-white/90 font-montserrat-medium mb-12 max-w-7xl mx-auto leading-relaxed"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          Support24 does not employ workers, supply workers, or sell labor.
          Workers are employed by you, paid by your payroll, and assigned work
          under your authority.
        </motion.p>

        {/* Two columns */}
        <motion.div
          className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.15 }}
        >
          {/* What Support24 is Not */}
          <div>
            <h3 className="text-lg font-montserrat-bold text-white/90 mb-4">
              What Support24 is Not
            </h3>
            <div className="flex flex-wrap gap-3">
              {IS_NOT_ITEMS.map((item) => (
                <span
                  key={item}
                  className="inline-flex items-center gap-2 px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white font-montserrat-medium text-sm"
                >
                  <X className="h-4 w-4 text-red-400 shrink-0" />
                  {item}
                </span>
              ))}
            </div>
          </div>

          {/* What Support24 Is */}
          <div>
            <h3 className="text-lg font-montserrat-bold text-white/90 mb-4">
              What Support24 Is
            </h3>
            <div className="space-y-4">
              {IS_ITEMS.map((item) => (
                <div
                  key={item.title}
                  className="rounded-xl bg-white/5 border border-white/10 p-5"
                >
                  <div className="flex items-start gap-3">
                    <Check className="h-5 w-5 text-green-400 shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-montserrat-bold text-white mb-2">
                        {item.title}
                      </h4>
                      <p className="text-sm text-white/80 font-montserrat-medium leading-relaxed">
                        {item.description}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
