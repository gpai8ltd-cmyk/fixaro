# Animation Architecture

**Project:** Next.js 16 E-Commerce Site with Animations
**Researched:** 2026-01-23
**Confidence:** HIGH

## Executive Summary

Animation architecture for Next.js 16 App Router requires careful consideration of server/client component boundaries, performance optimization strategies, and proper file organization. The recommended approach combines Tailwind CSS for simple hover effects and transitions with Framer Motion for complex animations and page transitions, while maintaining the server-first architecture that Next.js 16 promotes.

Key architectural decision: Keep animations at the edges of your component tree using the "client islands" pattern, where server components handle data fetching and rendering while small client components handle interactive animations.

---

## Component Organization

### Recommended Folder Structure

```
app/
├── components/                    # Global shared components
│   ├── ui/                       # Reusable UI components
│   │   ├── button.tsx           # Server component (static)
│   │   ├── card.tsx             # Server component (static)
│   │   └── animated-card.tsx    # Client component (with animations)
│   └── animations/               # Animation-specific components
│       ├── fade-in.tsx          # Reusable animation wrapper
│       ├── slide-in.tsx         # Reusable animation wrapper
│       ├── scroll-reveal.tsx    # Scroll-triggered animation wrapper
│       └── page-transition.tsx  # Page transition wrapper
├── hooks/                        # Custom React hooks
│   ├── use-intersection-observer.ts
│   ├── use-scroll-animation.ts
│   └── use-prefered-motion.ts   # Respects prefers-reduced-motion
├── lib/                          # Utilities and helpers
│   └── animation-variants.ts    # Shared Framer Motion variants
├── template.tsx                  # Root-level page transition wrapper
└── (routes)/
    ├── products/
    │   ├── _components/         # Product-specific components
    │   │   └── product-card-hover.tsx  # Feature-specific animation
    │   └── page.tsx             # Server component
    └── page.tsx                 # Server component
```

### Organization Principles (Next.js 16 Official Recommendations)

**Three Official Strategies:**

1. **Root-level separation** - Keep all application code outside `app/` directory
2. **Top-level app organization** - Place shared code in `app/components/`, `app/hooks/`, etc.
3. **Feature-based colocation** (Recommended) - Colocate feature-specific animations with their routes using private folders (`_components/`)

**Private Folder Convention:**
- Use `_folderName` prefix for implementation details that shouldn't be routable
- Example: `app/products/_components/animated-product-card.tsx`
- Keeps UI logic separate from routing logic

**Why This Structure Works:**
- **Global animations** (`app/components/animations/`) - Reusable across the entire application
- **Feature-specific animations** (`app/products/_components/`) - Scoped to specific routes
- **Shared utilities** (`app/lib/animation-variants.ts`) - DRY principle for animation configurations
- **Custom hooks** (`app/hooks/`) - Encapsulate animation logic for reuse

### File Naming Conventions

```
✅ Recommended:
- animated-card.tsx        (Client component with animations)
- fade-in-wrapper.tsx      (Animation wrapper component)
- use-scroll-reveal.ts     (Custom hook for scroll animations)
- animation-variants.ts    (Shared variant configurations)

❌ Avoid:
- card-anim.tsx           (Unclear abbreviation)
- wrapper.tsx             (Too generic)
- utils.ts                (Too vague for animation-specific code)
```

---

## Reusable Patterns

### Pattern 1: Animation Wrapper Components with Variants

**What:** Create reusable wrapper components using Framer Motion variants for consistent animations across your app.

**When:** Use for frequently repeated animation patterns (fade-in, slide-in, scale-up, etc.)

**Benefits:**
- Consistency across the application
- Centralized animation logic
- Easier performance debugging
- Maintainable animation codebase

**Example:**

