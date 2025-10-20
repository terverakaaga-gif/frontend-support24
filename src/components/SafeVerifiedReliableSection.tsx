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
    <section className={`relative p-8 md:p-16 bg-gray-50/90 text-black ${className}`}>
      {/* Vector Illustration Circle */}
      <img
        src="/new-res/gradient-ckr.svg"
        alt="Vector Illustration"
        className="absolute w-80 h-80 -top-14 -left-24 object-cover pointer-events-none opacity-80"
      />

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 w-full mx-auto h-full">
        <motion.div
          className="col-span-full flex flex-col gap-3 md:col-span-2"
          {...fadeInUp}
        >
          <RoundedFigure
            icon={ShieldCheck}
            text="Enterprise-Grade Security"
          />
          <div className="flex gap-1 items-center md:pt-36">
            <motion.h1 className="text-2xl md:text-4xl lg:text-5xl font-montserrat-bold mb-6 md:mb-8 leading-tight">
              Safe. Verified.{" "}
              <InlineVectorText className="italic" text="Reliable" y={-10} />.
            </motion.h1>
          </div>
          <p className="text-xl max-w-3xl mx-auto leading-relaxed font-montserrat-semibold">
            The wellbeing comes first. Every support worker is thoroughly
            screened, and every interaction is secured
          </p>
          <motion.div
            className="mt-10"
            initial={{ scale: 0 }}
            whileInView={{ scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <motion.button>
              <Button className="p-8 font-montserrat-semibold transition-colors text-lg">
                Download App
              </Button>
            </motion.button>

            {/* Vector Arrow */}
            <motion.div
              className="mt-3 md:mt-40 md:ml-40"
              animate={{ x: [0, 10, 0] }}
              transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
            >
              <img src="/new-res/good-arrow.svg" alt="Arrow pointing to features" />
            </motion.div>
          </motion.div>
        </motion.div>

        {/* Feature Cards Grid */}
        <div className="col-span-1 lg:col-span-3 grid grid-cols-1 md:grid-cols-2 gap-3">
          {FEATURE_CARDS.map((feature, i) => (
            <motion.div
              key={i + feature.footer}
              className="overflow-hidden"
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
