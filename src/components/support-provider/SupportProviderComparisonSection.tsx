import React from "react";
import { motion } from "framer-motion";
import { Check, X, ArrowLeftRight } from "lucide-react";
import { InlineVectorText } from "../InlineVectorText";

const STEPS = [
  {
    num: "01",
    agency: "You need a worker (call agency)",
    platform: "You need a worker (post to your pool)",
  },
  {
    num: "02",
    agency: "Agency action (call their pool)",
    platform: "Platform action (worker accept 30 sec)",
  },
  {
    num: "03",
    agency: "You pay $680 per shift",
    platform: "You pay worker $400 (your payroll)",
  },
  {
    num: "04",
    agency: "Worker receives $400",
    platform: "Platform fee ($15 per shift)",
  },
  {
    num: "05",
    agency: "Agency keeps $280 pure markup",
    platform: "$0 for middleman markup",
  },
];

export function SupportProviderComparisonSection() {
  return (
    <section className="relative py-16 md:py-24 px-4 md:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
        {/* Side By Side badge */}
        <motion.div
          className="flex justify-center mb-6"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary/10 text-primary font-montserrat-semibold text-sm">
            <ArrowLeftRight className="h-4 w-4 shrink-0" />
            Side By Side
          </span>
        </motion.div>

        {/* Main heading */}
        <motion.h2
          className="text-2xl md:text-3xl lg:text-4xl font-montserrat-bold text-gray-900 text-center mb-10 md:mb-12 leading-tight"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.05 }}
        >
          What You&apos;re Actually Paying 70%{" "}
          <motion.span
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <InlineVectorText className="italic text-gray-900 " text="Markup" 
              imageClassName="bottom-0 sm:-bottom-1 lg:w-[200px] w-[180px] translate-y-[35%] sm:translate-y-[45%]"
              />
            </motion.span>{"  "}
          For
        </motion.h2>

        {/* Comparison steps - card */}
        <motion.div
          className="rounded-2xl bg-gray-50/80 border border-gray-200 p-6 md:p-8 mb-10"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <div className="space-y-4 md:space-y-5">
            {STEPS.map((step) => (
              <div
                key={step.num}
                className="grid grid-cols-1 md:grid-cols-[auto_1fr_auto_1fr] gap-3 md:gap-6 items-center"
              >
                <span className="text-lg font-montserrat-bold text-gray-900 md:justify-self-start">
                  {step.num}
                </span>
                <div className="flex items-center gap-3 pl-0 md:pl-2">
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-red-100">
                    <X className="h-4 w-4 text-red-600" />
                  </span>
                  <span className="text-gray-800 font-montserrat-medium text-sm md:text-base">
                    {step.agency}
                  </span>
                </div>
                <div className="hidden md:flex justify-center">
                  <ArrowLeftRight className="h-5 w-5 text-gray-400" />
                </div>
                <div className="flex items-center gap-3 pl-0 md:pl-2 border-t md:border-t-0 border-gray-200 pt-3 md:pt-0">
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary/10">
                    <Check className="h-4 w-4 text-primary" />
                  </span>
                  <span className="text-gray-800 font-montserrat-medium text-sm md:text-base">
                    {step.platform}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Cost summary boxes */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.15 }}
        >
          <div className="rounded-xl border-2 border-red-300 bg-white p-6 text-center">
            <p className="text-sm font-montserrat-semibold text-gray-900 mb-2">
              Annual Agency Cost (1,250 shifts)
            </p>
            <p className="text-3xl md:text-4xl font-montserrat-bold text-red-600 mb-3">
              $850,000
            </p>
            <p className="text-sm text-gray-600 font-montserrat-medium">
              Your ownership: 0% · Your control: 0%
            </p>
          </div>
          <div className="rounded-xl border-2 border-primary bg-white p-6 text-center">
            <p className="text-sm font-montserrat-semibold text-gray-900 mb-2">
              Annual Support24 Cost (1,250 shifts)
            </p>
            <p className="text-3xl md:text-4xl font-montserrat-bold text-primary mb-3">
              $518,750
            </p>
            <p className="text-sm text-gray-600 font-montserrat-medium">
              Your ownership: 100% · Your control: 100%
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
