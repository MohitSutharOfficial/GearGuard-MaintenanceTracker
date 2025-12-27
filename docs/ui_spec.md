# UI Specification Document

## Design Philosophy

GearGuard follows Odoo's ERP design principles:
- **Dense Information Display**: Maximize data visibility
- **Professional Aesthetic**: Clean, business-focused interface
- **Action-Oriented**: Primary actions always visible
- **Consistent Patterns**: Reusable components and layouts
- **Keyboard Friendly**: Full keyboard navigation support

## Design System

### Color Palette

```css
/* Primary Colors */
--odoo-primary: #714B67;      /* Purple - Primary actions */
--odoo-primary-hover: #5a3b52; /* Darker purple for hover */
--odoo-primary-light: #f5f0f4; /* Light purple for backgrounds */

/* Status Colors */
--odoo-success: #28a745;      /* Green - Success, Active */
--odoo-warning: #ffc107;      /* Yellow - Warning, Pending */
--odoo-danger: #dc3545;       /* Red - Error, Urgent, Overdue */
--odoo-info: #17a2b8;         /* Blue - Info, In Progress */

/* Neutral Colors */
--odoo-gray-50: #f8f9fa;      /* Lightest gray */
--odoo-gray-100: #e9ecef;     /* Light gray borders */
--odoo-gray-300: #dee2e6;     /* Medium gray */
--odoo-gray-600: #6c757d;     /* Text secondary */
--odoo-gray-900: #212529;     /* Text primary */

/* Background */
--odoo-bg-light: #f8f9fa;     /* Page background */
--odoo-bg-white: #ffffff;     /* Card background */
```

### Typography

```css
/* Font Family */
font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

/* Font Sizes */
--text-xs: 0.75rem;    /* 12px - Labels, captions */
--text-sm: 0.875rem;   /* 14px - Body text */
--text-base: 1rem;     /* 16px - Default */
--text-lg: 1.125rem;   /* 18px - Headings */
--text-xl: 1.25rem;    /* 20px - Page titles */
--text-2xl: 1.5rem;    /* 24px - Dashboard headers */

/* Font Weights */
--font-normal: 400;
--font-medium: 500;
--font-semibold: 600;
--font-bold: 700;
```

### Spacing Scale

```css
--space-1: 0.25rem;   /* 4px */
--space-2: 0.5rem;    /* 8px */
--space-3: 0.75rem;   /* 12px */
--space-4: 1rem;      /* 16px */
--space-5: 1.25rem;   /* 20px */
--space-6: 1.5rem;    /* 24px */
--space-8: 2rem;      /* 32px */
--space-10: 2.5rem;   /* 40px */
```

### Border Radius

```css
--radius-sm: 0.25rem;   /* 4px - Badges */
--radius-md: 0.5rem;    /* 8px - Buttons, cards */
--radius-lg: 0.75rem;   /* 12px - Modals */
```

### Shadows

```css
--shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
--shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
--shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
--shadow-xl: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
```

## Component Library

### Button Component

**Variants**:

```tsx
// Primary - Main actions
<Button variant="primary">
  Create Request
</Button>

// Secondary - Secondary actions  
<Button variant="secondary">
  Cancel
</Button>

// Danger - Destructive actions
<Button variant="danger">
  Delete
</Button>

// Ghost - Tertiary actions
<Button variant="ghost">
  View Details
</Button>
```

**Sizes**:
```tsx
<Button size="sm">Small</Button>      // Height: 32px
<Button size="md">Medium</Button>     // Height: 40px (default)
<Button size="lg">Large</Button>      // Height: 48px
```

**States**:
- Default
- Hover (darken 10%)
- Active (darken 15%)
- Disabled (opacity 50%, cursor not-allowed)
- Loading (spinner icon, disabled)

**Visual Specs**:
- Font: 14px, medium weight
- Padding: 12px 24px (medium)
- Border radius: 8px
- Transition: all 200ms ease

### Card Component

