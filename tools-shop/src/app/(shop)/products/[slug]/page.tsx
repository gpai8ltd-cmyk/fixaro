import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import ProductDetailClient from './ProductDetailClient';
import { ProductJsonLd, BreadcrumbJsonLd } from '@/components/JsonLd';

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

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://fixaro.bg';

  return (
    <>
      <ProductJsonLd
        name={productData.name}
        description={productData.description || ''}
        image={productData.images[0]}
        price={productData.price}
        availability={productData.inStock ? 'InStock' : 'OutOfStock'}
        sku={productData.id}
        url={`${siteUrl}/products/${productData.slug}`}
      />
      <BreadcrumbJsonLd
        items={[
          { name: 'Начало', url: siteUrl },
          { name: 'Продукти', url: `${siteUrl}/products` },
          { name: productData.category, url: `${siteUrl}/products?category=${productData.categorySlug}` },
          { name: productData.name, url: `${siteUrl}/products/${productData.slug}` },
        ]}
      />
      <ProductDetailClient
        product={productData}
        relatedProducts={relatedProductsData}
      />
    </>
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

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://fixaro.bg';
  const categoryName = product.category?.nameBg || 'инструменти';

  // Strip HTML tags from description for meta
  const plainDescription = product.descriptionBg
    ?.replace(/<[^>]*>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, 155);

  const description = plainDescription
    ? `${plainDescription} | Fixaro`
    : `Купи ${product.nameBg} от Fixaro. ${categoryName} с бърза доставка и гаранция 2 години. Наложен платеж.`;

  let images: string[] = [];
  try {
    images = JSON.parse(product.images || '[]');
  } catch {
    images = [];
  }

  return {
    title: `${product.nameBg} - купи онлайн на добра цена | Fixaro`,
    description,
    keywords: [
      product.nameBg,
      `купи ${product.nameBg}`,
      `${product.nameBg} цена`,
      `${product.nameBg} онлайн`,
      `${product.nameBg} промоция`,
      `${product.nameBg} с доставка`,
      `${product.nameBg} евтино`,
      categoryName,
      `${categoryName} онлайн`,
      `купи ${categoryName}`,
      `${categoryName} с доставка България`,
      'инструменти онлайн',
      'инструменти с наложен платеж',
      'инструменти с гаранция',
      'Fixaro',
    ],
    alternates: {
      canonical: `/products/${slug}`,
    },
    openGraph: {
      title: `${product.nameBg} - купи онлайн | Fixaro`,
      description,
      url: `${siteUrl}/products/${slug}`,
      type: 'website',
      images: images[0] ? [{ url: images[0], alt: product.nameBg, width: 800, height: 600 }] : [],
    },
  };
}
