import React from "react";
import { Navigation } from "./Navigation";
import { Footer } from "./Footer";

interface LandingLayoutProps {
  children: React.ReactNode;
  className?: string;
}

export const LandingLayout: React.FC<LandingLayoutProps> = ({ 
  children, 
  className = "" 
}) => {
  return (
    <div className={`min-h-screen bg-[#05030B] text-white relative overflow-hidden ${className}`}>
      {/* Navigation */}
      <Navigation />
      
      {/* Main Content */}
      <main className="relative">
        {children}
      </main>
      
      {/* Footer */}
      <Footer />
    </div>
  );
};
