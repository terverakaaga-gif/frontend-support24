import React from "react";
import { cn } from "@/lib/design-utils";
import { BG_COLORS, SPACING, RADIUS } from "@/constants/design-system";

export const WaveLoader = () => (
  <div className={cn("flex items-center justify-center min-h-screen", BG_COLORS.muted)}>
    <div className={`flex space-x-${SPACING.sm}`}>
      <div className={cn(`w-${SPACING.base} h-${SPACING.base}`, "bg-primary", RADIUS.full, "animate-wave")}></div>
      <div
        className={cn(`w-${SPACING.base} h-${SPACING.base}`, "bg-primary", RADIUS.full, "animate-wave")}
        style={{ animationDelay: "0.1s" }}
      ></div>
      <div
        className={cn(`w-${SPACING.base} h-${SPACING.base}`, "bg-primary", RADIUS.full, "animate-wave")}
        style={{ animationDelay: "0.2s" }}
      ></div>
      <div
        className={cn(`w-${SPACING.base} h-${SPACING.base}`, "bg-primary", RADIUS.full, "animate-wave")}
        style={{ animationDelay: "0.3s" }}
      ></div>
    </div>
  </div>
);

export const PulseLoader = () => (
  <div className={cn("flex items-center justify-center min-h-screen", BG_COLORS.muted)}>
    <div className="relative">
      <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      <div className="absolute inset-0 flex items-center justify-center">
        <img
          src="/favicon.svg"
          alt="Logo"
          className="w-6 h-6 animate-pulse-scale"
        />
      </div>
    </div>
  </div>
);

export const BounceLoader = () => (
  <div className={cn("flex items-center justify-center min-h-screen", BG_COLORS.muted)}>
    <div className={`flex space-x-${SPACING.xs}`}>
      <div className={cn(`w-${SPACING.md} h-${SPACING.md}`, "bg-primary", RADIUS.full, "animate-bounce")}></div>
      <div
        className={cn(`w-${SPACING.md} h-${SPACING.md}`, "bg-primary", RADIUS.full, "animate-bounce")}
        style={{ animationDelay: "0.1s" }}
      ></div>
      <div
        className={cn(`w-${SPACING.md} h-${SPACING.md}`, "bg-primary", RADIUS.full, "animate-bounce")}
        style={{ animationDelay: "0.2s" }}
      ></div>
    </div>
  </div>
);

// Main loader component that can switch between types
interface LoaderProps {
  type?: "wave" | "pulse" | "bounce";
}

const Loader: React.FC<LoaderProps> = ({ type = "pulse" }) => {
  switch (type) {
    case "pulse":
      return <PulseLoader />;
    case "bounce":
      return <BounceLoader />;
    case "wave":
    default:
      return <WaveLoader />;
  }
};

export default Loader;
