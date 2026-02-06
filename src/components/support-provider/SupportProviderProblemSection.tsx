import React from "react";
import { motion } from "framer-motion";
import { CircleHelp } from "lucide-react";
import { InlineVectorText } from "../InlineVectorText";

export function SupportProviderProblemSection() {
  return (
    <section className="relative py-16 md:py-24 px-4 md:px-8 bg-white">
      <div className="max-w-7xl mx-auto text-center">
        {/* The Real Problem tag */}
        <motion.div
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-200/90 text-purple-900 shadow-sm mb-8"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <CircleHelp className="h-4 w-4 shrink-0" />
          <span className="font-montserrat-semibold text-sm">
            The Real Problem
          </span>
        </motion.div>

        {/* Headline */}
        <motion.h2
          className="text-2xl md:text-3xl lg:text-4xl font-montserrat-bold text-gray-900 mb-6 leading-tight max-w-6xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.05 }}
        >
          NDIS Providers Don&apos;t Have a Workforce Problem. They Have an
          Agency{" "}
          <motion.span
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <InlineVectorText className="italic text-gray-900 " text="Dependency" 
              imageClassName="bottom-0 sm:-bottom-1 lg:w-[200px] w-[180px] translate-y-[35%] sm:translate-y-[45%]"
              />
            </motion.span>{"  "}
          Problem.
        </motion.h2>

        {/* Intro paragraph */}
        <motion.p
          className="text-base md:text-lg text-gray-700 font-montserrat-medium mb-10 max-w-5xl mx-auto leading-relaxed"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          Most providers don&apos;t want to use agencies. They use them because
          recruiting support workers at scale is hard, coordinating casual
          workers is operationally painful, and emergency coverage creates
          constant stress. So agencies fill the gap.
        </motion.p>

        {/* Central image - add your image at public/new-res/support-provider-agency-section.jpg */}
        

      {/* <img src="/images/img.png" alt="Agency Problem" className="w-full h-[500px] rounded-lg object-cover" /> */}
        <motion.div
          className="relative max-w-7xl mx-auto  "
          initial={{ opacity: 0, scale: 0.8, y: 100 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 1.2, delay: 0.6, ease: "easeOut" }}
        >
          <img src="/images/img.png" alt="Agency Problem" className="w-full h-[500px] rounded-lg object-cover" />
        </motion.div>
      </div>
    </section>
  );
}
