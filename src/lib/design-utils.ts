/**
 * Common Tailwind CSS Class Combinations
 * 
 * This file contains pre-built class combinations for frequently used UI patterns.
 * Import these to ensure consistency and reduce code duplication.
 */

import { GAP } from "@/constants/design-system";
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Utility function to merge Tailwind classes
 * Combines clsx for conditional classes and twMerge for Tailwind conflict resolution
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// ============================================================================
// PAGE LAYOUTS
// ============================================================================

/**
 * Standard page wrapper with padding and max-width
 */
export const PAGE_WRAPPER = cn(
  "min-h-screen",
  "bg-gray-100",
  "px-4 py-6",
  "sm:px-6 sm:py-8",
  "lg:px-8 lg:py-10"
);

/**
 * Page container with centered content
 */
export const PAGE_CONTAINER = cn(
  "mx-auto",
  "w-full",
  "max-w-7xl"
);

/**
 * Section wrapper with spacing
 */
export const SECTION_WRAPPER = cn(
  "py-8",
  "md:py-12",
  "lg:py-16"
);

/**
 * Content section with max width
 */
export const CONTENT_SECTION = cn(
  "mx-auto",
  "max-w-4xl",
  "px-4",
  "sm:px-6",
  "lg:px-8"
);

// ============================================================================
// AUTH PAGE LAYOUTS
// ============================================================================

/**
 * Auth page wrapper (Login, Register, ForgotPassword, etc.)
 */
export const AUTH_PAGE_WRAPPER = cn(
  "flex",
  "min-h-screen",
  "w-full",
  "bg-gray-50"
);

/**
 * Auth page split panel (left/right side)
 */
export const AUTH_PANEL = cn(
  "w-full",
  "lg:w-1/2",
  "flex",
  "flex-col",
  "justify-center",
  "items-center",
  "p-8",
  "lg:p-12",
  "relative"
);

/**
 * Auth page carousel/illustration panel
 */
export const AUTH_CAROUSEL_PANEL = cn(
  "hidden",
  "lg:flex",
  "lg:w-1/2",
  "bg-gray-100",
  "relative",
  "overflow-hidden"
);

/**
 * Auth page carousel content container
 */
export const AUTH_CAROUSEL_CONTENT = cn(
  "flex",
  "flex-col",
  "justify-between",
  "w-full",
  "p-12",
  "relative",
  "z-10"
);

/**
 * Auth form container
 */
export const AUTH_FORM_CONTAINER = cn(
  "w-full",
  "max-w-md",
  "space-y-6"
);

/**
 * Auth page logo container
 */
export const AUTH_LOGO_CONTAINER = cn(
  "flex",
  "justify-center",
  "items-center",
  "w-full",
  "my-16"
);

/**
 * Auth page heading
 */
export const AUTH_HEADING = cn(
  "text-3xl",
  "font-montserrat-bold",
  "text-gray-900",
  "mb-2"
);

/**
 * Auth page subheading/description
 */
export const AUTH_SUBHEADING = cn(
  "font-montserrat-semibold",
  "text-gray-600"
);

/**
 * Auth form input field
 */
export const AUTH_INPUT = cn(
  "h-12",
  "px-4",
  "bg-gray-100",
  "border-gray-200",
  "rounded-lg",
  "focus:ring-2",
  "focus:ring-primary-500",
  "focus:border-primary-500",
  "transition-all",
  "duration-200"
);

/**
 * Auth form input with password toggle
 */
export const AUTH_INPUT_PASSWORD = cn(
  AUTH_INPUT,
  "pr-12"
);

/**
 * Auth primary button
 */
export const AUTH_BUTTON_PRIMARY = cn(
  "w-full",
  "h-12",
  "bg-primary-600",
  "hover:bg-primary-700",
  "text-white",
  "font-montserrat-semibold",
  "rounded-lg",
  "shadow-md",
  "hover:shadow-lg",
  "transition-all",
  "duration-200"
);

/**
 * Auth form label
 */
export const AUTH_LABEL = cn(
  "text-gray-700",
  "font-montserrat-semibold"
);

