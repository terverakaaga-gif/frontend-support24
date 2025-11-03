// import React from 'react'
import { LandingLayout } from '@/components/layouts/LandingLayout'
import { CTASection } from '@/components/CTASection'

// import React from "react";
import { motion, useScroll, useTransform } from "framer-motion";
// import { Star, ChevronRight } from "lucide-react";

import { InlineVectorText } from "@/components/InlineVectorText";
import { Button } from "@/components/ui/button";
import { ContactSection } from '@/components/ContactSection'
import { WhySupport24Section } from '@/components/WhySupport24Section';
import { GettingStartedSection } from '@/components/GettingStartedSection';



export const HowItWorks = () => {

    const { scrollY } = useScroll();

    // Parallax effects
    const y1 = useTransform(scrollY, [0, 500], [0, 150]);
    const y2 = useTransform(scrollY, [0, 500], [0, -100]);


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
                className="absolute -top-40 -left-28 object-cover pointer-events-none"
            />
            {/* <img
                src="/new-res/gradient-triangle.svg"
                alt=""
                className="absolute top-56 -left-28 object-cover pointer-events-none"
            /> */}

            {/* Gradient blue circle at top right */}
            <img
                src="/new-res/gradient-ckr.svg"
                alt=""
                className="absolute top-14 right-0 object-cover pointer-events-none"
            />

            {/* Hero Section */}
            <section className="relative pt-16 my-16 md:pt-28 px-4 md:px-8">
                <div className=" lg:px-12 px-4 mx-auto">
                    <motion.div
                        className=" text-center"
                        initial={{ opacity: 0, x: -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                    >
                        {/* Main Title */}
                        <motion.h1
                            className="text-3xl md:text-5xl lg:text-5xl font-montserrat-bold mb-6 md:mb-8 leading-relaxed text-white "
                            initial={{ opacity: 0, scale: 0.8, y: 50 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            transition={{
                                duration: 1.2,
                                delay: 0.2,
                                ease: [0.25, 0.46, 0.45, 0.94]
                            }}
                        >
                            <motion.span
                                initial={{ opacity: 0, x: -100, rotateX: -90 }}
                                animate={{ opacity: 1, x: 0, rotateX: 0 }}
                                transition={{
                                    duration: 0.8,
                                    delay: 0.4,
                                    ease: "easeOut"
                                }}
                                className="inline leading-[inherit]"
                            >
                                How Support24{" "}
                            </motion.span>
                            <motion.span
                                className="italic inline leading-[inherit]"
                                initial={{ opacity: 0, y: 50, scale: 0.5, rotate: -10 }}
                                animate={{ opacity: 1, y: 0, scale: 1, rotate: 0 }}
                                transition={{
                                    duration: 1.0,
                                    delay: 0.6,
                                    ease: [0.34, 1.56, 0.64, 1]
                                }}
                                whileHover={{
                                    scale: 1.05,
                                    y: -5,
                                    transition: { duration: 0.3 }
                                }}
                                                            
                            >
                                <InlineVectorText className="font-thin text-white" imageClassName=" sm:-bottom-16 -bottom-11  w-[230px]  translate-y-[35%] sm:translate-y-[45%]"  text="Enhances" y={-24} />
                            </motion.span>{" "}
                            Your Care
                            <motion.br
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ duration: 0.3, delay: 0.8 }}
                            />
                            <motion.br
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ duration: 0.3, delay: 0.8 }}
                                className=" hidden sm:block "
                            />
                            {/* <motion.span
                                initial={{ opacity: 0, x: 100, rotateX: 90 }}
                                animate={{ opacity: 1, x: 0, rotateX: 0 }}
                                transition={{
                                    duration: 0.8,
                                    delay: 0.8,
                                    ease: "easeOut"
                                }}
                                className="inline leading-[inherit] "
                            >
                                 Journey Step by Step
                            </motion.span> */}
                        </motion.h1>


                    </motion.div>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center lg:mt-16 mt-4">
                        {/* Left Content */}
                        <motion.div
                            className="text-left"
                            initial={{ opacity: 0, x: -50 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.8, ease: "easeOut" }}
                        >


                            {/* Description */}
                            <motion.p
                                className="text-lg md:text-2xl text-white/90 mb-8 font-montserrat-medium leading-relaxed"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.8, delay: 0.6 }}
                            >
                                A simple step-by-step process to connect you with trusted allied support professionals when and where you need them.
                            </motion.p>

                            {/* CTA Button */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.8, delay: 0.8 }}
                                className="flex justify-center sm:justify-start"
                            >
                                <motion.div
                                    whileHover={{ scale: 1.05, y: -2 }}
                                    whileTap={{ scale: 0.95 }}
                                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                                >
                                    <Button className="bg-primary text-xl hover:bg-primary-700 text-white px-8 py-4 sm:px-10 sm:py-6  font-montserrat-semibold flex items-center gap-3">
                                        How it Works
                                        <motion.div
                                            animate={{ x: [0, 5, 0] }}
                                            transition={{ duration: 1.5, repeat: Infinity }}
                                        >
                                            →
                                        </motion.div>
                                    </Button>
                                </motion.div>
                            </motion.div>
                        </motion.div>

                        {/* Right Content - Statistics Cards */}
                        <motion.div
                            className="relative"
                            initial={{ opacity: 0, x: 50 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.8, delay: 0.4 }}
                        >
                            {/* Statistics Cards */}
                            <div className="flex flex-col gap-6">
                                <img src="/images/stats.png" alt="How It Works" className="w-full h-full" />
                            </div>


                        </motion.div>
                    </div>
                </div>
            </section>
            {/* why support24 */}
            <WhySupport24Section />

            {/* getting started section */}
            <GettingStartedSection />
            {/* contact section */}
            <ContactSection />
            {/* CTA Section */}
            <CTASection />
        </LandingLayout>
    )
}