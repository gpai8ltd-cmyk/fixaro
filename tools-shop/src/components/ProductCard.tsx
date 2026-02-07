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

const BGN_TO_EUR = 1.95583;
const toEur = (bgn: number) => (bgn / BGN_TO_EUR).toFixed(2);

export default function ProductCard({
  id,
  name,
  slug,
  price,
  oldPrice,
  image,
  category,
  badge,
}: ProductCardProps) {
  const { addItem } = useCart();

  const discount = oldPrice ? Math.round(((oldPrice - price) / oldPrice) * 100) : 0;

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
            <span className="sale-badge sale-badge-pulse">-{discount}%</span>
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
        </div>

        {/* Hover actions - Quick view overlay */}
        <div className="quick-view-overlay absolute inset-0 bg-black/30 flex items-center justify-center gap-3">
          <button
            onClick={handleAddToCart}
            className="w-12 h-12 bg-white rounded-full flex items-center justify-center hover:bg-[var(--primary)] transition-colors shadow-lg transform hover:scale-110 group/btn"
            aria-label={`Добави ${name} в количката`}
          >
            <ShoppingCart size={20} className="text-gray-800 group-hover/btn:text-white" aria-hidden="true" />
          </button>
          <span
            className="w-12 h-12 bg-white rounded-full flex items-center justify-center hover:bg-[var(--primary)] transition-colors shadow-lg transform hover:scale-110 group/eye"
            aria-label="Преглед"
          >
            <Eye size={20} className="text-gray-800 group-hover/eye:text-white" aria-hidden="true" />
          </span>
        </div>
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

        <div className="flex flex-col gap-1 mt-2">
          <div className="flex items-center gap-2">
            <span className="price-current">
              {price.toFixed(2)} лв.
            </span>
            {oldPrice && (
              <span className="price-old">
                {oldPrice.toFixed(2)} лв.
              </span>
            )}
          </div>
          <span className="text-xs text-[var(--muted)]">
            {toEur(price)} € {oldPrice && <span className="line-through">{toEur(oldPrice)} €</span>}
          </span>
        </div>

        {/* Mobile add to cart button */}
        <button
          onClick={handleAddToCart}
          className="w-full mt-3 lg:hidden py-3 px-4 rounded-lg font-medium flex items-center justify-center gap-2 transition-colors btn btn-primary"
          aria-label={`Добави ${name} в количката`}
        >
          <ShoppingCart size={18} aria-hidden="true" />
          <span>Добави</span>
        </button>
      </div>
    </Link>
  );
}
