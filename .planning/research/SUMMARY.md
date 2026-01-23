# Research Summary

**Project:** ToolsShop UI Fixes & Enhancements
**Researched:** 2026-01-23

## Key Recommendations

### Animation Stack
**Use:** Tailwind CSS 4 native animations (90%) + Motion library v12.26.2 (10%)

- Tailwind for hover effects, simple transitions — 0KB bundle cost
- Motion (successor to Framer Motion) only for page transitions — ~32KB
- Skip GSAP — overkill for e-commerce
- Existing `globals.css` already has good foundation (fade-in, float, shimmer)

### Info Page Patterns
**Approach:** Structured layouts replacing walls of text

| Page | Pattern |
|------|---------|
| Terms | Accordion + sticky TOC |
| Privacy | Card layout + summary box |
| Cookies | Category toggles + cookie table |
| Delivery | Icon grid + FAQ accordion |
| Returns | Timeline + comparison table + CTA |
| Contact | Multi-channel cards + form |

### Critical Pitfalls to Avoid

1. **Accessibility first** — Always respect `prefers-reduced-motion`
2. **Transform/opacity only** — Never animate width/height/position
3. **Mobile-first** — No hover-only interactions (79% mobile cart abandonment)
4. **Minimal checkout animations** — Task completion mode, not entertainment
5. **Short transitions** — Under 300ms for comparison shopping

## Stack Decisions

| Component | Choice | Rationale |
|-----------|--------|-----------|
| Hover effects | Tailwind CSS | Zero bundle cost, GPU-accelerated |
| Scroll animations | CSS + Intersection Observer | Lightweight, performant |
| Page transitions | Motion library or View Transitions API | App Router compatible |
| Icons | Lucide (already installed) | Accessible, consistent |

## Performance Budget

- Homepage: <100KB JS
- Product pages: <150KB JS
- Checkout: <80KB JS (minimal animations)
- Animation libraries: <35KB total

## Implementation Priority

1. **Phase 1:** Fix broken features (search) + remove unwanted elements
2. **Phase 2:** Add Tailwind hover animations (buttons, cards)
3. **Phase 3:** Redesign info pages with structured layouts
4. **Phase 4:** Add scroll animations (hero, key sections only)
5. **Phase 5:** Page transitions (optional, keep under 300ms)

## Files

- [STACK.md](./STACK.md) — Animation technology choices
- [FEATURES.md](./FEATURES.md) — Info page design patterns
- [ARCHITECTURE.md](./ARCHITECTURE.md) — Animation component organization
- [PITFALLS.md](./PITFALLS.md) — Common mistakes to avoid

---
*Research complete: 2026-01-23*