/**
 * Auth link (accent color)
 */
export const AUTH_LINK = cn(
  "text-accent-500",
  "hover:text-accent-600",
  "font-montserrat-semibold",
  "transition-colors"
);

// ============================================================================
// DASHBOARD PAGE LAYOUTS
// ============================================================================

/**
 * Dashboard page wrapper - used for all dashboard pages
 */
export const DASHBOARD_PAGE_WRAPPER = cn(
  "min-h-screen",
  "bg-gray-100",
  "p-6",
  "space-y-6"
);

/**
 * Dashboard content container
 */
export const DASHBOARD_CONTENT = cn(
  "space-y-6"
);

/**
 * Dashboard section header with title and optional actions
 */
export const DASHBOARD_SECTION_HEADER = cn(
  "flex",
  "flex-col",
  "sm:flex-row",
  "sm:items-center",
  "sm:justify-between",
  "gap-4"
);

/**
 * Dashboard stats grid (4 columns responsive)
 */
export const DASHBOARD_STATS_GRID = cn(
  "grid",
  "grid-cols-2",
  "lg:grid-cols-4",
  GAP.responsive
);

/**
 * Dashboard stat card
 */
export const DASHBOARD_STAT_CARD = cn(
  "bg-white",
  "rounded-lg",
  "border",
  "border-gray-200",
  "p-6"
);

/**
 * Dashboard table container
 */
export const DASHBOARD_TABLE_CONTAINER = cn(
  "bg-white",
  "rounded-lg",
  "border",
  "border-gray-200",
  "overflow-hidden"
);

/**
 * Dashboard filters row
 */
export const DASHBOARD_FILTERS = cn(
  "flex",
  "flex-col",
  "sm:flex-row",
  "gap-4",
  "mb-6"
);

/**
 * Dashboard empty state
 */
export const DASHBOARD_EMPTY_STATE = cn(
  "flex",
  "flex-col",
  "items-center",
  "justify-center",
  "py-12",
  "text-center",
  "bg-white",
  "rounded-lg",
  "border",
  "border-gray-200"
);

// ============================================================================
// CARD COMPONENTS
// ============================================================================

/**
 * Standard card with shadow and border
 */
export const CARD = cn(
  "bg-white",
  "rounded-lg",
  "border border-gray-200",
  "shadow-md",
  "overflow-hidden"
);

/**
 * Interactive card with hover effects
 */
export const CARD_INTERACTIVE = cn(
  CARD,
  "transition-all duration-200",
  "hover:shadow-lg",
  "hover:border-primary-300",
  "cursor-pointer"
);

/**
 * Card header section
 */
export const CARD_HEADER = cn(
  "px-6 py-4",
  "border-b border-gray-200",
  "bg-gray-50"
);

/**
 * Card body/content section
 */
export const CARD_CONTENT = cn(
  "p-6"
);

/**
 * Card footer section
 */
export const CARD_FOOTER = cn(
  "px-6 py-4",
  "border-t border-gray-200",
  "bg-gray-50"
);

// ============================================================================
// FORM COMPONENTS
// ============================================================================

/**
 * Form group wrapper (label + input)
 */
export const FORM_GROUP = cn(
  "flex flex-col",
  "gap-2",
  "mb-4"
);

/**
 * Form label
 */
export const FORM_LABEL = cn(
  "text-sm",
  "font-montserrat-semibold",
  "text-gray-700",
  "mb-1"
);

/**
 * Standard text input
 */
export const FORM_INPUT = cn(
  "w-full",
  "px-4 py-2",
  "border border-gray-300",
  "rounded-lg",
  "bg-white",
  "text-gray-900",
  "placeholder-gray-400",
  "focus:outline-none",
  "focus:ring-2",
  "focus:ring-primary-500",
  "focus:border-transparent",
  "transition-colors duration-200",
  "disabled:bg-gray-100",
  "disabled:text-gray-500",
  "disabled:cursor-not-allowed"
);

/**
 * Error state for input
 */
