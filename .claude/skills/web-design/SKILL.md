# Web Design Skill

## TRIGGER CONDITIONS
Use this skill when the user asks to:
- Create, design, or redesign a website, landing page, or web interface
- Build UI components, navigation, hero sections, forms, cards, modals
- Design in a specific style: minimalist, brutalist, glassmorphism, neomorphism, retro, corporate, SaaS
- Create responsive layouts or mobile-first designs
- Generate design systems, color palettes, typography scales, spacing systems
- Review or critique existing web design
- Convert a Figma/mockup description into code
- Build marketing pages, product pages, portfolio sites, dashboards

## WHAT THIS SKILL PRODUCES
Production-grade HTML/CSS/JS or React components with high visual quality — avoiding generic, template-like AI aesthetics.

---

## STEP 1 — GATHER CONTEXT (if not provided)

Before designing, identify:
- **Purpose**: landing page / SaaS app / portfolio / e-commerce / blog / dashboard
- **Audience**: B2B / B2C / age group / technical level
- **Brand**: colors, fonts, logo, existing brand guidelines
- **Style direction**: minimal / bold / playful / corporate / luxury / tech
- **Key sections needed**: hero / features / pricing / testimonials / CTA / footer
- **Tech stack**: plain HTML+CSS / React+Tailwind / Vue / other

If unclear, default to: **React + Tailwind, modern SaaS aesthetic, dark/light mode support**.

---

## STEP 2 — DESIGN SYSTEM FIRST

Always establish before coding:

### Color System
```css
/* Primary palette */
--color-primary-50: #eff6ff;
--color-primary-500: #3b82f6;
--color-primary-900: #1e3a8a;

/* Neutral palette */
--color-neutral-0: #ffffff;
--color-neutral-50: #f8fafc;
--color-neutral-900: #0f172a;

/* Semantic */
--color-success: #22c55e;
--color-warning: #f59e0b;
--color-error: #ef4444;
```

### Typography Scale (use system or Google Fonts)
```
Display:  64px / 700 weight / -2px letter-spacing
H1:       48px / 700 weight / -1px letter-spacing
H2:       36px / 600 weight / -0.5px letter-spacing
H3:       24px / 600 weight / 0px letter-spacing
Body L:   18px / 400 weight / 0.1px letter-spacing
Body:     16px / 400 weight / 0.1px letter-spacing
Caption:  14px / 400 weight / 0.2px letter-spacing
```

### Spacing Scale (8px base)
```
xs:  4px   sm: 8px   md: 16px
lg: 24px   xl: 32px  2xl: 48px
3xl: 64px  4xl: 96px  5xl: 128px
```

### Shadow System
```css
--shadow-sm:  0 1px 2px rgba(0,0,0,0.05);
--shadow-md:  0 4px 6px rgba(0,0,0,0.07), 0 2px 4px rgba(0,0,0,0.06);
--shadow-lg:  0 10px 15px rgba(0,0,0,0.1), 0 4px 6px rgba(0,0,0,0.05);
--shadow-xl:  0 20px 25px rgba(0,0,0,0.1), 0 8px 10px rgba(0,0,0,0.04);
```

---

## STEP 3 — LAYOUT PRINCIPLES

### Grid System
- Desktop: 12-column grid, 1280px max-width container, 24px gutters
- Tablet: 8-column, 768px, 16px gutters
- Mobile: 4-column, full-width, 16px padding

### Responsive Breakpoints
```css
sm:  640px   /* Mobile landscape */
md:  768px   /* Tablet portrait */
lg:  1024px  /* Tablet landscape / small desktop */
xl:  1280px  /* Desktop */
2xl: 1536px  /* Large desktop */
```

### Visual Hierarchy Rules
1. One dominant element per section (size, color, or contrast)
2. Max 3 font sizes per section
3. Whitespace = content. Never fill every pixel
4. F-pattern or Z-pattern reading flow for content sections

---

## STEP 4 — SECTION PATTERNS

### Hero Section
**High-converting hero formula:**
- Headline: Clear value proposition (what + for whom + outcome) — max 10 words
- Subheadline: 1-2 sentences expanding on headline
- Primary CTA: Action verb + benefit ("Start free trial", "See how it works")
- Secondary CTA: Lower commitment ("Watch demo", "See pricing")
- Social proof: "Trusted by 10,000+ teams" or logo strip
- Hero visual: Product screenshot / illustration / abstract shape

```html
<!-- Hero structure -->
<section class="hero">
  <div class="hero__eyebrow">New · Version 2.0 released</div>
  <h1 class="hero__headline">Ship faster with<br><span class="gradient-text">AI-powered</span> workflows</h1>
  <p class="hero__subheadline">The all-in-one platform that automates your team's repetitive tasks so you can focus on what matters.</p>
  <div class="hero__cta-group">
    <button class="btn btn--primary btn--lg">Start free — no card needed</button>
    <button class="btn btn--ghost btn--lg">▶ Watch 2-min demo</button>
  </div>
  <div class="hero__social-proof">
    <span>★★★★★</span>
    <span>4.9/5 from 2,400+ reviews</span>
  </div>
</section>
```

### Feature Section Patterns
- **Grid cards**: 3-col grid, icon + title + description
- **Alternating**: Image left/right with text, alternating per row
- **Timeline**: Vertical or horizontal steps
- **Comparison**: Before/after or competitor comparison table

