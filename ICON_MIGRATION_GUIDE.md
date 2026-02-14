# Icon Migration Guide: Lucide → Solar Icons

## Overview
This document provides a comprehensive guide for migrating from Lucide React icons to Solar Icons across the entire project. Solar Icons align with the UI/UX design system and provide a consistent visual language.

## Why Solar Icons?
- **Design System Alignment**: Matches UI/UX specifications
- **Consistent Style**: Unified icon language across the application
- **Better Visual Hierarchy**: Modern, clean aesthetic
- **Smaller Bundle Size**: Tree-shakeable, optimized imports

## Installation
Solar Icons is already installed in the project:
```json
"@solar-icons/react": "^1.0.1"
```

## Icon Mapping Reference

### Navigation & Directional Icons
| Lucide | Solar | Usage | Notes |
|--------|-------|-------|-------|
| `ArrowLeft` | `AltArrowLeft` | Back navigation | Already used in some pages |
| `ArrowRight` | `AltArrowRight` | Forward navigation | Already used in some pages |
| `ChevronLeft` | `AltArrowLeft` | Previous/Back | Use AltArrowLeft for consistency |
| `ChevronRight` | `AltArrowRight` | Next/Forward | Use AltArrowRight for consistency |
| `ChevronDown` | `AltArrowDown` | Expand/Dropdown | Import from Solar |
| `ChevronUp` | `AltArrowUp` | Collapse | Import from Solar |

### User & People Icons
| Lucide | Solar | Usage | Notes |
|--------|-------|-------|-------|
| `User` | `User` | Single user | Already in Solar |
| `Users` | `UsersGroupRounded` | Multiple users | Already used in shift-types.ts |
| `UserCog` | `UserCheck` | User settings | Solar alternative |

### Status & Feedback Icons
| Lucide | Solar | Usage | Notes |
|--------|-------|-------|-------|
| `Check` | `Check` | Checkmark | Available in Solar |
| `CheckCircle` | `CheckCircle` | Success state | Already used extensively |
| `AlertCircle` | `DangerCircle` | Warning/Error | Already used in some pages |
| `AlertTriangle` | `DangerTriangle` | Warning | Import from Solar |
| `XCircle` | `CloseCircle` | Error/Cancel | Already used |
| `X` | `CloseSquare` or `Close` | Close button | Use Close for simple X |
| `Info` | `InfoCircle` | Information | Import from Solar |

### Communication Icons
| Lucide | Solar | Usage | Notes |
|--------|-------|-------|-------|
| `Mail` | `Letter` | Email | Import from Solar |
| `Phone` | `Phone` | Phone number | Available in Solar |
| `MessageSquare` | `ChatRound` | Chat/Messages | Import from Solar |
| `MessageCircle` | `ChatRound` | Messages | Same as MessageSquare |
| `Send` | `Send` | Send message | Available in Solar |

### Date & Time Icons
| Lucide | Solar | Usage | Notes |
|--------|-------|-------|-------|
| `Calendar` | `Calendar` | Date picker | Already used extensively |
| `CalendarIcon` | `Calendar` | Calendar reference | Same as Calendar |
| `Clock` | `Clock` | Time | Available in Solar |

### Location & Map Icons
| Lucide | Solar | Usage | Notes |
|--------|-------|-------|-------|
| `MapPin` | `MapPoint` | Location marker | Already used in job pages |

### File & Document Icons
| Lucide | Solar | Usage | Notes |
|--------|-------|-------|-------|
| `FileText` | `FileText` | Document | Already used |
| `Upload` | `Upload` | File upload | Import from Solar |
| `Download` | `Download` | File download | Import from Solar |
| `FileSpreadsheet` | `DocumentText` | Spreadsheet | Solar alternative |

### Action Icons
| Lucide | Solar | Usage | Notes |
|--------|-------|-------|-------|
| `Plus` | `AddCircle` or `Add` | Add/Create | Use AddCircle for buttons |
| `Minus` | `Minus` | Remove/Subtract | Available in Solar |
| `Search` | `Magnifer` | Search functionality | Already used (note: Magnifer spelling) |
| `Filter` | `Filter` | Filtering | Already used extensively |
| `RefreshCw` | `Refresh` | Reload/Refresh | Import from Solar |
| `Edit` | `Edit` | Edit action | Available in Solar |
| `ExternalLink` | `LinkSquare` | External link | Import from Solar |

