# UI/UX Design Skill

## TRIGGER CONDITIONS
Use this skill when the user asks to:
- Design user interfaces (apps, SaaS dashboards, mobile apps)
- Create UX flows, user journeys, or wireframes
- Conduct or plan user research (interviews, surveys, usability tests)
- Build or document design systems and component libraries
- Write UX copy (microcopy, empty states, error messages, onboarding)
- Audit existing UI/UX for problems
- Create information architecture or navigation structures
- Design onboarding flows, modals, tooltips, or interactive patterns
- Prototype interactions or define animation/transition specs
- Describe Figma component structures or Auto Layout rules

---

## STEP 1 — UX RESEARCH FOUNDATION

### User Research Methods by Project Stage

| Stage | Method | Time | Output |
|-------|--------|------|--------|
| Discovery | Stakeholder interviews | 1–2 weeks | Problem definition |
| Discovery | Competitor analysis | 3–5 days | Opportunity map |
| Define | User interviews (5–8 users) | 1–2 weeks | Pain points, needs |
| Define | Survey (50+ responses) | 1 week | Quantitative validation |
| Ideate | Card sorting | 2–3 days | IA structure |
| Test | Usability testing (5 users) | 1 week | Usability issues |
| Test | A/B testing | 2+ weeks | Conversion data |
| Post-launch | Analytics review | Ongoing | Usage patterns |

### User Interview Framework
```
Opening (5 min):
- "Tell me about your role and a typical day"
- "What tools do you use most?"

Context (10 min):
- "Walk me through the last time you [did the task]"
- "What was frustrating about that?"
- "What worked well?"

Deep dive (20 min):
- "Why do you do it that way?"
- "What would your ideal solution look like?"
- "How do you currently work around this problem?"

Closing (5 min):
- "Is there anything I haven't asked that's important?"
- "Who else should I talk to?"
```

### Persona Template
```markdown
## Persona: [Name]

**Role:** [Job title]
**Age:** [Range]
**Tech comfort:** [Low / Medium / High]

**Goals:**
- Primary: [What they ultimately want to achieve]
- Secondary: [Supporting goals]

**Pain Points:**
- [Frustration 1]
- [Frustration 2]
- [Frustration 3]

**Behaviors:**
- Uses [tools/apps] daily
- Prefers [communication style]
- Makes decisions based on [criteria]

**Quote:** "..." [Real quote from research]

**Success looks like:** [What a perfect outcome means to them]
```

---

## STEP 2 — INFORMATION ARCHITECTURE

### IA Principles
1. **Findability**: Users can find what they need in 3 clicks or fewer
2. **Clarity**: Category names match users' mental models (not company jargon)
3. **Scalability**: Structure works when content grows 10x
4. **Consistency**: Same type of content always lives in the same place

### Navigation Patterns

**Top nav (horizontal):** Best for 5–7 main sections, desktop-first
```
[Logo] [Nav 1] [Nav 2] [Nav 3] [Nav 4] [Nav 5]    [CTA] [Avatar]
```

**Side nav (vertical):** Best for apps and dashboards with many sections
```
[Logo]
─────
● Dashboard
  Analytics
  Reports
─────
● Projects
  Active (12)
  Archived
─────
● Team
  Members
  Permissions
─────
[Settings]
[Help]
[User]
```

**Tab nav (mobile):** Max 5 items, most important = center or first
```
[🏠 Home] [🔍 Search] [➕ Create] [📥 Inbox] [👤 Profile]
```

### Site Map Format
```
Home
├── Products
│   ├── Product Category A
│   │   ├── Product 1
│   │   └── Product 2
│   └── Product Category B
├── About
│   ├── Our Story
│   └── Team
├── Pricing
├── Blog
│   ├── Category 1
│   └── Category 2
└── Contact
```

---

## STEP 3 — USER FLOW DESIGN

### Flow Notation
```
[Rectangle] = Screen / Page
(Diamond)   = Decision point
[Rounded]   = Action / Event
→           = User action leading to next step
✗           = Error / failure path
✓           = Success path
```

