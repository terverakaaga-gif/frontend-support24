import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Check, DollarSign, ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { InlineVectorText } from "../InlineVectorText";

const PLANS = [
  {
    id: "audit",
    title: "Workforce Efficiency Audit",
    price: "$0",
    priceDetail: null,
    description: "Comprehensive analysis and board ready business case",
    features: [
      "Agency spend breakdown",
      "Recruitment cost analysis",
      "Operational overhead assessment",
      "3-year savings projection",
      "Implementation roadmap",
    ],
    ctaText: "Book Free Audit",
    ctaPrimary: false,
    ctaHref: "/#contact",
  },
  {
    id: "managed",
    title: "Managed Agency Exit Program",
    price: "$3,000",
    priceDetail: "Per month, 12-month initial, month-to-month after",
    description: "We help you build and operate your worker pool",
    features: [
      "Recruitment infrastructure & support",
      "Workforce coordination platform",
      "24/7 cancellation workflows",
      "Back-office admin support",
      "Roster efficiency monitoring",
      "Dedicated account manager",
    ],
    ctaText: "Contact Support24",
    ctaPrimary: true,
    ctaHref: "/#contact",
    mostPopular: true,
  },
  {
    id: "platform",
    title: "Platform Only Access",
    price: "$15-40",
    priceDetail: "Per shift",
    description: null,
    features: [
      "Recruitment platform",
      "Shift coordination system",
      "Worker mobile app",
      "Automation tools",
      "Reporting dashboards",
    ],
    ctaText: "Book Audit",
    ctaPrimary: false,
    ctaHref: "/#contact",
  },
];

export function SupportProviderPricingSection() {
  return (
    <section className="relative py-16 md:py-24 px-4 md:px-8 bg-gray-50/80">
      <div className="max-w-7xl mx-auto">
        {/* Investments badge */}
        <motion.div
          className="flex justify-center mb-6"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary font-montserrat-semibold text-sm">
            <DollarSign className="h-4 w-4 shrink-0" />
            Investments
          </span>
        </motion.div>

        {/* Main title */}
        <motion.h2
          className="text-3xl md:text-4xl lg:text-5xl font-montserrat-bold text-gray-900 text-center mb-12 leading-tight"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.05 }}
        >
          Three Ways to Exit Agency{" "}
          <motion.span
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
            <InlineVectorText className="italic text-gray-900 " text="Dependency" 
              imageClassName="bottom-0 sm:-bottom-1 lg:w-[300px] w-[180px] translate-y-[35%] sm:translate-y-[45%]"
              />
            </motion.span>{"  "}
            
        </motion.h2>

        {/* Three cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {PLANS.map((plan, index) => (
            <motion.div
              key={plan.id}
              className={`relative rounded-2xl bg-white p-6 md:p-8 shadow-sm border-2 flex flex-col ${
                plan.mostPopular ? "border-primary" : "border-gray-200"
              }`}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 + index * 0.05 }}
            >
              {plan.mostPopular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className="inline-block rounded-full bg-primary px-4 py-1 text-sm font-montserrat-bold text-white">
                    Most Popular
                  </span>
                </div>
              )}
              <div className={plan.mostPopular ? "pt-2" : ""}>
                <h3 className="text-xl font-montserrat-bold text-gray-900 mb-2">
                  {plan.title}
                </h3>
                <p className="text-3xl md:text-4xl font-montserrat-bold text-gray-900 mb-1">
                  {plan.price}
                </p>
                {plan.priceDetail && (
                  <p className="text-sm text-gray-500 font-montserrat-medium mb-4">
                    {plan.priceDetail}
                  </p>
                )}
                {plan.description && (
                  <p className="text-sm text-gray-600 font-montserrat-medium mb-5">
                    {plan.description}
                  </p>
                )}
                {!plan.description && plan.priceDetail && (
                  <div className="mb-5" />
                )}
                <ul className="space-y-3 flex-1 mb-8">
                  {plan.features.map((feature) => (
                    <li
                      key={feature}
                      className="flex items-start gap-2 text-sm text-gray-700"
                    >
                      <Check className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                      <span className="font-montserrat-medium">{feature}</span>
                    </li>
                  ))}
                </ul>
                <Button
                  asChild
                  className={
                    plan.ctaPrimary
                      ? "w-full bg-primary hover:bg-primary-700 text-white font-montserrat-semibold h-12 rounded-xl"
                      : "w-full border-2 border-primary text-primary bg-white hover:bg-primary/5 font-montserrat-semibold h-12 rounded-xl"
                  }
                >
                  <Link to={plan.ctaHref} className="inline-flex items-center justify-center gap-2">
                    {plan.ctaText}
                    {plan.ctaPrimary && (
                      <ArrowUpRight className="h-4 w-4" />
                    )}
                  </Link>
                </Button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
