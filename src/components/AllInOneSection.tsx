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
    <section className={`relative py-12 sm:py-16 md:py-20 lg:py-24 px-4 sm:px-6 md:px-8 lg:px-12 bg-gradient-to-b from-primary/5 via-primary/10 to-primary/5 lg:mt-40 mt-10 ${className}`}>
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
            <InlineVectorText className="italic" text="All in" y={-10} />{" "}
            <span className="italic">One</span> Place
          </motion.h1>
          <p className="text-sm sm:text-base md:text-lg lg:text-xl max-w-4xl mx-auto leading-relaxed font-montserrat-medium text-gray-200">
            Comprehensive tools and support designed to give you complete
            control over your care journey
          </p>
        </motion.div>

        {/* Cards Grid - Desktop: 4 cards top row + 1 centered bottom | Mobile: Stacked vertically */}
        <div className="flex flex-col items-center gap-5 sm:gap-6 md:gap-8">
          {/* Top Row - 4 Cards (stacked on mobile, grid on desktop) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 md:gap-6 w-full">
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
          </div>

          {/* Bottom Row - 1 Centered Card */}
          {ALL_IN_ONE_CARDS[4] && (
            <div className="flex justify-center w-full">
              <motion.div
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.4 }}
                whileHover={{ y: -5 }}
                className="w-full sm:max-w-md lg:max-w-lg"
              >
                <AllInOneCard
                  title={ALL_IN_ONE_CARDS[4].title}
                  content={ALL_IN_ONE_CARDS[4].content}
                  icon={ALL_IN_ONE_CARDS[4].icon}
                />
              </motion.div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
