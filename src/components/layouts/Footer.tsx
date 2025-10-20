import React from "react";
import { motion } from "framer-motion";
import { Letter, Phone } from "@solar-icons/react";

interface FooterProps {
  className?: string;
}

export const Footer: React.FC<FooterProps> = ({ className = "" }) => {
  return (
    <footer className={`bg-[#05030B] text-white border-t border-gray-800/20 ${className}`}>
      <div className="p-8 md:p-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12 mb-8 md:mb-12">
          {/* Brand */}
          <div className="sm:col-span-2 lg:col-span-1">
            <div className="text-xl md:text-2xl font-bold mb-3 md:mb-4">
              <img
                className="h-8 md:h-12"
                src="/new-res/support24logo-blk.svg"
                alt="Support24 Logo"
              />
            </div>
            <p className="font-montserrat-semibold text-sm leading-relaxed text-gray-300">
              Support24 provides NDIS support management, making it easier to
              connect with verified workers and manage your care journey.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-montserrat-bold text-base md:text-lg mb-3 md:mb-4 text-white">
              Quick Links
            </h3>
            <ul className="space-y-2 md:space-y-3 font-montserrat-semibold">
              {["About", "Pricing", "Blog"].map((link) => (
                <li key={link}>
                  <a
                    href="#"
                    className="text-gray-300 hover:text-white transition-colors text-sm"
                  >
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="font-montserrat-bold text-base md:text-lg mb-3 md:mb-4 text-white">
              Legal
            </h3>
            <ul className="space-y-2 md:space-y-3 font-montserrat-semibold">
              {["Privacy Policy", "Terms of Use", "Guidelines"].map((link) => (
                <li key={link}>
                  <a
                    href="#"
                    className="text-gray-300 hover:text-white transition-colors text-sm"
                  >
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-montserrat-bold text-base md:text-lg mb-3 md:mb-4 text-white">
              Contact
            </h3>
            <ul className="space-y-2 md:space-y-3 text-sm font-montserrat-semibold">
              <li className="flex items-center gap-2 text-gray-300">
                <Letter className="w-4 h-4" /> 
                <a 
                  href="mailto:help@support24.com.au"
                  className="hover:text-white transition-colors"
                >
                  help@support24.com.au
                </a>
              </li>
              <li className="flex items-center gap-2 text-gray-300">
                <Phone className="w-4 h-4" /> 
                <a 
                  href="tel:+0319009800"
                  className="hover:text-white transition-colors"
                >
                  (03) 1900 9800
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800/20 pt-6 md:pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs md:text-sm text-gray-400 text-center md:text-left">
            © 2024 Support24. All rights reserved.
          </p>

          {/* Social Links */}
          <div className="flex gap-3 md:gap-4">
            <motion.a 
              className="p-3 rounded-full bg-primary hover:bg-primary/80 transition-colors"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              <img
                src="/new-res/facebook.svg"
                alt="Facebook"
                className="w-5 h-5 md:w-6 md:h-6"
              />
            </motion.a>

            <motion.a 
              className="p-3 rounded-full bg-primary hover:bg-primary/80 transition-colors"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              <img
                src="/new-res/instagram.svg"
                alt="Instagram"
                className="w-5 h-5 md:w-6 md:h-6"
              />
            </motion.a>

            <motion.a 
              className="p-3 rounded-full bg-primary hover:bg-primary/80 transition-colors"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              <img
                src="/new-res/linkedin.svg"
                alt="LinkedIn"
                className="w-5 h-5 md:w-6 md:h-6"
              />
            </motion.a>
          </div>
        </div>
      </div>
    </footer>
  );
};
