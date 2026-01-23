# ToolsShop UI Fixes & Enhancements

## What This Is

An existing Bulgarian e-commerce website for tools (ToolsShop) that needs UI/UX fixes and enhancements. The core shop functionality works — this milestone focuses on fixing broken features, removing unwanted elements, improving info pages, and adding polish through animations.

## Core Value

The shop must look professional and function correctly — broken search and placeholder pages undermine customer trust.

## Requirements

### Validated

- ✓ Product browsing and display — existing
- ✓ Category filtering — existing
- ✓ Shopping cart with persistence — existing
- ✓ Admin dashboard with authentication — existing
- ✓ Checkout flow — existing
- ✓ Responsive layout — existing

### Active

- [ ] Fix product search functionality (currently broken)
- [ ] Remove security badges from footer (SSL, Verified store, 14 days return, Data protection)
- [ ] Add Instagram & Facebook links to header
- [ ] Remove "4.9/5" rating from hero section
- [ ] Remove Speedy & Econt courier logos from footer
- [ ] Re-do /terms page with proper layout and sections
- [ ] Re-do /privacy page with proper layout and sections
- [ ] Re-do /cookies page with proper layout and sections
- [ ] Re-do /delivery page with proper layout and sections
- [ ] Re-do /returns page with proper layout and sections
- [ ] Re-do /contact page with proper layout and sections
- [ ] Add hover animations (buttons, cards)
- [ ] Add scroll animations (elements fade/slide in)
- [ ] Add page transitions

### Out of Scope

- New features (notifications, user accounts, etc.) — focus is on fixes and polish
- Backend changes — only frontend/UI work
- Mobile app — web only
- Payment integration changes — existing flow stays

## Context

**Existing Codebase:**
- Next.js 16 App Router with TypeScript
- Tailwind CSS 4 for styling
- Prisma + SQLite for data
- Zustand for cart state
- Located in `tools-shop/` subdirectory

**Current State:**
- Core e-commerce works (products, cart, checkout, admin)
- Search is broken (doesn't return results)
- Info pages are text-only placeholders
- Some footer elements need removal
- No animations currently

**Language:** Bulgarian (all UI text in Bulgarian)

## Constraints

- **Tech stack**: Must use existing Next.js + Tailwind setup
- **Scope**: UI/UX fixes only, no backend restructuring
- **Style**: Maintain existing visual design language (colors, typography)

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Use Framer Motion for animations | Industry standard for React animations, works well with Next.js | — Pending |
| Keep info pages as static content | No CMS needed, content rarely changes | — Pending |

---
*Last updated: 2026-01-23 after initialization*