### Core Flow Templates

**Onboarding Flow:**
```
Sign Up Form
  → Email Verification
    → Welcome Screen
      → [Personalization questions 1–3]
        → Import/connect data? 
          ✓ → Connect integrations → Setup complete
          ✗ → Skip → Setup complete
            → First-use empty state with guided action
```

**Checkout Flow (e-commerce):**
```
Cart Review
  → Guest/Login choice
    → Shipping address
      → Shipping method
        → Payment
          → Order review
            ✓ → Confirmation page + email
            ✗ Payment failed → Error + retry options
```

**Error Recovery Flows:**
```
Always include:
- What went wrong (clear, specific)
- Why it happened (brief)
- What to do next (actionable)
- Exit path (don't trap users)
```

---

## STEP 4 — WIREFRAMING PRINCIPLES

### Wireframe Fidelity Levels

**Lo-fi (sketches/boxes):**
- Use for: early ideation, stakeholder alignment
- Tools: pen & paper, Balsamiq, FigJam
- Don't include: colors, real content, final typography

**Mid-fi (grayscale):**
- Use for: UX validation, usability testing
- Tools: Figma (shapes + real content)
- Include: layout, spacing, real copy, component placement

**Hi-fi (pixel-perfect):**
- Use for: developer handoff, client approval
- Tools: Figma with full design system
- Include: everything — colors, fonts, interactions, states

### Wireframe Annotation Format
```
[Component name]
Purpose: Why this exists
Behavior: What happens on interaction
States: Default | Hover | Active | Disabled | Error | Loading | Empty
Content rules: Character limits, content types allowed
```

---

## STEP 5 — DESIGN SYSTEM ARCHITECTURE

### Component Hierarchy (Atomic Design)
```
Atoms (base elements)
├── Colors (palette)
├── Typography (scale)
├── Spacing (scale)
├── Icons (library)
├── Shadows (levels)
└── Border radius (scale)

Molecules (simple components)
├── Button (primary, secondary, ghost, destructive)
├── Input (text, textarea, select, checkbox, radio)
├── Badge (status indicators)
├── Avatar (sizes + states)
└── Tag/Chip

Organisms (complex components)
├── Navigation (top nav, side nav, breadcrumb)
├── Card (product, content, stats, user)
├── Table (data table, sortable, paginated)
├── Modal (dialog, drawer, tooltip, popover)
├── Form (login, signup, settings)
└── Data visualization (chart, progress, stats)

Templates (page layouts)
├── Dashboard layout
├── Settings layout
├── Marketing page layout
└── Auth layout

Pages (final screens)
```

### Component Documentation Template
```markdown
## [Component Name]

**Purpose:** What this component is for

**Usage:** When to use vs. alternatives

**Variants:**
- Size: sm | md | lg
- State: default | hover | active | disabled | loading
- Type: primary | secondary | destructive

**Props (Figma):**
- label: string
- size: sm | md | lg
- disabled: boolean
- icon: optional

**Spacing:** Internal padding, margin rules

**Accessibility:**
- ARIA role: button
- Keyboard: Enter/Space to activate
- Focus: visible ring 2px offset

**Do:** [Example of correct usage]
**Don't:** [Example of incorrect usage]
```

---

## STEP 6 — UI PATTERNS LIBRARY

### Form Design
```
Label position: Above field (not placeholder-only)
Label style: 14px medium, #374151
Input height: 40px (sm), 44px (md), 48px (lg)
Border: 1px solid #D1D5DB, focus: 2px #3B82F6
Error: Red border + icon + message below field
Helper text: 12px #6B7280, below field
Required indicator: Asterisk (*) next to label

Validation timing:
- Show errors: on blur (not on type)
- Clear errors: on type (immediate feedback)
- Submit validation: on submit attempt
```

### Empty States
```
Structure:
[Illustration or icon — 80–120px]
[Title — "No projects yet"]
[Description — Explain what this section is for]
[Primary CTA — "Create your first project"]
[Secondary — optional "Learn more"]

Tone: Helpful and encouraging, not apologetic
Never: "Nothing here", "No data found", "Error 404"
```

