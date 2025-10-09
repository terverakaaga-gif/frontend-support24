import React, { useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Menu, X, Star, ChevronDown, ChevronRight } from 'lucide-react';

export default function Support24Landing() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [openFaq, setOpenFaq] = useState(null);
  const { scrollY } = useScroll();
  
  // Parallax effects
  const y1 = useTransform(scrollY, [0, 500], [0, 150]);
  const y2 = useTransform(scrollY, [0, 500], [0, -100]);

  const fadeInUp = {
    initial: { opacity: 0, y: 40 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, margin: "-100px" },
    transition: { duration: 0.6 }
  };

  const stagger = {
    initial: { opacity: 0, y: 40 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true },
  };

  return (
    <div className="min-h-screen bg-[#0a0e27] text-white relative overflow-hidden">
      {/* Animated Background - Dark blue with flowing curves */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        {/* Top left flowing curve */}
        <motion.div
          className="absolute -top-40 -left-40 w-[800px] h-[800px]"
          style={{ y: y1 }}
        >
          <div className="w-full h-full bg-gradient-to-br from-primary/20 via-purple-600/10 to-transparent rounded-full blur-3xl" />
        </motion.div>
        
        {/* Bottom right flowing curve */}
        <motion.div
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
            ease: "easeInOut"
          }}
        >
          <div className="w-full h-full bg-gradient-to-r from-primary-500/10 to-purple-500/10 rounded-full blur-3xl" />
        </motion.div>
      </div>

      {/* Header - Transparent with blur on scroll */}
      <motion.header 
        className="fixed top-0 w-full z-50 transition-all duration-300"
        initial={{ backgroundColor: "rgba(10, 14, 39, 0)" }}
        style={{
          backgroundColor: useTransform(
            scrollY,
            [0, 100],
            ["rgba(10, 14, 39, 0)", "rgba(10, 14, 39, 0.8)"]
          ),
          backdropFilter: useTransform(
            scrollY,
            [0, 100],
            ["blur(0px)", "blur(20px)"]
          )
        }}
      >
        <nav className="max-w-7xl mx-auto px-6 lg:px-8 py-5">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center"
            >
              <span className="text-2xl font-montserrat-bold tracking-tight">
                SUPPORT<span className="text-primary-500">24</span>
              </span>
            </motion.div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-8">
              <a href="#" className="text-sm text-gray-300 hover:text-white transition-colors">How it Works</a>
              <a href="#" className="text-sm text-gray-300 hover:text-white transition-colors">FAQs</a>
              <a href="#" className="text-sm text-gray-300 hover:text-white transition-colors">Contact Us</a>
              <motion.button
                className="bg-primary hover:bg-primary-700 px-6 py-2.5 rounded-full text-sm font-medium transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Download App
              </motion.button>
            </div>

            {/* Mobile menu button */}
            <button className="md:hidden" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </nav>
      </motion.header>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-5xl mx-auto relative z-10">
            <motion.h1
              className="text-5xl sm:text-6xl lg:text-7xl font-montserrat-bold mb-6 leading-tight"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              Support That Fits Your Life
            </motion.h1>
            
            <motion.p
              className="text-xl text-gray-300 mb-10 leading-relaxed max-w-4xl mx-auto"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              Support24 makes NDIS support effortless. Connect with verified workers, plan your activities, manage funds, and simplify your entire support care - all simplified
            </motion.p>

            <motion.div
              className="flex flex-wrap justify-center gap-4 mb-16"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              <motion.button
                className="bg-primary hover:bg-primary-700 px-8 py-4 rounded-full font-medium flex items-center gap-3 transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <span>📱</span> Get Started
              </motion.button>
              <motion.button
                className="bg-gray-800 hover:bg-gray-700 px-8 py-4 rounded-full font-medium flex items-center gap-3 transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <span>🍎</span> Get on iOS
              </motion.button>
            </motion.div>

            {/* Phone Mockup with Floating Cards */}
            <motion.div
              className="relative max-w-xs mx-auto mb-12"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1, delay: 0.5 }}
            >
              {/* Main Phone */}
              <motion.div
                className="relative z-20"
                animate={{ y: [0, -15, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              >
                <div className="bg-gradient-to-b from-primary-900 to-primary-900 rounded-[3rem] p-3 shadow-2xl border-4 border-gray-700">
                  <div className="bg-primary rounded-[2.5rem] p-6 h-[600px] flex flex-col">
                    {/* Phone Header */}
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center shadow-lg">
                        <div className="w-8 h-8 bg-primary rounded-xl"></div>
                      </div>
                      <div className="text-left">
                        <div className="font-montserrat-bold text-white text-lg">SUPPORT24</div>
                        <div className="text-primary-200 text-sm">Your Care Hub</div>
                      </div>
                    </div>

                    {/* Phone Content Boxes */}
                    <div className="space-y-3 flex-1">
                      {['Schedule', 'Workers', 'Funds', 'Support'].map((item, i) => (
                        <motion.div
                          key={item}
                          className="bg-primary-700/80 backdrop-blur-sm rounded-2xl p-4 text-left font-medium shadow-lg"
                          initial={{ opacity: 0, x: -30 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.8 + i * 0.1 }}
                        >
                          {item}
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Floating Cards Around Phone */}
              {/* Top Left Card */}
              <motion.div
                className="absolute -left-8 top-20 sm:-left-20 sm:top-24 z-10"
                animate={{ 
                  y: [0, -20, 0],
                  rotate: [-5, -8, -5]
                }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
              >
                <div className="bg-gray-900/90 backdrop-blur-md rounded-2xl p-4 w-32 sm:w-40 shadow-2xl border border-gray-700">
                  <div className="w-10 h-10 bg-primary rounded-xl mb-2"></div>
                  <div className="text-xs font-montserrat-semibold mb-1">NDIS</div>
                  <div className="text-[10px] text-gray-400">Funding</div>
                </div>
              </motion.div>

              {/* Top Right Card */}
              <motion.div
                className="absolute -right-8 top-32 sm:-right-20 sm:top-40 z-10"
                animate={{ 
                  y: [0, -15, 0],
                  rotate: [5, 8, 5]
                }}
                transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
              >
                <div className="bg-gray-900/90 backdrop-blur-md rounded-2xl p-4 w-32 sm:w-40 shadow-2xl border border-gray-700">
                  <div className="w-10 h-10 bg-primary rounded-xl mb-2"></div>
                  <div className="text-xs font-montserrat-semibold mb-1">Calendar</div>
                  <div className="text-[10px] text-gray-400">Schedule</div>
                </div>
              </motion.div>

              {/* Bottom Left Card */}
              <motion.div
                className="absolute -left-8 bottom-32 sm:-left-20 sm:bottom-40 z-10"
                animate={{ 
                  y: [0, 15, 0],
                  rotate: [-3, -6, -3]
                }}
                transition={{ duration: 4.2, repeat: Infinity, ease: "easeInOut", delay: 0.3 }}
              >
                <div className="bg-gray-900/90 backdrop-blur-md rounded-2xl p-4 w-32 sm:w-40 shadow-2xl border border-gray-700">
                  <div className="w-10 h-10 bg-primary rounded-xl mb-2"></div>
                  <div className="text-xs font-montserrat-semibold mb-1">Chat</div>
                  <div className="text-[10px] text-gray-400">Messages</div>
                </div>
              </motion.div>

              {/* Bottom Right Card */}
              <motion.div
                className="absolute -right-8 bottom-20 sm:-right-20 sm:bottom-24 z-10"
                animate={{ 
                  y: [0, 18, 0],
                  rotate: [3, 6, 3]
                }}
                transition={{ duration: 4.8, repeat: Infinity, ease: "easeInOut", delay: 0.7 }}
              >
                <div className="bg-gray-900/90 backdrop-blur-md rounded-2xl p-4 w-32 sm:w-40 shadow-2xl border border-gray-700">
                  <div className="w-10 h-10 bg-primary rounded-xl mb-2"></div>
                  <div className="text-xs font-montserrat-semibold mb-1">Progress</div>
                  <div className="text-[10px] text-gray-400">Tracking</div>
                </div>
              </motion.div>
            </motion.div>

            <motion.div
              className="inline-flex items-center gap-2 bg-primary-900/40 backdrop-blur-sm border border-primary-700/50 px-6 py-3 rounded-full text-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.2 }}
            >
              Support That Fits Your Life <span className="text-xl">👇</span>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Safe, Verified, Reliable Section */}
      <section className="relative py-24 px-6 bg-gradient-to-b from-transparent via-primary-900/30 to-transparent">
        <div className="max-w-7xl mx-auto">
          <motion.div className="text-center mb-16" {...fadeInUp}>
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-montserrat-bold mb-6">
              Safe. Verified. <span className="italic text-primary-400">Reliable.</span>
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
              The wellbeing comes first. Every support worker is thoroughly screened, and every interaction is secured
            </p>
            <motion.div
              className="mt-8"
              initial={{ scale: 0 }}
              whileInView={{ scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <div className="inline-block bg-primary hover:bg-primary-700 px-6 py-3 rounded-full text-sm font-medium cursor-pointer">
                LEARN MORE →
              </div>
            </motion.div>
          </motion.div>

          {/* Feature Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { title: 'Verified Support Workers', desc: 'All support workers undergo thorough background checks, verification processes, and skill assessments.', icon: '✓' },
              { title: 'Insurance Transparency', desc: 'Complete coverage details with transparent policies to give you peace of mind.', icon: '🛡️' },
              { title: 'Privacy Protected', desc: 'Your data is encrypted and secure. We prioritize your privacy above all else.', icon: '🔒' },
              { title: 'Streamlined Booking', desc: 'Easy scheduling and payment processing for hassle-free care coordination.', icon: '💳' }
            ].map((feature, i) => (
              <motion.div
                key={i}
                className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-3xl p-8 hover:bg-white/10 transition-all duration-300"
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                whileHover={{ y: -5, scale: 1.02 }}
              >
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-montserrat-bold mb-3">{feature.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Care Journey Section with Phone */}
      <section className="relative py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div className="text-center mb-16" {...fadeInUp}>
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-montserrat-bold mb-6">
              Support24 is for everyone in The Care Journey
            </h2>
            <p className="text-xl text-gray-300 max-w-4xl mx-auto leading-relaxed">
              Whether you are seeking support (providing care) or managing service, Support24 simplifies every part of the care process
            </p>
          </motion.div>

          {/* Center Phone Mockup */}
          <motion.div
            className="max-w-md mx-auto"
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <div className="relative">
              {/* Phone mockup - replace with actual image */}
              <div className="bg-gradient-to-b from-gray-900 to-gray-800 rounded-[3rem] p-4 shadow-2xl border-4 border-gray-700">
                <div className="bg-white rounded-[2.5rem] h-[700px] overflow-hidden">
                  {/* Calendar View Mockup */}
                  <div className="p-6 bg-gray-100">
                    <div className="text-gray-900 font-montserrat-bold text-2xl mb-6">October 2024</div>
                    <div className="grid grid-cols-7 gap-2 mb-4">
                      {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map(day => (
                        <div key={day} className="text-center text-gray-1000 text-sm font-medium">{day}</div>
                      ))}
                    </div>
                    <div className="grid grid-cols-7 gap-2">
                      {Array.from({ length: 35 }, (_, i) => (
                        <motion.div
                          key={i}
                          className={`aspect-square rounded-xl flex items-center justify-center text-sm ${
                            i % 7 === 0 ? 'bg-primary text-white font-montserrat-bold' : 'bg-white text-gray-700'
                          }`}
                          initial={{ opacity: 0, scale: 0.8 }}
                          whileInView={{ opacity: 1, scale: 1 }}
                          viewport={{ once: true }}
                          transition={{ delay: i * 0.02 }}
                        >
                          {i + 1}
                        </motion.div>
                      ))}
                    </div>
                    
                    {/* Event List */}
                    <div className="mt-6 space-y-3">
                      {['Support Worker Visit', 'Physiotherapy Session', 'Community Event'].map((event, i) => (
                        <motion.div
                          key={i}
                          className="bg-primary text-white p-4 rounded-2xl"
                          initial={{ opacity: 0, x: -20 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          viewport={{ once: true }}
                          transition={{ delay: 0.5 + i * 0.1 }}
                        >
                          <div className="font-medium">{event}</div>
                          <div className="text-sm text-primary-200">10:00 AM</div>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Floating Info Cards */}
              <motion.div
                className="absolute -left-12 top-1/4 hidden lg:block"
                animate={{ x: [-10, 0, -10] }}
                transition={{ duration: 3, repeat: Infinity }}
              >
                <div className="bg-primary text-white p-4 rounded-2xl shadow-2xl w-48">
                  <div className="font-montserrat-bold mb-1">Manage your Services and Providers</div>
                  <div className="text-sm text-primary-100">Track and coordinate all care services</div>
                </div>
              </motion.div>

              <motion.div
                className="absolute -right-12 top-1/3 hidden lg:block"
                animate={{ x: [10, 0, 10] }}
                transition={{ duration: 3.5, repeat: Infinity, delay: 0.5 }}
              >
                <div className="bg-primary text-white p-4 rounded-2xl shadow-2xl w-48">
                  <div className="font-montserrat-bold mb-1">All your information and Resources</div>
                  <div className="text-sm text-primary-100">Everything in one place</div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* All In One Place Section */}
      <section className="relative py-24 px-6 bg-gradient-to-b from-transparent via-primary-900/20 to-transparent">
        <div className="max-w-7xl mx-auto">
          <motion.div className="text-center mb-16" {...fadeInUp}>
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-montserrat-bold mb-6">
              All In One Place
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Comprehensive tools and support designed to give you complete control over your care journey
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { title: 'Daily Routine', desc: 'Schedule and manage daily activities with ease', icon: '📅' },
              { title: 'Create & Contrast', desc: 'Build detailed care plans and compare options', icon: '📝' },
              { title: 'Camp & Schedules', desc: 'Organize group activities and appointments', icon: '🏕️' },
              { title: 'Specialist Support', desc: 'Access to qualified healthcare professionals', icon: '👨‍⚕️' },
              { title: 'Places of Mind', desc: 'Track wellness and mental health progress', icon: '🧘' }
            ].map((tool, i) => (
              <motion.div
                key={i}
                className="bg-primary-900/20 backdrop-blur-sm border border-primary-700/30 rounded-3xl p-8 hover:bg-primary-900/30 transition-all duration-300"
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                whileHover={{ y: -5 }}
              >
                <div className="text-4xl mb-4">{tool.icon}</div>
                <h3 className="text-xl font-montserrat-bold mb-3">{tool.title}</h3>
                <p className="text-gray-400 text-sm">{tool.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="relative py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div className="text-center mb-12" {...fadeInUp}>
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-montserrat-bold mb-8">
              Trusted by Thousands across Australia
            </h2>
            
            {/* Stats */}
            <div className="flex flex-wrap justify-center gap-12 mb-12">
              {[
                { value: '4.9', label: 'Average Rating' },
                { value: '10,000+', label: 'Active Users' },
                { value: '50,000+', label: 'Sessions Booked' }
              ].map((stat, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, scale: 0.5 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.2 }}
                >
                  <div className="text-5xl font-montserrat-bold text-primary-400">{stat.value}</div>
                  <div className="text-gray-400 mt-2">{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Testimonial Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <motion.div
                key={i}
                className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-3xl p-6"
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ y: -5 }}
              >
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, j) => (
                    <Star key={j} className="w-4 h-4 fill-primary-400 text-primary-400" />
                  ))}
                  <span className="ml-2 text-primary-400 font-montserrat-bold text-sm">5.0</span>
                </div>
                <p className="font-montserrat-semibold mb-3 text-lg">I love the service, can't say this enough!</p>
                <p className="text-gray-400 text-sm mb-4">The booking process was seamless and the support workers are highly professional.</p>
                <div className="flex items-center gap-3 pt-4 border-t border-white/10">
                  <div className="w-10 h-10 bg-primary rounded-full"></div>
                  <div>
                    <div className="font-medium">Sarah Bean</div>
                    <div className="text-xs text-gray-400">Melbourne</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="relative py-24 px-6 bg-gradient-to-b from-transparent via-primary-900/20 to-transparent">
        <div className="max-w-4xl mx-auto">
          <motion.div className="text-center mb-12" {...fadeInUp}>
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-montserrat-bold mb-6">
              Frequently Asked Questions
            </h2>
            <p className="text-xl text-gray-300">
              Got questions about FAQ section, where we answer the most common queries about Support24
            </p>
          </motion.div>

          <div className="space-y-4">
            {[
              'Where are support workers verified?',
              'Can I use my NDIS funding with Support24?',
              'Is Support24 free to join?',
              'What about insurance coverage?',
              'Can I book group activities or camps?',
              'What devices are supported?'
            ].map((question, i) => (
              <motion.div
                key={i}
                className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl overflow-hidden"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
              >
                <button
                  className="w-full p-6 text-left flex justify-between items-center hover:bg-white/5 transition-colors"
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                >
                  <span className="font-montserrat-semibold text-lg">{question}</span>
                  <motion.div
                    animate={{ rotate: openFaq === i ? 180 : 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <ChevronDown className="w-6 h-6" />
                  </motion.div>
                </button>
                <motion.div
                  initial={false}
                  animate={{
                    height: openFaq === i ? 'auto' : 0,
                    opacity: openFaq === i ? 1 : 0
                  }}
                  transition={{ duration: 0.3 }}
                  className="overflow-hidden"
                >
                  <div className="p-6 pt-0 text-gray-400">
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                  </div>
                </motion.div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-24 px-6">
        <motion.div
          className="max-w-6xl mx-auto relative"
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <div className="relative bg-gradient-to-br from-primary via-primary-700 to-primary-800 rounded-[3rem] p-12 md:p-16 overflow-hidden shadow-2xl">
            {/* Background decoration */}
            <div className="absolute inset-0 opacity-20">
              <div className="absolute top-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl"></div>
              <div className="absolute bottom-0 left-0 w-96 h-96 bg-primary-400 rounded-full blur-3xl"></div>
            </div>

            <div className="relative z-10 text-center">
              <h2 className="text-4xl sm:text-5xl lg:text-6xl font-montserrat-bold mb-6">
                Take Control of your Support Today
              </h2>
              <p className="text-xl text-primary-100 mb-10 max-w-3xl mx-auto leading-relaxed">
                Join Support24 today and discover a simpler way to manage services, book support, and enjoy community connections—all from one complete platform
              </p>

              <div className="flex flex-wrap justify-center gap-4">
                <motion.button
                  className="bg-white text-primary-700 hover:bg-gray-100 px-8 py-4 rounded-full font-montserrat-semibold text-lg flex items-center gap-3 shadow-xl transition-colors"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <span>📱</span> Get Started
                </motion.button>
                <motion.button
                  className="bg-gray-900 hover:bg-gray-800 text-white px-8 py-4 rounded-full font-montserrat-semibold text-lg flex items-center gap-3 shadow-xl transition-colors"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <span>🍎</span> Get on iOS
                </motion.button>
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="relative border-t border-white/10 bg-black/20 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-6 py-16">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
            {/* Brand */}
            <div className="md:col-span-1">
              <div className="text-2xl font-montserrat-bold mb-4">
                SUPPORT<span className="text-primary-500">24</span>
              </div>
              <p className="text-gray-400 text-sm leading-relaxed">
                Support24 provides NDIS support management, making it easier to connect with verified workers and manage your care journey.
              </p>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="font-montserrat-bold text-lg mb-4">Quick Links</h3>
              <ul className="space-y-3">
                {['About', 'Pricing', 'Blog'].map(link => (
                  <li key={link}>
                    <a href="#" className="text-gray-400 hover:text-white transition-colors text-sm">
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Legal */}
            <div>
              <h3 className="font-montserrat-bold text-lg mb-4">Legal</h3>
              <ul className="space-y-3">
                {['Privacy Policy', 'Terms of Use', 'Guidelines'].map(link => (
                  <li key={link}>
                    <a href="#" className="text-gray-400 hover:text-white transition-colors text-sm">
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h3 className="font-montserrat-bold text-lg mb-4">Contact</h3>
              <ul className="space-y-3 text-sm text-gray-400">
                <li className="flex items-center gap-2">
                  <span>📧</span> help@support24.com.au
                </li>
                <li className="flex items-center gap-2">
                  <span>📞</span> +36 1900 9800
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-gray-400">
              © 2024 Support24. All rights reserved.
            </p>
            
            {/* Social Links */}
            <div className="flex gap-4">
              {['Facebook', 'LinkedIn', 'Twitter'].map(social => (
                <motion.a
                  key={social}
                  href="#"
                  className="w-10 h-10 bg-primary/20 hover:bg-primary/40 rounded-full flex items-center justify-center transition-colors"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  aria-label={social}
                >
                  <div className="w-5 h-5 bg-white/80 rounded"></div>
                </motion.a>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}