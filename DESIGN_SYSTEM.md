# Design System Complete Reference

Comprehensive guide for using the Support24 design system. Choose your section based on your needs.

## Table of Contents
- [Quick Start](#quick-start)
- [Architecture Overview](#architecture-overview)
- [Implementation Pattern](#implementation-pattern)
- [Complete Reference](#complete-reference)
- [Common Patterns](#common-patterns)
- [Cheat Sheet](#cheat-sheet)
- [Best Practices](#best-practices)

---

## Quick Start

### Installation & Imports

```typescript
// Design system constants (fine-grained tokens)
import { 
  SPACING, GAP, CONTAINER_PADDING, RADIUS, SHADOW,
  HEADING_STYLES, TEXT_STYLES, TEXT_COLORS, BG_COLORS, STATUS_COLORS,
  TRANSITIONS, HOVER_EFFECTS
} from '@/constants/design-system';

// Design utilities (pre-built patterns - USE FIRST!)
import {
  cn, // Class merge utility
  DASHBOARD_PAGE_WRAPPER, DASHBOARD_CONTENT, CARD, FORM_GROUP, FORM_LABEL, FORM_INPUT,
  HEADING_1, HEADING_2, HEADING_3, HEADING_4, HEADING_5, HEADING_6,
  TEXT_BODY, TEXT_BODY_SM, TEXT_MUTED, TEXT_SMALL,
  BUTTON_PRIMARY, BUTTON_SECONDARY, BUTTON_OUTLINE, BUTTON_DANGER,
  FLEX_CENTER, FLEX_ROW_CENTER, FLEX_ROW_BETWEEN, FLEX_COL_CENTER,
  GRID_RESPONSIVE, GRID_2_COLS, GRID_4_COLS,
  BADGE_PRIMARY, BADGE_SUCCESS, getButtonClass, getBadgeClass, getStatusBadgeClass
} from '@/lib/design-utils';
```

### Basic Page Structure

```tsx
export default function MyPage() {
  return (
    <div className={DASHBOARD_PAGE_WRAPPER}>
      {/* Header */}
      <GeneralHeader ... />

      {/* Content */}
      <div className={DASHBOARD_CONTENT}>
        <div className={CARD}>
          <h2 className={HEADING_3}>Section Title</h2>
          <p className={TEXT_BODY}>Body text</p>
        </div>
      </div>
    </div>
  );
}
```

---

## Architecture Overview

The design system uses a **two-layer approach**:

### Layer 1: Pre-built Patterns (design-utils.ts)
Ready-to-use className combinations. **Import these FIRST.**

**Page Layouts:**
- `DASHBOARD_PAGE_WRAPPER` - Full-page container for dashboard pages
- `DASHBOARD_CONTENT` - Content wrapper with responsive padding
- `PAGE_WRAPPER`, `PAGE_CONTAINER` - Generic page wrappers

**Components:**
- `CARD`, `CARD_INTERACTIVE` - Card with shadow, border, padding
- `FORM_GROUP`, `FORM_LABEL`, `FORM_INPUT` - Form field wrapper
- `HEADING_1` through `HEADING_6` - Pre-styled headings
- `TEXT_BODY`, `TEXT_BODY_SM`, `TEXT_MUTED`, `TEXT_SMALL` - Text styles

**Buttons:**
- `BUTTON_PRIMARY`, `BUTTON_SECONDARY`, `BUTTON_ACCENT`, `BUTTON_OUTLINE`, `BUTTON_DANGER`
- All include hover/focus states

**Layouts:**
- `FLEX_CENTER` - Center content horizontally and vertically
- `FLEX_ROW_CENTER` - Center items in a row
- `FLEX_ROW_BETWEEN` - Space between items in a row
- `FLEX_COL_CENTER` - Center items in a column
- `GRID_RESPONSIVE`, `GRID_2_COLS`, `GRID_4_COLS` - Grid layouts

**Badges:**
- `BADGE_PRIMARY`, `BADGE_SUCCESS`, `BADGE_WARNING`, `BADGE_ERROR`

### Layer 2: Fine-grained Constants (design-system.ts)
For customization and creating new patterns. Use to fine-tune Layer 1.

**Spacing:**
- `SPACING` - Scale: xs (4px) to 7xl (96px)
- `CONTAINER_PADDING` - Presets: responsive, card, cardSm, cardLg
- `GAP` - Flex/grid gaps: xs (4px) to 2xl (32px)

**Typography:**
- `HEADING_STYLES` - h1-h6 complete classes
- `TEXT_STYLES` - body, bodySecondary, small, tiny, label, caption, link
- `TEXT_COLORS` - Primary, secondary, muted, brand, success, error, etc.

**Colors:**
- `BG_COLORS` - 60+ variants with states
- `TEXT_COLORS` - 40+ variants
- `STATUS_COLORS` - confirmed, pending, inProgress, completed, rejected, approved, cancelled

**Effects:**
- `RADIUS` - Border radius scale
- `SHADOW` - Shadow scale (none, sm, md, lg, xl, 2xl)
- `TRANSITIONS` - Smooth transitions
- `HOVER_EFFECTS` - Lift, scale, etc.

---

## Implementation Pattern

### ✅ Correct Pattern

```tsx
// 1. Import pre-built patterns FIRST (design-utils)
import {
  cn,
  DASHBOARD_PAGE_WRAPPER,
  DASHBOARD_CONTENT,
  CARD,
  HEADING_4,
  TEXT_BODY,
  TEXT_MUTED,
} from '@/lib/design-utils';

// 2. Import fine-grained constants SECOND (design-system)
import {
  BG_COLORS,
  CONTAINER_PADDING,
  FLEX_CENTER,
} from '@/constants/design-system';

export default function Page() {
  return (
    // Use Layer 1 patterns as base
    <div className={DASHBOARD_PAGE_WRAPPER}>
      <div className={DASHBOARD_CONTENT}>
        {/* Combine with Layer 2 for customization */}
        <div className={cn(CARD, "max-w-2xl mx-auto")}>
          <h3 className={HEADING_4}>Title</h3>
          <p className={TEXT_BODY}>Content</p>
          <p className={cn(TEXT_MUTED, "mt-4")}>Secondary</p>
        </div>
      </div>
    </div>
  );
}
```

### ❌ Common Mistakes

```tsx
// ❌ WRONG: Template literals don't work in className
className={`mb-${SPACING.xl}`}  // Results in "mb-5" which is invalid

// ❌ WRONG: Hardcoded Tailwind
className="p-4 m-3 text-lg font-montserrat-semibold rounded-lg"

// ❌ WRONG: Mixing systems
className={cn(CARD, "p-6", `gap-${GAP.base}`)}

// ✅ CORRECT: Use predefined constants
className={cn(CARD, "max-w-2xl mx-auto")}
className={HEADING_3}
className={cn(TEXT_BODY, TEXT_MUTED)}
```

---

## Complete Reference

### Spacing System

**SPACING constant** - Use for padding, margin:
```typescript
SPACING = {
  none: '0',    // 0px
  xs: '1',      // 4px
  sm: '2',      // 8px
  md: '3',      // 12px
  base: '4',    // 16px (most common)
  lg: '5',      // 20px
  xl: '6',      // 24px
  '2xl': '8',   // 32px
  '3xl': '10',  // 40px
  '4xl': '12',  // 48px
  '5xl': '14',  // 56px
  '6xl': '16',  // 64px
  '7xl': '24',  // 96px
}

// Usage (NOT with template literals!)
className={`p-${SPACING.base}`}  // ❌ WRONG
className="p-4"                   // ✅ CORRECT for hardcoding
```

**CONTAINER_PADDING constant** - Responsive padding presets:
```typescript
CONTAINER_PADDING = {
  responsive: 'px-4 sm:px-6 lg:px-8',     // Mobile-responsive
  card: 'p-6',                             // Card padding
  cardSm: 'p-4',                           // Small card
  cardLg: 'p-8',                           // Large card
  mobile: 'px-4 py-6',
  tablet: 'px-6 py-8',
  desktop: 'px-8 py-10',
}

// Usage
className={CONTAINER_PADDING.card}
className={cn(CARD, CONTAINER_PADDING.responsive)}
```

**GAP constant** - Flex/grid gaps:
```typescript
GAP = {
  xs: 'gap-1',      // 4px
  sm: 'gap-2',      // 8px
  md: 'gap-3',      // 12px
  base: 'gap-4',    // 16px
  lg: 'gap-6',      // 24px
  xl: 'gap-8',      // 32px
  '2xl': 'gap-12',  // 48px
  responsive: 'gap-4 sm:gap-6 lg:gap-8',
}

// Usage
className={`${FLEX_CENTER} ${GAP.base}`}
```

### Typography

**Headings:**
```tsx
<h1 className={HEADING_1}>Page Title</h1>        // 36px, bold
<h2 className={HEADING_2}>Section Title</h2>    // 30px, bold
<h3 className={HEADING_3}>Subsection</h3>       // 24px, semibold ⭐
<h4 className={HEADING_4}>Heading 4</h4>        // 20px, semibold
<h5 className={HEADING_5}>Heading 5</h5>        // 18px, semibold
<h6 className={HEADING_6}>Heading 6</h6>        // 16px, semibold
```

**Body Text:**
```tsx
<p className={TEXT_BODY}>Main content</p>        // 16px, gray-600 ⭐
<p className={TEXT_BODY_SM}>Smaller text</p>    // 14px, gray-600
<p className={TEXT_MUTED}>Secondary text</p>    // 14px, gray-500
<p className={TEXT_SMALL}>Extra small</p>       // 12px, gray-500
```

**Design System Constants:**
```typescript
HEADING_STYLES = {
  h1: 'text-4xl sm:text-5xl font-montserrat-bold text-gray-900',
  h2: 'text-3xl sm:text-4xl font-montserrat-bold text-gray-900',
  h3: 'text-2xl sm:text-3xl font-montserrat-semibold text-gray-900',
  h4: 'text-xl sm:text-2xl font-montserrat-semibold text-gray-900',
  h5: 'text-lg sm:text-xl font-montserrat-semibold text-gray-900',
  h6: 'text-base font-montserrat-semibold text-gray-900',
}

TEXT_STYLES = {
  body: 'text-base text-gray-600 leading-relaxed',
  bodySecondary: 'text-base text-gray-600',
  small: 'text-sm text-gray-600',
  tiny: 'text-xs text-gray-600',
  label: 'text-sm font-montserrat-semibold text-gray-700',
  caption: 'text-xs text-gray-500',
  link: 'text-base text-primary hover:text-primary-700 underline',
}
```

### Colors

**Text Colors:**
```typescript
TEXT_COLORS = {
  primary: 'text-gray-900',           // Headings
  secondary: 'text-gray-600',         // Body text ⭐
  muted: 'text-gray-500',             // Secondary text
  brand: 'text-primary-600',          // Brand blue
  accent: 'text-accent-500',          // Yellow/orange
  success: 'text-green-600',
  error: 'text-red-600',
  warning: 'text-yellow-600',
  info: 'text-blue-600',
  // 40+ total variants with hover states
}

// Usage
className={TEXT_COLORS.secondary}
className={cn(HEADING_4, TEXT_COLORS.primary)}
```

**Background Colors:**
```typescript
BG_COLORS = {
  white: 'bg-white',                  // ⭐ Most common
  primary: 'bg-gray-50',              // Light background
  secondary: 'bg-gray-100',
  muted: 'bg-gray-100',               // Card backgrounds
  brand: 'bg-primary-600',            // Brand color
  accent: 'bg-accent-500',
  success: 'bg-green-50',
  successLight: 'bg-green-100',
  error: 'bg-red-50',
  errorLight: 'bg-red-100',
  warning: 'bg-yellow-50',
  info: 'bg-blue-50',
  // 60+ total variants
}

// Usage
className={cn(CARD, BG_COLORS.white)}
```

**Status Colors:**
```typescript
STATUS_COLORS = {
  approved: {
    badge: 'bg-green-100 text-green-800',
    border: 'border-green-500',
    dot: 'bg-green-500',
  },
  pending: {
    badge: 'bg-yellow-100 text-yellow-800',
    border: 'border-yellow-500',
    dot: 'bg-yellow-500',
  },
  rejected: {
    badge: 'bg-red-100 text-red-800',
    border: 'border-red-500',
    dot: 'bg-red-500',
  },
  // More statuses...
}

// Usage
className={STATUS_COLORS.approved.badge}
```

### Borders & Shadows

**Border Radius:**
```typescript
RADIUS = {
  none: 'rounded-none',       // 0px
  xs: 'rounded-sm',           // 2px
  sm: 'rounded',              // 4px
  md: 'rounded-md',           // 6px (cards)
  lg: 'rounded-lg',           // 8px (buttons) ⭐
  xl: 'rounded-xl',           // 12px
  '2xl': 'rounded-2xl',       // 16px
  '3xl': 'rounded-3xl',       // 24px
  full: 'rounded-full',       // Circles
}

// Already in pre-built patterns
className={CARD}  // rounded-lg, shadow-md, border
```

**Shadows:**
```typescript
SHADOW = {
  none: 'shadow-none',        // No shadow
  sm: 'shadow-sm',            // Subtle
  md: 'shadow-md',            // Standard ⭐
  lg: 'shadow-lg',            // Strong
  xl: 'shadow-xl',            // Extra strong
  '2xl': 'shadow-2xl',        // Modal
}

// Usage
className={cn(CARD, SHADOW.md)}  // Already in CARD
```

### Buttons

**Pre-built Button Variants:**
```tsx
<button className={BUTTON_PRIMARY}>Save</button>
<button className={BUTTON_SECONDARY}>Cancel</button>
<button className={BUTTON_OUTLINE}>Delete</button>
<button className={BUTTON_ACCENT}>Get Started</button>
<button className={BUTTON_DANGER}>Dangerous Action</button>

// Or use utility function for sizes
<button className={getButtonClass('primary', 'md')}>
<button className={getButtonClass('secondary', 'lg')}>

// Sizes: 'sm' | 'md' | 'lg' | 'xl'
```

**Button Variants:**
```typescript
// Primary (blue, filled)
BUTTON_PRIMARY: 'px-4 py-2.5 rounded-lg bg-primary-600 text-white font-montserrat-semibold hover:bg-primary-700 active:bg-primary-800 disabled:opacity-50 transition-colors duration-200'

// Secondary (gray, filled)
BUTTON_SECONDARY: 'px-4 py-2.5 rounded-lg bg-gray-200 text-gray-900 font-montserrat-semibold hover:bg-gray-300 active:bg-gray-400 transition-colors duration-200'

// Outline (bordered)
BUTTON_OUTLINE: 'px-4 py-2.5 rounded-lg border border-gray-300 text-gray-900 font-montserrat-semibold hover:bg-gray-50 transition-colors duration-200'

// And more...
```

### Forms

**Form Components:**
```tsx
<div className={FORM_GROUP}>
  <label className={FORM_LABEL}>Email Address</label>
  <input 
    type="email"
    className={FORM_INPUT}
    placeholder="your@email.com"
  />
</div>

<button className={BUTTON_PRIMARY} type="submit">
  Submit
</button>
```

### Layouts

**Flex Layouts:**
```tsx
// Center horizontally and vertically
<div className={FLEX_CENTER}>Content</div>

// Center items in a row
<div className={`${FLEX_ROW_CENTER} ${GAP.base}`}>
  <span>Left</span>
  <span>Right</span>
</div>

// Space between items
<div className={`${FLEX_ROW_BETWEEN} ${GAP.base}`}>
  <span>Left</span>
  <span>Right</span>
</div>

// Column layout
<div className={`${FLEX_COL_CENTER} ${GAP.md}`}>
  {items.map(item => <Item key={item.id} />)}
</div>
```

**Grid Layouts:**
```tsx
// Responsive: 1 col (mobile), 2 cols (tablet), 3+ cols (desktop)
<div className={`${GRID_RESPONSIVE} ${GAP.lg}`}>
  {items.map(item => <Card key={item.id} />)}
</div>

// Fixed 2 columns
<div className={`${GRID_2_COLS} ${GAP.base}`}>
  {items.map(item => <Card key={item.id} />)}
</div>

// Fixed 4 columns
<div className={`${GRID_4_COLS} ${GAP.lg}`}>
  {items.map(item => <Card key={item.id} />)}
</div>
```

---

## Common Patterns

### Standard Card
```tsx
<div className={CARD}>
  <div className={CONTAINER_PADDING.card}>
    <h3 className={HEADING_4}>Card Title</h3>
    <p className={cn(TEXT_BODY, "mt-3")}>Card description text.</p>
  </div>
</div>
```

### Form Field
```tsx
<div className={FORM_GROUP}>
  <label className={FORM_LABEL}>Field Name</label>
  <input 
    type="text"
    className={FORM_INPUT}
    placeholder="Placeholder text"
  />
</div>
```

### Button Group
```tsx
<div className={`${FLEX_ROW_CENTER} ${GAP.md}`}>
  <button className={BUTTON_PRIMARY}>Save</button>
  <button className={BUTTON_SECONDARY}>Cancel</button>
</div>
```

### Section Header with Action
```tsx
<div className={`${FLEX_ROW_BETWEEN} mb-6`}>
  <h2 className={HEADING_3}>Section Title</h2>
  <button className={BUTTON_ACCENT}>+ Add New</button>
</div>
```

### Grid of Cards
```tsx
<div className={`${GRID_RESPONSIVE} ${GAP.lg}`}>
  {items.map(item => (
    <div key={item.id} className={CARD}>
      <div className={CONTAINER_PADDING.card}>
        <h4 className={HEADING_4}>{item.title}</h4>
        <p className={TEXT_MUTED}>{item.description}</p>
      </div>
    </div>
  ))}
</div>
```

### Status Badge
```tsx
<span className={STATUS_COLORS.approved.badge}>
  Approved
</span>
```

### Alert/Notification
```tsx
<div className={cn("p-4 rounded-lg border", BG_COLORS.errorLight, "border-red-300")}>
  <h4 className={cn(HEADING_5, "text-red-800")}>Error</h4>
  <p className={cn(TEXT_SMALL, "text-red-700 mt-1")}>Error message content.</p>
</div>
```

---

## Cheat Sheet

### Most Used Imports
```typescript
import { CARD, HEADING_3, TEXT_BODY, TEXT_MUTED, BUTTON_PRIMARY, FLEX_CENTER, FLEX_ROW_BETWEEN, GRID_RESPONSIVE, FORM_GROUP, FORM_LABEL, FORM_INPUT, cn } from '@/lib/design-utils';
import { GAP, BG_COLORS, CONTAINER_PADDING, STATUS_COLORS } from '@/constants/design-system';
```

### Most Used Spacing
```
p-4     (16px)     - Default padding
gap-4   (16px)     - Default gap
p-6     (24px)     - Card padding
gap-6   (24px)     - Larger gap
p-8     (32px)     - Large padding
```

### Most Used Colors
```
text-gray-900      - Headings
text-gray-600      - Body text ⭐
text-gray-500      - Secondary text
bg-white           - Card backgrounds
bg-gray-50         - Page backgrounds
text-primary-600   - Links, brand
text-red-600       - Errors
text-green-600     - Success
```

### Most Used Sizes
```
HEADING_1  - Page titles
HEADING_3  - Section titles ⭐
HEADING_4  - Card titles
TEXT_BODY  - Body content ⭐
TEXT_MUTED - Secondary text
```

### Quick Copy-Paste

**Page:**
```tsx
<div className={DASHBOARD_PAGE_WRAPPER}>
  <div className={DASHBOARD_CONTENT}>
    {/* content */}
  </div>
</div>
```

**Card:**
```tsx
<div className={CARD}>
  <div className={CONTAINER_PADDING.card}>
    <h3 className={HEADING_4}>Title</h3>
    <p className={TEXT_BODY}>Content</p>
  </div>
</div>
```

**Form:**
```tsx
<div className={FORM_GROUP}>
  <label className={FORM_LABEL}>Label</label>
  <input className={FORM_INPUT} />
</div>
```

**Grid:**
```tsx
<div className={`${GRID_RESPONSIVE} ${GAP.lg}`}>
  {/* items */}
</div>
```

---

## Best Practices

### ✅ DO

1. **Import Layer 1 (design-utils) first**
   ```tsx
   import { CARD, HEADING_3 } from '@/lib/design-utils';
   import { GAP, BG_COLORS } from '@/constants/design-system';
   ```

2. **Use cn() to merge classes**
   ```tsx
   className={cn(CARD, "max-w-2xl mx-auto")}
   className={cn(TEXT_BODY, TEXT_MUTED)}
   ```

3. **Use predefined patterns**
   ```tsx
   className={CARD}
   className={HEADING_3}
   className={FLEX_CENTER}
   ```

4. **Maintain consistent spacing**
   - Use multiples of 4px (the spacing scale)
   - Stick to the GAP scale

5. **Test responsiveness**
   - Check mobile, tablet, desktop
   - Pre-built patterns are mobile-first

### ❌ DON'T

1. **Don't use template literals in className**
   ```tsx
   className={`mb-${SPACING.xl}`}  // ❌ Invalid
   ```

2. **Don't hardcode Tailwind classes**
   ```tsx
   className="p-4 m-3 text-lg font-montserrat-semibold"  // ❌
   ```

3. **Don't use arbitrary values**
   ```tsx
   className="p-[17px] text-[15px]"  // ❌
   ```

4. **Don't mix spacing systems**
   ```tsx
   className={cn(CARD, "p-6 m-4")}  // ❌ Conflicts
   ```

5. **Don't use inline styles**
   ```tsx
   style={{ padding: '20px', color: '#123456' }}  // ❌
   ```

### Key Rules

1. **Layer 1 FIRST**: Use pre-built patterns from design-utils before fine-grained constants
2. **Never interpolate**: Template literals don't work in className attributes
3. **Use cn()**: Always use cn() to merge multiple classes
4. **Consistency**: Follow the system, don't create custom values
5. **Responsive**: Use pre-built patterns, they're already responsive

---

## Troubleshooting

**Problem**: "Can't use SPACING value directly"
```tsx
// ❌ WRONG
className={`mb-${SPACING.xl}`}

// ✅ CORRECT
className={CONTAINER_PADDING.card}
// OR hardcode the specific class
className="mb-6"
```

**Problem**: "Missing spacing"
```tsx
// Use predefined patterns with gap
className={`${FLEX_CENTER} ${GAP.base}`}

// OR use hardcoded classes
className="flex items-center justify-center gap-4"
```

**Problem**: "Colors not matching"
```tsx
// Use BG_COLORS constants
className={BG_COLORS.primary}

// NOT template literals
className={`bg-${BG_COLORS.primary}`}  // ❌
```

**Problem**: "Form doesn't look right"
```tsx
// Use FORM_GROUP, FORM_LABEL, FORM_INPUT combo
<div className={FORM_GROUP}>
  <label className={FORM_LABEL}>Label</label>
  <input className={FORM_INPUT} />
</div>
```

---

## Resources

- **Source Files:**
  - `/src/constants/design-system.ts` - All design tokens
  - `/src/lib/design-utils.ts` - Pre-built patterns

- **Reference Implementations:**
  - `/src/pages/Login.tsx` - Auth page pattern
  - `/src/pages/ComplianceCheckPage.tsx` - Dashboard page pattern

- **Configuration:**
  - `/tailwind.config.ts` - Tailwind configuration
  - `/postcss.config.js` - PostCSS plugins

---

**Last Updated**: January 2026  
**Version**: 2.0 (Consolidated)
