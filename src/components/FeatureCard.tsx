import React from "react";

interface FeatureCardProps {
  icon?: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  iconColor?: string;
  title?: string;
  content?: string | React.ReactNode;
  footer?: string | React.ReactNode;
  footerIcon?: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  variant?: "light" | "dark";
  isRounded?: boolean;
  gradientFrom?: string;
  gradientTo?: string;
}

export const FeatureCard = ({
  content,
  footer,
  footerIcon: FooterIcon,
  icon: Icon,
  title,
}: FeatureCardProps) => {
  return (
    <div className="h-full w-full">
      
    <div className={`relative h-full min-h-[390px] sm:min-h-[300px] lg:min-h-[320px] w-full p-5 sm:p-6  overflow-hidden`}>
      {/* Background image */}
      <img
        src="/bg/bg.png"
        alt="Background"
        className="absolute inset-0 w-full h-full   z-0 "
      />
      
      {/* Inner content */}
      <div className="relative z-10 flex flex-col h-full justify-between p-5 sm:p-2">
        <div className="gap-y-2 sm:gap-y-3 flex flex-col">
          {/* Icon */}
          {Icon && (
            <div className="inline-flex h-11 w-11 sm:h-12 sm:w-12 items-center justify-center bg-primary rounded-lg sm:rounded-xl mb-2 sm:mb-3">
              <Icon className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
            </div>
          )}

          {/* Title */}
          {title && (
            <h3 className="text-base sm:text-lg lg:text-xl font-bold text-black mb-1.5 sm:mb-2">
              {title}
            </h3>
          )}

          {/* Content */}
          {content && (
            <div className="text-xs sm:text-sm lg:text-sm text-gray-700 leading-relaxed">
              {content}
            </div>
          )}
        </div>

        {/* Footer */}
        {footer && (
          <div className="flex items-center gap-1.5 sm:gap-2 text-primary font-semibold text-xs sm:text-sm mt-3 sm:mt-4">
            <img src="/new-res/trending_up.svg" alt="Arrow" className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            <span>{footer}</span>
          </div>
        )}
      </div>
    </div>
  </div>
  );
};

export default FeatureCard;