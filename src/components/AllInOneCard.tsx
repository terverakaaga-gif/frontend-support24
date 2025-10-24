import React from "react";

interface AllInOneCardProps {
  title: string;
  content: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  className?: string;
}

export const AllInOneCard: React.FC<AllInOneCardProps> = ({
  title,
  content,
  icon: Icon,
  className = "",
}) => {
  return (
    <div className={`bg-gradient-to-br from-[#1a1a2e] to-[#1349de] h-full min-h-[240px] sm:min-h-[260px] lg:min-h-[280px] w-full rounded-2xl sm:rounded-3xl p-5 sm:p-6 border border-gray-700/30 hover:border-primary/50 transition-all duration-300 hover:shadow-lg hover:shadow-primary/10 flex flex-col ${className}`}>
      {/* Icon */}
      <div className="mb-3 sm:mb-4">
        <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gray-700/50 rounded-lg sm:rounded-xl flex items-center justify-center">
          <Icon className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
        </div>
      </div>

      {/* Title */}
      <h3 className="text-base sm:text-lg lg:text-xl font-montserrat-bold text-white mb-2 sm:mb-3">
        {title}
      </h3>

      {/* Content */}
      <p className="text-gray-300 text-xs sm:text-sm leading-relaxed font-montserrat-regular flex-grow">
        {content}
      </p>
    </div>
  );
};
