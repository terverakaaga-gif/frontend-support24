import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { InlineVectorText } from "../InlineVectorText";

const OPTIONS = [
  {
    num: "1",
    title: "Keep Paying Agencies Forever",
    description:
      "Easy. Familiar. Expensive. Zero ownership, zero control.",
    cost: "Cost over 3 years: $2.5M+",
    costHighlight: false,
    featured: false,
  },
  {
    num: "2",
    title: "Build This Internally",
    description:
      "Full control. 18-month timeline. High risk of failure.",
    cost: "Dev cost: $300K+",
    costHighlight: false,
    featured: false,
  },
  {
    num: "3",
    title: "Use The Agency Exit Program",
    description:
      "Proven methodology. Controlled transition. 40% cost reduction.",
    cost: "Investment over 3 years: $300K+",
    costExtra: "Net benefit: $1.3M+",
    costHighlight: true,
    featured: true,
  },
];

export function SupportProviderThreeOptionsSection() {
  return (
    <section className="relative py-16 md:py-24 px-4 md:px-8 bg-gradient-to-b from-[#0f172a] via-[#1e293b] to-[#0f172a] text-white overflow-hidden">
      {/* Subtle blue light streaks from top */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-64 bg-gradient-to-b from-primary/20 to-transparent blur-3xl" />
      </div>

      <div className="relative max-w-7xl mx-auto">
        {/* Title */}
        <motion.h2
          className="text-3xl md:text-4xl lg:text-5xl font-montserrat-bold text-white text-center mb-12 leading-tight"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          You Have Three{" "}
            <motion.span
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <InlineVectorText className="italic text-white " text="Options" 
              imageClassName="bottom-0 sm:-bottom-1 lg:w-[200px] w-[180px] translate-y-[35%] sm:translate-y-[45%]"
              />
            {"  "}
          </motion.span>
        </motion.h2>

        {/* Three cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {OPTIONS.map((option, index) => (
            <motion.div
              key={option.num}
              className={`rounded-xl p-6 md:p-8 flex flex-col border-2 ${
                option.featured
                  ? "border-primary bg-white/5"
                  : "border-white/10 bg-white/5"
              }`}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.05 * index }}
            >
              <span className="inline-flex w-10 h-10 items-center justify-center rounded-lg bg-white/10 text-white font-montserrat-bold text-lg mb-4">
                {option.num}
              </span>
              <h3 className="text-xl font-montserrat-bold text-white mb-3">
                {option.title}
              </h3>
              <p className="text-white/80 font-montserrat-medium text-sm mb-4 leading-relaxed flex-1">
                {option.description}
              </p>
              <div className="space-y-1">
                <p className="text-sm text-white/70 font-montserrat-medium">
                  {option.cost}
                </p>
                {"costExtra" in option && option.costExtra && (
                  <p className="text-base font-montserrat-bold text-primary">
                    {option.costExtra}
                  </p>
                )}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Buttons */}
        <motion.div
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Button
            asChild
            className="bg-primary hover:bg-primary-700 text-white font-montserrat-semibold px-8 py-6 rounded-xl inline-flex items-center gap-2"
          >
            <Link to="/register-provider">
              Get Started
              <ArrowUpRight className="h-5 w-5" />
            </Link>
          </Button>
          <Button
            asChild
            variant="outline"
            className="border-2 border-white text-white hover:bg-white/10 font-montserrat-semibold px-8 py-6 rounded-xl bg-transparent"
          >
            <Link to="/login">Login</Link>
          </Button>
        </motion.div>
      </div>
    </section>
  );
}
