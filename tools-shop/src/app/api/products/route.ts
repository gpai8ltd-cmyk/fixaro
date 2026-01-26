import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/auth';
import { z } from 'zod';

// GET - List all products
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const featured = searchParams.get('featured');
    const active = searchParams.get('active');
    const search = searchParams.get('q') || searchParams.get('search');

    const where: Record<string, unknown> = {};

    if (category) {
      where.category = { slug: category };
    }

    if (featured === 'true') {
      where.isFeatured = true;
    }

    if (active !== 'all' && active !== 'false') {
      where.isActive = true;
    }

    // Search functionality
    if (search && search.trim()) {
      const searchLower = search.toLowerCase();
      where.OR = [
        { nameBg: { contains: searchLower } },
        { nameEn: { contains: searchLower } },
        { descriptionBg: { contains: searchLower } },
      ];
    }

    const products = await prisma.product.findMany({
      where,
      include: {
        category: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json(products);
  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json(
      { error: 'Грешка при зареждане на продуктите' },
      { status: 500 }
    );
  }
}

// Schema for product creation
const createProductSchema = z.object({
  nameBg: z.string().min(1, 'Името е задължително'),
  nameEn: z.string().optional(),
  descriptionBg: z.string().min(1, 'Описанието е задължително'),
  descriptionEn: z.string().optional(),
  price: z.number().positive('Цената трябва да е положително число'),
  oldPrice: z.number().positive().nullable().optional(),
  stock: z.number().int().min(0).default(0),
  categoryId: z.string().min(1, 'Категорията е задължителна'),
  isActive: z.boolean().default(true),
  isFeatured: z.boolean().default(false),
  images: z.array(z.string()).optional(),
});

// POST - Create new product
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

    // Validate input
    const validationResult = createProductSchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json(
        { error: validationResult.error.issues[0].message },
        { status: 400 }
      );
    }

    const data = validationResult.data;

    // Generate slug from Bulgarian name
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

    // Check if slug already exists
    const existingProduct = await prisma.product.findUnique({
      where: { slug },
    });

    const finalSlug = existingProduct ? `${slug}-${Date.now()}` : slug;

    // Create product
    const product = await prisma.product.create({
      data: {
        nameBg: data.nameBg,
        nameEn: data.nameEn || '',
        slug: finalSlug,
        descriptionBg: data.descriptionBg,
        descriptionEn: data.descriptionEn || '',
        price: data.price,
        oldPrice: data.oldPrice || null,
        stock: data.stock,
        categoryId: data.categoryId,
        isActive: data.isActive,
        isFeatured: data.isFeatured,
        images: JSON.stringify(data.images || []),
      },
      include: {
        category: true,
      },
    });

    return NextResponse.json(product, { status: 201 });
  } catch (error) {
    console.error('Error creating product:', error);
    return NextResponse.json(
      { error: 'Грешка при създаване на продукта' },
      { status: 500 }
    );
  }
}
