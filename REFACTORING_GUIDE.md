# Design System Refactoring Guide

## Overview
This document provides a comprehensive guide for refactoring React components and pages to use consolidated design constants and utility functions from `design-system.ts` and `design-utils.ts` instead of raw Tailwind CSS classes.

---

## ✅ Completed Refactoring

### Auth Pages (Phase 1)
- ✅ **Login.tsx** - Full refactor with design constants
- ✅ **Register.tsx** - Full refactor with design constants  
- ✅ **ForgotPassword.tsx** - Full refactor with design constants
- ✅ **OTPVerification.tsx** (Component) - Full refactor with design constants

---

## Common Tailwind to Design Constants Mapping

### Layout & Positioning

#### Before (Raw Tailwind)
```tsx
<div className="flex items-center justify-between gap-4">
  <div className="flex flex-col gap-6">
```

#### After (Design Constants)
```tsx
import { FLEX_ROW_BETWEEN, FLEX_COL_CENTER, GAP } from "@/lib/design-utils";

<div className={cn(FLEX_ROW_BETWEEN, GAP.base)}>
  <div className={cn(FLEX_COL_CENTER, GAP.lg)}>
```

### Common Layout Utilities
- `FLEX_ROW_CENTER` = `flex flex-row items-center`
- `FLEX_ROW_BETWEEN` = `flex flex-row items-center justify-between`
- `FLEX_COL_CENTER` = `flex flex-col items-center`
- `FLEX_CENTER` = `flex items-center justify-center`
- `GRID_2_COLS` = `grid grid-cols-1 md:grid-cols-2`
- `GRID_4_COLS` = `grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4`
- `GRID_RESPONSIVE` = `grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3`

---

## Typography

### Before
```tsx
<h1 className="text-3xl font-montserrat-bold text-gray-900">Title</h1>
<p className="text-sm text-gray-600">Description</p>
<span className="text-xs text-gray-500">Caption</span>
```

### After
```tsx
import { TEXT_SIZE, TEXT_COLORS, FONT_WEIGHT, HEADING_STYLES, TEXT_STYLES } from "@/constants/design-system";

<h1 className={cn(HEADING_STYLES.h1)}>Title</h1>
{/* OR */}
<h1 className={cn(TEXT_SIZE["3xl"], FONT_WEIGHT.bold, TEXT_COLORS.gray900)}>Title</h1>

<p className={cn(TEXT_SIZE.sm, TEXT_COLORS.gray600)}>Description</p>
<span className={cn(TEXT_SIZE.xs, TEXT_COLORS.gray500)}>Caption</span>

{/* Predefined styles */}
<p className={TEXT_STYLES.body}>Body text</p>
<p className={TEXT_STYLES.small}>Small text</p>
<span className={TEXT_STYLES.caption}>Caption</span>
```

### Available Constants
- **TEXT_SIZE**: `xs`, `sm`, `base`, `lg`, `xl`, `2xl`, `3xl`, `4xl`, `5xl`, `6xl`
- **TEXT_COLORS**: `primary`, `secondary`, `muted`, `gray900`, `gray600`, `gray500`, etc.
- **FONT_WEIGHT**: `normal`, `medium`, `semibold`, `bold`
- **FONT_FAMILY**: `sans`, `montserrat`, `montserratMedium`, `montserratSemibold`, `montserratBold`

---

## Colors

### Background Colors
```tsx
// Before
<div className="bg-gray-100 hover:bg-gray-200">

// After
import { BG_COLORS } from "@/constants/design-system";
<div className={cn(BG_COLORS.gray100, `hover:${BG_COLORS.gray200}`)}>
```

### Text Colors
```tsx
// Before
<p className="text-red-500 hover:text-red-600">Error text</p>

// After
import { TEXT_COLORS } from "@/constants/design-system";
<p className={cn(TEXT_COLORS.error, TEXT_COLORS.errorHover)}>Error text</p>
```

### Available Color Utilities
- `BG_COLORS`: `white`, `primary`, `primaryLight`, `secondary`, `accent`, `accentLight`, `success`, `successLight`, `warning`, `warningLight`, `error`, `errorLight`, `gray50-900`
- `TEXT_COLORS`: `primary`, `secondary`, `muted`, `accent`, `success`, `warning`, `error`, `info`, `gray50-900`, with hover variants

---

## Spacing

### Before
```tsx
<div className="px-4 py-6 mb-8 gap-4">
<div className="space-y-4">
```

### After
```tsx
import { SPACING, CONTAINER_PADDING, GAP } from "@/constants/design-system";

<div className={cn(`px-${SPACING.sm} py-${SPACING.lg}`, `mb-${SPACING['2xl']}`, `gap-${SPACING.base}`)}>
<div className={cn(`space-y-${SPACING.base}`)}>
```

