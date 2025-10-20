import React, { useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Star, ChevronDown, ChevronRight } from "lucide-react";
import {
  CheckCircle,
  ClockCircle,
  QuestionCircle,
  ShieldCheck,
} from "@solar-icons/react";
import { InlineVectorText } from "@/components/InlineVectorText";
import { Button } from "@/components/ui/button";
import {
  ALL_IN_ONE_CARDS,
} from "@/constants/landingpage";
import { FeatureCard } from "@/components/FeatureCard";
import { RoundedFigure } from "@/components/RoundedFigure";
import {
  TestimonialCard,
  testimonialData,
} from "@/components/TestimonialsGrid";
import { LandingLayout } from "@/components/layouts/LandingLayout";
import { SafeVerifiedReliableSection } from "@/components/SafeVerifiedReliableSection";

export default function Support24Landing() {
  const [openFaq, setOpenFaq] = useState(null);
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
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        {/* Top left flowing curve */}
        <motion.div
          {...stagger}
          className="absolute -top-40 -left-40 w-[800px] h-[800px]"
          style={{ y: y1 }}
        >
          <div className="w-full h-full bg-gradient-to-br from-primary/20 via-purple-600/10 to-transparent rounded-full blur-3xl" />
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
        className="absolute top-10 -left-28 object-cover pointer-events-none"
      />
      <img
        src="/new-res/gradient-triangle.svg"
        alt=""
        className="absolute top-56 -left-28 object-cover pointer-events-none"
      />

      {/* Gradient blue circle at top right */}
      <img
        src="/new-res/gradient-ckr.svg"
        alt=""
        className="absolute top-24 right-0 object-cover pointer-events-none"
      />

      {/* Hero Section */}
      <section className="relative pt-16 md:pt-28 px-4 md:px-8">
        <div className="text-center max-w-5xl mx-auto">
          <motion.h1 className="text-2xl md:text-4xl lg:text-5xl font-montserrat-bold mb-6 md:mb-8 leading-tight">
            <InlineVectorText className="italic text-white" text="Support" />{" "}
            That Fits Your Life
          </motion.h1>

          <p className="text-xl text-white my-10 font-montserrat-semibold">
            Support24 makes NDIS support effortless. Connect with verified
            workers, plan your routine and access trusted care - all simplified
          </p>

          {/* Download Buttons */}
          <div className="flex flex-wrap justify-center gap-4 mb-12">
            <Button className="flex gap-1 items-center p-6">
              <img src="/new-res/apple-icon.svg" alt="apple-logo" />
              <div className="flex flex-col items-center justify-center">
                <p className="text-xs">Download on the</p>
                <strong>App Store</strong>
              </div>
            </Button>
            <Button
              variant="outline"
              className="flex gap-1 items-center p-6 bg-transparent hover:bg-primary-900"
            >
              <img src="/new-res/google-icon.svg" alt="google-logo" />
              <div className="flex flex-col items-center justify-center">
                <p className="text-xs">GET IT ON</p>
                <strong>Google Play</strong>
              </div>
            </Button>
          </div>

          {/* Trust Badges */}
          <div className="flex flex-wrap justify-center gap-8 text-sm mb-16 italic font-montserrat-semibold">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4" />
              <span>Verified Workers</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4" />
              <span>NDIS Approved</span>
            </div>
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4" />
              <span>Secure Platform</span>
            </div>
            <div className="flex items-center gap-2">
              <ClockCircle className="w-4 h-4" />
              <span>24/7 Available</span>
            </div>
          </div>
        </div>

        {/* Phone Mockup with Floating Cards */}
        <div className="w-full max-w-4xl mx-auto px-8">
          <img src="/new-res/hero-illustration.svg" alt="Phone Mockup" />
        </div>
      </section>

      {/* Safe, Verified, Reliable Section */}
      <SafeVerifiedReliableSection />

      {/* Care Journey Section with Phone */}
      <section className="h-fit md:h-screen relative py-12 md:py-16 px-4 md:px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div className="text-center mb-16" {...fadeInUp}>
           <motion.h1 className="text-2xl md:text-4xl lg:text-5xl font-montserrat-bold mb-6 md:mb-8 leading-tight">
              <InlineVectorText className="italic" text="Support24" y={10} /> is
              for everyone in The Care Journey
            </motion.h1>
            <p className="text-xl max-w-3xl mx-auto leading-relaxed font-montserrat-semibold">
              Whether you are seeking support (providing care) or managing
              service, Support24 simplifies every part of the care process
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
      <section className="relative py-16 md:py-24 px-6 md:px-12 bg-gradient-to-b from-transparent via-primary-900/20 to-transparent h-fit md:h-screen">
        <div className="">
          <motion.div className="text-center mb-16" {...fadeInUp}>
            <motion.h1 className="text-2xl md:text-4xl lg:text-5xl font-montserrat-bold mb-6 md:mb-8 leading-tight">
              <InlineVectorText className="italic" text="All " y={-36} /> in{" "}
              <span className="italic">One</span> Place
            </motion.h1>
            <p className="text-xl max-w-3xl mx-auto leading-relaxed font-montserrat-semibold">
              Comprehensive tools and support designed to give you complete
              control over your care journey
            </p>
          </motion.div>

          <div className="flex justify-center items-center flex-col md:flex-row gap-6">
            {ALL_IN_ONE_CARDS.map((tool, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                whileHover={{ y: -5 }}
              >
                <FeatureCard
                  title={tool.title}
                  content={tool.content}
                  icon={tool.icon}
                  variant="dark"
                  isRounded={true}
                />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="relative min-h-screen p-6 md:p-8 lg:p-16 bg-gray-50/95 text-black">
        {/* Testimonials Section */}
        <div className="flex flex-col items-center">
          <div className="mb-6">
            <RoundedFigure icon={Star} text="Real Impacts" />
          </div>
         <motion.h1 className="text-2xl md:text-4xl lg:text-5xl font-montserrat-bold mb-6 md:mb-8 leading-tight">
            Trusted by Thousands, across{" "}
            <InlineVectorText className="italic" text="Australia" />
          </motion.h1>

          <motion.div className="text-center mb-8 md:mb-12" {...fadeInUp}>
            <div className="flex flex-wrap justify-center gap-6 md:gap-12 mb-8 md:mb-12">
              {[
                { value: "4.9", label: "Average Rating" },
                { value: "10,000+", label: "Active Users" },
                { value: "50,000+", label: "Sessions Booked" },
              ].map((stat, i) => (
                <motion.div
                  key={i}
                  className={
                    i === 1
                      ? "text-center border-x border-black px-6"
                      : "text-center"
                  }
                  initial={{ opacity: 0, scale: 0.5 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.2 }}
                >
                  <div className="text-md md:text-xl lg:text-2xl font-montserrat-bold">
                    {stat.value}
                  </div>
                  <div className=" mt-2 text-sm md:text-base font-montserrat-semibold">
                    {stat.label}
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* flex container for testimonials just like pinterest pictures display layout */}
          <div className="flex flex-wrap justify-center items-start gap-3">
            {testimonialData.map((testimonial) => (
              <TestimonialCard key={testimonial.id} testimonial={testimonial} />
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="relative min-h-fit p-6 md:p-8 lg:p-16 bg-gray-50/95 text-black">
        {/* Vector Illustration Circle */}
        <img
          src="/new-res/gradient-ckr.svg"
          alt="Vector Illustration"
          className="absolute w-80 h-80 -top-14 -left-24 object-cover pointer-events-none opacity-80"
        />
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 w-full mx-auto h-full">
          <motion.div
            className="col-span-full flex flex-col gap-3 md:col-span-2"
            {...fadeInUp}
          >
            <RoundedFigure icon={QuestionCircle} text="FAQs" />
            <motion.h1 className="text-2xl md:text-4xl lg:text-5xl font-montserrat-bold mb-6 md:mb-8 leading-tight">
              Frequently Asked <br /> <br />
              <InlineVectorText className="italic" text="Questions" />
            </motion.h1>

            <p className="text-xl font-montserrat-semibold leading-relaxed">
              Welcome to our FAQ section, where we address common queries about
              support24
            </p>

            <motion.div className="mt-3 max-w-sm md:max-w-md" {...fadeInUp}>
              <img
                src="/new-res/friends.png"
                alt="FAQ Illustration"
                className="w-full h-auto"
              />
            </motion.div>
          </motion.div>

          <div className="col-span-1 lg:col-span-3 flex flex-col gap-3">
            {[
              "How are support workers verified?",
              "Can I use my NDIS funding with Support24?",
              "Is Support24 free to join?",
              "What about insurance coverage?",
              "Can I book group activities or camps?",
              "What devices are supported?",
            ].map((question, i) => (
              <motion.div
                key={i}
                className={`"backdrop-blur-sm bg-white border border-gray-300 rounded-xl md:rounded-2xl overflow-hidden hover:shadow-xl" ${
                  openFaq === i
                    ? "shadow-lg shadow-primary border-primary border-2"
                    : "shadow-sm"
                }`}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
              >
                <button
                  className="w-full p-4 md:p-6 text-left flex justify-between items-center"
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                >
                  <span className="font-montserrat-bold text-lg pr-4">
                    {question}
                  </span>
                  <motion.div
                    animate={{ rotate: openFaq === i ? 180 : 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <ChevronDown className="w-5 h-5 md:w-6 md:h-6 flex-shrink-0" />
                  </motion.div>
                </button>
                <motion.div
                  initial={false}
                  animate={{
                    height: openFaq === i ? "auto" : 0,
                    opacity: openFaq === i ? 1 : 0,
                  }}
                  transition={{ duration: 0.3 }}
                  className="overflow-hidden"
                >
                  <div className="p-4 md:p-6 pt-0 font-montserrat-semibold text-sm md:text-base">
                    Every support worker on our platform undergoes comprehensive
                    background checks, professional verification, and continuous
                    monitoring to ensure the highest standards of care and
                    safety.
                  </div>
                </motion.div>
              </motion.div>
            ))}
          </div>
        </div>
        {/* Vector Illustration Circle */}
        <img
          src="/new-res/gradient-ckr.svg"
          alt="Vector Illustration"
          className="absolute w-96 h-96 bottom-0 right-24 object-cover pointer-events-none opacity-80 "
        />
      </section>

      {/* CTA Section */}
      <section className="relative min-h-fit p-6 md:p-8 lg:p-16 bg-gray-50 text-black">
        <motion.div
          className=""
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <div className="relative w-full bg-[#05030B] text-white rounded-3xl md:rounded-[3rem] overflow-hidden shadow-2xl">
            {/* vector illustration */}
            <img
              src="/new-res/gradient-triangle.svg"
              alt="Vector Illustration Left"
              className="absolute w-80 h-80 md:-top-24  md:left-48 object-cover pointer-events-none opacity-90"
            />
            <img
              src="/new-res/gradient-ckl.svg"
              alt="Vector Illustration"
              className="absolute w-80 h-80 md:-top-2 md:right-12 object-cover pointer-events-none opacity-90"
            />

            <div className="relative flex flex-col md:flex-row gap-3">
              <div className="flex-1 p-8 md:p-16 flex flex-col justify-center">
                <motion.h1 className="text-2xl md:text-4xl lg:text-5xl font-montserrat-bold mb-6 md:mb-8 leading-tight">
                  Take Control of{" "}
                  <InlineVectorText className="italic" text="your" y={-24} />{" "}
                  Support <br className="mb-12" />
                  <span>Today</span>
                </motion.h1>
                <p className="text-lg md:text-2xl font-montserrat-semibold max-w-xl my-8 leading-loose tracking-wide">
                  Join Support24 and discover a simpler way to manage routines,
                  book support, and enjoy community programs with complete
                  confidence
                </p>

                <div className="flex flex-wrap md:self-start justify-center gap-4 mb-12">
                  <Button className="flex gap-1 items-center p-6">
                    <img src="/new-res/apple-icon.svg" alt="apple-logo" />
                    <div className="flex flex-col items-center justify-center">
                      <p className="text-xs">Download on the</p>
                      <strong>App Store</strong>
                    </div>
                  </Button>
                  <Button
                    variant="outline"
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

              <motion.div className="max-w-md p-8 md:p-16 " {...fadeInUp}>
                <img
                  src="/new-res/Ratio.png"
                  alt="Ratio Illustration"
                  className="w-full max-w-sm md:max-w-md lg:max-w-lg mx-auto"
                />
              </motion.div>
            </div>
          </div>
        </motion.div>
      </section>

    </LandingLayout>
  );
}