```typescript
// app/components/animations/fade-in.tsx
"use client"

import { motion, Variants } from "framer-motion"
import { ReactNode } from "react"

const fadeInVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: "easeOut"
    }
  }
}

interface FadeInProps {
  children: ReactNode
  delay?: number
  className?: string
}

export function FadeIn({ children, delay = 0, className }: FadeInProps) {
  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={fadeInVariants}
      transition={{ delay }}
      className={className}
    >
      {children}
    </motion.div>
  )
}
```

**Usage:**
```typescript
// app/products/page.tsx (Server Component)
import { FadeIn } from "@/components/animations/fade-in"
import { ProductList } from "./_components/product-list" // Server Component

export default function ProductsPage() {
  return (
    <FadeIn delay={0.2}>
      <ProductList /> {/* Server Component wrapped in Client animation */}
    </FadeIn>
  )
}
```

### Pattern 2: Shared Variant Configuration

**What:** Centralize Framer Motion variant definitions in a shared file to maintain consistency.

**When:** Multiple components use similar animation patterns.

**Example:**

```typescript
// app/lib/animation-variants.ts
import { Variants } from "framer-motion"

export const fadeIn: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
}

export const slideIn: Variants = {
  hidden: { opacity: 0, x: -100 },
  visible: { opacity: 1, x: 0 }
}

export const scaleUp: Variants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: { opacity: 1, scale: 1 }
}

export const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
}
```

### Pattern 3: Scroll-Triggered Animations with Intersection Observer

**What:** Use Intersection Observer to trigger animations when elements enter the viewport.

**When:** Product cards, feature sections, or any content that benefits from scroll-based reveals.

**Example:**

```typescript
// app/hooks/use-intersection-observer.ts
"use client"

import { useEffect, useRef, useState } from "react"

export function useIntersectionObserver(options?: IntersectionObserverInit) {
  const [isIntersecting, setIsIntersecting] = useState(false)
  const [hasIntersected, setHasIntersected] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const element = ref.current
    if (!element) return

    const observer = new IntersectionObserver(([entry]) => {
      setIsIntersecting(entry.isIntersecting)
      if (entry.isIntersecting) {
        setHasIntersected(true)
      }
    }, options)

    observer.observe(element)
    return () => observer.disconnect()
  }, [options])

  return { ref, isIntersecting, hasIntersected }
}
```

```typescript
// app/components/animations/scroll-reveal.tsx
"use client"

import { motion } from "framer-motion"
import { ReactNode } from "react"
import { useIntersectionObserver } from "@/hooks/use-intersection-observer"

interface ScrollRevealProps {
  children: ReactNode
  className?: string
}

export function ScrollReveal({ children, className }: ScrollRevealProps) {
  const { ref, hasIntersected } = useIntersectionObserver({
    threshold: 0.1,
    triggerOnce: true
  })

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={hasIntersected ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className={className}
    >
      {children}
    </motion.div>
  )
}
```

### Pattern 4: Tailwind Hover Effects for Cards and Buttons

**What:** Use Tailwind's built-in utilities for simple, performant hover effects without JavaScript.

**When:** Simple UI enhancements (button hovers, card lifts, subtle interactions).

**Benefits:**
- Zero JavaScript bundle impact
- Hardware-accelerated CSS transforms
- No client component boundary required
- Better performance than JavaScript animations

**Example:**

```typescript
// app/components/ui/product-card.tsx
// This can be a SERVER COMPONENT - no "use client" needed!

interface ProductCardProps {
  title: string
  price: number
  image: string
}

export function ProductCard({ title, price, image }: ProductCardProps) {
  return (
    <div className="
      group
      relative
      overflow-hidden
      rounded-lg
      border
      bg-white
      transition-all
      duration-300
      hover:scale-105
      hover:shadow-xl
    ">
      <div className="relative h-64 overflow-hidden">
        <img
          src={image}
          alt={title}
          className="
            h-full
            w-full
            object-cover
            transition-transform
            duration-500
            group-hover:scale-110
          "
        />
      </div>
      <div className="p-4">
        <h3 className="
          text-lg
          font-semibold
          transition-colors
          group-hover:text-blue-600
        ">
          {title}
        </h3>
        <p className="text-gray-600">${price}</p>
      </div>
    </div>
  )
}
```

