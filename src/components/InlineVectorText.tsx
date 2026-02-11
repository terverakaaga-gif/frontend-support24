import React from "react";
import { cn } from "@/lib/utils";

interface InlineVectorTextProps {
  text?: string;
  className?: string;
  imageSrc?: string;
  imageAlt?: string;
  imageClassName?: string;
  spanClassName?: string;
  x?: number;
  y?: number;
  showImage?: boolean;
}

export const InlineVectorText = ({
  text = "",
  className,
  imageSrc = "/new-res/zigzag-underline.svg",
  imageAlt = "signature underline",
  imageClassName = "",
  spanClassName,
  x = 0,
  y = 0,
  showImage = true,
}: InlineVectorTextProps) => {
  const imgStyle =
    x || y ? { transform: `translate(${x}px, ${y}px)` } : undefined;

  return (
    <span
      className={cn(
        "relative inline-block z-10",
        className,
        spanClassName
      )}
    >
      {/* The text content */}
      <span className="relative z-10">{text}</span>

      {/* The Zigzag Image */}
      {showImage && (
        <img
          style={imgStyle}
          src={imageSrc}
          alt={imageAlt}
          className={cn(
            // Changed from h-[0.35em] to h-auto to preserve the SVG aspect ratio.
            // w-full ensures it stretches to the text width.
            // translate-y-[35%] positions it slightly below the baseline (adjustable).
            "absolute left-0 w-full h-auto pointer-events-none bottom-0 translate-y-[35%]",
            imageClassName
          )}
        />
      )}
    </span>
  );
};