import React from "react";
import { motion } from "framer-motion";
import { Letter, Phone } from "@solar-icons/react";


interface FooterProps {
  className?: string;
}

export const Footer: React.FC<FooterProps> = ({ className = "" }) => {
  return (
    <footer className={` bg-[#05030B] text-white relative overflow-hidden ${className}`}>
       {/* Gradient blue circle at top right */}
       {/* <img
        src="/new-res/gradient-ckr.svg"
        alt=""
        className="absolute top-0 left-1/2  right-1/2 -translate-x-1/2 -translate-y-1/2  w-[500px] h-[500px] object-cover pointer-events-none"
      /> */}
      <div className="p-8 md:p-16 border-t border-gray-800/20">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12 ">
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
                    href={link === "Blog" ? "https://blog.support24.com.au/" : "#"}
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
                <Phone className="w-4 h-4"  /> 
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
        <div className="border-t border-gray-600/90 pt-6 md:pt-8 flex flex-col md:flex-row justify-between mt-10 items-center gap-4">
          <p className="text-xs md:text-sm text-gray-400 text-center md:text-left">
            © {new Date().getFullYear()} Support24. All rights reserved.
          </p>

          {/* Social Links */}
          <div className="flex gap-3 md:gap-4">
            <motion.a 
              className="p-3 rounded-full bg-primary hover:bg-primary/80 transition-colors"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              href="https://facebook.com/support244"
              target="_blank"
              rel="noopener noreferrer"
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
              href="https://instagram.com/support244"
              target="_blank"
              rel="noopener noreferrer"
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
              href="https://www.linkedin.com/company/support244/"
              target="_blank"
              rel="noopener noreferrer"
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
