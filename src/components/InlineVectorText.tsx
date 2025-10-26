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
        "relative inline-block italic font-montserrat-semibold",
        className,
        spanClassName
      )}
    >
      {text}
      {showImage && (
        <img
          style={imgStyle}
          src={imageSrc}
          alt={imageAlt}
          className={cn(
            "absolute left-0 w-full h-auto pointer-events-none",
            imageClassName || "bottom-0 translate-y-[30%]"
          )}
        />
      )}
    </span>
  );
};
