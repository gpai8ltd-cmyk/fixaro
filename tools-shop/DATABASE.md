# Database Documentation

## Prisma Schema

Проектът използва Prisma v5.22.0 с SQLite база данни.

## Модели

### Admin
- `id` - уникален идентификатор (cuid)
- `email` - имейл (unique)
- `password` - хеширана парола (bcrypt)
- `name` - име на администратора
- `createdAt` / `updatedAt` - timestamps

**Начален admin:**
- Email: `admin@toolsshop.bg`
- Password: `admin123`

### Category
- `id` - уникален идентификатор
- `nameBg` / `nameEn` - име на български и английски
- `slug` - URL-friendly идентификатор (unique)
- `description` - описание
- `parentId` - връзка към родителска категория (за подкатегории)
- `parent` / `children` - self-relation за йерархия
- `products` - продукти в тази категория

### Product
- `id` - уникален идентификатор
- `nameBg` / `nameEn` - име на БГ/EN
- `slug` - URL slug (unique)
- `descriptionBg` / `descriptionEn` - описание на БГ/EN
- `price` - цена
- `oldPrice` - стара цена (за промоции, nullable)
- `images` - JSON масив със снимки
- `stock` - наличност
- `isActive` - активен ли е продукта
- `isFeatured` - показва се ли на начална страница
- `categoryId` - категория
- `orderItems` - елементи от поръчки

### Customer
- `id` - уникален идентификатор
- `name` - име
- `email` - имейл (nullable)
- `phone` - телефон
- `address` / `city` - адрес (nullable)
- `orders` - поръчки на клиента

### Order
- `id` - уникален идентификатор
- `orderNumber` - номер на поръчка (unique) - формат: ORD-YYYYMMDD-###
- `status` - статус: PENDING, CONFIRMED, PROCESSING, SHIPPED, DELIVERED, CANCELLED, RETURNED
- **Customer info:**
  - `customerId` - връзка към Customer (nullable)
  - `customerName` - име
  - `customerEmail` - имейл (nullable)
  - `customerPhone` - телефон
- **Delivery info:**
  - `deliveryAddress` - адрес
  - `deliveryCity` - град
  - `deliveryZip` - пощенски код (nullable)
  - `courier` - ECONT, SPEEDY, OTHER
  - `courierOffice` - офис на куриер (nullable)
- **Order details:**
  - `items` - продукти в поръчката
  - `subtotal` - междинна сума
  - `deliveryFee` - такса доставка
  - `total` - обща сума
  - `notes` - бележки от клиента (nullable)
- **Admin notes:**
  - `adminNotes` - вътрешни бележки (nullable)
  - `trackingNumber` - номер за проследяване (nullable)
- **Timestamps:**
  - `createdAt` / `updatedAt` - timestamps
  - `completedAt` - дата на завършване (nullable)

### OrderItem
- `id` - уникален идентификатор
- `orderId` - поръчка
- `productId` - продукт (nullable - ако продукта е изтрит)
- **Snapshot:**
  - `productName` - име на продукта в момента на поръчката
  - `productPrice` - цена в момента на поръчката
  - `quantity` - количество
  - `subtotal` - междинна сума

## Команди

### Setup
```bash
# Генериране на Prisma Client
npm run db:push

# Стартиране на seed
npm run db:seed

# Отваряне на Prisma Studio
npm run db:studio
```

### Миграции
```bash
# Нова миграция
npx prisma migrate dev --name migration_name

# Reset на базата (ВНИМАНИЕ: изтрива всички данни)
npx prisma migrate reset
```

## Използване в код

### Server Components (Next.js)
```typescript
import { prisma } from '@/lib/prisma'

export default async function ProductsPage() {
  const products = await prisma.product.findMany({
    where: { isActive: true },
    include: { category: true },
    orderBy: { createdAt: 'desc' }
  })
  
  return <div>{/* render products */}</div>
}
```

### API Routes
```typescript
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  const products = await prisma.product.findMany()
  return NextResponse.json(products)
}
```

### Server Actions
```typescript
'use server'

import { prisma } from '@/lib/prisma'

export async function createOrder(data: OrderInput) {
  const orderNumber = `ORD-${new Date().toISOString().slice(0, 10).replace(/-/g, '')}-${Math.random().toString(36).substr(2, 3).toUpperCase()}`
  
  const order = await prisma.order.create({
    data: {
      orderNumber,
      ...data,
      items: {
        create: data.items
      }
    }
  })
  
  return order
}
```

## Indexes

Оптимизирани са следните полета за търсене:
- Category: `slug`, `parentId`
- Product: `slug`, `categoryId`, `isActive`, `isFeatured`
- Customer: `phone`, `email`
- Order: `orderNumber`, `status`, `customerId`, `createdAt`
- OrderItem: `orderId`, `productId`
