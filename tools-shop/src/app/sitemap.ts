import { MetadataRoute } from 'next';
import { prisma } from '@/lib/prisma';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://fixaro.bg';

  // Static pages
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: siteUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${siteUrl}/products`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${siteUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${siteUrl}/delivery`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${siteUrl}/returns`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: `${siteUrl}/terms`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: `${siteUrl}/privacy`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: `${siteUrl}/cookies`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.4,
    },
  ];

  // Dynamic category pages
  let categoryPages: MetadataRoute.Sitemap = [];

  try {
    const categories = await prisma.category.findMany({
      select: {
        slug: true,
        updatedAt: true,
      },
    });

    categoryPages = categories.map((category) => ({
      url: `${siteUrl}/products?category=${category.slug}`,
      lastModified: category.updatedAt,
      changeFrequency: 'daily' as const,
      priority: 0.85,
    }));
  } catch (error) {
    console.error('Error fetching categories for sitemap:', error);
  }

  // Dynamic product pages
  let productPages: MetadataRoute.Sitemap = [];

  try {
    const products = await prisma.product.findMany({
      where: { stock: { gt: 0 } },
      select: {
        slug: true,
        updatedAt: true,
      },
    });

    productPages = products.map((product) => ({
      url: `${siteUrl}/products/${product.slug}`,
      lastModified: product.updatedAt,
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    }));
  } catch (error) {
    console.error('Error fetching products for sitemap:', error);
  }

  return [...staticPages, ...categoryPages, ...productPages];
}
