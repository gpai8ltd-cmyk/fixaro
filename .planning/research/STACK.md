# Animation Stack Research

**Project:** ToolsShop (Bulgarian E-commerce)
**Researched:** 2026-01-23
**Overall Confidence:** HIGH

## Executive Summary

For a Next.js 16 + Tailwind CSS 4 e-commerce site, the optimal animation strategy is a **hybrid approach**: Tailwind CSS 4 native animations for simple interactions (90% of use cases) with selective Motion library integration for complex page transitions. GSAP should be avoided for this project due to bundle size concerns and React Server Components friction.

The existing codebase already demonstrates good CSS animation practices (see globals.css with fade-in, float, shimmer effects), suggesting CSS-first aligns well with the team's approach. This milestone should enhance rather than replace this foundation.

---

## Recommendation

### Primary Stack: Tailwind CSS 4 Native + Motion (Selective)

| Technology | Version | Purpose | Confidence |
|------------|---------|---------|------------|
| **Tailwind CSS 4** | ^4.0.0 (current) | Hover effects, scroll triggers, micro-interactions | HIGH |
| **Motion** | ^12.26.2 | Complex page transitions, shared element transitions | HIGH |
| **CSS View Transitions API** | Native (via Next.js 16) | Native page transitions (progressive enhancement) | MEDIUM |

### Why This Stack

**1. Tailwind CSS 4 as Foundation (HIGH confidence)**
- **Already installed** in the project (package.json shows `tailwindcss: ^4`)
- **Zero bundle overhead** - animations compile to pure CSS
- **Excellent DX with Tailwind** - Utility-first approach matches existing codebase patterns
- **Performance-first** - GPU-accelerated transforms/opacity by default
- Built-in `motion-safe:` and `motion-reduce:` variants respect `prefers-reduced-motion`
- Tailwind v4's CSS-first configuration enables custom animations via `@theme` blocks

**2. Motion for Complex Scenarios Only (HIGH confidence)**
- **Evolved from Framer Motion** - Merged in Dec 2024, now the de-facto React animation standard
- **12+ million weekly downloads** - Massive ecosystem adoption (20x larger than alternatives)
- **Latest version: 12.26.2** (published Jan 2026) - actively maintained
- **Bundle size: ~32KB gzipped** - acceptable for targeted use
- **React 19 & Next.js 16 compatible** - supports Server Components via client component wrappers
- **MIT licensed** - no restrictions, commercially friendly
- Purpose: AnimatePresence for page transitions, layoutId for shared element transitions

**3. CSS View Transitions API as Progressive Enhancement (MEDIUM confidence)**
- **Native in Next.js 16** - Enable via `viewTransition: true` in next.config.ts
- **Zero-cost abstraction** - Browser-native, no JavaScript bundle
- **Limited browser support** (Chromium-first) - use as progressive enhancement only
- Falls back gracefully on unsupported browsers
- Ideal for simple cross-page element continuity

---

## Options Evaluated

### Option A: Tailwind CSS 4 Only ✅ RECOMMENDED FOR 80% OF USE CASES

**What it is:**
Pure CSS animations using Tailwind's utility classes, custom `@keyframes` in `@theme` blocks, and transition utilities.

**Strengths:**
- ✅ Zero runtime cost - animations compile to CSS
- ✅ Already in the stack - no new dependencies
- ✅ Excellent for: hover effects (scale, opacity, border), scroll-triggered fades, loading states
- ✅ Tailwind v4's `@theme` syntax makes custom animations first-class
- ✅ Your project already uses this pattern well (animate-float, shimmer, card-hover)
- ✅ Perfect accessibility via `motion-reduce:` variant

**Weaknesses:**
- ❌ Limited for complex sequencing (multiple steps, orchestration)
- ❌ No layout animations (morphing element positions)
- ❌ Page transitions require more manual work

**Bundle Impact:** 0KB (CSS only)

**Use for:**
- Product card hover effects (scale image, lift card, glow border)
- Button interactions (scale, shadow, color transitions)
- Scroll-triggered fades/slides for content sections
- Loading skeletons and spinners
- Mobile menu slide-ins
- Badge/notification pulses

**Example from your codebase:**
```css
/* Already implemented in globals.css */
.product-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
  border-color: var(--primary);
}
```

