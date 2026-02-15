# ToolsShop UI Fixes & Enhancements

## What This Is

A Bulgarian e-commerce website for tools (ToolsShop) built with Next.js 16, deployed on Vercel with PostgreSQL database. The shop has professional UI (v1.0 milestone complete) and now needs production-ready scaling optimizations to handle 500+ daily orders.

## Core Value

The shop must reliably process orders at scale — database bottlenecks and race conditions lose revenue and customer trust.

## Current Milestone: v2.0 Production Scaling

**Goal:** Scale the e-commerce platform to reliably handle 500+ orders per day with proper database connection pooling, Redis caching, queue-based email delivery, and performance monitoring.

**Target capabilities:**
- Database connection pooling for serverless functions (no connection limit hits)
- Redis caching layer for products, categories, and frequently accessed data
- Reliable order number generation (no collisions under concurrent load)
- Queue-based email system (guaranteed delivery, retry on failure)
- API pagination for large datasets (products, orders)
- Performance monitoring and error tracking

## Requirements

### Validated

<!-- Shipped and confirmed valuable in v1.0 -->

- ✓ Product browsing and display — v1.0
- ✓ Category filtering — v1.0
- ✓ Shopping cart with persistence — v1.0
- ✓ Admin dashboard with authentication — v1.0
- ✓ Checkout flow with order creation — v1.0
- ✓ Responsive layout — v1.0
- ✓ Product search functionality — v1.0 Phase 1
- ✓ Professional footer and hero (no placeholder elements) — v1.0 Phase 1
- ✓ Social media links in header — v1.0 Phase 1
- ✓ Modern info pages with structured layouts (/terms, /privacy, /cookies, /delivery, /returns, /contact) — v1.0 Phase 2
- ✓ Scroll animations and trust-building sections — v1.0 Phase 3
- ✓ Accessibility support (prefers-reduced-motion) — v1.0 Phase 3

### Active

<!-- Current scope for v2.0 Production Scaling -->

- [ ] Database connection pooling for Vercel serverless functions
- [ ] Redis caching layer for products and categories
- [ ] Collision-free order number generation (DB sequence)
- [ ] Queue-based email delivery system with retries
- [ ] API pagination for products and orders endpoints
- [ ] Redis-backed rate limiting (multi-instance compatible)
- [ ] Performance monitoring and error tracking
- [ ] Database query optimization and index audit

### Out of Scope

- New features (notifications, user accounts, etc.) — focus is on fixes and polish
- Backend changes — only frontend/UI work
- Mobile app — web only
- Payment integration changes — existing flow stays

## Context

**Tech Stack:**
- Next.js 16 App Router with TypeScript
- Tailwind CSS 4 for styling
- Prisma ORM + PostgreSQL database
- Zustand for cart state
- Deployed on Vercel (serverless functions)
- Located in `tools-shop/` subdirectory

**Current State (after v1.0):**
- ✓ Professional UI with modern info pages and animations
- ✓ Working search, navigation, and checkout
- ⚠️ No database connection pooling → hits limits at scale
- ⚠️ No caching → every request hits database
- ⚠️ Order numbers use random generation → collision risk
- ⚠️ Fire-and-forget emails → no delivery guarantee
- ⚠️ No pagination → loads all products in memory
- ⚠️ In-memory rate limiting → doesn't work across instances

**Scaling Target:** 500+ orders per day with zero downtime

**Language:** Bulgarian (all UI text in Bulgarian)

## Constraints

- **Hosting**: Vercel serverless (affects connection pooling strategy)
- **Database**: PostgreSQL via Prisma ORM (must work with connection pooling)
- **Budget**: Available for Redis/Queue services (~$10-30/month)
- **Zero downtime**: Scaling changes must not interrupt existing orders
- **Language**: Bulgarian UI (all user-facing text remains in Bulgarian)

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| react-intersection-observer over framer-motion | Lighter bundle for scroll-reveal animations | ✓ Good (v1.0) |
| Tailwind CSS 4 for styling | Zero bundle cost, GPU-accelerated | ✓ Good (v1.0) |
| Vercel deployment | Auto-scaling serverless, good DX | ✓ Good (v1.0) |
| PostgreSQL via Prisma | Robust relational DB with type-safe ORM | ✓ Good (v1.0) |

---
*Last updated: 2026-02-15 after v2.0 milestone start*
