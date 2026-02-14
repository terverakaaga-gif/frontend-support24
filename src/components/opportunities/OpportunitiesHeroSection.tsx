import React, { useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, MapPin, CirclePlay } from "lucide-react";
import { InlineVectorText } from "../InlineVectorText";

const SUGGESTED_SEARCHES = [
  { title: "Support Worker", count: 120 },
  { title: "Youth Worker", count: 85 },
  { title: "Nursing Assistant", count: 64 },
  { title: "Clinicians", count: 42 },
  { title: "Support Worker", count: 98 },
  { title: "Youth Worker", count: 56 },
  { title: "Nursing Assistant", count: 71 },
  { title: "Support Worker", count: 120 },
  { title: "Clinicians", count: 38 },
  { title: "Youth Worker", count: 62 },
  { title: "Nursing Assistant", count: 45 },
  { title: "Support Worker", count: 89 },
];

export function OpportunitiesHeroSection() {
  const { scrollY } = useScroll();
  const [jobKeyword, setJobKeyword] = useState("");
  const [location, setLocation] = useState("");

  // Parallax effects
  const y1 = useTransform(scrollY, [0, 500], [0, 150]);
  const y2 = useTransform(scrollY, [0, 500], [0, -100]);

  const stagger = {
    initial: { opacity: 0, y: 40 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true },
  };

  const handleSearch = () => {
    const element = document.getElementById("opportunities-listings");
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleSuggestedSearch = (title: string) => {
    setJobKeyword(title);
    const element = document.getElementById("opportunities-listings");
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
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
      <section className="relative pt-32 md:pt-40 px-4 md:px-8 pb-20 md:pb-32">
        <div className="max-w-7xl mx-auto">
          {/* Headline */}
          <motion.h1
            className="text-4xl md:text-5xl lg:text-6xl font-montserrat-bold text-white mb-4 leading-tight text-center"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            Get The Right{" "}
            <motion.span
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <InlineVectorText className="italic text-white " text="Job" 
              imageClassName="bottom-0 sm:-bottom-1 lg:w-[200px] w-[180px] translate-y-[35%] sm:translate-y-[45%]"
              />
            </motion.span>{"  "}
            You Deserve
          </motion.h1>

          {/* Sub-headline */}
          <motion.p
            className="text-lg md:text-xl text-white/90 font-montserrat-medium mb-8 text-center "
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
          >
            1,000+ jobs available here! Your dream job is waiting.
          </motion.p>

          {/* Search Bar */}
          <motion.div
            className="flex flex-col sm:flex-row gap-0 bg-slate-800/90 border border-white/20 rounded-xl overflow-hidden mb-10 max-w-5xl mx-auto"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
          >
            <div className="flex-1 flex items-center gap-3 px-4 py-3 sm:py-0 sm:min-h-[56px] border-b sm:border-b-0 sm:border-r border-white/20">
              <Search className="h-5 w-5 text-white/70 shrink-0" />
              <input
                type="text"
                placeholder="Support Worker"
                value={jobKeyword}
                onChange={(e) => setJobKeyword(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                className="flex-1 min-w-0 bg-transparent text-white placeholder:text-white/60 font-montserrat-medium text-base outline-none"
              />
            </div>
            <div className="flex-1 flex items-center gap-3 px-4 py-3 sm:py-0 sm:min-h-[56px] border-b sm:border-b-0 sm:border-r border-white/20">
              <MapPin className="h-5 w-5 text-white/70 shrink-0" />
              <input
                type="text"
                placeholder="Albion Park"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                className="flex-1 min-w-0 bg-transparent text-white placeholder:text-white/60 font-montserrat-medium text-base outline-none"
              />
            </div>
            <Button
              onClick={handleSearch}
              className="bg-primary hover:bg-primary-700 text-white font-montserrat-semibold rounded-none h-full min-h-[56px] px-8 shrink-0"
            >
              Search
            </Button>
          </motion.div>

          {/* Suggested Searches */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
          >
            <h2 className="text-white font-montserrat-semibold text-base mb-4">
              Suggested Searches
            </h2>
            <div className="flex flex-wrap gap-3">
              {SUGGESTED_SEARCHES.map((item, index) => (
                <button
                  key={`${item.title}-${index}`}
                  type="button"
                  onClick={() => handleSuggestedSearch(item.title)}
                  className="flex items-center gap-2 px-4 py-3 rounded-lg border border-white/30 bg-slate-800/60 hover:bg-slate-700/60 text-white font-montserrat-medium text-sm transition-colors text-left"
                >
                  <CirclePlay className="h-4 w-4 text-white/70 shrink-0" />
                  <span className="flex flex-col items-start">
                    <span>{item.title}</span>
                    <span className="text-white/70 text-xs font-normal">
                      {item.count} jobs available
                    </span>
                  </span>
                </button>
              ))}
            </div>
          </motion.div>
        </div>
      </section>
    </>
  );
}
