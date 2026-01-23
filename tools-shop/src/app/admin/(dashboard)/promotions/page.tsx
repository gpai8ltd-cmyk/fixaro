'use client';

import { Tag } from 'lucide-react';

export default function AdminPromotionsPage() {
  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-[var(--foreground)]">
          Промоции
        </h1>
        <p className="text-[var(--muted)]">
          Управлявайте намаленията на продуктите
        </p>
      </div>

      {/* Empty state */}
      <div className="card p-12 text-center">
        <Tag size={64} className="mx-auto text-slate-300 mb-4" />
        <h2 className="text-xl font-semibold text-[var(--foreground)] mb-2">
          Все още няма промоции
        </h2>
        <p className="text-[var(--muted)]">
          Тук ще можете да създавате промоции за продуктите.
        </p>
      </div>
    </div>
  );
}
