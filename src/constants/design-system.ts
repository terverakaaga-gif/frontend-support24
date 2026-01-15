/**
 * Design System Constants
 * 
 * This file contains all standardized design tokens for consistent UI/UX across the application.
 * Use these constants instead of arbitrary Tailwind classes to maintain consistency.
 */

// ============================================================================
// SPACING SYSTEM
// ============================================================================

/**
 * Standard spacing scale based on 4px base unit
 * Use these for padding, margin, gaps, etc.
 */
export const SPACING = {
  /** 0px - No space */
  none: '0',
  /** 4px - Extra small spacing */
  xs: '1',
  /** 8px - Small spacing */
  sm: '2',
  /** 12px - Medium spacing */
  md: '3',
  /** 16px - Base spacing (most common) */
  base: '4',
  /** 20px - Large spacing */
  lg: '5',
  /** 24px - Extra large spacing */
  xl: '6',
  /** 32px - 2XL spacing */
  '2xl': '8',
  /** 40px - 3XL spacing */
  '3xl': '10',
  /** 48px - 4XL spacing */
  '4xl': '12',
  /** 64px - 5XL spacing */
  '5xl': '16',
  /** 80px - 6XL spacing */
  '6xl': '20',
  /** 96px - 7XL spacing */
  '7xl': '24',
} as const;

/**
 * Container/Section padding presets
 */
export const CONTAINER_PADDING = {
  /** Padding for mobile screens */
  mobile: 'px-4 py-4',
  /** Padding for tablet screens */
  tablet: 'px-6 py-6',
  /** Padding for desktop screens */
  desktop: 'px-8 py-8',
  /** Responsive padding that adapts to screen size */
  responsive: 'px-4 py-4 sm:px-6 sm:py-6 lg:px-8 lg:py-8',
  /** Card/component padding */
  card: 'p-6',
  /** Small card padding */
  cardSm: 'p-4',
  /** Large card padding */
  cardLg: 'p-8',
} as const;

/**
 * Gap spacing for flex/grid layouts
 */
export const GAP = {
  xs: 'gap-1',
  sm: 'gap-2',
  md: 'gap-3',
  base: 'gap-4',
  lg: 'gap-6',
  xl: 'gap-8',
  '2xl': 'gap-10',
  responsive: 'gap-1 md:gap-2 lg:gap-6 xl:gap-8',
} as const;

// ============================================================================
// BORDER RADIUS SYSTEM
// ============================================================================

/**
 * Border radius scale for consistent rounded corners
 */
export const RADIUS = {
  /** 0px - No rounding */
  none: 'rounded-none',
  /** 2px - Subtle rounding */
  xs: 'rounded-sm',
  /** 4px - Small rounding */
  sm: 'rounded',
  /** 6px - Medium rounding (default for cards) */
  md: 'rounded-md',
  /** 8px - Large rounding */
  lg: 'rounded-lg',
  /** 12px - Extra large rounding */
  xl: 'rounded-xl',
  /** 16px - 2XL rounding */
  '2xl': 'rounded-2xl',
  /** 24px - 3XL rounding */
  '3xl': 'rounded-3xl',
  /** 9999px - Full rounding (pills/circles) */
  full: 'rounded-full',
} as const;

// ============================================================================
// BORDER SYSTEM
// ============================================================================

/**
 * Border width scale
 */
export const BORDER_WIDTH = {
  none: 'border-0',
  thin: 'border',
  medium: 'border-2',
  thick: 'border-4',
} as const;

/**
 * Common border styles
 */
export const BORDER_STYLES = {
  /** No border */
  none: 'border-0',
  /** Standard border with default color */
  default: 'border border-border',
  /** Subtle border with lighter color */
  subtle: 'border border-gray-200',
  /** Medium emphasis border */
  medium: 'border-2 border-border',
  /** Strong border */
  strong: 'border-2 border-gray-300',
  /** Primary colored border */
  primary: 'border border-primary',
  /** Accent colored border */
  accent: 'border border-accent',
  /** Muted border */
  muted: 'border border-muted',
} as const;

// ============================================================================
// SHADOW SYSTEM
// ============================================================================

/**
 * Shadow scale for depth and elevation
 */