**Tailwind Animation Best Practices:**
- Use `transition-transform` + `hover:scale-*` for lift effects
- Use `group` + `group-hover:*` for coordinated multi-element animations
- Prefer `transform` and `opacity` for hardware acceleration
- Add `duration-*` for custom timing (default is 150ms)
- Combine with `ease-*` utilities for custom easing

### Pattern 5: Custom Tailwind Animations

**What:** Extend Tailwind's configuration with custom keyframe animations.

**When:** Need specific animation patterns not provided by Tailwind (pulse variations, complex sequences).

**Example:**

```javascript
// tailwind.config.js
/** @type {import('tailwindcss').Config} */
module.exports = {
  theme: {
    extend: {
      keyframes: {
        'fade-in': {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'slide-in-right': {
          '0%': { transform: 'translateX(100%)' },
          '100%': { transform: 'translateX(0)' },
        },
        'bounce-slow': {
          '0%, 100%': { transform: 'translateY(-5%)' },
          '50%': { transform: 'translateY(0)' },
        }
      },
      animation: {
        'fade-in': 'fade-in 0.5s ease-out',
        'slide-in-right': 'slide-in-right 0.4s ease-out',
        'bounce-slow': 'bounce-slow 2s infinite',
      }
    }
  }
}
```

**Usage:**
```typescript
<div className="animate-fade-in">Content</div>
```

---

## Page Transitions

### App Router Page Transition Strategy

Next.js 16 App Router handles page transitions differently than the Pages Router. The recommended approach uses `template.tsx` files with Framer Motion.

### Why template.tsx?

**Key Differences: template.tsx vs layout.tsx**

| Feature | layout.tsx | template.tsx |
|---------|-----------|--------------|
| Re-renders on navigation | ❌ No (persists) | ✅ Yes (new instance) |
| DOM recreated | ❌ No | ✅ Yes |
| State preserved | ✅ Yes | ❌ No |
| Effects re-synchronized | ❌ No | ✅ Yes |
| Ideal for | Persistent UI, providers | Animations, transitions |

**Why This Matters:**
- `layout.tsx` persists across navigations → AnimatePresence can't detect children changes
- `template.tsx` creates new instances → AnimatePresence properly detects mount/unmount
- Templates enable exit animations, layouts do not

### Implementation: Root-Level Page Transitions

```typescript
// app/template.tsx
"use client"

import { motion } from "framer-motion"
import { ReactNode } from "react"

const pageVariants = {
  hidden: {
    opacity: 0,
    y: 20
  },
  enter: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
      ease: "easeOut"
    }
  },
  exit: {
    opacity: 0,
    y: -20,
    transition: {
      duration: 0.3,
      ease: "easeIn"
    }
  }
}

export default function Template({ children }: { children: ReactNode }) {
  return (
    <motion.div
      variants={pageVariants}
      initial="hidden"
      animate="enter"
      exit="exit"
    >
      {children}
    </motion.div>
  )
}
```

### Advanced Pattern: FrozenRouter for Complex Transitions

**Problem:** Next.js App Router's router context updates immediately during navigation, causing animation interruptions.

**Solution:** Use the FrozenRouter pattern to freeze the router context during transitions.

```typescript
// app/components/animations/frozen-router.tsx
"use client"

import { useContext, useRef, ReactNode } from "react"
import { LayoutRouterContext } from "next/dist/shared/lib/app-router-context.shared-runtime"

interface FrozenRouterProps {
  children: ReactNode
}

export function FrozenRouter({ children }: FrozenRouterProps) {
  const context = useContext(LayoutRouterContext)
  const frozen = useRef(context).current

  return (
    <LayoutRouterContext.Provider value={frozen}>
      {children}
    </LayoutRouterContext.Provider>
  )
}
```

