import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

const onboardingSlides = [
  {
    image: "/new-res/provider/onboarding-1.svg",
    title: "Connect with Participants Across Australia",
    subtitle:
      "Join Support24 Providers and connect with verified participant across Australia looking for accommodation, jobs opportunities and local events.",
  },
  {
    image: "/new-res/provider/onboarding-2.svg",
    title: "Post, Manage, and Track with Ease",
    subtitle:
      "From creating accommodation, jobs or event posts to tracking interest, manage everything in one place.",
  },
  {
    image: "/new-res/provider/onboarding-3.svg",
    title: "Grow Your Reach and Impact",
    subtitle:
      "Gain visibility, connect with active participants, and grow your community through real time engagement and insights.",
  },
];

export function OnboardingCarousel() {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(
      () => setCurrentSlide((prev) => (prev + 1) % onboardingSlides.length),
      5000
    );
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="flex flex-col justify-between w-full p-12 relative z-10 h-full">
      <div className="flex-1 flex flex-col justify-center items-center">
        {/* Image */}
        <div className="w-full max-w-lg mb-8 relative h-80">
          {onboardingSlides.map((slide, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: 100 }}
              animate={{
                opacity: currentSlide === index ? 1 : 0,
                x: currentSlide === index ? 0 : 100,
              }}
              transition={{ duration: 0.5 }}
              className={`absolute inset-0 flex items-center justify-center ${
                currentSlide === index ? "z-10" : "z-0"
              }`}
            >
              <img
                src={slide.image}
                alt={slide.title}
                className="w-full h-full object-contain"
              />
            </motion.div>
          ))}
        </div>

        {/* Dots */}
        <div className="flex gap-2 self-start mb-6">
          {onboardingSlides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`h-2 rounded-full transition-all duration-300 ${
                currentSlide === index
                  ? "bg-primary-600 w-8"
                  : "bg-gray-300 w-2"
              }`}
            />
          ))}
        </div>

        {/* Text */}
        <motion.div
          key={currentSlide}
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="self-start max-w-md"
        >
          <h2 className="text-3xl font-montserrat-bold text-gray-900 mb-4">
            {onboardingSlides[currentSlide].title}
          </h2>
          <p className="text-gray-600 text-lg">
            {onboardingSlides[currentSlide].subtitle}
          </p>
        </motion.div>
      </div>

      {/* Footer Nav */}
      <div className="flex justify-between items-center w-full mt-8">
        <button
          onClick={() => setCurrentSlide(onboardingSlides.length - 1)}
          className="text-gray-600 font-montserrat-semibold"
        >
          Skip
        </button>
        <Button
          onClick={() =>
            setCurrentSlide((prev) => (prev + 1) % onboardingSlides.length)
          }
          className="bg-primary-600 hover:bg-primary-700"
        >
          Next
        </Button>
      </div>
    </div>
  );
}
