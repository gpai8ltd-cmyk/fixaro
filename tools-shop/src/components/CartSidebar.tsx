'use client';

import { X, Minus, Plus, ShoppingBag, Trash2 } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useCart } from '@/store/cart';

export default function CartSidebar() {
  const { items, isOpen, closeCart, removeItem, updateQuantity, subtotal } = useCart();
  const total = subtotal();

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
      aria-labelledby="cart-title"
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={closeCart}
        aria-hidden="true"
      />

      {/* Sidebar */}
      <div className="absolute right-0 top-0 bottom-0 w-full max-w-md bg-[var(--background)] shadow-2xl flex flex-col animate-in slide-in-from-right duration-300 ease-out">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-[var(--border)]">
          <h2 id="cart-title" className="text-lg font-bold flex items-center gap-2">
            <ShoppingBag size={20} className="text-[var(--primary)]" aria-hidden="true" />
            Количка
            {items.length > 0 && (
              <span className="text-sm font-normal text-[var(--muted)]">
                ({items.length} {items.length === 1 ? 'продукт' : 'продукта'})
              </span>
            )}
          </h2>
          <button
            onClick={closeCart}
            className="p-2 text-[var(--foreground)] hover:text-[var(--primary)] transition-colors"
            aria-label="Затвори количката"
          >
            <X size={24} aria-hidden="true" />
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto p-4">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <ShoppingBag size={64} className="text-[var(--muted-light)] mb-4" aria-hidden="true" />
              <p className="text-lg font-medium text-[var(--foreground)]">Количката е празна</p>
              <p className="text-[var(--muted)] mt-1">Добавете продукти, за да продължите</p>
              <button
                onClick={closeCart}
                className="btn btn-primary mt-6"
              >
                Продължи пазаруването
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="flex gap-4 p-3 bg-[var(--card)] rounded-lg border border-[var(--border)]"
                >
                  {/* Image */}
                  <div className="w-20 h-20 bg-slate-100 rounded-lg overflow-hidden flex-shrink-0">
                    {item.image ? (
                      <Image
                        src={item.image}
                        alt={item.name}
                        width={80}
                        height={80}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-[var(--muted-light)]">
                        <ShoppingBag size={32} aria-hidden="true" />
                      </div>
                    )}
                  </div>

                  {/* Details */}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-[var(--foreground)] truncate">
                      {item.name}
                    </h3>

                    <div className="flex items-center gap-2 mt-1">
                      <span className="price-current text-base">
                        {item.price.toFixed(2)} лв.
                      </span>
                      {item.oldPrice && (
                        <span className="price-old text-xs">
                          {item.oldPrice.toFixed(2)} лв.
                        </span>
                      )}
                    </div>

                    {/* Quantity controls */}
                    <div className="flex items-center justify-between mt-2">
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="w-8 h-8 flex items-center justify-center rounded-lg border border-[var(--border)] hover:border-[var(--primary)] hover:text-[var(--primary)] transition-colors"
                          aria-label={`Намали количеството на ${item.name}`}
                        >
                          <Minus size={16} aria-hidden="true" />
                        </button>
                        <span className="w-10 text-center font-medium" aria-label={`Количество: ${item.quantity}`}>
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="w-8 h-8 flex items-center justify-center rounded-lg border border-[var(--border)] hover:border-[var(--primary)] hover:text-[var(--primary)] transition-colors"
                          aria-label={`Увеличи количеството на ${item.name}`}
                        >
                          <Plus size={16} aria-hidden="true" />
                        </button>
                      </div>

                      <button
                        onClick={() => removeItem(item.id)}
                        className="p-2 text-[var(--muted)] hover:text-red-500 transition-colors"
                        aria-label={`Премахни ${item.name} от количката`}
                      >
                        <Trash2 size={18} aria-hidden="true" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="border-t border-[var(--border)] p-4 space-y-4 bg-[var(--card)]">
            <div className="flex justify-between items-center">
              <span className="text-[var(--muted)]">Междинна сума:</span>
              <span className="text-xl font-bold text-[var(--foreground)]">
                {total.toFixed(2)} лв.
              </span>
            </div>

            <p className="text-sm text-[var(--muted)]">
              Доставката се изчислява при завършване на поръчката
            </p>

            <div className="grid gap-2">
              <Link
                href="/checkout"
                onClick={closeCart}
                className="btn btn-primary btn-lg w-full"
              >
                Към плащане
              </Link>
              <button
                onClick={closeCart}
                className="btn btn-ghost w-full text-[var(--muted)]"
              >
                Продължи пазаруването
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
