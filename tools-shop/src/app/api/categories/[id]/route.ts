import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

// GET - Get single category by ID
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const category = await prisma.category.findUnique({
      where: { id },
      include: {
        _count: { select: { products: true } }
      },
    });

    if (!category) {
      return NextResponse.json(
        { error: 'Категорията не е намерена' },
        { status: 404 }
      );
    }

    return NextResponse.json(category);
  } catch (error) {
    console.error('Error fetching category:', error);
    return NextResponse.json(
      { error: 'Грешка при зареждане на категорията' },
      { status: 500 }
    );
  }
}

// Schema for category update
const updateCategorySchema = z.object({
  nameBg: z.string().min(1, 'Името е задължително').optional(),
  nameEn: z.string().optional(),
  description: z.string().optional(),
});

// PUT - Update category
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    // Check if category exists
    const existing = await prisma.category.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json(
        { error: 'Категорията не е намерена' },
        { status: 404 }
      );
    }

    // Validate input
    const validationResult = updateCategorySchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json(
        { error: validationResult.error.issues[0].message },
        { status: 400 }
      );
    }

    const data = validationResult.data;

    // Generate new slug if name changed
    let slug = existing.slug;
    if (data.nameBg && data.nameBg !== existing.nameBg) {
      slug = data.nameBg
        .toLowerCase()
        .replace(/[а-я]/g, (char) => {
          const map: Record<string, string> = {
            'а': 'a', 'б': 'b', 'в': 'v', 'г': 'g', 'д': 'd', 'е': 'e', 'ж': 'zh',
            'з': 'z', 'и': 'i', 'й': 'y', 'к': 'k', 'л': 'l', 'м': 'm', 'н': 'n',
            'о': 'o', 'п': 'p', 'р': 'r', 'с': 's', 'т': 't', 'у': 'u', 'ф': 'f',
            'х': 'h', 'ц': 'ts', 'ч': 'ch', 'ш': 'sh', 'щ': 'sht', 'ъ': 'a', 'ь': '',
            'ю': 'yu', 'я': 'ya'
          };
          return map[char] || char;
        })
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '');

      // Check if new slug already exists (excluding current category)
      const slugExists = await prisma.category.findFirst({
        where: { slug, id: { not: id } },
      });
      if (slugExists) {
        slug = `${slug}-${Date.now()}`;
      }
    }

    // Update category
    const category = await prisma.category.update({
      where: { id },
      data: {
        ...(data.nameBg && { nameBg: data.nameBg }),
        ...(data.nameEn !== undefined && { nameEn: data.nameEn }),
        ...(data.nameBg && { slug }),
        ...(data.description !== undefined && { description: data.description }),
      },
    });

    return NextResponse.json(category);
  } catch (error) {
    console.error('Error updating category:', error);
    return NextResponse.json(
      { error: 'Грешка при обновяване на категорията' },
      { status: 500 }
    );
  }
}

// DELETE - Delete category
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Check if category exists
    const existing = await prisma.category.findUnique({
      where: { id },
      include: { _count: { select: { products: true } } },
    });

    if (!existing) {
      return NextResponse.json(
        { error: 'Категорията не е намерена' },
        { status: 404 }
      );
    }

    // Check if category has products
    if (existing._count.products > 0) {
      return NextResponse.json(
        { error: `Не може да изтриете категория с ${existing._count.products} продукта. Първо преместете или изтрийте продуктите.` },
        { status: 400 }
      );
    }

    // Delete category
    await prisma.category.delete({ where: { id } });

    return NextResponse.json({ success: true, message: 'Категорията е изтрита успешно' });
  } catch (error) {
    console.error('Error deleting category:', error);
    return NextResponse.json(
      { error: 'Грешка при изтриване на категорията' },
      { status: 500 }
    );
  }
}
