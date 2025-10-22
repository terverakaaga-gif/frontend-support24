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
    <section className={`relative min-h-screen p-6 md:p-8 lg:p-16 bg-gray-50/95 text-black ${className}`}>
      <div className="flex flex-col items-center">
        <div className="mb-6">
          <RoundedFigure icon={Star} text="Real Impact Stories" />
        </div>
        
        <motion.h1 className="text-2xl md:text-4xl lg:text-5xl font-montserrat-bold mb-6 md:mb-8 leading-tight text-center">
          Trusted by Thousands, across{" "}
          <InlineVectorText className="italic" text="Australia" />
        </motion.h1>

        <motion.div className="text-center mb-8 md:mb-12" {...fadeInUp}>
          <div className="flex flex-wrap justify-center gap-6 md:gap-12 mb-8 md:mb-12">
            {[
              { value: "4.9", label: "Average Rating" },
              { value: "15,000+", label: "Active Users" },
              { value: "50,000+", label: "Successful Booking" },
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
                <div className="mt-2 text-sm md:text-base font-montserrat-semibold">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Masonry-style testimonials grid */}
        <div className="columns-1 md:columns-2 lg:columns-4 gap-6 space-y-6 px-8">
          {testimonialData.map((testimonial) => (
            <TestimonialCard key={testimonial.id} testimonial={testimonial} />
          ))}
        </div>
      </div>
    </section>
  );
};

// Updated TestimonialCard component
const TestimonialCard = ({ testimonial }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={`bg-white border-gray-300 border rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow relative break-inside-avoid mb-6 ${
        testimonial.hasVideo ? 'bg-gradient-to-br from-blue-900 to-purple-900 text-white' : ''
      }`}
    >
      {/* Rating Badge */}
      <div className="absolute top-4 right-4">
        <div className={`px-3 py-1.5 rounded-full flex items-center gap-1.5 text-sm font-medium w-fit ${
          testimonial.hasVideo 
            ? 'bg-white/20 text-white' 
            : 'bg-primary-600 text-white'
        }`}>
          <Star className="w-4 h-4 fill-current" />
          <span>{testimonial.rating}</span>
        </div>
      </div>

      {/* Title */}
      <h3 className={`text-xl font-semibold mt-8 mb-4 pr-16 ${
        testimonial.hasVideo ? 'text-white' : 'text-gray-900'
      }`}>
        {testimonial.title}
      </h3>

      {/* Video Thumbnail (if applicable) */}
      {testimonial.hasVideo && (
        <div className="mb-4 relative rounded-lg overflow-hidden">
          <img
            src={testimonial.videoThumbnail}
            alt="Video thumbnail"
            className="w-full h-48 object-cover"
          />
          <div className="absolute inset-0 bg-black bg-opacity-20 flex items-center justify-center">
            <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-lg">
              <div className="w-0 h-0 border-t-8 border-t-transparent border-l-12 border-l-primary-600 border-b-8 border-b-transparent ml-1"></div>
            </div>
          </div>
        </div>
      )}

      {/* Content */}
      <p className={`leading-relaxed mb-6 ${
        testimonial.hasVideo ? 'text-white/90' : 'text-gray-700'
      }`}>
        "{testimonial.content}"
      </p>

      {/* User Info */}
      <div className="flex items-center gap-3">
        <img
          src={testimonial.avatar}
          alt={testimonial.userName}
          className="w-12 h-12 rounded-full object-cover"
        />
        <div>
          <p className={`font-semibold ${
            testimonial.hasVideo ? 'text-white' : 'text-gray-900'
          }`}>
            {testimonial.userName}
          </p>
          <p className={`text-sm ${
            testimonial.hasVideo ? 'text-white/80' : 'text-gray-600'
          }`}>
            {testimonial.userRole}
          </p>
        </div>
      </div>
    </motion.div>
  );
};