### View & Display Icons
| Lucide | Solar | Usage | Notes |
|--------|-------|-------|-------|
| `Eye` | `Eye` | Show/Visible | Already used in Login |
| `EyeOff` | `EyeClosed` | Hide/Hidden | Already used in Login |
| `List` | `List` | List view | Available in Solar |

### Media & UI Icons
| Lucide | Solar | Usage | Notes |
|--------|-------|-------|-------|
| `Camera` | `Camera` | Camera/Photo | Import from Solar |
| `Shield` | `ShieldCheck` | Security | Already used |
| `ShieldCheck` | `ShieldCheck` | Verified | Already used |
| `Star` | `Star` | Rating/Favorite | Import from Solar |
| `Heart` | `HeartAngle` or `Heart` | Favorite/Like | Import from Solar |

### Charts & Analytics Icons
| Lucide | Solar | Usage | Notes |
|--------|-------|-------|-------|
| `TrendingUp` | `TrendUp` | Increasing trend | Import from Solar |
| `TrendingDown` | `TrendDown` | Decreasing trend | Import from Solar |
| `BarChart3` | `ChartSquare` | Bar chart | Import from Solar |
| `DollarSign` | `DollarCircle` | Money/Price | Import from Solar |

### Organization & Structure Icons
| Lucide | Solar | Usage | Notes |
|--------|-------|-------|-------|
| `Settings2` | `Settings` | Settings | Import from Solar |
| `Headset` | `Headphones` | Support | Import from Solar |
| `BadgeCheck` | `VerifiedCheck` or `ShieldCheck` | Verified badge | Use ShieldCheck |
| `Flag2` | `Flag` | Already used | Keep Flag from Solar |
| `Repeat` | `Repeat` | Already used in shift-types | Available in Solar |

### Loading & Interaction Icons
| Lucide | Solar | Usage | Notes |
|--------|-------|-------|-------|
| `Loader2` | `Refresh` with animation | Loading spinner | Use with animate-spin |
| `Loader2Icon` | `Refresh` | Loading | Same as Loader2 |
| `BellRing` | `Bell` | Notifications | Already used |
| `Bell` | `Bell` | Notifications | Already used |

### Misc Icons
| Lucide | Solar | Usage | Notes |
|--------|-------|-------|-------|
| `Circle` | `Circle` | Radio/Selection | Available in Solar |
| `Dot` | Custom SVG | OTP dots | May need custom implementation |
| `MoreHorizontal` | `MenuDots` | More options | Import from Solar |
| `GripVertical` | Custom SVG | Drag handle | May need custom implementation |
| `PanelLeft` | `SidebarMinimalistic` | Sidebar toggle | Import from Solar |
| `ClipboardCheck` | `ClipboardCheck` | Already migrated | Keep Solar version |

## Migration Steps

### Step 1: Update Import Statements
**Before (Lucide):**
```tsx
import { ArrowLeft, Calendar, User } from "lucide-react";
```

**After (Solar):**
```tsx
import { AltArrowLeft, Calendar, User } from "@solar-icons/react";
```

### Step 2: Update Icon Components
Most icons can be used as drop-in replacements with updated names:

**Before:**
```tsx
<ArrowLeft className="h-4 w-4" />
```

**After:**
```tsx
<AltArrowLeft className="h-4 w-4" />
```

### Step 3: Handle Icon Sizing
Solar Icons work the same way with className props:
```tsx
// Small icons
<User className="h-4 w-4" />

// Medium icons
<Calendar className="h-5 w-5" />

// Large icons
<CheckCircle className="h-6 w-6" />
```

### Step 4: Custom Icons (When No Match)
For icons without direct Solar equivalents, create custom SVG components:

```tsx
// src/components/icons/CustomDotIcon.tsx
export const DotIcon = ({ className }: { className?: string }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="currentColor"
    xmlns="http://www.w3.org/2000/svg"
  >
    <circle cx="12" cy="12" r="4" />
  </svg>
);
```

## Migration Priority

