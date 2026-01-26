import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/auth';

export async function GET() {
  try {
    const promotions = await prisma.promotion.findMany({
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json(promotions);
  } catch (error) {
    console.error('Error fetching promotions:', error);
    return NextResponse.json({ error: 'Грешка при зареждане на промоциите' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: 'Неоторизиран достъп' }, { status: 401 });
    }

    const body = await request.json();

    if (!body.code || body.discountPercent === undefined) {
      return NextResponse.json({ error: 'Кодът и процентът са задължителни' }, { status: 400 });
    }

    // Check if code already exists
    const existing = await prisma.promotion.findUnique({ where: { code: body.code.toUpperCase() } });
    if (existing) {
      return NextResponse.json({ error: 'Този код вече съществува' }, { status: 400 });
    }

    const promotion = await prisma.promotion.create({
      data: {
        code: body.code.toUpperCase(),
        discountPercent: parseInt(body.discountPercent),
        discountAmount: body.discountAmount ? parseFloat(body.discountAmount) : null,
        minOrderAmount: body.minOrderAmount ? parseFloat(body.minOrderAmount) : null,
        maxUses: body.maxUses ? parseInt(body.maxUses) : null,
        validUntil: body.validUntil ? new Date(body.validUntil) : null,
        active: body.active !== false,
      },
    });

    return NextResponse.json(promotion, { status: 201 });
  } catch (error) {
    console.error('Error creating promotion:', error);
    return NextResponse.json({ error: 'Грешка при създаване на промоцията' }, { status: 500 });
  }
}
