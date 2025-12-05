import React from "react";
import { motion } from "framer-motion";
import { Star } from "@solar-icons/react";
import { InlineVectorText } from "@/components/InlineVectorText";
import { RoundedFigure } from "@/components/RoundedFigure";
import { testimonialData } from "@/components/TestimonialsGrid";

interface TestimonialsSectionProps {
  className?: string;
}

export const TestimonialsSection: React.FC<TestimonialsSectionProps> = ({ 
  className = "" 
}) => {
  const fadeInUp = {
    initial: { opacity: 0, y: 40 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, margin: "-100px" },
    transition: { duration: 0.6 },
  };

  return (
    <section className={`relative min-h-screen py-12 sm:py-16 md:py-20 lg:py-24 px-4 sm:px-6 md:px-8 lg:px-12 bg-gray-50/95 text-black ${className}`}>
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col items-center mb-12 sm:mb-16">
          <div className="mb-6">
            <RoundedFigure icon={Star} text="Real Impact Stories" />
          </div>
          
          <motion.h1 className="text-3xl md:text-4xl lg:text-5xl font-montserrat-bold mb-6 md:mb-8 leading-tight text-center">
            Trusted by Thousands, across{" "}
            <InlineVectorText className="italic" text="Australia" imageClassName="bottom-0 sm:-bottom-1 w-[300px]  translate-y-[35%] sm:translate-y-[45%]" />
          </motion.h1>

          <motion.div className="text-center mb-8 md:mb-12 w-full" {...fadeInUp}>
            <div className="flex flex-wrap justify-center gap-4 sm:gap-6 md:gap-12 mb-8 md:mb-12">
              {[
                { value: "4.5", label: "Average Rating" },
                { value: "2,000+", label: "Active Users" },
                { value: "10,000+", label: "Successful Booking" },
              ].map((stat, i) => (
                <motion.div
                  key={i}
                  className={
                    i === 1
                      ? "text-center border-x border-black px-4 md:px-6"
                      : "text-center"
                  }
                  initial={{ opacity: 0, scale: 0.5 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.2 }}
                >
                  <div className="text-lg md:text-2xl font-montserrat-bold">
                    {stat.value}
                  </div>
                  <div className="mt-2 text-xs  md:text-base font-montserrat-semibold">
                    {stat.label}
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Masonry Grid - Matches the design layout with staggered positioning */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 md:gap-6">
          {testimonialData.map((testimonial, index) => (
            <TestimonialCard 
              key={testimonial.id} 
              testimonial={testimonial}
              index={index}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

// Updated TestimonialCard component with staggered layout
const TestimonialCard = ({ testimonial, index }) => {
  // Create staggered pattern: every other card shifts down slightly
  const getStaggerClass = (idx: number) => {
    // Pattern: 0 (down), 1 (up), 2 (down), 3 (up) - alternating in each column
    const columnIndex = idx % 4;
    if (columnIndex === 0 || columnIndex === 2) {
      return 'lg:mt-8'; // Shift down on desktop
    } else {
      return 'lg:mt-0'; // Stay at top on desktop
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.05 }}
      className={`relative rounded-2xl p-5 sm:p-6 backdrop-blur-xl border shadow-lg transition-all duration-300 ${getStaggerClass(index)} ${
        testimonial.hasVideo 
          ? 'bg-gradient-to-br from-[#1e2a4a] to-[#0f1829] text-white border-gray-700/30 hover:shadow-2xl hover:shadow-primary-500/20' 
          : 'bg-white border-gray-200 hover:shadow-2xl hover:shadow-primary/20'
      } min-h-[320px] sm:min-h-[340px] flex flex-col`}
    >
      {/* Rating Badge */}
      <div className="absolute top-4 sm:top-5 right-4 sm:right-5">
        <div className={`px-3 py-1.5 rounded-full flex items-center gap-1.5 text-xs sm:text-sm font-medium w-fit ${
          testimonial.hasVideo 
            ? 'bg-white/20 text-white' 
            : 'bg-[#0D2BEC] text-white'
        }`}>
          <Star className="w-3.5 h-3.5 sm:w-4 sm:h-4 fill-current" />
          <span>{testimonial.rating}</span>
        </div>
      </div>

      {/* Title */}
      <h3 className={`text-base sm:text-lg lg:text-xl font-semibold mt-8 mb-3 sm:mb-4 pr-12 sm:pr-16 ${
        testimonial.hasVideo ? 'text-white' : 'text-gray-900'
      }`}>
        {testimonial.title}
      </h3>

      {/* Video Thumbnail (if applicable) */}
      {testimonial.hasVideo && (
        <div className="mb-4 relative rounded-lg overflow-hidden flex-shrink-0">
          <img
            src={testimonial.videoThumbnail}
            alt="Video thumbnail"
            className="w-full h-40 sm:h-48 object-cover"
          />
          <div className="absolute inset-0 bg-black bg-opacity-20 flex items-center justify-center">
            <div className="w-12 h-12 sm:w-16 sm:h-16 bg-white rounded-full flex items-center justify-center shadow-lg">
              <div className="w-0 h-0 border-t-[6px] sm:border-t-[8px] border-t-transparent border-l-[10px] sm:border-l-[14px] border-l-primary-600 border-b-[6px] sm:border-b-[8px] border-b-transparent ml-1"></div>
            </div>
          </div>
        </div>
      )}

      {/* Content */}
      <p className={`text-sm sm:text-base leading-relaxed mb-4 sm:mb-6 flex-grow ${
        testimonial.hasVideo ? 'text-white/90' : 'text-gray-700'
      }`}>
        "{testimonial.content}"
      </p>

      {/* User Info */}
      <div className="flex items-center gap-3 mt-auto">
        {/* <img
          src={testimonial.avatar}
          alt={testimonial.userName}
          className="w-10 h-10 sm:w-12 sm:h-12 rounded-full object-cover flex-shrink-0"
        /> */}
        <div>
          <p className={`text-sm sm:text-base font-semibold ${
            testimonial.hasVideo ? 'text-white' : 'text-gray-900'
          }`}>
            {testimonial.userName}
          </p>
          <p className={`text-xs sm:text-sm ${
            testimonial.hasVideo ? 'text-white/80' : 'text-gray-600'
          }`}>
            {testimonial.userRole}
          </p>
        </div>
      </div>
    </motion.div>
  );
};
