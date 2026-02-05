import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { checkoutSchema, formatZodError } from '@/lib/validations';
import { sendOrderNotification, sendOrderConfirmationToCustomer } from '@/lib/email';

export async function GET(request: NextRequest) {
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

    // Send email notification to shop owner (don't await - fire and forget)
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