### Spacing Scale
- `SPACING`: `none`, `xs` (4px), `sm` (8px), `md` (12px), `base` (16px), `lg` (20px), `xl` (24px), `2xl` (32px), `3xl` (40px), `4xl` (48px), `5xl` (64px), `6xl` (80px), `7xl` (96px)`
- `GAP`: Predefined gap utilities like `gap-1`, `gap-2`, `gap-3`, `gap-4`, `gap-6`, `gap-8`
- `CONTAINER_PADDING`: `mobile`, `tablet`, `desktop`, `responsive`, `card`, `cardSm`, `cardLg`

---

## Border Radius

### Before
```tsx
<div className="rounded-lg">
<div className="rounded-full">
```

### After
```tsx
import { RADIUS } from "@/constants/design-system";

<div className={RADIUS.lg}>
<div className={RADIUS.full}>
```

### Available Radius
- `RADIUS`: `none`, `xs`, `sm`, `md`, `lg`, `xl`, `2xl`, `3xl`, `full`

---

## Shadows

### Before
```tsx
<div className="shadow-md hover:shadow-lg">
```

### After
```tsx
import { SHADOW } from "@/constants/design-system";

<div className={cn(SHADOW.md, "hover:" + SHADOW.lg)}>
```

### Available Shadows
- `SHADOW`: `none`, `sm`, `md`, `lg`, `xl`, `2xl`, `inner`

---

## Borders

### Before
```tsx
<div className="border border-gray-200">
<div className="border-2 border-primary">
```

### After
```tsx
import { BORDER_STYLES, BORDER_WIDTH } from "@/constants/design-system";

<div className={BORDER_STYLES.subtle}>
<div className={cn(BORDER_WIDTH.medium, BORDER_STYLES.primary)}>
```

### Available Border Utilities
- `BORDER_STYLES`: `none`, `default`, `subtle`, `medium`, `strong`, `primary`, `accent`, `muted`
- `BORDER_WIDTH`: `none`, `thin`, `medium`, `thick`

---

## Buttons

### Before
```tsx
<button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-montserrat-semibold">
  Click me
</button>
```

### After
```tsx
import { AUTH_BUTTON_PRIMARY, BUTTON_BASE, BUTTON_SIZES } from "@/lib/design-utils";
import { BUTTON_VARIANTS } from "@/constants/design-system";

// Predefined
<button className={AUTH_BUTTON_PRIMARY}>Click me</button>

// Custom combination
<button className={cn(BUTTON_BASE, BUTTON_SIZES.md, BUTTON_VARIANTS.primary)}>
  Click me
</button>
```

---

## Cards

### Before
```tsx
<div className="bg-white rounded-lg border border-gray-200 p-6 shadow-md">
```

### After
```tsx
import { DASHBOARD_STAT_CARD, CARD_BASE } from "@/lib/design-utils";

<div className={DASHBOARD_STAT_CARD}>
```

---

## Dashboard/Page Layouts

### Before
```tsx
<div className="min-h-screen bg-gray-100 p-6 space-y-8">
  <div className="space-y-6">
```

### After
```tsx
import { DASHBOARD_PAGE_WRAPPER, DASHBOARD_CONTENT } from "@/lib/design-utils";

<div className={DASHBOARD_PAGE_WRAPPER}>
  <div className={DASHBOARD_CONTENT}>
```

---

## Common Patterns

### Error States
```tsx
import { TEXT_COLORS, FLEX_CENTER, BG_COLORS } from "@/constants/design-system";
import { FLEX_COL_CENTER } from "@/lib/design-utils";

<div className={cn(FLEX_CENTER, "py-12")}>
  <div className={FLEX_COL_CENTER}>
    <ErrorIcon className={cn("h-12 w-12", TEXT_COLORS.error)} />
    <p className={cn("mt-4", TEXT_STYLES.body)}>Error message</p>
  </div>
</div>
```

### Form Fields
```tsx
import { AUTH_INPUT, AUTH_LABEL } from "@/lib/design-utils";

<div className="space-y-2">
  <Label className={AUTH_LABEL}>Email</Label>
  <Input className={AUTH_INPUT} placeholder="..." />
</div>
```

### Stat Cards
```tsx
import { DASHBOARD_STAT_CARD, FLEX_ROW_BETWEEN, TEXT_STYLES } from "@/lib/design-utils";

<div className={DASHBOARD_STAT_CARD}>
  <div className={FLEX_ROW_BETWEEN}>
    <span className={TEXT_STYLES.label}>Title</span>
    <div>Icon</div>
  </div>
  <div className="text-2xl font-montserrat-bold">Value</div>
