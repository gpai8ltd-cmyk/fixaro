# Codebase Concerns

**Analysis Date:** 2026-01-23

## Critical Security Issues

**Missing Authentication on Admin API Routes:**
- Issue: API routes for product creation, update, and deletion (`/api/products`, `/api/products/[id]`, `/api/categories`, `/api/categories/[id]`) lack authentication checks. Any unauthenticated client can modify products and categories directly via API.
- Files: `src/app/api/products/route.ts`, `src/app/api/products/[id]/route.ts`, `src/app/api/categories/route.ts`, `src/app/api/categories/[id]/route.ts`
- Impact: Critical - Unauthorized users can create, update, and delete all products and categories via direct API calls, even without admin session
- Fix approach: Add session verification middleware to all mutation API routes (POST, PUT, DELETE). Use `getSession()` from `src/lib/auth.ts` at the start of each admin-only endpoint and return 401 if unauthorized.

**Hardcoded Default Credentials in Documentation:**
- Issue: DATABASE.md documents default admin credentials: Email `admin@toolsshop.bg` / Password `admin123`
- Files: `DATABASE.md` (lines 16-18)
- Impact: High - Default credentials are publicly documented and likely hardcoded in database seed
- Fix approach: Remove default credentials from all documentation. Store initial credentials securely or require setup wizard on first run.

**JWT Secret Fallback in Production:**
- Issue: `src/lib/auth.ts` and `src/middleware.ts` use `'dev-only-secret-not-for-production'` as fallback when JWT_SECRET is missing, creating a security hole if env var is not properly set
- Files: `src/lib/auth.ts` (line 17), `src/middleware.ts` (line 16)
- Impact: High - If JWT_SECRET env var is accidentally missing in production, entire authentication system uses predictable secret
- Fix approach: Fail hard in production if JWT_SECRET is missing. Remove fallback secret or only allow it in development/build phases with explicit check.

**SQLite for Production:**
- Issue: Current stack uses SQLite as production database (as documented in `.env` and `DATABASE.md`)
- Files: `prisma/schema.prisma` (line 9), `.env`, `DATABASE.md` (line 5)
- Impact: High - SQLite is a file-based database unsuitable for production with concurrent users or deployments. No proper backup, replication, or high availability.
- Fix approach: Plan migration to PostgreSQL or MySQL before production launch. SQLite acceptable only for development/early testing.

## Known Bugs

**File Upload Placeholder Not Implemented:**
- Symptoms: Product image upload form shows file input but doesn't actually handle uploads
- Files: `src/app/admin/(dashboard)/products/new/page.tsx` (lines 232-239)
- Trigger: User tries to upload images when creating/editing products
- Workaround: Currently adds placeholder image `/images/products/placeholder.jpg` instead of uploading real image. Users see broken image links.

**Missing Orders/Customers Stats in Dashboard:**
- Symptoms: Admin dashboard always shows 0 for Orders and Customers counts
- Files: `src/app/admin/(dashboard)/page.tsx` (lines 42-43, 69-72)
- Trigger: Visit admin dashboard
- Workaround: Hardcoded to 0; no API endpoints exist to fetch order and customer statistics. Info message explains this (line 137).

**Cart/Checkout Not Implemented:**
- Symptoms: Cart sidebar and checkout pages exist but no cart state management or order creation
- Files: `src/app/(shop)/cart/page.tsx`, `src/app/(shop)/checkout/page.tsx`
- Impact: Cannot complete purchases; critical missing feature for e-commerce site
- Status: Pages exist as placeholders only

## Security Considerations

**Rate Limiting Only in Memory:**
- Risk: Rate limiter (`src/lib/rate-limit.ts`) stores limits in memory. Resets on server restart. Ineffective across multiple server instances.
- Files: `src/lib/rate-limit.ts`
- Current mitigation: Cleanup job runs every 60 seconds; login rate limit set to 5 attempts per 15 minutes
- Recommendations: For production, implement Redis-based rate limiting. Add rate limiting to all mutation endpoints (currently only on login).

**Missing Input Validation on Image URLs:**
- Risk: Product images stored as JSON string with no URL validation on storage/retrieval. Could allow XSS if images array contains untrusted content.
- Files: `src/app/api/products/route.ts` (line 123), `src/app/api/products/[id]/route.ts` (line 121)
- Current mitigation: Images are currently placeholder strings only
- Recommendations: Validate image URLs against whitelist. Use proper image CDN. Never trust user-uploaded file paths directly.

**No CSRF Protection:**
- Risk: No CSRF tokens on state-changing requests (POST/PUT/DELETE)
- Files: All API mutation routes
- Current mitigation: Middleware checks JWT token in session cookie
- Recommendations: Add explicit CSRF token validation or use SameSite cookie properly (already set to 'lax' in auth.ts line 86).

**Missing Audit Logging:**
- Risk: Admin actions (create/update/delete products, categories) not logged
- Files: All API routes
- Impact: Cannot track who made what changes or when
- Recommendations: Add audit log table to schema. Log all admin mutations with user ID, action, timestamp, and changes.

## Performance Bottlenecks

**N+1 Query Risk in Category Listing:**
- Problem: Category GET endpoint retrieves product count via `_count` which may load all products
- Files: `src/app/api/categories/route.ts` (lines 8-14)
- Cause: Prisma `_count` on large product lists could be slow
- Improvement path: Add database indexes (already present), consider pagination for large datasets, cache category counts.

**Unoptimized Product Search:**
- Problem: Search uses `contains` with `insensitive` mode on all product fields without limit
- Files: `src/app/api/products/route.ts` (lines 29-35)
- Cause: No pagination on search results; no full-text search index
- Improvement path: Implement pagination (add `take`/`skip`), use SQL full-text search or external search service (Algolia, Elasticsearch), cache frequent searches.

