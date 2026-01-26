---
id: quick-001
type: quick
wave: 1
depends_on: []
files_modified:
  - tools-shop/src/app/admin/(dashboard)/products/new/page.tsx
  - tools-shop/src/app/admin/(dashboard)/products/[id]/edit/page.tsx
  - tools-shop/src/app/api/orders/route.ts
  - tools-shop/src/app/(shop)/checkout/page.tsx
  - tools-shop/src/lib/validations.ts
  - tools-shop/src/app/api/products/route.ts
  - tools-shop/src/app/api/products/[id]/route.ts
  - tools-shop/src/app/api/categories/route.ts
  - tools-shop/src/app/api/categories/[id]/route.ts
autonomous: true

must_haves:
  truths:
    - "Admin can add product images via URL input (not file upload)"
    - "Checkout form submits to /api/orders and creates Order + OrderItems in DB"
    - "POST/PUT/DELETE on admin APIs return 401 without valid session"
  artifacts:
    - path: "tools-shop/src/app/api/orders/route.ts"
      provides: "Orders API endpoint"
      exports: ["POST"]
  key_links:
    - from: "checkout/page.tsx"
      to: "/api/orders"
      via: "fetch POST"
      pattern: "fetch.*api/orders"
    - from: "api/products/route.ts POST"
      to: "getSession()"
      via: "auth check"
      pattern: "getSession|401"
---

<objective>
Fix admin panel and checkout functionality:
1. Replace broken file upload with URL input for product images
2. Create /api/orders endpoint and connect checkout form
3. Protect admin API endpoints with auth checks

Purpose: Make the admin product forms and customer checkout actually work.
Output: Working image URLs in admin, functional checkout with DB persistence, secured admin APIs.
</objective>

<execution_context>
@~/.claude/get-shit-done/workflows/execute-plan.md
</execution_context>

<context>
@.planning/STATE.md
@tools-shop/src/app/admin/(dashboard)/products/new/page.tsx
@tools-shop/src/app/admin/(dashboard)/products/[id]/edit/page.tsx
@tools-shop/src/app/(shop)/checkout/page.tsx
@tools-shop/src/app/api/products/route.ts
@tools-shop/src/lib/auth.ts
@tools-shop/prisma/schema.prisma
</context>

<tasks>

<task type="auto">
  <name>Task 1: Replace file upload with URL input for product images</name>
  <files>
    tools-shop/src/app/admin/(dashboard)/products/new/page.tsx
    tools-shop/src/app/admin/(dashboard)/products/[id]/edit/page.tsx
  </files>
  <action>
In both files, replace the file upload section with a URL input approach:

1. Add state for new URL input: `const [newImageUrl, setNewImageUrl] = useState('')`

2. Replace the file upload label (lines 224-241 in new, 304-319 in edit) with:
   - A text input for entering image URL
   - "Добави снимка" button that validates URL (starts with http/https or /) and adds to images array
   - Keep the existing image grid display with remove buttons

3. Remove the Upload icon import if no longer needed, add Link2 icon instead.

4. Add simple URL validation before adding:
   ```typescript
   const addImageUrl = () => {
     const url = newImageUrl.trim();
     if (!url) return;
     if (!url.startsWith('http://') && !url.startsWith('https://') && !url.startsWith('/')) {
       setError('URL трябва да започва с http://, https:// или /');
       return;
     }
     setImages([...images, url]);
     setNewImageUrl('');
   };
   ```

5. UI structure for the new input:
   ```jsx
   <div className="col-span-full">
     <div className="flex gap-2">
       <input
         type="text"
         value={newImageUrl}
         onChange={(e) => setNewImageUrl(e.target.value)}
         className="input flex-1"
         placeholder="https://example.com/image.jpg или /images/product.jpg"
       />
       <button
         type="button"
         onClick={addImageUrl}
         className="btn btn-secondary"
       >
         <Plus size={18} />
         Добави
       </button>
     </div>
     <p className="text-sm text-[var(--muted)] mt-2">
       Въведете URL на снимка. Първата снимка ще се използва като основна.
     </p>
   </div>
   ```
  </action>
  <verify>
    - Visit /admin/products/new, enter a URL like "https://example.com/test.jpg", click Add
    - URL appears in the image grid
    - Invalid URLs (no protocol) show error message
    - Submit form successfully creates product with images array
  </verify>
  <done>
    Admin can add/remove product images via URL input in both new and edit forms.
  </done>
