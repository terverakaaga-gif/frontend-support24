# Design System Quick Reference

Quick lookup for common patterns and utilities.

## 📦 Imports

```typescript
// Design system constants
import { 
  SPACING, 
  GAP, 
  CONTAINER_PADDING,
  RADIUS,
  BORDER_STYLES,
  SHADOW,
  TEXT_SIZE,
  FONT_FAMILY,
  HEADING_STYLES,
  TEXT_STYLES,
  TEXT_COLORS,
  BG_COLORS,
  STATUS_COLORS,
  ICON_SIZES
} from '@/constants/design-system';

// Design utilities (pre-built classes)
import {
  cn,  // Class merge utility
  
  // Layouts
  PAGE_WRAPPER,
  PAGE_CONTAINER,
  FLEX_ROW_CENTER,
  FLEX_ROW_BETWEEN,
  FLEX_COL,
  GRID_RESPONSIVE,
  
  // Cards
  CARD,
  CARD_INTERACTIVE,
  CARD_HEADER,
  CARD_CONTENT,
  CARD_FOOTER,
  
  // Forms
  FORM_GROUP,
  FORM_LABEL,
  FORM_INPUT,
  FORM_INPUT_ERROR,
  FORM_ERROR,
  
  // Buttons
  BUTTON_PRIMARY,
  BUTTON_SECONDARY,
  BUTTON_ACCENT,
  BUTTON_OUTLINE,
  getButtonClass,
  
  // Badges
  BADGE_PRIMARY,
  BADGE_SUCCESS,
  getBadgeClass,
  getStatusBadgeClass,
  
  // Typography
  HEADING_1,
  HEADING_2,
  HEADING_3,
  TEXT_BODY,
  TEXT_MUTED,
  
  // Modals
  MODAL_OVERLAY,
  MODAL_CONTENT,
  MODAL_HEADER,
  
  // Loading
  LOADING_CONTAINER,
  LOADING_SPINNER,
  
  // Empty States
  EMPTY_STATE,
  
  // Effects
  HOVER_LIFT,
  TRANSITION,
} from '@/lib/design-utils';
```

---

## 🎨 Common Patterns

### Page Layout
```tsx
<div className={PAGE_WRAPPER}>
  <div className={PAGE_CONTAINER}>
    {/* content */}
  </div>
</div>
```

### Card
```tsx
<div className={CARD}>
  <div className={CARD_CONTENT}>
    <h3 className={HEADING_3}>Title</h3>
    <p className={TEXT_BODY}>Content</p>
  </div>
</div>
```

### Button
```tsx
<button className={getButtonClass('primary', 'md')}>
  Click Me
</button>
```

### Form Field
```tsx
<div className={FORM_GROUP}>
  <label className={FORM_LABEL}>Name</label>
  <input className={FORM_INPUT} type="text" />
</div>
```

### Status Badge
```tsx
<span className={getStatusBadgeClass('confirmed')}>
  Confirmed
</span>
```

### Flex Layout
```tsx
<div className={`${FLEX_ROW_BETWEEN} ${GAP.base}`}>
  <div>Left</div>
  <div>Right</div>
</div>
```

### Grid Layout
```tsx
<div className={`${GRID_RESPONSIVE} ${GAP.lg}`}>
  {items.map(item => <Item key={item.id} />)}
</div>
```

### Modal
```tsx
<div className={MODAL_OVERLAY} onClick={onClose} />
<div className={MODAL_CONTENT}>
  <div className={MODAL_HEADER}>
    <h2 className={HEADING_4}>Title</h2>
  </div>
  {/* content */}
</div>
```

### Loading State
```tsx
<div className={LOADING_CONTAINER}>
  <div className={LOADING_SPINNER} />
</div>
```

### Empty State
```tsx
<div className={EMPTY_STATE}>
  <Icon className={ICON_SIZES['2xl']} />
  <p className={TEXT_BODY}>No items found</p>
</div>
```

---

## 📏 Spacing Quick Reference

