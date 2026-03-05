import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/auth';

export async function GET() {
  // SECURITY: Admin-only — customer data contains PII (GDPR)
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: 'Неоторизиран достъп' }, { status: 401 });
  }

  try {
    const customers = await prisma.customer.findMany({
      include: {
        _count: { select: { orders: true } },
        orders: {
          select: { total: true, status: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    // Calculate total spent for each customer
    const customersWithStats = customers.map((c) => ({
      ...c,
      ordersCount: c._count.orders,
      totalSpent: c.orders
        .filter((o) => o.status === 'DELIVERED')
        .reduce((sum, o) => sum + o.total, 0),
    }));

    return NextResponse.json(customersWithStats);
  } catch (error) {
    console.error('Error fetching customers:', error);
    return NextResponse.json({ error: 'Грешка при зареждане на клиентите' }, { status: 500 });
  }
}