</task>

<task type="auto">
  <name>Task 2: Create /api/orders endpoint and connect checkout</name>
  <files>
    tools-shop/src/app/api/orders/route.ts
    tools-shop/src/app/(shop)/checkout/page.tsx
    tools-shop/src/lib/validations.ts
  </files>
  <action>
**2.1 Update validations.ts** - sync checkoutSchema with actual form fields:
- Change `firstName`/`lastName` to single `name` field
- Add `deliveryType: z.enum(['address', 'office'])`
- Change `deliveryMethod` to `courier: z.enum(['econt', 'speedy'])` (lowercase to match form)
- Add `office: z.string().optional()` for office delivery
- Make `postalCode` truly optional (it's not in the form)
- Add `items` array for cart items validation

```typescript
export const checkoutSchema = z.object({
  name: z.string().min(2, 'Името трябва да е поне 2 символа'),
  phone: z.string().min(10, 'Телефонът трябва да е поне 10 символа'),
  email: z.string().email('Невалиден имейл').optional().or(z.literal('')),
  city: z.string().min(2, 'Градът е задължителен'),
  deliveryType: z.enum(['address', 'office']),
  courier: z.enum(['econt', 'speedy']),
  address: z.string().optional(),
  office: z.string().optional(),
  notes: z.string().max(500).optional(),
  items: z.array(z.object({
    id: z.string(),
    name: z.string(),
    price: z.number(),
    quantity: z.number().int().positive(),
  })).min(1, 'Количката е празна'),
}).refine(
  (data) => data.deliveryType === 'office' || (data.address && data.address.length >= 5),
  { message: 'Адресът е задължителен при доставка до адрес', path: ['address'] }
).refine(
  (data) => data.deliveryType === 'address' || (data.office && data.office.length >= 2),
  { message: 'Офисът е задължителен при доставка до офис', path: ['office'] }
);
```

**2.2 Create /api/orders/route.ts:**

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { checkoutSchema, formatZodError } from '@/lib/validations';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate input
    const validationResult = checkoutSchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json(
        { error: formatZodError(validationResult.error) },
        { status: 400 }
      );
    }

    const data = validationResult.data;

    // Calculate totals
    const subtotal = data.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const deliveryFee = subtotal >= 100 ? 0 : 6.99;
    const total = subtotal + deliveryFee;

    // Generate order number: ORD-YYYYMMDD-XXX
    const date = new Date();
    const dateStr = `${date.getFullYear()}${String(date.getMonth() + 1).padStart(2, '0')}${String(date.getDate()).padStart(2, '0')}`;
    const randomNum = String(Math.floor(Math.random() * 1000)).padStart(3, '0');
    const orderNumber = `ORD-${dateStr}-${randomNum}`;

    // Find or create customer by phone
    let customer = await prisma.customer.findFirst({
      where: { phone: data.phone },
    });

    if (!customer) {
      customer = await prisma.customer.create({
        data: {
          name: data.name,
          phone: data.phone,
          email: data.email || null,
          city: data.city,
          address: data.deliveryType === 'address' ? data.address : null,
        },
      });
    }

    // Create order with items
    const order = await prisma.order.create({
      data: {
        orderNumber,
        customerId: customer.id,
        customerName: data.name,
        customerPhone: data.phone,
        customerEmail: data.email || null,
        deliveryCity: data.city,
        deliveryAddress: data.deliveryType === 'address' ? data.address! : data.office!,
        courier: data.courier.toUpperCase(), // ECONT or SPEEDY
        courierOffice: data.deliveryType === 'office' ? data.office : null,
        subtotal,
        deliveryFee,
        total,
        notes: data.notes || null,
        items: {
          create: data.items.map((item) => ({
            productId: item.id,
            productName: item.name,
            productPrice: item.price,
            quantity: item.quantity,
            subtotal: item.price * item.quantity,
          })),
        },
      },
      include: { items: true },
    });

    return NextResponse.json({
      success: true,
      orderNumber: order.orderNumber,
      orderId: order.id,
    }, { status: 201 });

  } catch (error) {
    console.error('Error creating order:', error);
    return NextResponse.json(
      { error: 'Грешка при създаване на поръчката' },
      { status: 500 }
    );
  }
}
```

**2.3 Update checkout/page.tsx handleSubmit:**

Replace the fake setTimeout with real API call:

```typescript
const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  if (!validate()) return;

  setIsSubmitting(true);

  try {
    const res = await fetch('/api/orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: formData.name,
        phone: formData.phone,
        email: formData.email || undefined,
        city: formData.city,
        deliveryType: formData.deliveryType,
        courier: formData.courier,
        address: formData.address || undefined,
        office: formData.office || undefined,
        notes: formData.notes || undefined,
        items: items.map((item) => ({
          id: item.id,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
        })),
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      setErrors({ submit: data.error || 'Грешка при поръчката' });
      return;
    }

    setOrderNumber(data.orderNumber);
    setOrderComplete(true);
    clearCart();
  } catch (err) {
    setErrors({ submit: 'Грешка при свързване със сървъра' });
  } finally {
    setIsSubmitting(false);
  }
};
```

Also add error display for submit errors in the form (before the submit button or as a toast).
  </action>
  <verify>
    - Add items to cart, go to /checkout
    - Fill form with valid data, submit
    - Check /admin/orders - new order should appear
    - Check database: Order and OrderItems created, Customer created/found
  </verify>
  <done>
    Checkout form successfully creates orders in database with all customer and item data.
  </done>
</task>

<task type="auto">
  <name>Task 3: Protect admin API endpoints with auth check</name>
  <files>
    tools-shop/src/app/api/products/route.ts
    tools-shop/src/app/api/products/[id]/route.ts
    tools-shop/src/app/api/categories/route.ts
    tools-shop/src/app/api/categories/[id]/route.ts
  </files>
  <action>
Add auth check to POST, PUT, DELETE handlers (keep GET public for frontend).

Import getSession at the top of each file:
```typescript
import { getSession } from '@/lib/auth';
```

Add this auth check helper (can inline or add to each handler):
```typescript
// At the start of POST/PUT/DELETE handlers:
const session = await getSession();
if (!session) {
  return NextResponse.json(
    { error: 'Неоторизиран достъп' },
    { status: 401 }
  );
}
```

**Files to update:**

1. `api/products/route.ts` - add auth check to POST handler (line ~72)
2. `api/products/[id]/route.ts` - add auth check to PUT (line ~51) and DELETE (line ~137)
3. `api/categories/route.ts` - add auth check to POST handler (line ~35)
4. `api/categories/[id]/route.ts` - add auth check to PUT (line ~45) and DELETE (line ~122)

The pattern is the same for all: import getSession, add 4-line check at start of mutating handlers.
  </action>
  <verify>
    - Log out of admin panel
    - Use curl or browser devtools to POST to /api/products - should get 401
    - Log in to admin, create/edit/delete product - should work normally
    - Frontend product listing (GET) still works without auth
  </verify>
  <done>
    POST/PUT/DELETE on products and categories APIs require valid admin session, return 401 otherwise.
  </done>
</task>

</tasks>

<verification>
After all tasks:
1. `npm run build` - no TypeScript errors
2. Admin image upload via URL works in new/edit forms
3. Checkout creates orders visible in /admin/orders
4. Unauthenticated API mutations return 401
</verification>

<success_criteria>
- Product images added via URL in admin (not broken file upload)
- Checkout submits to /api/orders, creates Order + OrderItems + Customer
- Admin API mutations protected (401 without session)
- All existing functionality preserved (search, product listing, etc.)
</success_criteria>

<output>
After completion, verify with `npm run build` and manual testing.
</output>