export const FORM_INPUT_ERROR = cn(
  FORM_INPUT.replace("border-gray-300", "border-red-300"),
  "focus:ring-red-500"
);

/**
 * Form error message
 */
export const FORM_ERROR = cn(
  "text-xs",
  "text-red-600",
  "mt-1"
);

/**
 * Form helper text
 */
export const FORM_HELP = cn(
  "text-xs",
  "text-gray-500",
  "mt-1"
);

/**
 * Textarea
 */
export const FORM_TEXTAREA = cn(
  FORM_INPUT,
  "min-h-[100px]",
  "resize-vertical"
);

/**
 * Select dropdown
 */
export const FORM_SELECT = cn(
  FORM_INPUT,
  "appearance-none",
  "bg-no-repeat",
  "bg-right",
  "pr-10"
);

// ============================================================================
// BUTTON COMPONENTS
// ============================================================================

/**
 * Base button styles (apply to all buttons)
 */
export const BUTTON_BASE = cn(
  "inline-flex",
  "items-center",
  "justify-center",
  "gap-2",
  "rounded-lg",
  "font-montserrat-semibold",
  "transition-all duration-200",
  "focus:outline-none",
  "focus:ring-2",
  "focus:ring-offset-2",
  "disabled:opacity-50",
  "disabled:cursor-not-allowed",
  "disabled:pointer-events-none"
);

/**
 * Primary button
 */
export const BUTTON_PRIMARY = cn(
  BUTTON_BASE,
  "bg-primary",
  "text-white",
  "hover:bg-primary-700",
  "active:bg-primary-800",
  "focus:ring-primary-500"
);

/**
 * Secondary button
 */
export const BUTTON_SECONDARY = cn(
  BUTTON_BASE,
  "bg-gray-200",
  "text-gray-900",
  "hover:bg-gray-300",
  "active:bg-gray-400",
  "focus:ring-gray-400"
);

/**
 * Accent button
 */
export const BUTTON_ACCENT = cn(
  BUTTON_BASE,
  "bg-accent",
  "text-white",
  "hover:bg-accent-600",
  "active:bg-accent-700",
  "focus:ring-accent-500"
);

/**
 * Outline button
 */
export const BUTTON_OUTLINE = cn(
  BUTTON_BASE,
  "border-2 border-primary",
  "bg-transparent",
  "text-primary",
  "hover:bg-primary-50",
  "active:bg-primary-100",
  "focus:ring-primary-500"
);

/**
 * Ghost button
 */
export const BUTTON_GHOST = cn(
  BUTTON_BASE,
  "bg-transparent",
  "text-gray-700",
  "hover:bg-gray-100",
  "active:bg-gray-200",
  "focus:ring-gray-400"
);

/**
 * Danger/destructive button
 */
export const BUTTON_DANGER = cn(
  BUTTON_BASE,
  "bg-red-600",
  "text-white",
  "hover:bg-red-700",
  "active:bg-red-800",
  "focus:ring-red-500"
);

/**
 * Success button
 */
export const BUTTON_SUCCESS = cn(
  BUTTON_BASE,
  "bg-green-600",
  "text-white",
  "hover:bg-green-700",
  "active:bg-green-800",
  "focus:ring-green-500"
);

// Button sizes
export const BUTTON_SM = "px-3 py-1.5 text-sm";
export const BUTTON_MD = "px-4 py-2 text-base";
export const BUTTON_LG = "px-6 py-3 text-lg";
export const BUTTON_XL = "px-8 py-4 text-xl";

// ============================================================================
// BADGE/PILL COMPONENTS
// ============================================================================

/**
 * Base badge styles
 */
export const BADGE_BASE = cn(
  "inline-flex",
  "items-center",
  "gap-1",
  "font-montserrat-semibold",
  "rounded-full"
);

/**
 * Badge variants with colors
 */
export const BADGE_PRIMARY = cn(
  BADGE_BASE,
  "bg-primary-100",
  "text-primary-700",
  "border border-primary-200"
);

export const BADGE_SECONDARY = cn(
  BADGE_BASE,
  "bg-gray-100",
  "text-gray-700",
  "border border-gray-200"
);