### Phase 1: Core UI Components (shadcn/ui) - HIGH PRIORITY
These are used throughout the app and should be migrated first:
- `src/components/ui/accordion.tsx` - ChevronDown
- `src/components/ui/breadcrumb.tsx` - ChevronRight, MoreHorizontal
- `src/components/ui/calendar.tsx` - ChevronLeft, ChevronRight
- `src/components/ui/carousel.tsx` - ArrowLeft, ArrowRight
- `src/components/ui/checkbox.tsx` - Check
- `src/components/ui/command.tsx` - Search
- `src/components/ui/context-menu.tsx` - Check, ChevronRight, Circle
- `src/components/ui/dialog.tsx` - X
- `src/components/ui/dropdown-menu.tsx` - Check, ChevronRight, Circle
- `src/components/ui/input-otp.tsx` - Dot (custom SVG needed)
- `src/components/ui/menubar.tsx` - Check, ChevronRight, Circle
- `src/components/ui/navigation-menu.tsx` - ChevronDown
- `src/components/ui/pagination.tsx` - ChevronLeft, ChevronRight, MoreHorizontal
- `src/components/ui/radio-group.tsx` - Circle
- `src/components/ui/resizable.tsx` - GripVertical (custom SVG needed)
- `src/components/ui/select.tsx` - Check, ChevronDown, ChevronUp
- `src/components/ui/sheet.tsx` - X
- `src/components/ui/sidebar.tsx` - PanelLeft
- `src/components/ui/toast.tsx` - X

### Phase 2: Feature Components - MEDIUM PRIORITY
- `src/components/EditableAvatar.tsx` - Camera, Loader2
- `src/components/SearchFilters.tsx` - Search, X, Filter, RefreshCw
- `src/components/CreateIncidentModal.tsx` - X, Search, Upload, FileText, ChevronLeft, Check
- `src/components/IncidentDetailsModal.tsx` - X, ExternalLink, Edit, User
- `src/components/NotificationsList.tsx` - Calendar, MessageSquare, Bell, Info
- `src/components/FAQSection.tsx` - Plus, Minus, Send
- `src/components/StatCard.tsx` - TrendingUp, TrendingDown
- `src/components/WhySupport24Section.tsx` - Shield, Users, Calendar, Star, ShieldCheck
- `src/components/ContactSection.tsx` - Mail
- `src/components/LocationFilter.tsx` - MapPin
- Analytics components (RealTimeMetrics, ComparisonCard, ChartCard, etc.)

### Phase 3: Page Components - MEDIUM PRIORITY
- Auth pages (Login, Register, ResetPassword, ForgotPassword, etc.)
- Dashboard pages (AdminDashboard, SupportWorkerDashboard, ParticipantDashboard, etc.)
- Management pages (ShiftDetails, IncidentsPage, etc.)
- Policy pages (PrivacyPolicy, TermsOfUse, etc.)

### Phase 4: Admin Components - LOWER PRIORITY
- Service category management
- Timesheet management
- Batch invoice management
- Invite management

### Phase 5: Constants & Configuration
- `src/constants/landingpage.ts` - BadgeCheck, Headset, Settings2

## Automated Migration Script

Create a migration helper script:

```bash
# Find all files with lucide-react imports
grep -r "from \"lucide-react\"" src/ --files-with-matches

# Count total files to migrate
grep -r "from \"lucide-react\"" src/ --files-with-matches | wc -l
```

## Testing Checklist

After migration, verify:
- [ ] All icons render correctly
- [ ] Icon sizes are consistent
- [ ] Colors inherit properly from parent (currentColor)
- [ ] Hover states work correctly
- [ ] No console errors
- [ ] Icons in buttons look correct
- [ ] Icons in forms align properly
- [ ] Modal close buttons work
- [ ] Dropdown chevrons animate correctly
- [ ] Loading spinners animate
- [ ] Success/error icons show correct states

## Common Migration Patterns

### Pattern 1: Auth Forms (Eye Icons)
```tsx
// Before
import { Eye, EyeOff } from "lucide-react";

// After  
import { Eye, EyeClosed } from "@solar-icons/react";
```

### Pattern 2: Navigation (Back Button)
```tsx
// Before
import { ArrowLeft } from "lucide-react";

// After
import { AltArrowLeft } from "@solar-icons/react";
```