### Option B: Motion (Framer Motion Successor) ✅ USE SELECTIVELY

**What it is:**
React animation library that merged Framer Motion + Motion One in Dec 2024. Provides declarative animation API with React hooks.

**Strengths:**
- ✅ Industry-standard for React (12M+ weekly downloads)
- ✅ Excellent for page transitions with `AnimatePresence`
- ✅ Shared element transitions via `layoutId`
- ✅ Next.js App Router compatible (requires client component wrappers)
- ✅ Gesture support (drag, hover, tap animations)
- ✅ Advanced sequencing and orchestration
- ✅ Active development (last update: Jan 18, 2026)

**Weaknesses:**
- ❌ 32KB gzipped bundle size
- ❌ Requires "use client" directive (breaks Server Components)
- ❌ AnimatePresence has known friction with Next.js App Router navigation
- ❌ Overkill for simple hover/transition effects
- ❌ Learning curve for team unfamiliar with the API

**Bundle Impact:** ~32KB gzipped (entire library, not tree-shakable)

**When to use:**
- Page transition animations (route changes)
- Product gallery carousels with physics-based swiping
- Shopping cart drawer slide-in with spring physics
- Filter/sort animations (item reordering)
- Onboarding flows with multi-step orchestration

**Integration Notes:**
```tsx
// Wrap motion components in client components
'use client'
import { motion } from 'motion/react'

export function AnimatedCard({ children }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {children}
    </motion.div>
  )
}
```

**App Router Page Transitions:**
Use `next-transition-router` wrapper or Next.js 16's View Transitions API instead of AnimatePresence due to known issues with App Router.

### Option C: GSAP ❌ NOT RECOMMENDED

**What it is:**
Professional-grade animation engine with timeline-based sequencing. Now free (Webflow-sponsored).

**Strengths:**
- ✅ Unmatched performance (maintains 60fps with thousands of tweens)
- ✅ Powerful timeline system for complex choreography
- ✅ Framework-agnostic (works beyond React)
- ✅ Extensive plugin ecosystem (ScrollTrigger, MorphSVG, SplitText now free)
- ✅ 23KB gzipped core (modular imports possible)

**Weaknesses:**
- ❌ Imperative API conflicts with React's declarative paradigm
- ❌ React Server Components require careful isolation (`'use client'` everywhere)
- ❌ Steeper learning curve for React developers
- ❌ Overkill for e-commerce UI animations
- ❌ Team likely unfamiliar (vs. Tailwind/CSS which they already use well)

**Bundle Impact:** 23KB core + plugins (ScrollTrigger +7KB)

**Why Not:**
Your project doesn't need GSAP's strengths:
- No complex timeline-based animation sequences required
- No SVG morphing or advanced canvas animations
- Existing CSS approach already performant and maintainable
- Adding GSAP would introduce unnecessary complexity for marginal benefit
- E-commerce animations are inherently simple (hover, fade, slide)

**Only consider GSAP if:**
- Building interactive product configurators with 3D/WebGL
- Creating complex landing page hero animations (not in scope)
- Timeline-based storytelling animations (not typical for e-commerce)

### Option D: React Spring ❌ NOT RECOMMENDED

**What it is:**
Physics-based animation library using spring simulations instead of durations.

**Why Not:**
- Smaller ecosystem than Motion (Motion has 20x adoption)
- More complex mental model (spring physics vs. simple transitions)
- Overlaps heavily with Motion but less mature
- E-commerce UIs rarely benefit from physics-based animations
- 15KB bundle is still cost for limited benefit over Tailwind

---

## Integration with Existing Setup

### Current State Analysis

**What you have:**
- ✅ Next.js 16.1.3 (latest, with View Transitions support)
- ✅ React 19.2.3 (latest)
- ✅ Tailwind CSS 4 (latest, CSS-first config)
- ✅ TypeScript 5
- ✅ Well-structured CSS animations in `globals.css`
- ✅ Existing animation utilities: `.animate-float`, `.shimmer`, `.product-card:hover`
- ✅ Accessibility-aware: `prefers-reduced-motion` handling already implemented