export const SHADOW = {
  /** No shadow */
  none: 'shadow-none',
  /** Subtle shadow for slight elevation */
  sm: 'shadow-sm',
  /** Standard shadow for cards */
  md: 'shadow-md',
  /** Strong shadow for modals */
  lg: 'shadow-lg',
  /** Extra strong shadow */
  xl: 'shadow-xl',
  /** Maximum shadow */
  '2xl': 'shadow-2xl',
  /** Inner shadow */
  inner: 'shadow-inner',
} as const;

// ============================================================================
// TYPOGRAPHY SYSTEM
// ============================================================================

/**
 * Font size scale with line heights
 */
export const TEXT_SIZE = {
  /** 10px - Extra small */
  xs: 'text-xs',
  /** 12px - Small */
  sm: 'text-sm',
  /** 14px - Base size */
  base: 'text-base',
  /** 16px - Large */
  lg: 'text-lg',
  /** 18px - Extra large */
  xl: 'text-xl',
  /** 20px - 2XL */
  '2xl': 'text-2xl',
  /** 24px - 3XL */
  '3xl': 'text-3xl',
  /** 30px - 4XL */
  '4xl': 'text-4xl',
  /** 36px - 5XL */
  '5xl': 'text-5xl',
  /** 48px - 6XL */
  '6xl': 'text-6xl',
} as const;

/**
 * Font weight scale
 */
export const FONT_WEIGHT = {
  normal: 'font-normal',
  medium: 'font-medium',
  semibold: 'font-semibold',
  bold: 'font-bold',
} as const;

/**
 * Montserrat font family variants
 */
export const FONT_FAMILY = {
  sans: 'font-sans',
  montserrat: 'font-montserrat',
  montserratMedium: 'font-montserrat-medium',
  montserratSemibold: 'font-montserrat-semibold',
  montserratBold: 'font-montserrat-bold',
} as const;

/**
 * Common heading styles
 */
export const HEADING_STYLES = {
  h1: 'text-4xl md:text-5xl font-montserrat-bold text-gray-900',
  h2: 'text-3xl md:text-4xl font-montserrat-bold text-gray-900',
  h3: 'text-2xl md:text-3xl font-montserrat-semibold text-gray-900',
  h4: 'text-xl md:text-2xl font-montserrat-semibold text-gray-900',
  h5: 'text-lg md:text-xl font-montserrat-semibold text-gray-900',
  h6: 'text-base md:text-lg font-montserrat-semibold text-gray-900',
} as const;

/**
 * Common text styles
 */
export const TEXT_STYLES = {
  /** Body text - primary */
  body: 'text-base text-gray-600',
  /** Body text - secondary/muted */
  bodySecondary: 'text-sm text-gray-500',
  /** Small text */
  small: 'text-sm text-gray-600',
  /** Extra small text */
  tiny: 'text-xs text-gray-500',
  /** Label text */
  label: 'text-sm font-montserrat-semibold text-gray-700',
  /** Caption text */
  caption: 'text-xs text-muted-foreground',
  /** Link text */
  link: 'text-primary hover:text-primary-700 underline',
} as const;

// ============================================================================
// COLOR SYSTEM
// ============================================================================

/**
 * Text color utilities
 */
export const TEXT_COLORS = {
  /** Primary text color (brand blue) */
  primary: 'text-primary-600',
  primaryHover: 'hover:text-primary-700',
  /** Secondary text color */
  secondary: 'text-secondary',
  secondaryHover: 'hover:text-secondary-foreground',
  /** Muted text color (light gray) */
  muted: 'text-muted-foreground',
  mutedHover: 'hover:text-gray-600',
  /** Disabled text color */
  disabled: 'text-disabled-text',
  /** Primary brand color */
  brand: 'text-primary-600',
  brandHover: 'hover:text-primary-700',
  /** Accent color (yellow/orange) */
  accent: 'text-accent-500',
  accentHover: 'hover:text-accent-600',
  /** White text */
  white: 'text-white',
  whiteHover: 'hover:text-gray-100',
  /** Success text (green) */
  success: 'text-success-600',
  successHover: 'hover:text-success-700',
  /** Warning text (amber) */
  warning: 'text-warning-600',
  warningHover: 'hover:text-warning-700',
  /** Error text (red) */
  error: 'text-error-600',
  errorHover: 'hover:text-error-700',
  /** Info text (blue) */
  info: 'text-info-600',
  infoHover: 'hover:text-info-700',

  // gray variants
  gray50: 'text-gray-50',
  gray100: 'text-gray-100',
  gray200: 'text-gray-200',
  gray300: 'text-gray-300',
  gray400: 'text-gray-400',
  gray500: 'text-gray-500',
  gray600: 'text-gray-600',
  gray700: 'text-gray-700',
  gray800: 'text-gray-800',
  gray900: 'text-gray-900',
} as const;