```typescript
// app/components/animations/page-transition-wrapper.tsx
"use client"

import { AnimatePresence, motion } from "framer-motion"
import { usePathname } from "next/navigation"
import { ReactNode } from "react"
import { FrozenRouter } from "./frozen-router"

export function PageTransitionWrapper({ children }: { children: ReactNode }) {
  const pathname = usePathname()

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={pathname}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.3 }}
      >
        <FrozenRouter>{children}</FrozenRouter>
      </motion.div>
    </AnimatePresence>
  )
}
```

### Scroll Behavior Management

**Problem:** Next.js automatically scrolls to top on navigation, conflicting with exit animations.

**Solution:** Disable automatic scroll restoration on all links and programmatic navigation.

```typescript
// For Link components
<Link href="/products" scroll={false}>
  Products
</Link>

// For programmatic navigation
const router = useRouter()
router.push("/products", { scroll: false })
```

### Next.js 16 Native View Transitions (Experimental)

**Status:** Experimental - NOT recommended for production (as of 2026-01-23)

Next.js 16 includes experimental support for the View Transitions API through React 19.2.

**How to Enable:**

```javascript
// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    viewTransition: true,
  },
}

module.exports = nextConfig
```

**Usage:**

```typescript
import { ViewTransition } from 'react'

export function AnimatedElement() {
  return (
    <ViewTransition name="hero-image">
      <img src="/hero.jpg" alt="Hero" />
    </ViewTransition>
  )
}
```

**Recommendation:**
- ⚠️ Wait for stable release before using in production
- ✅ Use Framer Motion + template.tsx for production apps in 2026
- 📝 Monitor Next.js release notes for View Transitions API updates

### Next.js 16 Routing Optimizations

Next.js 16 includes major routing improvements that benefit animations:

**Layout Deduplication:**
- Shared layouts download once, not per prefetched link
- Reduces network transfer for multi-link pages

**Incremental Prefetching:**
- Only prefetches parts not in cache
- Faster transitions with less data transfer

**Smart Prefetch Management:**
- Cancels prefetch when link leaves viewport
- Re-prefetches on hover or viewport re-entry
- Prioritizes based on user interaction

**Impact on Animations:**
- Faster page transitions due to prefetching
- Smoother user experience with less loading states
- Better perceived performance for animated transitions

---

## Server/Client Boundaries

### The Golden Rule

**Server by Default, Client When Necessary**

In Next.js 16 App Router, all components are React Server Components by default. Add `"use client"` only when:

1. ✅ Using browser-only APIs (window, localStorage, Intersection Observer)
2. ✅ Using React hooks (useState, useEffect, useRef)
3. ✅ Using event handlers (onClick, onSubmit, onChange)
4. ✅ Using animation libraries (Framer Motion, GSAP)

### Animation-Specific Boundary Rules

```typescript
// ❌ WRONG: Entire page is client component
"use client"

import { motion } from "framer-motion"

export default function ProductsPage() {
  const products = await fetchProducts() // Error: Can't use await in client component

  return (
    <motion.div>
      {products.map(product => (
        <ProductCard key={product.id} {...product} />
      ))}
    </motion.div>
  )
}
```

```typescript
// ✅ CORRECT: Server component with client animation wrapper
import { ProductList } from "./_components/product-list" // Server Component
import { FadeIn } from "@/components/animations/fade-in" // Client Component

export default async function ProductsPage() {
  const products = await fetchProducts() // Works: Server component can async/await

  return (
    <FadeIn>
      <ProductList products={products} /> {/* Server Component */}
    </FadeIn>
  )
}
```

### The Composition Pattern ("Holes" Strategy)

**Key Insight:** When you pass server components as `children` props to client components, they remain server components.