**What you're missing:**
- Page transition system (currently instant route changes)
- Scroll-triggered animations (fade-in-on-scroll exists but requires manual JS)
- Advanced gesture support (drag-to-close modals, swipe galleries)

### Integration Plan

#### Phase 1: Enhance Tailwind Animations (Week 1)

**Expand existing CSS animations for 90% of use cases:**

1. **Add scroll-triggered utilities** (pure CSS with Intersection Observer)
   ```css
   /* Add to globals.css */
   @theme {
     --animate-fade-up: fade-up 0.6s ease-out forwards;
     --animate-scale-in: scale-in 0.4s ease-out forwards;

     @keyframes fade-up {
       from { opacity: 0; transform: translateY(30px); }
       to { opacity: 1; transform: translateY(0); }
     }

     @keyframes scale-in {
       from { opacity: 0; transform: scale(0.95); }
       to { opacity: 1; transform: scale(1); }
     }
   }
   ```

2. **Enhance hover effects** with Tailwind utilities
   ```tsx
   // Product card
   <div className="
     transition-all duration-300 ease-out
     hover:scale-[1.02] hover:-translate-y-1
     hover:shadow-xl hover:shadow-primary/20
     motion-reduce:transform-none
   ">
   ```

3. **Optimize existing animations**
   - Replace current `.animate-on-scroll` JavaScript with Intersection Observer hook
   - Add stagger delays via CSS custom properties instead of :nth-child
   - Ensure all animations respect `motion-safe:` / `motion-reduce:` variants

#### Phase 2: Add Motion for Page Transitions (Week 2)

**Install and configure Motion:**

```bash
npm install motion
```

**Create client component wrappers:**

```tsx
// components/animations/PageTransition.tsx
'use client'
import { motion, AnimatePresence } from 'motion/react'
import { usePathname } from 'next/navigation'

export function PageTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={pathname}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  )
}
```

**Wrap in root layout (minimal scope):**

```tsx
// app/layout.tsx
import { PageTransition } from '@/components/animations/PageTransition'

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <PageTransition>{children}</PageTransition>
      </body>
    </html>
  )
}
```

**IMPORTANT:** Test with Next.js 16's App Router. If AnimatePresence causes issues, fall back to CSS View Transitions API instead.

#### Phase 3: Optional View Transitions API (Week 2, Progressive Enhancement)

**Enable in next.config.ts:**

```typescript
const nextConfig: NextConfig = {
  experimental: {
    viewTransition: true, // Next.js 16 feature
  },
  // ... existing config
}
```

**Advantage:** Zero-cost page transitions for Chromium browsers, graceful degradation elsewhere.

**Use when:** You want seamless transitions without JavaScript overhead, and it's acceptable that Safari/Firefox users get instant navigation.

### Tailwind v4 Configuration for Animations

