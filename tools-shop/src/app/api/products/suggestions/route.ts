import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET - Search suggestions for autocomplete
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q');

    if (!query || query.trim().length < 2) {
      return NextResponse.json([]);
    }

    const searchLower = query.toLowerCase();

    const products = await prisma.product.findMany({
      where: {
        isActive: true,
        OR: [
          { nameBg: { contains: searchLower } },
          { nameEn: { contains: searchLower } },
        ],
      },
      select: {
        id: true,
        nameBg: true,
        slug: true,
        price: true,
        oldPrice: true,
        images: true,
      },
      take: 6,
      orderBy: { createdAt: 'desc' },
    });

    // Transform to simpler format for autocomplete
    const suggestions = products.map((product) => ({
      id: product.id,
      name: product.nameBg,
      slug: product.slug,
      price: product.price,
      oldPrice: product.oldPrice,
      image: product.images?.[0] || '/placeholder-product.png',
    }));

    return NextResponse.json(suggestions);
  } catch (error) {
    console.error('Error fetching suggestions:', error);
    return NextResponse.json([]);
  }
}
