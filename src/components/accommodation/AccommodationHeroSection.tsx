import React from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { InlineVectorText } from "../InlineVectorText";

export function AccommodationHeroSection() {
  const { scrollY } = useScroll();
  const navigate = useNavigate();

  // Parallax effects
  const y1 = useTransform(scrollY, [0, 500], [0, 150]);
  const y2 = useTransform(scrollY, [0, 500], [0, -100]);

  const stagger = {
    initial: { opacity: 0, y: 40 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true },
  };

  return (
    <>
      {/* Animated Background - Dark primary with flowing curves */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        {/* Top left flowing curve */}
        <motion.div
          {...stagger}
          className="absolute -top-40 -left-40 w-[800px] h-[800px]"
          style={{ y: y1 }}
        >
          <div className="w-full h-full bg-[#05030B] rounded-full blur-3xl" />
        </motion.div>

        {/* Bottom right flowing curve */}
        <motion.div
          {...stagger}
          className="absolute -bottom-40 -right-40 w-[800px] h-[800px]"
          style={{ y: y2 }}
        >
          <div className="w-full h-full bg-gradient-to-tl from-primary-500/20 via-indigo-600/10 to-transparent rounded-full blur-3xl" />
        </motion.div>

        {/* Center flowing elements */}
        <motion.div
          className="absolute top-1/3 left-1/4 w-[600px] h-[600px]"
          animate={{
            x: [0, 50, 0],
            y: [0, 30, 0],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          <div className="w-full h-full bg-gradient-to-r from-primary-500/10 to-purple-500/10 rounded-full blur-3xl" />
        </motion.div>
      </div>

      {/* Gradient triangles and circles */}
      <img
        src="/new-res/gradient-triangle.svg"
        alt=""
        className="absolute -top-16 -left-28 object-cover pointer-events-none"
      />
      <img
        src="/new-res/gradient-triangle.svg"
        alt=""
        className="absolute -top-52 -left-28 object-cover pointer-events-none"
      />
      <img
        src="/new-res/gradient-ckr.svg"
        alt=""
        className="absolute top-24 right-0 object-cover pointer-events-none"
      />

      {/* Hero Section */}
      <section className="relative pt-32 md:pt-40 px-4 md:px-8 ">
        <div className="text-center max-w-7xl mx-auto">
          {/* Headline */}
          <motion.h1
            className="text-4xl md:text-5xl lg:text-6xl font-montserrat-bold text-white mb-6 leading-tight"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <motion.span
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <InlineVectorText className="italic text-white " text="Find" 
              imageClassName="bottom-0 sm:-bottom-1 lg:w-[200px] w-[180px] translate-y-[35%] sm:translate-y-[45%]"
              />
            </motion.span>{"  "}
            Comfortable Accommodation
          </motion.h1>

          {/* Sub-headline */}
          <motion.p
            className="text-lg md:text-xl lg:text-2xl text-white/90 font-montserrat-medium mb-8 max-w-5xl mx-auto"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
          >
            Explore verified housing options for participants and support staff
          </motion.p>

          {/* View Listings Button */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
          >
            <Button
              onClick={() => {
                const element = document.getElementById("accommodation-listings");
                if (element) {
                  element.scrollIntoView({ behavior: "smooth" });
                }
              }}
              className="bg-primary hover:bg-primary-700 text-white px-8 py-6 text-lg font-montserrat-semibold rounded-xl"
              size="lg"
            >
              View Listings
            </Button>
          </motion.div>
          {/* /Users/ubong/Dev/Novadatech/frontend-support24/public/images/Accommodation.png */}
          <motion.div
          className="relative pt-20 "
          initial={{ opacity: 0, scale: 0.8, y: 100 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 1.2, delay: 0.6, ease: "easeOut" }}
        >
          <img src="/images/Events.png" alt="Accommodation Hero" className="w-full h-full object-cover" />
        </motion.div>
        </div>
      </section>
    </>
  );
}
