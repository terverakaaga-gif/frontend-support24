# Component Migration Examples

This document shows practical examples of migrating existing components to use the new design system.

## Example 1: Button Component

### Before (Inconsistent)

```tsx
// Multiple variations with hardcoded values
<button className="px-5 py-2.5 bg-blue-600 text-white rounded-md hover:bg-blue-700">
  Click Me
</button>

<button className="px-3 py-1 bg-gray-300 text-gray-900 rounded hover:bg-gray-400 text-sm">
  Cancel
</button>

<button className="px-6 py-3 bg-[#E6A500] text-white rounded-lg hover:bg-[#D69E2E] text-lg">
  Get Started
</button>
```

### After (Consistent with Design System)

```tsx
import { getButtonClass } from '@/lib/design-utils';

// Primary button - medium size
<button className={getButtonClass('primary', 'md')}>
  Click Me
</button>

// Secondary button - small size
<button className={getButtonClass('secondary', 'sm')}>
  Cancel
</button>

// Accent button - large size
<button className={getButtonClass('accent', 'lg')}>
  Get Started
</button>
```

---

## Example 2: Card Component

### Before (Inconsistent)

```tsx
<div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
  <h3 className="text-xl font-montserrat-semibold text-gray-900 mb-2">Title</h3>
  <p className="text-gray-600 text-base">Content goes here</p>
</div>

<div className="bg-white rounded-md shadow p-5 border">
  <h3 className="text-2xl font-montserrat-bold mb-3">Another Card</h3>
  <p className="text-sm text-gray-500">Different styling</p>
</div>
```

### After (Consistent with Design System)

```tsx
import { CARD, CARD_CONTENT, HEADING_3, TEXT_BODY } from '@/lib/design-utils';
import { GAP } from '@/constants/design-system';

<div className={CARD}>
  <div className={CARD_CONTENT}>
    <div className={`flex flex-col ${GAP.sm}`}>
      <h3 className={HEADING_3}>Title</h3>
      <p className={TEXT_BODY}>Content goes here</p>
    </div>
  </div>
</div>

<div className={CARD}>
  <div className={CARD_CONTENT}>
    <div className={`flex flex-col ${GAP.md}`}>
      <h3 className={HEADING_3}>Another Card</h3>
      <p className={TEXT_BODY}>Consistent styling</p>
    </div>
  </div>
</div>
```

---

## Example 3: Form Component

### Before (Inconsistent)

```tsx
<div className="mb-4">
  <label className="block text-sm font-montserrat-bold mb-1 text-gray-800">
    Name
  </label>
  <input 
    type="text"
    className="w-full px-3 py-2 border rounded focus:outline-none focus:border-blue-500"
    placeholder="Enter your name"
  />
</div>

<div className="mb-5">
  <label className="text-xs font-montserrat-semibold mb-2 block text-gray-700">
    Email
  </label>
  <input 
    type="email"
    className="w-full p-2 border-2 border-gray-300 rounded-md focus:ring-2 focus:ring-blue-400"
    placeholder="Enter email"
  />
</div>
```

### After (Consistent with Design System)

```tsx
import { FORM_GROUP, FORM_LABEL, FORM_INPUT } from '@/lib/design-utils';

<div className={FORM_GROUP}>
  <label className={FORM_LABEL}>
    Name
  </label>
  <input 
    type="text"
    className={FORM_INPUT}
    placeholder="Enter your name"
  />
</div>

<div className={FORM_GROUP}>
  <label className={FORM_LABEL}>
    Email
  </label>
  <input 
    type="email"
    className={FORM_INPUT}
    placeholder="Enter email"
  />
</div>
```

---

## Example 4: Status Badge

### Before (Inconsistent)

```tsx
<span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-montserrat-semibold">
  Confirmed
</span>

<span className="px-3 py-1.5 bg-yellow-50 text-yellow-600 rounded-full text-sm font-montserrat-bold">
  Pending
</span>

<span className="px-2.5 py-0.5 bg-red-200 text-red-800 rounded-full text-xs">
  Cancelled
</span>
```

### After (Consistent with Design System)

