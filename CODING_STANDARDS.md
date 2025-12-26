# Coding Standards & Style Guide

## Overview

This document establishes coding standards for the Support24 project to ensure consistency, maintainability, and quality across the codebase.

## Table of Contents

- [Design System](#design-system)
- [Component Structure](#component-structure)
- [Naming Conventions](#naming-conventions)
- [TypeScript Guidelines](#typescript-guidelines)
- [Styling Standards](#styling-standards)
- [File Organization](#file-organization)
- [Best Practices](#best-practices)

---

## Design System

**ALWAYS use the design system for styling.** This is the most important standard.

### Required

✅ Import design tokens from the design system:
```typescript
import { SPACING, GAP, HEADING_STYLES, TEXT_STYLES } from '@/constants/design-system';
import { CARD, getButtonClass, FORM_INPUT } from '@/lib/design-utils';
```

✅ Use design system constants:
```typescript
<div className={`p-${SPACING.base} ${GAP.md}`}>
<button className={getButtonClass('primary', 'md')}>
```

### Forbidden

❌ NO arbitrary values:
```typescript
<div className="p-[15px]">  // WRONG
<div className="text-[#123456]">  // WRONG
```

❌ NO inline styles (unless absolutely necessary):
```typescript
<div style={{ padding: '20px' }}>  // WRONG
```

❌ NO custom colors outside design system:
```typescript
<div className="bg-[#FF5733]">  // WRONG
```

### See Also
- [Design System Documentation](./DESIGN_SYSTEM.md)
- [Migration Examples](./MIGRATION_EXAMPLES.md)
- [Quick Reference](./DESIGN_QUICK_REF.md)

---

## Component Structure

### File Structure

```typescript
// 1. Imports - grouped and organized
import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';

// External libraries
import { format } from 'date-fns';

// Components
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

// Design system
import { HEADING_3, TEXT_BODY } from '@/lib/design-utils';
import { SPACING, GAP } from '@/constants/design-system';

// Types
import type { User } from '@/entities/User';

// Services/API
import { userService } from '@/api/services/userService';

// 2. Types/Interfaces
interface MyComponentProps {
  userId: string;
  onUpdate?: (user: User) => void;
}

// 3. Component
export function MyComponent({ userId, onUpdate }: MyComponentProps) {
  // 3a. Hooks (useState, useQuery, etc.)
  const [isEditing, setIsEditing] = useState(false);
  
  const { data, isLoading } = useQuery({
    queryKey: ['user', userId],
    queryFn: () => userService.getById(userId),
  });
  
  // 3b. Effects
  useEffect(() => {
    // Effect logic
  }, [userId]);
  
  // 3c. Event handlers
  const handleEdit = () => {
    setIsEditing(true);
  };
  
  const handleSave = async () => {
    // Save logic
    onUpdate?.(data);
  };
  
  // 3d. Early returns
  if (isLoading) {
    return <LoadingSpinner />;
  }
  
  if (!data) {
    return <EmptyState />;
  }
  
  // 3e. Render
  return (
    <div className={CARD}>
      <h3 className={HEADING_3}>{data.name}</h3>
      <p className={TEXT_BODY}>{data.email}</p>
    </div>
  );
}

// 4. Helper components (if small and local)
function LoadingSpinner() {
  return <div>Loading...</div>;
}
```

### Component Best Practices

1. **One component per file** (except for small helper components)
2. **Named exports preferred** over default exports
3. **Props interface** always defined
4. **Destructure props** in function signature
5. **Early returns** for loading/error states
6. **Clear separation** of concerns

---

## Naming Conventions

### Files and Folders

```
✅ PascalCase for components:
- UserProfile.tsx
- ShiftCard.tsx
- DashboardLayout.tsx

✅ camelCase for utilities/services:
- apiClient.ts
- formatters.ts
- userService.ts

✅ kebab-case for config files:
- tailwind.config.ts
- design-system.ts

✅ SCREAMING_SNAKE_CASE for constants:
- API_ENDPOINTS.ts
- FEATURE_FLAGS.ts
```

### Variables and Functions

```typescript
// ✅ Descriptive names
const userProfile = getUserProfile();
const isLoading = true;
const handleSubmit = () => {};

// ❌ Unclear abbreviations
const up = getUP();
const ld = true;
const hndlSbmt = () => {};

// ✅ Boolean variables start with is/has/should
const isActive = true;
const hasPermission = false;
const shouldRender = true;

// ✅ Event handlers start with handle
const handleClick = () => {};
const handleInputChange = (e) => {};

// ✅ Async functions indicate async behavior
const fetchUserData = async () => {};
const loadDashboard = async () => {};
```

### Components

```typescript
// ✅ PascalCase
export function UserProfile() {}
export function ShiftCard() {}

// ✅ Descriptive names
export function DashboardLayout() {}
export function NavigationHeader() {}

// ❌ Generic names
export function Component1() {}
export function Thing() {}
```

---

## TypeScript Guidelines

### Type Definitions

```typescript
// ✅ Define prop types inline or as separate interface
interface ButtonProps {
  label: string;
  onClick: () => void;
  variant?: 'primary' | 'secondary';
  disabled?: boolean;
}

// ✅ Use type for unions/intersections
type Status = 'pending' | 'confirmed' | 'cancelled';
type UserWithPermissions = User & { permissions: string[] };

// ✅ Avoid 'any' - use 'unknown' or specific types
const data: unknown = fetchData();

// ❌ Don't use 'any' unless absolutely necessary
const data: any = fetchData();  // AVOID
```

### Type Safety

```typescript
// ✅ Use strict null checks
const user: User | null = getUser();
if (user) {
  console.log(user.name);
}

// ✅ Use optional chaining
const email = user?.contact?.email;

// ✅ Use nullish coalescing
const name = user?.name ?? 'Guest';

// ✅ Type function parameters and return values
function calculateTotal(items: Item[]): number {
  return items.reduce((sum, item) => sum + item.price, 0);
}
```

---

## Styling Standards

### Design System Usage

```typescript
// ✅ ALWAYS use design system
import { SPACING, GAP, HEADING_3 } from '@/constants/design-system';
import { CARD, getButtonClass } from '@/lib/design-utils';

<div className={CARD}>
  <div className={`p-${SPACING.lg} ${GAP.md}`}>
    <h3 className={HEADING_3}>Title</h3>
  </div>
</div>

// ❌ NEVER use arbitrary values
<div className="p-[20px] gap-[16px]">
```

### Class Organization

```typescript
// ✅ Organize classes logically
<div className={cn(
  // Layout
  'flex flex-col',
  // Spacing
  SPACING.base,
  GAP.md,
  // Colors
  'bg-white text-gray-900',
  // Borders & Shadows
  'border border-gray-200 rounded-lg shadow-md',
  // Responsive
  'md:flex-row lg:gap-6'
)}>
```

### Responsive Design

```typescript
// ✅ Mobile-first approach
<div className="p-4 md:p-6 lg:p-8">

// ✅ Use standardized breakpoints
// xs: 320px, sm: 412px, md: 768px, lg: 1024px, xl: 1280px

// ✅ Group responsive classes together
<div className={cn(
  'text-sm md:text-base lg:text-lg',
  'p-4 md:p-6 lg:p-8'
)}>
```

---

## File Organization

### Project Structure

```
src/
├── api/                    # API clients and services
│   ├── services/          # API service modules
│   └── apiClient.ts       # HTTP client configuration
├── components/            # React components
│   ├── ui/               # Base UI components (shadcn/ui)
│   ├── layouts/          # Layout components
│   ├── auth/             # Authentication components
│   └── [feature]/        # Feature-specific components
├── constants/             # Constants and configuration
│   ├── design-system.ts  # Design tokens ⭐
│   └── [other].ts
├── contexts/              # React contexts
├── entities/              # TypeScript type definitions
├── hooks/                 # Custom React hooks
├── lib/                   # Utility libraries
│   ├── design-utils.ts   # Design system utilities ⭐
│   └── utils.ts          # General utilities
├── pages/                 # Page components
└── store/                 # State management
```

### Import Order

```typescript
// 1. React and core dependencies
import React, { useState, useEffect } from 'react';

// 2. External libraries
import { useQuery } from '@tanstack/react-query';
import { format } from 'date-fns';

// 3. Internal components
import { Button } from '@/components/ui/button';

// 4. Design system (REQUIRED) ⭐
import { HEADING_3, TEXT_BODY } from '@/lib/design-utils';
import { SPACING, GAP } from '@/constants/design-system';

// 5. Types
import type { User } from '@/entities/User';

// 6. Services/utilities
import { userService } from '@/api/services/userService';
import { formatDate } from '@/lib/formatters';
```

---

## Best Practices

### React Best Practices

1. **Use functional components** (no class components)
2. **Use hooks** (useState, useEffect, custom hooks)
3. **Avoid prop drilling** - use Context or state management
4. **Memoize expensive computations** with useMemo
5. **Memoize callbacks** with useCallback
6. **Extract logic** to custom hooks when reusable
7. **Keep components small** and focused

### Performance

```typescript
// ✅ Memoize expensive computations
const sortedUsers = useMemo(() => {
  return users.sort((a, b) => a.name.localeCompare(b.name));
}, [users]);

// ✅ Memoize callbacks
const handleClick = useCallback(() => {
  doSomething(userId);
}, [userId]);

// ✅ Use React.lazy for code splitting
const DashboardPage = lazy(() => import('./pages/Dashboard'));
```

### State Management

```typescript
// ✅ Use React Query for server state
const { data, isLoading } = useQuery({
  queryKey: ['users'],
  queryFn: userService.getAll,
});

// ✅ Use useState for local UI state
const [isOpen, setIsOpen] = useState(false);

// ✅ Use Context for global app state
const { user, logout } = useAuth();
```

### Error Handling

```typescript
// ✅ Handle loading and error states
if (isLoading) {
  return <LoadingSpinner />;
}

if (error) {
  return <ErrorDisplay error={error} />;
}

if (!data) {
  return <EmptyState />;
}

// ✅ Use try-catch for async operations
try {
  await userService.update(userId, data);
  toast.success('Updated successfully');
} catch (error) {
  toast.error('Failed to update');
  console.error(error);
}
```

### Accessibility

```typescript
// ✅ Use semantic HTML
<button onClick={handleClick}>Click Me</button>
<nav>...</nav>
<main>...</main>

// ✅ Add ARIA labels when needed
<button aria-label="Close dialog" onClick={onClose}>
  <X />
</button>

// ✅ Ensure keyboard navigation
<div 
  role="button"
  tabIndex={0}
  onClick={handleClick}
  onKeyPress={handleKeyPress}
>

// ✅ Use proper focus management
<input ref={inputRef} />
useEffect(() => {
  inputRef.current?.focus();
}, []);
```

---

## Code Review Checklist

### Before Submitting PR

- [ ] Uses design system (no arbitrary values)
- [ ] TypeScript types properly defined
- [ ] No console.log statements
- [ ] Error handling implemented
- [ ] Loading states handled
- [ ] Responsive design tested
- [ ] Accessibility checked
- [ ] No hardcoded strings (use constants)
- [ ] Comments for complex logic
- [ ] Follows naming conventions

### Reviewers Check

- [ ] Design system used correctly
- [ ] Code is readable and maintainable
- [ ] No unnecessary complexity
- [ ] Performance considerations addressed
- [ ] Security concerns addressed
- [ ] Tests included (if applicable)
- [ ] Documentation updated

---

## Common Patterns

### Form Pattern

```typescript
import { useForm } from 'react-hook-form';
import { FORM_GROUP, FORM_LABEL, FORM_INPUT, FORM_ERROR } from '@/lib/design-utils';

function MyForm() {
  const { register, handleSubmit, formState: { errors } } = useForm();
  
  const onSubmit = async (data) => {
    try {
      await service.create(data);
      toast.success('Success');
    } catch (error) {
      toast.error('Error');
    }
  };
  
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className={FORM_GROUP}>
        <label className={FORM_LABEL}>Name</label>
        <input 
          className={FORM_INPUT}
          {...register('name', { required: true })}
        />
        {errors.name && (
          <span className={FORM_ERROR}>Name is required</span>
        )}
      </div>
    </form>
  );
}
```

### List Pattern

```typescript
import { GRID_RESPONSIVE } from '@/lib/design-utils';
import { GAP } from '@/constants/design-system';

function UserList() {
  const { data, isLoading } = useQuery({
    queryKey: ['users'],
    queryFn: userService.getAll,
  });
  
  if (isLoading) return <LoadingSpinner />;
  if (!data?.length) return <EmptyState />;
  
  return (
    <div className={`${GRID_RESPONSIVE} ${GAP.lg}`}>
      {data.map(user => (
        <UserCard key={user.id} user={user} />
      ))}
    </div>
  );
}
```

### Modal Pattern

```typescript
import { MODAL_OVERLAY, MODAL_CONTENT, MODAL_HEADER } from '@/lib/design-utils';

function MyModal({ isOpen, onClose }) {
  if (!isOpen) return null;
  
  return (
    <>
      <div className={MODAL_OVERLAY} onClick={onClose} />
      <div className={MODAL_CONTENT}>
        <div className={MODAL_HEADER}>
          <h2>Title</h2>
          <button onClick={onClose}>×</button>
        </div>
        {/* Content */}
      </div>
    </>
  );
}
```

---

## Resources

- [Design System Documentation](./DESIGN_SYSTEM.md)
- [Migration Examples](./MIGRATION_EXAMPLES.md)
- [Quick Reference](./DESIGN_QUICK_REF.md)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/handbook/intro.html)
- [React Documentation](https://react.dev)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)

---

**Last Updated**: December 2025  
**Version**: 1.0
