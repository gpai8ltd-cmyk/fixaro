'use client';

import Link from 'next/link';
import Image from 'next/image';
import {
  ShoppingBag,
  Minus,
  Plus,
  Trash2,
  ArrowRight,
  ArrowLeft,
  Package
} from 'lucide-react';
import { useCart } from '@/store/cart';

export default function CartPage() {
  const { items, removeItem, updateQuantity, subtotal, clearCart } = useCart();
  const total = subtotal();

  const deliveryFee = total >= 100 ? 0 : 6.99;
  const finalTotal = total + deliveryFee;

  if (items.length === 0) {
    return (
      <div className="container-custom py-16">
        <div className="max-w-md mx-auto text-center">
          <ShoppingBag size={80} className="mx-auto text-[var(--muted-light)] mb-6" />
          <h1 className="text-2xl font-bold text-slate-800 mb-2">
            Количката е празна
          </h1>
          <p className="text-slate-500 mb-6">
            Изглежда все още не сте добавили продукти в количката си.
          </p>
          <Link href="/products" className="btn btn-primary btn-lg">
            <ArrowLeft size={20} />
            Към продуктите
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container-custom py-6 md:py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-slate-800">
            Количка
          </h1>
          <p className="text-slate-500">
            {items.length} {items.length === 1 ? 'продукт' : 'продукта'}
          </p>
        </div>
        <button
          onClick={clearCart}
          className="text-sm text-red-500 hover:text-red-600 hover:underline"
        >
          Изчисти количката
        </button>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Cart items */}
        <div className="lg:col-span-2 space-y-4">
          {items.map((item) => (
            <div
              key={item.id}
              className="card p-4 md:p-6 flex gap-4"
            >
              {/* Image */}
              <div className="w-24 h-24 md:w-32 md:h-32 bg-slate-100 rounded-lg overflow-hidden flex-shrink-0">
                {item.image ? (
                  <Image
                    src={item.image}
                    alt={item.name}
                    width={128}
                    height={128}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Package size={40} className="text-slate-300" />
                  </div>
                )}
              </div>

              {/* Details */}
              <div className="flex-1 min-w-0">
                <Link
                  href={`/products/${item.id}`}
                  className="font-medium text-slate-800 hover:text-[var(--primary)] line-clamp-2"
                >
                  {item.name}
                </Link>

                <div className="flex items-center gap-2 mt-2">
                  <span className="text-lg font-bold text-[var(--primary)]">
                    {item.price.toFixed(2)} лв.
                  </span>
                  {item.oldPrice && (
                    <span className="text-sm text-slate-500 line-through">
                      {item.oldPrice.toFixed(2)} лв.
                    </span>
                  )}
                </div>

                {/* Mobile: quantity & remove in one row */}
                <div className="flex items-center justify-between mt-4">
                  {/* Quantity */}
                  <div className="flex items-center border border-[var(--border)] rounded-lg">
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className="w-10 h-10 flex items-center justify-center hover:bg-[var(--card-hover)] transition-colors"
                    >
                      <Minus size={16} />
                    </button>
                    <span className="w-12 text-center font-medium">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="w-10 h-10 flex items-center justify-center hover:bg-[var(--card-hover)] transition-colors"
                    >
                      <Plus size={16} />
                    </button>
                  </div>

                  {/* Subtotal & Remove */}
                  <div className="flex items-center gap-4">
                    <span className="text-lg font-bold text-slate-800 hidden sm:block">
                      {(item.price * item.quantity).toFixed(2)} лв.
                    </span>
                    <button
                      onClick={() => removeItem(item.id)}
                      className="p-2 text-slate-500 hover:text-red-500 transition-colors"
                      aria-label="Премахни"
                    >
                      <Trash2 size={20} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}

          {/* Continue shopping */}
          <Link
            href="/products"
            className="btn btn-ghost text-slate-500 mt-4"
          >
            <ArrowLeft size={18} />
            Продължи пазаруването
          </Link>
        </div>

        {/* Order summary */}
        <div className="lg:col-span-1">
          <div className="card p-6 sticky top-24">
            <h2 className="text-lg font-bold text-slate-800 mb-4">
              Обобщение
            </h2>

            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-slate-500">Междинна сума</span>
                <span className="font-medium">{total.toFixed(2)} лв.</span>
              </div>

              <div className="flex justify-between">
                <span className="text-slate-500">Доставка</span>
                <span className="font-medium">
                  {deliveryFee === 0 ? (
                    <span className="text-green-600">Безплатна</span>
                  ) : (
                    `${deliveryFee.toFixed(2)} лв.`
                  )}
                </span>
              </div>

              {total < 100 && (
                <div className="p-3 bg-amber-50 text-amber-800 rounded-lg text-sm">
                  Добавете още <strong>{(100 - total).toFixed(2)} лв.</strong> за безплатна доставка!
                </div>
              )}

              <hr className="border-[var(--border)]" />

              <div className="flex justify-between text-lg">
                <span className="font-bold">Общо</span>
                <span className="font-bold text-[var(--primary)]">
                  {finalTotal.toFixed(2)} лв.
                </span>
              </div>
            </div>

            <Link
              href="/checkout"
              className="btn btn-primary btn-lg w-full mt-6"
            >
              Продължи към поръчка
              <ArrowRight size={20} />
            </Link>

            <p className="text-xs text-slate-500 text-center mt-4">
              Плащане при доставка (наложен платеж)
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
