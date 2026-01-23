# Testing Patterns

**Analysis Date:** 2026-01-23

## Test Framework

**Current Status:** No testing framework configured.

**Runner:**
- Not detected

**Assertion Library:**
- Not detected

**Run Commands:**
- No test scripts in `package.json`

## Testing Infrastructure Gaps

**Missing Configuration:**
- No Jest, Vitest, or other test runner installed
- No test configuration file (jest.config.js, vitest.config.ts, etc.)
- No @testing-library packages for React testing
- No test utilities or fixtures directory structure
- No mock/stub utilities configured

**Test File Organization:**
- No existing test files (none with .test.ts, .test.tsx, .spec.ts, .spec.tsx extensions)
- No fixtures directory
- No mocks directory
- No test utilities directory

## Recommended Testing Setup

**Framework Recommendation:**
- Consider Vitest for TypeScript/Next.js projects (fast, similar to Jest, works with tsx)
- Alternative: Jest with ts-jest for compatibility

**Suggested Installation:**
```bash
npm install -D vitest @vitest/ui @testing-library/react @testing-library/jest-dom jsdom
```

**Suggested Configuration Files:**
```typescript
// vitest.config.ts
import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/test/setup.ts',
  },
})
```

```typescript
// src/test/setup.ts
import '@testing-library/jest-dom'
```

## Suggested Test Structure

**File Organization:**
- Co-located test files: `ProductCard.test.tsx` next to `ProductCard.tsx`
- Fixture data: `src/test/fixtures/` for mock data
- Mock utilities: `src/test/mocks/` for API mocks
- Test utilities: `src/test/utils.tsx` for custom render functions

**Directory Structure:**
```
src/
├── components/
│   ├── ProductCard.tsx
│   └── ProductCard.test.tsx
├── lib/
│   ├── auth.ts
│   └── auth.test.ts
├── store/
│   ├── cart.ts
│   └── cart.test.ts
└── test/
    ├── setup.ts           # Test environment setup
    ├── utils.tsx          # Custom render, etc.
    └── fixtures/
        ├── products.ts
        └── users.ts
```

## Suggested Test Patterns

**Unit Test Pattern (for utilities):**
```typescript
// src/lib/auth.test.ts
import { describe, it, expect } from 'vitest'
import { verifyPassword, hashPassword } from './auth'

describe('Auth utilities', () => {
  it('should hash and verify passwords', async () => {
    const password = 'test-password-123'
    const hashed = await hashPassword(password)
    const matches = await verifyPassword(password, hashed)
    expect(matches).toBe(true)
  })

  it('should fail verification for wrong password', async () => {
    const hashed = await hashPassword('correct-password')
    const matches = await verifyPassword('wrong-password', hashed)
    expect(matches).toBe(false)
  })
})
```

**Component Test Pattern (for React components):**
```typescript
// src/components/ProductCard.test.tsx
import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import ProductCard from './ProductCard'

describe('ProductCard', () => {
  const mockProduct = {
    id: '1',
    name: 'Test Product',
    slug: 'test-product',
    price: 99.99,
    image: '/test.jpg',
    inStock: true,
  }

  it('renders product information', () => {
    render(<ProductCard {...mockProduct} />)
    expect(screen.getByText('Test Product')).toBeInTheDocument()
    expect(screen.getByText(/99.99/)).toBeInTheDocument()
  })

  it('calls addItem when add to cart is clicked', async () => {
    const user = userEvent.setup()
    render(<ProductCard {...mockProduct} />)

    const addButton = screen.getByRole('button', { name: /добави/i })
    await user.click(addButton)

    // Verify cart store was updated (if accessible in tests)
  })

  it('shows out of stock state when unavailable', () => {
    render(<ProductCard {...mockProduct} inStock={false} />)
    expect(screen.getByText('Изчерпан')).toBeInTheDocument()
  })
})
```

**Store Test Pattern (for Zustand):**
```typescript
// src/store/cart.test.ts
import { describe, it, expect, beforeEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useCart } from './cart'

describe('Cart store', () => {
  beforeEach(() => {
    // Reset store between tests
    const { result } = renderHook(() => useCart())
    act(() => result.current.clearCart())
  })

  it('adds items to cart', () => {
    const { result } = renderHook(() => useCart())

    act(() => {
      result.current.addItem({
        id: '1',
        name: 'Product',
        price: 100,
        image: '/test.jpg',
      })
    })

    expect(result.current.items).toHaveLength(1)
    expect(result.current.items[0].quantity).toBe(1)
  })

  it('increments quantity for duplicate items', () => {
    const { result } = renderHook(() => useCart())

    act(() => {
      result.current.addItem({
        id: '1',
        name: 'Product',
        price: 100,
        image: '/test.jpg',
      })
      result.current.addItem({
        id: '1',
        name: 'Product',
        price: 100,
        image: '/test.jpg',
      })
    })

    expect(result.current.items).toHaveLength(1)
    expect(result.current.items[0].quantity).toBe(2)
  })

  it('calculates subtotal correctly', () => {
    const { result } = renderHook(() => useCart())

    act(() => {
      result.current.addItem({
        id: '1',
        name: 'Product 1',
        price: 100,
        image: '/test.jpg',
      })
      result.current.updateQuantity('1', 3)
    })

    expect(result.current.subtotal()).toBe(300)
  })
})
```

