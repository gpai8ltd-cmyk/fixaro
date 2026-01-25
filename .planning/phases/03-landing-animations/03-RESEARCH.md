# Phase 3: Landing Page & Animation Polish - Research

**Researched:** 2026-01-25
**Domain:** CSS animations, scroll animations, React animation patterns
**Confidence:** HIGH

## Summary

Phase 3 focuses on enhancing the landing page with engaging content sections (stats, testimonials, brand partners) and implementing performant scroll animations across the site. The research reveals that modern web animation best practices in 2026 center on three pillars: performance (using `transform` and `opacity` only), accessibility (`prefers-reduced-motion` support), and native browser APIs (Intersection Observer for scroll detection).

The standard approach is to use native CSS animations with Intersection Observer for scroll triggers, avoiding heavy animation libraries. For countdown timers and number counters, lightweight React libraries like `react-countup` provide battle-tested solutions with scroll spy integration. The codebase already has animation foundations in place (CSS custom properties, `.animate-fade-in`, `@media (prefers-reduced-motion)` rules), making this phase additive rather than transformative.

**Primary recommendation:** Use CSS-only animations with Intersection Observer via `react-intersection-observer` for scroll triggers, `react-countup` for animated stats, and extend existing CSS animation patterns while respecting the project's zero-dependency philosophy for simple animations.

## Standard Stack

The established libraries/tools for this domain:

### Core
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| react-intersection-observer | 9.x | Scroll animation triggers | React-friendly Intersection Observer API wrapper, lightweight, TypeScript support |
| Native CSS Animations | N/A | Transform/opacity animations | Best performance, GPU-accelerated, no bundle size |
| Intersection Observer API | Native | Viewport visibility detection | Built into browsers, async, performant scroll detection |

### Supporting
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| react-countup | 6.5.x | Animated number counters | Stats bar with scroll spy (5000+ clients, etc.) |
| CSS `@keyframes` | N/A | Blob/gradient animations | Floating tool icons, gradient backgrounds |
| `prefers-reduced-motion` | Native CSS | Accessibility | Required for ANIM-04 (respect motion preferences) |

### Alternatives Considered
| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| react-intersection-observer | Custom useIntersectionObserver hook | More control but reinventing the wheel, manual testing |
| react-countup | Custom counter with useEffect | Simpler but no scroll spy, must handle cleanup manually |
| CSS animations | Framer Motion, GSAP | More features but 20-100kb bundle size, overkill for simple fades |

**Installation:**
```bash
npm install react-intersection-observer react-countup
```

**Note:** The codebase already imports `lucide-react` for icons, so no additional icon library is needed for floating tool icons.

## Architecture Patterns

### Recommended Project Structure
```
src/
├── components/
│   ├── AnimatedSection.tsx     # Reusable scroll-reveal wrapper
│   ├── CountUpStat.tsx          # Animated stat number component
│   ├── TestimonialCard.tsx      # Individual testimonial item
│   └── BrandPartners.tsx        # Brand strip component
├── hooks/
│   └── usePrefersReducedMotion.tsx  # Motion preference detection
└── app/
    └── (shop)/
        └── page.tsx             # Landing page (existing)
```

### Pattern 1: Scroll-Reveal Animation with Intersection Observer

**What:** Wrap sections in a component that detects viewport entry and applies CSS classes for fade-in/slide-up effects.

**When to use:** For all ANIM-01 scroll animations (sections fade in as user scrolls).

**Example:**
```typescript
// components/AnimatedSection.tsx
// Source: Based on https://www.builder.io/blog/react-intersection-observer
'use client';

import { useInView } from 'react-intersection-observer';
import { ReactNode } from 'react';

interface AnimatedSectionProps {
  children: ReactNode;
  className?: string;
  threshold?: number;
  triggerOnce?: boolean;
}

export default function AnimatedSection({
  children,
  className = '',
  threshold = 0.1,
  triggerOnce = true
}: AnimatedSectionProps) {
  const { ref, inView } = useInView({
    threshold,
    triggerOnce,
  });

  return (
    <div
      ref={ref}
      className={`transition-all duration-700 ease-out ${
        inView
          ? 'opacity-100 translate-y-0'
          : 'opacity-0 translate-y-8'
      } ${className}`}
    >
      {children}
    </div>
  );
}
```