export const BADGE_SUCCESS = cn(
  BADGE_BASE,
  "bg-green-100",
  "text-green-700",
  "border border-green-200"
);

export const BADGE_WARNING = cn(
  BADGE_BASE,
  "bg-yellow-100",
  "text-yellow-700",
  "border border-yellow-200"
);

export const BADGE_ERROR = cn(
  BADGE_BASE,
  "bg-red-100",
  "text-red-700",
  "border border-red-200"
);

export const BADGE_INFO = cn(
  BADGE_BASE,
  "bg-primary-100",
  "text-primary-700",
  "border border-primary-200"
);

// Badge sizes
export const BADGE_SM = "px-2 py-0.5 text-xs";
export const BADGE_MD = "px-2.5 py-1 text-sm";
export const BADGE_LG = "px-3 py-1.5 text-base";

// ============================================================================
// TYPOGRAPHY
// ============================================================================

/**
 * Heading styles
 */
export const HEADING_1 = cn(
  "text-4xl md:text-5xl",
  "font-montserrat-bold",
  "text-gray-900",
  "leading-tight"
);

export const HEADING_2 = cn(
  "text-3xl md:text-4xl",
  "font-montserrat-bold",
  "text-gray-900",
  "leading-tight"
);

export const HEADING_3 = cn(
  "text-2xl md:text-3xl",
  "font-montserrat-semibold",
  "text-gray-900",
  "leading-snug"
);

export const HEADING_4 = cn(
  "text-xl md:text-2xl",
  "font-montserrat-semibold",
  "text-gray-900",
  "leading-snug"
);

export const HEADING_5 = cn(
  "text-lg md:text-xl",
  "font-montserrat-semibold",
  "text-gray-900"
);

export const HEADING_6 = cn(
  "text-base md:text-lg",
  "font-montserrat-semibold",
  "text-gray-900"
);

/**
 * Body text styles
 */
export const TEXT_BODY = cn(
  "text-base",
  "text-gray-600",
  "leading-relaxed"
);

export const TEXT_BODY_SM = cn(
  "text-sm",
  "text-gray-600",
  "leading-relaxed"
);

export const TEXT_MUTED = cn(
  "text-sm",
  "text-gray-500",
  "leading-relaxed"
);

export const TEXT_SMALL = cn(
  "text-xs",
  "text-gray-500"
);

// ============================================================================
// FLEX/GRID LAYOUTS
// ============================================================================

/**
 * Flex row with centered items
 */
export const FLEX_ROW_CENTER = cn(
  "flex",
  "flex-row",
  "items-center"
);

/**
 * Flex row with space between
 */
export const FLEX_ROW_BETWEEN = cn(
  "flex",
  "flex-row",
  "items-center",
  "justify-between"
);

/**
 * Flex column
 */
export const FLEX_COL = cn(
  "flex",
  "flex-col"
);

/**
 * Flex column with centered items
 */
export const FLEX_COL_CENTER = cn(
  "flex",
  "flex-col",
  "items-center"
);

/**
 * Center content both ways
 */
export const FLEX_CENTER = cn(
  "flex",
  "items-center",
  "justify-center"
);

/**
 * Grid responsive (1-2-3 columns)
 */
export const GRID_RESPONSIVE = cn(
  "grid",
  "grid-cols-1",
  "md:grid-cols-2",
  "lg:grid-cols-3",
  GAP.responsive
);

/**
 * Grid two columns
 */
export const GRID_2_COLS = cn(
  "grid",
  "grid-cols-2",
);

/**
 * Grid four columns
 */
export const GRID_4_COLS = cn(
  "grid",
  "grid-cols-2",
  "lg:grid-cols-4"
);

// ============================================================================
// UTILITY CLASSES
// ============================================================================

/**
 * Truncate text with ellipsis
 */
export const TEXT_TRUNCATE = cn(
  "overflow-hidden",
  "text-ellipsis",
  "whitespace-nowrap"
);

/**
 * Line clamp (2 lines)
 */
