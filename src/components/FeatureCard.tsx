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
    <div className="h-full">
    <div
      className={`relative h-[32rem] w-full  p-6 sm:p-8 shadow-xl`}
      style={{
        backgroundImage: "url('/bg/bg.png')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      {/* Inner content */}
      <div className="flex flex-col h-full justify-between">
        <div className="gap-y-4 flex flex-col ">
          {/* Icon */}
          {Icon && (
            <div className="inline-flex h-12 w-12 sm:h-14 sm:w-14 items-center justify-center bg-primary rounded-xl sm:rounded-2xl mb-4 sm:mb-6">
              <Icon className="h-6 w-6 sm:h-7 sm:w-7 text-white" />
            </div>
          )}

          {/* Title */}
          {title && (
            <h3 className="text-xl sm:text-2xl font-bold text-black mb-3 sm:mb-4">
              {title}
            </h3>
          )}

          {/* Content */}
          {content && (
            <div className="text-sm sm:text-[18px] text-black leading-10">
              {content}
            </div>
          )}
        </div>

        {/* Footer */}
        {footer && (
          <div className="flex items-center gap-2 text-primary font-semibold text-sm sm:text-base mt-6">
            <img src="/new-res/trending_up.svg" alt="Arrow" />
            <span>{footer}</span>
          </div>
        )}
      </div>
    </div>
  </div>
  );
};

export default FeatureCard;