```tsx
import { getStatusBadgeClass } from '@/lib/design-utils';

<span className={getStatusBadgeClass('confirmed')}>
  Confirmed
</span>

<span className={getStatusBadgeClass('pending')}>
  Pending
</span>

<span className={getStatusBadgeClass('cancelled')}>
  Cancelled
</span>
```

---

## Example 5: Modal Component

### Before (Inconsistent)

```tsx
<div className="fixed inset-0 bg-black opacity-50 z-50" />
<div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-lg shadow-xl max-w-2xl w-full z-50">
  <div className="flex items-center justify-between p-6 border-b">
    <h2 className="text-2xl font-montserrat-bold">Modal Title</h2>
    <button className="text-gray-500 hover:text-gray-700">✕</button>
  </div>
  <div className="p-6">
    <p>Modal content</p>
  </div>
  <div className="flex justify-end gap-2 p-6 border-t">
    <button className="px-4 py-2 bg-gray-200 rounded">Cancel</button>
    <button className="px-4 py-2 bg-blue-600 text-white rounded">Save</button>
  </div>
</div>
```

### After (Consistent with Design System)

```tsx
import { 
  MODAL_OVERLAY, 
  MODAL_CONTENT, 
  MODAL_HEADER, 
  MODAL_BODY, 
  MODAL_FOOTER,
  HEADING_4,
  getButtonClass
} from '@/lib/design-utils';

<div className={MODAL_OVERLAY} />
<div className={MODAL_CONTENT}>
  <div className={MODAL_HEADER}>
    <h2 className={HEADING_4}>Modal Title</h2>
    <button className="text-gray-500 hover:text-gray-700">✕</button>
  </div>
  <div className={MODAL_BODY}>
    <p>Modal content</p>
  </div>
  <div className={MODAL_FOOTER}>
    <button className={getButtonClass('secondary', 'md')}>Cancel</button>
    <button className={getButtonClass('primary', 'md')}>Save</button>
  </div>
</div>
```

---

## Example 6: Grid Layout

### Before (Inconsistent)

```tsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
  {/* items */}
</div>

<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
  {/* items */}
</div>

<div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
  {/* items */}
</div>
```

### After (Consistent with Design System)

```tsx
import { GRID_RESPONSIVE } from '@/lib/design-utils';
import { GAP } from '@/constants/design-system';

<div className={`${GRID_RESPONSIVE} ${GAP.base}`}>
  {/* items */}
</div>

<div className={`${GRID_RESPONSIVE} ${GAP.lg}`}>
  {/* items */}
</div>

<div className={`${GRID_RESPONSIVE} ${GAP.base}`}>
  {/* items */}
</div>
```

---

## Example 7: Loading State

### Before (Inconsistent)

```tsx
<div className="flex items-center justify-center min-h-[300px]">
  <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
</div>

<div className="text-center py-8">
  <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-gray-300 border-t-blue-600"></div>
</div>
```

### After (Consistent with Design System)

```tsx
import { LOADING_CONTAINER, LOADING_SPINNER } from '@/lib/design-utils';

<div className={LOADING_CONTAINER}>
  <div className={LOADING_SPINNER}></div>
</div>

<div className={LOADING_CONTAINER}>
  <div className={LOADING_SPINNER}></div>
</div>
```

---

## Example 8: Empty State

### Before (Inconsistent)

```tsx
<div className="flex flex-col items-center justify-center py-12 text-center">
  <svg className="w-20 h-20 text-gray-400 mb-4" /* ... */>
  <p className="text-gray-600 text-lg">No items found</p>
  <p className="text-gray-500 text-sm mt-2">Try adjusting your filters</p>
</div>
```

### After (Consistent with Design System)

```tsx
import { 
  EMPTY_STATE, 
  EMPTY_STATE_ICON, 
  EMPTY_STATE_TEXT,
  TEXT_BODY,
  TEXT_MUTED
} from '@/lib/design-utils';
import { GAP } from '@/constants/design-system';

<div className={EMPTY_STATE}>
  <Icon className={EMPTY_STATE_ICON} />
  <div className={`flex flex-col ${GAP.sm}`}>
    <p className={TEXT_BODY}>No items found</p>
    <p className={TEXT_MUTED}>Try adjusting your filters</p>
  </div>
</div>
```

