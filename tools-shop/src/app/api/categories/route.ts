import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/auth';
import { z } from 'zod';

// GET - List all categories
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const tree = searchParams.get('tree');

    const categories = await prisma.category.findMany({
      orderBy: { nameBg: 'asc' },
      include: {
        _count: {
          select: { products: true }
        },
        children: {
          orderBy: { nameBg: 'asc' },
          include: {
            _count: {
              select: { products: true }
            }
          }
        },
        parent: true,
      }
    });

    // If tree=true, return only root categories (with children nested)
    if (tree === 'true') {
      const rootCategories = categories.filter(c => !c.parentId);
      return NextResponse.json(rootCategories);
    }

    return NextResponse.json(categories);
  } catch (error) {
    console.error('Error fetching categories:', error);
    return NextResponse.json(
      { error: 'Грешка при зареждане на категориите' },
      { status: 500 }
    );
  }
}

// Schema for category creation
const createCategorySchema = z.object({
  nameBg: z.string().min(1, 'Името е задължително'),
  nameEn: z.string().optional(),
  description: z.string().optional(),
  parentId: z.string().optional().nullable(),
});

// POST - Create new category
export async function POST(request: NextRequest) {
  try {
    // Auth check
    const session = await getSession();
    if (!session) {
      return NextResponse.json(
        { error: 'Неоторизиран достъп' },
        { status: 401 }
      );
    }

    const body = await request.json();

    const validationResult = createCategorySchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json(
        { error: validationResult.error.issues[0].message },
        { status: 400 }
      );
    }

    const data = validationResult.data;

    // Generate slug
    const slug = data.nameBg
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

    // Check if slug exists
    const existing = await prisma.category.findUnique({ where: { slug } });
    const finalSlug = existing ? `${slug}-${Date.now()}` : slug;

    const category = await prisma.category.create({
      data: {
        nameBg: data.nameBg,
        nameEn: data.nameEn || '',
        slug: finalSlug,
        description: data.description || '',
        ...(data.parentId && { parentId: data.parentId }),
      },
    });

    return NextResponse.json(category, { status: 201 });
  } catch (error) {
    console.error('Error creating category:', error);
    return NextResponse.json(
      { error: 'Грешка при създаване на категорията' },
      { status: 500 }
    );
  }
}