**Structure**:
```tsx
<Card>
  <CardHeader>Equipment Details</CardHeader>
  <CardContent>
    {/* Card content */}
  </CardContent>
  <CardFooter>
    {/* Actions */}
  </CardFooter>
</Card>
```

**Visual Specs**:
- Background: white
- Border: 1px solid gray-100
- Border radius: 8px
- Padding: 20px
- Shadow: shadow-sm
- Hover: shadow-md (for clickable cards)

### Badge Component

**Status Badges**:
```tsx
<Badge variant="success">Active</Badge>
<Badge variant="warning">Under Repair</Badge>
<Badge variant="danger">Scrapped</Badge>
<Badge variant="info">In Progress</Badge>
```

**Visual Specs**:
- Font: 12px, medium weight
- Padding: 4px 12px
- Border radius: 4px
- Text transform: capitalize
- Display: inline-flex, align-items: center

**Color Mapping**:
- Success: Green background (#28a745, 10% opacity), green text
- Warning: Yellow background, dark text
- Danger: Red background (10% opacity), red text
- Info: Blue background (10% opacity), blue text

### Input Component

**Variants**:
```tsx
// Text input
<Input type="text" label="Equipment Name" />

// Select dropdown
<Select label="Category" options={categories} />

// Textarea
<TextArea label="Description" rows={4} />

// Date picker
<Input type="date" label="Scheduled Date" />
```

**Visual Specs**:
- Height: 40px
- Border: 1px solid gray-300
- Border radius: 8px
- Padding: 10px 12px
- Font: 14px
- Focus: 2px primary border, remove outline

**States**:
- Default
- Hover (border gray-400)
- Focus (border primary, shadow-sm)
- Error (border danger, red text helper)
- Disabled (background gray-50, cursor not-allowed)

**Label**:
- Font: 14px, medium weight
- Color: gray-700
- Margin bottom: 8px
- Required indicator: red asterisk

### Modal Component

**Structure**:
```tsx
<Modal isOpen={true} onClose={handleClose}>
  <ModalHeader>Create Maintenance Request</ModalHeader>
  <ModalBody>
    {/* Form fields */}
  </ModalBody>
  <ModalFooter>
    <Button variant="secondary" onClick={onClose}>Cancel</Button>
    <Button variant="primary" onClick={onSubmit}>Submit</Button>
  </ModalFooter>
</Modal>
```

**Visual Specs**:
- Backdrop: rgba(0, 0, 0, 0.5)
- Modal: white, border-radius 12px
- Max width: 600px (medium), 800px (large)
- Padding: 24px
- Shadow: shadow-xl
- Animation: fade in + scale up (200ms)

**Close Behavior**:
- Click backdrop → Close
- Press Escape → Close
- Click X button → Close

## Page Layouts

### 1. Dashboard

**Layout Structure**:
```
┌────────────────────────────────────────────────────┐
│ Header (GearGuard logo, Navigation)                │
├────────────────────────────────────────────────────┤
│ Page Title: "Dashboard"                            │
├────────────────────────────────────────────────────┤
│ ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌────────┐│
│ │Equipment │ │  Open    │ │  Teams   │ │  Avg   ││
│ │   125    │ │Requests  │ │    12    │ │Response││
│ │          │ │    18    │ │          │ │ 4.2hrs ││
│ └──────────┘ └──────────┘ └──────────┘ └────────┘│
├────────────────────────────────────────────────────┤
│ ┌─────────────────────┐ ┌──────────────────────┐ │
│ │ Requests by Status  │ │ Requests by Category │ │
│ │ (Bar Chart)         │ │ (Pie Chart)          │ │
│ │                     │ │                      │ │
│ └─────────────────────┘ └──────────────────────┘ │
├────────────────────────────────────────────────────┤
│ ┌──────────────────────────────────────────────┐  │
│ │ Monthly Request Trends (Line Chart)         │  │
│ │                                              │  │
│ └──────────────────────────────────────────────┘  │
└────────────────────────────────────────────────────┘
```

**KPI Cards**:
- Width: 25% each (4 columns on desktop)
- Height: 120px
- Icon: Top-left corner
- Value: Large font (32px), bold
- Label: Small font (14px), gray

**Charts**:
- Bar Chart: Full width, height 300px
- Pie Chart: Width 50%, height 300px
- Line Chart: Full width, height 300px
- Library: Recharts
- Colors: Match status colors

### 2. Kanban Board

**Layout Structure**:
```
┌────────────────────────────────────────────────────────────────────┐
│ Header (GearGuard logo, Navigation)                                │
├────────────────────────────────────────────────────────────────────┤
│ ┌─────────────────────────────────────────┐ [New Request]          │
│ │ Maintenance Requests (Kanban)           │                        │
│ └─────────────────────────────────────────┘                        │
├────────────────────────────────────────────────────────────────────┤
│ ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐              │
│ │   NEW    │ │    IN    │ │ REPAIRED │ │  SCRAP   │              │
│ │    (3)   │ │ PROGRESS │ │    (8)   │ │   (2)    │              │
│ ├──────────┤ ├──────────┤ ├──────────┤ ├──────────┤              │
│ │┌────────┐│ │┌────────┐│ │┌────────┐│ │┌────────┐│              │
│ ││Request ││ ││Request ││ ││Request ││ ││Request ││              │
│ ││Card 1  ││ ││Card 4  ││ ││Card 7  ││ ││Card 10 ││              │
│ │└────────┘│ │└────────┘│ │└────────┘│ │└────────┘│              │
│ │┌────────┐│ │┌────────┐│ │┌────────┐│ │┌────────┐│              │
│ ││Request ││ ││Request ││ ││Request ││ ││Request ││              │
│ ││Card 2  ││ ││Card 5  ││ ││Card 8  ││ ││Card 11 ││              │
│ │└────────┘│ │└────────┘│ │└────────┘│ │└────────┘│              │
│ │          │ │          │ │          │ │          │              │
│ └──────────┘ └──────────┘ └──────────┘ └──────────┘              │
└────────────────────────────────────────────────────────────────────┘
```

**Column Specs**:
- Width: 25% each (4 columns)
- Background: Gray-50
- Border: 1px solid gray-200
- Padding: 16px
- Min height: 500px

**Column Header**:
- Font: 14px, bold, uppercase
- Color: Gray-700
- Count badge: Gray-600 background, white text

**Request Card**:
- Background: White
- Border: 1px solid gray-200
- Border radius: 8px
- Padding: 16px
- Margin bottom: 12px
- Shadow: shadow-sm
- Cursor: grab (draggable)
- Hover: shadow-md

**Card Content**:
```
┌────────────────────────────┐
│ Subject (bold, 16px)       │
│ Equipment Name (gray, 14px)│
│ ┌──────────────┐           │
│ │ Priority: High│ [Avatar] │
│ └──────────────┘           │
│ ⚠️ Overdue (red, if true)  │
└────────────────────────────┘
```

**Drag and Drop**:
- Library: react-beautiful-dnd
- Drag handle: Entire card
- Drop zones: Column backgrounds
- Visual feedback: Card shadow increases, column highlights

### 3. Calendar View

**Layout Structure**:
```
┌────────────────────────────────────────────────────────────┐
│ Header (GearGuard logo, Navigation)                        │
├────────────────────────────────────────────────────────────┤
│ ┌────────────────────────────────────────┐                 │
│ │ Preventive Maintenance Calendar        │                 │
│ └────────────────────────────────────────┘                 │
├────────────────────────────────────────────────────────────┤
│ ◀ December 2024 ▶              [Today]  [New Maintenance]  │
├────────────────────────────────────────────────────────────┤
│ ┌────┬────┬────┬────┬────┬────┬────┐                      │
│ │ Su │ Mo │ Tu │ We │ Th │ Fr │ Sa │                      │
│ ├────┼────┼────┼────┼────┼────┼────┤                      │
│ │    │    │    │    │    │ 1  │ 2  │                      │
│ ├────┼────┼────┼────┼────┼────┼────┤                      │
│ │ 3  │ 4  │ 5  │ 6  │ 7  │ 8  │ 9  │                      │
│ │    │    │[PM]│    │    │[PM]│    │                      │
│ ├────┼────┼────┼────┼────┼────┼────┤                      │
│ │ 10 │ 11 │ 12 │ 13 │ 14 │ 15 │ 16 │                      │
│ │    │[PM]│    │[PM]│    │    │    │                      │
│ └────┴────┴────┴────┴────┴────┴────┘                      │
└────────────────────────────────────────────────────────────┘
```

**Calendar Specs**:
- Grid: 7 columns × 6 rows
- Cell size: 14.28% width, 100px height
- Border: 1px solid gray-200
- Today: Purple border, light purple background

**Day Cell**:
- Date: Top-left, 14px, gray-700
- Events: Below date, max 3 visible
- "...+2 more" if > 3 events
- Hover: Background gray-50, cursor pointer

**Event Badge**:
- Background: Primary color (light)
- Text: Dark, 12px
- Padding: 4px 8px
- Border radius: 4px
- Truncate with ellipsis if too long

**Month Navigation**:
- Previous/Next: Arrow buttons
- Month/Year: Center, 18px, bold
- Today button: Jump to current month

### 4. Equipment List

**Layout Structure**:
```
┌──────────────────────────────────────────────────────────┐
│ Header (GearGuard logo, Navigation)                      │
├──────────────────────────────────────────────────────────┤
│ Equipment Management              [New Equipment]        │
├──────────────────────────────────────────────────────────┤
│ [Search: ___________________] [Filter: All Departments ▼]│
├──────────────────────────────────────────────────────────┤
│ ┌────────────────┐ ┌────────────────┐ ┌──────────────┐ │
│ │  CNC Machine   │ │ Forklift #3    │ │  HVAC Unit   │ │
│ │  CNC-001       │ │ FL-003         │ │  HVAC-012    │ │
│ │  Manufacturing │ │ Warehouse      │ │  HVAC        │ │
│ │  [Active]      │ │ [Under Repair] │ │  [Active]    │ │
│ │  📍 Floor A    │ │ 📍 Dock 2      │ │  📍 Roof     │ │
│ │  ⚠️ 2 Open     │ │ ⚠️ 1 Open      │ │  ✓ 0 Open    │ │
│ └────────────────┘ └────────────────┘ └──────────────┘ │
│ ┌────────────────┐ ┌────────────────┐ ┌──────────────┐ │
│ │  Lathe #5      │ │ Air Compressor │ │  Conveyor    │ │
│ │  ...           │ │ ...            │ │  ...         │ │
│ └────────────────┘ └────────────────┘ └──────────────┘ │
└──────────────────────────────────────────────────────────┘
```

**Search Bar**:
- Width: 300px
- Placeholder: "Search equipment by name or serial..."
- Icon: Magnifying glass (left)
- Clear button: X icon (right, appears when typing)

**Filter Dropdown**:
- Options: All Departments, Production, Warehouse, IT, HVAC
- Width: 200px
- Icon: Funnel icon

**Equipment Card**:
- Width: 32% (3 columns on desktop)
- Height: Auto
- Padding: 20px
- Cursor: Pointer
- Hover: Shadow-md, border primary

**Card Layout**:
- Name: 18px, bold
- Serial: 14px, gray, monospace font
- Category: 14px, badge
- Status: Badge (colored)
- Location: Icon + text
- Open requests: Warning badge if > 0

### 5. Equipment Detail

**Layout Structure**:
```
┌──────────────────────────────────────────────────────────┐
│ Header (GearGuard logo, Navigation)                      │
├──────────────────────────────────────────────────────────┤
│ ← Back to Equipment                                      │
├──────────────────────────────────────────────────────────┤
│ CNC Machine (CNC-001)                [Edit] [Delete]     │
│ [Active]                                                 │
├──────────────────────────────────────────────────────────┤
│ ┌────────────────────────────────────────────────────┐  │
│ │ Equipment Information                              │  │
│ │ Category: Manufacturing                            │  │
│ │ Department: Production                             │  │
│ │ Assigned To: John Smith                            │  │
│ │ Location: Factory Floor A                          │  │
│ │ Purchase Date: Jan 15, 2023                        │  │
│ │ Warranty Expiry: Jan 15, 2026                      │  │
│ │ Maintenance Team: Mechanical Team                  │  │
│ └────────────────────────────────────────────────────┘  │
├──────────────────────────────────────────────────────────┤
│ ┌──────────────────┐                                     │
│ │  Maintenance: 2  │ ← Smart Button                      │
│ └──────────────────┘                                     │
├──────────────────────────────────────────────────────────┤
│ Maintenance History                                      │
│ ┌────────────────────────────────────────────────────┐  │
│ │ ● Oil Leak Repair               [Repaired] 2h      │  │
│ │   Dec 20, 2024 → Dec 21, 2024                      │  │
│ │   Replaced gasket                                  │  │
│ ├────────────────────────────────────────────────────┤  │
│ │ ● Monthly Inspection            [Completed] 1.5h   │  │
│ │   Dec 15, 2024                                     │  │
│ │   All checks passed                                │  │
│ └────────────────────────────────────────────────────┘  │
└──────────────────────────────────────────────────────────┘
```

**Smart Button**:
- Background: Primary color
- Text: White, bold
- Count: Large, 24px
- Label: Small, 12px
- Padding: 16px 24px
- Click: Navigate to filtered request list

**Warning Banner** (if scrapped):
```
┌────────────────────────────────────────────────────────┐
│ ⚠️ This equipment is no longer operational             │
└────────────────────────────────────────────────────────┘
```
- Background: Red (10% opacity)
- Border: 1px solid red
- Icon: Warning triangle
- Text: Red, bold

**History Timeline**:
- Vertical line on left (2px, gray)
- Bullet points: Circle icons
- Request cards: White background, shadow-sm
- Most recent first

## Responsive Design

### Breakpoints

```css
/* Mobile */
@media (max-width: 640px) {
  /* Single column layouts */
  /* Stack KPI cards */
  /* Hide secondary info */
}

/* Tablet */
@media (min-width: 641px) and (max-width: 1024px) {
  /* 2 columns for cards */
  /* Simplified Kanban (swipe between columns) */
  /* Calendar: Agenda view */
}

/* Desktop */
@media (min-width: 1025px) {
  /* Full features */
  /* 4 column Kanban */
  /* Month view calendar */
}
```

### Mobile Adaptations

**Kanban Board**:
- Tabs instead of columns
- Swipe to switch stages
- Floating "New Request" button

**Calendar**:
- Agenda view (list of scheduled maintenance)
- Date picker for navigation

**Equipment List**:
- Single column
- Simplified cards
- Pull-to-refresh

## Accessibility

### WCAG 2.1 Level AA Compliance

**Color Contrast**:
- Text on white: 4.5:1 minimum
- Large text: 3:1 minimum
- Interactive elements: 3:1 minimum

**Keyboard Navigation**:
- Tab order: Logical, top to bottom, left to right
- Focus indicators: 2px outline, primary color
- Skip links: "Skip to main content"
- Shortcuts: Ctrl+K (search), N (new request)

**Screen Reader Support**:
- ARIA labels on icons
- ARIA live regions for dynamic content
- Semantic HTML (main, nav, article, section)
- Alt text for images

**Focus Management**:
- Modal open: Focus first input
- Modal close: Return focus to trigger
- Form submit: Focus first error or success message

---

**Document Maintained By**: Design Team  
**Last Updated**: December 2024  
**Version**: 1.0

## Out of Scope (UI)

This document does NOT define:
- Backend validation behavior
- API request/response formats
- Permission logic
- Business rule enforcement
- Database-driven constraints

These are handled by backend and domain documents.
