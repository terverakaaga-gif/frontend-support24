# Design System Guidelines

This document provides comprehensive guidelines for using the Support24 design system to ensure visual consistency across the application.

## Table of Contents

- [Introduction](#introduction)
- [Core Principles](#core-principles)
- [Spacing](#spacing)
- [Typography](#typography)
- [Colors](#colors)
- [Borders & Shadows](#borders--shadows)
- [Components](#components)
- [Best Practices](#best-practices)

## Introduction

The Support24 design system is built on Tailwind CSS with standardized tokens defined in `/src/constants/design-system.ts`. Always import and use these constants instead of arbitrary Tailwind classes.

```typescript
import { 
  SPACING, 
  TEXT_STYLES, 
  BUTTON_VARIANTS, 
  CARD_VARIANTS 
} from '@/constants/design-system';
```

## Core Principles

### 1. **Consistency First**
- Always use design system constants
- Never use arbitrary values (e.g., `px-[15px]`, `text-[14.5px]`)
- Stick to the predefined spacing scale

### 2. **Responsive Design**
- Use responsive utility classes: `sm:`, `md:`, `lg:`, `xl:`, `2xl:`
- Mobile-first approach
- Test on multiple screen sizes

### 3. **Accessibility**
- Maintain color contrast ratios (WCAG AA minimum)
- Use semantic HTML
- Include proper ARIA labels

## Spacing

### Padding & Margin

Use the `SPACING` constant for all spacing needs:

```typescript
import { SPACING, CONTAINER_PADDING, GAP } from '@/constants/design-system';

// ✅ CORRECT
<div className={`p-${SPACING.base}`}>       // p-4 (16px)
<div className={`m-${SPACING.lg}`}>        // m-5 (20px)
<div className={CONTAINER_PADDING.card}>   // p-6

// ❌ WRONG
<div className="p-[18px]">
<div className="m-3.5">
```

### Standard Spacing Scale

- **xs**: 4px - Tight spacing
- **sm**: 8px - Small spacing
- **md**: 12px - Medium spacing
- **base**: 16px - Default spacing (most common)
- **lg**: 20px - Large spacing
- **xl**: 24px - Extra large spacing
- **2xl**: 32px - Section spacing
- **3xl**: 40px - Large section spacing
- **4xl**: 48px - Extra large section spacing

### Container Padding Presets

```typescript
// Mobile, tablet, desktop responsive
<section className={CONTAINER_PADDING.responsive}>

// Card padding
<Card className={CONTAINER_PADDING.card}>

// Small card
<Card className={CONTAINER_PADDING.cardSm}>
```

### Gap for Flex/Grid

```typescript
<div className={`flex ${GAP.base}`}>     // gap-4
<div className={`grid ${GAP.lg}`}>      // gap-6
```

## Typography

### Headings

Use the `HEADING_STYLES` constant for all headings:

```typescript
import { HEADING_STYLES } from '@/constants/design-system';

// ✅ CORRECT
<h1 className={HEADING_STYLES.h1}>Main Title</h1>
<h2 className={HEADING_STYLES.h2}>Section Title</h2>
<h3 className={HEADING_STYLES.h3}>Subsection</h3>

// ❌ WRONG
<h1 className="text-5xl font-bold text-gray-900">
```

### Body Text

```typescript
import { TEXT_STYLES } from '@/constants/design-system';

<p className={TEXT_STYLES.body}>Main content text</p>
<p className={TEXT_STYLES.bodySecondary}>Secondary text</p>
<span className={TEXT_STYLES.small}>Small text</span>
<span className={TEXT_STYLES.tiny}>Extra small text</span>
<label className={TEXT_STYLES.label}>Form Label</label>
```

### Font Families

```typescript
import { FONT_FAMILY, FONT_WEIGHT } from '@/constants/design-system';

<p className={FONT_FAMILY.montserrat}>Regular Montserrat</p>
<p className={FONT_FAMILY.montserratSemibold}>Semibold</p>
<p className={FONT_FAMILY.montserratBold}>Bold</p>

// Or use weight utilities
<p className={`${FONT_FAMILY.montserrat} ${FONT_WEIGHT.semibold}`}>
```

### Text Size Scale

- **xs**: 12px - Small labels, captions
- **sm**: 14px - Secondary text
- **base**: 16px - Body text (default)
- **lg**: 18px - Emphasized text
- **xl**: 20px - Small headings
- **2xl**: 24px - Medium headings
- **3xl**: 30px - Large headings
- **4xl**: 36px - Extra large headings

## Colors

### Text Colors

```typescript
import { TEXT_COLORS } from '@/constants/design-system';

<p className={TEXT_COLORS.primary}>Primary text (gray-900)</p>
<p className={TEXT_COLORS.secondary}>Secondary text (gray-600)</p>
<p className={TEXT_COLORS.muted}>Muted text (gray-500)</p>
<p className={TEXT_COLORS.brand}>Brand color text</p>
<p className={TEXT_COLORS.success}>Success message</p>
<p className={TEXT_COLORS.error}>Error message</p>
```

### Background Colors

```typescript
import { BG_COLORS } from '@/constants/design-system';

<div className={BG_COLORS.white}>White background</div>
<div className={BG_COLORS.primary}>Light gray (gray-50)</div>
<div className={BG_COLORS.brand}>Primary brand color</div>
<div className={BG_COLORS.success}>Success background</div>
```

### Color Palette

#### Primary Colors (Blue)
- **primary-600** (#0D2BEC): Main brand color
- Use for: Primary buttons, links, brand elements
- Shades: 50-900 available

#### Accent Colors (Yellow/Orange)
- **accent-500** (#E6A500): Accent color
- Use for: CTAs, highlights, important actions
- Shades: 50-900 available

#### Neutral/Gray
- **gray-50**: Backgrounds
- **gray-600**: Body text
- **gray-900**: Headings

#### Semantic Colors
- **green**: Success states
- **yellow**: Warning states
- **red**: Error/danger states
- **blue**: Info states

## Borders & Shadows

### Border Radius

```typescript
import { RADIUS } from '@/constants/design-system';

<div className={RADIUS.md}>     // rounded-md (6px) - Cards
<div className={RADIUS.lg}>     // rounded-lg (8px) - Buttons
<div className={RADIUS.full}>   // rounded-full - Pills, avatars
```

### Border Styles

```typescript
import { BORDER_STYLES } from '@/constants/design-system';

<div className={BORDER_STYLES.default}>   // border border-border
<div className={BORDER_STYLES.subtle}>    // border border-gray-200
<div className={BORDER_STYLES.primary}>   // border border-primary
```

### Shadows

```typescript
import { SHADOW } from '@/constants/design-system';

<Card className={SHADOW.md}>      // Standard card shadow
<Modal className={SHADOW.xl}>     // Modal shadow
<div className={SHADOW.none}>     // No shadow
```

## Components

### Buttons

```typescript
import { BUTTON_BASE, BUTTON_VARIANTS, BUTTON_SIZES } from '@/constants/design-system';

// Primary button
<button className={`${BUTTON_BASE} ${BUTTON_VARIANTS.primary} ${BUTTON_SIZES.md}`}>
  Click Me
</button>

// Accent button
<button className={`${BUTTON_BASE} ${BUTTON_VARIANTS.accent} ${BUTTON_SIZES.lg}`}>
  Get Started
</button>

// Outline button
<button className={`${BUTTON_BASE} ${BUTTON_VARIANTS.outline} ${BUTTON_SIZES.sm}`}>
  Cancel
</button>
```

### Cards

```typescript
import { CARD_VARIANTS } from '@/constants/design-system';

// Standard card
<div className={CARD_VARIANTS.default}>
  <div className={CONTAINER_PADDING.card}>
    Card content
  </div>
</div>

// Interactive card (with hover effect)
<div className={CARD_VARIANTS.interactive}>
  Clickable card
</div>
```

### Badges

```typescript
import { BADGE_BASE, BADGE_VARIANTS, BADGE_SIZES } from '@/constants/design-system';

<span className={`${BADGE_BASE} ${BADGE_VARIANTS.primary} ${BADGE_SIZES.md}`}>
  New
</span>

<span className={`${BADGE_BASE} ${BADGE_VARIANTS.success} ${BADGE_SIZES.sm}`}>
  Active
</span>
```

### Status Indicators

```typescript
import { STATUS_COLORS, getStatusConfig } from '@/constants/design-system';

// Direct usage
<span className={STATUS_COLORS.confirmed.badge}>Confirmed</span>
<span className={STATUS_COLORS.pending.badge}>Pending</span>

// Dynamic usage
const config = getStatusConfig(status);
<span className={config.badge}>{status}</span>
```

### Form Inputs

```typescript
import { INPUT_VARIANTS } from '@/constants/design-system';

<input 
  type="text" 
  className={INPUT_VARIANTS.default}
  placeholder="Enter text"
/>

<input 
  type="text" 
  className={INPUT_VARIANTS.error}
  placeholder="Error state"
/>
```

## Layout Patterns

### Flex Layouts

```typescript
import { FLEX_LAYOUTS, GAP } from '@/constants/design-system';

// Row with centered items
<div className={`${FLEX_LAYOUTS.rowCenter} ${GAP.base}`}>

// Row with space between
<div className={`${FLEX_LAYOUTS.rowBetween} ${GAP.base}`}>

// Column layout
<div className={`${FLEX_LAYOUTS.colStart} ${GAP.md}`}>

// Centered content
<div className={FLEX_LAYOUTS.center}>
```

### Grid Layouts

```typescript
import { GRID_LAYOUTS, GAP } from '@/constants/design-system';

// Responsive 1-2-3 columns
<div className={`${GRID_LAYOUTS.responsive} ${GAP.lg}`}>

// Two columns
<div className={`${GRID_LAYOUTS.twoCol} ${GAP.base}`}>
```

## Icons

### Icon Sizes

```typescript
import { ICON_SIZES } from '@/constants/design-system';

<Icon className={ICON_SIZES.sm} />   // 16px
<Icon className={ICON_SIZES.md} />   // 20px
<Icon className={ICON_SIZES.lg} />   // 24px
<Icon className={ICON_SIZES.xl} />   // 32px
```

## Transitions & Animations

### Hover Effects

```typescript
import { HOVER_EFFECTS, TRANSITIONS } from '@/constants/design-system';

<div className={HOVER_EFFECTS.lift}>Hover to lift</div>
<div className={HOVER_EFFECTS.scale}>Hover to scale</div>

<div className={TRANSITIONS.all}>Smooth transition</div>
```

## Best Practices

### ✅ DO

1. **Use design system constants**
   ```typescript
   import { SPACING, TEXT_STYLES } from '@/constants/design-system';
   <div className={`p-${SPACING.base}`}>
   ```

2. **Combine classes properly**
   ```typescript
   <div className={`${CARD_VARIANTS.default} ${CONTAINER_PADDING.card}`}>
   ```

3. **Use responsive utilities**
   ```typescript
   <div className="p-4 md:p-6 lg:p-8">
   ```

4. **Maintain consistent spacing**
   - Use multiples of 4px
   - Stick to the spacing scale

### ❌ DON'T

1. **Avoid arbitrary values**
   ```typescript
   // ❌ WRONG
   <div className="p-[17px]">
   <div className="text-[15.5px]">
   ```

2. **Don't mix spacing systems**
   ```typescript
   // ❌ WRONG - inconsistent spacing
   <div className="p-3 m-7 gap-5">
   ```

3. **Don't use inline styles**
   ```typescript
   // ❌ WRONG
   <div style={{ padding: '15px', color: '#123456' }}>
   ```

4. **Don't hardcode colors**
   ```typescript
   // ❌ WRONG
   <div className="text-[#FF5733]">
   
   // ✅ CORRECT - use design tokens
   <div className="text-primary">
   ```

## Migration Guide

### Converting Existing Components

1. **Identify hardcoded values**
   - Search for arbitrary values: `[]`
   - Find inconsistent spacing
   
2. **Replace with design tokens**
   ```typescript
   // Before
   <div className="p-5 text-lg font-semibold text-gray-800 rounded-md">
   
   // After
   import { SPACING, TEXT_STYLES, RADIUS } from '@/constants/design-system';
   <div className={`p-${SPACING.lg} ${TEXT_STYLES.label} ${RADIUS.md}`}>
   ```

3. **Test responsiveness**
   - Verify on mobile, tablet, desktop
   - Check spacing and typography scales

## Quick Reference

### Common Patterns

```typescript
// Card with content
<div className={CARD_VARIANTS.default}>
  <div className={CONTAINER_PADDING.card}>
    <h3 className={HEADING_STYLES.h3}>Title</h3>
    <p className={TEXT_STYLES.body}>Content</p>
  </div>
</div>

// Button group
<div className={`${FLEX_LAYOUTS.rowCenter} ${GAP.base}`}>
  <button className={`${BUTTON_BASE} ${BUTTON_VARIANTS.primary}`}>
    Save
  </button>
  <button className={`${BUTTON_BASE} ${BUTTON_VARIANTS.outline}`}>
    Cancel
  </button>
</div>

// Status badge
<span className={`${BADGE_BASE} ${STATUS_COLORS.confirmed.badge}`}>
  Active
</span>

// Form field
<div className={`${FLEX_LAYOUTS.colStart} ${GAP.sm}`}>
  <label className={TEXT_STYLES.label}>Name</label>
  <input className={INPUT_VARIANTS.default} />
</div>
```

## Support

For questions or suggestions about the design system, please consult with the design team or refer to the component library in `/src/components/ui/`.

---

**Last Updated**: December 2025  
**Version**: 1.0
