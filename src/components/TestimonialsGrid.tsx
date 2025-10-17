import { Star } from "@solar-icons/react";
import { motion } from "framer-motion";

export const testimonialData = [
  {
    id: 2,
    title: "I love the service, can't say less",
    content:
      "Support24 has transformed how we manage daily support. The peace of mind knowing every worker is verified and the scheduling is so simple – it's exactly what families like ours needed.",
    userName: "Sarah Reyes",
    userRole: "Practice Administrator",
    avatar:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop",
    rating: 4.5,
  },
  {
    id: 3,
    title: "How are support workers verified?",
    content:
      "Support24 has transformed how we manage daily support. The peace of mind knowing every worker is verified and the scheduling is so simple – it's exactly what families like ours needed.",
    userName: "Sarah Reyes",
    userRole: "Practice Administrator",
    avatar:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop",
    rating: 4.5,
  },
  {
    id: 6,
    title: "I love the service, can't say less",
    content:
      "Support24 has transformed how we manage daily support. The peace of mind knowing every worker is verified and the scheduling is so simple – it's exactly what families like ours needed.",
    userName: "Sarah Reyes",
    userRole: "Practice Administrator",
    avatar:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop",
    rating: 4.5,
  },
  {
    id: 4,
    title: "Amazing Service!!",
    content: "Support24 has transformed how we manage daily support.",
    userName: "Sarah Reyes",
    userRole: "Practice Administrator",
    avatar:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop",
    rating: 4.5,
    hasVideo: true,
    videoThumbnail:
      "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&h=300&fit=crop",
  },
  {
    id: 5,
    title: "Amazing Platform, Great Idea!",
    content:
      "Support24 has transformed how we manage daily support. The peace of mind knowing every worker is verified and the scheduling is so simple – it's exactly what families like ours needed.",
    userName: "Sarah Reyes",
    userRole: "Practice Administrator",
    avatar:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop",
    rating: 4.5,
  },

  {
    id: 7,
    title: "Exceptional Support!",
    content:
      "Support24 has transformed how we manage daily support. The peace of mind knowing every worker is verified and the scheduling is so simple – it's exactly what families like ours needed.",
    userName: "Sarah Reyes",
    userRole: "Practice Administrator",
    avatar:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop",
    rating: 4.5,
  },
  {
    id: 8,
    title: "Reliable and Trustworthy",
    content:
      "Support24 has transformed how we manage daily support. The peace of mind knowing every worker is verified and the scheduling is so simple – it's exactly what families like ours needed.",
    userName: "Sarah Reyes",
    userRole: "Practice Administrator",
    avatar:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop",
    rating: 4.5,
  },
  {
    id: 1,
    title: "I love the service, can't say less",
    content:
      "Support24 has transformed how we manage daily support. The peace of mind knowing every worker is verified and the scheduling is so simple – it's exactly what families like ours needed.",
    userName: "Sarah Reyes",
    userRole: "Practice Administrator",
    avatar:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop",
    rating: 4.5,
    variant: "primary",
  },
];

export const TestimonialCard = ({ testimonial }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={`bg-white border-gray-300 border rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow relative max-w-sm h-fit`}
    >
      {/* Rating Badge */}
      <div className="absolute  right-5">
        <div className="bg-primary-600 text-white px-3 py-1.5 rounded-full flex items-center gap-1.5 text-sm font-medium w-fit">
          <Star className="w-4 h-4 fill-current" />
          <span>{testimonial.rating}</span>
        </div>
      </div>

      {/* Title */}
      <h3 className="text-xl font-semibold text-gray-900 mt-8 mb-4 pr-16">
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
      <p className="text-gray-700 leading-relaxed mb-6">
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
          <p className="font-semibold text-gray-900">{testimonial.userName}</p>
          <p className="text-sm text-gray-600">{testimonial.userRole}</p>
        </div>
      </div>
    </motion.div>
  );
};