### Pattern 2: Animated Stats with Scroll Spy

**What:** Use `react-countup` with `enableScrollSpy` to automatically trigger number animations when the stats section enters viewport.

**When to use:** For LAND-02 stats bar (5000+ клиенти, 350+ продукта, 98% доволни).

**Example:**
```typescript
// components/CountUpStat.tsx
// Source: Based on https://www.npmjs.com/package/react-countup
'use client';

import CountUp from 'react-countup';

interface CountUpStatProps {
  end: number;
  suffix?: string;
  prefix?: string;
  decimals?: number;
  duration?: number;
  label: string;
}

export default function CountUpStat({
  end,
  suffix = '',
  prefix = '',
  decimals = 0,
  duration = 2.5,
  label
}: CountUpStatProps) {
  return (
    <div className="text-center">
      <div className="text-3xl md:text-4xl font-bold text-[var(--primary)]">
        <CountUp
          end={end}
          suffix={suffix}
          prefix={prefix}
          decimals={decimals}
          duration={duration}
          enableScrollSpy
          scrollSpyOnce
        />
      </div>
      <p className="text-[var(--muted)] mt-2">{label}</p>
    </div>
  );
}
```

### Pattern 3: CSS-Only Gradient Blob Animation

**What:** Use `@keyframes` with `border-radius` and `transform` animations to create morphing gradient blobs.

**When to use:** For LAND-01 hero section animated gradient blobs.

**Example:**
```css
/* Source: Based on https://codepen.io/astrit/pen/MWeMgor */
.gradient-blob {
  position: absolute;
  width: 300px;
  height: 300px;
  background: linear-gradient(135deg, var(--primary) 0%, var(--primary-dark) 100%);
  border-radius: 60% 40% 30% 70% / 60% 30% 70% 40%;
  animation: blob-morph 8s ease-in-out infinite;
  filter: blur(40px);
  opacity: 0.7;
}

@keyframes blob-morph {
  0%, 100% {
    border-radius: 60% 40% 30% 70% / 60% 30% 70% 40%;
    transform: translate(0, 0) scale(1);
  }
  33% {
    border-radius: 70% 30% 50% 50% / 30% 60% 40% 70%;
    transform: translate(30px, -50px) scale(1.1);
  }
  66% {
    border-radius: 40% 60% 70% 30% / 50% 40% 60% 50%;
    transform: translate(-20px, 20px) scale(0.9);
  }
}
```

### Pattern 4: Respect Reduced Motion Preferences

**What:** Create a React hook that detects `prefers-reduced-motion` and use it to conditionally disable animations.

**When to use:** For ANIM-04 (respect prefers-reduced-motion for all animations).

**Example:**
```typescript
// hooks/usePrefersReducedMotion.tsx
// Source: Based on https://www.joshwcomeau.com/react/prefers-reduced-motion/
'use client';

import { useEffect, useState } from 'react';

export default function usePrefersReducedMotion() {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(true); // Default to safe value

  useEffect(() => {
    const mediaQueryList = window.matchMedia('(prefers-reduced-motion: no-preference)');
    setPrefersReducedMotion(!mediaQueryList.matches);

    const listener = (event: MediaQueryListEvent) => {
      setPrefersReducedMotion(!event.matches);
    };

    mediaQueryList.addEventListener('change', listener);
    return () => mediaQueryList.removeEventListener('change', listener);
  }, []);

  return prefersReducedMotion;
}

// Usage in component:
const prefersReducedMotion = usePrefersReducedMotion();
const duration = prefersReducedMotion ? 0.01 : 2.5;
```