```tsx
// Padding/Margin
p-0    // 0px
p-1    // 4px
p-2    // 8px
p-3    // 12px
p-4    // 16px ⭐ Most common
p-5    // 20px
p-6    // 24px ⭐ Card padding
p-8    // 32px
p-10   // 40px
p-12   // 48px

// Gap
gap-1  // 4px
gap-2  // 8px
gap-3  // 12px
gap-4  // 16px ⭐ Most common
gap-6  // 24px
gap-8  // 32px

// Use constants:
p-${SPACING.base}       // p-4
${GAP.base}             // gap-4
${CONTAINER_PADDING.card}  // p-6
```

---

## 🎯 Border Radius

```tsx
rounded-none   // 0px
rounded-sm     // 2px
rounded        // 4px
rounded-md     // 6px ⭐ Cards
rounded-lg     // 8px ⭐ Buttons
rounded-xl     // 12px
rounded-2xl    // 16px
rounded-full   // Pills/Circles

// Use constants:
${RADIUS.md}    // rounded-md
${RADIUS.lg}    // rounded-lg
${RADIUS.full}  // rounded-full
```

---

## 🎨 Colors

### Text Colors
```tsx
text-gray-900   // Primary text (headings)
text-gray-600   // Secondary text (body) ⭐
text-gray-500   // Muted text
text-primary    // Brand blue
text-accent     // Yellow/Orange
text-green-600  // Success
text-red-600    // Error
text-yellow-600 // Warning

// Use constants:
${TEXT_COLORS.primary}    // text-gray-900
${TEXT_COLORS.secondary}  // text-gray-600
${TEXT_COLORS.brand}      // text-primary
```

### Background Colors
```tsx
bg-white       // White ⭐
bg-gray-50     // Light gray background ⭐
bg-gray-100    // Slightly darker
bg-primary     // Brand blue
bg-accent      // Yellow/Orange
bg-green-50    // Success background
bg-red-50      // Error background

// Use constants:
${BG_COLORS.white}    // bg-white
${BG_COLORS.primary}  // bg-gray-50
${BG_COLORS.brand}    // bg-primary
```

---

## 📝 Typography

### Headings
```tsx
// Use pre-built heading styles
<h1 className={HEADING_1}>  // 4xl/5xl, bold
<h2 className={HEADING_2}>  // 3xl/4xl, bold
<h3 className={HEADING_3}>  // 2xl/3xl, semibold ⭐
<h4 className={HEADING_4}>  // xl/2xl, semibold
```

### Text
```tsx
// Body text
<p className={TEXT_BODY}>     // base, gray-600 ⭐
<p className={TEXT_MUTED}>    // sm, gray-500
<span className={TEXT_SMALL}> // xs, gray-500
<label className={FORM_LABEL}> // sm, semibold, gray-700
```

### Font Families
```tsx
font-montserrat          // Regular
font-montserrat-semibold // Semibold ⭐
font-montserrat-bold     // Bold ⭐

// Use constants:
${FONT_FAMILY.montserratSemibold}
${FONT_FAMILY.montserratBold}
```

---

## 🔘 Buttons Quick Reference

```tsx
// Primary (blue)
<button className={getButtonClass('primary', 'md')}>

// Secondary (gray)
<button className={getButtonClass('secondary', 'md')}>

// Accent (yellow/orange)
<button className={getButtonClass('accent', 'md')}>

// Outline
<button className={getButtonClass('outline', 'md')}>

// Ghost
<button className={getButtonClass('ghost', 'md')}>

// Danger (red)
<button className={getButtonClass('danger', 'md')}>

// Sizes: 'sm' | 'md' | 'lg' | 'xl'
```

---

## 🏷️ Badges Quick Reference

```tsx
// Color variants
<span className={getBadgeClass('primary', 'md')}>
<span className={getBadgeClass('success', 'md')}>
<span className={getBadgeClass('warning', 'md')}>
<span className={getBadgeClass('error', 'md')}>

// Status badges (auto-colored)
<span className={getStatusBadgeClass('confirmed')}>
<span className={getStatusBadgeClass('pending')}>
<span className={getStatusBadgeClass('cancelled')}>

// Sizes: 'sm' | 'md' | 'lg'
```

---

## 📐 Layout Quick Reference

### Flex
```tsx
// Row with centered items
${FLEX_ROW_CENTER}

// Row with space between
${FLEX_ROW_BETWEEN}

// Column
${FLEX_COL}

// Center everything
${FLEX_CENTER}

// Always add gap:
${FLEX_ROW_CENTER} ${GAP.base}
```

