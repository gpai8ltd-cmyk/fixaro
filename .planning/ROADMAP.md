# Roadmap: ToolsShop UI Fixes & Enhancements

**Created:** 2026-01-23
**Depth:** Quick (3 phases)
**Status:** Active

## Overview

This roadmap delivers professional UI/UX fixes for an existing Bulgarian e-commerce site. Phase 1 fixes critical issues and updates navigation, Phase 2 redesigns all info pages with modern layouts, and Phase 3 adds polish through animations while maintaining accessibility.

## Phases

### Phase 1: Critical Fixes

**Goal:** Site functions correctly and presents professional appearance with working search and updated branding elements.

**Dependencies:** None (foundation work)

**Plans:** 2 plans

Plans:
- [x] 01-01-PLAN.md — Fix search API + remove footer badges and hero rating
- [x] 01-02-PLAN.md — Add social links to header + verification checkpoint

**Requirements:**
- FIX-01: Product search returns correct results when user types query
- FIX-02: Remove security badges from footer (SSL, Verified store, 14-day return, Data protection)
- FIX-03: Remove Speedy & Econt courier logos from footer
- FIX-04: Remove "4.9/5" rating from hero section
- NAV-01: Add Instagram link to header (visible, clickable)
- NAV-02: Add Facebook link to header (visible, clickable)

**Success Criteria:**
1. User can search for products and receive relevant results in real-time
2. Footer displays clean branding without security badges or courier logos
3. Hero section shows core messaging without placeholder rating
4. Header contains visible Instagram and Facebook icons that link to social profiles

---

### Phase 2: Info Pages

**Goal:** All informational pages present content in modern, scannable layouts that build customer trust.

**Dependencies:** Phase 1 (clean foundation established)

**Plans:** 3 plans

Plans:
- [x] 02-01-PLAN.md — Redesign /terms + /privacy pages (accordion, TOC, cards, summary)
- [x] 02-02-PLAN.md — Redesign /cookies + /delivery pages (toggles, tables, FAQ accordion)
- [x] 02-03-PLAN.md — Redesign /returns + /contact pages (timeline, CTA, channel cards) + verification

**Requirements:**
- INFO-01: Redesign /terms page — keep existing text, add accordion + sticky TOC layout
- INFO-02: Redesign /privacy page — keep existing text, add card layout + summary box
- INFO-03: Redesign /cookies page — keep existing text, add category toggles + cookie table
- INFO-04: Redesign /delivery page — keep existing text, add icon grid + FAQ accordion
- INFO-05: Redesign /returns page — keep existing text, add timeline + comparison table + CTA
- INFO-06: Redesign /contact page — keep existing text, add multi-channel cards + improved form

**Success Criteria:**
1. User can navigate /terms content using sticky table of contents and expand/collapse sections
2. User can scan /privacy, /cookies, /delivery, and /returns pages using visual hierarchy (cards, icons, tables)
3. User can find contact information through clear channel cards on /contact page
4. All info pages maintain existing Bulgarian text while presenting it in organized, professional layouts

---

### Phase 3: Landing Page & Animation Polish

**Goal:** Landing page feels engaging and premium with new sections that build trust, plus smooth animations across the site.

**Dependencies:** Phase 2 (all pages ready for animation layer)

**Plans:** TBD

**Requirements:**
- LAND-01: Hero section with animated gradient blobs and floating tool icons
- LAND-02: Stats bar with animated numbers (5000+ клиенти, 350+ продукта, 98% доволни)
- LAND-03: "Why Us" section with 3 brand story cards (Оригинални, Бърза доставка, Експертна подкрепа)
- LAND-04: Testimonials section with 3 customer reviews and star ratings
- LAND-05: Brand partners strip (Bosch, Makita, DeWalt, etc.)
- LAND-06: Enhanced sale banner with countdown timer
- ANIM-01: Scroll animations with Intersection Observer (sections fade in)
- ANIM-02: Hover animations on cards (lift, scale, border glow)
- ANIM-03: Product card enhancements (quick view overlay, sale % badge)
- ANIM-04: Respect prefers-reduced-motion for all animations

**Success Criteria:**
1. User sees dynamic hero with animated background and floating elements
2. User sees impressive stats that build confidence (numbers animate on scroll)
3. User understands brand value through "Why Us" storytelling section
4. User sees social proof from customer testimonials and brand partnerships
5. User experiences smooth hover feedback and scroll animations across all sections
6. Users with prefers-reduced-motion enabled see static interface

---

## Progress

| Phase | Status | Requirements | Complete |
|-------|--------|--------------|----------|
| 1 - Critical Fixes | Complete | 6 | 6/6 |
| 2 - Info Pages | Complete | 6 | 6/6 |
| 3 - Landing Page & Animation | Pending | 10 | 0/10 |

**Overall:** 12/22 requirements complete (55%)

---

## Notes

**Phase Rationale:**
- Phase 1 fixes user-facing issues that undermine trust (broken search, placeholder elements)
- Phase 2 tackles bulk content work (6 info pages) as a focused batch
- Phase 3 combines landing page redesign + animations for maximum visual impact

**Scope Expansion:**
- Phase 3 expanded from 6 to 10 requirements after user feedback
- Landing page felt "empty and without emotions" — added engagement sections
- New sections: stats bar, "why us", testimonials, brand partners

---

*Last updated: 2026-01-25 after Phase 3 scope expansion*
