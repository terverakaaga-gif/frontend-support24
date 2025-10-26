import React from "react";
import { motion } from "framer-motion";
import { InlineVectorText } from "@/components/InlineVectorText";
import { Button } from "@/components/ui/button";

interface GettingStartedSectionProps {
  className?: string;
}

export const GettingStartedSection: React.FC<GettingStartedSectionProps> = ({
  className = "",
}) => {
  const steps = [
    {
      number: "01",
      title: "Download the App",
      description: "Create your profile in minutes",
    },
    {
      number: "02",
      title: "Browse & Book",
      description: "Find the support that fits your goals and schedule",
    },
    {
      number: "03",
      title: "Connect & Thrive",
      description: "Build lasting relationships and enjoy more independence",
    },
  ];

  return (
    <section
      className={`relative py-16 md:py-24 px-6 md:px-12 bg-[#05030B] ${className}`}
    >
      {/* Background light rays */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <img
          src="/new-res/gradient-triangle.svg"
          alt="Vector Illustration Left"
          className="absolute w-80 h-80 md:-top-24 md:left-48 object-cover opacity-90"
        />
        <img
          src="/new-res/gradient-ckl.svg"
          alt="Vector Illustration"
          className="absolute w-80 h-80 md:-top-2 md:right-12 object-cover opacity-90"
        />
        <img
          src="/new-res/gradient-ckr.svg"
          alt=""
          className="absolute top-24 right-0 object-cover"
        />
      </div>

      <div className="max-w-7xl mx-auto relative">
        <div className="flex flex-col items-center gap-16">
          {/* How it Works Button */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <Button className="bg-gray-800 hover:bg-gray-700 text-white border border-gray-600 px-2 py-3 rounded-xl text-sm font-montserrat-medium flex items-center gap-2">
              <img src="/images/network.svg" alt="Arrow" className="w-4 h-4" />
              <span className="text-sm font-montserrat-medium">
                How it Works
              </span>
            </Button>
          </motion.div>

          {/* Main Title */}
          <motion.h1
            className="text-4xl md:text-5xl lg:text-6xl font-montserrat-bold text-white text-center leading-tight"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            Getting Started is{" "}
            <motion.span
              className="italic inline-block"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <InlineVectorText className="italic text-white" imageClassName=" sm:-bottom-10   translate-y-[35%] sm:translate-y-[45%]" text="Easy" y={-20} />
            </motion.span>
          </motion.h1>

          {/* Steps */}
          <motion.div
            className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12 w-full max-w-5xl"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            {steps.map((step, index) => (
              <motion.div
                key={index}
                className="flex flex-col items-center text-center relative"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.6 + index * 0.2 }}
              >
                {/* Step Number */}
                <motion.div
                  className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center mb-6 relative z-10"
                  whileHover={{ scale: 1.05 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                >
                  <span className="text-2xl font-montserrat-bold text-white">
                    {step.number}
                  </span>
                </motion.div>

                {/* Dotted curved arrow (except for last step) */}
                {index < steps.length - 1 && (
                  <div className="hidden md:block absolute -top-2 left-60 w-32 h-12 transform translate-x-6">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 120 50"
                      fill="none"
                      stroke="#ffffff"
                      strokeWidth="2"
                      strokeDasharray="6 6"
                      className="w-full h-full opacity-70"
                    >
                      <path
                        d="M2,40 C40,10 80,10 118,40"
                        stroke="#ffffff"
                        strokeWidth="2"
                        strokeDasharray="6 6"
                        fill="none"
                        markerEnd="url(#arrowhead)"
                      />
                      <defs>
                        <marker
                          id="arrowhead"
                          markerWidth="6"
                          markerHeight="6"
                          refX="5"
                          refY="3"
                          orient="auto"
                          fill="#ffffff"
                        >
                          <path d="M0,0 L6,3 L0,6 Z" />
                        </marker>
                      </defs>
                    </svg>
                  </div>
                )}

                {/* Step Content */}
                <div className="max-w-xs">
                  <h3 className="text-xl md:text-2xl font-montserrat-bold text-white mb-3">
                    {step.title}
                  </h3>
                  <p className="text-base md:text-lg text-white/80 font-montserrat-medium leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
};