/**
 * Background color utilities
 */
export const BG_COLORS = {
  /** White background */
  white: 'bg-white',
  whiteHover: 'hover:bg-gray-50',
  /** Primary background (brand blue) */
  primary: 'bg-primary-600',
  primaryHover: 'hover:bg-primary-700',
  primaryLight: 'bg-primary-50',
  primaryLightHover: 'hover:bg-primary-100',
  /** Secondary background */
  secondary: 'bg-secondary',
  secondaryHover: 'hover:bg-secondary/80',
  /** Muted background */
  muted: 'bg-muted',
  mutedHover: 'hover:bg-muted/80',
  /** Brand color background */
  brand: 'bg-primary-600',
  brandHover: 'hover:bg-primary-700',
  /** Accent color background (yellow/orange) */
  accent: 'bg-accent-500',
  accentHover: 'hover:bg-accent-600',
  accentLight: 'bg-accent-50',
  accentLightHover: 'hover:bg-accent-100',
  /** Success background (green) */
  success: 'bg-success-600',
  successHover: 'hover:bg-success-700',
  successLight: 'bg-success-50',
  successLightHover: 'hover:bg-success-100',
  /** Warning background (amber) */
  warning: 'bg-warning-600',
  warningHover: 'hover:bg-warning-700',
  warningLight: 'bg-warning-50',
  warningLightHover: 'hover:bg-warning-100',
  /** Error background (red) */
  error: 'bg-error-600',
  errorHover: 'hover:bg-error-700',
  errorLight: 'bg-error-50',
  errorLightHover: 'hover:bg-error-100',
  /** Info background (blue) */
  info: 'bg-info-600',
  infoHover: 'hover:bg-info-700',
  infoLight: 'bg-info-50',
  infoLightHover: 'hover:bg-info-100',
  /** Disabled background */
  disabled: 'bg-disabled-bg',
  disabledHover: 'hover:bg-gray-200',

  // gray variants
  gray50: 'bg-gray-50',
  gray100: 'bg-gray-100',
  gray200: 'bg-gray-200',
  gray300: 'bg-gray-300',
  gray400: 'bg-gray-400',
  gray500: 'bg-gray-500',
  gray600: 'bg-gray-600',
  gray700: 'bg-gray-700',
  gray800: 'bg-gray-800',
  gray900: 'bg-gray-900',
} as const;

// ============================================================================
// BUTTON STYLES
// ============================================================================

/**
 * Button size variants
 */
export const BUTTON_SIZES = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-4 py-2 text-base',
  lg: 'px-6 py-3 text-lg',
  xl: 'px-8 py-4 text-xl',
} as const;

/**
 * Button variant styles
 */
export const BUTTON_VARIANTS = {
  primary: 'bg-primary text-white hover:bg-primary-700 active:bg-primary-800 focus:ring-2 focus:ring-primary-500',
  secondary: 'bg-gray-200 text-gray-900 hover:bg-gray-300 active:bg-gray-400 focus:ring-2 focus:ring-gray-400',
  accent: 'bg-accent text-white hover:bg-accent-600 active:bg-accent-700 focus:ring-2 focus:ring-accent-500',
  outline: 'border-2 border-primary bg-transparent text-primary hover:bg-primary-50 active:bg-primary-100',
  ghost: 'bg-transparent text-gray-700 hover:bg-gray-100 active:bg-gray-200',
  danger: 'bg-red-600 text-white hover:bg-red-700 active:bg-red-800 focus:ring-2 focus:ring-red-500',
  success: 'bg-green-600 text-white hover:bg-green-700 active:bg-green-800 focus:ring-2 focus:ring-green-500',
} as const;

/**
 * Common button base classes
 */