</div>
```

---

## Template String Usage

When you need conditional styling, use template strings with design constants:

### Before
```tsx
<div className={currentSlide === index ? "bg-primary-600 w-9" : "bg-gray-300 hover:bg-gray-400 w-4"}>
```

### After
```tsx
import { BG_COLORS } from "@/constants/design-system";

<div className={cn(
  "h-2 rounded-full transition-all duration-300",
  currentSlide === index
    ? `${BG_COLORS.primary} w-9`
    : `${BG_COLORS.gray300} hover:bg-gray-400 w-4`
)}>
```

---

## Import Template

Always use this import structure in refactored files:

```tsx
import { cn, LAYOUT_UTILS, COMPONENT_UTILS } from "@/lib/design-utils";
import { 
  SPACING,
  TEXT_SIZE,
  TEXT_COLORS,
  BG_COLORS,
  FONT_WEIGHT,
  HEADING_STYLES,
  TEXT_STYLES,
  BORDER_STYLES,
  SHADOW,
  RADIUS,
  // ... other constants as needed
} from "@/constants/design-system";
```

---

## Refactoring Workflow

1. **Identify Layout**: Replace flex/grid classes with layout utilities
2. **Update Typography**: Replace text and heading classes with TEXT_SIZE, HEADING_STYLES, TEXT_COLORS
3. **Update Colors**: Replace color classes with COLOR constants
4. **Update Spacing**: Replace margin/padding classes with SPACING constants
5. **Update Radius/Shadow/Border**: Replace with respective constants
6. **Add Imports**: Ensure all used constants are imported
7. **Use cn()**: Combine multiple constants with the `cn()` utility
8. **Template Strings**: Use template strings for conditional classes

---

## Pages to Refactor (In Order)

### Phase 2: Participant Pages
- [ ] ParticipantDashboard.tsx (partially done)
- [ ] ParticipantProfile.tsx
- [ ] ParticipantSetupPage.tsx
- [ ] ParticipantOrganizationsPage.tsx
- [ ] ParticipantJobsPage.tsx
- [ ] ParticipantTimesheets.tsx
- [ ] ParticipantShifts.tsx

### Phase 3: Support Worker Pages
- [ ] SupportWorkerDashboard.tsx
- [ ] SupportWorkerProfile.tsx
- [ ] SupportWorkerSetupPage.tsx
- [ ] SupportWorkersSearch.tsx
- [ ] SupportWorkerTimesheets.tsx
- [ ] SupportWorkerInvite.tsx

### Phase 4: Admin Pages
- [ ] AdminDashboard.tsx
- [ ] AdminAnalyticsDashboard.tsx
- [ ] AdminsManagementPage.tsx
- [ ] ParticipantsManagementPage.tsx
- [ ] SupportWorkersManagementPage.tsx
- [ ] OrganizationsPage.tsx

---

## Tips & Best Practices

1. **Don't modify /components/ui** - These are UI primitives
2. **Preserve Functionality** - Only change styling, not layout or interaction
3. **Use cn()** - Always use the `cn()` utility to merge classes
4. **Check Hover States** - Make sure hover states are preserved with `hover:` prefix
5. **Test Responsive** - Verify responsive behavior is maintained
6. **Template Strings** - Use template strings for computed classes, not string concatenation
7. **Import Organization** - Keep imports organized: design-utils first, then design-system
8. **Consistency** - Use the same pattern throughout a file

---

## Common Gotchas

❌ **Wrong** - Don't hardcode colors:
```tsx
<div className="bg-red-500">
```

✅ **Right** - Use constants:
```tsx
<div className={TEXT_COLORS.error}>
```

---

❌ **Wrong** - Don't mix raw Tailwind with constants:
```tsx
<div className={cn(FLEX_ROW_CENTER, "px-4 py-6")}>
```

✅ **Right** - Use spacing constants:
```tsx
<div className={cn(FLEX_ROW_CENTER, `px-${SPACING.sm} py-${SPACING.lg}`)}>
```

---

❌ **Wrong** - Don't use string concatenation:
```tsx
const bgColor = "bg-" + (active ? "primary" : "gray-300");
```

✅ **Right** - Use template strings:
```tsx
const bgColor = active ? BG_COLORS.primary : BG_COLORS.gray300;
<div className={bgColor}>
```

---

## Need Help?

For questions about specific design constants, refer to:
- `/src/constants/design-system.ts` - All design tokens
- `/src/lib/design-utils.ts` - Pre-built component utilities

Both files are well-documented with JSDoc comments explaining each constant's purpose.
