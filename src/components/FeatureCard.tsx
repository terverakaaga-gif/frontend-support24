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
  gradientFrom,
  gradientTo,
  icon: Icon,
  iconColor,
  isRounded = false,
  title,
  variant = "light",
}: FeatureCardProps) => {
  const isLight = variant === "light";

  return (
    <div className="max-w-md relative min-h-[280px] sm:min-h-[320px] md:h-auto">
      {/* Main Card */}
      <div
        className={`border-2 ${
          isLight ? "border-primary-600 bg-white" : "border-white/20"
        } p-4 sm:p-6 md:p-8 shadow-lg transition-all duration-300 h-full`}
        style={{
          borderRadius: isRounded ? "24px" : "24px",
          clipPath: isRounded
            ? "none"
            : "polygon(0 0, calc(100% - 40px) 0, 100% 40px, 100% 100%, 0 100%)",
          background: isLight
            ? "gradient(135deg, rgb(99, 102, 241), rgb(139, 92, 246))"
            : `linear-gradient(135deg, rgb(30, 41, 82), rgb(49, 46, 129))`,
        }}
      >
        {/* Folded corner triangle (only when NOT rounded) */}
        {!isRounded && (
          <>
            {/* Triangle fold background */}
            <div
              className={`absolute border-2 border-primary ${
                isLight ? "bg-primary-600" : "bg-white/10"
              }`}
              style={{
                top: 0,
                right: 0,
                width: "40px",
                height: "40px",
                clipPath: "polygon(0 0, 100% 0, 100% 100%)",
              }}
            />
            {/* Triangle fold border lines */}
            <div
              className={`absolute ${
                isLight ? "bg-primary" : "bg-white/20"
              }`}
              style={{
                top: "-1px",
                right: "-1px",
                width: "58px",
                height: "2px",
                transformOrigin: "top right",
                transform: "rotate(45deg)",
              }}
            />
          </>
        )}

        {/* Icon */}
        {Icon && (
          <div
            className={`${
              iconColor ? (isLight ? "bg-primary" : "bg-white/10 border border-white/20") : "bg-transparent"
            } inline-flex h-12 w-12 sm:h-14 sm:w-14 items-center justify-center rounded-xl sm:rounded-2xl mb-4 sm:mb-6`}
          >
            <Icon
              className={`h-6 w-6 sm:h-7 sm:w-7 ${
                isLight ? "text-white" : "text-white"
              }`}
            />
          </div>
        )}

        {/* Title */}
        {title && (
          <h3
            className={`text-xl sm:text-2xl font-bold ${
              isLight ? "text-gray-900" : "text-white"
            } mb-3 sm:mb-4`}
          >
            {title}
          </h3>
        )}

        {/* Content */}
        {content && (
          <div
            className={`text-sm sm:text-base ${
              isLight ? "text-black" : "text-white/90"
            } leading-relaxed mb-4 sm:mb-6`}
          >
            {content}
          </div>
        )}

        {/* Footer */}
        {footer && (
          <div
            className={`flex items-center gap-2 ${
              isLight ? "text-primary-600" : "text-white"
            } font-semibold text-sm sm:text-base`}
          >
            {FooterIcon && <FooterIcon className="h-4 w-4 sm:h-5 sm:w-5" />}
            <span>{footer}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default FeatureCard;