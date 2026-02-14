import React from "react";
import { motion } from "framer-motion";
import { ShieldCheck } from "@solar-icons/react";
import { Button } from "@/components/ui/button";
import { RoundedFigure } from "@/components/RoundedFigure";
import { InlineVectorText } from "@/components/InlineVectorText";
import { FeatureCard } from "@/components/FeatureCard";
import { FEATURE_CARDS } from "@/constants/landingpage";

interface SafeVerifiedReliableSectionProps {
  className?: string;
}

export const SafeVerifiedReliableSection: React.FC<SafeVerifiedReliableSectionProps> = ({
  className = ""
}) => {
  const fadeInUp = {
    initial: { opacity: 0, y: 40 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, margin: "-100px" },
    transition: { duration: 0.6 },
  };

  return (
    <section className={`relative px-4 py-8 sm:px-6 sm:py-10 md:px-8 md:py-12 lg:p-16 bg-gray-50/90 text-black ${className}`}>
      {/* Vector Illustration Circle */}
      <img
        src="/new-res/gradient-ckr.svg"
        alt="Vector Illustration"
        className="absolute w-60 h-60 md:w-80 md:h-80 -top-10 md:-top-16 -left-16 md:-left-24 object-cover pointer-events-none opacity-80"
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-10 lg:gap-16 w-full mx-auto max-w-7xl">
        {/* Left Content Section */}
        <motion.div
          className="flex flex-col gap-4 sm:gap-5 lg:gap-6 justify-center text-center lg:text-left"
          {...fadeInUp}
        >
          <div className="flex justify-center lg:justify-start">
            <RoundedFigure
              icon={ShieldCheck}
              text="Enterprise-Grade Security"
            />
          </div>
          <div className="flex gap-1 items-center justify-center lg:justify-start">
            <motion.h1 className="text-3xl sm:text-3xl md:text-4xl lg:text-5xl font-montserrat-bold leading-tight">
              Safe. Verified.{" "}
              <InlineVectorText
                className="italic"
                text="Reliable"
                imageClassName="bottom-0 sm:-bottom-1 w-[200px] translate-y-[35%] sm:translate-y-[45%]"
              />.
            </motion.h1>
          </div>
          <p className="text-sm sm:text-base md:text-lg leading-relaxed font-montserrat-medium text-gray-700 max-w-xl mx-auto lg:mx-0">
            The wellbeing comes first. Every worker is carefully verified, every booking is protected, and every interaction is secured
          </p>
          <motion.div
            className="mt-2 sm:mt-4 flex flex-col items-center lg:items-start"
            initial={{ scale: 0 }}
            whileInView={{ scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <Button className="px-6 py-4 sm:px-8 sm:py-6 font-montserrat-semibold transition-colors text-sm sm:text-base  sm:w-auto">
              Download App
            </Button>

            {/* Vector Arrow */}
            <motion.div
              className="mt-6 sm:mt-20 ml-0 sm:ml-40 hidden lg:block"
              animate={{ x: [0, 10, 0] }}
              transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
            >
              <img src="/new-res/good-arrow.svg" alt="Arrow pointing to features" className="w-28 sm:w-60" />
            </motion.div>
          </motion.div>
        </motion.div>

        {/* Feature Cards Grid */}
        <div className="w-full grid grid-cols-1 gap-4 sm:gap-5 lg:grid-cols-2 lg:gap-6">
          {FEATURE_CARDS.map((feature, i) => (
            <motion.div
              key={i + feature.footer}
              className="w-full"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              whileHover={{ y: -5, scale: 1.02 }}
            >
              <FeatureCard
                title={feature.title}
                icon={feature.icon}
                content={feature.content}
                footer={feature.footer}
              />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