### Loading States
```
Skeleton screens (preferred over spinners):
- Match the shape of actual content
- Animate with shimmer effect
- Show for loads > 300ms

Inline loaders:
- Button loading: replace text with spinner + "Loading..."
- Data refresh: subtle spinner in corner, don't block UI

Progress bars:
- Use for: file upload, multi-step processes, background tasks
- Always show estimated time if > 5 seconds
```

### Error Messages
```
Bad:  "Error 403"
Bad:  "Something went wrong"
Good: "You don't have permission to view this project. Ask your admin for access."

Formula: [What] + [Why] + [What to do]
"Your session expired (What) because you were inactive for 30 minutes (Why). 
Sign in again to continue (What to do)."
```

### Toast / Notification Messages
```
Success: ✅ Green — "Project saved"
Error:   ❌ Red — "Couldn't save. Try again."
Warning: ⚠️ Yellow — "This will affect 12 team members"
Info:    ℹ️ Blue — "New version available"

Position: Top-right (desktop), Bottom-center (mobile)
Duration: 3–5s for info, persistent for errors
Max: 3 toasts at once
```

---

## STEP 7 — MOBILE UX PRINCIPLES

### Touch Target Rules
```
Minimum touch target: 44x44px (Apple HIG) / 48x48dp (Material)
Spacing between targets: minimum 8px
Thumb zones:
  ✅ Easy reach: bottom 60% of screen
  ⚠️ Hard reach: top corners
  ❌ Don't put primary actions in top corners
```

### Mobile Navigation Patterns
```
Tab bar: 3–5 items, icons + labels
Hamburger: Only for secondary navigation (not primary)
Bottom sheet: For contextual actions and forms
Pull to refresh: For content feeds
Swipe: For list item actions (delete, archive)
```

### Gesture Vocabulary
```
Tap: Primary action, selection
Double tap: Zoom, like (Instagram pattern)
Long press: Context menu, reorder
Swipe left/right: Navigate, dismiss, reveal actions
Swipe up/down: Scroll, dismiss modal
Pinch: Zoom in/out
```

---

## STEP 8 — INTERACTION DESIGN & ANIMATION

### Animation Principles (Disney's 12 Principles applied to UI)
```
Duration guide:
- Micro-interactions: 100–200ms (button press, toggle)
- Element transitions: 200–300ms (modal open, dropdown)
- Page transitions: 300–500ms (route change)
- Emphasis animations: 400–600ms (success state)
- Never: > 700ms for functional animations
```

### Easing Functions
```css
/* Entrances: ease-out (starts fast, ends slow — feels natural) */
transition: all 300ms cubic-bezier(0, 0, 0.2, 1);

/* Exits: ease-in (starts slow, ends fast — gets out of the way) */
transition: all 200ms cubic-bezier(0.4, 0, 1, 1);

/* Both: ease-in-out (smooth movement) */
transition: all 300ms cubic-bezier(0.4, 0, 0.2, 1);

/* Spring/bounce (delight, not functional) */
transition: all 500ms cubic-bezier(0.34, 1.56, 0.64, 1);
```

### State Transition Specs
```
Modal open:
  - Overlay: fade in 200ms ease-out, opacity 0→0.5
  - Modal: scale 0.95→1 + fade in 250ms ease-out
  
Modal close:
  - Overlay: fade out 150ms ease-in
  - Modal: scale 1→0.95 + fade out 150ms ease-in

Dropdown:
  - Open: translateY(-4px)→0 + fade in 150ms ease-out
  - Close: fade out 100ms ease-in

Page transition:
  - Old page: fade out + translateX(-20px) 200ms ease-in
  - New page: fade in + translateX(20px)→0 200ms ease-out
```

---

## STEP 9 — ACCESSIBILITY (WCAG 2.1 AA)

