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
    <div className={`bg-gradient-to-br from-[#1a1a2e] to-[#1349de] h-[268px] w-[362px] rounded-2xl p-6 border border-gray-700/30 hover:border-primary/50 transition-all duration-300 hover:shadow-lg hover:shadow-primary/10 ${className}`}>
      {/* Icon */}
      <div className="mb-4">
        <div className="w-12 h-12 bg-primary/20 rounded-xl flex items-center justify-center">
          <Icon className="w-6 h-6 text-white" />
        </div>
      </div>

      {/* Title */}
      <h3 className="text-xl font-montserrat-bold text-white mb-3">
        {title}
      </h3>

      {/* Content */}
      <p className="text-gray-300 text-sm leading-relaxed font-montserrat-medium">
        {content}
      </p>
    </div>
  );
};