**Add custom animations to your CSS (using v4's @theme syntax):**

```css
/* globals.css - add to existing @theme block or create new */
@import "tailwindcss";

@theme {
  /* Custom animation names */
  --animate-slide-up: slide-up 0.5s ease-out;
  --animate-slide-down: slide-down 0.5s ease-out;
  --animate-slide-left: slide-left 0.4s ease-out;
  --animate-slide-right: slide-right 0.4s ease-out;
  --animate-zoom-in: zoom-in 0.3s ease-out;

  @keyframes slide-up {
    from { transform: translateY(100%); }
    to { transform: translateY(0); }
  }

  @keyframes slide-down {
    from { transform: translateY(-100%); }
    to { transform: translateY(0); }
  }

  @keyframes slide-left {
    from { transform: translateX(100%); }
    to { transform: translateX(0); }
  }

  @keyframes slide-right {
    from { transform: translateX(-100%); }
    to { transform: translateX(0); }
  }

  @keyframes zoom-in {
    from {
      opacity: 0;
      transform: scale(0.95);
    }
    to {
      opacity: 1;
      transform: scale(1);
    }
  }
}
```

**Usage in components:**

```tsx
<div className="animate-slide-up motion-reduce:animate-none">
  Content slides up on mount
</div>

<button className="
  transition-transform duration-200
  hover:scale-105
  active:scale-95
  motion-reduce:transform-none
">
  Interactive button
</button>
```

### E-Commerce Specific Patterns

#### 1. Product Card Hover (Pure CSS)
```tsx
// components/ProductCard.tsx
<div className="
  group relative overflow-hidden rounded-lg border border-gray-200
  transition-all duration-300 ease-out
  hover:shadow-xl hover:shadow-primary/10 hover:-translate-y-1
  motion-reduce:transform-none
">
  <div className="aspect-square overflow-hidden bg-gray-100">
    <img
      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
      src={product.image}
      alt={product.name}
    />
  </div>
  {/* Product details */}
</div>
```

#### 2. Shopping Cart Drawer (Motion)
```tsx
// components/CartDrawer.tsx
'use client'
import { motion, AnimatePresence } from 'motion/react'

export function CartDrawer({ isOpen, onClose, items }) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 z-40"
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="fixed right-0 top-0 h-full w-96 bg-white shadow-xl z-50"
          >
            {/* Cart content */}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
```

#### 3. Scroll-Triggered Product Grid (Lightweight Intersection Observer)
```tsx
// hooks/useScrollAnimation.ts
'use client'
import { useEffect, useRef, useState } from 'react'

export function useScrollAnimation() {
  const ref = useRef<HTMLElement>(null)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => setIsVisible(entry.isIntersecting),
      { threshold: 0.1 }
    )

    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [])

  return { ref, isVisible }
}

// Usage
function ProductGrid() {
  const { ref, isVisible } = useScrollAnimation()

  return (
    <div
      ref={ref}
      className={`
        transition-all duration-700 ease-out
        ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}
      `}
    >
      {/* Products */}
    </div>
  )
}
```

---

## What to Avoid

### Anti-Patterns & Deprecated Approaches

#### 1. ❌ Animating Non-GPU Properties
**Problem:** Animating `width`, `height`, `top`, `left` causes layout recalculation and janky animations.

**Instead:** Use `transform: scale()` and `transform: translate()`.

```tsx
// ❌ BAD - triggers layout
<div className="hover:w-[110%]">

// ✅ GOOD - GPU-accelerated
<div className="hover:scale-110">
```

#### 2. ❌ Excessive AnimatePresence on Server Components
**Problem:** Wrapping entire page trees in Motion causes "use client" cascade, losing Server Component benefits.

**Instead:** Isolate Motion to leaf components (modals, drawers, specific interactive elements).

```tsx
// ❌ BAD - entire page is client-side
'use client'
export default function Page() {
  return <motion.div>...</motion.div>
}

// ✅ GOOD - page stays server-side, only drawer is client
export default function Page() {
  return (
    <div>
      <ServerComponent />
      <AnimatedCartDrawer /> {/* this is 'use client' */}
    </div>
  )
}
```

#### 3. ❌ Ignoring prefers-reduced-motion
**Problem:** Forces animations on users with motion sensitivity (accessibility violation).

**Instead:** Always use `motion-reduce:` variant in Tailwind or check `prefers-reduced-motion` in Motion.

```tsx
// Tailwind
<div className="animate-bounce motion-reduce:animate-none">

// Motion
<motion.div
  animate={{ ... }}
  transition={{ duration: shouldReduceMotion ? 0 : 0.5 }}
>
```

#### 4. ❌ Animation on Every Element
**Problem:** Performance degradation, "animation soup" distracts users.

**Instead:** Animate purposefully - only when guiding attention or providing feedback.

**E-commerce Priority:**
- ✅ Product cards on hover (encourages exploration)
- ✅ Add-to-cart feedback (confirms action)
- ✅ Page transitions (maintains context)
- ❌ Animating every text block on scroll (distracting)
- ❌ Spinning icons without purpose (annoying)

#### 5. ❌ Long Animation Durations
**Problem:** Feels sluggish, users perceive site as slow.

**Instead:**
- Micro-interactions: 100-300ms
- Transitions: 300-500ms
- Page changes: 200-400ms
- Never exceed 800ms

```css
/* ❌ BAD - feels slow */
transition-duration: 1500ms;

/* ✅ GOOD - snappy */
transition-duration: 300ms;
```

#### 6. ❌ Using JavaScript for Simple CSS Animations
**Problem:** Unnecessary bundle size, lower performance, more complexity.

**Instead:** Default to CSS/Tailwind, only reach for Motion/GSAP when CSS can't achieve the effect.