export const LINE_CLAMP_2 = cn(
  "line-clamp-2"
);

/**
 * Line clamp (3 lines)
 */
export const LINE_CLAMP_3 = cn(
  "line-clamp-3"
);

/**
 * Screen reader only (accessible but invisible)
 */
export const SR_ONLY = cn(
  "sr-only"
);

/**
 * Focus ring for accessibility
 */
export const FOCUS_RING = cn(
  "focus:outline-none",
  "focus:ring-2",
  "focus:ring-primary-500",
  "focus:ring-offset-2"
);

/**
 * Smooth transitions
 */
export const TRANSITION = cn(
  "transition-all",
  "duration-200",
  "ease-in-out"
);

/**
 * Hover lift effect
 */
export const HOVER_LIFT = cn(
  TRANSITION,
  "hover:-translate-y-1",
  "hover:shadow-lg"
);

/**
 * Hover scale effect
 */
export const HOVER_SCALE = cn(
  TRANSITION,
  "hover:scale-105"
);

// ============================================================================
// DASHBOARD ICONS
// ============================================================================

/**
 * Dashboard stat card icon container (with responsive sizing)
 * Used for icon badges in stat cards and dashboards
 */
export const DASHBOARD_STAT_ICON_CONTAINER = cn(
  "w-8 h-8 p-1.5",
  "md:w-12 md:h-12",
  "rounded-full",
  "bg-primary-50",
  FLEX_CENTER
);

/**
 * Dashboard stat card icon (with responsive sizing)
 * Applied to the icon element itself inside the container
 */
export const DASHBOARD_STAT_ICON = cn(
  "w-5 h-5",
  "md:w-6 md:h-6",
  "text-primary-600"
);

/**
 * Dashboard detail icon container (smaller variant)
 * Used for info rows in organization/detail cards
 */
export const DASHBOARD_DETAIL_ICON_CONTAINER = cn(
  "w-8 h-8",
  "rounded-full",
  "bg-primary-50",
  FLEX_CENTER,
  "flex-shrink-0"
);

/**
 * Dashboard detail icon (smaller variant)
 * Applied to the icon element itself
 */
export const DASHBOARD_DETAIL_ICON = cn(
  "w-4 h-4",
  "text-primary-600"
);

/**
 * Organization card large icon container
 * Used for org/user profile icons in card headers
 */
export const ORG_ICON_CONTAINER_LG = cn(
  "w-12 h-12",
  "md:w-14 md:h-14",
  "rounded-full",
  "bg-primary-600",
  FLEX_CENTER,
  "flex-shrink-0"
);

/**
 * Organization card large icon
 * Applied to the icon element itself
 */
export const ORG_ICON_LG = cn(
  "w-6 h-6",
  "md:w-7 md:h-7",
  "text-white"
);

// ============================================================================
// MODAL/DIALOG
// ============================================================================

/**
 * Modal overlay
 */
export const MODAL_OVERLAY = cn(
  "fixed inset-0",
  "bg-black/50",
  "backdrop-blur-sm",
  "z-50"
);

/**
 * Modal content container
 */
export const MODAL_CONTENT = cn(
  "fixed",
  "top-1/2 left-1/2",
  "transform -translate-x-1/2 -translate-y-1/2",
  "bg-white",
  "rounded-lg",
  "shadow-2xl",
  "max-w-2xl",
  "w-full",
  "max-h-[90vh]",
  "overflow-y-auto",
  "z-50"
);

/**
 * Modal header
 */
export const MODAL_HEADER = cn(
  "flex items-center justify-between",
  "p-6",
  "border-b border-gray-200"
);

/**
 * Modal body
 */
export const MODAL_BODY = cn(
  "p-6"
);

/**
 * Modal footer
 */
export const MODAL_FOOTER = cn(
  "flex items-center justify-end gap-3",
  "p-6",
  "border-t border-gray-200"
);

// ============================================================================
// STATUS BADGES
// ============================================================================

/**
 * Status badge variants
 */
export const STATUS_CONFIRMED = cn(
  BADGE_BASE,
  "bg-green-100",
  "text-green-700",
  "border border-green-200",
  BADGE_MD
);

