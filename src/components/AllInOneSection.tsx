import React from "react";
import { motion } from "framer-motion";
import { InlineVectorText } from "@/components/InlineVectorText";
import { AllInOneCard } from "@/components/AllInOneCard";
import { ALL_IN_ONE_CARDS } from "@/constants/landingpage";

interface AllInOneSectionProps {
  className?: string;
}

export const AllInOneSection: React.FC<AllInOneSectionProps> = ({ 
  className = "" 
}) => {
  const fadeInUp = {
    initial: { opacity: 0, y: 40 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, margin: "-100px" },
    transition: { duration: 0.6 },
  };

  return (
    <section className={`relative py-12 sm:py-16 md:py-20 lg:py-24 px-4 sm:px-6 md:px-8 lg:px-12 bg-[#05030B] lg:pt-48 pt-20 ${className}`}>
      {/* Decorative Shadows */}
  <div className="absolute inset-0 pointer-events-none">
    {/* Top-left glow */}
    <div className="absolute top-10 left-10 w-[500px] h-[300px] bg-primary/30 blur-[160px] rounded-full -translate-x-1/3 -translate-y-1/3"></div>

    {/* Bottom-left glow */}
    <div className="absolute bottom-10 left-10 w-[500px] h-[300px] bg-primary/30 blur-[160px] rounded-full -translate-x-1/3 translate-y-1/3"></div>
  </div>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div className="text-center mb-10 sm:mb-12 md:mb-16" {...fadeInUp}>
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-gray-800/80 rounded-full mb-6 sm:mb-8">
            <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="currentColor" strokeWidth="2"/>
              <path d="M12 8V12L14.5 14.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
            <span className="text-white text-sm font-montserrat-medium">Everything You Need</span>
          </div>
          <motion.h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-montserrat-bold mb-4 sm:mb-6 leading-tight text-white">
            <InlineVectorText 
              className="italic" 
              text="All " 
              imageClassName="bottom-0 sm:bottom-0 translate-y-[40%] sm:translate-y-[50%]"
            />{" "}
            <span className="italic"> </span> in One Place
          </motion.h1>
          <p className="text-sm sm:text-base md:text-lg lg:text-xl max-w-4xl mx-auto leading-relaxed font-montserrat-medium text-gray-200">
            Comprehensive tools and support designed to give you complete
            control over your care journey
          </p>
        </motion.div>

        {/* Cards Grid - Desktop: 4 cards top row + 1 centered bottom | Mobile: Stacked vertically */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 md:gap-6 w-full">
          {/* First 4 Cards */}
          {ALL_IN_ONE_CARDS.slice(0, 4).map((tool, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              whileHover={{ y: -5 }}
              className="w-full"
            >
              <AllInOneCard
                title={tool.title}
                content={tool.content}
                icon={tool.icon}
              />
            </motion.div>
          ))}

          {/* 5th Card - Centered on mobile/tablet, spans from middle of column 2 to end of column 3 on desktop */}
          {ALL_IN_ONE_CARDS[4] && (
            <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.4 }}
            whileHover={{ y: -5 }}
            className="
              w-full 
              sm:col-span-2 sm:mx-auto 
              lg:col-span-1 lg:col-start-2 lg:col-end-4 
              flex justify-center
            "
          >
            <div className="w-full lg:max-w-[330px]">
              <AllInOneCard
                title={ALL_IN_ONE_CARDS[4].title}
                content={ALL_IN_ONE_CARDS[4].content}
                icon={ALL_IN_ONE_CARDS[4].icon}
              />
            </div>
          </motion.div>
          )}
        </div>
      </div>
    </section>
  );
};