### Checklist
```
Color & Contrast:
☐ Normal text: 4.5:1 contrast ratio minimum
☐ Large text (18pt+): 3:1 contrast ratio minimum
☐ UI components: 3:1 against background
☐ Never use color alone to convey information

Keyboard Navigation:
☐ All interactive elements keyboard-accessible
☐ Logical tab order (matches visual order)
☐ Visible focus indicator on all interactive elements
☐ Skip-to-content link at top of page
☐ No keyboard traps

Screen Readers:
☐ All images have alt text (or alt="" for decorative)
☐ Icon buttons have aria-label
☐ Form inputs have associated labels
☐ Error messages linked to inputs (aria-describedby)
☐ Modals trap focus and announce to screen readers
☐ Live regions for dynamic content updates

Content:
☐ Reading level: aim for Grade 8 or below
☐ Instructions don't rely on color/shape/position alone
☐ Links are descriptive ("Learn more about pricing" not "Click here")
```

### ARIA Quick Reference
```html
<!-- Button with icon only -->
<button aria-label="Close dialog">
  <svg aria-hidden="true">...</svg>
</button>

<!-- Status message -->
<div role="alert" aria-live="polite">
  File uploaded successfully
</div>

<!-- Progress -->
<div role="progressbar" aria-valuenow="75" aria-valuemin="0" aria-valuemax="100">
  75%
</div>

<!-- Navigation -->
<nav aria-label="Main navigation">...</nav>
<nav aria-label="Breadcrumb">...</nav>
```

---

## STEP 10 — FIGMA BEST PRACTICES

### File Structure
```
📁 [Project Name]
├── 📄 Cover (thumbnail)
├── 📄 _Design System (components, styles)
├── 📄 Research (personas, user flows, IA)
├── 📄 Wireframes (lo-fi → mid-fi)
├── 📄 [Feature 1] — Designs
├── 📄 [Feature 2] — Designs
└── 📄 Handoff (specs, assets, notes)
```

### Component Naming Convention
```
[Category]/[Component]/[Variant]/[State]

Examples:
Button/Primary/Large/Default
Button/Primary/Large/Hover
Button/Primary/Large/Disabled
Input/Text/Default/Error
Card/Product/Horizontal/Default
Navigation/Side/Item/Active
```

### Auto Layout Rules
```
Use Auto Layout for:
- All buttons (horizontal, with padding)
- All cards (vertical or horizontal)
- All navigation items
- Lists and repeated elements
- Any component that contains text

Padding standard:
- sm buttons: 8px 16px
- md buttons: 10px 20px
- lg buttons: 14px 28px
- Cards: 16–24px all sides
```

### Developer Handoff Checklist
```
☐ All components use Auto Layout
☐ All colors linked to Styles or Variables
☐ All text uses Text Styles
☐ All effects use Effect Styles
☐ Interactive components have all states
☐ Prototype flows linked for all main user journeys
☐ Assets exported at 1x, 2x, 3x (or SVG)
☐ Spacing annotations added for complex layouts
☐ Interaction notes in comments
```

---

## TOOLS ECOSYSTEM

### Design
- **Figma** — primary design + prototyping tool
- **FigJam** — whiteboarding, user flows, IA
- **Framer** — high-fidelity prototypes with real interactions

### Research
- **Maze** — unmoderated usability testing
- **Hotjar** — heatmaps, session recordings
- **Typeform** — user surveys
- **Dovetail** — research repository and synthesis

### Accessibility
- **Stark** (Figma plugin) — contrast checker
- **Axe** (browser extension) — accessibility audit
- **WAVE** — web accessibility evaluation

### Handoff
- **Zeplin** — design specs for developers
- **Figma Dev Mode** — native handoff within Figma

---

## EXAMPLES OF TRIGGER PHRASES

- "Зроби UX flow для онбордингу"
- "Спроектуй компонент таблиці для дашборду"
- "Як організувати навігацію в SaaS?"
- "Напиши мікрокопі для empty state"
- "Аудит UX мого мобільного додатку"
- "Структура design system для стартапу"
- "Wireframe сторінки налаштувань"
- "Accessibility чеклист для форми"
- "Figma компонент з Auto Layout"
- "User journey map для e-commerce"