export const STATUS_PENDING = cn(
  BADGE_BASE,
  "bg-yellow-100",
  "text-yellow-700",
  "border border-yellow-200",
  BADGE_MD
);

export const STATUS_IN_PROGRESS = cn(
  BADGE_BASE,
  "bg-primary-100",
  "text-primary-700",
  "border border-primary-200",
  BADGE_MD
);

export const STATUS_COMPLETED = cn(
  BADGE_BASE,
  "bg-green-100",
  "text-green-700",
  "border border-green-200",
  BADGE_MD
);

export const STATUS_CANCELLED = cn(
  BADGE_BASE,
  "bg-red-100",
  "text-red-700",
  "border border-red-200",
  BADGE_MD
);

// ============================================================================
// LOADING STATES
// ============================================================================

/**
 * Loading spinner container
 */
export const LOADING_CONTAINER = cn(
  "flex items-center justify-center",
  "min-h-[200px]"
);

/**
 * Loading spinner
 */
export const LOADING_SPINNER = cn(
  "animate-spin",
  "rounded-full",
  "border-4",
  "border-gray-200",
  "border-t-primary",
  "w-12 h-12"
);

/**
 * Skeleton loader
 */
export const SKELETON = cn(
  "animate-pulse",
  "bg-gray-200",
  "rounded"
);

// ============================================================================
// EMPTY STATES
// ============================================================================

/**
 * Empty state container
 */
export const EMPTY_STATE = cn(
  "flex flex-col items-center justify-center",
  "py-12",
  "text-center"
);

/**
 * Empty state icon
 */
export const EMPTY_STATE_ICON = cn(
  "w-16 h-16",
  "text-gray-400",
  "mb-4"
);

/**
 * Empty state text
 */
export const EMPTY_STATE_TEXT = cn(
  "text-gray-500",
  "max-w-md"
);

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Get status badge class based on status string
 */
export function getStatusBadgeClass(status: string): string {
  const statusMap: Record<string, string> = {
    'confirmed': STATUS_CONFIRMED,
    'pending': STATUS_PENDING,
    'inProgress': STATUS_IN_PROGRESS,
    'in-progress': STATUS_IN_PROGRESS,
    'completed': STATUS_COMPLETED,
    'cancelled': STATUS_CANCELLED,
    'rejected': STATUS_CANCELLED,
    'approved': STATUS_CONFIRMED,
  };
  
  return statusMap[status.toLowerCase()] || STATUS_PENDING;
}

/**
 * Get button class based on variant and size
 */
export function getButtonClass(
  variant: 'primary' | 'secondary' | 'accent' | 'outline' | 'ghost' | 'danger' | 'success' = 'primary',
  size: 'sm' | 'md' | 'lg' | 'xl' = 'md'
): string {
  const variantMap = {
    primary: BUTTON_PRIMARY,
    secondary: BUTTON_SECONDARY,
    accent: BUTTON_ACCENT,
    outline: BUTTON_OUTLINE,
    ghost: BUTTON_GHOST,
    danger: BUTTON_DANGER,
    success: BUTTON_SUCCESS,
  };
  
  const sizeMap = {
    sm: BUTTON_SM,
    md: BUTTON_MD,
    lg: BUTTON_LG,
    xl: BUTTON_XL,
  };
  
  return cn(variantMap[variant], sizeMap[size]);
}

/**
 * Get badge class based on variant and size
 */
export function getBadgeClass(
  variant: 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'info' = 'primary',
  size: 'sm' | 'md' | 'lg' = 'md'
): string {
  const variantMap = {
    primary: BADGE_PRIMARY,
    secondary: BADGE_SECONDARY,
    success: BADGE_SUCCESS,
    warning: BADGE_WARNING,
    error: BADGE_ERROR,
    info: BADGE_INFO,
  };
  
  const sizeMap = {
    sm: BADGE_SM,
    md: BADGE_MD,
    lg: BADGE_LG,
  };
  
  return cn(variantMap[variant], sizeMap[size]);
}