### Pattern 5: Card Hover Animations (Extending Existing Pattern)

**What:** Enhance existing `.product-card:hover` pattern with lift, scale, and border glow effects using `transform` and `box-shadow`.

**When to use:** For ANIM-02 hover animations on cards and ANIM-03 product card enhancements.

**Example:**
```css
/* Extends existing globals.css patterns */
.card-hover-enhanced {
  transition: transform 0.3s ease, box-shadow 0.3s ease, border-color 0.3s ease;
}

.card-hover-enhanced:hover {
  transform: translateY(-8px) scale(1.02);
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1),
              0 0 0 2px var(--primary);
  border-color: var(--primary);
}

/* Already respects prefers-reduced-motion via globals.css line 55-64 */
```

### Anti-Patterns to Avoid

- **Animating width/height/top/left:** These trigger layout recalculations. Use `transform` instead. Animating layout-affecting properties causes reflows and repaints.
- **Overusing will-change:** Don't apply `will-change` to many elements simultaneously. It consumes GPU memory and can degrade performance if overused.
- **Scroll event listeners for animations:** Use Intersection Observer instead. Scroll listeners run synchronously on the main thread and cause jank.
- **Not cleaning up timers:** Countdown timers using `setInterval`/`setTimeout` must be cleared in `useEffect` cleanup to prevent memory leaks.
- **Ignoring prefers-reduced-motion:** Users with vestibular disorders rely on this setting. Always provide a reduced-motion alternative.

## Don't Hand-Roll

Problems that look simple but have existing solutions:

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Countdown timer | Custom `useEffect` with `setInterval` | `react-countup` or dedicated countdown library | Timer cleanup, pause/resume, scroll spy, edge cases (page visibility, tab switching) |
| Number counter animation | Manual state + `setInterval` increments | `react-countup` | Easing functions, scroll spy, decimal handling, performance optimization |
| Intersection Observer hook | Custom `useIntersectionObserver` | `react-intersection-observer` | Instance reuse, testing utilities, TypeScript types, edge case handling |
| Testimonial carousel | Custom swipe logic with touch events | React Slick, Swiper, or CSS scroll-snap | Touch gestures, keyboard nav, ARIA attributes, RTL support, mobile momentum |

**Key insight:** Animation libraries and scroll detection have solved performance, accessibility, and cross-browser edge cases that custom implementations will rediscover painfully. The project values simplicity (custom Toggle component in Phase 2), but for scroll detection and number animations, the ecosystem solutions are battle-tested and lightweight enough to justify the dependency.

## Common Pitfalls

### Pitfall 1: Animation Jank from Layout Thrashing

**What goes wrong:** Animating properties like `margin-top`, `width`, or `left` causes the browser to recalculate layout and repaint, resulting in janky, stuttering animations (especially on mobile).

**Why it happens:** The browser's rendering pipeline has three stages: Layout → Paint → Composite. Properties like `transform` and `opacity` skip Layout and Paint, running entirely on the GPU compositor thread.

**How to avoid:** Only animate `transform` (translate, scale, rotate) and `opacity`. Use `transform: translateY()` instead of `top` or `margin-top`.

**Warning signs:** DevTools Performance panel shows long "Rendering" tasks during animations. Animations stutter on lower-end devices.

### Pitfall 2: Memory Leaks from Countdown Timers

**What goes wrong:** Using `setInterval` in a React component without clearing it in the `useEffect` cleanup function causes the interval to keep running after the component unmounts, leading to memory leaks and "Can't perform a React state update on an unmounted component" warnings.

**Why it happens:** React doesn't automatically clean up timers. If a component unmounts while a timer is running, the timer callback still executes and tries to update state on a non-existent component.

**How to avoid:** Always return a cleanup function from `useEffect` that calls `clearInterval` or `clearTimeout`:

