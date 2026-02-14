import React from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { CheckCircle } from "@solar-icons/react";
import { ArrowUpRight } from "lucide-react";
import { InlineVectorText } from "../InlineVectorText";

export function SupportProviderHeroSection() {
  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 500], [0, 150]);
  const y2 = useTransform(scrollY, [0, 500], [0, -100]);

  return (
    <>
      {/* Animated Background - Dark indigo to blue/purple gradient */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <motion.div
          className="absolute -top-40 -left-40 w-[800px] h-[800px]"
          style={{ y: y1 }}
        >
          <div className="w-full h-full bg-[#05030B] rounded-full blur-3xl" />
        </motion.div>
        <motion.div
          className="absolute -bottom-40 -right-40 w-[800px] h-[800px]"
          style={{ y: y2 }}
        >
          <div className="w-full h-full bg-gradient-to-tl from-primary-500/20 via-indigo-600/10 to-transparent rounded-full blur-3xl" />
        </motion.div>
        <motion.div
          className="absolute top-1/3 left-1/4 w-[600px] h-[600px]"
          animate={{ x: [0, 50, 0], y: [0, 30, 0] }}
          transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
        >
          <div className="w-full h-full bg-gradient-to-r from-primary-500/10 to-purple-500/10 rounded-full blur-3xl" />
        </motion.div>
      </div>

      <section className="relative pt-32 md:pt-40 px-4 md:px-8 ">
        <div className="max-w-7xl mx-auto text-center">
          {/* Early Adopter Banner */}
          <motion.div
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-white/10 border border-white/20 mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <CheckCircle className="h-5 w-5 text-primary shrink-0" />
            <span className="text-sm font-montserrat-medium text-white">
              Early Adopter Program Now Open
            </span>
          </motion.div>

          {/* Main Headline */}
          <motion.h1
            className="text-4xl md:text-5xl lg:text-6xl xl:text-6xl font-montserrat-bold text-white mb-6 leading-tight"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
          >
            Cut Workforce Cost 40% While{" "}
            <motion.span
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <InlineVectorText className="italic text-white " text="Owning" 
              imageClassName="bottom-0 sm:-bottom-1 lg:w-[300px] w-[180px] translate-y-[35%] sm:translate-y-[45%]"
              />
            </motion.span>{"  "}
            
            Your Workers
          </motion.h1>

          {/* Tagline */}
          <motion.p
            className="text-lg md:text-xl text-white/90 font-montserrat-medium mb-10 max-w-7xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.25 }}
          >
            Available as platform-only or full Agency Exit. Scale at your pace.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <Button
              asChild
              className="bg-primary hover:bg-primary-700 text-white font-montserrat-semibold px-8 py-6 text-base rounded-xl inline-flex items-center gap-2"
            >
              <Link to="/register-provider">
                Get Started
                <ArrowUpRight className="h-5 w-5" />
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              className="border-2 border-primary text-white hover:bg-primary/10 font-montserrat-semibold px-8 py-6 text-base rounded-xl bg-transparent"
            >
              <Link to="/login">Login</Link>
            </Button>
          </motion.div>
        </div>
        <motion.div
          className="relative max-w-7xl mx-auto pt-12 "
          initial={{ opacity: 0, scale: 0.8, y: 100 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 1.2, delay: 0.6, ease: "easeOut" }}
        >
          <img src="/images/organization.png" alt="Events Hero Mobile" className="w-full h-full object-cover" />
        </motion.div>
        {/* /Users/ubong/Dev/Novadatech/frontend-support24/public/images/organization.png */}
      </section>
    </>
  );
}