```typescript
// Client boundary component
"use client"

import { motion } from "framer-motion"
import { ReactNode } from "react"

interface AnimatedWrapperProps {
  children: ReactNode // This is a "hole" for server components
}

export function AnimatedWrapper({ children }: AnimatedWrapperProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      {children} {/* Children can be Server Components! */}
    </motion.div>
  )
}
```

```typescript
// Server component (no "use client")
import { AnimatedWrapper } from "@/components/animations/animated-wrapper"
import { ProductGrid } from "./_components/product-grid" // Server Component

export default async function Page() {
  const products = await fetchProducts()

  return (
    <AnimatedWrapper>
      <ProductGrid products={products} /> {/* Stays Server Component */}
    </AnimatedWrapper>
  )
}
```

**Why This Works:**
- Client component receives `children` as already-rendered React elements
- Server component executes on server, passes result to client
- Client component just handles the animation wrapper
- Reduces JavaScript sent to client

### Modal and Slot Pattern for Animations

**Use Case:** Animated modal with server-rendered content

```typescript
// app/components/ui/modal.tsx
"use client"

import { motion, AnimatePresence } from "framer-motion"
import { ReactNode } from "react"

interface ModalProps {
  isOpen: boolean
  onClose: () => void
  children: ReactNode // Server component slot
}

export function Modal({ isOpen, onClose, children }: ModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
          >
            {children}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
```

```typescript
// Usage with server component content
import { Modal } from "@/components/ui/modal"
import { ProductDetails } from "./_components/product-details" // Server Component

export default async function ProductPage({ params }: { params: { id: string } }) {
  const product = await fetchProduct(params.id)

  return (
    <Modal isOpen={true} onClose={() => {}}>
      <ProductDetails product={product} /> {/* Server Component */}
    </Modal>
  )
}
```

### What Needs "use client" vs What Doesn't

| Component Type | Needs "use client"? | Example |
|---------------|-------------------|---------|
| Static card with Tailwind hover | ❌ No | `<div className="hover:scale-105">` |
| Framer Motion wrapper | ✅ Yes | `<motion.div>` |
| Custom hook (Intersection Observer) | ✅ Yes | `useIntersectionObserver()` |
| Shared variant config | ❌ No | `export const fadeIn: Variants = {...}` |
| Server component with data fetch | ❌ No | `async function Page()` |
| Template with page transitions | ✅ Yes | `template.tsx` with AnimatePresence |
| Tailwind config | ❌ No | `tailwind.config.js` |
| Event handler (onClick) | ✅ Yes | `<button onClick={...}>` |

### Minimizing Client JavaScript Bundle

**Strategy: Push Client Boundaries to Leaf Components**

```typescript
// ❌ AVOID: Large client component tree
"use client"

export function Dashboard() {
  return (
    <div>
      <Header />
      <Sidebar />
      <MainContent>
        <ProductList />
        <Analytics />
      </MainContent>
    </div>
  )
}
// Everything above becomes client-side JS
```

```typescript
// ✅ PREFER: Server components with leaf client animations
// app/dashboard/page.tsx (Server Component)
import { Header } from "./_components/header" // Server
import { Sidebar } from "./_components/sidebar" // Server
import { ProductList } from "./_components/product-list" // Server
import { AnimatedContainer } from "@/components/animations/animated-container" // Client

export default async function Dashboard() {
  const data = await fetchDashboardData()

  return (
    <div>
      <Header />
      <Sidebar />
      <AnimatedContainer> {/* Only this is client */}
        <ProductList data={data} />
        <Analytics data={data} />
      </AnimatedContainer>
    </div>
  )
}
```

**Benefits:**
- Smaller JavaScript bundle (only AnimatedContainer is client-side)
- Faster time to interactive
- Better SEO (more server-rendered content)
- Reduced hydration cost

### Accessibility: Respecting prefers-reduced-motion

**Critical:** Always respect user motion preferences.