```typescript
useEffect(() => {
  const timer = setInterval(() => {
    setCount(prev => prev + 1);
  }, 1000);

  return () => clearInterval(timer); // Cleanup on unmount
}, []);
```

**Warning signs:** React warnings in console about state updates on unmounted components. Memory usage grows over time. Timers fire even after navigating away from the page.

### Pitfall 3: Intersection Observer Triggering Too Many Times

**What goes wrong:** Without `triggerOnce: true`, scroll animations can trigger repeatedly as users scroll up and down, causing disorienting repeated animations.

**Why it happens:** Intersection Observer fires whenever the element crosses the threshold, both entering and leaving the viewport. This is useful for video players but annoying for fade-in animations.

**How to avoid:** Set `triggerOnce: true` in `useInView` options for scroll-reveal animations:

```typescript
const { ref, inView } = useInView({
  threshold: 0.1,
  triggerOnce: true, // Only fire once when element enters viewport
});
```

**Warning signs:** Users report sections "flashing" or "re-animating" when scrolling back up. Animation state resets unexpectedly.

### Pitfall 4: Ignoring prefers-reduced-motion Until the End

**What goes wrong:** Implementing animations first and adding `prefers-reduced-motion` as an afterthought leads to incomplete coverage, where some animations still play for users who need reduced motion.

**Why it happens:** Developers build animations in stages and forget to update the media query rule for each new animation. The codebase already has a `@media (prefers-reduced-motion)` rule in `globals.css`, but it only covers existing animations.

**How to avoid:** Make `prefers-reduced-motion` checks part of the animation implementation process. For each new animation, immediately add the reduced-motion alternative:

```css
.my-animation {
  animation: slide-in 0.5s ease-out;
}

@media (prefers-reduced-motion: reduce) {
  .my-animation {
    animation: none; /* or fade-in with 0.01s duration */
  }
}
```

**Warning signs:** Accessibility audits flag animations without reduced-motion alternatives. Users with vestibular disorders report discomfort.

### Pitfall 5: Blob Animations Causing Mobile Performance Issues

**What goes wrong:** Large animated gradient blobs with `filter: blur()` can cause performance issues on mobile devices, leading to janky scrolling and high battery drain.

**Why it happens:** CSS `filter` effects (especially blur) are expensive to render, requiring the browser to recalculate pixels on every frame. Combining blur with animations and multiple overlapping blobs multiplies the cost.

**How to avoid:**
- Limit blob count (2-3 max, not 5+)
- Use lower blur values on mobile (`blur(20px)` instead of `blur(60px)`)
- Use `will-change: transform` sparingly, only on the blob container
- Consider disabling blobs entirely on low-end devices using `@media (prefers-reduced-motion)` as a proxy

```css
.gradient-blob {
  filter: blur(60px);
}

@media (prefers-reduced-motion: reduce) {
  .gradient-blob {
    display: none; /* Simplify for accessibility AND performance */
  }
}
```

**Warning signs:** Mobile scrolling feels sluggish. DevTools Performance shows high GPU usage. Battery drains quickly on the landing page.

## Code Examples

Verified patterns from official sources:

### Countdown Timer Component (For LAND-06 Sale Banner)

```typescript
// components/CountdownTimer.tsx
// Source: Custom implementation following React cleanup patterns
'use client';

import { useEffect, useState } from 'react';

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

export default function CountdownTimer({ targetDate }: { targetDate: Date }) {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>(calculateTimeLeft());

  function calculateTimeLeft(): TimeLeft {
    const difference = +targetDate - +new Date();

    if (difference > 0) {
      return {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
      };
    }

    return { days: 0, hours: 0, minutes: 0, seconds: 0 };
  }

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer); // Critical cleanup
  }, [targetDate]);

  return (
    <div className="flex gap-4 justify-center">
      {Object.entries(timeLeft).map(([unit, value]) => (
        <div key={unit} className="text-center">
          <div className="bg-white/20 backdrop-blur-sm rounded-lg px-3 py-2 min-w-[60px]">
            <span className="text-2xl font-bold text-white">
              {String(value).padStart(2, '0')}
            </span>
          </div>
          <p className="text-xs text-white/70 mt-1 capitalize">{unit}</p>
        </div>
      ))}
    </div>
  );
}
```