### Grid
```tsx
// Responsive 1-2-3 columns
${GRID_RESPONSIVE} ${GAP.lg}

// Two columns
${GRID_2_COLS} ${GAP.base}

// Four columns
${GRID_4_COLS} ${GAP.lg}
```

---

## 🎭 Icons

```tsx
<Icon className={ICON_SIZES.sm} />  // 16px
<Icon className={ICON_SIZES.md} />  // 20px ⭐
<Icon className={ICON_SIZES.lg} />  // 24px
<Icon className={ICON_SIZES.xl} />  // 32px
<Icon className={ICON_SIZES['2xl']} /> // 40px
```

---

## 🔍 Shadows

```tsx
${SHADOW.none}  // No shadow
${SHADOW.sm}    // Subtle
${SHADOW.md}    // Standard ⭐ (cards)
${SHADOW.lg}    // Strong (modals)
${SHADOW.xl}    // Extra strong
```

---

## 🎬 Transitions

```tsx
${TRANSITION}       // Smooth all transitions
${HOVER_LIFT}       // Lift on hover
${HOVER_SCALE}      // Scale on hover

// Custom
transition-all duration-200
hover:shadow-lg
```

---

## 📱 Responsive Breakpoints

```tsx
// Mobile first approach
className="p-4 md:p-6 lg:p-8"

// Breakpoints:
xs:   320px   (extra small)
sm:   412px   (small - phones)
md:   768px   (medium - tablets) ⭐
lg:   1024px  (large - laptops) ⭐
xl:   1280px  (extra large)
2xl:  1536px  (2x large)
```

---

## ⚡ Most Common Combinations

### Standard Card
```tsx
<div className={CARD}>
  <div className={CARD_CONTENT}>
    <div className={`${FLEX_COL} ${GAP.md}`}>
      <h3 className={HEADING_3}>Title</h3>
      <p className={TEXT_BODY}>Content</p>
    </div>
  </div>
</div>
```

### Form Field
```tsx
<div className={FORM_GROUP}>
  <label className={FORM_LABEL}>Label</label>
  <input type="text" className={FORM_INPUT} />
</div>
```

### Button Group
```tsx
<div className={`${FLEX_ROW_CENTER} ${GAP.md}`}>
  <button className={getButtonClass('primary', 'md')}>Save</button>
  <button className={getButtonClass('secondary', 'md')}>Cancel</button>
</div>
```

### Section Header
```tsx
<div className={`${FLEX_ROW_BETWEEN} mb-6`}>
  <h2 className={HEADING_2}>Section Title</h2>
  <button className={getButtonClass('accent', 'md')}>
    Add New
  </button>
</div>
```

### Grid of Cards
```tsx
<div className={`${GRID_RESPONSIVE} ${GAP.lg}`}>
  {items.map(item => (
    <div key={item.id} className={CARD_INTERACTIVE}>
      <div className={CARD_CONTENT}>
        {/* content */}
      </div>
    </div>
  ))}
</div>
```

---

## 🚫 Common Mistakes

❌ **DON'T**
```tsx
className="p-[15px]"           // Arbitrary values
className="text-[#123456]"     // Custom colors
className="gap-5 p-7 m-3"      // Inconsistent spacing
style={{ padding: '20px' }}    // Inline styles
```

✅ **DO**
```tsx
className={`p-${SPACING.base}`}      // Design system
className={TEXT_COLORS.brand}        // Color constants
className={`${GAP.base} p-4 m-4`}    // Consistent
className={getButtonClass('primary', 'md')} // Utilities
```

---

## 💡 Tips

1. **Import what you need** - Don't import everything
2. **Use the cn() utility** - For conditional/dynamic classes
3. **Stick to the scale** - Spacing: 0, 1, 2, 3, 4, 5, 6, 8, 10, 12...
4. **Test responsiveness** - Always check mobile, tablet, desktop
5. **Consistency over creativity** - Follow the system

---

## 🔗 More Resources

- Full Guide: `/DESIGN_SYSTEM.md`
- Migration Examples: `/MIGRATION_EXAMPLES.md`
- Constants: `/src/constants/design-system.ts`
- Utilities: `/src/lib/design-utils.ts`