```typescript
// app/hooks/use-preferred-motion.ts
"use client"

import { useEffect, useState } from "react"

export function usePreferredMotion() {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false)

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)")
    setPrefersReducedMotion(mediaQuery.matches)

    const handler = () => setPrefersReducedMotion(mediaQuery.matches)
    mediaQuery.addEventListener("change", handler)
    return () => mediaQuery.removeEventListener("change", handler)
  }, [])

  return { prefersReducedMotion }
}
```

```typescript
// Usage in animation components
"use client"

import { motion } from "framer-motion"
import { usePreferredMotion } from "@/hooks/use-preferred-motion"

export function AnimatedCard({ children }: { children: React.ReactNode }) {
  const { prefersReducedMotion } = usePreferredMotion()

  return (
    <motion.div
      initial={prefersReducedMotion ? {} : { opacity: 0, y: 20 }}
      animate={prefersReducedMotion ? {} : { opacity: 1, y: 0 }}
      transition={prefersReducedMotion ? { duration: 0 } : { duration: 0.5 }}
    >
      {children}
    </motion.div>
  )
}
```

---

## Build Order and Performance Implications

### CSS vs JavaScript Animation Decision Tree

```
Need animation?
├─ Simple hover/focus effect?
│  └─ ✅ Use Tailwind CSS (no client component needed)
│     • Zero JS bundle impact
│     • Hardware-accelerated
│     • Works in server components
│
├─ Scroll-triggered reveal?
│  └─ ✅ Use Intersection Observer + Framer Motion
│     • Requires client component
│     • Bundle: ~30KB (Framer Motion gzipped)
│
├─ Page transitions?
│  └─ ✅ Use template.tsx + Framer Motion
│     • Required at root level
│     • One-time bundle cost
│
└─ Complex timeline/physics animations?
   └─ ✅ Use GSAP or Framer Motion
      • Framer Motion: ~30KB
      • GSAP: ~40KB (core only)
```

### Bundle Size Considerations

**Animation Library Comparison:**

| Library | Bundle Size (gzipped) | Use Case | Server Component Compatible |
|---------|----------------------|----------|----------------------------|
| Tailwind CSS | 0KB (at runtime) | Hover effects, transitions | ✅ Yes |
| Framer Motion | ~30KB | Most animations, page transitions | ❌ No (client only) |
| GSAP | ~40KB (core) | Complex timelines, physics | ❌ No (client only) |
| react-intersection-observer | ~2KB | Scroll triggers | ❌ No (client only) |

**Recommendation for E-Commerce:**
- **Tailwind CSS** for 80% of animations (buttons, cards, hovers)
- **Framer Motion** for page transitions and complex animations
- **Intersection Observer** for scroll-reveals

**Expected Total Bundle Impact:** ~32-35KB (Framer Motion + react-intersection-observer)

### Build-Time vs Runtime Considerations

**Tailwind CSS Animations:**
- ✅ Processed at build time
- ✅ Purged in production (only used classes shipped)
- ✅ No runtime JavaScript
- ✅ Works with server components
- ⚠️ Limited to CSS capabilities (no physics, complex sequencing)

**Framer Motion:**
- ❌ Requires runtime JavaScript
- ❌ Increases client bundle size
- ❌ Requires client component boundary
- ✅ Much more powerful (physics, gestures, complex animations)
- ✅ Declarative API (easier to maintain)

### Performance Best Practices

**1. Hardware Acceleration**
Only animate these CSS properties for 60fps:
- `transform` (translate, scale, rotate)
- `opacity`

Avoid animating:
- `width`, `height` (causes layout reflow)
- `top`, `left`, `margin` (causes layout reflow)
- `background-color` (can be slow)

**2. Code Splitting for Animations**

```typescript
// Lazy load heavy animation components
import dynamic from "next/dynamic"

const ComplexAnimation = dynamic(
  () => import("@/components/animations/complex-animation"),
  { ssr: false }
)
```

**3. Conditional Loading**

