'use client';

import { Package } from 'lucide-react';

export default function AdminOrdersPage() {
  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-[var(--foreground)]">
          Поръчки
        </h1>
        <p className="text-[var(--muted)]">
          Управлявайте поръчките от клиенти
        </p>
      </div>

      {/* Empty state */}
      <div className="card p-12 text-center">
        <Package size={64} className="mx-auto text-slate-300 mb-4" />
        <h2 className="text-xl font-semibold text-[var(--foreground)] mb-2">
          Все още няма поръчки
        </h2>
        <p className="text-[var(--muted)]">
          Когато клиентите направят поръчки, те ще се появят тук.
        </p>
      </div>
    </div>
  );
}
