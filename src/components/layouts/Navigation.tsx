import React, { useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Link, useLocation } from "react-router-dom";
import { CloseCircle, HamburgerMenu } from "@solar-icons/react";
import { ChevronDown, ChevronRight } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LANDINGPAGE_NAVS, ROLES_DROPDOWN_ITEMS } from "@/constants/landingpage";

interface NavigationProps {
  className?: string;
}

export const Navigation: React.FC<NavigationProps> = ({ className = "" }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [opportunitiesExpanded, setOpportunitiesExpanded] = useState(false);
  const [rolesExpanded, setRolesExpanded] = useState(false);
  const { scrollY } = useScroll();
  const location = useLocation();

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    // Check if this is a hash link
    if (href.startsWith("/#")) {
      e.preventDefault();
      const id = href.substring(2); // Remove '/#'
      
      // If we're not on the landing page, navigate there first
      if (location.pathname !== "/") {
        window.location.href = href;
        return;
      }
      
      // Otherwise, scroll to the element
      const element = document.getElementById(id);
      if (element) {
        element.scrollIntoView({ behavior: "smooth", block: "start" });
      }
      setMobileMenuOpen(false);
    }
  };

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
      <nav className="px-4 sm:px-6 md:px-8 xl:px-16 py-4 md:py-5">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center"
          >
            <Link to="/"> 
            <img
              className="h-8 sm:h-10 xl:h-12"
              src="/new-res/support24logo-blk.svg"
              alt="Support24 Logo"
            />
            </Link>
          </motion.div>

          {/* Desktop Navigation */}
          <div className="hidden xl:flex items-center gap-6 font-montserrat-semibold bg-gray-800/90 px-6 py-3 rounded-full">
            {/* Navigation Links */}
            {LANDINGPAGE_NAVS.map((nav, i) => {
              const isActive = nav.name === "Opportunities" || nav.name === "Roles";
              
              if (nav.name === "Roles" && nav.hasDropdown) {
                return (
                  <DropdownMenu key={i + nav.name}>
                    <DropdownMenuTrigger asChild>
                      <button
                        className={`
                          text-sm text-white transition-colors flex items-center gap-1 relative
                          ${isActive ? "pb-1" : ""}
                          hover:opacity-80
                        `}
                      >
                        {nav.name}
                        <ChevronDown className="h-3 w-3 text-white" />
                        {isActive && (
                          <span className="absolute bottom-0 left-0 right-0 h-[1px] bg-white" />
                        )}
                      </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                      align="start"
                      className="w-80 bg-white border border-gray-200 rounded-xl shadow-lg p-3 mt-2"
                    >
                      {ROLES_DROPDOWN_ITEMS.map((role) => (
                        <DropdownMenuItem asChild key={role.title} className="p-0 focus:bg-transparent">
                          <Link
                            to={role.href}
                            className="flex items-center justify-between w-full px-4 py-3.5 rounded-lg hover:bg-gray-50 cursor-pointer gap-3"
                          >
                            <div className="flex flex-col min-w-0">
                              <span className="text-sm font-montserrat-semibold text-primary">
                                {role.title}
                              </span>
                              <span className="text-xs text-gray-600 mt-0.5">
                                {role.description}
                              </span>
                            </div>
                            <ChevronRight className="h-4 w-4 text-primary shrink-0" />
                          </Link>
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                );
              }
              
              if (nav.name === "Opportunities" && nav.hasDropdown) {
                return (
                  <DropdownMenu key={i + nav.name}>
                    <DropdownMenuTrigger asChild>
                      <button
                        className={`
                          text-sm text-white transition-colors flex items-center gap-1 relative
                          ${isActive ? "pb-1" : ""}
                          hover:opacity-80
                        `}
                      >
                        {nav.name}
                        <ChevronDown className="h-3 w-3 text-white" />
                        {isActive && (
                          <span className="absolute bottom-0 left-0 right-0 h-[1px] bg-white" />
                        )}
                      </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                      align="start"
                      className="w-64 bg-white border border-gray-200 rounded-lg shadow-lg p-2 mt-2"
                    >
                      <DropdownMenuItem asChild className="p-0 focus:bg-transparent">
                        <Link
                          to="/events"
                          className="flex items-center justify-between w-full px-4 py-3 rounded-md hover:bg-gray-50 cursor-pointer"
                        >
                          <div className="flex flex-col">
                            <span className="text-sm font-montserrat-semibold text-primary">
                              Events
                            </span>
                            <span className="text-xs text-gray-600 mt-0.5">
                              Explore events near you
                            </span>
                          </div>
                          <ChevronRight className="h-4 w-4 text-primary" />
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild className="p-0 focus:bg-transparent">
                        <Link
                          to="/accommodations"
                          className="flex items-center justify-between w-full px-4 py-3 rounded-md hover:bg-gray-50 cursor-pointer"
                        >
                          <div className="flex flex-col">
                            <span className="text-sm font-montserrat-semibold text-primary">
                              Accommodations
                            </span>
                            <span className="text-xs text-gray-600 mt-0.5">
                              Find accommodations near you
                            </span>
                          </div>
                          <ChevronRight className="h-4 w-4 text-primary" />
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild className="p-0 focus:bg-transparent">
                        <Link
                          to="/opportunities"
                          className="flex items-center justify-between w-full px-4 py-3 rounded-md hover:bg-gray-50 cursor-pointer"
                        >
                          <div className="flex flex-col">
                            <span className="text-sm font-montserrat-semibold text-primary">
                              Find Jobs
                            </span>
                            <span className="text-xs text-gray-600 mt-0.5">
                              Find jobs near you
                            </span>
                          </div>
                          <ChevronRight className="h-4 w-4 text-primary" />
                        </Link>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                );
              }
              
              return (
                <Link
                  key={i + nav.name}
                  to={nav.href}
                  onClick={(e) => handleNavClick(e, nav.href)}
                  className={`
                    text-sm text-white transition-colors flex items-center gap-1 relative
                    ${isActive ? "pb-1" : ""}
                  `}
                >
                  {nav.name}
                  {nav.hasDropdown && (
                    <ChevronDown className="h-3 w-3 text-white" />
                  )}
                  {isActive && (
                    <span className="absolute bottom-0 left-0 right-0 h-[1px] bg-white" />
                  )}
                </Link>
              );
            })}
          </div>

          {/* Login Button */}
          <motion.button
            onClick={() => {
              window.location.href = "/login";
            }}
            className="hidden xl:block bg-primary hover:bg-primary-700 w-[220px] px-6 py-4 rounded-xl text-sm font-montserrat-semibold transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Login
          </motion.button>

          {/* Mobile/Tablet menu button */}
          <button
            className="xl:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? (
              <CloseCircle size={24} className="text-white" />
            ) : (
              <HamburgerMenu size={24} className="text-white" />
            )}
          </button>

          {/* Mobile/Tablet Menu */}
          {mobileMenuOpen && (
            <div className="absolute xl:hidden top-full left-0 w-full bg-[#05030B]/95 backdrop-blur-md drop-shadow-sm shadow-lg rounded-b-lg mt-2 border border-gray-800/20">
              <ul className="flex flex-col p-4 sm:p-6">
                {LANDINGPAGE_NAVS.map((nav, i) => {
                  const isActive = nav.name === "Opportunities" || nav.name === "Roles";
                  
                  if (nav.name === "Roles" && nav.hasDropdown) {
                    return (
                      <li key={i + nav.name}>
                        <button
                          onClick={() => setRolesExpanded(!rolesExpanded)}
                          className={`
                            font-montserrat-semibold flex items-center gap-2 px-4 py-3 text-sm sm:text-base 
                            hover:bg-gray-100/10 text-white hover:text-primary transition-colors rounded-lg w-full text-left
                            ${isActive ? "border-b border-white pb-2" : ""}
                          `}
                        >
                          {nav.name}
                          <ChevronDown className={`h-3 w-3 text-white transition-transform ${rolesExpanded ? "rotate-180" : ""}`} />
                        </button>
                        {rolesExpanded && (
                          <ul className="ml-4 mt-2 space-y-2">
                            {ROLES_DROPDOWN_ITEMS.map((role) => (
                              <li key={role.title}>
                                <Link
                                  to={role.href}
                                  onClick={() => setMobileMenuOpen(false)}
                                  className="flex items-center justify-between px-4 py-2 text-sm rounded-lg hover:bg-gray-100/10 text-white"
                                >
                                  <div className="flex flex-col">
                                    <span className="font-montserrat-semibold text-primary">{role.title}</span>
                                    <span className="text-xs text-gray-400">{role.description}</span>
                                  </div>
                                  <ChevronRight className="h-4 w-4 text-primary" />
                                </Link>
                              </li>
                            ))}
                          </ul>
                        )}
                      </li>
                    );
                  }
                  
                  if (nav.name === "Opportunities" && nav.hasDropdown) {
                    return (
                      <li key={i + nav.name}>
                        <button
                          onClick={() => setOpportunitiesExpanded(!opportunitiesExpanded)}
                          className={`
                            font-montserrat-semibold flex items-center gap-2 px-4 py-3 text-sm sm:text-base 
                            hover:bg-gray-100/10 text-white hover:text-primary transition-colors rounded-lg w-full text-left
                            ${isActive ? "border-b border-white pb-2" : ""}
                          `}
                        >
                          {nav.name}
                          <ChevronDown className={`h-3 w-3 text-white transition-transform ${opportunitiesExpanded ? "rotate-180" : ""}`} />
                        </button>
                        {opportunitiesExpanded && (
                          <ul className="ml-4 mt-2 space-y-2">
                            <li>
                              <Link
                                to="/events"
                                onClick={() => setMobileMenuOpen(false)}
                                className="flex items-center justify-between px-4 py-2 text-sm rounded-lg hover:bg-gray-100/10 text-white"
                              >
                                <div className="flex flex-col">
                                  <span className="font-montserrat-semibold text-primary">Events</span>
                                  <span className="text-xs text-gray-400">Explore events near you</span>
                                </div>
                                <ChevronRight className="h-4 w-4 text-primary" />
                              </Link>
                            </li>
                            <li>
                              <Link
                                to="/accommodations"
                                onClick={() => setMobileMenuOpen(false)}
                                className="flex items-center justify-between px-4 py-2 text-sm rounded-lg hover:bg-gray-100/10 text-white"
                              >
                                <div className="flex flex-col">
                                  <span className="font-montserrat-semibold text-primary">Accommodations</span>
                                  <span className="text-xs text-gray-400">Find accommodations near you</span>
                                </div>
                                <ChevronRight className="h-4 w-4 text-primary" />
                              </Link>
                            </li>
                            <li>
                              <Link
                                to="/opportunities"
                                onClick={() => setMobileMenuOpen(false)}
                                className="flex items-center justify-between px-4 py-2 text-sm rounded-lg hover:bg-gray-100/10 text-white"
                              >
                                <div className="flex flex-col">
                                  <span className="font-montserrat-semibold text-primary">Find Jobs</span>
                                  <span className="text-xs text-gray-400">Find jobs near you</span>
                                </div>
                                <ChevronRight className="h-4 w-4 text-primary" />
                              </Link>
                            </li>
                          </ul>
                        )}
                      </li>
                    );
                  }
                  
                  return (
                    <li key={i + nav.name}>
                      <Link
                        to={nav.href}
                        onClick={(e) => handleNavClick(e, nav.href)}
                        className={`
                          font-montserrat-semibold flex items-center gap-2 px-4 py-3 text-sm sm:text-base 
                          hover:bg-gray-100/10 text-white hover:text-primary transition-colors rounded-lg
                          ${isActive ? "border-b border-white pb-2" : ""}
                        `}
                      >
                        {nav.name}
                        {nav.hasDropdown && (
                          <ChevronDown className="h-3 w-3 text-white" />
                        )}
                      </Link>
                    </li>
                  );
                })}
                <li className="mt-4">
                  <button
                    onClick={() => {
                      window.location.href = "/login";
                      setMobileMenuOpen(false);
                    }}
                    className="w-full bg-primary hover:bg-primary-700 px-6 py-4 rounded-xl text-sm sm:text-base font-montserrat-semibold transition-colors"
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
