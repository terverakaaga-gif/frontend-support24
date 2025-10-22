import React from "react";
import { motion } from "framer-motion";
import { Shield, Users, Calendar, Star, ShieldCheck } from "lucide-react";
import { InlineVectorText } from "@/components/InlineVectorText";
import { Button } from "@/components/ui/button";

interface WhySupport24SectionProps {
    className?: string;
}

export const WhySupport24Section: React.FC<WhySupport24SectionProps> = ({
    className = ""
}) => {
    const stats = [
        {
            icon: Users,
            value: "150k",
            label: "Active users",
            description: "Families and participant trust Support24",
        },
        {
            icon: Calendar,
            value: "50.0k+",
            label: "Successful Booking",
            description: "Safe and reliable support connection",
        },
        {
            icon: Star,
            value: "4.9",
            label: "User Rating",
            description: "Average Rating",
        },
        {
            icon: ShieldCheck,
            value: "98%",
            label: "Safety Score",
            description: "Incident free support session",
        },
    ];

    return (
        <section className={`relative py-16 md:py-24 px-6 md:px-12 ${className} bg-white`}>
            <div className=" px-12 mx-auto flex flex-col items-center  gap-10">

                <motion.div
                    className="w-full flex flex-col lg:flex-row items-start justify-between gap-12 lg:gap-24"
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                >
                    {/* LEFT SIDE */}
                    <div className="flex flex-col gap-6 flex-1 max-w-xl">
                        {/* Badge */}
                        <motion.div
                            className="inline-flex items-center gap-2 bg-blue-100 text-primary px-5 py-2.5 rounded-full text-sm font-montserrat-semibold w-fit"
                            initial={{ opacity: 0, scale: 0.8 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: 0.2 }}
                        >
                            <Shield className="w-4 h-4" />
                            Enterprise-Grade Security
                        </motion.div>

                        {/* Heading */}
                        <motion.h1
                            className="text-3xl md:text-5xl lg:text-6xl font-montserrat-bold text-gray-900 leading-tight flex flex-wrap items-end"
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8, delay: 0.3 }}
                        >
                            <span className="mr-2">Why</span>
                            <motion.span
                                className="italic inline-block"
                                initial={{ opacity: 0, y: 10 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.6, delay: 0.5 }}
                            >
                                <InlineVectorText
                                    className="italic text-gray-900"
                                    text="Support24"
                                    y={-24} // Adjust line height space here

                                />
                                {" "}?
                            </motion.span>

                        </motion.h1>
                    </div>

                    {/* RIGHT SIDE */}
                    <div className="flex flex-col gap-6 flex-1 max-w-xl">
                        {/* Paragraph */}
                        <motion.p
                            className="text-lg md:text-xl lg:text-3xl text-gray-900 leading-relaxed font-montserrat"
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8, delay: 0.5 }}
                        >
                            The wellbeing comes first. Every worker is carefully verified, every booking is protected, and every interaction is secured
                        </motion.p>

                        {/* CTA Button */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8, delay: 0.6 }}
                        >
                            <motion.div
                                whileHover={{ scale: 1.03 }}
                                whileTap={{ scale: 0.97 }}
                                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                            >
                                <Button className="bg-primary hover:bg-primary-700 text-white py-5 px-8 rounded-xl text-xl font-montserrat shadow-md">
                                    Download App
                                </Button>
                            </motion.div>
                        </motion.div>
                    </div>
                </motion.div>


                {/* Stat Cards */}
                <motion.div
                    className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 w-full mt-10"
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.4 }}
                >
                     {stats.map((stat, index) => (
                         <motion.div
                             key={index}
                             className="relative bg-white rounded-xl p-6 text-left border border-gray-100 transition-all overflow-hidden group"
                             whileHover={{ y: -4 }}
                             transition={{ duration: 0.3, delay: index * 0.1 }}
                         >
                             {/* Animated border */}
                             <div className="absolute inset-0 rounded-xl overflow-hidden">
                                 <motion.div
                                     className="absolute inset-0 rounded-xl"
                                     style={{
                                         background: 'linear-gradient(90deg, transparent, transparent, #0D2BEC, transparent, transparent)',
                                         backgroundSize: '200% 100%',
                                     }}
                                     animate={{
                                         backgroundPosition: ['0% 0%', '200% 0%', '0% 0%']
                                     }}
                                     transition={{
                                         duration: 20,
                                         repeat: Infinity,
                                         ease: 'linear'
                                     }}
                                     whileHover={{
                                         backgroundPosition: ['0% 0%', '200% 0%'],
                                         transition: { duration: 5, ease: 'easeInOut' }
                                     }}
                                 />
                                 <div className="absolute inset-[1px] bg-white rounded-xl" />
                             </div>

                            <div className="relative z-10">
                                <stat.icon className="w-6 h-6 text-primary mb-4" strokeWidth={1.5} />
                                <div className="flex items-baseline gap-4 mb-4">
                                    <h3 className="text-2xl font-montserrat-bold text-gray-900">
                                        {stat.value}
                                    </h3>
                                    <span className="text-lg font-montserrat-medium text-gray-600">
                                        {stat.label}
                                    </span>
                                </div>
                                <p className="text-lg font-montserrat-medium text-gray-600">
                                    {stat.description}
                                </p>
                            </div>
                        </motion.div>

                    ))}
                </motion.div>
            </div>
        </section>
    );
};
