import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import ProductDetailClient from './ProductDetailClient';

interface PageProps {
  params: Promise<{ slug: string }>;
}

async function getProduct(slug: string) {
  const product = await prisma.product.findUnique({
    where: { slug },
    include: {
      category: true,
    },
  });

  if (!product || !product.isActive) {
    return null;
  }

  return product;
}

async function getRelatedProducts(categoryId: string, currentProductId: string) {
  const products = await prisma.product.findMany({
    where: {
      categoryId,
      isActive: true,
      id: { not: currentProductId },
    },
    include: {
      category: true,
    },
    take: 4,
    orderBy: { createdAt: 'desc' },
  });

  return products;
}

export default async function ProductPage({ params }: PageProps) {
  const { slug } = await params;
  const product = await getProduct(slug);

  if (!product) {
    notFound();
  }

  const relatedProducts = await getRelatedProducts(product.categoryId, product.id);

  // Parse images
  let images: string[] = [];
  try {
    images = JSON.parse(product.images || '[]');
  } catch {
    images = [];
  }

  // Prepare data for client component
  const productData = {
    id: product.id,
    name: product.nameBg,
    slug: product.slug,
    price: product.price,
    oldPrice: product.oldPrice,
    images: images.length > 0 ? images : ['/images/placeholder.jpg'],
    category: product.category?.nameBg || '',
    categorySlug: product.category?.slug || '',
    description: product.descriptionBg,
    inStock: product.stock > 0,
    stockCount: product.stock,
  };

  const relatedProductsData = relatedProducts.map((p) => {
    let imgs: string[] = [];
    try {
      imgs = JSON.parse(p.images || '[]');
    } catch {
      imgs = [];
    }
    return {
      id: p.id,
      name: p.nameBg,
      slug: p.slug,
      price: p.price,
      oldPrice: p.oldPrice,
      stock: p.stock,
      image: imgs[0] || '/images/placeholder.jpg',
      category: p.category?.nameBg || '',
      categorySlug: p.category?.slug || '',
    };
  });

  return (
    <ProductDetailClient
      product={productData}
      relatedProducts={relatedProductsData}
    />
  );
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const product = await getProduct(slug);

  if (!product) {
    return {
      title: 'Продуктът не е намерен',
    };
  }

  return {
    title: `${product.nameBg} | ToolsShop`,
    description: product.descriptionBg?.slice(0, 160),
  };
}
