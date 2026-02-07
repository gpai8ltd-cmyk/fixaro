'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  ShoppingCart,
  Heart,
  Share2,
  Truck,
  Shield,
  RotateCcw,
  Minus,
  Plus,
  ChevronRight,
  Package,
  Check
} from 'lucide-react';
import { useCart } from '@/store/cart';
import ProductCard from '@/components/ProductCard';
import Reviews from '@/components/Reviews';
import RecentlyViewed, { addToRecentlyViewed } from '@/components/RecentlyViewed';

interface Product {
  id: string;
  name: string;
  slug: string;
  price: number;
  oldPrice: number | null;
  images: string[];
  category: string;
  categorySlug: string;
  description: string;
  inStock: boolean;
  stockCount: number;
}

interface RelatedProduct {
  id: string;
  name: string;
  slug: string;
  price: number;
  oldPrice: number | null;
  stock: number;
  image: string;
  category: string;
  categorySlug: string;
}

interface Props {
  product: Product;
  relatedProducts: RelatedProduct[];
}

const BGN_TO_EUR = 1.95583;
const toEur = (bgn: number) => (bgn / BGN_TO_EUR).toFixed(2);

export default function ProductDetailClient({ product, relatedProducts }: Props) {
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [addedToCart, setAddedToCart] = useState(false);
  const { addItem } = useCart();

  // Track recently viewed
  useEffect(() => {
    addToRecentlyViewed({
      id: product.id,
      name: product.name,
      slug: product.slug,
      price: product.price,
      image: product.images[0],
    });
  }, [product]);

  const discount = product.oldPrice
    ? Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100)
    : 0;

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) {
      addItem({
        id: product.id,
        name: product.name,
        price: product.price,
        oldPrice: product.oldPrice || undefined,
        image: product.images[0],
      });
    }
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2000);
  };

  return (
    <div className="container-custom py-6 md:py-8">
      {/* Breadcrumb */}
      <nav className="text-sm text-slate-500 mb-6">
        <Link href="/" className="hover:text-[var(--primary)]">Начало</Link>
        <ChevronRight size={14} className="inline mx-1" />
        <Link href="/products" className="hover:text-[var(--primary)]">Продукти</Link>
        <ChevronRight size={14} className="inline mx-1" />
        <Link href={`/products?category=${product.categorySlug}`} className="hover:text-[var(--primary)]">
          {product.category}
        </Link>
        <ChevronRight size={14} className="inline mx-1" />
        <span className="text-slate-800">{product.name}</span>
      </nav>

      <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
        {/* Images */}
        <div>
          {/* Main image */}
          <div className="aspect-square bg-slate-100 rounded-xl overflow-hidden mb-4 relative">
            {product.images[selectedImage] ? (
              <Image
                src={product.images[selectedImage]}
                alt={product.name}
                width={600}
                height={600}
                className="w-full h-full object-cover"
                priority
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <Package size={120} className="text-slate-300" />
              </div>
            )}

            {/* Sale badge */}
            {discount > 0 && (
              <span className="absolute top-4 left-4 bg-red-500 text-white text-sm font-bold px-3 py-1 rounded">
                -{discount}%
              </span>
            )}
          </div>

          {/* Thumbnails */}
          {product.images.length > 1 && (
            <div className="flex gap-2 overflow-x-auto pb-2">
              {product.images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`w-20 h-20 flex-shrink-0 rounded-lg overflow-hidden border-2 transition-colors ${
                    selectedImage === index
                      ? 'border-[var(--primary)]'
                      : 'border-transparent hover:border-[var(--border)]'
                  }`}
                >
                  <Image
                    src={image}
                    alt={`${product.name} - изглед ${index + 1}`}
                    width={80}
                    height={80}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product info */}
        <div>
          <div className="mb-4">
            <Link
              href={`/products?category=${product.categorySlug}`}
              className="text-sm text-[var(--primary)] hover:underline"
            >
              {product.category}
            </Link>
          </div>

          <h1 className="text-2xl md:text-3xl font-bold text-slate-800 mb-4">
            {product.name}
          </h1>

          {/* Price */}
          <div className="mb-6">
            <div className="flex items-center gap-3">
              <span className="text-3xl font-bold text-[var(--primary)]">
                {product.price.toFixed(2)} лв.
              </span>
              {product.oldPrice && (
                <span className="text-xl text-slate-500 line-through">
                  {product.oldPrice.toFixed(2)} лв.
                </span>
              )}
              {discount > 0 && product.oldPrice && (
                <span className="badge badge-error">Спестявате {(product.oldPrice - product.price).toFixed(2)} лв.</span>
              )}
            </div>
            <div className="text-sm text-slate-500 mt-1">
              {toEur(product.price)} € {product.oldPrice && <span className="line-through">{toEur(product.oldPrice)} €</span>}
            </div>
          </div>


          {/* Quantity & Add to cart */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            {/* Quantity selector */}
            <div className="flex items-center border border-[var(--border)] rounded-lg">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="w-12 h-12 flex items-center justify-center hover:bg-[var(--card-hover)] transition-colors"
              >
                <Minus size={18} />
              </button>
              <span className="w-16 text-center font-medium text-lg">
                {quantity}
              </span>
              <button
                onClick={() => setQuantity(quantity + 1)}
                className="w-12 h-12 flex items-center justify-center hover:bg-[var(--card-hover)] transition-colors"
              >
                <Plus size={18} />
              </button>
            </div>

            {/* Add to cart button */}
            <button
              onClick={handleAddToCart}
              disabled={addedToCart}
              className={`btn btn-lg flex-1 ${
                addedToCart
                  ? 'bg-green-500 text-white'
                  : 'btn-primary'
              }`}
            >
              {addedToCart ? (
                <>
                  <Check size={20} />
                  Добавено!
                </>
              ) : (
                <>
                  <ShoppingCart size={20} />
                  Добави в количката
                </>
              )}
            </button>
          </div>

          {/* Action buttons */}
          <div className="flex gap-4 mb-8">
            <button className="btn btn-ghost text-slate-500">
              <Heart size={20} />
              <span className="hidden sm:inline">Любими</span>
            </button>
            <button className="btn btn-ghost text-slate-500">
              <Share2 size={20} />
              <span className="hidden sm:inline">Сподели</span>
            </button>
          </div>

          {/* Features */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 bg-[var(--card)] rounded-xl border border-[var(--border)]">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-[var(--primary)]/10 rounded-lg flex items-center justify-center">
                <Truck className="text-[var(--primary)]" size={20} />
              </div>
              <div className="text-sm">
                <div className="font-medium">Безплатна доставка</div>
                <div className="text-slate-500">над 100 лв. / {toEur(100)} €</div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-[var(--primary)]/10 rounded-lg flex items-center justify-center">
                <Shield className="text-[var(--primary)]" size={20} />
              </div>
              <div className="text-sm">
                <div className="font-medium">2 години гаранция</div>
                <div className="text-slate-500">пълно покритие</div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-[var(--primary)]/10 rounded-lg flex items-center justify-center">
                <RotateCcw className="text-[var(--primary)]" size={20} />
              </div>
              <div className="text-sm">
                <div className="font-medium">14 дни връщане</div>
                <div className="text-slate-500">без въпроси</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Description */}
      {product.description && (
        <div className="mt-12">
          <h2 className="text-xl font-bold text-slate-800 mb-4">Описание</h2>
          <div
            className="prose prose-slate max-w-none"
            dangerouslySetInnerHTML={{ __html: product.description }}
          />
        </div>
      )}

      {/* Reviews */}
      <Reviews />

      {/* Recently Viewed */}
      <RecentlyViewed currentProductId={product.id} />

      {/* Related products */}
      {relatedProducts.length > 0 && (
        <div className="mt-12">
          <h2 className="text-xl font-bold text-slate-800 mb-6">Свързани продукти</h2>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            {relatedProducts.map((prod) => (
              <ProductCard
                key={prod.id}
                id={prod.id}
                name={prod.name}
                slug={prod.slug}
                price={prod.price}
                oldPrice={prod.oldPrice}
                stock={prod.stock}
                image={prod.image}
                category={prod.category}
                categorySlug={prod.categorySlug}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
