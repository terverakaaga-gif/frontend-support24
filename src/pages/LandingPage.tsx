import { motion, useScroll, useTransform } from "framer-motion";
import {
  CheckCircle,
  ClockCircle,
  ShieldCheck,
} from "@solar-icons/react";
import { InlineVectorText } from "@/components/InlineVectorText";
import { Button } from "@/components/ui/button";
import { LandingLayout } from "@/components/layouts/LandingLayout";
import { SafeVerifiedReliableSection } from "@/components/SafeVerifiedReliableSection";
import { AllInOneSection } from "@/components/AllInOneSection";
import { TestimonialsSection } from "@/components/TestimonialsSection";
import { FAQSection } from "@/components/FAQSection";
import { CTASection } from "@/components/CTASection";

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

      {/* Decorative Elements */}
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
      <section className="relative pt-16 mt-16 md:pt-28 px-4 md:px-8 text-6xl md:text-4xl lg:text-5xl mb-6 md:mb-8 leading-tight">
        <div className="text-center max-w-5xl mx-auto">
          {/* Animated Title */}
          <motion.h1
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl leading-relaxed"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <motion.span
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="inline-block mr-3 md:mr-4"
            >
              {/* Added font-montserrat-bold to match the distinct typography in the reference image */}
              <InlineVectorText
                className="italic font-montserrat-bold text-white"
                text="Support"
              />
            </motion.span>

            <motion.span
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="font-montserrat-bold"
            >
              That Fits Your Life
            </motion.span>
          </motion.h1>

          {/* Animated Description */}
          <motion.p
            className="text-xl md:text-2xl lg:text-2xl text-white md:my-10 my-6 font-montserrat-medium"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            Support24 makes NDIS support effortless. Connect with verified
            workers, plan your routine and access trusted care - all simplified
          </motion.p>

          {/* Animated Download Buttons - Exact original code */}
          <motion.div
            className="flex justify-center gap-4 mb-12"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
          >
            <motion.div
              whileHover={{ scale: 1.03, y: -2 }}
              whileTap={{ scale: 0.98 }}
              transition={{ type: "spring", stiffness: 400, damping: 25 }}
            >
              <Button className="flex gap-2 items-center px-6 py-6 backdrop-blur-sm border border-white/10 shadow-lg shadow-primary/20">
                <img src="/new-res/apple-icon.svg" alt="apple-logo" />
                <div className="flex flex-col items-start justify-center">
                  <p className="text-xs opacity-80">Download on the</p>
                  <strong>App Store</strong>
                </div>
              </Button>
            </motion.div>
            <motion.div
              whileHover={{ scale: 1.03, y: -2 }}
              whileTap={{ scale: 0.98 }}
              transition={{ type: "spring", stiffness: 400, damping: 25 }}
            >
              <Button
                variant="outline"
                className="flex gap-2 items-center px-6 py-6 bg-white/5 backdrop-blur-sm border-white/20 hover:bg-white/10 hover:border-white/30 transition-all duration-300"
              >
                <img src="/new-res/google-icon.svg" alt="google-logo" />
                <div className="flex flex-col items-start justify-center">
                  <p className="text-xs opacity-80">GET IT ON</p>
                  <strong>Google Play</strong>
                </div>
              </Button>
            </motion.div>
          </motion.div>

          {/* Animated Trust Badges */}
          <motion.div
            className="flex flex-wrap justify-center gap-6 sm:gap-10 text-sm mb-16 font-montserrat-semibold"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 1.0 }}
          >
            {[
              { icon: ShieldCheck, text: "Verified Workers" },
              { icon: ShieldCheck, text: "Secure Platform" },
              { icon: ClockCircle, text: "24/7 Availability" }
            ].map((badge, index) => (
              <motion.div
                key={index}
                className="flex items-center gap-2.5 text-white/80"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 1.2 + index * 0.15 }}
              >
                <div className="w-5 h-5 rounded-full bg-white/10 flex items-center justify-center">
                  <badge.icon className="w-3 h-3 text-primary-400" />
                </div>
                <span>{badge.text}</span>
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* Animated Phone Mockup with Floating Cards */}
        <motion.div
          className="relative w-full max-w-5xl mx-auto px-8 -mb-8"
          initial={{ opacity: 0, scale: 0.8, y: 100 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 1.2, delay: 1.4, ease: "easeOut" }}
        >
          <div className="absolute inset-0 bg-gradient-radial from-primary/15 via-transparent to-transparent blur-3xl pointer-events-none" />
          <img src="/new-res/illustration.png" alt="Phone Mockup" className="relative" />
        </motion.div>
      </section>

      {/* Safe, Verified, Reliable Section */}
      <SafeVerifiedReliableSection />

      {/* Care Journey Section with Phone */}
      <section className=" bg-[#05030B] relative py-12 md:py-16 px-4 md:px-6">
        <img
          src="/new-res/gradient-triangle.svg"
          alt=""
          className="absolute -top-20 -left-28 object-cover pointer-events-none"
        />
        <img
          src="/new-res/gradient-ckr.svg"
          alt=""
          className="absolute top-24 right-0 object-cover pointer-events-none"
        />
        <div className="max-w-5xl mx-auto">
          <motion.div className="text-center mb-16" {...fadeInUp}>
            <motion.h1 className="text-4xl md:text-4xl lg:text-5xl font-montserrat-bold mb-6 md:mb-8 leading-relaxed">
              <InlineVectorText
                className="italic font-montserrat-bold text-white mr-2"
                text="Support24"
              /> is
              for Everyone in The Care Journey
            </motion.h1>
            <p className="text-xl md:text-2xl lg:text-2xl max-w-3xl mx-auto leading-relaxed font-montserrat-medium">
              Whether you are seeking support (providing care) or managing
              care plans, Support24 simplifies every part of the care process
            </p>
          </motion.div>

          {/* Center Phone Mockup */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <div className="w-full max-w-4xl mx-auto">
              <img src="/new-res/mobile2.svg" alt="Care Journey Phone" />
            </div>
          </motion.div>
        </div>
      </section>

      {/* All In One Place Section */}
      <AllInOneSection />

      {/* Testimonials Section */}
      <TestimonialsSection />

      {/* FAQ Section */}
      <FAQSection />

      {/* CTA Section */}
      <CTASection />

    </LandingLayout>
  );
}