**Decision Tree:**
```
Need animation?
├─ Hover/focus effect? → Tailwind transition utilities
├─ Scroll-triggered fade? → CSS + Intersection Observer
├─ Loading spinner? → Tailwind animate-spin
├─ Page transition? → Motion (or View Transitions API)
├─ Complex timeline? → Motion
└─ Physics-based gesture? → Motion
```

#### 7. ❌ Stacking Multiple Animation Libraries
**Problem:** Bundle bloat, conflicting animation systems, debugging nightmare.

**Instead:** Stick to ONE JavaScript library (Motion) + CSS. Never install both Motion and GSAP.

#### 8. ❌ Animating Before Images Load
**Problem:** Layout shift when images load causes janky animation starts.

**Instead:** Use skeleton screens during load, animate only after content-ready.

```tsx
<div className={isLoaded ? 'animate-fade-in' : 'skeleton'}>
  <img onLoad={() => setIsLoaded(true)} />
</div>
```

---

## Performance Best Practices

### 1. Respect Core Web Vitals

**Cumulative Layout Shift (CLS):**
- Use `aspect-ratio` on images before animation
- Avoid animating elements that push content down
- Reserve space for animated elements

**Interaction to Next Paint (INP):**
- Keep hover animations under 200ms
- Debounce scroll listeners (use Intersection Observer, not scroll events)
- Use `will-change` sparingly (only during animation)

**Largest Contentful Paint (LCP):**
- Don't animate hero images on initial load (fade-in acceptable, but keep duration short)
- Prioritize above-the-fold content loading over animations

### 2. GPU Acceleration

**Safe properties** (GPU-accelerated):
- `transform: translate3d()`, `scale()`, `rotate()`
- `opacity`
- `filter` (use sparingly)

**Avoid animating:**
- `width`, `height` (use `scale` instead)
- `margin`, `padding` (use `translate` instead)
- `color`, `background-color` (acceptable for simple transitions, but less performant than opacity)

### 3. will-change Optimization

```css
/* ❌ BAD - permanent will-change wastes GPU memory */
.card {
  will-change: transform;
}

/* ✅ GOOD - apply only on hover */
.card:hover {
  will-change: transform;
}

/* ✅ BETTER - remove after animation */
.card {
  transition: transform 0.3s;
}
.card:hover {
  transform: translateY(-4px);
}
/* will-change not needed for simple transforms */
```

### 4. Bundle Size Strategy

**Current baseline:** Your project has minimal animation overhead (CSS only).

**After implementation:**
- Tailwind animations: +0KB (CSS only)
- Motion (if added): +32KB gzipped
- Total animation overhead: ~32KB

**Mitigation:**
- Lazy-load Motion components (dynamic imports)
- Tree-shake unused Motion features (import specific functions)
- Consider code-splitting routes with heavy animations

```tsx
// Lazy-load cart drawer with Motion
const CartDrawer = dynamic(() => import('./CartDrawer'), { ssr: false })
```

### 5. Monitoring Animation Performance

**Tools:**
- Chrome DevTools > Performance > Rendering > Paint flashing
- Lighthouse > Performance audit (check "avoid excessive DOM size")
- `requestAnimationFrame` for custom JS animations (never `setInterval`)

**Metrics to watch:**
- Frames per second (target: 60fps)
- Layout recalculations during animation
- Paint events (minimize repaints)

---

## E-Commerce Animation Patterns (Real-World Examples)

### Best Practices from Top E-Commerce Sites (2026)

**Hover Effects:**
- Subtle scale (1.02-1.05x) on product cards
- Image zoom on hover (1.1x scale with overflow: hidden)
- Border color transitions to accent color
- Lift effect (translateY -4px to -8px)

**Scroll Animations:**
- Fade-up for product grids (0.6s duration)
- Stagger delays for list items (0.1s increments)
- Category sections slide-in from sides
- Testimonials/reviews fade with scale

**Page Transitions:**
- 300-400ms crossfade between routes
- Maintain scroll position on back navigation
- Loading skeleton during data fetch
- Optimistic UI updates (instant feedback)