```typescript
// Only load animation library on client, after interaction
"use client"

import { useState } from "react"
import dynamic from "next/dynamic"

const MotionDiv = dynamic(() =>
  import("framer-motion").then(mod => mod.motion.div)
)

export function OptionalAnimation({ children }) {
  const [shouldAnimate, setShouldAnimate] = useState(false)

  return shouldAnimate ? (
    <MotionDiv animate={{ opacity: 1 }}>{children}</MotionDiv>
  ) : (
    <div>{children}</div>
  )
}
```

---

## Technology Stack for Animations

### Recommended Stack

| Technology | Version | Purpose | Why |
|------------|---------|---------|-----|
| Tailwind CSS | 4.x | Simple animations, hover effects | Zero runtime cost, server component compatible |
| Framer Motion | Latest | Complex animations, page transitions | Best DX, React-first, excellent App Router support |
| react-intersection-observer | Latest | Scroll-triggered animations | Small bundle, clean API, works with Framer Motion |

### Implementation Phases

**Phase 1: Foundation (Tailwind CSS)**
- Set up custom animations in `tailwind.config.js`
- Implement hover effects on buttons and cards
- Zero client JavaScript needed

**Phase 2: Scroll Animations**
- Install `react-intersection-observer`
- Create `ScrollReveal` wrapper component
- Add to product cards, features sections

**Phase 3: Page Transitions**
- Install `framer-motion`
- Create `app/template.tsx` with Motion
- Implement FrozenRouter pattern if needed

**Phase 4: Complex Animations**
- Create reusable animation wrappers (FadeIn, SlideIn, etc.)
- Build shared variant library
- Implement accessibility (prefers-reduced-motion)

---

## Sources

**Next.js Official Documentation:**
- [Next.js App Router Project Structure](https://nextjs.org/docs/app/getting-started/project-structure)
- [Next.js Server and Client Components](https://nextjs.org/docs/app/getting-started/server-and-client-components)
- [Next.js 16 Release](https://nextjs.org/blog/next-16)
- [Next.js Linking and Navigating](https://nextjs.org/docs/app/getting-started/linking-and-navigating)
- [Next.js viewTransition Config](https://nextjs.org/docs/app/api-reference/config/next-config-js/viewTransition)

**React Documentation:**
- [React useTransition Hook](https://react.dev/reference/react/useTransition)
- [React ViewTransition Component](https://react.dev/reference/react/ViewTransition)

**Animation Implementation Guides:**
- [Framer Motion Next.js App Router Tutorial](https://www.imcorfitz.com/posts/adding-framer-motion-page-transitions-to-next-js-app-router)
- [React Intersection Observer with Tailwind and Next.js](https://medium.com/@franciscomoretti/react-intersection-observer-with-tailwind-and-next-js-ad68aa847b21)
- [Reusable Animation Components in Next.js](https://staticmania.com/blog/reusable-animation-components-in-nextjs-using-motion)
- [Tailwind Card Hover Effects](https://www.tailwindtap.com/blog/card-hover-effects-in-tailwind-css)

**Architecture and Best Practices:**
- [Next.js Architecture 2026 Guide](https://www.yogijs.tech/blog/nextjs-project-architecture-app-router)
- [Next.js and Tailwind CSS 2025 Guide](https://codeparrot.ai/blogs/nextjs-and-tailwind-css-2025-guide-setup-tips-and-best-practices)
- [Animation Library Comparison 2026](https://www.syncfusion.com/blogs/post/top-react-animation-libraries)
- [CSS vs JavaScript Animation Performance](https://www.keycdn.com/blog/animation-performance)

**Community Resources:**
- [Next.js Folder Structure Best Practices 2026](https://www.codebydeep.com/blog/next-js-folder-structure-best-practices-for-scalable-applications-2026-guide)
- [Understanding Client Components and Client Boundaries](https://www.zaynelovecraft.com/articles/understanding-client-components-and-client-boundaries)
