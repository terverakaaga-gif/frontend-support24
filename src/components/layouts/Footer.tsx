import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Letter, Phone } from "@solar-icons/react";
import { MapPin } from "lucide-react";


interface FooterProps {
  className?: string;
}

export const Footer: React.FC<FooterProps> = ({ className = "" }) => {
  return (
    <footer id="contact" className={` bg-[#05030B] text-white relative overflow-hidden scroll-mt-20 ${className}`}>
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
              <li>
                <Link
                  to="/privacy-policy"
                  className="text-gray-300 hover:text-white transition-colors text-sm"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  to="/terms-of-use"
                  className="text-gray-300 hover:text-white transition-colors text-sm"
                >
                  Terms of Use
                </Link>
              </li>
              <li>
                <Link
                  to="/platform-terms"
                  className="text-gray-300 hover:text-white transition-colors text-sm"
                >
                  Platform Terms
                </Link>
              </li>
              <li>
                <Link
                  to="/incident-management-policy"
                  className="text-gray-300 hover:text-white transition-colors text-sm"
                >
                  Incident Management
                </Link>
              </li>
              <li>
                <Link
                  to="/complaints-resolution-policy"
                  className="text-gray-300 hover:text-white transition-colors text-sm"
                >
                  Complaints & Disputes
                </Link>
              </li>
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
                  href="tel:+03 4832 4105"
                  className="hover:text-white transition-colors"
                >
                 +03 4832 4105
                </a>
              </li>
              <li className="flex items-center gap-2 text-gray-300">
                <MapPin className="w-4 h-4"  /> 
                <a 
                  href="https://www.google.com/maps/place/Support24/@-37.8141076,144.9632817,15z/data=!4m6!3m5!1s0x6ad642af53d532bd:0x5045675c31c63dfe!8m2!3d-37.8141076!4d144.9632817!16s%2Fg%2F11c4022hz7?entry=ttu&g_ep=EgoyMDI1MTEwMjE2NjA6CGgLEgZ2aXN0aWNzMjQyBDIJc291cmNlMjQuY29tLmF1OgIIBA%3D%3D"
                  className="hover:text-white transition-colors"
                >
                  Melbourne, Victoria, Australia
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
