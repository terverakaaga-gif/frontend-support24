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
    <section className={`relative py-16 md:py-24 px-6 md:px-12 bg-gradient-to-b from-transparent via-primary-900/20 to-transparent h-fit  ${className}`}>
      <div className=" px-6 md:px-8  mx-auto ">
        <motion.div className="text-center mb-16" {...fadeInUp}>
          <motion.h1 className="text-2xl md:text-4xl lg:text-5xl font-montserrat-bold mb-6 md:mb-8 leading-tight">
            <InlineVectorText className="italic" text="All " y={-36} /> in{" "}
            <span className="italic">One</span> Place
          </motion.h1>
          <p className="text-xl max-w-3xl mx-auto leading-relaxed font-montserrat-semibold text-white">
            Comprehensive tools and support designed to give you complete
            control over your care journey
          </p>
        </motion.div>

        {/* Cards Grid - 4 cards in top row, 1 card centered in bottom row */}
        <div className="flex flex-col items-center gap-8">
          {/* Top Row - 4 Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 w-full ">
            {ALL_IN_ONE_CARDS.slice(0, 4).map((tool, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                whileHover={{ y: -5 }}
                className="h-full"
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
          <div className="flex justify-center w-full">
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.4 }}
              whileHover={{ y: -5 }}
              className="w-full max-w-sm"
            >
              <AllInOneCard
                title={ALL_IN_ONE_CARDS[4].title}
                content={ALL_IN_ONE_CARDS[4].content}
                icon={ALL_IN_ONE_CARDS[4].icon}
              />
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};