**In-Memory State Management:**
- Problem: Cart state managed via Zustand in browser (if implemented), no persistence to server
- Impact: Cart lost on page refresh, no ability to recover abandoned carts, no server-side session
- Improvement path: Persist cart to database or Redis. Implement wishlist/saved items properly.

## Fragile Areas

**Slug Generation Logic Duplicated:**
- Files: `src/app/api/products/route.ts` (lines 87-100), `src/app/api/products/[id]/route.ts` (lines 82-104), `src/app/api/categories/route.ts` (lines 50-63), `src/app/api/categories/[id]/route.ts` (lines 76-89)
- Why fragile: Bulgarian transliteration map duplicated 4 times. Any fix must be applied to all locations.
- Safe modification: Extract to `src/lib/slug.ts` utility function. Use throughout.
- Test coverage: No unit tests for slug generation; relies on manual testing.

**JWT Secret Initialization Race Condition:**
- Files: `src/lib/auth.ts` (lines 6-30), `src/middleware.ts` (lines 6-19)
- Why fragile: Both files duplicate the JWT secret logic. Both call `getJwtSecret()` at module level (lines 30 and 19), which could cause issues if imports happen in unexpected order.
- Safe modification: Move JWT secret to shared utility (`src/lib/get-jwt-secret.ts`). Import in both files.
- Test coverage: No tests for JWT secret initialization.

**Middleware Not Applied to API Routes:**
- Files: `src/middleware.ts`, `src/app/api/` routes
- Why fragile: Middleware matcher only covers `/admin` UI routes (line 47). Admin API routes are unprotected because middleware doesn't run on `/api/*`.
- Safe modification: Add authentication check inside each API route handler manually (since middleware doesn't protect API). Or change matcher to include `/api/admin/*`.
- Impact: Currently mitigated by middleware protecting UI, but API calls bypass all checks.

**No TypeScript Generics for Validation:**
- Problem: Zod schemas defined inline in route handlers, no reuse
- Files: `src/app/api/products/route.ts`, `src/app/api/categories/route.ts`, etc.
- Test coverage: No schema unit tests; validation errors not covered by tests.

## Scaling Limits

**SQLite Single-File Database:**
- Current capacity: Suitable for ~10k-100k records max, single connection at a time
- Limit: SQLite locks entire database on write; cannot handle concurrent requests
- Scaling path: Migrate to PostgreSQL/MySQL before exceeding 1000 concurrent users. Plan now.

**In-Memory Rate Limiter:**
- Current capacity: Effective for single-server deployments only
- Limit: Breaks with load balancers or multiple instances
- Scaling path: When scaling to multiple instances, move to Redis rate limiting immediately.

**No Image Storage Strategy:**
- Current capacity: No actual image upload implemented (placeholder only)
- Limit: Will become bottleneck when implemented - will bloat database or require external storage
- Scaling path: Implement image upload to S3/CDN before launch. Never store large binary data in database.

## Dependencies at Risk

**No Update Strategy for Dependencies:**
- Risk: Package.json shows many packages with caret versions (^) allowing minor/patch updates
- Impact: Automatic updates could introduce breaking changes unnoticed
- Migration plan: Lock versions or use controlled updates. Set up dependabot or renovate for automated PRs.

**Outdated TypeScript Patterns:**
- Risk: Using older Zod patterns for validation in some places
- Impact: May miss improvements in newer versions
- Migration plan: Review and upgrade to latest Zod best practices.

## Missing Critical Features

**No Email Notifications:**
- Problem: No email service configured; customers cannot receive order confirmations, order status updates, or password resets
- Blocks: Cannot launch to production without order notifications
- Priority: Critical for launch

**No Payment Gateway Integration:**
- Problem: No payment processing (Stripe, PayPal, etc.)
- Blocks: Cannot accept customer payments
- Priority: Critical for e-commerce

**No Order Management UI:**
- Problem: Order and customer pages show no data; no ability to manage orders from admin
- Blocks: Cannot process orders without manual database edits
- Priority: Critical for operations

**No Product Search/Filtering UI:**
- Problem: Search works via API but no frontend UI to search products
- Blocks: Customers cannot easily find products
- Priority: High for UX

**No Analytics/Reporting:**
- Problem: No dashboard metrics beyond product/category counts
- Missing: Sales trends, revenue, best sellers, customer behavior
- Priority: Medium for business insights

## Test Coverage Gaps

**No Tests for Authentication:**
- What's not tested: JWT creation/verification, session cookie handling, login/logout flows, token expiration
- Files: `src/lib/auth.ts`, `src/app/api/admin/login/route.ts`, `src/middleware.ts`
- Risk: Auth system could silently fail; users might not be properly authenticated
- Priority: Critical

**No Tests for API Routes:**
- What's not tested: All CRUD operations, validation, error handling, permissions
- Files: `src/app/api/**/*` (all routes)
- Risk: Business logic could break unnoticed; security vulnerabilities could persist
- Priority: Critical

**No Tests for Slug Generation:**
- What's not tested: Bulgarian transliteration, duplicate slug handling, special characters
- Files: Slug generation logic in 4 files
- Risk: Product/category URLs could break in production
- Priority: High

**No Integration Tests:**
- What's not tested: Full user flows (login -> create product -> view on frontend)
- Risk: Multiple components could fail together undetected
- Priority: High

**No E2E Tests:**
- Framework: Not used
- Risk: Cannot catch regressions in real browser scenarios
- Recommendation: Set up Playwright or Cypress for critical paths (checkout, admin operations)

---

*Concerns audit: 2026-01-23*
