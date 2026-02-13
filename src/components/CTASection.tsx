import React from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { InlineVectorText } from "@/components/InlineVectorText";

interface CTASectionProps {
  className?: string;
}

export const CTASection: React.FC<CTASectionProps> = ({
  className = ""
}) => {
  const fadeInUp = {
    initial: { opacity: 0, y: 40 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, margin: "-100px" },
    transition: { duration: 0.6 },
  };

  return (
    <section className={`relative min-h-fit p-2 md:p-8 lg:p-16 bg-gray-50 text-black ${className}`}>
      <motion.div
        className=""
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
      >
        <div className="relative w-full bg-[#05030B] text-white rounded-3xl md:rounded-[3rem] overflow-hidden shadow-2xl">
          {/* Vector Illustrations */}
          <img
            src="/new-res/gradient-triangle.svg"
            alt="Vector Illustration Left"
            className="absolute w-80 h-80 md:-top-24 md:left-48 object-cover pointer-events-none opacity-90"
          />
          <img
            src="/new-res/gradient-ckl.svg"
            alt="Vector Illustration"
            className="absolute w-80 h-80 md:-top-2 md:right-12 object-cover pointer-events-none opacity-90"
          />

          <div className="relative flex flex-col md:flex-row gap-3">
            {/* Left Content */}
            <div className="flex-1 p-8 md:p-16 flex flex-col justify-center">
              <motion.h1 className="text-2xl md:text-4xl lg:text-4xl font-montserrat-bold mb-6 md:mb-0 leading-tight">
                Take Control of{" "}
                <InlineVectorText className="italic" text="your" y={-24} imageClassName="-bottom-8 sm:-bottom-10 w-[200px]  translate-y-[35%] sm:translate-y-[45%]" />{" "}
                <br className="mb-12" /> Support  {" "}
                <span>Today</span>
              </motion.h1>

              <p className="text-lg md:text-xl font-montserrat-medium max-w-xl my-4 lg:my-8 leading-loose tracking-wide">
                Join Support24 and discover a simpler way to manage routines,
                book support, and enjoy community programs with complete
                confidence
              </p>

              {/* Download Buttons */}
              <div className="flex  md:self-start justify-center gap-4 lg:mb-12 mb-2">
                <Button
                  onClick={() => window.open('https://apps.apple.com/au/app/support24/id6756564961', '_blank')}
                  className="flex gap-1 items-center p-6"
                >
                  <img src="/new-res/apple-icon.svg" alt="apple-logo" />
                  <div className="flex flex-col items-center justify-center">
                    <p className="text-xs">Download on the</p>
                    <strong>App Store</strong>
                  </div>
                </Button>
                <Button
                  variant="outline"
                  onClick={() => window.open('https://play.google.com/store/apps/details?id=com.support24.app&pcampaignid=web_share', '_blank')}
                  className="flex gap-1 items-center p-6 bg-transparent hover:bg-primary-900"
                >
                  <img src="/new-res/google-icon.svg" alt="google-logo" />
                  <div className="flex flex-col items-center justify-center">
                    <p className="text-xs">GET IT ON</p>
                    <strong>Google Play</strong>
                  </div>
                </Button>
              </div>
            </div>

            {/* Right Image */}
            <motion.div className="max-w-md px-8 py-4 md:px-16 md:py-16" {...fadeInUp}>
              <img
                src="/new-res/Ratio.png"
                alt="Ratio Illustration"
                className="w-full max-w-sm md:max-w-md lg:max-w-xl mx-auto"
              />
            </motion.div>
          </div>
        </div>
      </motion.div>
    </section>
  );
};
