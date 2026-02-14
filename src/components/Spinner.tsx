import { Refresh } from "@solar-icons/react";
import { cn } from "@/lib/design-utils";
import { ICON_SIZES } from "@/constants/design-system";

export const Spinner = () => (
  <Refresh className={cn(ICON_SIZES.xl, "animate-spin")} />
);