'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ShoppingCart, Eye, Package, Flame, Star, Sparkles } from 'lucide-react';
import { useCart } from '@/store/cart';

interface ProductCardProps {
  id: string;
  name: string;
  slug: string;
  price: number;
  oldPrice?: number | null;
  image: string;
  category?: string;
  categorySlug?: string;
  stock?: number;
  inStock?: boolean;
  badge?: string | null;
}

const badgeConfig: Record<string, { icon: React.ElementType; color: string; bg: string }> = {
  'Ново': { icon: Sparkles, color: 'text-blue-600', bg: 'bg-blue-100' },
  'Топ продажба': { icon: Flame, color: 'text-orange-600', bg: 'bg-orange-100' },
  'Препоръчано': { icon: Star, color: 'text-purple-600', bg: 'bg-purple-100' },
};

export default function ProductCard({
  id,
  name,
  slug,
  price,
  oldPrice,
  image,
  category,
  stock,
  inStock = true,
  badge,
}: ProductCardProps) {
  const { addItem } = useCart();

  const discount = oldPrice ? Math.round(((oldPrice - price) / oldPrice) * 100) : 0;
  const isAvailable = inStock && (stock === undefined || stock > 0);
  const isLowStock = stock !== undefined && stock > 0 && stock <= 5;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    addItem({
      id,
      name,
      price,
      oldPrice: oldPrice || undefined,
      image,
    });
  };

  return (
    <Link href={`/products/${slug}`} className="product-card group block">
      {/* Image */}
      <div className="product-image">
        {image ? (
          <Image
            src={image}
            alt={name}
            width={300}
            height={300}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-slate-100">
            <Package size={48} className="text-slate-300" aria-hidden="true" />
          </div>
        )}

        {/* Badges */}
        <div className="absolute top-2 left-2 flex flex-col gap-1">
          {discount > 0 && (
            <span className="sale-badge">-{discount}%</span>
          )}
          {badge && badgeConfig[badge] && (
            <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-md text-xs font-semibold ${badgeConfig[badge].bg} ${badgeConfig[badge].color}`}>
              {(() => {
                const IconComponent = badgeConfig[badge].icon;
                return <IconComponent size={12} />;
              })()}
              {badge}
            </span>
          )}
          {isLowStock && (
            <span className="inline-flex items-center gap-1 px-2 py-1 rounded-md text-xs font-semibold bg-amber-100 text-amber-700">
              Последни {stock} бр.
            </span>
          )}
        </div>

        {/* Stock badge - top right */}
        {!isAvailable && (
          <div className="absolute top-2 right-2">
            <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-semibold bg-red-100 text-red-700">
              Изчерпан
            </span>
          </div>
        )}

        {/* Out of stock overlay */}
        {!isAvailable && (
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
            <span className="bg-white text-[var(--foreground)] px-4 py-2 rounded-lg font-medium shadow-lg">
              Изчерпан
            </span>
          </div>
        )}

        {/* Hover actions */}
        {isAvailable && (
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100">
            <button
              onClick={handleAddToCart}
              className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-[var(--foreground)] hover:bg-[var(--primary)] hover:text-white transition-colors shadow-lg"
              aria-label={`Добави ${name} в количката`}
            >
              <ShoppingCart size={20} aria-hidden="true" />
            </button>
            <span
              className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-[var(--foreground)] hover:bg-[var(--primary)] hover:text-white transition-colors shadow-lg"
              aria-label="Преглед"
            >
              <Eye size={20} aria-hidden="true" />
            </span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        {category && (
          <span className="text-xs text-[var(--muted)] uppercase tracking-wide">
            {category}
          </span>
        )}

        <h3 className="font-medium text-[var(--foreground)] mt-1 line-clamp-2 group-hover:text-[var(--primary)] transition-colors">
          {name}
        </h3>

        <div className="flex items-center gap-2 mt-2">
          <span className="price-current">
            {price.toFixed(2)} лв.
          </span>
          {oldPrice && (
            <span className="price-old">
              {oldPrice.toFixed(2)} лв.
            </span>
          )}
        </div>

        {/* Mobile add to cart button */}
        <button
          onClick={handleAddToCart}
          disabled={!isAvailable}
          className={`w-full mt-3 lg:hidden py-3 px-4 rounded-lg font-medium flex items-center justify-center gap-2 transition-colors ${
            isAvailable
              ? 'btn btn-primary'
              : 'bg-gray-200 text-gray-500 cursor-not-allowed'
          }`}
          aria-label={isAvailable ? `Добави ${name} в количката` : 'Продуктът е изчерпан'}
        >
          <ShoppingCart size={18} aria-hidden="true" />
          <span>{isAvailable ? 'Добави' : 'Изчерпан'}</span>
        </button>
      </div>
    </Link>
  );
}