### Pattern 3: Close Buttons
```tsx
// Before
import { X } from "lucide-react";

// After
import { Close } from "@solar-icons/react";
// OR for squared version
import { CloseSquare } from "@solar-icons/react";
```

### Pattern 4: Status Indicators
```tsx
// Before
import { CheckCircle, AlertCircle, XCircle } from "lucide-react";

// After
import { CheckCircle, DangerCircle, CloseCircle } from "@solar-icons/react";
```

### Pattern 5: Loading Spinners
```tsx
// Before
import { Loader2 } from "lucide-react";
<Loader2 className="h-4 w-4 animate-spin" />

// After
import { Refresh } from "@solar-icons/react";
<Refresh className="h-4 w-4 animate-spin" />
```

## Files Requiring Attention

### Files Already Using Solar Icons ✅
These files are already migrated and can serve as examples:
- `src/App.tsx` - SolarProvider setup
- `src/pages/Login.tsx` - Eye, EyeClosed
- `src/pages/ProviderJobsPage.tsx` - Multiple Solar icons
- `src/pages/SupportWorkerDashboard.tsx` - Comprehensive usage
- `src/constants/shift-types.ts` - User, UsersGroupRounded, Repeat

### Files Using Mixed Icons ⚠️
These files use both Lucide and Solar and should be standardized:
- `src/pages/Conversations.tsx` - Has Bell, Magnifer, Filter (Solar) + Plus (Lucide)
- `src/pages/ChatView.tsx` - Has Solar icons + Loader2, Plus (Lucide)
- `src/pages/ComplianceFormPage.tsx` - Has FileText (Solar) + Check, ArrowLeft (Lucide)
- `src/pages/ForgotPassword.tsx` - Has AltArrowRight (Solar) + ArrowLeft, CheckCircle (Lucide)
- `src/pages/ParticipantShifts.tsx` - Has Solar icons + ClipboardCheck (Lucide - already in Solar)

### High-Impact Files (Used Across App)
Prioritize these for immediate migration:
1. `src/components/ui/*` - All shadcn/ui components
2. `src/components/layouts/Footer.tsx`
3. `src/components/SearchFilters.tsx`
4. `src/components/StatCard.tsx`

## Icon Size Standards (From Design System)

Use these standardized sizes:
```tsx
import { ICON_SIZES } from "@/constants/design-system";

// XS - 12px
<Icon className={ICON_SIZES.xs} />

// SM - 14px  
<Icon className={ICON_SIZES.sm} />

// BASE - 16px
<Icon className={ICON_SIZES.base} />

// MD - 18px
<Icon className={ICON_SIZES.md} />

// LG - 20px
<Icon className={ICON_SIZES.lg} />

// XL - 24px
<Icon className={ICON_SIZES.xl} />

// 2XL - 32px
<Icon className={ICON_SIZES["2xl"]} />

// 3XL - 48px
<Icon className={ICON_SIZES["3xl"]} />
```

## Custom Icons Needed

Create these custom SVG components when Solar doesn't have a match:

1. **DotIcon** - For OTP input (currently using Lucide `Dot`)
2. **GripVerticalIcon** - For resizable panels (currently using Lucide `GripVertical`)

Example implementation in `src/components/icons/`:
```tsx
// src/components/icons/index.tsx
export { DotIcon } from './DotIcon';
export { GripVerticalIcon } from './GripVerticalIcon';
```

## Final Cleanup

After complete migration:
1. Remove lucide-react from package.json
2. Run: `pnpm remove lucide-react`
3. Search for any remaining lucide imports: `grep -r "lucide-react" src/`
4. Run full test suite
5. Visual regression testing
6. Update documentation

## Resources

- **Solar Icons Documentation**: https://solar-icons.vercel.app/
- **Current Solar Provider Setup**: `src/App.tsx`
- **Icon Size Constants**: `src/constants/design-system.ts`

## Migration Progress Tracking

Create a checklist in your project management tool:
- [ ] Phase 1: Core UI Components (20 files)
- [ ] Phase 2: Feature Components (15 files)
- [ ] Phase 3: Page Components (30+ files)
- [ ] Phase 4: Admin Components (15 files)
- [ ] Phase 5: Constants (1 file)
- [ ] Create custom icons (2 components)
- [ ] Remove lucide-react dependency
- [ ] Update documentation
- [ ] Full testing pass
