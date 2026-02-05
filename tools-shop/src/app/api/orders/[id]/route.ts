import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/auth';
import { sendOrderStatusUpdate } from '@/lib/email';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const order = await prisma.order.findUnique({
      where: { id },
      include: {
        items: {
          include: { product: true },
        },
        customer: true,
      },
    });

    if (!order) {
      return NextResponse.json({ error: 'Поръчката не е намерена' }, { status: 404 });
    }

    return NextResponse.json(order);
  } catch (error) {
    console.error('Error fetching order:', error);
    return NextResponse.json({ error: 'Грешка при зареждане на поръчката' }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: 'Неоторизиран достъп' }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();

    const order = await prisma.order.findUnique({ where: { id } });
    if (!order) {
      return NextResponse.json({ error: 'Поръчката не е намерена' }, { status: 404 });
    }

    const updateData: Record<string, unknown> = {};

    if (body.status) {
      updateData.status = body.status;
      if (body.status === 'DELIVERED') {
        updateData.completedAt = new Date();
      }
    }
    if (body.trackingNumber !== undefined) updateData.trackingNumber = body.trackingNumber;
    if (body.adminNotes !== undefined) updateData.adminNotes = body.adminNotes;

    const updated = await prisma.order.update({
      where: { id },
      data: updateData,
      include: { items: true, customer: true },
    });

    // Send status update email if requested and customer has email
    if (body.sendEmail && updated.customerEmail && body.status) {
      const statusMap: Record<string, 'processing' | 'shipped' | 'delivered' | 'cancelled'> = {
        'PROCESSING': 'processing',
        'SHIPPED': 'shipped',
        'DELIVERED': 'delivered',
        'CANCELLED': 'cancelled',
      };

      const mappedStatus = statusMap[body.status];
      if (mappedStatus) {
        sendOrderStatusUpdate({
          orderNumber: updated.orderNumber,
          customerName: updated.customerName,
          customerEmail: updated.customerEmail,
          status: mappedStatus,
          trackingNumber: updated.trackingNumber || undefined,
          courier: updated.courier,
        }).catch((err) => console.error('Failed to send status update email:', err));
      }
    }

    return NextResponse.json(updated);
  } catch (error) {
    console.error('Error updating order:', error);
    return NextResponse.json({ error: 'Грешка при обновяване на поръчката' }, { status: 500 });
  }
}
