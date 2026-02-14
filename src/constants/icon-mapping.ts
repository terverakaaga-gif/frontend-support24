/**
 * Icon Mapping: Lucide to Solar Icons
 * 
 * This file provides a mapping reference for migrating from Lucide React icons
 * to Solar Icons. Use this as a quick reference during migration.
 * 
 * @see ICON_MIGRATION_GUIDE.md for complete migration instructions
 */

import { CheckCircle } from "@solar-icons/react";

export const ICON_MAPPING = {
  // Navigation & Directional
  ArrowLeft: 'AltArrowLeft',
  ArrowRight: 'AltArrowRight',
  ChevronLeft: 'AltArrowLeft',
  ChevronRight: 'AltArrowRight', 
  ChevronDown: 'AltArrowDown',
  ChevronUp: 'AltArrowUp',

  // User & People
  User: 'User',
  Users: 'UsersGroupRounded',
  UserCog: 'UserCheck',

  // Status & Feedback
  Check: 'CheckIcon',
  CheckCircle: 'CheckIcon',
  AlertCircle: 'DangerCircle',
  AlertTriangle: 'DangerTriangle',
  XCircle: 'CloseCircle',
  X: 'CloseIcon',
  Info: 'InfoCircle',

  // Communication
  Mail: 'Letter',
  Phone: 'Phone',
  MessageSquare: 'ChatRound',
  MessageCircle: 'ChatRound',
  Send: 'Plain2',

  // Date & Time
  Calendar: 'Calendar',
  CalendarIcon: 'Calendar',
  Clock: 'Clock',

  // Location
  MapPin: 'MapPoint',

  // Files & Documents
  FileText: 'FileText',
  Upload: 'Upload',
  Download: 'Download',
  FileSpreadsheet: 'DocumentText',

  // Actions
  Plus: 'AddIcon',
  Minus: 'MinusIcon',
  Search: 'Magnifer', // Note: Solar uses 'Magnifer' spelling
  Filter: 'Filter',
  RefreshCw: 'Refresh',
  Edit: 'Pen',
  Trash2: 'TrashBinTrash',
  ExternalLink: 'LinkRoundAngle',

  // View & Display
  Eye: 'Eye',
  EyeOff: 'EyeClosed',
  List: 'List',

  // Media & UI
  Camera: 'Camera',
  Shield: 'ShieldCheck',
  ShieldCheck: 'ShieldCheck',
  Star: 'Star',
  Heart: 'Heart', // or HeartAngle

  // Charts & Analytics
  TrendingUp: 'TrendUp',
  TrendingDown: 'TrendDown',
  BarChart3: 'ChartSquare',
  DollarSign: 'DollarCircle',

  // Organization
  Settings2: 'Settings',
  Headset: 'Headphones',
  BadgeCheck: 'ShieldCheck', // or VerifiedCheck
  Flag2: 'Flag',
  Repeat: 'Repeat',

  // Loading & Interaction
  Loader2: 'Refresh', // Use with animate-spin
  Loader2Icon: 'Refresh',
  BellRing: 'Bell',
  Bell: 'Bell',

  // Misc
  Circle: 'Circle',
  Dot: 'CUSTOM', // Use DotIcon from @/components/icons
  MoreHorizontal: 'MenuDots',
  GripVertical: 'CUSTOM', // Use GripVerticalIcon from @/components/icons
  PanelLeft: 'SidebarMinimalistic',
  ClipboardCheck: 'ClipboardCheck',
} as const;

/**
 * Helper function to get Solar icon name from Lucide icon name
 * @param lucideIconName - The name of the Lucide icon
 * @returns The corresponding Solar icon name or 'CUSTOM' if custom implementation needed
 */
export const getSolarIconName = (lucideIconName: string): string => {
  return ICON_MAPPING[lucideIconName as keyof typeof ICON_MAPPING] || lucideIconName;
};

/**
 * Icons that need custom SVG implementations (not available in Solar)
 */
export const CUSTOM_ICONS = ['Dot', 'GripVertical'] as const;

/**
 * Icons that have direct 1:1 mapping (same name in both libraries)
 */
export const DIRECT_MAPPING = [
  'User',
  'Phone',
  'Calendar',
  'Clock',
  'FileText',
  'Upload',
  'Download',
  'Minus',
  'Filter',
  'Edit',
  'Eye',
  'List',
  'Camera',
  'ShieldCheck',
  'Star',
  'Flag',
  'Repeat',
  'Bell',
  'Circle',
  'ClipboardCheck',
  'Send',
] as const;