export const BUTTON_BASE = 'inline-flex items-center justify-center rounded-lg font-montserrat-semibold transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none';

// ============================================================================
// CARD STYLES
// ============================================================================

/**
 * Card variants
 */
export const CARD_VARIANTS = {
  /** Standard elevated card */
  default: `bg-white rounded-lg border border-gray-200 ${SHADOW.md}`,
  /** Flat card without shadow */
  flat: 'bg-white rounded-lg border border-gray-200',
  /** Outlined card */
  outlined: 'bg-white rounded-lg border-2 border-gray-300',
  /** Interactive card with hover effect */
  interactive: `bg-white rounded-lg border border-gray-200 ${SHADOW.md} hover:shadow-lg hover:border-primary-300 transition-all duration-200 cursor-pointer`,
  /** Subtle card */
  subtle: 'bg-gray-50 rounded-lg border border-gray-100',
} as const;

// ============================================================================
// INPUT STYLES
// ============================================================================

/**
 * Input field variants
 */
export const INPUT_VARIANTS = {
  default: 'w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white text-gray-900 placeholder-gray-400',
  error: 'w-full px-4 py-2 border border-red-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent bg-white text-gray-900 placeholder-gray-400',
  success: 'w-full px-4 py-2 border border-green-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white text-gray-900 placeholder-gray-400',
  disabled: 'w-full px-4 py-2 border border-gray-200 rounded-lg bg-gray-100 text-gray-500 placeholder-gray-400 cursor-not-allowed',
} as const;

// ============================================================================
// BADGE/PILL STYLES
// ============================================================================

/**
 * Badge size variants
 */
export const BADGE_SIZES = {
  sm: 'px-2 py-0.5 text-xs',
  md: 'px-2.5 py-1 text-sm',
  lg: 'px-3 py-1.5 text-base',
} as const;

/**
 * Badge color variants
 */
export const BADGE_VARIANTS = {
  primary: 'bg-primary-100 text-primary-700 border border-primary-200',
  secondary: 'bg-gray-100 text-gray-700 border border-gray-200',
  success: 'bg-green-100 text-green-700 border border-green-200',
  warning: 'bg-yellow-100 text-yellow-700 border border-yellow-200',
  error: 'bg-red-100 text-red-700 border border-red-200',
  info: 'bg-blue-100 text-blue-700 border border-blue-200',
  accent: 'bg-accent-100 text-accent-700 border border-accent-200',
} as const;

/**
 * Common badge base classes
 */
export const BADGE_BASE = 'inline-flex items-center font-montserrat-semibold rounded-full';

// ============================================================================
// STATUS COLORS
// ============================================================================

/**
 * Status colors for various states
 */
export const STATUS_COLORS = {
  confirmed: {
    bg: 'bg-green-100',
    text: 'text-green-700',
    border: 'border-green-200',
    badge: 'bg-green-100 text-green-700 border border-green-200',
  },
  pending: {
    bg: 'bg-yellow-100',
    text: 'text-yellow-700',
    border: 'border-yellow-200',
    badge: 'bg-yellow-100 text-yellow-700 border border-yellow-200',
  },
  inProgress: {
    bg: 'bg-blue-100',
    text: 'text-blue-700',
    border: 'border-blue-200',
    badge: 'bg-blue-100 text-blue-700 border border-blue-200',
  },
  completed: {
    bg: 'bg-green-100',
    text: 'text-green-700',
    border: 'border-green-200',
    badge: 'bg-green-100 text-green-700 border border-green-200',
  },
  cancelled: {
    bg: 'bg-red-100',
    text: 'text-red-700',
    border: 'border-red-200',
    badge: 'bg-red-100 text-red-700 border border-red-200',
  },
  rejected: {
    bg: 'bg-red-100',
    text: 'text-red-700',
    border: 'border-red-200',
    badge: 'bg-red-100 text-red-700 border border-red-200',
  },
  approved: {
    bg: 'bg-green-100',
    text: 'text-green-700',
    border: 'border-green-200',
    badge: 'bg-green-100 text-green-700 border border-green-200',
  },
} as const;

// ============================================================================
// TRANSITIONS & ANIMATIONS
// ============================================================================

/**
 * Transition duration scale
 */
export const TRANSITION_DURATION = {
  fast: 'duration-150',
  normal: 'duration-200',
  slow: 'duration-300',
  slower: 'duration-500',
} as const;

