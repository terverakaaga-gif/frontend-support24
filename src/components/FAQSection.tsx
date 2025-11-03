import React, { useState } from "react";
import { motion } from "framer-motion";
import { Plus, Minus, Send } from "lucide-react";
import { QuestionCircle } from "@solar-icons/react";
import { InlineVectorText } from "@/components/InlineVectorText";
import { RoundedFigure } from "@/components/RoundedFigure";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface FAQSectionProps {
  className?: string;
}

export const FAQSection: React.FC<FAQSectionProps> = ({ 
  className = "" 
}) => {
  const [openFaq, setOpenFaq] = useState(0); // First FAQ open by default
  const [searchQuery, setSearchQuery] = useState("");

  const fadeInUp = {
    initial: { opacity: 0, y: 40 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, margin: "-100px" },
    transition: { duration: 0.6 },
  };

  const faqData = [
    {
      question: "How are support workers verified?",
      answer: "All workers meets elegibility criteria, police checks before joining our platform."
    },
    {
      question: "Can I use my NDIS funding with Support24?",
      answer: "Yes, Support24 works with all NDIS funding types. You can use your plan funding to access our services."
    },
    {
      question: "Is Support24 free to join?",
      answer: "Yes, joining Support24 is currently free for participants, Support cordinators and Support workers."
    },
    {
      question: "What about insurance coverage?",
      answer: "All support workers on our platform are fully insured with professional cover."
    },
    {
      question: "Can I book group activities or camps?",
      answer: "Absolutely! the platform offers a wide range of group activities, community programs, and camps designed to connect and inspire participants."
    },
    {
      question: "What devices are supported?",
      answer: "Support24 works on all modern devices including smartphones, tablets, and computers. We have native apps for iOS and Android."
    }
  ];

  return (
    <section className={`relative min-h-fit p-6 md:p-8 lg:p-16 bg-gray-50/95 text-black ${className}`}>
      {/* Vector Illustration Circle */}
      <img
        src="/new-res/gradient-ckr.svg"
        alt="Vector Illustration"
        className="absolute w-80 h-80 -top-14 -left-24 object-cover pointer-events-none opacity-80"
      />
      
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 w-full mx-auto h-full">
        {/* Left Content Area */}
        <motion.div
          className="col-span-full flex flex-col gap-3 md:col-span-2 "
          {...fadeInUp}
        >
          <RoundedFigure icon={QuestionCircle} text="FAQs" />
          <motion.h1 className="text-3xl md:text-4xl lg:text-5xl font-montserrat-bold mb-6 md:mb-8 leading-tight">
            Frequently Asked  <br className="sm:block hidden"/>
            <InlineVectorText className="italic" text="Questions" imageClassName="-bottom-2 sm:-bottom-2 w-[230px]  translate-y-[35%] sm:translate-y-[45%]" />
          </motion.h1>

          <p className="text-xl font-montserrat-medium leading-relaxed">
            Welcome to our FAQ section, where we address common queries about
            support24
          </p>

          <motion.div className="mt-3 max-w-sm md:max-w-md relative" {...fadeInUp}>
            <img
              src="/new-res/friends.png"
              alt="FAQ Illustration"
              className="w-full h-auto"
            />
            
            {/* Search Input Overlay */}
            <div className="absolute lg:bottom-20 bottom-10 lg:left-40 left-10 lg:-right-8 right-0">
              <div className="bg-white rounded-xl shadow-lg p-1 md:p-4 flex items-center gap-3">
                <Input
                  type="text"
                  placeholder="Type your question........"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="flex-1 border-0 focus:ring-0 text-sm"
                />
                <Button 
                  size="sm" 
                  className="bg-primary hover:bg-primary-700 px-4 py-2"
                  onClick={() => {
                    // Handle search functionality
                    console.log("Searching for:", searchQuery);
                  }}
                >
                  <Send className="w-2 h-2 md:w-4 md:h-4" />
                </Button>
              </div>
            </div>
          </motion.div>
        </motion.div>

        {/* Right FAQ Accordion Section */}
        <div className="col-span-1 lg:col-span-3 flex flex-col gap-3">
          {faqData.map((faq, i) => (
            <motion.div
              key={i}
              className={`bg-white border border-gray-300 rounded-xl md:rounded-2xl overflow-hidden transition-all duration-300  ${
                openFaq === i
                  ? "   backdrop-blur-sm bg-white  rounded-xl md:rounded-2xl overflow-hidden hover:shadow-xl&quot; shadow-lg shadow-[#0D2BEC]/60 border-[#0D2BEC] border-2"
                  : "shadow-sm hover:shadow-md hover:shadow-primary/10"
              }`}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
            >
              <button
                className="w-full p-4 md:p-6 text-left flex justify-between items-center hover:bg-gray-50 transition-colors"
                onClick={() => setOpenFaq(openFaq === i ? null : i)}
              >
                <span className="font-montserrat-bold text-xl pr-4 text-gray-900">
                  {faq.question}
                </span>
                <motion.div
                  animate={{ rotate: openFaq === i ? 0 : 0 }}
                  transition={{ duration: 0.3 }}
                  className="flex-shrink-0"
                >
                  {openFaq === i ? (
                    <Minus className="w-5 h-5 md:w-6 md:h-6 text-primary" />
                  ) : (
                    <Plus className="w-5 h-5 md:w-6 md:h-6 text-gray-600" />
                  )}
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
                <div className="p-4 md:p-6 pt-0 font-montserrat-medium text-sm md:text-base text-gray-700">
                  {faq.answer}
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
        className="absolute w-80 h-80 -bottom-16 -right-24 object-cover pointer-events-none opacity-80"
      />
    </section>
  );
};
