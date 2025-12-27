import React, { useState } from "react";
import { motion } from "framer-motion";
import { Letter } from "@solar-icons/react";
import { InlineVectorText } from "@/components/InlineVectorText";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

interface ContactSectionProps {
  className?: string;
}

export const ContactSection: React.FC<ContactSectionProps> = ({ 
  className = "" 
}) => {
  const [formData, setFormData] = useState({
    fullName: "",
    phoneNumber: "",
    email: "",
    location: "",
    message: ""
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
  };

  const fadeInUp = {
    initial: { opacity: 0, y: 40 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, margin: "-100px" },
    transition: { duration: 0.6 },
  };

  return (
    <section className={`relative py-16 md:py-24  bg-white ${className}`}>
      {/* 💎 Bottom-right glow */}
      <div className="absolute bottom-0 right-0 w-[450px] h-[450px] bg-primary/30 blur-[180px] rounded-full translate-x-1/3 translate-y-1/3 pointer-events-none" />

      
      <div className="lg:px-12 px-4 mx-auto relative">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-start">
          {/* Left Content */}
          <motion.div
            className="flex flex-col gap-6"
            {...fadeInUp}
          >
            {/* Contact Now Badge */}
            <motion.div
              className="inline-flex items-center gap-2 bg-primary-100 text-primary px-5 py-2.5 rounded-full text-sm font-montserrat-semibold w-fit"
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Letter className="w-4 h-4" />
              Contact Now
            </motion.div>

            {/* Main Title */}
            <motion.h1 
              className="text-3xl md:text-4xl lg:text-5xl font-montserrat-bold text-gray-900 leading-tight"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.3 }}
            >
              Get in Touch{" "}
              <br className="sm:block hidden" />
              <motion.span
                className="italic inline-block"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.5 }}
              >
                <InlineVectorText className="italic text-gray-900" imageClassName=" sm:-bottom-10   translate-y-[35%] sm:translate-y-[45%]" text="Today" y={-20} />
              </motion.span>
            </motion.h1>

            {/* Description */}
            <motion.p 
              className="text-base md:text-xl text-gray-700 leading-relaxed font-montserrat-medium max-w-lg"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              Welcome to our Contact section, Kindly fill out your complaints, we will get back to you immediately!
            </motion.p>

            {/* Contact Image */}
            <motion.div 
              className="relative mt-6 lg:mt-8"
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.6 }}
            >
              <div className="relative w-full max-w-xl">
                {/* primary L-shaped background */}
                <div className="absolute -bottom-6 -left-6 w-40 h-40 bg-primary rounded-3xl" style={{ borderTopRightRadius: '0' }} />
                
                {/* Image */}
                <img
                  src="/images/sec-lady.png"
                  alt="Contact Support"
                  className="relative w-full h-auto rounded-2xl shadow-xl"
                />
              </div>
            </motion.div>
          </motion.div>

          {/* Right Content - Contact Form */}
          <motion.div
            className=" rounded-3xl p-2 md:px-5 md:py-20 "
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <motion.h2 
              className="text-2xl md:text-3xl font-montserrat-bold text-gray-900 mb-8"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.6 }}
            >
              Leave a Message
            </motion.h2>

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Name and Phone Row */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.7 }}
                >
                  <Input
                    type="text"
                    name="fullName"
                    placeholder="Full Name"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    className="w-full px-5 py-6 rounded-2xl text-black border-2 border-gray-200 focus:border-primary focus:ring-0 text-base placeholder:text-gray-500 bg-gray-50"
                    required
                  />
                </motion.div>
                
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.8 }}
                >
                  <Input
                    type="tel"
                    name="phoneNumber"
                    placeholder="Phone Number"
                    value={formData.phoneNumber}
                    onChange={handleInputChange}
                    className="w-full px-5 py-6 rounded-2xl text-black border-2 border-gray-200 focus:border-primary focus:ring-0 text-base placeholder:text-gray-500 bg-gray-50"
                    required
                  />
                </motion.div>
              </div>

              {/* Email Field */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.9 }}
              >
                <Input
                  type="email"
                  name="email"
                  placeholder="Email Address"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full px-5 py-6 rounded-2xl text-black border-2 border-gray-200 focus:border-primary focus:ring-0 text-base placeholder:text-gray-500 bg-gray-50"
                  required
                />
              </motion.div>

              {/* Location Field */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 1.0 }}
              >
                <Input
                  type="text"
                  name="location"
                  placeholder="Location"
                  value={formData.location}
                  onChange={handleInputChange}
                  className="w-full px-5 py-6 rounded-2xl text-black border-2 border-gray-200 focus:border-primary focus:ring-0 text-base placeholder:text-gray-500 bg-gray-50"
                  required
                />
              </motion.div>

              {/* Message Field */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 1.1 }}
              >
                <Textarea
                  name="message"
                  placeholder="Message"
                  value={formData.message}
                  onChange={handleInputChange}
                  rows={5}
                  className="w-full px-5 py-4 rounded-2xl text-black  border-2 border-gray-200 focus:border-primary focus:ring-0 text-base placeholder:text-gray-500 bg-gray-50 resize-none"
                  required
                />
              </motion.div>

              {/* Submit Button */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 1.2 }}
                className="pt-2"
              >
                <motion.div
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                >
                  <Button
                    type="submit"
                    className="w-auto bg-primary hover:bg-primary-700 text-white py-7 px-12 rounded-xl text-base font-montserrat-semibold shadow-lg shadow-primary/30"
                  >
                    Submit
                  </Button>
                </motion.div>
              </motion.div>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