**Conversion-Boosting Animations:**
- "Added to Cart" confetti/success animation (micro-celebration)
- Quantity selector spring animation (feels tactile)
- Price drop badge pulse (draws attention to sales)
- Urgency timers with smooth countdown (creates FOMO)

**Avoid in E-commerce:**
- Auto-playing carousels (accessibility issue + poor conversion)
- Parallax scrolling on product pages (distracting)
- Excessive page load animations (delays content access)
- Autoplay videos (user preference, bandwidth concerns)

---

## Sources & Verification

### High Confidence Sources (Official Docs & Context7)

1. **Motion Library**
   - npm: https://www.npmjs.com/package/motion (v12.26.2, Jan 2026)
   - Official site: https://motion.dev/
   - Upgrade guide: https://motion.dev/docs/react-upgrade-guide

2. **Tailwind CSS 4**
   - Animations docs: https://tailwindcss.com/docs/animation
   - v4 theme syntax: https://tailkits.com/blog/tailwind-animation-utilities/

3. **Next.js 16**
   - View Transitions API: https://nextjs.org/docs/app/api-reference/config/next-config-js/viewTransition
   - Release notes: https://nextjs.org/blog/next-16

4. **GSAP**
   - Official site: https://gsap.com (v3, now free)
   - React integration: https://gsap.com/community/forums/topic/41893-how-can-i-use-gsap-with-react-and-nextjs/

### Medium Confidence Sources (WebSearch + Verification)

