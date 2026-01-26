import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/auth';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const promotion = await prisma.promotion.findUnique({ where: { id } });
    if (!promotion) {
      return NextResponse.json({ error: 'Промоцията не е намерена' }, { status: 404 });
    }

    return NextResponse.json(promotion);
  } catch (error) {
    console.error('Error fetching promotion:', error);
    return NextResponse.json({ error: 'Грешка при зареждане на промоцията' }, { status: 500 });
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

    const promotion = await prisma.promotion.findUnique({ where: { id } });
    if (!promotion) {
      return NextResponse.json({ error: 'Промоцията не е намерена' }, { status: 404 });
    }

    // Check code uniqueness if changed
    if (body.code && body.code.toUpperCase() !== promotion.code) {
      const existing = await prisma.promotion.findUnique({ where: { code: body.code.toUpperCase() } });
      if (existing) {
        return NextResponse.json({ error: 'Този код вече съществува' }, { status: 400 });
      }
    }

    const updated = await prisma.promotion.update({
      where: { id },
      data: {
        code: body.code ? body.code.toUpperCase() : undefined,
        discountPercent: body.discountPercent !== undefined ? parseInt(body.discountPercent) : undefined,
        discountAmount: body.discountAmount !== undefined ? (body.discountAmount ? parseFloat(body.discountAmount) : null) : undefined,
        minOrderAmount: body.minOrderAmount !== undefined ? (body.minOrderAmount ? parseFloat(body.minOrderAmount) : null) : undefined,
        maxUses: body.maxUses !== undefined ? (body.maxUses ? parseInt(body.maxUses) : null) : undefined,
        validUntil: body.validUntil !== undefined ? (body.validUntil ? new Date(body.validUntil) : null) : undefined,
        active: body.active !== undefined ? body.active : undefined,
      },
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error('Error updating promotion:', error);
    return NextResponse.json({ error: 'Грешка при обновяване на промоцията' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: 'Неоторизиран достъп' }, { status: 401 });
    }

    const { id } = await params;

    const promotion = await prisma.promotion.findUnique({ where: { id } });
    if (!promotion) {
      return NextResponse.json({ error: 'Промоцията не е намерена' }, { status: 404 });
    }

    await prisma.promotion.delete({ where: { id } });

    return NextResponse.json({ success: true, message: 'Промоцията е изтрита' });
  } catch (error) {
    console.error('Error deleting promotion:', error);
    return NextResponse.json({ error: 'Грешка при изтриване на промоцията' }, { status: 500 });
  }
}
