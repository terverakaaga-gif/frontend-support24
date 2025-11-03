import { Star } from "@solar-icons/react";
import { motion } from "framer-motion";



// "Everything we needed in one place"
// "Support24 has transformed how we manage daily support. Finding qualified workers is straightforward, and the invoicing system keeps everything organized. It's exactly what families like ours needed."
// — Mally, Family Carer

// "Smooth and worry-free from start to finish"
// "The quality of support workers who responded was excellent, and the communication throughout was clear and helpful. The whole process was smooth and worry-free."
// — Carla, NDIS Participant

// "Mum feels alive again"
// "The carers we've found are reliable and compassionate, helping mum with housework and personal care. She feels vibrant and alive again - it's been wonderful to see"
// — Miss Lee, Daughter & Primary Carer

// "Peace of mind, every single day"
// "The peace of mind knowing every worker is verified and the scheduling is so simple - it's exactly what families like ours needed."
// — Tom & Muna, Parents & Co-Carers

// "Quality support we can trust"
// "The platform made it simple to post our requirements, and we had quality responses within days. The verification process gave us confidence, and the support we found has been consistent and caring."
// — Maggy, Support Coordinator

// "Saved me hours every week"
// "I manage support for three family members and Support24 has saved me hours each week. The invoicing is transparent, timesheets are tracked automatically, and I can see everything in one place. It's taken so much stress out of an already demanding situation."
// — Tina, Family Support Manager

// "We couldn't have found better support"
// "The support workers we've found through Support24 are wonderful. They help mum with personal care, light housework, and companionship. Seeing her smile again and feel confident in her own home makes all the difference. We couldn't have found such reliable people without this service."
// — Julie, Daughter & Advocate

// "They truly understand what families need"
// "Support24 gets it. They understand that we need flexibility, reliability, and most importantly, trustworthy people in our home. The communication has been fantastic, the app is intuitive, and finding backup support when our regular worker is away has been seamless."
// — Emma, Mother & Primary Carer

// "A game-changer for our practice"
// "We recommend Support24 to all our clients now. The admin burden has reduced dramatically - no more chasing timesheets or dealing with payment disputes. Everything is documented, workers are verified, and families have direct control. It's exactly what the sector needed."
// — Pat, Practice Manager

export const testimonialData = [
  {
    id: 1,
    title: "Everything we needed in one place",
    content:
      "Support24 has transformed how we manage daily support. Finding qualified workers is straightforward, and the invoicing system keeps everything organized. It's exactly what families like ours needed.",
    userName: "Mally",
    userRole: "Family Carer",
    avatar:
      "",
    rating: 4.1,
  },
  {
    id: 2,
    title: "Smooth and worry-free from start to finish",
    content:
      "The quality of support workers who responded was excellent, and the communication throughout was clear and helpful. The whole process was smooth and worry-free.",
    userName: "Carla",
    userRole: "NDIS Participant",
    avatar:
      "",
    rating: 4.5,
  },
  {
    id: 3,
    title: "Mum feels alive again",
    content: "The carers we've found are reliable and compassionate, helping mum with housework and personal care. She feels vibrant and alive again - it's been wonderful to see",
    userName: "Miss Lee",
    userRole: "Daughter & Primary Carer",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop",
    rating: 4.3,
  },
  {
    id: 4,
    title: "Peace of mind, every single day",
    content: "The peace of mind knowing every worker is verified and the scheduling is so simple - it's exactly what families like ours needed.",
    userName: "Tom & Muna",
    userRole: "Parents & Co-Carers",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop",
    rating: 4.6,
  },
  {
    id: 5,
    title: "Quality support we can trust",
    content: "The platform made it simple to post our requirements, and we had quality responses within days. The verification process gave us confidence, and the support we found has been consistent and caring.",
    userName: "Maggy",
    userRole: "Support Coordinator",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop",
    rating: 4.8,
  },
  {
    id: 6,
    title: "Saved me hours every week",
    content: "I manage support for three family members and Support24 has saved me hours each week. The invoicing is transparent, timesheets are tracked automatically, and I can see everything in one place. It's taken so much stress out of an already demanding situation.",
    userName: "Tina",
    userRole: "Family Support Manager",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop",
    rating: 4.4,
  },
  {
    id: 8,
    title: "We couldn't have found better support",
    content: "The support workers we've found through Support24 are wonderful. They help mum with personal care, light housework, and companionship. Seeing her smile again and feel confident in her own home makes all the difference. We couldn't have found such reliable people without this service.",
    userName: "Julie",
    userRole: "Daughter & Advocate",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop",
    rating: 4.5,
  },
  {
    id: 9,
    title: "They truly understand what families need",
    content: "Support24 gets it. They understand that we need flexibility, reliability, and most importantly, trustworthy people in our home. The communication has been fantastic, the app is intuitive, and finding backup support when our regular worker is away has been seamless..",
    userName: "Emma",
    userRole: "Mother & Primary Carer",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop",
    rating: 4.7,
  },
  {
    id: 10,
    title: "A game-changer for our practice",
    content: "We recommend Support24 to all our clients now. The admin burden has reduced dramatically - no more chasing timesheets or dealing with payment disputes. Everything is documented, workers are verified, and families have direct control. It's exactly what the sector needed.",
    userName: "Pat",
    userRole: "Practice Manager",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop",
    rating: 4.8,
  },
  // {
  //   id: 11,
  //   title: "How are support workers verified?",
  //   content: "Support24 has transformed how we manage daily support. The peace of mind knowing every worker is verified and the scheduling is so simple - it's exactly what families like ours needed.",
  //   userName: "Sarah Reves",
  //   userRole: "Practice Administrator",
  //   avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop",
  //   rating: 4.5,
  // },
  // {
  //   id: 12,
  //   title: "I love the service, can't say less",
  //   content: "Support24 has transformed how we manage daily support. The peace of mind knowing every worker is verified and the scheduling is so simple - it's exactly what families like ours needed.",
  //   userName: "Sarah Reves",
  //   userRole: "Practice Administrator",
  //   avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop",
  //   rating: 4.5,
  // },
  // {
  //   id: 13,
  //   title: "Amazing Platform, Great Idea!",
  //   content: "Support24 has transformed how we manage daily support. The peace of mind knowing every worker is verified and the scheduling is so simple - it's exactly what families like ours needed.",
  //   userName: "Sarah Reves",
  //   userRole: "Practice Administrator",
  //   avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop",
  //   rating: 4.5,
  // },
  // {
  //   id: 14,
  //   title: "Amazing Platform, Great Idea!",
  //   content: "Support24 has transformed how we manage daily support. The peace of mind knowing every worker is verified and the scheduling is so simple - it's exactly what families like ours needed.",
  //   userName: "Sarah Reves",
  //   userRole: "Practice Administrator",
  //   avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop",
  //   rating: 4.5,
  // },
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
        {/* <img
          src={testimonial.avatar}
          alt={testimonial.userName}
          className="w-12 h-12 rounded-full object-cover"
        /> */}
        <div>
          <p className="font-semibold text-gray-900">{testimonial.userName}</p>
          <p className="text-sm text-gray-600">{testimonial.userRole}</p>
        </div>
      </div>
    </motion.div>
  );
};
