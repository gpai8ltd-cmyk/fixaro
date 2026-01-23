'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ChevronRight, Clock, Package } from 'lucide-react';

interface RecentProduct {
  id: string;
  name: string;
  slug: string;
  price: number;
  image: string;
}

const STORAGE_KEY = 'recently-viewed-products';
const MAX_ITEMS = 6;

export function addToRecentlyViewed(product: RecentProduct) {
  if (typeof window === 'undefined') return;

  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    let products: RecentProduct[] = stored ? JSON.parse(stored) : [];

    // Remove if already exists
    products = products.filter((p) => p.id !== product.id);

    // Add to beginning
    products.unshift(product);

    // Keep only MAX_ITEMS
    products = products.slice(0, MAX_ITEMS);

    localStorage.setItem(STORAGE_KEY, JSON.stringify(products));
  } catch (error) {
    console.error('Error saving to recently viewed:', error);
  }
}

export function getRecentlyViewed(): RecentProduct[] {
  if (typeof window === 'undefined') return [];

  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

interface Props {
  currentProductId?: string;
}

export default function RecentlyViewed({ currentProductId }: Props) {
  const [products, setProducts] = useState<RecentProduct[]>([]);

  useEffect(() => {
    const recentProducts = getRecentlyViewed().filter(
      (p) => p.id !== currentProductId
    );
    setProducts(recentProducts);
  }, [currentProductId]);

  if (products.length === 0) return null;

  return (
    <div className="mt-12">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Clock size={20} className="text-[var(--primary)]" />
          <h2 className="text-xl font-bold text-[var(--foreground)]">
            Наскоро разгледани
          </h2>
        </div>
        <Link
          href="/products"
          className="flex items-center gap-1 text-sm text-[var(--primary)] hover:underline"
        >
          Виж всички
          <ChevronRight size={16} />
        </Link>
      </div>

      <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
        {products.map((product) => (
          <Link
            key={product.id}
            href={`/products/${product.slug}`}
            className="flex-shrink-0 w-40 group"
          >
            <div className="aspect-square bg-slate-100 rounded-xl overflow-hidden mb-2 relative">
              {product.image ? (
                <Image
                  src={product.image}
                  alt={product.name}
                  width={160}
                  height={160}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <Package size={40} className="text-slate-300" />
                </div>
              )}
            </div>
            <h3 className="text-sm font-medium text-[var(--foreground)] line-clamp-2 group-hover:text-[var(--primary)] transition-colors">
              {product.name}
            </h3>
            <p className="text-sm font-bold text-[var(--primary)] mt-1">
              {product.price.toFixed(2)} лв.
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
}
