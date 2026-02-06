import React from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ShieldCheck, CheckCircle } from "@solar-icons/react";
import { Bell, MessageCircle, MapPin, Calendar, Clock } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { InlineVectorText } from "../InlineVectorText";

export function EventsHeroSection() {
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
        <div className="text-center max-w-5xl mx-auto mb-12 md:mb-16">
          {/* Headline */}
          <motion.h1
            className="text-4xl md:text-5xl lg:text-6xl font-montserrat-bold text-white mb-6 leading-tight"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            Discover{" "}
            <motion.span
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <InlineVectorText className="italic text-white " text="Events" 
              imageClassName="bottom-0 sm:-bottom-1 lg:w-[200px] w-[180px] translate-y-[35%] sm:translate-y-[45%]"
              />
            </motion.span>{"  "}
            {/* <span className="relative inline-block">
              Events
              <span className="absolute bottom-0 left-0 right-0 h-1 bg-yellow-400" />
            </span>{" "} */}
            Around You
          </motion.h1>

          {/* Sub-headline */}
          <motion.p
            className="text-lg md:text-xl lg:text-2xl text-white/90 font-montserrat-medium mb-8 max-w-3xl mx-auto"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
          >
            Find and register for community events, camping, and activities that matches your interest
          </motion.p>

          {/* Browse Events Button */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
          >
            <Button
              onClick={() => navigate("/events/browse")}
              className="bg-primary hover:bg-primary-700 text-white px-8 py-6 text-lg font-montserrat-semibold rounded-xl"
              size="lg"
            >
              Browse Events
            </Button>
          </motion.div>
        </div>

        {/* Mobile Phone Interface */}
        <motion.div
          className="relative max-w-md mx-auto "
          initial={{ opacity: 0, scale: 0.8, y: 100 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 1.2, delay: 0.6, ease: "easeOut" }}
        >
          <img src="/images/iMockup.png" alt="Events Hero Mobile" className="w-full h-full object-cover" />
        </motion.div>

        {/* Floating Information Cards */}
        {/* Left Card */}
        <motion.div
          className="hidden lg:block absolute left-24 top-1/2 -translate-y-1/2 bg-gray-900/80 backdrop-blur-sm rounded-xl p-6 max-w-xs border border-gray-700/50"
          initial={{ opacity: 0, x: -50, rotate: -5 }}
          animate={{ opacity: 1, x: 0, rotate: -5 }}
          transition={{ duration: 0.8, delay: 1.0 }}
        >
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0">
              <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center">
                <ShieldCheck className="h-6 w-6 text-white" />
              </div>
            </div>
            <div>
              <h3 className="text-white font-montserrat-semibold mb-2">Verified Organizers</h3>
              <p className="text-sm text-gray-300">
                Every event is reviewed and approved by Support24 to ensure authenticity and compliance with our standards
              </p>
            </div>
          </div>
        </motion.div>

        {/* Right Card */}
        <motion.div
          className="hidden lg:block absolute right-24 top-1/2 -translate-y-1/2 bg-gray-900/80 backdrop-blur-sm rounded-xl p-6 max-w-xs border border-gray-700/50"
          initial={{ opacity: 0, x: 50, rotate: 5 }}
          animate={{ opacity: 1, x: 0, rotate: 5 }}
          transition={{ duration: 0.8, delay: 1.2 }}
        >
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0">
              <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center">
                <CheckCircle className="h-6 w-6 text-white" />
              </div>
            </div>
            <div>
              <h3 className="text-white font-montserrat-semibold mb-2">Safe Participation</h3>
              <p className="text-sm text-gray-300">
                Your data and bookings are protected. We partner only with verified organizers for secure event experience
              </p>
            </div>
          </div>
        </motion.div>
      </section>
    </>
  );
}