### Floating Tool Icons (For LAND-01 Hero)

```typescript
// components/FloatingIcons.tsx
// Source: Based on existing animate-float pattern in globals.css
'use client';

import { Wrench, Zap, Ruler, Hammer } from 'lucide-react';

const icons = [
  { Icon: Wrench, delay: '0s', x: '10%', y: '20%' },
  { Icon: Zap, delay: '0.5s', x: '80%', y: '30%' },
  { Icon: Ruler, delay: '1s', x: '15%', y: '70%' },
  { Icon: Hammer, delay: '1.5s', x: '85%', y: '65%' },
];

export default function FloatingIcons() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-30">
      {icons.map(({ Icon, delay, x, y }, index) => (
        <div
          key={index}
          className="absolute animate-float"
          style={{
            left: x,
            top: y,
            animationDelay: delay,
          }}
        >
          <Icon size={48} className="text-white/50" />
        </div>
      ))}
    </div>
  );
}
```

### Testimonial Card Component (For LAND-04)

```typescript
// components/TestimonialCard.tsx
'use client';

import { Star } from 'lucide-react';

interface TestimonialCardProps {
  name: string;
  role: string;
  rating: number;
  text: string;
  image?: string;
}

export default function TestimonialCard({
  name,
  role,
  rating,
  text
}: TestimonialCardProps) {
  return (
    <div className="bg-[var(--card)] rounded-xl p-6 border border-[var(--border)] card-hover-enhanced">
      {/* Star rating */}
      <div className="flex gap-1 mb-4">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            size={18}
            className={i < rating ? 'fill-[var(--primary)] text-[var(--primary)]' : 'text-gray-300'}
          />
        ))}
      </div>

      {/* Quote */}
      <p className="text-[var(--foreground)] mb-4 italic">"{text}"</p>

      {/* Author */}
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 rounded-full bg-gradient-primary flex items-center justify-center text-white font-bold">
          {name.charAt(0)}
        </div>
        <div>
          <p className="font-medium text-[var(--foreground)]">{name}</p>
          <p className="text-sm text-[var(--muted)]">{role}</p>
        </div>
      </div>
    </div>
  );
}
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| Scroll event listeners with throttle/debounce | Intersection Observer API | ~2019 | Async scroll detection, better performance, less jank |
| jQuery animate() for scroll effects | CSS animations + Intersection Observer | ~2020 | GPU acceleration, no jQuery dependency |
| Heavy animation libraries (GSAP, Anime.js) | Native CSS animations + minimal React hooks | 2024-2026 | Smaller bundles, better performance, less JavaScript |
| Animating any CSS property | Only `transform` and `opacity` | Ongoing best practice | Hardware acceleration, 60fps animations |
| CSS `transition: height` | CSS `transition: max-height` or `transform: scaleY()` | Established pattern | Avoids layout recalculation, smoother |
| Ignoring motion preferences | `prefers-reduced-motion` by default | 2020+ (WCAG 2.1) | Accessibility compliance, better UX |

**Deprecated/outdated:**
- **will-change: transform, opacity** on every animated element: Modern browsers optimize automatically; excessive `will-change` wastes GPU memory. Use sparingly, only for high-frequency animations.
- **React Spring/Framer Motion for simple fades**: These libraries excel at complex, physics-based animations, but for simple scroll-reveal fades, CSS + Intersection Observer is faster and lighter (0kb vs 20-40kb).
- **jQuery scroll plugins**: No modern React app should use jQuery for animations. Native APIs and React hooks handle everything.

## Open Questions

Things that couldn't be fully resolved:

1. **Should testimonials be static or a carousel?**
   - What we know: Requirements specify "3 customer reviews" without carousel mention. WebSearch shows carousels are popular for testimonials but add complexity.
   - What's unclear: User preference for auto-rotating vs static grid. Static is simpler and more accessible, but carousel shows more testimonials in less space.
   - Recommendation: Start with static 3-card grid. Carousel can be added later if user requests more testimonials. Static respects reduced motion by default.

2. **Blob animation performance threshold**
   - What we know: Blurred gradients are GPU-intensive. `prefers-reduced-motion` disables them. Mobile devices vary widely in capability.
   - What's unclear: Exact breakpoint for disabling blobs on low-end devices. No standard metric for "low-end."
   - Recommendation: Implement with 2-3 blobs and `blur(40px)` (not 60px+). Monitor user feedback and analytics for bounce rate on landing page. If performance issues arise, add media query to disable on small screens.

3. **Sale countdown target date source**
   - What we know: LAND-06 requires countdown timer on sale banner. Timer needs a target date.
   - What's unclear: Should target date be hardcoded, pulled from database, or configurable in admin panel?
   - Recommendation: For Phase 3, use a hardcoded date 7 days in the future as placeholder. Phase 4+ can add admin configuration. Document in code comments that this is temporary.

## Sources

### Primary (HIGH confidence)
- [MDN: prefers-reduced-motion](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/At-rules/@media/prefers-reduced-motion) - Official CSS spec, browser support, examples
- [Josh Comeau: Accessible Animations in React](https://www.joshwcomeau.com/react/prefers-reduced-motion/) - React hook implementation, best practices
- [web.dev: High-Performance CSS Animations](https://web.dev/articles/animations-guide) - Transform/opacity performance, will-change usage

### Secondary (MEDIUM confidence)
- [Builder.io: React Intersection Observer Guide](https://www.builder.io/blog/react-intersection-observer) - Practical React patterns
- [react-intersection-observer npm](https://www.npmjs.com/package/react-intersection-observer) via WebSearch - Package features, verified with GitHub docs
- [react-countup npm](https://www.npmjs.com/package/react-countup) via WebSearch - Scroll spy feature, verified with GitHub README
- [LogRocket: React Countdown Libraries 2026](https://blog.logrocket.com/top-react-countdown-component-libraries/) - Library comparison
- [Carmatec: React Carousel Libraries 2026](https://www.carmatec.com/blog/10-best-react-carousel-component-libraries/) - Testimonial carousel options
- [Next.js Image Component Docs](https://nextjs.org/docs/app/api-reference/components/image) via WebSearch - Priority prop usage

### Tertiary (LOW confidence)
- [CodePen: CSS Blob Animations](https://codepen.io/astrit/pen/MWeMgor) - Code examples, not documented standard
- [Medium: Modern Card Hover Animations](https://medium.com/@serkadenwildauer/modern-card-hover-animations-css-and-javascript-b3a358e54d49) - Design patterns, not authoritative
- [WebSearch 2026 trends articles](https://webpeak.org/blog/css-js-animation-trends/) - Trend summaries, marketing-focused

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH - Intersection Observer and CSS animations are industry standard, extensively documented
- Architecture: HIGH - Patterns based on official MDN, React docs, and established accessibility standards
- Pitfalls: MEDIUM - Performance issues well-documented, but mobile thresholds vary by device

**Research date:** 2026-01-25
**Valid until:** 2026-04-25 (90 days - animation APIs stable, libraries mature)

**Notes:**
- Codebase already has animation foundations (globals.css lines 110-175), making this phase incremental
- User's "custom inline Toggle component" decision suggests preference for simplicity over heavy dependencies
- All Bulgarian UI text needs translation for new sections (testimonials, stats labels, brand partners)
- Phase 2 established card hover pattern (hover:shadow-md hover:-translate-y-1) as baseline to extend