### Pricing Section
Always include:
- 3 tiers (Starter / Pro / Enterprise) — odd number anchors middle
- Highlight recommended plan (border, badge, scale up)
- Monthly/Annual toggle with savings callout
- Feature comparison checklist
- FAQ below pricing

### Testimonials
- Real photo + name + company + role
- Star rating
- Specific result quote ("Reduced our time by 60%")
- Logo of their company

### CTA Section (bottom of page)
- High contrast background (brand color or dark)
- Single focused headline
- One primary CTA
- Remove all navigation distractions

---

## STEP 5 — VISUAL STYLE RECIPES

### Modern SaaS (default)
```css
Background: #0f172a (dark) or #f8fafc (light)
Accent: Blue #3b82f6 or Purple #8b5cf6
Cards: rgba(255,255,255,0.05) with 1px border rgba(255,255,255,0.1)
Gradients: linear-gradient(135deg, #667eea 0%, #764ba2 100%)
Border-radius: 12px cards, 8px buttons, 999px pills
```

### Glassmorphism
```css
background: rgba(255, 255, 255, 0.1);
backdrop-filter: blur(20px);
border: 1px solid rgba(255, 255, 255, 0.2);
box-shadow: 0 8px 32px rgba(31, 38, 135, 0.37);
```

### Brutalist
```css
Background: #fff or #f5f5f5
Text: #000
Borders: 2-4px solid #000
Shadows: 4-8px offset, no blur: box-shadow: 4px 4px 0 #000
Font: bold grotesque (Space Grotesk, Instrument Sans)
No border-radius
```

### Luxury / Premium
```css
Background: #0a0a0a or #1a1a1a
Accent: Gold #c9a96e or Champagne #f5e6c8
Font: Serif (Playfair Display, Cormorant Garamond)
Spacing: Generous — lots of whitespace
Animations: Slow, elegant transitions (0.6s ease)
```

### Minimalist
```css
Max 2 colors (black + one accent)
Font: single typeface, weight variation only
Lots of whitespace (min 80px section padding)
No decorative elements, no gradients
Grid-based layout, strong alignment
```

---

## STEP 6 — MICRO-INTERACTIONS & ANIMATIONS

### Button States
```css
.btn {
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
}
.btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.4);
}
.btn:active {
  transform: translateY(0);
}
```

### Card Hover
```css
.card {
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}
.card:hover {
  transform: translateY(-4px);
  box-shadow: 0 20px 40px rgba(0,0,0,0.15);
}
```

### Scroll Animations (Intersection Observer)
```js
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('animate-in');
    }
  });
}, { threshold: 0.1 });

document.querySelectorAll('.animate-on-scroll').forEach(el => observer.observe(el));
```

### Loading States
- Skeleton screens over spinners
- Progressive image loading
- Optimistic UI updates

---

## STEP 7 — PERFORMANCE & ACCESSIBILITY

### Performance Checklist
- [ ] Images: WebP format, lazy loading, proper sizing
- [ ] Fonts: preconnect + font-display: swap
- [ ] CSS: critical CSS inline, rest deferred
- [ ] JS: defer non-critical, code splitting
- [ ] Core Web Vitals targets: LCP < 2.5s, CLS < 0.1, FID < 100ms

### Accessibility (WCAG 2.1 AA)
- [ ] Color contrast: 4.5:1 for normal text, 3:1 for large text
- [ ] All interactive elements keyboard-navigable
- [ ] Focus indicators visible
- [ ] Alt text for all images
- [ ] ARIA labels for icon buttons
- [ ] Semantic HTML (nav, main, section, article, aside)
- [ ] Skip-to-content link

```html
<!-- Accessibility example -->
<button aria-label="Close modal" class="btn-icon">
  <svg aria-hidden="true">...</svg>
</button>
```

---

## STEP 8 — OUTPUT FORMAT

**For HTML/CSS output:**
- Single file with embedded CSS + JS unless project is large
- Include CSS custom properties at :root
- Mobile-first CSS (base = mobile, media queries for larger)
- Comment major sections

**For React output:**
- Functional components with hooks
- Tailwind for styling (utility-first)
- Props with sensible defaults
- Export default component

**Always include:**
- Responsive behavior for all breakpoints
- Hover/focus states for interactive elements
- Loading states where relevant
- Empty states where relevant

---

## TOOLS & RESOURCES

### Icon Libraries
- **Lucide** (React): `npm install lucide-react`
- **Heroicons**: heroicons.com
- **Phosphor**: phosphoricons.com
- **Tabler**: tabler-icons.io

### Font Pairs (Google Fonts)
- Inter + Inter (weight variation) — clean SaaS
- Plus Jakarta Sans + Inter — modern product
- Playfair Display + Lato — editorial/luxury  
- Space Grotesk + DM Sans — tech/startup
- Sora + Nunito — friendly/consumer

### Illustration Resources
- undraw.co — open source SVG illustrations
- storyset.com — customizable scenes
- heroicons.com — UI icons

### Color Tools
- coolors.co — palette generation
- palettte.app — palette refinement
- whocanuse.com — contrast checker

---

## EXAMPLES OF TRIGGER PHRASES

- "Зроби landing page для SaaS продукту"
- "Створи hero секцію з анімацією"
- "Дизайн картки продукту для e-commerce"
- "Зроби pricing секцію з 3 планами"
- "Побудуй дашборд з графіками"
- "Редизайн форми реєстрації"
- "Компонент навігації з dropdown"
- "Темна тема для існуючого сайту"
