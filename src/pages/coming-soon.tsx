// import React from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { LandingLayout } from "@/components/layouts/LandingLayout";


export default function Support24Landing() {
  const { scrollY } = useScroll();

  // Parallax effects
  const y1 = useTransform(scrollY, [0, 500], [0, 150]);
  const y2 = useTransform(scrollY, [0, 500], [0, -100]);

  const fadeInUp = {
    initial: { opacity: 0, y: 40 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, margin: "-100px" },
    transition: { duration: 0.6 },
  };

  const stagger = {
    initial: { opacity: 0, y: 40 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true },
  };

  return (
    <LandingLayout>
      {/* Animated Background - Dark primary with flowing curves */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden ">
        {/* Top left flowing curve */}
        <motion.div
          {...stagger}
          className="absolute -top-40 -left-40 w-[800px] h-[800px] "
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

      {/* Two long primary gradient long pointy triangle at the top left corner (using svg image) */}
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

      {/* Gradient primary circle at top right */}
      <img
        src="/new-res/gradient-ckr.svg"
        alt=""
        className="absolute top-24 right-0 object-cover pointer-events-none"
      />

      {/* Hero Section */}
      <section className="relative pt-16 mt-16 md:pt-28 px-4 md:px-8 text-6xl md:text-4xl lg:text-5xl  mb-6 md:mb-8 leading-tight">
        <div className="text-center max-w-5xl mx-auto">
         


        

          {/* Animated Trust Badges */}
         
        </div>

        {/* Animated Phone Mockup with Floating Cards */}
        <motion.div 
          className="w-full max-w-5xl mx-auto px-8 mb-20"
          initial={{ opacity: 0, scale: 0.8, y: 100 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 1.2, delay: 1.4, ease: "easeOut" }}
        >
          <motion.div
            animate={{ 
              // y: [0, -10, 0],
              // rotate: [0, 1, -1, 0]
            }}
            transition={{ 
              duration: 6,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            <img src="/images/coming-soon.png" className="lg:w-full lg:h-full w-[600px]   object-cover" alt="Phone Mockup" />
          </motion.div>
        </motion.div>

       
        
      </section>

      

     

    </LandingLayout>
  );
}
