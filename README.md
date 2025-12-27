# Support24 Webapp

## Project Overview

The Support24 Webapp is a sophisticated, full-stack application designed to provide robust security and monitoring solutions. It offers a comprehensive suite of features for managing security devices, monitoring events, and ensuring the safety of your premises. Built with modern web technologies, it aims to deliver a responsive, intuitive, and powerful user experience.

## Features

- **Real-time Monitoring:** Keep an eye on your security devices and events as they happen.
- **Device Management:** Easily add, configure, and manage all your Support24 security devices.
- **Event Logging & History:** Access detailed logs of all security events for review and analysis.
- **User Authentication & Authorization:** Secure access with robust user management and role-based permissions.
- **Customizable Dashboards:** Tailor your view to prioritize the information most important to you.
- **Alerts & Notifications:** Receive timely alerts for critical events.
- **Responsive Design:** Access the webapp seamlessly from various devices (desktop, tablet, mobile).

## Technologies Used

### Frontend

- **React:** A declarative, efficient, and flexible JavaScript library for building user interfaces.
- **TypeScript:** A typed superset of JavaScript that compiles to plain JavaScript, enhancing code quality and maintainability.
- **Redux Toolkit:** The official, opinionated, batteries-included toolset for efficient Redux development.
- **React Router:** Declarative routing for React.
- **Tailwind CSS:** A utility-first CSS framework for rapidly building custom designs.
- **Material-UI (MUI):** A comprehensive suite of UI tools to help you ship new features faster.
- **Axios:** Promise-based HTTP client for the browser and Node.js.
- **React Hook Form:** Performant, flexible, and extensible forms with easy-to-use validation.
- **Yup:** JavaScript schema builder for value parsing and validation.

## 📚 Documentation

This project includes comprehensive documentation for developers. All documentation files are located in the root directory.

### Design System Documentation

This project uses a professional design system for consistent UI/UX across all components. **All developers must familiarize themselves with the design system before creating or modifying components.**

#### 🎯 Getting Started (Required Reading)

1. **[Documentation Index](./INDEX.md)** - Master navigation hub for all documentation
2. **[Design System Summary](./DESIGN_SYSTEM_SUMMARY.md)** - Quick overview and getting started (5 min read)
3. **[Quick Reference Guide](./DESIGN_QUICK_REF.md)** - Daily cheat sheet (keep this open while coding)

#### 📖 Comprehensive Guides

- **[Complete Design System](./DESIGN_SYSTEM.md)** - Full guidelines and documentation
- **[Migration Examples](./MIGRATION_EXAMPLES.md)** - Practical before/after refactoring examples
- **[Coding Standards](./CODING_STANDARDS.md)** - Code style guide and best practices
- **[Design System Impact](./DESIGN_SYSTEM_IMPACT.md)** - Benefits, ROI analysis, and success metrics
- **[Complete Package Overview](./DESIGN_SYSTEM_COMPLETE.md)** - Summary of entire implementation

#### 🔧 API Integration & Technical Documentation

- **[Job API Integration Summary](./JOB_API_INTEGRATION_SUMMARY.md)** - Job API integration status and implementation details

#### 🎨 Icon Migration Documentation

This project is migrating from Lucide React icons to Solar Icons to match the UI/UX design system.

- **[Icon Migration Guide](./ICON_MIGRATION_GUIDE.md)** - Complete guide for migrating icons
- **[Icon Migration Progress](./ICON_MIGRATION_PROGRESS.md)** - Current migration status and remaining work
- **Icon Mapping Constants**: `/src/constants/icon-mapping.ts` - Lucide to Solar mapping reference
- **Custom Icons**: `/src/components/icons/index.tsx` - Custom SVG icons for non-Solar equivalents

**Migration Status**: UI components (100% ✅), Feature components (100% ✅), Page components (in progress)

#### 💻 Source Files

- **`/src/constants/design-system.ts`** - All design tokens (spacing, colors, typography, etc.)
- **`/src/lib/design-utils.ts`** - Pre-built component utilities and helpers

### 🎨 Design System Principles

1. **Consistency First** - Always use design system constants, never arbitrary values
2. **Mobile-First** - Responsive design with standardized breakpoints
3. **Accessibility** - WCAG-compliant colors and focus states
4. **Maintainability** - Single source of truth for all design tokens

### 🚀 Quick Usage Example

```typescript
// Import design tokens and utilities
import { SPACING, GAP, HEADING_STYLES } from '@/constants/design-system';
import { CARD, getButtonClass } from '@/lib/design-utils';

// Use in components
function MyComponent() {
  return (
    <div className={CARD}>
      <div className={`p-${SPACING.lg} flex flex-col ${GAP.md}`}>
        <h3 className={HEADING_STYLES.h3}>Title</h3>
        <p className={TEXT_STYLES.body}>Description text</p>
        <button className={getButtonClass('primary', 'md')}>
          Click Me
        </button>
      </div>
    </div>
  );
}
```

**👉 Start here:** [INDEX.md](./INDEX.md) for complete navigation and learning path.

### Backend

- **Node.js:** A JavaScript runtime built on Chrome's V8 JavaScript engine.
- **Express.js:** A fast, unopinionated, minimalist web framework for Node.js.
- **MongoDB:** A NoSQL document database for high performance, high availability, and easy scalability.
- **Mongoose:** An elegant MongoDB object modeling for Node.js.
- \*\*JWT