5. **Performance Comparisons**
   - [GSAP vs Motion performance benchmarks](https://motion.dev/docs/gsap-vs-motion)
   - [Framer Motion vs GSAP comparison](https://blog.uavdevelopment.io/blogs/comparing-the-performance-of-framer-motion-and-gsap-animations-in-next-js)
   - [Animation library comparison 2026](https://www.syncfusion.com/blogs/post/top-react-animation-libraries)

6. **E-Commerce Best Practices**
   - [Scroll effects in web design 2026](https://www.digitalsilk.com/digital-trends/scrolling-effects/)
   - [Website animations 2026 best practices](https://www.shadowdigital.cc/resources/do-you-need-website-animations)
   - [E-commerce animation strategies](https://animotionsstudio.com/animation-in-e-commerce-website/)

7. **Next.js App Router Integration**
   - [Solving Framer Motion page transitions in App Router](https://www.imcorfitz.com/posts/adding-framer-motion-page-transitions-to-next-js-app-router)
   - [next-transition-router](https://github.com/ismamz/next-transition-router) (App Router v14+)

8. **Motion Evolution**
   - [Framer Motion evolves into Motion](https://dev.to/tejasmore477/big-news-for-animations-framer-motion-evolves-into-motion--2oi8)
   - [Motion 11.11.12 merge announcement](https://motion.dev/blog/should-i-use-framer-motion-or-motion-one)

9. **GSAP + Next.js Guides**
   - [Setting up GSAP with Next.js 2025](https://javascript.plainenglish.io/setting-up-gsap-with-next-js-2025-edition-bcb86e48eab6)
   - [Optimizing GSAP in Next.js 15](https://medium.com/@thomasaugot/optimizing-gsap-animations-in-next-js-15-best-practices-for-initialization-and-cleanup-2ebaba7d0232)

---

## Installation & Quick Start

### Recommended Setup (Hybrid Approach)

#### Step 1: Expand Tailwind Animations (Day 1)

**No installation needed** - already have Tailwind v4.

**Add to `globals.css`:**

```css
@theme {
  /* Scroll-triggered animations */
  --animate-fade-up: fade-up 0.6s ease-out;
  --animate-fade-left: fade-left 0.5s ease-out;
  --animate-scale-in: scale-in 0.4s ease-out;

  @keyframes fade-up {
    from { opacity: 0; transform: translateY(30px); }
    to { opacity: 1; transform: translateY(0); }
  }

  @keyframes fade-left {
    from { opacity: 0; transform: translateX(30px); }
    to { opacity: 1; transform: translateX(0); }
  }

  @keyframes scale-in {
    from { opacity: 0; transform: scale(0.95); }
    to { opacity: 1; transform: scale(1); }
  }
}
```

**Usage:**

```tsx
<div className="animate-fade-up motion-reduce:animate-none">
  Fades up on mount
</div>
```

#### Step 2: Add Motion for Complex Scenarios (Day 2)

**Install:**

```bash
npm install motion
```

**Create wrapper component:**

```tsx
// components/animations/MotionDiv.tsx
'use client'
import { motion } from 'motion/react'

export const MotionDiv = motion.div
export const MotionButton = motion.button
export const MotionSection = motion.section

// Export AnimatePresence for page transitions
export { AnimatePresence } from 'motion/react'
```

**Use in components:**

```tsx
// app/products/[id]/page.tsx (stays Server Component)
import { MotionDiv } from '@/components/animations/MotionDiv'

export default function ProductPage({ params }) {
  // Server Component logic
  return (
    <div>
      {/* Static content remains SSR */}
      <h1>Product Details</h1>

      {/* Only this section becomes client-side */}
      <MotionDiv
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <ProductImages />
      </MotionDiv>
    </div>
  )
}
```

#### Step 3: Optional - Enable View Transitions (Day 2)

**Update `next.config.ts`:**

```typescript
const nextConfig: NextConfig = {
  experimental: {
    viewTransition: true, // Chromium-only progressive enhancement
  },
  // ... existing config
}
```

**No component changes needed** - Next.js handles transitions automatically for Chromium browsers.

---

## Success Criteria for Implementation

### Phase 1: Tailwind Enhancements (Week 1)
- [ ] All product cards have hover effects (scale + shadow + lift)
- [ ] Button interactions feel responsive (scale on active)
- [ ] Scroll-triggered fades on main content sections
- [ ] All animations respect `motion-reduce:` preference
- [ ] Lighthouse Performance score remains 90+ (no regression)

### Phase 2: Motion Integration (Week 2)
- [ ] Page transitions between routes (300ms crossfade)
- [ ] Shopping cart drawer slides in with spring physics
- [ ] Product image galleries support gesture controls
- [ ] AnimatePresence used for modals/tooltips
- [ ] Bundle size increase acceptable (<40KB total for animations)

### Phase 3: Polish & Optimization (Week 3)
- [ ] All animations run at 60fps (Chrome DevTools verification)
- [ ] No layout shift (CLS score < 0.1)
- [ ] Interaction to Next Paint < 200ms
- [ ] Works gracefully on low-end devices (test on throttled CPU)
- [ ] Bulgarian translations load without animation jank

---

## Open Questions & Future Research

1. **Product Image Zoom Interaction:**
   - Research: Best UX pattern (click to zoom modal vs. hover magnifier vs. pinch-to-zoom)
   - Recommendation: Start with simple hover scale, add lightbox modal if user testing shows demand

2. **Filter/Sort Animation:**
   - When filters change, should products reorder with animation or instant?
   - Industry standard: Instant for perceived speed, animate only on initial load
   - Motion's `layout` prop can handle this, but test performance with 100+ products

3. **Shopping Cart Badge Bounce:**
   - Animate badge number when item added?
   - Best practice: Short scale animation (150ms) + optional confetti for first-time users
   - Avoid: Perpetual bouncing (annoying)

4. **Loading States:**
   - Skeleton screens vs. spinners vs. progress bars?
   - Recommendation: Skeleton screens (already implemented) with shimmer animation

5. **Parallax Scrolling:**
   - Hero section parallax - useful or distracting for e-commerce?
   - Research verdict: Avoid on product pages (distracts from conversion), acceptable on About/Brand pages

---

## Summary for Roadmap Planning

**Recommended Approach:**
1. **Week 1:** Enhance Tailwind CSS animations (no new dependencies, 0KB overhead)
2. **Week 2:** Add Motion library selectively for page transitions and cart drawer
3. **Week 3:** Polish, performance testing, accessibility audit

**Total Bundle Impact:** ~32KB gzipped (Motion only, if needed)

**Confidence Level:** HIGH - This stack aligns with your existing architecture, respects performance, and provides clear upgrade path.

**Risk Mitigation:**
- Start CSS-only to validate patterns before adding Motion
- Motion can be removed if bundle size becomes issue (animations degrade gracefully)
- View Transitions API provides zero-cost alternative for basic page transitions

**Key Success Metric:** Animations should feel like **polish, not performance cost**. If Lighthouse score drops, simplify.
