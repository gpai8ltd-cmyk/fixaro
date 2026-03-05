import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/auth';
import { checkoutSchema, formatZodError } from '@/lib/validations';
import { sendOrderNotification, sendOrderConfirmationToCustomer } from '@/lib/email';
import { checkRateLimit, getClientIp, orderRateLimit } from '@/lib/rate-limit';
import { randomBytes } from 'crypto';

export async function GET(request: NextRequest) {
  // SECURITY: Admin-only — orders contain customer PII
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: 'Неоторизиран достъп' }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');

    const orders = await prisma.order.findMany({
      where: status ? { status } : undefined,
      include: {
        items: true,
        customer: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json(orders);
  } catch (error) {
    console.error('Error fetching orders:', error);
    return NextResponse.json({ error: 'Грешка при зареждане на поръчките' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  // Rate limiting — prevent order spam
  const clientIp = getClientIp(request);
  const rateLimitResult = checkRateLimit(`order:${clientIp}`, orderRateLimit);
  if (!rateLimitResult.success) {
    const retryAfter = Math.ceil((rateLimitResult.resetTime - Date.now()) / 1000);
    return NextResponse.json(
      { error: 'Твърде много поръчки от този адрес. Опитайте отново по-късно.' },
      {
        status: 429,
        headers: { 'Retry-After': String(retryAfter) },
      }
    );
  }

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

    // SECURITY: Fetch actual prices from database — NEVER trust client-provided prices
    const productIds = data.items.map((item) => item.id);
    const dbProducts = await prisma.product.findMany({
      where: { id: { in: productIds }, isActive: true },
      select: { id: true, nameBg: true, price: true },
    });

    const productMap = new Map(dbProducts.map((p) => [p.id, p]));

    // Verify all products exist and are active
    const missingProduct = data.items.find((item) => !productMap.has(item.id));
    if (missingProduct) {
      return NextResponse.json(
        { error: 'Един или повече продукти не са намерени или не са активни' },
        { status: 400 }
      );
    }

    // Calculate subtotal using DB prices (ignore client-provided prices)
    const subtotal = data.items.reduce((sum, item) => {
      const dbProduct = productMap.get(item.id)!;
      return sum + dbProduct.price * item.quantity;
    }, 0);

    const deliveryFee = subtotal >= 391.17 ? 0 : 13.69;
    const total = subtotal + deliveryFee;

    // Generate order number: ORD-YYYYMMDD-XXXXXX (crypto random, collision-safe)
    const date = new Date();
    const dateStr = `${date.getFullYear()}${String(date.getMonth() + 1).padStart(2, '0')}${String(date.getDate()).padStart(2, '0')}`;
    const randomPart = randomBytes(3).toString('hex').toUpperCase();
    const orderNumber = `ORD-${dateStr}-${randomPart}`;

    // Find or create customer by phone
    let customer = await prisma.customer.findFirst({
      where: { phone: data.phone },
    });

    if (!customer) {
      try {
        customer = await prisma.customer.create({
          data: {
            name: data.name,
            phone: data.phone,
            email: data.email || null,
            city: data.city,
            address: data.deliveryType === 'address' ? data.address : null,
          },
        });
      } catch {
        // Race condition: another request created the customer first
        customer = await prisma.customer.findFirst({
          where: { phone: data.phone },
        });
        if (!customer) throw new Error('Failed to find or create customer');
      }
    }

    // Create order with items — use DB prices and names
    const order = await prisma.order.create({
      data: {
        orderNumber,
        customerId: customer.id,
        customerName: data.name,
        customerPhone: data.phone,
        customerEmail: data.email || null,
        deliveryCity: data.city,
        deliveryAddress: data.deliveryType === 'address' ? data.address! : data.office!,
        courier: data.courier.toUpperCase(),
        courierOffice: data.deliveryType === 'office' ? data.office : null,
        subtotal,
        deliveryFee,
        total,
        notes: data.notes || null,
        items: {
          create: data.items.map((item) => {
            const dbProduct = productMap.get(item.id)!;
            return {
              productId: item.id,
              productName: dbProduct.nameBg,   // DB name
              productPrice: dbProduct.price,    // DB price — NOT client price
              quantity: item.quantity,
              subtotal: dbProduct.price * item.quantity,
            };
          }),
        },
      },
      include: { items: true },
    });

    // Send email notification to shop owner (fire and forget)
    sendOrderNotification({
      orderNumber: order.orderNumber,
      customerName: order.customerName,
      customerPhone: order.customerPhone,
      customerEmail: order.customerEmail,
      deliveryCity: order.deliveryCity,
      deliveryAddress: order.deliveryAddress,
      courier: order.courier,
      courierOffice: order.courierOffice,
      subtotal: order.subtotal,
      deliveryFee: order.deliveryFee,
      total: order.total,
      notes: order.notes,
      items: order.items,
    }).catch((err) => console.error('Failed to send order notification:', err));

    // Send confirmation email to customer (if email provided)
    sendOrderConfirmationToCustomer({
      orderNumber: order.orderNumber,
      customerName: order.customerName,
      customerPhone: order.customerPhone,
      customerEmail: order.customerEmail,
      deliveryCity: order.deliveryCity,
      deliveryAddress: order.deliveryAddress,
      courier: order.courier,
      courierOffice: order.courierOffice,
      subtotal: order.subtotal,
      deliveryFee: order.deliveryFee,
      total: order.total,
      notes: order.notes,
      items: order.items,
    }).catch((err) => console.error('Failed to send customer confirmation:', err));

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