/**
 * Common transition effects
 */
export const TRANSITIONS = {
  all: 'transition-all duration-200',
  colors: 'transition-colors duration-200',
  transform: 'transition-transform duration-200',
  opacity: 'transition-opacity duration-200',
  shadow: 'transition-shadow duration-200',
} as const;

/**
 * Common hover effects
 */
export const HOVER_EFFECTS = {
  lift: 'hover:transform hover:-translate-y-1 hover:shadow-lg transition-all duration-200',
  scale: 'hover:scale-105 transition-transform duration-200',
  brightness: 'hover:brightness-110 transition-all duration-200',
  opacity: 'hover:opacity-80 transition-opacity duration-200',
} as const;

// ============================================================================
// LAYOUT UTILITIES
// ============================================================================

/**
 * Common flex layouts
 */
export const FLEX_LAYOUTS = {
  /** Horizontal layout with items centered */
  rowCenter: 'flex flex-row items-center',
  /** Horizontal layout with items centered and space between */
  rowBetween: 'flex flex-row items-center justify-between',
  /** Horizontal layout with items at start */
  rowStart: 'flex flex-row items-start',
  /** Vertical layout with items centered */
  colCenter: 'flex flex-col items-center',
  /** Vertical layout with items at start */
  colStart: 'flex flex-col items-start',
  /** Center both horizontally and vertically */
  center: 'flex items-center justify-center',
  /** Column on mobile, row on md+ */
  colToRow: 'flex flex-col md:flex-row md:items-center md:justify-between',
  /** Flex row with wrapping */
  rowWrap: 'flex flex-wrap items-center',
} as const;

/**
 * Common grid layouts
 */
export const GRID_LAYOUTS = {
  /** Responsive 1-2-3 column grid */
  responsive: 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
  /** Responsive 1-2-4 column grid */
  responsive4: 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4',
  /** Two column grid */
  twoCol: 'grid grid-cols-1 md:grid-cols-2',
  /** Three column grid */
  threeCol: 'grid grid-cols-1 md:grid-cols-3',
  /** Four column grid */
  fourCol: 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4',
  /** Alias: cols2 = twoCol */
  cols2: 'grid grid-cols-1 md:grid-cols-2',
  /** Alias: cols3 = threeCol */
  cols3: 'grid grid-cols-1 md:grid-cols-3',
  /** Alias: cols4 = fourCol */
  cols4: 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4',
} as const;

// ============================================================================
// ICON SIZES
// ============================================================================

/**
 * Icon size scale
 */
export const ICON_SIZES = {
  xs: 'w-3 h-3',
  sm: 'w-4 h-4',
  md: 'w-5 h-5',
  lg: 'w-6 h-6',
  xl: 'w-8 h-8',
  '2xl': 'w-10 h-10',
  '3xl': 'w-12 h-12',
  '4xl': 'w-16 h-16',
} as const;

// ============================================================================
// Z-INDEX SCALE
// ============================================================================

/**
 * Z-index layers for proper stacking
 */
export const Z_INDEX = {
  dropdown: 'z-10',
  sticky: 'z-20',
  fixed: 'z-30',
  overlay: 'z-40',
  modal: 'z-50',
  popover: 'z-60',
  toast: 'z-70',
  tooltip: 'z-80',
} as const;

// ============================================================================
// RESPONSIVE BREAKPOINTS (for reference)
// ============================================================================

/**
 * Responsive breakpoints reference
 * Use with Tailwind's responsive prefixes (sm:, md:, lg:, xl:, 2xl:)
 */
export const BREAKPOINTS = {
  xs: '320px',   // Extra small devices
  sm: '412px',   // Small devices (phones)
  md: '768px',   // Medium devices (tablets)
  lg: '1024px',  // Large devices (small laptops)
  xl: '1280px',  // Extra large devices (desktops)
  '2xl': '1536px', // 2X large devices (large desktops)
} as const;

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Combine multiple class strings (helper for dynamic classes)
 */
export function combineClasses(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(' ');
}

/**
 * Get status color configuration
 */
export function getStatusConfig(status: keyof typeof STATUS_COLORS) {
  return STATUS_COLORS[status] || STATUS_COLORS.pending;
}