---

## Example 9: Navigation/Header

### Before (Inconsistent)

```tsx
<header className="bg-white border-b px-4 py-3 flex items-center justify-between">
  <h1 className="text-2xl font-montserrat-bold text-gray-900">Dashboard</h1>
  <div className="flex items-center gap-3">
    <button className="px-3 py-2 bg-blue-600 text-white rounded-md">
      New Item
    </button>
  </div>
</header>
```

### After (Consistent with Design System)

```tsx
import { 
  FLEX_ROW_BETWEEN,
  HEADING_4,
  getButtonClass
} from '@/lib/design-utils';
import { GAP, SPACING, BORDER_STYLES } from '@/constants/design-system';

<header className={`bg-white ${BORDER_STYLES.subtle} px-${SPACING.base} py-${SPACING.md} ${FLEX_ROW_BETWEEN}`}>
  <h1 className={HEADING_4}>Dashboard</h1>
  <div className={`flex items-center ${GAP.md}`}>
    <button className={getButtonClass('primary', 'md')}>
      New Item
    </button>
  </div>
</header>
```

---

## Example 10: Flex Layouts

### Before (Inconsistent)

```tsx
<div className="flex items-center gap-2">
  <Icon className="w-5 h-5" />
  <span>Text</span>
</div>

<div className="flex flex-row items-center justify-between">
  <div>Left</div>
  <div>Right</div>
</div>

<div className="flex flex-col items-start gap-4">
  <Item1 />
  <Item2 />
</div>
```

### After (Consistent with Design System)

```tsx
import { FLEX_ROW_CENTER, FLEX_ROW_BETWEEN, FLEX_COL } from '@/lib/design-utils';
import { GAP, ICON_SIZES } from '@/constants/design-system';

<div className={`${FLEX_ROW_CENTER} ${GAP.sm}`}>
  <Icon className={ICON_SIZES.md} />
  <span>Text</span>
</div>

<div className={FLEX_ROW_BETWEEN}>
  <div>Left</div>
  <div>Right</div>
</div>

<div className={`${FLEX_COL} items-start ${GAP.base}`}>
  <Item1 />
  <Item2 />
</div>
```

---

## Migration Checklist

When migrating a component:

- [ ] Replace arbitrary values with design system constants
- [ ] Use design-utils for common patterns
- [ ] Ensure consistent spacing (4px multiples)
- [ ] Apply consistent border radius
- [ ] Use standardized colors
- [ ] Apply consistent typography
- [ ] Test responsive behavior
- [ ] Verify accessibility (focus states, contrast)
- [ ] Remove inline styles
- [ ] Document any special cases

## Tips for Successful Migration

1. **Start Small**: Migrate one component at a time
2. **Test Thoroughly**: Check all screen sizes and states
3. **Maintain Functionality**: Ensure behavior doesn't change
4. **Update Incrementally**: Commit after each successful migration
5. **Review with Team**: Get feedback on consistency
6. **Document Exceptions**: Note any deviations and why

## Common Pitfalls to Avoid

❌ **Don't** use arbitrary values
```tsx
<div className="p-[17px]">  // ❌ Wrong
```

✅ **Do** use design system spacing
```tsx
<div className={`p-${SPACING.base}`}>  // ✅ Correct
```

❌ **Don't** mix different color shades randomly
```tsx
<div className="text-gray-700 border-gray-300 bg-gray-50">  // ❌ Inconsistent
```

✅ **Do** use design system color constants
```tsx
<div className={`${TEXT_COLORS.secondary} ${BORDER_STYLES.subtle} ${BG_COLORS.primary}`}>
```

❌ **Don't** create custom button styles each time
```tsx
<button className="px-5 py-2 bg-blue-500 hover:bg-blue-600 rounded text-white">
```

✅ **Do** use button utilities
```tsx
<button className={getButtonClass('primary', 'md')}>
```
