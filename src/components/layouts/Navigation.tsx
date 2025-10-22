import React, { useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Link } from "react-router-dom";
import { CloseCircle, HamburgerMenu } from "@solar-icons/react";
import { LANDINGPAGE_NAVS } from "@/constants/landingpage";

interface NavigationProps {
  className?: string;
}

export const Navigation: React.FC<NavigationProps> = ({ className = "" }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { scrollY } = useScroll();

  return (
    <motion.header
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${className}`}
      initial={{ backgroundColor: "rgba(5, 3, 11, 0)" }}
      style={{
        backgroundColor: useTransform(
          scrollY,
          [0, 100],
          ["rgba(5, 3, 11, 0)", "rgba(5, 3, 11, 0.8)"]
        ),
        backdropFilter: useTransform(
          scrollY,
          [0, 100],
          ["blur(0px)", "blur(20px)"]
        ),
      }}
    >
      <nav className="px-4 md:px-16 py-4 md:py-5">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center"
          >
            <Link to="/"> 
            <img
              className="h-8 md:h-12"
              src="/new-res/support24logo-blk.svg"
              alt="Support24 Logo"
            />
            </Link>
          </motion.div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8 font-montserrat-semibold border border-gray-50/20 bg-gradient-to-tr from-primary-900/20 to-transparent backdrop-blur-sm px-6 py-4 rounded-full">
            {/* Navigation Links */}
            {LANDINGPAGE_NAVS.map((nav, i) => (
              <Link
                key={i + nav.name}
                to={nav.href}
                className="text-sm hover:text-primary transition-colors"
              >
                {nav.name}
              </Link>
            ))}
          </div>

          {/* Login Button */}
          <motion.button
            onClick={() => {
              window.location.href = "/login";
            }}
            className="hidden md:block bg-primary hover:bg-primary-700 w-[220px] px-6 py-4 rounded-xl text-sm font-montserrat-semibold transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Login
          </motion.button>

          {/* Mobile menu button */}
          <button
            className="md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? (
              <CloseCircle size={24} className="text-white" />
            ) : (
              <HamburgerMenu size={24} className="text-white" />
            )}
          </button>

          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <div className="absolute md:hidden top-full w-full right-0 bg-[#05030B]/95 drop-shadow-sm shadow-lg rounded-b-lg mt-2 border border-gray-800/20">
              <ul className="flex flex-col p-4">
                {LANDINGPAGE_NAVS.map((nav, i) => (
                  <li key={i + nav.name}>
                    <Link
                      to={nav.href}
                      className="font-montserrat-semibold block px-4 py-2 text-sm hover:bg-gray-100/10 text-white hover:text-primary transition-colors"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      {nav.name}
                    </Link>
                  </li>
                ))}
                <li className="mt-4">
                  <button
                    onClick={() => {
                      window.location.href = "/login";
                      setMobileMenuOpen(false);
                    }}
                    className="w-full bg-primary hover:bg-primary-700 px-6 py-3 rounded-xl text-sm font-montserrat-semibold transition-colors"
                  >
                    Login
                  </button>
                </li>
              </ul>
            </div>
          )}
        </div>
      </nav>
    </motion.header>
  );
};
