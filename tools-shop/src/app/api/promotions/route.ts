import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/auth';
import { z } from 'zod';

const promotionSchema = z.object({
  code: z
    .string()
    .min(3, 'Кодът трябва да е поне 3 символа')
    .max(50, 'Кодът е твърде дълъг')
    .regex(/^[A-Z0-9_-]+$/, 'Кодът може да съдържа само главни букви, цифри, _ и -'),
  discountPercent: z
    .number()
    .int('Процентът трябва да е цяло число')
    .min(1, 'Процентът трябва да е поне 1')
    .max(100, 'Процентът не може да надвишава 100'),
  discountAmount: z.number().positive().nullable().optional(),
  minOrderAmount: z.number().positive().nullable().optional(),
  maxUses: z.number().int().positive().nullable().optional(),
  validUntil: z.string().nullable().optional(),
  active: z.boolean().optional(),
});

export async function GET() {
  // SECURITY: Admin-only — exposes all promo codes
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: 'Неоторизиран достъп' }, { status: 401 });
  }

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
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: 'Неоторизиран достъп' }, { status: 401 });
  }

  try {
    const body = await request.json();

    // Normalize code before validation
    if (body.code && typeof body.code === 'string') body.code = body.code.toUpperCase();

    const validationResult = promotionSchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json(
        { error: validationResult.error.issues[0].message },
        { status: 400 }
      );
    }

    const data = validationResult.data;

    // Check if code already exists
    const existing = await prisma.promotion.findUnique({ where: { code: data.code } });
    if (existing) {
      return NextResponse.json({ error: 'Този код вече съществува' }, { status: 400 });
    }

    const promotion = await prisma.promotion.create({
      data: {
        code: data.code,
        discountPercent: data.discountPercent,
        discountAmount: data.discountAmount ?? null,
        minOrderAmount: data.minOrderAmount ?? null,
        maxUses: data.maxUses ?? null,
        validUntil: data.validUntil ? new Date(data.validUntil) : null,
        active: data.active !== false,
      },
    });

    return NextResponse.json(promotion, { status: 201 });
  } catch (error) {
    console.error('Error creating promotion:', error);
    return NextResponse.json({ error: 'Грешка при създаване на промоцията' }, { status: 500 });
  }
}