**API Route Test Pattern:**
```typescript
// src/app/api/products/route.test.ts
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { GET, POST } from './route'
import { prisma } from '@/lib/prisma'

vi.mock('@/lib/prisma')

describe('Products API', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('returns products on GET', async () => {
    const mockProducts = [
      {
        id: '1',
        nameBg: 'Product 1',
        price: 99.99,
        category: { id: '1', nameBg: 'Category' },
      },
    ]

    vi.mocked(prisma.product.findMany).mockResolvedValue(mockProducts as any)

    const request = new Request('http://localhost:3000/api/products')
    const response = await GET(request as any)
    const data = await response.json()

    expect(data).toEqual(mockProducts)
    expect(response.status).toBe(200)
  })

  it('validates input on POST', async () => {
    const request = new Request('http://localhost:3000/api/products', {
      method: 'POST',
      body: JSON.stringify({ nameBg: '' }), // Invalid: empty name
    })

    const response = await POST(request as any)
    expect(response.status).toBe(400)
  })
})
```

## Mocking

**Framework:** Vitest's `vi` module (once installed)

**Patterns:**

**Database Mocking (Prisma):**
```typescript
import { vi } from 'vitest'
import { prisma } from '@/lib/prisma'

vi.mock('@/lib/prisma', () => ({
  prisma: {
    product: {
      findMany: vi.fn(),
      findUnique: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
    },
  },
}))
```

**API Mocking (Next.js):**
```typescript
global.fetch = vi.fn(() =>
  Promise.resolve({
    json: () => Promise.resolve(mockData),
    ok: true,
    status: 200,
  })
)
```

**What to Mock:**
- External API calls (database, third-party services)
- Next.js router (`useRouter`)
- Next.js navigation functions
- Environment variables
- Date/time functions (when testing time-dependent logic)

**What NOT to Mock:**
- Pure utility functions (validation helpers, formatters)
- Component render logic (unless testing error states)
- Business logic transformations
- Store actions (test through public API)

## Fixtures and Factories

**Test Data Location:**
- `src/test/fixtures/` for static test data
- Factory functions in fixture files for generating test objects

**Example Fixture Pattern:**
```typescript
// src/test/fixtures/products.ts
export const mockProducts = {
  basic: {
    id: '1',
    nameBg: 'Акумулаторен винтоверт',
    nameEn: 'Cordless Drill',
    slug: 'akumulatorhen-vintovert',
    price: 189.99,
    oldPrice: 249.99,
    stock: 10,
    isActive: true,
    isFeatured: false,
    categoryId: 'cat-1',
    images: ['image1.jpg'],
  },

  outOfStock: {
    // ... basic with stock: 0, isActive: false
  },
}

export const createProduct = (overrides = {}) => ({
  ...mockProducts.basic,
  ...overrides,
})
```

## Coverage

**Requirements:** Not enforced currently

**Suggested Configuration:**
```typescript
// vitest.config.ts additions
export default defineConfig({
  test: {
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: ['node_modules/', 'src/generated/'],
      lines: 70,
      functions: 70,
      branches: 70,
      statements: 70,
    },
  },
})
```

**View Coverage:**
```bash
npm run test:coverage
```

## Test Types

**Unit Tests:**
- Scope: Individual functions and utilities
- Approach: Test pure functions, validation schemas, store actions
- Location: `src/lib/*.test.ts`, `src/store/*.test.ts`
- Example: Testing `verifyPassword()`, Zod schema validation

**Integration Tests:**
- Scope: Component interactions with store/API
- Approach: Test components with mocked data, API route handlers with mocked database
- Location: `src/components/*.test.tsx`, `src/app/api/**/*.test.ts`
- Example: ProductCard with cart store, API endpoint returning filtered products

**E2E Tests:**
- Framework: Not configured (consider Playwright or Cypress)
- Scope: Full user workflows
- Example: User adds product to cart, proceeds to checkout
- Suggested package: `npm install -D @playwright/test`

## Common Test Patterns for This Project

**Testing Validation Schemas:**
```typescript
import { createProductSchema } from '@/lib/validations'

it('validates required fields', () => {
  const result = createProductSchema.safeParse({
    nameBg: 'Product Name',
    // missing descriptionBg - required
  })

  expect(result.success).toBe(false)
  expect(result.error?.issues[0].path).toContain('descriptionBg')
})
```

**Testing Slug Generation:**
```typescript
// For Cyrillic transliteration logic
it('converts Bulgarian text to ASCII slug', () => {
  const slug = generateSlug('Акумулаторен винтоверт')
  expect(slug).toBe('akumulatorhen-vintovert')
})
```

**Testing Async Form Submission:**
```typescript
import userEvent from '@testing-library/user-event'

it('submits form with validation', async () => {
  const user = userEvent.setup()
  render(<NewProductPage />)

  await user.type(screen.getByLabelText(/име/i), 'Test Product')
  await user.click(screen.getByRole('button', { name: /запази/i }))

  // Verify API call or navigation
  expect(fetch).toHaveBeenCalledWith('/api/products', expect.any(Object))
})
```

## Suggested npm Scripts

```json
{
  "scripts": {
    "test": "vitest",
    "test:watch": "vitest --watch",
    "test:coverage": "vitest --coverage",
    "test:ui": "vitest --ui"
  }
}
```

---

*Testing analysis: 2026-01-23*
