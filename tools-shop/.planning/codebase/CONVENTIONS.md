# Coding Conventions

**Analysis Date:** 2026-01-23

## Naming Patterns

**Files:**
- React components: PascalCase (e.g., `ProductCard.tsx`, `AdminSidebar.tsx`)
- Pages: lowercase with kebab-case (e.g., `page.tsx`, `new/page.tsx`)
- API routes: lowercase with kebab-case (e.g., `route.ts`)
- Utility/lib files: lowercase with kebab-case (e.g., `rate-limit.ts`, `auth.ts`)
- Store files: camelCase (e.g., `cart.ts`)
- Types/interfaces: Files named with content (e.g., `validations.ts` contains schemas and types)

**Functions:**
- camelCase for all function names
- Async functions prefixed descriptively: `getSession()`, `verifyPassword()`, `createSession()`
- Handler functions use verb-prefix: `handleChange()`, `handleSubmit()`, `handleAddToCart()`
- Utility functions use descriptive verbs: `formatZodError()`, `checkRateLimit()`, `getClientIp()`

**Variables:**
- camelCase for all variable names
- State variables: descriptive names like `isSubmitting`, `formData`, `categories`
- Boolean variables prefixed with `is` or `has`: `isAvailable`, `isLowStock`, `isFeatured`, `isActive`
- Object keys in camelCase when accessing from props/state

**Types:**
- PascalCase for interface and type names: `CartItem`, `CartStore`, `AdminSession`, `ProductCardProps`
- Type files export both types and runtime schemas together: `LoginInput`, `CheckoutInput`, `ProductInput`
- Extract Zod types with `z.infer<typeof schema>` pattern

**Environment Variables:**
- UPPERCASE_WITH_UNDERSCORES: `JWT_SECRET`, `NEXT_PUBLIC_SITE_URL`, `NODE_ENV`
- Next.js public variables prefixed with `NEXT_PUBLIC_`

## Code Style

**Formatting:**
- No explicit Prettier config file; relies on ESLint configuration with Next.js defaults
- 2-space indentation (consistent throughout)
- Single quotes used in import statements and strings
- Semicolons present at end of statements
- Arrow functions used consistently

**Linting:**
- ESLint v9 with `eslint-config-next` and `eslint-config-next/core-web-vitals`
- Configuration file: `eslint.config.mjs` (ESLint flat config format)
- Enforces Next.js best practices and core Web Vitals compliance
- Run linting: `npm run lint`

**File Organization:**
- 'use client' directive at top of client components (e.g., `ProductCard.tsx`, `NewProductPage`)
- Imports organized in groups:
  1. React/Next.js imports: `import { useState } from 'react'`
  2. Next.js features: `import Image from 'next/image'`
  3. Internal utilities: `import { useCart } from '@/store/cart'`
  4. Type imports: `import type { CartItem } from '@/store/cart'`

## Import Organization

**Order:**
1. React and React-DOM hooks
2. Next.js built-ins (Image, Link, useRouter, etc.)
3. Third-party libraries (lucide-react, zustand, zod, etc.)
4. Internal utilities and libs (from `@/lib/`)
5. Internal store and hooks (from `@/store/`)
6. Internal components (from `@/components/`)
7. Types (type-only imports)

**Path Aliases:**
- `@/*` maps to `./src/*` (defined in `tsconfig.json`)
- Always use `@/` prefix for internal imports, never relative paths like `../../../`

## Error Handling

**Patterns:**
- Try-catch blocks wrap async operations in API routes
- Console.error used for server-side logging with descriptive messages: `console.error('Error fetching products:', error)`
- Graceful error responses using NextResponse.json with status codes (400, 404, 500)
- User-friendly error messages in Bulgarian: `'Грешка при зареждане на продуктите'`
- Input validation errors return first issue from Zod: `validationResult.error.issues[0].message`
- Null checks for optional data: `existingItem ? ...modify : ...create`

**Validation:**
- Zod schemas define all input validation (see `src/lib/validations.ts`)
- `safeParse()` used to validate without throwing: `createProductSchema.safeParse(body)`
- Form data validated against schema before processing
- HTTP status codes used correctly:
  - 400 for validation errors
  - 404 for not found
  - 500 for server errors
  - 201 for successful creation

## Logging

**Framework:** console methods (no external logging library)

**Patterns:**
- Use `console.error()` in catch blocks with context
- Log message format: `'Action being performed: error'` (e.g., `'Error fetching products:', error`)
- Only log errors, not success paths
- Error logging in API routes and async operations

## Comments

**When to Comment:**
- TODO comments for incomplete features: `// TODO: Handle file upload` (line 233 in `new/page.tsx`)
- Explain non-obvious business logic (e.g., Cyrillic to Latin slug conversion)
- Explain why, not what the code does
- HTML comments used sparingly for component sections: `{/* Header */}`, `{/* Images */}`

**JSDoc/TSDoc:**
- Not extensively used in the codebase
- Type definitions are self-documenting through TypeScript interfaces
- Zod schemas include validation messages that serve as documentation

## Function Design

**Size:**
- Most functions are concise (20-100 lines)
- API route handlers typically 30-50 lines
- Component functions vary based on JSX complexity

**Parameters:**
- Destructured props in component signatures: `{ id, name, slug, price, ...rest }`
- Use Record types for dynamic object structures: `Record<string, unknown>` in Prisma queries
- Type signatures explicit for all parameters

**Return Values:**
- Early returns for validation failures in API routes
- Consistent NextResponse return types
- State setter functions return nothing (Zustand pattern)
- Computed functions return calculated values

## Module Design

**Exports:**
- Single default export for components: `export default function ProductCard() {}`
- Named exports for utilities: `export async function getSession() {}`
- Named exports for validation schemas: `export const loginSchema = z.object(...)`
- Type exports with `export type`: `export type LoginInput = z.infer<...>`

**Barrel Files:**
- Not used in this codebase (each module imported directly)
- Example of direct import: `import { useCart } from '@/store/cart'` not from index

**State Management:**
- Zustand stores with persist middleware for client-side state
- Store shape defined by interface: `interface CartStore { items, isOpen, actions }`
- Actions use immutable updates: `state.items.map()` not mutations
- Computed properties as methods on store: `totalItems: () => number`

## Async/Await Patterns

- Async functions marked with `async` keyword explicitly
- Await used for promises
- Try-catch blocks for error handling
- Promise chains in some places: `.then().catch()`

## String Handling

- Bulgarian language strings throughout UI: product descriptions, error messages, labels
- Cyrillic to Latin transliteration implemented inline in slug generation (see `route.ts` files)
- Template literals used for dynamic strings

## Constants

- Magic numbers avoided; values defined once (e.g., salt rounds in bcrypt: `12`)
- Configuration objects defined inline: `badgeConfig` record in `ProductCard.tsx`
- Rate limiting thresholds: `MAX_REQUESTS_PER_MINUTE`, `WINDOW_MS` in rate-limit.ts

---

*Convention analysis: 2026-01-23*
